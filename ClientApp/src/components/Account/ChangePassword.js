import React, { useEffect, useContext, useReducer, useState } from 'react';
import { Container } from 'reactstrap';
import { Link } from "react-router-dom";
import './Account.css';
import { Button, IconButton, TextField, CircularProgress} from '@material-ui/core';
import { useDataContext } from '../Global/GlobalContext';
import AccountContext from './AccountContext';
import AccountReducer from './AccountReducer';
import { PostApi } from '../../api/ApiConstants';
import authService from '../api-authorization/AuthorizeService';

export default function ChangePassword(props) {


    const { dcReducer } = useDataContext();
    const [loading, setLoading] = useState(false);
    const ctx = useContext(AccountContext);
    const [state, dispatch] = useReducer(AccountReducer, ctx);
    const [model, setModel] = useState({
        oldPassword: null,
        newPassword: null,
        confirmNewPassword: null,
    });

    useEffect(() => {

        dcReducer({ type: 'navigate-account', data: { activeAccountLink: 'password' } });

    }, []);

    function sendData(state) {

        setLoading(true);

        authService.getUser().then(res => {

            if (res !== null && res !== undefined) {

                const data = {
                    userId: res.sub,
                    oldPassword: state.oldPassword,
                    newPassword: state.newPassword,
                    newPassordConfirmation: state.confirmNewPassword
                };

                authService.getAccessToken().then(token => {
                    fetch(PostApi.ChangePassword, {
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
                    <h4 className='account-hint-title' >Changez de mot de passe.</h4>
                    <p className='account-hint'>*Renforcez la securite de votre compte en rendant votre mot de passe complexe.</p>
                </div>
                <div className='col-12 col-sm-8 col-md-8'>
                    <form className='code-form' autoComplete="off">

                        <div className='row justify-content-center'>
                            <div className='col-12'>
                                <TextField className='account-input' label="Mot de passe actuel" variant="outlined"
                                onChange={(e) => {
                                    setModel({ ...model, ['oldPassword']: e.target.value });

                                }}
                                    value={model.oldPassword}
                                    error={state.oldPasswordError ? true : false}
                                    helperText={state.oldPasswordError ? 'Entrez un mot de passe valide. [A-z] [0-9] [@-!]' : null}
                                />
                            </div>
                            <div className='col-12'>
                                <TextField className='account-input' label="Nouveau mot de passe" variant="outlined"
                                onChange={(e) => {
                                    setModel({ ...model, ['newPassword']: e.target.value });

                                }}
                                    value={model.newPassword}
                                    error={state.newPasswordError ? true : false}
                                    helperText={state.newPasswordError ? 'Entrez un mot de passe valide. [A-z] [0-9] [@-!]' : null}
                                />
                            </div>
                            <div className='col-12'>
                                <TextField className='account-input' label="Repetez le mot de passe" variant="outlined"
                                onChange={(e) => {
                                    setModel({ ...model, ['confirmNewPassword']: e.target.value });

                                }}
                                    value={model.confirmNewPassword}
                                    error={state.passwordsDontMatch ? true : false}
                                    helperText={state.passwordsDontMatch ? 'Le nouveau mot de passe et sa confirmation ne correspondent pas.' : null}
                                />
                            </div>
                            <div className='col-12'>
                                <br />
                                <br />
                                {loading ? <Button variant="contained" className='account-btn-loading' ><h5 className='text-center'><CircularProgress size={24} style={{ color: `#fff`, marginTop: `8px` }} /></h5></Button>

                                    :

                                    <Button variant="contained" className='account-btn' onClick={() => {
                                        dispatch({
                                            type: "change-password",
                                            data: {
                                                oldPassword: model.oldPassword,
                                                newPassword: model.newPassword,
                                                confirmNewPassword: model.confirmNewPassword,
                                                sendData: sendData,
                                            }
                                        });
                                    }}  ><span>Sauvegarder</span></Button>}


                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>);
}