import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import { Link } from "react-router-dom";
import './Account.css';
import { Button, IconButton, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@material-ui/core';
import { FiEdit } from 'react-icons/fi';
import TimeInput  from 'material-ui-time-picker';
import { useDataContext } from '../Global/GlobalContext';
import authService from '../api-authorization/AuthorizeService';
import { GetApi, PostApi } from '../../api/ApiConstants';

export default function Hours(props) {

    const date =new Date();
    const [currentDay, setCurrentDay] = useState({ day: 1, dayName: 'Lundi', startTime: date, endTime: date, isOpened:2});
    const openModal = (day, dayName, opened, from, to) => {

        setCurrentDay({ ...currentDay, ['day']: day, ['dayName']: dayName, ['startTime']: from != null ? new Date(`2020-12-17T${from}:00`) : date, ['endTime']: to != null ? new Date(`2020-12-17T${to}:00`) : date, ['isOpened']:opened ? 1 : 2 });
    };
    const [ready, setReady] = useState(false);
    const [file1, setFileOne] = useState(null);
    const [file2, setFileTwo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [model, setModel] = useState(null);

    const handleChange = (event) => {
        setCurrentDay({ ...currentDay, ['isOpened']: event.target.value});
    };

    const { dcReducer } = useDataContext();

    useEffect(() => {

        dcReducer({ type: 'navigate-account', data: { activeAccountLink: 'hours' } });
        authService.getUser().then(res => {

            if (res !== null && res !== undefined) {

                authService.getAccessToken().then(token => {

                    fetch(`${GetApi.GetChangeHours}/${res.sub}`, {
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

    function getRoundTime(time) {
        var hour = time.getHours();
        if (hour < 10) {

            hour = '0' + String(hour);
        }
        var minutes = time.getMinutes();
        if (minutes < 10) {
            minutes = '0' + String(minutes);
        }

        return `${hour}:${minutes}`
    }

    function sendData() {

        setLoading(true);

        authService.getUser().then(res => {

            if (res !== null && res !== undefined) {

                
                const data = {
                    userId: res.sub,
                    dayId: currentDay.day,
                    from: currentDay.isOpened === 1 ? getRoundTime(currentDay.startTime) : null,
                    to: currentDay.isOpened === 1 ? getRoundTime(currentDay.endTime) : null,
                    isOpened: currentDay.isOpened === 1 ? true : false,
                };

                console.log(data);
                authService.getAccessToken().then(token => {
                    fetch(PostApi.PostChangeHours, {
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
        <div className='container hours-content'>
            <div className='row'>
                <div className='col-12'>
                    <h4 className='account-hint-title' >Horaires d'ouvertures.</h4>
                    <p className='account-hint'>*Définissez les horaires d'ouvertures de votre business.</p>
                </div>
                <div className='col-12 edit-hour-content' >
                    <div className='row'>
                        <div className='col-3 col-md-2 edit-time-day'>
                            <span>{currentDay.dayName}</span>
                        </div>
                        <div className='col-3 col-md-2' >
                            <TimeInput
                                mode='24h'
                                value={currentDay.startTime}
                                variant="outlined"
                                onChange={(time) => { setCurrentDay({ ...currentDay, ['startTime']: time }); }}
                            />
                        </div>
                        <div className='col-3 col-md-2' >
                            <TimeInput
                                mode='24h'
                                value={currentDay.endTime}
                                onChange={(time) => { setCurrentDay({ ...currentDay, ['endTime']: time }); }}
                            />
                        </div>
                        <div className='col-2 col-md-2' >
                            <FormControl>
                                <Select
                                    labelId="is-opened-label"
                                    id="is-opened"
                                    value={currentDay.isOpened}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={1}>Ouvert</MenuItem>
                                    <MenuItem value={2}>Fermé</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className='col-12'>
                            {
                                loading ? (<Button variant="contained" className='account-btn-loading'>< h5 className='text-center'><CircularProgress size={24} style={{ color: `#fff`, marginTop: `8px` }} /></h5></Button>) : <Button variant="contained" color="secondary" className='account-btn' onClick={() => { sendData(); }} >
                                    Sauvegarder
                                 </Button>
                            }
                        </div>
                    </div>
                </div>
                {
                    !ready ? <></> :

                        model.hours.map((hr, i) => (
                            
                            <div className='col-12'>
                                <div className='row'>
                                    <div className='col-4 col-md-2 time-and-day' >
                                        <span>{hr.day}</span>
                                    </div>
                                    <div className='col-8 col-md-5' >
                                        {!hr.isOpened ? <span className='time'>Fermé</span> : <span className='time'>{hr.from} - {hr.to}</span>}
                                        <span className='edit-time-icon'><IconButton onClick={() => { openModal(hr.dayId, hr.day, hr.isOpened, hr.from,hr.to); }}><FiEdit /></IconButton></span>
                                    </div>
                                </div>
                            </div>
                        ))
                }
            </div>
        </div>);
}