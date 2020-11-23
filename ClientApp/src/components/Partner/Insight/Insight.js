import React, {  useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import { Redirect, useRouteMatch } from "react-router-dom";
import './Insight.css';
import { Paper } from '@material-ui/core';
import { GetApi } from '../../../api/ApiConstants';
import authService from '../../api-authorization/AuthorizeService';
import { useDataContext } from '../../Global/GlobalContext';

export default function Insight() {

    let { path } = useRouteMatch();
    const [data, setData] = useState({ visitCount: '0', reviewsCount: '0' });
    const { dcReducer, dataContext } = useDataContext();

    useEffect(() => {

        dcReducer({ type: 'navigate-dashboard', data: { activeAccountLink: 'insight' } });
        authService.getUser().then(res => {

            if (res !== null && res !== undefined) {

                authService.getAccessToken().then(token => {
                    fetch(`${GetApi.GetInsight}/${res.sub}`, {
                        method: 'GET',
                        headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    })
                        .then(response => response.json())
                        .then(result => {
                            if (result != null && result != undefined) {
                                setData(result);

                            }
                             
                        })
                        .catch(error => {
                            console.log(error);
                        });
                });
            }
        });

        return () => { };
    }, []);

    return (
        <div className='container insight-content'>
            <div className='row'>
                <div className='col-12 col-md-6'>
                    <Paper elevation={3} className='insight-card'>
                        <div className='text-center'>
                            <span className='total-visit-title' >TOTAL DE VISITES</span>
                            <br />
                            <br />
                            <span className='total-visit-count'>{data.visitCount}</span>
                        </div>
                    </Paper>
                </div>
                <div className='col-12 col-md-6'>
                    <Paper elevation={3} className='insight-card'>
                        <div className='text-center'>
                            <span className='total-visit-title' >REACTIONS</span>
                            <br />
                            <br />
                            <span className='total-visit-count'>{data.reviewsCount}</span>
                        </div>
                    </Paper>
                </div>
            </div>
        </div>);
}
