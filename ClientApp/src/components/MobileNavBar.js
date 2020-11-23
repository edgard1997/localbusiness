import React, { Component, useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import './MobileNavbar.css';
import { Link, useParams } from 'react-router-dom';
import Footer from './Footer';
import authService from './api-authorization/AuthorizeService';
import { FiLogIn, FiStar, FiUser, FiSearch, FiHome, FiLogOut, FiSettings } from 'react-icons/fi';
import { IconButton } from '@material-ui/core';
import { ImLocation, ImHome } from 'react-icons/im';
import { RiStore2Line } from 'react-icons/ri';
import { useDataContext } from './Global/GlobalContext';
import { ApplicationPaths } from './api-authorization/ApiAuthorizationConstants';

export default function MobileNavbar() {

    const { city } = useParams();
    const urlPath = window.location.pathname;
    const { dcReducer, dataContext } = useDataContext();
    const [profile, setProfile] = useState(null);
    const logoutPath = { pathname: `${ApplicationPaths.LogOut}`, state: { local: true } };
    const [u_city, setUserCity] = useState(city);
    useEffect(() => {

        authService.getUser().then(res => {
            if (res !== null && res !== undefined) {

                setProfile(res);
                setUserCity(res.city.toLowerCase());
            }
           
        });

    }, []);


    function AuthenticatedView() {
       
        return (
            <div className='row justify-content-start'>
                <div className='col-2'>
                    <Link to={`/location/${u_city}`}>
                        <IconButton className={urlPath.includes('location') ? `active-appbar-icon` : `appbar-icon`}  >
                            <ImHome  />
                        </IconButton>
                    </Link>
                </div>
                <div className='col-2'>
                    <Link to={`/search/${u_city}`}>
                        <IconButton className={urlPath.includes('search') || urlPath.includes('recherche') || urlPath.includes('biz') ? `active-appbar-icon` : `appbar-icon`} >
                            <FiSearch />
                        </IconButton>
                    </Link>
                </div>
                <div className='col-2'>
                    <Link to={`/activite/${u_city}`}>
                        <IconButton className={urlPath.includes('activite') ? `active-appbar-icon` : `appbar-icon`} >
                            <ImLocation />
                        </IconButton>
                    </Link>
                </div>
                {
                    profile != null ? profile.role === 1 ? null : <div className='col-2'>
                        <Link to='/partenaire/dashboard'>
                            <IconButton className={urlPath.includes('dashboard') ? `active-appbar-icon` : `appbar-icon`}  >
                                <RiStore2Line />
                            </IconButton>
                        </Link>
                    </div> : null
                }
                <div className='col-2'>
                    <Link to='/user/compte' >
                        <IconButton className={urlPath.includes('user') ? `active-appbar-icon` : `appbar-icon`}  >
                            <FiSettings />
                        </IconButton>
                    </Link>
                </div>
                <div className='col-2'>
                    <Link to={logoutPath}>
                        <IconButton className={urlPath.includes('authentication') ? `active-appbar-icon` : `appbar-icon`} >
                            <FiLogOut />
                         </IconButton>
                    </Link>
                </div>

            </div>
        );
    }

   function AnonymousView() {

        return (
                <div className='row justify-content-start'>
                    <div className='col-2'>
                    <Link to={`/location/${city}`}>
                        <IconButton className={urlPath.includes('location') ? `active-appbar-icon` : `appbar-icon`} >
                                <ImHome />
                            </IconButton>
                        </Link>
                    </div>
                    <div className='col-2'>
                        <Link to={`/search/${city}`}>
                        <IconButton className={urlPath.includes('search') || urlPath.includes('recherche') || urlPath.includes('biz') ? `active-appbar-icon` : `appbar-icon`} >
                                <FiSearch />
                            </IconButton>
                        </Link>
                    </div>
                    <div className='col-2'>
                    <Link to={`/activite/${city}`}>
                        <IconButton className={urlPath.includes('activite') ? `active-appbar-icon` : `appbar-icon`} >
                                <ImLocation />
                            </IconButton>
                        </Link>
                    </div>
                    <div className='col-2'>
                        <Link to={`/partenariat/${city}`}>
                        <IconButton className="appbar-icon" >
                                <RiStore2Line />
                            </IconButton>
                        </Link>
                    </div>
                    <div className='col-2'>
                        <Link to={`/inscription/${city}`} >
                            <IconButton className="appbar-icon"  >
                                <FiUser />
                            </IconButton>
                        </Link>
                    </div>
                    <div className='col-2'>
                        <Link to={'/authentication/login'}>
                        <IconButton className={urlPath.includes('authentication') ? `active-appbar-icon` : `appbar-icon`} >
                                <FiLogIn />
                            </IconButton>
                        </Link>
                    </div>

                </div>
        );
    }


    return (
        <div className='mobile-appbar'>
            <div className='container'>
                {
                    profile === null ?
                        <AnonymousView /> :
                        <AuthenticatedView />
                }
            </div>
            </div>
        );
  
}
