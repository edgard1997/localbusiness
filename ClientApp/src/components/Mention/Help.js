import React, { Component, useState } from 'react';
import { Container } from 'reactstrap';
import './Mention.css';
import { Link } from 'react-router-dom';


export default function Help() {


    return (<div className='mention-content'>
        <div className='mention-banner'>
            <div className='container'>
                <div className='row'>
                    <div className='col-12'>
                        <h3 className='text-center title-1'>ASSISTANCE</h3>
                    </div>
                </div>
            </div>
        </div>
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-10'>
                    <h3 className='text-center title-2'>1.Centre d'aide.</h3>
                    <p className='mention-text' >
                        Vous avez des questions ou des suggestions  ? Nous vous répondons sur WhatsApp <b>(+380669310540)</b> selon les heures de disponibilité suivantes <b>( GMT+2 )</b> :
                    </p>
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">Période</th>
                                <th scope="col">Heures</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="col">Lundi - Vendredi</th>
                                <th scope="col">10:00 - 18:00</th>
                            </tr>
                            <tr>
                                <th scope="col">Samedi</th>
                                <th scope="col">Indisponible</th>
                            </tr>
                            <tr>
                                <th scope="col">Dimanche</th>
                                <th scope="col">Indisponible</th>
                            </tr>
                        </tbody>
                    </table>
                    <p className='mention-text' >
                        Nous nous efforçons de repondre à un maximum de préoccupations. Notez qu'un retour de notre part peut durer jusqu'à 48 heures.
                    </p>
                </div>
            </div>
        </div>
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-10' id="career">
                    <h3 className='text-center title-2'>2.Carrières</h3>
                    <p className='mention-text'>
                       Vous résidez dans l'une des villes suivantes et souhaitez prendre part à l'aventure Yaillo ? Écrivez-nous via WhatsApp <b>(+380669310540)</b>
                    </p>
                    <ul>
                        <li>Kinshasa.</li>
                        <li>Bamako.</li>
                        <li>Dakar.</li>
                        <li>Ouagadougou.</li>
                        <li>Libreville.</li>
                        <li>Lome.</li>
                        <li>Brazzaville.</li>
                        <li>Cotonou.</li>
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