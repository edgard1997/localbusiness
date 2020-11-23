import React, { useEffect, useState } from 'react';
import { Container, Modal, ModalBody } from 'reactstrap';
import { BrowserRouter as Router, Switch, Route, useRouteMatch, Link } from "react-router-dom";
import './Account.css';
import { Button, IconButton } from '@material-ui/core';
import { FiLogOut, FiBell, FiUser, FiLock, FiXSquare, FiClock, FiEye, FiEyeOff, FiDollarSign, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import ChangeDetails from './ChangeDetails';
import ChangePassword from './ChangePassword';
import Verification from './Verification';
import About from './About';
import Subscription from './Subscription';
import Hours from './Hours';
import { RiErrorWarningLine } from 'react-icons/ri';
import Synopsis from './Synopsis';
import { FaHandPaper, FaRegHandPaper } from 'react-icons/fa';
import DeleteAccount from './DeleteAccount';
import { useDataContext } from '../Global/GlobalContext';
import authService from '../api-authorization/AuthorizeService';


export default function AccountLayout() {

    
    let { path } = useRouteMatch();
    const { dataContext } = useDataContext();

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

    }, []);



    const [succeed, setSuccessModal] = useState(false);
    const [failed, setFailModal] = useState(false);

    const toggleSucceed = () => setSuccessModal(!succeed);
    const toggleFailed = () => setFailModal(!failed);

    function Navigation1() {

        return (<div className='row panel-account-wrapper' >
            <div className='col-12 panel-acount-col'>
                <Link className={dataContext.activeAccountLink === 'details' ? 'panel-link-account active-account-link' : 'panel-link-account'} to={path}>
                        <FiUser className={dataContext.activeAccountLink === 'details' ? 'panel-icon-account active-account-icon' : 'panel-icon-account'} />
                        <span className={dataContext.activeAccountLink === 'details' ? 'panel-item-account active-panel-account' : 'panel-item-account'} >
                            Changer informations
                </span>
                </Link>
            </div>
            <div className='col-12 panel-acount-col'>
                <Link className={dataContext.activeAccountLink === 'password' ? 'panel-link-account active-account-link' : 'panel-link-account'} to={`${path}/password`}>
                    <FiEyeOff className={dataContext.activeAccountLink === 'password' ? 'panel-icon-account active-account-icon' : 'panel-icon-account'} />
                    <span className={dataContext.activeAccountLink === 'password' ? 'panel-item-account active-panel-account' : 'panel-item-account'}  >
                    Changer mot de passe
                </span>
                </Link>
            </div>
            <div className='col-12 panel-acount-col'>
                <Link className={dataContext.activeAccountLink === 'delete' ? 'panel-link-account active-account-link' : 'panel-link-account'} to={`${path}/delete`}>
                    <FiXSquare className={dataContext.activeAccountLink === 'delete' ? 'panel-icon-account active-account-icon' : 'panel-icon-account'} />
                    <span className={dataContext.activeAccountLink === 'delete' ? 'panel-item-account active-panel-account' : 'panel-item-account'} >
                   Supprimer mon compte
                </span>
                </Link>
            </div>
        </div>
        );
    }

    function Navigation2() {

        return (<div className='row panel-account-wrapper' >
            <div className='col-12 panel-acount-col'>
                <Link className={dataContext.activeAccountLink === 'details' ? 'panel-link-account active-account-link' : 'panel-link-account'} to={path}>
                    <FiUser className={dataContext.activeAccountLink === 'details' ? 'panel-icon-account active-account-icon' : 'panel-icon-account'} />
                    <span className={dataContext.activeAccountLink === 'details' ? 'panel-item-account active-panel-account' : 'panel-item-account'} >
                        Changer informations
                </span>
                </Link>
            </div>
            <div className='col-12 panel-acount-col'>
                <Link className={dataContext.activeAccountLink === 'password' ? 'panel-link-account active-account-link' : 'panel-link-account'} to={`${path}/password`}>
                    <FiEyeOff className={dataContext.activeAccountLink === 'password' ? 'panel-icon-account active-account-icon' : 'panel-icon-account'} />
                    <span className={dataContext.activeAccountLink === 'password' ? 'panel-item-account active-panel-account' : 'panel-item-account'}  >
                        Changer mot de passe
                </span>
                </Link>
            </div>
            <div className='col-12 panel-acount-col'>
                <Link className={dataContext.activeAccountLink === 'verify' ? 'panel-link-account active-account-link' : 'panel-link-account'} to={`${path}/verification`}>
                    <FiCheckCircle className={dataContext.activeAccountLink === 'verify' ? 'panel-icon-account active-account-icon' : 'panel-icon-account'} />
                    <span className={dataContext.activeAccountLink === 'verify' ? 'panel-item-account active-panel-account' : 'panel-item-account'} >
                        Vérification d'identité
                </span>
                </Link>
            </div>
            <div className='col-12 panel-acount-col'>
                <Link className={dataContext.activeAccountLink === 'hours' ? 'panel-link-account active-account-link' : 'panel-link-account'} to={`${path}/horaires`}>
                    <FiClock className={dataContext.activeAccountLink === 'hours' ? 'panel-icon-account active-account-icon' : 'panel-icon-account'} />
                    <span className={dataContext.activeAccountLink === 'hours' ? 'panel-item-account active-panel-account' : 'panel-item-account'} >
                        Horaires
                </span>
                </Link>
            </div>
            <div className='col-12 panel-acount-col'>
                <Link className={dataContext.activeAccountLink === 'subscription' ? 'panel-link-account active-account-link' : 'panel-link-account'} to={`${path}/abonnement`}>
                    <FiLock className={dataContext.activeAccountLink === 'subscription' ? 'panel-icon-account active-account-icon' : 'panel-icon-account'} />
                    <span className={dataContext.activeAccountLink === 'subscription' ? 'panel-item-account active-panel-account' : 'panel-item-account'}  >
                        Abonnement
                </span>
                </Link>
            </div>
            <div className='col-12 panel-acount-col'>
                <Link className={dataContext.activeAccountLink === 'synopsis' ? 'panel-link-account active-account-link' : 'panel-link-account'} to={`${path}/synopsis`}>
                    <FaRegHandPaper className={dataContext.activeAccountLink === 'synopsis' ? 'panel-icon-account active-account-icon' : 'panel-icon-account'} />
                    <span className={dataContext.activeAccountLink === 'synopsis' ? 'panel-item-account active-panel-account' : 'panel-item-account'} >
                        Synopsis
                </span>
                </Link>
            </div>
            <div className='col-12 panel-acount-col'>
                <Link className={dataContext.activeAccountLink === 'about' ? 'panel-link-account active-account-link' : 'panel-link-account'} to={`${path}/about`}>
                    <RiErrorWarningLine className={dataContext.activeAccountLink === 'about' ? 'panel-icon-account active-account-icon' : 'panel-icon-account'} />
                    <span className={dataContext.activeAccountLink === 'about' ? 'panel-item-account active-panel-account' : 'panel-item-account'}>
                        À propos
                </span>
                </Link>
            </div>
            <div className='col-12 panel-acount-col'>
                <Link className={dataContext.activeAccountLink === 'delete' ? 'panel-link-account active-account-link' : 'panel-link-account'} to={`${path}/delete`}>
                    <FiXSquare className={dataContext.activeAccountLink === 'delete' ? 'panel-icon-account active-account-icon' : 'panel-icon-account'} />
                    <span className={dataContext.activeAccountLink === 'delete' ? 'panel-item-account active-panel-account' : 'panel-item-account'} >
                        Supprimer mon compte
                </span>
                </Link>
            </div>
        </div>
        );
    }
    return (
        <>
        <div className='container account-layout'>
            <div className='row'>
                <div className='col-12 col-lg-3'>
                        {
                            profile != null && profile != undefined ? profile.role === '1' ? <Navigation1 /> : <Navigation2 /> : null
                        }
                </div>
                <div className='col-12 col-lg-6 account-content'>
                    <Switch>
                        <Route exact path={path} >
                            <ChangeDetails openSuccess={toggleSucceed} openFailed={toggleFailed} />
                        </Route>
                        <Route path={`${path}/password`}>
                          <ChangePassword openSuccess={toggleSucceed} openFailed={toggleFailed} />
                        </Route>
                        <Route path={`${path}/verification`}>
                           <Verification openSuccess={toggleSucceed} openFailed={toggleFailed} />
                        </Route>
                        <Route path={`${path}/horaires`}>
                           <Hours openSuccess={toggleSucceed} openFailed={toggleFailed} />
                        </Route>
                        <Route path={`${path}/abonnement`}>
                            <Subscription  />
                        </Route>
                        <Route path={`${path}/about`}>
                             <About openSuccess={toggleSucceed} openFailed={toggleFailed} />
                        </Route>
                        <Route path={`${path}/synopsis`}>
                                <Synopsis openSuccess={toggleSucceed} openFailed={toggleFailed} />
                        </Route>
                        <Route path={`${path}/delete`}>
                            <DeleteAccount />
                        </Route>
                    </Switch>
                </div>
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
        </>
    );
}
