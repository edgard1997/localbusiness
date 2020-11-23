import React, { useState, useEffect} from 'react';
import { Container, Modal, ModalBody } from 'reactstrap';
import { BrowserRouter as Router, Switch, Route, useRouteMatch, Link } from "react-router-dom";
import './Profile.css';
import Insight from '../Partner/Insight/Insight';
import Reviews from '../Partner/Reviews/Reviews';
import Gallery from '../Partner/Gallery/Gallery';
import { Button } from '@material-ui/core';
import Events from '../Partner/Events/Events';
import { FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import authService from '../api-authorization/AuthorizeService';
import { useDataContext } from '../Global/GlobalContext';

export default function PartnerProfile() {

    let { path } = useRouteMatch();
    const [succeed, setSuccessModal] = useState(false);
    const [failed, setFailModal] = useState(false);
    const { dataContext, dcReducer } = useDataContext();
    const toggleSucceed = () => setSuccessModal(!succeed);
    const toggleFailed = () => setFailModal(!failed);
    const [profile, setProfile] = useState(null);

    useEffect(() => {

        authService.getAccessToken().then(token => {
            if (token === null || token === undefined) {
                authService.signIn(window.location.href);
            }

            return;
        });

        authService.getUser().then(res => {

            setProfile(res);
        });

        setLocation();


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

        dcReducer({ type: "set-coordinates", data: { lat: position.coords.latitude, long: position.coords.longitude } });
    }

    const getDefaultCoords = async () => {

        const result = await fetch("//freegeoip.app/json/");
        const json = await result.json();
        dcReducer({ type: "set-default-coordinates", data: { lat: json.latitude, long: json.longitude } });
    }


    function Navigation() {

        return profile === null || profile === undefined ? null : <div className='row panel-navigation-wrapper'>
            <div className='col-12'>
                <div className='row justify-content-between'>
                    <div className='col-12 col-lg-6'>
                        <h4 className='hello-user'>Salut {profile.given_name}!</h4>
                        <p className='account-hint' >Gérez votre page sagement, ne partagez pas votre mot de passe avec quelqu'un.</p>
                    </div>
                </div>
            </div>
            <div className='col-12 panel-navigation'>
                <span className={dataContext.activeAccountLink === 'insight' ? `panel-item active-panel` : `panel-item`}>
                    <Link className={dataContext.activeAccountLink === 'insight' ? `panel-navigation-link active-link` : `panel-navigation-link`} to={path}>Insight</Link>
                </span>
                <span className={dataContext.activeAccountLink === 'gallery' ? `panel-item active-panel` : `panel-item`}>
                    <Link className={dataContext.activeAccountLink === 'gallery' ? `panel-navigation-link active-link` : `panel-navigation-link`} to={`${path}/album`} >Album</Link>
                </span>
            </div>
        </div> ;
    }

    return (
        <div className='container'>
            <Navigation />
            <div className='row'>
                <div className='col-12'>
                    <Switch>
                        <Route exact path={path} >
                            <Insight />
                        </Route>
                        <Route path={`${path}/album`}>
                            <Gallery openSuccess={toggleSucceed} openFailed={toggleFailed} />
                        </Route>
                    </Switch>
                </div>
            </div>
            <Modal isOpen={succeed} fade={false} toggle={toggleSucceed} className='modal-success'>
                <ModalBody>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12'>
                                <h4 className='text-center'><FiCheckCircle className='modal-state-icon-succeed' /></h4>
                                <h4 className='text-center modal-state-txt'>Opération réussie !</h4>
                                <h4 className='text-center'><Button color="default" variant="contained" onClick={toggleSucceed} className='modal-state-btn-close'>Ok, j'ai compris</Button></h4>
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
            <Modal isOpen={failed} fade={false} toggle={toggleFailed} className='modal-failed'>
                <ModalBody>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12'>
                                <h4 className='text-center'><FiAlertTriangle className='modal-state-icon-failed' /></h4>
                                <h4 className='text-center modal-state-txt'>Oops ! Opération échouée.</h4>
                                <h4 className='text-center'><Button color="default" variant="contained" onClick={toggleFailed} className='modal-state-btn-close'>Ok, j'ai compris</Button></h4>
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </div>);
}
