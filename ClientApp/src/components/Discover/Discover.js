import React, { Component, useState, useEffect } from 'react';
import {
    Container,
    CardHeader,
    CardContent,
    CardActions,
    Avatar,
    Button,
    IconButton,
    Radio,
    RadioGroup,
    FormControl,
    FormControlLabel

} from '@material-ui/core';
import { Modal, ModalBody } from "reactstrap";
import './Discover.css';
import { deviceType } from "react-device-detect";
import { ImLocation } from "react-icons/im";
import { FiChevronDown, FiCheckCircle, FiAlertTriangle, FiAlertOctagon } from "react-icons/fi";
import Rating from '@material-ui/lab/Rating';
import { Link, useParams } from 'react-router-dom';
import { GetApi, PostApi } from '../../api/ApiConstants';
import authService from '../api-authorization/AuthorizeService';
import { useDataContext } from '../Global/GlobalContext';

export default function Discover() {

    const { dataContext, dcReducer } = useDataContext();
    const [openReportReview, setOpenReportReview] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [profile, setProfile] = useState(null);
    const [skip, setSkip] = useState(0);
    const { city } = useParams();
    const toggleReportReview = () => setOpenReportReview(!openReportReview);
    const [succeed, setSuccessModal] = useState(false);
    const [failed, setFailModal] = useState(false);

    const toggleSucceed = () => setSuccessModal(!succeed);
    const toggleFailed = () => setFailModal(!failed);


    function signIn(e) {
        e.preventDefault();
        authService.signIn(window.location.href);
        return false;
    }

    useEffect(() => {

        if (city === undefined || city === null)
            return;


        setLocation();

        authService.getUser().then(result => setProfile(result));

        fetch(`${GetApi.GetLocal}/${city}/${skip}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }).then(response => response.json())
            .then(result => {
                console.log(result);
                var revs = [...reviews];
                result.forEach((rev, i) => {
                    revs.push(rev);
                });
                setReviews(revs);
                setSkip(skip + 16);

            })
            .catch(error => {
                console.log(error);
            });
        return () => { };
    }, []);

    function setLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getCoords);
        }
        else {
            getDefaultCoords();
        }

    }

    function getCoords(position) {

        dcReducer({ type: "set-coordinates", data: { lat: position.coords.latitude, long: position.coords.longitude } });
    }

    const getDefaultCoords = async () => {

        const result = await fetch("//freegeoip.app/json/");
        const json = await result.json();
        dcReducer({ type: "set-default-coordinates", data: { lat: json.latitude, long: json.longitude } });
    }

    const [reviewId, setReviewId] = useState(null);
    const [bizId, setBizId] = useState(null);
    const [motif, setMotif] = useState(1);
    function sendReviewReport() {
        var toSend = {
            bizId: bizId,
            reviewId: reviewId,
            authorId: profile === null ? null : profile.sub,
            reason: motif,
        };

        authService.getAccessToken().then(token => {
            fetch(PostApi.PostReportReview, {
                method: 'POST',
                headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(toSend),
            })
                .then(response => {
                    if (response.status === 200) {

                        toggleSucceed();
                        toggleReportReview(false);
                    }
                    else {
                        toggleFailed();
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        });
    }


    function loadMoreReview() {
        if (city === undefined || city === null)
            return;

        fetch(`${GetApi.GetLocal}/${city}/${skip}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }).then(response => response.json())
            .then(result => {

                var revs = [...reviews];
                result.forEach((rev, i) => {
                    revs.push(rev);
                });
                setReviews(revs);
                setSkip(skip + 16);

            })
            .catch(error => {
                console.log(error);
            });
    }

    function openInNewTab(url) {
        var win = window.open(url, '_blank');
        win.focus();
    }

    function Review(props) {
        return (
            <div className='col-12 col-sm-6 col-md-4 col-lg-3'>
                <div className='review-card'>
                    <div className='row'>
                        <div className='col-12' >
                            <CardHeader
                                avatar={
                                    <Avatar aria-label={props.rev.authorName} src={props.rev.authorProfileUrl} className='author-avatar'></Avatar>
                                }
                                action={
                                    profile != null ? <>
                                        <IconButton aria-label="settings" onClick={() => { setReviewId(props.rev.id); setBizId(props.rev.bizId); toggleReportReview(); }}>
                                            <FiAlertOctagon size={17} />
                                        </IconButton>
                                    </>
                                        :
                                        <IconButton aria-label="settings" onClick={signIn}>
                                            <FiAlertOctagon size={17} />
                                        </IconButton>

                                }
                                title={props.rev.authorName}
                                subheader={props.rev.date}
                            />
                        </div>
                    </div>
                    {
                        props.rev.picturesUrls.length > 0 ? <div className='row'>
                            <div className='col-12' >
                                <div className='item-bg-2' style={{ backgroundImage: `url(${props.rev.picturesUrls[0]})` }}>
                                </div>
                            </div>
                        </div> : null
                    }
                    <div className='row justify-content-between'>
                        <div className='col-5'>
                            <Rating style={{ marginTop: `10px`, fontSize:`16px` }} name="half-rating-read" value={props.rev.rating} readOnly />
                        </div>
                    </div>
                    <div className='row justify-content-between'>
                        <div className='col-12'>
                            <p className='item-title-2'>{props.rev.text}</p>
                        </div>
                    </div>
                </div>
                <div className='row-see-biz'>
                    <div className='col-12'>
                        <h6 className='text-center'><div style={{ cursor: `pointer` }} onClick={() => { openInNewTab(`/biz/${city}/${props.rev.bizId}`); }} className='see-biz-text' >Voir ce business</div></h6>
                    </div>
                </div>
            </div>
        );
    }

    return (<div className='container-fluid discover-content'>
        <div className='row'>
             {reviews.map((rev, i) => ( <Review rev={rev} key={i} /> ))}
        </div>
        <div className='col-12'>
            <br />
            <br />
            <h6 className='text-center'> <Button variant="outlined"
                className="btn-create-delivery-man random-category-text" onClick={() => loadMoreReview() } >Voir plus d'activités</Button></h6>
            <br />
            <br />
    </div>
        <Modal isOpen={openReportReview} toggle={toggleReportReview} className="make-report-modal">
            <ModalBody>
                <div className='container'>
                    <div className='row' style={{ marginTop: `20px` }} >
                        <div className='col-12'>
                            <h6>Pour quelle raison signalez-vous ce commentaire ?</h6>
                        </div>
                    </div>
                    <div className='row' style={{ marginTop: `20px` }} >
                        <div className='col-12' >
                            <FormControl component="fieldset">
                                <RadioGroup name="motif2" value={motif} onChange={(e) => { setMotif(parseInt(e.target.value)); }}>
                                    <FormControlLabel value={1} control={<Radio />} label="Commentaire inapproprié" />
                                    <FormControlLabel value={2} control={<Radio />} label="Commentaire mensonger" />
                                    <FormControlLabel value={3} control={<Radio />} label="Ce commentaire est un spam" />
                                    <FormControlLabel value={4} control={<Radio />} label="Autre raison" />
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </div>
                    <div className='row' style={{ marginTop: `20px` }} >
                        <div className='col-12'>
                            <Button className='btn-send-review' onClick={() => { sendReviewReport(); }} variant="contained" >Signaler</Button>
                        </div>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    <Modal isOpen={succeed} fade={false} toggle={toggleSucceed} className='modal-success'>
        <ModalBody>
            <div className='container'>
                <div className='row'>
                    <div className='col-12'>
                        <h4 className='text-center'><FiCheckCircle className='modal-state-icon-succeed' /></h4>
                        <h4 className='text-center modal-state-txt'>Opération réussie !</h4>
                        <h4 className='text-center'><Button color="default" variant="contained" onClick={toggleSucceed} className='modal-state-btn-close'>Ok, j'ai compris</Button></h4>
                    </div>
                </div>
            </div>
        </ModalBody>
    </Modal>
    <Modal isOpen={failed} fade={false} toggle={toggleFailed} className='modal-failed'>
        <ModalBody>
            <div className='container'>
                <div className='row'>
                    <div className='col-12'>
                        <h4 className='text-center'><FiAlertTriangle className='modal-state-icon-failed' /></h4>
                        <h4 className='text-center modal-state-txt'>Oops ! Opération échouée.</h4>
                        <h4 className='text-center'><Button color="default" variant="contained" onClick={toggleFailed} className='modal-state-btn-close'>Ok, j'ai compris</Button></h4>
                    </div>
                </div>
            </div>
        </ModalBody>
    </Modal>
       </div>);
}

