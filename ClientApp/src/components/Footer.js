import React, { Component, useState } from 'react';
import { Collapse, Container } from 'reactstrap';
import { Link } from 'react-router-dom';
import { LoginMenu } from './api-authorization/LoginMenu';
import { Button, Paper, Divider, IconButton } from '@material-ui/core';
import { FaFacebook } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa';
import { FaRegCopyright } from 'react-icons/fa';
import { GrFormDown } from 'react-icons/gr';
import './Footer.css';


export default function Footer() {

    var date = new Date();


    function openInNewTab(url) {
        var win = window.open(url, '_blank');
        win.focus();
    }


    return (
        <>
        <div className='col-12  become-affiliated' >
            <h4 className='text-center become-affiliated-text-1'>Le business que vous recherchez n'est pas sur Yaillo ? C'est pas grave !</h4>
                <h4 className='text-center become-affiliated-text-2' >*Devenez un affilié Yaillo et gagnez 1500FCFA pour chaque business ajouté.</h4>
                <h4 className='text-center'><Button variant="contained" href="/business#partner" className='become-affiliated-more-details-btn'>En savoir plus</Button></h4>
        </div>
        <div className="footer">
        <Container>
            <div className='row'>
                <div className='col-12 col-sm-6 col-md-4 col-lg-3 content'>
                    <span className="footer-header">RÈGLEMENT</span>
                    <br />
                    <span className="footer-item"><a href="/terms">Conditions d'utilisation</a></span>
                    <br />
                    <span className="footer-item"><a href="/terms#privacy">Vie privée</a></span>
                    <br />
                    <span className="footer-item"><a href="/terms#copyright">Droits d'auteurs</a></span>
                    <br />
                    <span className="footer-item"><a href="/terms#cookies">Cookies</a></span>
                </div>
                <div className='col-12 col-sm-6 col-md-4 col-lg-3 content'>
                    <span className="footer-header" >BUSINESS</span>
                    <br/>
                    <span className="footer-item"><a href="/business">Réclamer sa page</a></span>
                    <br />
                    <span className="footer-item"><a href="/partenariat/douala">Devenir partenaire Yaillo</a></span>
                    <br />
                    <span className="footer-item"><a href="/business#ad">Campagne publicitaire</a></span>
                </div>
                <div className='col-12 col-sm-6 col-md-4 col-lg-3 content'>
                    <span className="footer-header" >PAIEMENT</span>
                    <br />
                    <span className="footer-item"><a href="/payment">Abonnement</a></span>
                    <br />
                            <span className="footer-item"><a href="/payment#methods">Méthodes de paiement</a></span>
                    <br />
                </div>
                <div className='col-12 col-sm-6 col-md-4 col-lg-3 content'>
                    <span className="footer-header" >ASSISTANCE</span>
                    <br />
                    <span className="footer-item"><a href="/help">Besoin d'aide ?</a></span>
                    <br />
                    <span className="footer-item"><a href="/help#career">Carrières</a></span>
                </div>
            </div>
            <div className='row justify-content-between'>
                <div className='col-12 divider-div'>
                    <Divider />
                </div>
                <div className='col-sm-12 col-md-9 col-lg-10  copyright-content'>
                    <span> <FaRegCopyright className='copyright-icon' /> Yaillo Inc, {date.getFullYear()}. Tout droits reserves.</span>
                </div>
                        <div className='col-sm-12 col-md-3 col-lg-2 social-media-content'>
                            <IconButton onClick={() => {
                             openInNewTab("https://www.facebook.com/Yaillo-R%C3%A9pertoire-de-business-locaux-111672730758548");
                            }}><FaFacebook className="facebook-icon" /></IconButton>
 
                </div>
            </div>
        </Container>
        </div></>);

}

    //<FaTwitter className="twitter-icon" />
            //<div className='col-12'>
                //    <div className='row'>
                //        <div className='col-5 col-sm-3 col-md-2'>
                //            <Link><img className='on-store-img' src={'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSmd4qlXkpFRKYx1tVWU-u6hHbGJjZBRRucxA&usqp=CAU'} /></Link>
                //        </div>
                //        <div className='col-5 col-sm-3 col-md-2'>
                //            <Link><img className='on-store-img' src={'https://radio.alsace/playstore.png'} /></Link>
                //        </div>
                //    </div>
                //</div>