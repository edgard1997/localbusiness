import React, { useState, Fragment, Component, useEffect } from "react";
import { Container } from "reactstrap";
import { Link, useParams } from "react-router-dom";
import { Button, IconButton, Icon, Avatar, Badge } from "@material-ui/core";
import { GrFormDown, GrCheckboxSelected } from "react-icons/gr";
import { FiLogOut, FiBell, FiUser, FiStar, FiSearch } from "react-icons/fi";
import { BsSearch, BsBuilding } from "react-icons/bs";
import "./MobileSearch.css";
import { CitiesModal, CategoriesModal } from "./Home";
import Autosuggest from "react-autosuggest";
import { BiHome, BiShoppingBag } from "react-icons/bi";
import { ImLocation } from "react-icons/im";
import { GetApi, baseUrl } from "../api/ApiConstants";
import { useDataContext } from "./Global/GlobalContext";
import { GoLaw } from "react-icons/go";
import { BsPentagonHalf } from "react-icons/bs";
import { FiChevronDown, FiTv, FiLock, FiShoppingBag } from "react-icons/fi";
import { RiShirtLine, RiFridgeLine, RiRuler2Line } from "react-icons/ri";
import { GiBrickWall, GiHealthNormal, GiHomeGarage, GiTap, GiLipstick, GiShoppingCart } from "react-icons/gi";
import { ImLab, ImTruck, ImKey } from "react-icons/im";
import { AiFillCar, AiOutlineHome } from "react-icons/ai";
import { MdComputer, MdPhonelinkSetup, MdBuild, MdKeyboardVoice, MdRestaurant } from "react-icons/md";
import { BiBuildingHouse, BiCalendarStar, BiBasketball, BiCodeAlt, BiMaleSign, BiFemaleSign } from "react-icons/bi";
import { CgGirl } from "react-icons/cg";
import { FcBriefcase } from "react-icons/fc";
import { FaRegMoneyBillAlt, FaBullhorn, FaRegStar, FaPaw, FaTooth, FaIceCream, FaTshirt, FaPlaneDeparture, FaBone, FaBook, FaCut, FaShoePrints, FaBaby, FaBriefcaseMedical, FaGraduationCap, FaChair, FaRegLightbulb, FaCocktail, FaVolleyballBall } from "react-icons/fa";
import { Rating } from "@material-ui/lab";

