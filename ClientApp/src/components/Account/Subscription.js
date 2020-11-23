import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import { Link } from "react-router-dom";
import './Account.css';
import { Button, IconButton, TextField } from '@material-ui/core';
import { useDataContext } from '../Global/GlobalContext';
import { GetApi } from '../../api/ApiConstants';
import authService from '../api-authorization/AuthorizeService';

export default function Subscription() {


    const { dcReducer } = useDataContext();
    const [model, setModel] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {

        dcReducer({ type: 'navigate-account', data: { activeAccountLink: 'subscription' } });
        authService.getUser().then(res => {

            if (res !== null && res !== undefined) {

                authService.getAccessToken().then(token => {

                    fetch(`${GetApi.GetSubInfo}/${res.sub}`, {
                        method: 'GET',
                        headers: !token ? {} : { 'Authorization': `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json', },
                        mode: 'cors',
                        cache: 'default',
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data != null && data != undefined) {
                                setModel(data);
                                setReady(true);
                            }
                        });


                });

            }

        });

    }, []);

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-12'>
                    <h4 className='account-hint-title' >Détails d'abonnement.</h4>
                    <p className='account-hint'>*Renouvelez votre abonnement annuel en envoyant le montant requis a l'un des numéro suivant par le mobile money de votre choix. Utilisez votre code de paiement pour effectuer le transfert.</p>
                    <br />
                    {!ready ? (<></>) : (<>
                        <p>Montant : <span className='subscription-details'>{model.amount}FCFA</span></p>
                        <p>Date de renouvellement :  <span className='subscription-details'>{model.from}</span></p>
                        <p>Date d'expiration :  <span className='subscription-details'>{model.to}</span></p>
                    </>)}
                </div>
            </div>
        </div>);
}

//<p>Votre code de paiement :  <span className='subscription-details'>{model.paymentCode}</span></p>
//{
//    model.methods.map((method, i) => (
//        <p>{method.name} : <span className='subscription-details'>{method.phoneNumber}</span></p>
//    ))
//}