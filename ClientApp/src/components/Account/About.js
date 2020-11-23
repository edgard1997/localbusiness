import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import { Link } from "react-router-dom";
import './Account.css';
import { Button, IconButton, TextField, CircularProgress } from '@material-ui/core';
import { useDataContext } from '../Global/GlobalContext';
import authService from '../api-authorization/AuthorizeService';
import { GetApi, PostApi } from '../../api/ApiConstants';

export default function About(props) {

    const { dcReducer } = useDataContext();
    const [model, setModel] = useState({
        userId: null,
        text: ''
    });
    const [ready, setReady] = useState(false);
    const [canSubmit, setCanSubmit] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        dcReducer({ type: 'navigate-account', data: { activeAccountLink: 'about' } });
        authService.getUser().then(res => {

            if (res !== null && res !== undefined) {

                authService.getAccessToken().then(token => {

                    fetch(`${GetApi.GetAboutBiz}/${res.sub}`, {
                        method: 'GET',
                        headers: !token ? {} : { 'Authorization': `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json', },
                        mode: 'cors',
                        cache: 'default',
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data != null && data != undefined) {
                                setModel({ ...model, ['userId']: data.userId });
                                setModel({ ...model, ['text']: data.text === null ? '' : data.text });
                                setReady(true);
                            }
                        }).catch(error => console.log(error));


                });

            }

        });


    }, []);

    function sendData() {

        setLoading(true);

        authService.getUser().then(res => {

            if (res !== null && res !== undefined) {

                const data = {
                    userId: res.sub,
                    text: model.text,
                };

                authService.getAccessToken().then(token => {
                    fetch(PostApi.PostAboutBiz, {
                        method: 'POST',
                        headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify(data),
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


    return (
        <div className='container'>
            <div className='row'>
                <div className='col-12'>
                    <h4 className='account-hint-title'>À propos de votre entreprise.</h4>
                    <p className='account-hint'>*Donnez une idée globale de votre entreprise aux clients en remplissant la forme ci-dessous.</p>
                    <br />
                </div>
                <div className='col-12'>
                    {
                        !ready ? (<></>) : (<form className='about-form' autoComplete="off">
                            <div className='row justify-content-center'>
                                <div className='col-12'>
                                    <TextField style={{ width: `100%` }} label="À propos" variant="outlined"
                                        onChange={(e) => {
                                            setModel({ ...model, ['text']: e.target.value });
                                            if (model.text.length > 100) {

                                                setCanSubmit(true);
                                            }
                                            else
                                            {
                                                setCanSubmit(false);
                                            }
                                        }}
                                        value={model.text}
                                        multiline
                                        rows={10}
                                    />
                                </div>
                                <div className='col-12'>
                                    {
                                        !canSubmit ? (<Button variant="contained" disabled className='account-btn-disabled'>
                                            Sauvegarder
                                 </Button>) : loading ? (<Button variant="contained" className='account-btn-loading'>< h5 className='text-center'><CircularProgress size={24} style={{ color: `#fff`, marginTop: `8px` }} /></h5></Button>)
                                                : 

                                                (<Button variant="contained" className='account-btn' onClick={() => { sendData(); }} >
                                                    Sauvegarder
                                 </Button>)
                                    }
                                </div>
                            </div>
                        </form>)
                    }
                </div>
            </div>
        </div>);
}