export default function MobileSearch() {


    const { dcReducer, dataContext } = useDataContext();
    const { city } = useParams();
    const [coords, setCoords] = useState({lat:0, long:0});

    useEffect(() => {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getCoords);
        }
        else {
            getDefaultCoords();
        }
    }, []);

    function setLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getCoords);
        }
        else {
            getDefaultCoords();
        }

    }

    function getCoords(position) {

        //dcReducer({ type: "set-coordinates", data: { lat: position.coords.latitude, long: position.coords.longitude } });
        setCoords({ lat: position.coords.latitude, long: position.coords.longitude });
        console.log(position);
    }

    const getDefaultCoords = async () => {

        const result = await fetch("//freegeoip.app/json/");
        const json = await result.json();
       // dcReducer({ type: "set-default-coordinates", data: { lat: json.latitude, long: json.longitude } });
        setCoords({ lat: json.latitude, long: json.longitude });
    }

    function renderSuggestion(suggestion, { query }) {

        return (
            <>
                <div className='col-12 col-sm-12 col-md-12 item-search-container-2'>
                    <Link to={`/biz/${city}/${suggestion.id}`}>
                    <h5 >{suggestion.businessName}</h5>
                    <div className='item-search-1' style={{ 'backgroundImage': `url(${suggestion.urlsPictures[0]})` }} >
                    </div>
                    <div className='row'>
                        <div className='col-3 col-sm-4 col-md-2 col-lg-4'>
                            <Rating
                                name="read-only"
                                value={suggestion.rating}
                                precision={0.5}
                                readOnly
                                className='biz-hightlight-rating-1'
                            />
                        </div>
                        <div className='col-3 col-sm-2'>
                            <span className='biz-hightlight-reviews-2' >{suggestion.reviewsCount}</span>
                        </div>
                        <div className='col-12'>
                            <ImLocation className="street-location-icon" />
                            <span className='street-location'>{suggestion.location}</span>
                        </div>

                    </div>
</Link>
                </div> 
            </>
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
            var url = `${domain}/recherche/${city}/0/0/${encodeURIComponent(text)}`;
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

            fetch(`${GetApi.GetSuggestions}/${value}/${coords.lat}/${coords.long}/${city}`, {
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
            <div className='row justify-content-center' >
                <div className='col-10 col-sm-7 search_bar_container'>
                    <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={onSuggestionsClearRequested}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        inputProps={inputProps}

                    />
                </div>
                <div className='col-2'>
                    <Button type="submit" variant="contained"
                        onClick={() => { clickSearchButton(value); }}
                        className="btn_search" >
                        <FiSearch className='search_icon' />
                    </Button>
                </div>
            </div>
        );
    }


    return (
        <div className='container-fluid search_container'>
            <Search></Search>
            <div className='container-fluid'>
              
                <div className='row more-businesses-row' >
                    <div className='col-12'>
                        <br />
                        <br />
                        <h5 className='all-cat-title' >Toutes les categories</h5>
                        <br />
                    </div>
                    <div className='col-12 col-md-4 col-lg-3'>
                        <span><a href={`/recherche/${city}/1/0/default`} ><MdRestaurant className='business-icon biz-icon-1' /> Restaurants & Fast-food</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/2/0/default`} ><BiShoppingBag className='business-icon biz-icon-2' /> Shopping</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/3/0/default`} ><GiShoppingCart className='business-icon biz-icon-3' /> Épiceries</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/4/0/default`} ><FaCocktail className='business-icon biz-icon-4' /> Snack-Bar & Boîtes de nuit</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/5/0/default`} ><BsBuilding className='business-icon biz-icon-5' /> Hôtels & Appartements</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/6/0/default`} ><FaVolleyballBall className='business-icon biz-icon-6' /> Art & Divertissement</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/8/0/default`} ><AiFillCar className='business-icon biz-icon-7' /> Mécano-automobile</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/11/0/default`}><BiFemaleSign className='business-icon biz-icon-8' /> Salons de beauté (Femmes)</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/12/0/default`} ><FaCut className='business-icon biz-icon-9' /> Salons de beauté (Mixte)</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/10/0/default`} ><BiMaleSign className='business-icon biz-icon-10' /> Salons de coiffure (Hommes)</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/13/0/default`} ><FaBook className='business-icon biz-icon-1' /> Collèges et lycées</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/14/0/default`} ><FaIceCream className='business-icon biz-icon-2' /> Boulangeries & Patisseries</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/24/0/default`} ><FaGraduationCap className='business-icon biz-icon-3' /> Formations professionnelles</a></span>
                        <br />
                        <br />
                    </div>
                    <div className='col-12 col-md-4 col-lg-3'>
                        <span><a href={`/recherche/${city}/25/0/default`} ><FiShoppingBag className='business-icon biz-icon-4' /> Petites & Grandes surfaces</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/21/0/default`} ><GoLaw className='business-icon biz-icon-5' /> Cabinets d'avocats</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/27/0/default`} ><BiBasketball className='business-icon biz-icon-6' /> Fitness-Club</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/26/0/default`} ><FaPaw className='business-icon biz-icon-7' /> Vétérinaires</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/28/0/default`} ><GiHealthNormal className='business-icon biz-icon-8' /> Hôpitaux & Cliniques</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/29/0/default`} ><ImLab className='business-icon biz-icon-9' /> Laboratoires LAM</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/30/0/default`} ><FaTooth className='business-icon biz-icon-10' /> Dentistes</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/31/0/default`} ><CgGirl className='business-icon biz-icon-1' /> Soins de beauté & Spa</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/7/0/default`} ><FaRegStar className='business-icon biz-icon-2' /> Salles de fête</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/9/0/default`} ><GiHealthNormal className='business-icon biz-icon-3' /> Pharmacies</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/32/0/default`} ><FaBriefcaseMedical className='business-icon biz-icon-4' /> Cabinets médicaux</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/33/0/default`} ><FaRegMoneyBillAlt className='business-icon biz-icon-5' /> Transfert d'argent</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/23/0/default`} ><RiRuler2Line className='business-icon biz-icon-6' /> Cabinets de topographie</a></span>
                        <br />
                        <br />
                    </div>
                    <div className='col-12 col-md-4 col-lg-3'>
                        <span><a href={`/recherche/${city}/15/0/default`} ><FaTshirt className='business-icon biz-icon-7' /> Pressing / Nettoyage à sec</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/16/0/default`} ><FaBaby className='business-icon biz-icon-8' /> Crèches et Maternelles</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/17/0/default`} ><FaPlaneDeparture className='business-icon biz-icon-9' /> Agences de voyage</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/34/0/default`} ><MdBuild className='business-icon biz-icon-10' /> Quincailleries</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/35/0/default`} ><FaChair className='business-icon biz-icon-1' /> Menuisieries</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/36/0/default`} ><GiTap className='business-icon biz-icon-2' /> Plomberies</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/37/0/default`} ><ImTruck className='business-icon biz-icon-3' /> Vidanges</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/38/0/default`} ><BiBuildingHouse className='business-icon biz-icon-4' /> Agences immobilières</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/39/0/default`} ><AiOutlineHome className='business-icon biz-icon-5' /> Vente & Location de maisons</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/40/0/default`} ><ImKey className='business-icon biz-icon-6' /> Serruriers</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/41/0/default`} ><GiBrickWall className='business-icon biz-icon-7' /> Briqueteries</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/20/0/default`} ><BsPentagonHalf className='business-icon biz-icon-8' /> Graphistes 2D/3D & Logos</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/50/0/default`} ><FaBullhorn className='business-icon biz-icon-9' /> Experts en Marketing</a></span>
                        <br />
                        <br />
                    </div>
                    <div className='col-12 col-md-4 col-lg-3'>
                        <span><a href={`/recherche/${city}/19/0/default`} ><BiCodeAlt className='business-icon biz-icon-10' /> Développeurs Web & Mobile</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/48/0/default`} ><AiFillCar className='business-icon biz-icon-1' /> Lavage auto</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/49/0/default`} ><BiCalendarStar className='business-icon biz-icon-2' /> Événements</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/42/0/default`} ><FaRegLightbulb className='business-icon biz-icon-3' /> Électriciens</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/43/0/default`} ><RiFridgeLine className='business-icon biz-icon-4' /> Froid & Climatisation</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/44/0/default`} ><FiTv className='business-icon biz-icon-5' /> Réparateurs de TV</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/45/0/default`} ><MdComputer className='business-icon biz-icon-6' /> Réparateurs Informatique</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/46/0/default`} ><MdPhonelinkSetup className='business-icon biz-icon-7' /> Reparateurs Smartphones</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/47/0/default`} ><FaShoePrints className='business-icon biz-icon-8' /> Cordonneries</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/18/0/default`} ><GiLipstick className='business-icon biz-icon-9' /> Artistes Make-Up</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/22/0/default`} ><MdKeyboardVoice className='business-icon biz-icon-10' /> Beatmaking & enregistrement</a></span>
                        <br />
                        <br />
                        <span><a href={`/recherche/${city}/51/0/default`} ><GrCheckboxSelected className='business-icon biz-icon-2' /> Manutention</a></span>
                        <br />
                        <br />
                    </div>
                    </div>
                </div>
        </div>
        );
}