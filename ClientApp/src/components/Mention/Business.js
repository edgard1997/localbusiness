import React, { Component, useState } from 'react';
import { Container } from 'reactstrap';
import './Mention.css';
import { Link } from 'react-router-dom';


export default function Business() {

    return (<div className='mention-content'>
        <div className='mention-banner'>
            <div className='container'>
                <div className='row'>
                    <div className='col-12'>
                        <h3 className='text-center title-1'>BUSINESS</h3>
                    </div>
                </div>
            </div>
        </div>
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-10' id="verify">
                    <h3 className='text-center title-2'>1.Réclamer sa page.</h3>
                    <p className='mention-text' >
                        Vous souhaitez rentrer en possession de votre business déjà présent sur Yaillo ? Envoyez-nous par WhatsApp <b>(+380669310540)</b> les informations de vérification suivantes :
                    </p>
                    <ul>
                        <li>Photo de votre passeport ou CNI.</li>
                        <li>Document légal portant le nom de votre business. (Facture d'électricité, relevé bancaire, numéro de securité social etc...)</li>
                        <li>Pour plus de détails veuillez nous contacter via WhatsApp <b>(+380669310540)</b>.</li>
                    </ul>
                    <p className='mention-text' >
                       Notez la procédure de vérification peut durer jusqu'à 48 heures. Nous vous notifierons une fois celle-ci terminée.
                    </p>
                </div>
            </div>
        </div>
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-10' id="partner">
                    <h3 className='text-center title-2'>2.Devenir un affilié.</h3>
                    <p className='mention-text'>
                        Avec Yaillo, vous avez la possibilité de gagner dans votre ville 1500FCFA pour chaque business ajouté. Pour devenir un de nos affiliés, envoyez-nous les informations suivantes via WhatsApp <b>(+380669310540)</b>
                    </p>
                    <ul>
                        <li>Photo de votre passeport ou CNI.</li>
                        <li>Photo de votre acte de naissance.</li>
                        <li>Numéro de téléphone (WhatsApp).</li>
                        <li>Pour plus de détails veuillez nous contacter via WhatsApp <b>(+380669310540)</b>.</li>
                    </ul>
                </div>
            </div>
        </div>
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-10' id="ad">
                    <h3 className='text-center title-2'>3.Campagne Publicitaire.</h3>
                    <p className='mention-text'>
                        Grâce à la publicité Yaillo, donnez plus de visibilité à votre business dans votre ville ( rayon de 50 km). Les business sponsorisés sur Yaillo obtiennent toujours les premières places dans les résultats de recherche.
                    </p>
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">Période</th>
                                <th scope="col">Montant</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="col">07 jours</th>
                                <th scope="col">25000 FCFA</th>
                            </tr>
                            <tr>
                                <th scope="col">14 jours</th>
                                <th scope="col">42500 FCFA</th>
                            </tr>
                            <tr>
                                <th scope="col">30 jours</th>
                                <th scope="col">82500 FCFA</th>
                            </tr>
                        </tbody>
                    </table>

                    <p className='mention-text' >
                        Pour plus de détails veuillez nous contacter via WhatsApp <b>(+380669310540)</b>.
                    </p>

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