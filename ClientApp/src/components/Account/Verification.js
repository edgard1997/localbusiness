import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import { Link } from "react-router-dom";
import './Account.css';
import { Button, IconButton, CircularProgress } from '@material-ui/core';
import { AiOutlineFileText } from 'react-icons/ai';
import { FaPaperPlane } from 'react-icons/fa';
import { useDataContext } from '../Global/GlobalContext';
import { GetApi, PostApi } from '../../api/ApiConstants';
import authService from '../api-authorization/AuthorizeService';
import { Alert } from '@material-ui/lab';

export default function Verification(props) {

    const { dcReducer } = useDataContext();
    const [isVerified, setIsVerified] = useState(false);
    const [ready, setReady] = useState(false);
    const [file1, setFileOne] = useState(null);
    const [file2, setFileTwo] = useState(null);
    const [canSubmit, setCanSubmit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [model, setModel] = useState({ fileName1: 'Carte_didentite.pdf', fileName2: 'Document_legal.pdf' });

    useEffect(() => {

        dcReducer({ type: 'navigate-account', data: { activeAccountLink: 'verify' } });
        authService.getUser().then(res => {

            if (res !== null && res !== undefined) {

                authService.getAccessToken().then(token => {

                    fetch(`${GetApi.GetVerification}/${res.sub}`, {
                        method: 'GET',
                        headers: !token ? {} : { 'Authorization': `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json', },
                        mode: 'cors',
                        cache: 'default',
                    })
                        .then(response => response.json())
                        .then(data => {

                            setIsVerified(data);
                            setReady(true);
                        });


                });

            }

        });

    }, []);


    function sendData() {

        setLoading(true);

        authService.getUser().then(res => {

            if (res !== null && res !== undefined) {

                const data = new FormData();
                data.append("userId", res.sub);
                data.append("idCard", file1);
                data.append("legalDocument", file2);

                authService.getAccessToken().then(token => {
                    fetch(PostApi.PostVerification, {
                        method: 'POST',
                        headers: !token ? {} : { 'Authorization': `Bearer ${token}` },
                        body: data,
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

    return ( !ready ? (<></>) : (<div className='container verification-account-content'>
        {!isVerified ? (
            <div className='row' style={{ marginBottom: `150px` }}>
                <div className='col-12'>
                    <h4>Verifiez votre compte.</h4>
                    <p className='account-hint'>*Envoyez-nous par WhatsApp une copie recto-verso de votre carte nationale d'identité,  ainsi qu'un document légal de votre entreprise portant votre nom.</p>
                    <a href="/business#verify">En savoir plus</a>
                </div>
            </div>
        ) : (
                <div className='row' style={{ marginBottom:`150px` }}>
                    <div className='col-12'>
                        <h4>Verifiez votre compte.</h4>
                        <p className='account-hint'>*Envoyez-nous par WhatsApp une copie recto-verso de votre carte nationale d'identité,  ainsi qu'un document légal de votre entreprise portant votre nom.</p>
                        <a href="/business#verify">En savoir plus</a>
                    </div>
                </div>
            )
        } 
    </div>)
    );
}



//<div className='row'>
//    <div className='col-12'>
//        <h4 className='account-hint-title' >Verifiez votre compte.</h4>
//        <br />
//        <Alert severity="success">Votre requête a déjà été envoyé avec succès!</Alert>
//    </div></div>



//<div className='col-12 col-md-6'>
//    <input
//        accept=".pdf,.doc"
//        className="input-upload"
//        id="button-file-cni"
//        multiple
//        type="file"
//        onChange={(e) => {
//            setModel({ ...model, ['fileName1']: e.target.files[0].name });
//            setFileOne(e.target.files[0]);
//            if (file1 != null && file2 != null) {
//                setCanSubmit(true);
//            }
//            else {
//                setCanSubmit(false);
//            }
//        }}
//    />
//    <label htmlFor="button-file-cni">
//        <Button variant="contained" color="default" component="span"
//            startIcon={<AiOutlineFileText />}
//        >
//            Carte d'identité
//                    </Button>
//    </label>
//    <br />
//    <span>{model.fileName1}</span>
//</div>
//    <div className='col-12 col-md-6'>
//        <input
//            accept=".pdf,.doc"
//            className="input-upload"
//            id="button-file-attestat"
//            multiple
//            type="file"
//            onChange={(e) => {
//                setModel({ ...model, ['fileName2']: e.target.files[0].name });
//                setFileTwo(e.target.files[0]);
//                if (file1 != null && file2 != null) {
//                    setCanSubmit(true);
//                }
//                else {
//                    setCanSubmit(false);
//                }
//            }}
//        />
//        <label htmlFor="button-file-attestat">
//            <Button variant="contained" color="default" component="span"
//                startIcon={<AiOutlineFileText />}
//            >
//                Document légal
//                    </Button>
//        </label>
//        <br />
//        <span>{model.fileName2}</span>
//    </div>
//    <div className='col-12'>
//        {
//            !canSubmit ? (<Button variant="contained" disabled className='account-btn-disabled'
//                startIcon={<FaPaperPlane />}
//            >
//                Soumettre
//                    </Button>) : loading ? (<Button variant="contained" className='account-btn-loading'>< h5 className='text-center'><CircularProgress size={24} style={{ color: `#fff`, marginTop: `8px` }} /></h5></Button>)
//                    :

//                    (<Button variant="contained" onClick={() => { sendData(); }} className='account-btn'
//                        startIcon={<FaPaperPlane />}
//                    >
//                        Soumettre
//                    </Button>)
//        }
//    </div>