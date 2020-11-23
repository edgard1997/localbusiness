import React, { useState, useContext, useEffect, useReducer } from 'react';
import { Container } from 'reactstrap';
import { Link } from "react-router-dom";
import './Account.css';
import {
    Button,
    IconButton,

} from '@material-ui/core';
import { useDataContext } from '../Global/GlobalContext';
import authService from '../api-authorization/AuthorizeService';
import { GetApi, baseUrl } from '../../api/ApiConstants';


export default function DeleteAccount() {


    const { dcReducer } = useDataContext();
    useEffect(() => {

            dcReducer({ type: 'navigate-account', data: { activeAccountLink: 'delete' } });
       
    }, []);

    function deleteAccount() {
        authService.getUser().then(res => {

            if (res !== null && res !== undefined) {

                authService.getAccessToken().then(token => {

                    fetch(`${GetApi.GetDeleteAccount}/${res.sub}`, {
                        method: 'GET',
                        headers: !token ? {} : { 'Authorization': `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json', },
                        mode: 'cors',
                        cache: 'default',
                    })
                        .then(response => {
                            if (response.status === 200) {
                                window.location.replace(baseUrl);
                            }
                        })
                        .catch(error => console.log(error));


                });

            }

        });
    }

    return (
        <div className='container delete-account-content'>
            <div className='row'>
                <div className='col-12'>
                    <h4 className='account-hint-title'>Supprimer mon compte.</h4>
                    <p className='account-hint'>*Vous êtes sur le point de supprimer votre page, toutes les informations attachées à ce compte seront definitivement perdues.</p>

                </div>
                <div className='col-12'>
                   
                        <div className='row' >
                        <div className='col-12'>
                            <Button variant="contained" onClick={() => { deleteAccount() }} className='account-btn'>
                                    Oui, je supprime
                                 </Button>
                            </div>
                            </div>
                </div>
            </div>
        </div>);
}
