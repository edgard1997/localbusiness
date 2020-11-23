import React, { Component, useState } from 'react';
import { Container } from 'reactstrap';
import './Mention.css';
import { Link } from 'react-router-dom';


export default function Payment() {

    return (<div className='mention-content'>
        <div className='mention-banner'>
            <div className='container'>
                <div className='row'>
                    <div className='col-12'>
                        <h3 className='text-center title-1'>PAIEMENT</h3>
                    </div>
                </div>
            </div>
        </div>
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-10'>
                    <h3 className='text-center title-2'>1.Abonnement.</h3>
                    <p className='mention-text' >
                       Afin de maintenir gratuit le site www.yaillo.com aux visiteurs, les business listés sur Yaillo doivent s'acquitter de la somme de 7500FCFA ( Hors-frais mobile money ) chaque 1 an. Notez que chaque business nouvellement inscrit dispose d'une semaine d'essai avant d'être invité à payer le montant requis.
                       La date d'échéance passée, le compte du business sera temporairement bloqué jusqu'à renouvelement de l'abonnement. Veuillez nous écrire sur WhatsApp <b>(+380669310540)</b> pour renouveler votre abonnement.
                    </p>
                    <p className='mention-text' >
                        Notez que la procédure du renouvelement de l'abonnement peut durer jusqu'à 48 heures. Nous vous notifierons une fois celle-ci terminée.
                    </p>
                </div>
            </div>
        </div>
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-10' id="methods">
                    <h3 className='text-center title-2'>2.Méthodes de paiement.</h3>
                    <p className='mention-text'>
                        La bancarisation de l'afrique étant encore embryonnaire, Yaillo vous offre la possibilité de payer par mobile money par les opérateurs suivants:
                    </p>
                    <ul>
                        <li>Orange Money.</li>
                        <li>MTN Mobile Money.</li>
                        <li>Airtel Money.</li>
                        <li>Moov Money.</li>
                        <li>Yup.</li>
                        <li>Pour plus de détails veuillez nous contacter via WhatsApp <b>(+380669310540)</b>.</li>
                    </ul>
                </div>
            </div>
        </div>
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-10'>
                    <br />
                    <br />
                    <p className='mention-text' >
                        Lundi, 09/11/2020.
                    </p>
                </div>
            </div>
        </div>
    </div>);

}