import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import { Link } from "react-router-dom";
import './Account.css';
import { Button, IconButto, Checkbox, FormControlLabel, FormControl, CircularProgress } from '@material-ui/core';
import { FaPaw, FaTruck, FaCreditCard, FaBabyCarriage, FaToilet, FaAccessibleIcon, FaChair, FaBicycle, FaCar, FaTv,  } from 'react-icons/fa';
import { FiWifi, FiSun,  FiLock, FiHome } from 'react-icons/fi';
import { RiWifiFill, RiMotorbikeFill } from 'react-icons/ri';
import { MdRestaurant, MdRestaurantMenu } from 'react-icons/md';
import { BiCalendarCheck, BiVolumeMute, BiHome } from 'react-icons/bi';
import { AiOutlineShopping } from 'react-icons/ai';
import { BsMusicNote } from 'react-icons/bs';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { useDataContext } from '../Global/GlobalContext';
import authService from '../api-authorization/AuthorizeService';
import { GetApi, PostApi } from '../../api/ApiConstants';

export default function Synopsis(props) {


    const { dcReducer } = useDataContext();
    const [user, setUser] = useState(null);
    const [amenities, setAmenities] = useState(null);
    const [ready, setReady] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        dcReducer({ type: 'navigate-account', data: { activeAccountLink: 'synopsis' } });

        authService.getUser().then(res => {

            if (res !== null && res !== undefined) {

                authService.getAccessToken().then(token => {

                    fetch(`${GetApi.GetUsersAmenities}/${res.sub}`, {
                        method: 'GET',
                        headers: !token ? {} : { 'Authorization': `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json', },
                        mode: 'cors',
                        cache: 'default',
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data != null && data != undefined) {
                                setUser(data.userId);
                                setAmenities(data.services);

                                setReady(true);
                            }
                        });


                });

            }

        });

    }, []);

    function getIcon(amenitieId) {

        var element = <FaTruck />;
        icons.map((icon, i) => {

            if (icon.id === amenitieId) {
                element = icon.component;
            }
        });

        return element;

    }

    function sendData() {

        setLoading(true);

        authService.getUser().then(res => {

            if (res !== null && res !== undefined) {

                const data = {
                    userId: res.sub,
                    services: amenities,
                };

                authService.getAccessToken().then(token => {
                    fetch(PostApi.PostUsersAmenities, {
                        method: 'POST',
                        headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify(data),
                    })
                        .then(response => {
                            if (response.status === 200) {
                                setLoading(false);
                                props.openSuccess();
                            }
                            else {
                                setLoading(false);
                                props.openFailed();
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                });
            }
        });
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-12'>
                    <h4 className='account-hint-title' >Synopsis de votre business.</h4>
                    <p className='account-hint'>*Cochez toutes les cases qui correspondantent au règlement de votre entreprise.</p>
                </div>
                {
                    !ready ? (<></>) :

                        amenities.map((am, i) => (
                            <div className='col-12 col-md-6' key={i}>
                    <br />
                    <FormControl>
                        <FormControlLabel
                            control={
                                <Checkbox
                                   checked={am.checked}
                                    onChange={(e) => {
                                        amenities.forEach((a, i) => {
                                           
                                            if (a.amenitieId == am.amenitieId) {
                                                let items = [...amenities];
                                                let item = { ...items[i] };
                                                item.checked = e.target.checked;
                                                items[i] = item;
                                                setAmenities(items);
                                            }
                                        });
                                     }}
                                       color="secondary"
                                      />}
                           label={<span style={{ fontSize: 15 }} ><span className='synopsys-icon' >{getIcon(am.amenitieId)}</span>{am.name}</span>}
                        />
                    </FormControl>
                    <br />
                </div>

            ))}
                {loading ? !ready ? (<></>) : (<Button variant="contained" className='account-btn-loading'>< h5 className='text-center'><CircularProgress size={24} style={{ color: `#fff`, marginTop: `8px` }} /></h5></Button>)
                    :
                    !ready ? (<></>) : (<div className='col-12'>
                        <Button variant="contained" className='account-btn' onClick={() => {sendData();}}>
                            Sauvegarder
                    </Button>
                    </div>)}
               
            </div>
          </div>);
}

const icons = [
    {
        id:20,
        name: 'home-service',
        component: <BiHome />
    },
    {
        id: 5,
        name: 'reservations',
        component: <BiCalendarCheck />
    },
    {
        id: 13,
        name: 'disabled-people',
        component: <FaAccessibleIcon />
    },
    {
        id: 7,
        name: 'toilets',
        component: <FaToilet />
    },
    {
        id: 18,
        name: 'kids-friendly',
        component: <FaBabyCarriage />
    },
    {
        id: 6,
        name: 'has-tv',
        component: <FaTv />
    },
    {
        id: 4,
        name: 'outdoor',
        component: <FiSun />
    },
    {
        id: 10,
        name: 'credit-card',
        component: <FaCreditCard />
    },
    {
        id: 2,
        name: 'free-wifi',
        component: <RiWifiFill />
    },
    {
        id: 17,
        name: 'pets-friendly',
        component: <FaPaw />
    },
    {
        id: 8,
        name: 'vegan-menu',
        component: <MdRestaurant />
    },
    {
        id: 11,
        name: '2-wheels-parking',
        component: <RiMotorbikeFill />
    },
    {
        id: 9,
        name: 'waiter-service',
        component: <MdRestaurantMenu />
    },
    {
        id: 19,
        name: 'high-safety',
        component: <FiLock />
    },
    {
        id: 14,
        name: 'calm-place',
        component: <BiVolumeMute />
    },
    {
        id: 3,
        name: 'take-away',
        component: <HiOutlineShoppingBag />
    },
    {
        id: 16,
        name: 'seats',
        component: <FaChair />
    },
    {
        id: 15,
        name: 'ambiant-music',
        component: <BsMusicNote />
    },
    {
        id: 12,
        name: '4-wheels-parking',
        component: <FaCar />
    },
    {
        id: 1,
        name: 'home-delivery',
        component: <FaTruck />
    },
];