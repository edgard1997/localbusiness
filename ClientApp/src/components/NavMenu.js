import React, { useState, Fragment, Component, useEffect } from "react";
import { Container } from "reactstrap";
import { Link, useParams } from "react-router-dom";
import { LoginMenu } from "./api-authorization/LoginMenu";
import "./NavMenu.css";
import { Button, IconButton, Icon, Avatar, Badge } from "@material-ui/core";
import { GrFormDown } from "react-icons/gr";
import { FiLogOut, FiBell, FiUser, FiStar } from "react-icons/fi";
import { BsSearch } from "react-icons/bs";
import "./NavMenu.css";
import { CitiesModal, CategoriesModal } from "../components/Acceuil";
import Autosuggest from "react-autosuggest";
import yaillo from "../images/yaillo.png";
import { BiHome } from "react-icons/bi";
import { ImLocation } from "react-icons/im";
import { GetApi, baseUrl } from "../api/ApiConstants";
import { useDataContext } from "./Global/GlobalContext";
import authService from "./api-authorization/AuthorizeService";


export default function NavMenu() {

    const { dcReducer, dataContext } = useDataContext();
    const { city } = useParams();
    const [displaySub, setDisplaySub] = useState(false);
    const [index, setIndex] = useState(0);
    const [modalCities, setModalCities] = useState(false);
    const [modalCategories, setModalCategories] = useState(false);
    const toggleCities = () => {
        setModalCities(!modalCities);
    };
    const toggleCategories = () => {
        setModalCategories(!modalCategories);
    };

    const [picked_city, setCity] = useState(city);

    useEffect(() => {
        authService.getUser().then(res => {

            if (res !== null && res !== undefined) {

                setCity(res.city.toLowerCase());
            }
            if (city !== null && city !== undefined) {

                setCity(city);
            }
             
        });

    }, []);


    function renderSuggestion(suggestion, { query }) {


        return (
                <div className='lg-suggestions' >
                <a href={`/biz/${picked_city}/${suggestion.id}`}>
                        <span className="row">
                            <div className='col-4'>
                                <div className='suggestion-img' style={{ backgroundImage: `url(${suggestion.urlsPictures[0]})` }} ></div>
                            </div>
                            <div className='col-8' >
                                <span className={`suggestion-text highlight`} >{suggestion.businessName}</span>
                                <br />
                                <span className='business-suggestion-location'>{suggestion.location}</span>
                            </div>
                        </span>
                    </a>
                </div>
        );
    }



    function Search() {

        const [suggestions, setSuggestions] = useState([]);
        const [value, setValue] = useState('');
        const onChange = (event, { newValue, method }) => {
            setValue(newValue);
        };

        const onSuggestionsFetchRequested = ({ value }) => {

            getSuggestions(value);

        };

        const onSuggestionsClearRequested = () => {
            setSuggestions([]);
        };

        function clickSearchButton(text) {
            var domain = baseUrl;
            var url = `${domain}/recherche/${picked_city}/0/0/${encodeURIComponent(text)}`;
            window.location.href = url;
        }


        function escapeRegexCharacters(str) {
            return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        function getSuggestions(value) {
            const escapedValue = escapeRegexCharacters(value.trim());

            if (escapedValue === '') {
                return [];
            }

            fetch(`${GetApi.GetSuggestions}/${value}/${dataContext.lat}/${dataContext.long}/${picked_city}`, {
                method: 'GET',
                headers: { Accept: 'application/json', 'Content-Type': 'application/json', },
                mode: 'cors',
                cache: 'default',
            })
                .then(response => response.json())
                .then(res => {
                    setSuggestions(res.items);
                    //console.log(res.items);
                }).catch(error => console.log(error));
         
        }

        function getSuggestionValue(suggestion) {
            return `${suggestion.businessName}`;
        }

        const inputProps = {
            placeholder: "restaurant, plombier, mecano",
            value,
            onChange: onChange
        };

        return (
            <div className='row' >
                    <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={onSuggestionsClearRequested}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        inputProps={inputProps}

                    />

                    <Button type="submit" variant="contained"
                        onClick={() => { clickSearchButton(value); }}
                        className="btn-search" >
                        <BsSearch className="search-icon" />
                    </Button>
            </div>
        );
    }

  const [windowsWidth, setWidth]  = useState(window.innerWidth);

  return (
    <header className="navbar-header">
          <div className="lg-nav container-fluid">
        <div className="row justify-content-between">
                      <div className="col-md-2">
                          <a href="/">
                              <div className='logo-background' title='Yaillo !' style={{ backgroundImage: `url(${yaillo})` }} >
                              </div>
                          </a>
                      </div>
                      <div className="col-md-4" >
                          <Search ></Search>
                      </div>
                      <div className="col-md-6"  >
                          <LoginMenu city={city} toggleCategories={toggleCategories} toggleCities={toggleCities} />
                      </div>
              </div>
          </div>
          <div className="md-nav container-fluid">
          <div className="row justify-content-between">
                  <div className="col-1 col-sm-2 logo-background-container">
                  <Link to="/">
                      <div className='logo-background' title='Yaillo !' style={{ backgroundImage: `url(${yaillo})` }} >
                      </div>
                  </Link>
                  </div>
                  <div className="col-10 col-md-8 col-lg-7"   >
                  <LoginMenu city={city} toggleCategories={toggleCategories} toggleCities={toggleCities} />
                  </div>
              </div>
              <div className="row md-search-row">
                  <div className="col-12">
                  <Search ></Search>
               </div>
                </div>
              </div>
          <CitiesModal closeModal={toggleCities} modal={modalCities} toggle={toggleCities}  />
          <CategoriesModal closeModal={toggleCategories} modal={modalCategories} toggle={toggleCategories}  />
    </header>
  );
}
            
