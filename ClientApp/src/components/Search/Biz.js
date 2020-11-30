import React, { useState, useEffect } from 'react';
import { Container, Modal, ModalBody } from 'reactstrap';
import { BrowserRouter as Router, Switch, Route, useRouteMatch, Link, useParams } from "react-router-dom";
import { RiErrorWarningLine, RiStore2Line } from 'react-icons/ri';
import { FaHandPaper, FaRegHandPaper, FaExternalLinkAlt, FaPaw, FaCar, FaTv, FaRegCommentAlt } from 'react-icons/fa';
import Rating from '@material-ui/lab/Rating';
import { ImLocation, ImClock, ImWhatsapp } from 'react-icons/im';
import { Pagination } from '@material-ui/lab';
import { Checkbox, FormControl, FormControlLabel, IconButton, Button, Radio, RadioGroup, Divider, CardHeader, Avatar, Popover, Card, Box, CardContent, CardActions, TextField } from '@material-ui/core';
import { GrPrevious, GrNext } from 'react-icons/gr';
import { deviceType } from "react-device-detect";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import './Search.css';
import { BsStarFill, BsBookmark } from 'react-icons/bs';
import { FiPhoneCall, FiLock, FiChevronDown, FiAlertOctagon, FiAlertTriangle, FiCheckCircle, FiUpload, FiDelete, FiTrash } from 'react-icons/fi';
import { BiCalendarCheck, BiGrid } from 'react-icons/bi';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { GetApi, PostApi, baseUrl } from '../../api/ApiConstants';
import {  FaTruck, FaCreditCard, FaBabyCarriage, FaToilet, FaAccessibleIcon, FaChair, FaBicycle,  } from 'react-icons/fa';
import { FiWifi, FiSun, FiHome } from 'react-icons/fi';
import { RiWifiFill, RiMotorbikeFill } from 'react-icons/ri';
import { MdRestaurant, MdRestaurantMenu } from 'react-icons/md';
import {  BiVolumeMute, BiHome } from 'react-icons/bi';
import { AiOutlineShopping } from 'react-icons/ai';
import { BsMusicNote } from 'react-icons/bs';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { useDataContext } from '../Global/GlobalContext';
import authService from '../api-authorization/AuthorizeService';
import { TileLayer, Marker, Popup, MapContainer } from 'react-leaflet';
import L from 'leaflet';
import { GoVerified } from 'react-icons/go';

export default function Biz() {

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 4,


        },
        tablet: {
            breakpoint: { max: 1024, min: 769 },
            items: 3,
        },
        tabletxs: {
            breakpoint: { max: 769, min: 400 },
            items: 2,
        },
        mobile: {
            breakpoint: { max: 400, min: 0 },
            items: 1,

        }
    };

    const [openMakeReview, setOpenMakeReview] = useState(false);
    const [openReport, setOpenReport] = useState(false);
    const [openReportReview, setOpenReportReview] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [currentGallery, setCurrentGallery] = useState(null);
    const [hightlight, setHightLight] = useState(null);
    const [hightlightOpened, setOpenHightlight] = useState(false);
    const [data, setData] = useState(null);
    const [ready, setReady] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPage] = useState(1);
    const { bizId } = useParams();
    const [popPupGallery, setPopUpGallery] = useState([]);
    const { dataContext, dcReducer } = useDataContext();
    const [profile, setProfile] = useState(null);

    const toggleReview = () => setOpenMakeReview(!openMakeReview);
    const toggleReport = () => setOpenReport(!openReport);
    const toggleReportReview = () => setOpenReportReview(!openReportReview);
    const toggleDeleteAlert = () => setOpenDeleteAlert(!openDeleteAlert);
    const [succeed, setSuccessModal] = useState(false);
    const [failed, setFailModal] = useState(false);
    const [place, setPlace] = useState({ title: 'default', lat: 0, long: 0 });


    const toggleSucceed = () => setSuccessModal(!succeed);
    const toggleFailed = () => setFailModal(!failed);

    function getProfile() {

        authService.getUser().then(res => {
           /// console.log(res);
            setProfile(res);
        });
    }

    useEffect(() => {

        setLocation();
        if (bizId === null || bizId === undefined)
            return;

        getProfile();

        fetch(`${GetApi.GetBiz}/${bizId}`, {
            method: 'GET',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json', },
            mode: 'cors',
            cache: 'default',
        })
            .then(response => response.json())
            .then(result => {

                //console.log(result);
                setPage(result.galleryPages);
                setData(result);
                setCurrentGallery(result.bizDetails.album);
                var gallery = [];
                result.bizDetails.album.forEach((photo, i) => {
                    gallery.push({
                        url: photo.photoUrl,
                        price: photo.price,
                        title: photo.title
                    });
                });
                setPopUpGallery(gallery);
                setReviews(result.reviews);
                setHightLight(result.hightLight);
               
               var position = { title: result.bizDetails.businessName, lat: result.bizDetails.lat, long: result.bizDetails.long};

                setPlace(position);

                VisitCounter(); // update shop total visit counter

                setReady(true);
            }).catch(error => console.log(error));
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


    function VisitCounter() {

        fetch(`${PostApi.PostVisitCounter}/${bizId}`, {
            method: 'GET',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json', },
            mode: 'cors',
            cache: 'default',
        })
        .catch(error => console.log(error));
    }


    const changePage = (event, value) => {

        var toSkip = 12 * (value - 1);

        var depthEnd = data.totalGalleryImagesCount - toSkip;

        //check if can load more data forward
        if (value > currentPage && depthEnd <= 0) {
            return;
        }

        if (value === currentPage)
            return;

        fetch(`${GetApi.GetAlbum}/${data.bizDetails.id}/${toSkip}`, {
                        method: 'GET',
                    })
                        .then(response => response.json())
            .then(data => {
                setCurrentGallery(data.currentPhotos);
                var gallery = [];
                data.currentPhotos.forEach((photo, i) => {
                    gallery.push({
                        url: photo.photoUrl,
                        price: photo.price,
                        title: photo.title
                    });
                });
                setPopUpGallery(gallery);
                            setPage(data.pages);
                            setCurrentPage(value);
                        });

    }

    const labels = {
        0.5: 'Perte de temps',
        1: 'Inutile',
        1.5: 'Nul',
        2: 'Mauvais',
        2.5: 'Mediocre',
        3: 'Ok',
        3.5: 'Pas mal',
        4: 'Bon service',
        4.5: 'Excellent',
        5: 'Parfait',
    };
   
    const [motif, setMotif] = useState(1);
    const [motif2, setMotif2] = useState(1);

    const [value, setValue] = useState(2);
    const [hover, setHover] = useState(-1);
   
    function PhotoCard(props) {

        return (<div className='col-6 col-sm-4 col-md-4 col-lg-4 img-card-wrapper'>
            <div onClick={() => {
                var gallery = [];
                currentGallery.forEach((photo, i) => {
                    gallery.push({
                        url: photo.photoUrl,
                        price: photo.price,
                        title: photo.title
                    });
                });
                setPopUpGallery(gallery);
                setPhotoIndex(props.index);
                setIsOpen(true)
            }} className='img-card' style={{ backgroundImage: `url(${props.img.photoUrl})` }}></div>
        </div>);
    }

    function signIn(e) {
        e.preventDefault();
        authService.signIn(window.location.href);
        return false;
    }

    const [review, setReview] = useState(null);
    const [album, setAlbum] = useState([]);
    const [files, setFiles] = useState([]);


    function sendReview() {

        authService.getUser().then(res => {

            if (res !== null && res !== undefined) {

               
                if (files.length >  0) {

                    const formData = new FormData();
                    formData.append('authorId', res.sub);
                    formData.append('text', review);
                    formData.append('rating', value);
                    formData.append('businessId', bizId);
                    formData.append('image1', files[0], 'image1.jpg');
                    formData.append('image2', files.length > 1 ? files[1] : null, 'image2.jpg');
                    authService.getAccessToken().then(token => {
                        fetch(PostApi.PostReview1, {
                            method: 'POST',
                            headers: !token ? {} : { 'Authorization': `Bearer ${token}` },
                            body: formData,
                        })
                            .then(response => {
                                if (response.status === 200) {
                                    // setLoading(false);
                                    toggleSucceed();
                                    toggleReview(false);
                                }
                                else {
                                    //setLoading(false);
                                   toggleFailed();
                                }
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    });
                }
                else
                {

                    const data = {
                        authorId: res.sub,
                        text: review,
                        rating: value,
                        businessId: bizId,
                    };

                    authService.getAccessToken().then(token => {
                        fetch(PostApi.PostReview2, {
                            method: 'POST',
                            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                            body: JSON.stringify(data),
                        })
                            .then(response => {
                                if (response.status === 200) {
                                    
                                    toggleSucceed();
                                    toggleReview(false);
                                }
                                else {
                                    //setLoading(false);
                                    toggleFailed();
                                }
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    });
                }
            }
        });
    }

    function sendPageReport() {
        var toSend = {
            bizId: data === null ? null : data.bizDetails.id,
            authorId: profile === null ? null : profile.sub,
            reason: motif,
        };

        authService.getAccessToken().then(token => {
            fetch(PostApi.PostReportPage, {
                method: 'POST',
                headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(toSend),
            })
                .then(response => {
                    if (response.status === 200) {

                        toggleSucceed();
                        toggleReport(false);
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
    const [reviewId, setReviewId] = useState(null);

    function sendReviewReport() {
        var toSend = {
            bizId: data === null ? null : data.bizDetails.id,
            reviewId:reviewId,
            authorId: profile === null ? null : profile.sub,
            reason: motif2,
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

    function deleteComment() {
        var toSend = {
            reviewId:reviewId,
            userId: profile === null ? null : profile.sub,
        };

        authService.getAccessToken().then(token => {
            fetch(`${GetApi.GetDeleteComment}/${toSend.reviewId}/${toSend.userId}`, {
                method: 'GET',
                headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            })
                .then(response => {
                    if (response.status === 200) {

                        toggleSucceed();
                        toggleDeleteAlert(false);
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

    const [skip, setSkip] = useState(12);
    function loadMoreReview() {
        fetch(`${GetApi.GetMoreReviews}/${data.bizDetails.id}/${skip}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }).then( response => response.json())
            .then(result => {
             
                    var revs = [...reviews];
                    result.forEach((rev, i) => {
                        revs.push(rev);
                    });
                setReviews(revs);
                setSkip(skip + 12);
          
            })
            .catch(error => {
                console.log(error);
            });
    }

    const [hideThisClaim, hideClaim] = useState(false);

   

    function YailloMap() {

        const homeIcon = new L.Icon({
            iconUrl: `https://st6808.ispot.cc/media/marker3.png`,
            iconRetinaUrl: `https://st6808.ispot.cc/media/marker3.png`,
            iconAnchor: [20, 40],
            popupAnchor: [0, -35],
            iconSize: [40, 40],
        });

        const pointerIcon = new L.Icon({
            iconUrl: `https://st6808.ispot.cc/media/marker.png`,
            iconRetinaUrl: `https://st6808.ispot.cc/media/marker.png`,
            iconAnchor: [20, 40],
            popupAnchor: [0, -35],
            iconSize: [40, 40],
        });

        var location = [place.lat, place.long];

        var home = [dataContext.lat, dataContext.long];


        return (<MapContainer center={location} zoom={11}>
                <TileLayer
                    attribution='&amp;copy <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={home} icon={homeIcon}  >
            <Popup>
                   Votre position
                </Popup>
            </Marker>
            <Marker position={location} icon={pointerIcon}  >
                <Popup>
                    {place.title}
                </Popup>
            </Marker>
        </MapContainer>);

    }

    

    function Review(props) {
        var images = props.images === null ? [] : props.images;
        return (
            <div className='col-12 col-md-6 col-lg-4 review-content' >
                <CardHeader
                    avatar={
                        <Avatar aria-label={props.review.authorName} src={props.review.authorProfileUrl} className='author-avatar'></Avatar>
                    }
                    action={
                        profile != null ? <>
                            <IconButton aria-label="settings" onClick={() => { setReviewId(props.review.id); toggleReportReview() }}>
                                <FiAlertOctagon size={17} />
                            </IconButton>
                            {
                                profile.sub === props.review.authorId ? <IconButton onClick={() => { setReviewId(props.review.id); toggleDeleteAlert(); }} aria-label="settings">
                                    <FiTrash size={17} />
                                </IconButton> : null

                        }
                        </>
                    : 
                            <IconButton aria-label="settings" onClick={signIn}>
                                <FiAlertOctagon size={17}  />
                    </IconButton>
                
                    }
                    title={props.review.authorName}
                    subheader={props.review.date}
                />
                <Rating
                    name="read-only"
                    value={props.review.rating}
                    precision={0.5}
                    readOnly
                    style={{ fontSize: `18px` }}
                />
                <p className='review-txt'>{props.review.text}</p>
                <div className='row'>
                    {images.map((img, i) => (<div key={i} className='col-6' ><div onClick={() => {

                        var gallery = [];
                        images.forEach((photo, i) => {
                            gallery.push({
                                url: photo,
                                price:'',
                                title: '',
                            });
                        });
                        setPopUpGallery(gallery);
                        setPhotoIndex(i);
                        setIsOpen(true);
                    }} style={{ backgroundImage: `url(${img})` }} className='review-bg-img'></div></div>))}
                </div>
            </div>);
    }

    function openInNewTab(url) {
        var win = window.open(url, '_blank');
        win.focus();
    }


    return (!ready ? null : <div className='biz-container'>
        <div className='row-full'>
            <div>
                <Carousel

                    responsive={responsive}
                    ssr
                    removeArrowOnDeviceType={["tablet", "mobile"]}
                    deviceType={deviceType}
                    itemClass="image-item"
                    transitionDuration={1000}

                >
                    {hightlight.map((img, i) => (<div key={i} className='biz-img' onClick={() => { setHightLight(hightlight); setPhotoIndex(i); setOpenHightlight(true); }} style={{ backgroundImage: `url(${img})` }}></div>))}
                </Carousel>
            </div>
        </div>
        <div className='container'>
            <div className='row row-biz-name'>
                <h4 className='biz-name'>{data.bizDetails.businessName}{'  '} {data.bizDetails.verified ? <GoVerified className='verified-icon' /> : null}</h4>
            </div>
            <div className='row'>
                <div className='col-12 col-lg-7'>
                    <div className='row justify-container-between'>
                        <div className='col-12 col-md-9'>
                            <div className='row'>
                                <div className='col-3 col-sm-3 biz-hightlight-rating-2'>
                                    <Rating
                                        name="read-only"
                                        value={data.bizDetails.rating}
                                        precision={0.5}
                                        readOnly

                                    />
                                </div>
                                <div className='col-3'>
                                    <span className='biz-hightlight-reviews-2'>{data.bizDetails.reviewsCount}</span>
                                </div>
                            </div>
                            <div className='col-12 availability-div-hightlight-2' >
                                <ImClock className="availability-icon-2" />
                                <span className={data.bizDetails.isOpen ? 'availability-open-2' : 'availability-closed-2'}>{data.bizDetails.status}</span>
                            </div>
                            <div className='col-12 street-div-hightlight-2' >
                                <ImLocation className="street-location-icon-hightlight-2" />
                                <span className='street-location-hightlight-2'>{data.bizDetails.location}</span>
                            </div>
                            <div className='col-12 member-since-div' >
                                <RiStore2Line className="member-since-icon" />
                                <span className='member-since-text'>Membre depuis le {data.joined}</span>
                            </div>
                            <div className='col-12'>
                                <div className='actions-buttons-div'>
                                    <Button variant="contained" href={`tel:${data.bizPhoneNumber}`}  startIcon={<FiPhoneCall />} className='btn-call-biz' >Contacter</Button>
                                    {profile === null ?

                                        (<>
                                            <Button variant="outlined" onClick={signIn} startIcon={<FiAlertOctagon />} className='btn-save-biz' >Signaler</Button>
                                            <Button variant="outlined" onClick={signIn} startIcon={<FaRegCommentAlt />} className='btn-review-biz' >Commenter</Button></>)
                                            :
                                        (<>
                                            <Button variant="outlined" onClick={() => toggleReport()} startIcon={<FiAlertOctagon />} className='btn-save-biz' >Signaler</Button>
                                            <Button variant="outlined" onClick={() => toggleReview()} startIcon={<FaRegCommentAlt />} className='btn-review-biz' >Commenter</Button>
                                        </>)}
                                </div>
                            </div>

                        </div>
                        <div className='col-12 col-lg-11'>
                            {data.isBusinessClaimed || hideThisClaim ? null : <><h4 className='is-the-biz-yours'>Êtes-vous le proprietaire de ce business ?</h4>
                                <div className='row' >
                                    <div >
                                        <Button variant="outlined" className='btn-save-biz' href="/business" >Oui</Button>
                                        <Button variant="outlined" className='btn-save-biz' onClick={() => { hideClaim(true); }} >Non</Button>
                                    </div>
                                </div></>}
                            <div className='container gallery-content-2'>
                                <div className='row gallery-grid'>
                                    {currentGallery.map((img, i) => (<PhotoCard key={i} index={i} img={img} />))}
                                </div>
                                <div className='row gallery-grid-pagination'>
                                    <div className='col-8' >
                                        <Pagination count={pages} shape="rounded" page={currentPage} onChange={changePage} />
                                    </div>
                                </div>
                            </div>
                            {
                                data.services.length > 0 ? (<>
                                    <h4 className='about-the-biz-title'>Services inclus</h4>
                                    <div className='row'>
                                        {data.services.map((ser, i) => (<Service key={i} item={ser} />))}
                                    </div>
                                </>) : null
                            }
                            {
                                data.bizDetails.description === null ? null : 
                                    <>
                                        <h4 className='about-the-biz-title'>À propos de ce business</h4>
                                        <p className='about-the-biz'>
                                            {data.bizDetails.description}
                                        </p>
                                    </>

                            }
                          </div>
                    </div>
                </div>
                <div className='col-12 col-lg-4'>
                    <div className='opening-hours-div'>
                        <div className='row'>
                            <div className='col-12'>
                                <h4 className='text-center'>Horaires</h4>
                            </div>
                            {data.openingHours.map((time, i) => (
                                i === 0 ? null :
                                    (<div key={i} className='col-12'>
                                        <div className='row justify-content-center'>
                                            <div className='col-5 day-of-week' >
                                                <span>{time.day}</span>
                                            </div>
                                            <div className='col-5 time-of-day' >
                                                {time.isOpened ? <span>{time.from} - {time.to}</span> : <span>Fermé</span>}
                                            </div>
                                        </div>
                                    </div>)
                            ))}
                            <div className='col-12'>
                                <div className='row justify-content-center'>
                                    <div className='col-5 day-of-week' >
                                        <span>Dimanche</span>
                                    </div>
                                    <div className='col-5 time-of-day' >
                                        {data.openingHours[0].isOpened ? <span>{data.openingHours[0].from} - {data.openingHours[0].to}</span> : <span>Fermé</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='email-n-phone'>
                        <div className='row justify-content-center'>
                            {
                                data.bizEmailAddress === "default@gmail.com" || data.bizEmailAddress === null ? null : (<div className='col-12 email-n-phone-1' >
                                    <FaExternalLinkAlt style={{ fontSize: `21px` }} /> <a href={`mailto:${data.bizEmailAddress}`} className='email-n-phone-link' > {data.bizEmailAddress}</a>
                                </div>)
                            }
                        </div>
                    </div>

                    <div className='email-n-phone'>
                        <div className='row justify-content-center'>
                            <div className='col-12 map-container'>
                                <YailloMap />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            {
                reviews.length === 0 ? null :
                    (<div className='row biz-reviews'>
                        <div className='col-12'>
                            <h4 className='about-the-biz-title'>Commentaires</h4>
                        </div>
                        {reviews.map((rev, i) => (<Review key={i} review={rev} images={rev.picturesUrls} />))}
                        <div className='col-12'>
                            <br />
                            <br />
                            {
                                reviews.length < 1 ? null : <Button variant="outlined"
                                    className="btn-create-delivery-man random-category-text" onClick={() => loadMoreReview() } >Lire plus de commentaires</Button>
                            }
                            
                        </div>
                    </div>)            
            }
        </div>
        {isOpen && (
            <Lightbox
                mainSrc={popPupGallery[photoIndex].url}
                nextSrc={popPupGallery[(photoIndex + 1) % popPupGallery.length].url}
                imageTitle={<span className='item-title'>{popPupGallery[photoIndex].title}</span>}
                imageCaption={<span className='item-price'>{popPupGallery[photoIndex].price}</span>}
                prevSrc={popPupGallery[(photoIndex + popPupGallery.length - 1) % popPupGallery.length].url}
                onCloseRequest={() => setIsOpen(false)}
                onMovePrevRequest={() => {

                    var newIndex = (photoIndex + popPupGallery.length - 1) % popPupGallery.length;
                    setPhotoIndex(newIndex);
                }
                }
                onMoveNextRequest={() => {

                    var newIndex = (photoIndex + popPupGallery.length + 1) % popPupGallery.length;
                    setPhotoIndex(newIndex);
                }
                }
            />
        )}
        {hightlightOpened && (
            <Lightbox
                mainSrc={hightlight[photoIndex]}
                nextSrc={hightlight[(photoIndex + 1) % hightlight.length]}
                prevSrc={hightlight[(photoIndex + hightlight.length - 1) % hightlight.length]}
                onCloseRequest={() => setOpenHightlight(false)}
                onMovePrevRequest={() => {

                    var newIndex = (photoIndex + hightlight.length - 1) % hightlight.length;
                    setPhotoIndex(newIndex);
                }
                }
                onMoveNextRequest={() => {

                    var newIndex = (photoIndex + hightlight.length + 1) % hightlight.length;
                    setPhotoIndex(newIndex);
                }
                }
            />
        )}

        <Modal isOpen={openMakeReview} toggle={toggleReview} className="make-review-modal">
            <ModalBody>
                <div className='container'>
                    <div className='row'>
                        <CardHeader
                            avatar={
                                <Avatar alt={profile != null ? `${profile.given_name}` : 'D'} className='review-avatar' src={profile != null ? `${profile.profile_pic}` : null} />
                    }
                            title={profile != null ? `${profile.given_name}` : null}
                            subheader={data.bizDetails.location}
                        />
                    </div>
                    <div className='row'>
                            <Rating
                                name="hover-feedback"
                                value={value}
                                precision={0.5}
                                onChange={(event, newValue) => {
                                    setValue(newValue);
                                }}
                                onChangeActive={(event, newHover) => {
                                    setHover(newHover);
                                }}
                            />
                            {value !== null && <Box ml={2}>{labels[hover !== -1 ? hover : value]}</Box>}
                    </div>
                    <div className='row' style={{ marginTop:`20px` }} >
                        <div className='col-12'>
                            <TextField
                                label="Votre avis sur ce business"
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                multiline
                                rows={5}
                                style={{ width: `100%` }}
                                onChange={(e) => { setReview(e.target.value) }}
                            />
                        </div>
                    </div>
                    <div className='row' style={{ marginTop: `15px` }} >
                        <div className='col-12'>
                            <input
                                accept="*/image"
                                className="input-upload"
                                id="button-add-img-review"
                                type="file"
                                onChange={(e) => {
                                    
                                    if (files.length === 2)
                                        return;

                                    var mock1 = [...files];
                                    var mock2 = [...album];

                                    mock1.push(e.target.files[0]);
                                    setFiles(mock1);

                                    var imgUrl = URL.createObjectURL(e.target.files[0]);
                                    mock2.push(imgUrl);
                                    setAlbum(mock2);
                                }}
                            />
                            <Button startIcon={<FiUpload />} color="default" onClick={() => { document.getElementById("button-add-img-review").click(); }} variant="contained" >Upload</Button>
                        </div>
                    </div>
                    <div className='row' style={{ marginTop: `15px` }} >
                        {album.length > 0 ? album.map((img, i) => (
                            <div key={i} className='col-6 img-card-wrapper'>
                                <div className='img-card' style={{ backgroundImage: `url(${img})` }}></div>
                            </div>)) : null}
                    </div>
                    <div className='row' style={{ marginTop: `10px` }} >
                        <div className='col-12'>
                            <Button className='btn-send-review' onClick={() => { sendReview(); }} variant="contained" >Commenter</Button>
                        </div>
                    </div>
  </div>
        </ModalBody>
        </Modal>

        <Modal isOpen={openReport} toggle={toggleReport} className="make-report-modal">
            <ModalBody>
                <div className='container'>
                    <div className='row' style={{ marginTop: `20px` }} >
                        <div className='col-12'>
                            <h6>Pour quelle raison signalez-vous cette page ?</h6>
                        </div>
                    </div>
                    <div className='row' style={{ marginTop: `20px` }} >
                        <div className='col-12' >
                            <FormControl component="fieldset">
                                <RadioGroup name="motif" value={motif} onChange={(e) => { setMotif(parseInt(e.target.value)); }}>
                                    <FormControlLabel value={1} control={<Radio />} label="Contenu inapproprié" />
                                    <FormControlLabel value={2} control={<Radio />} label="Arnaques" />
                                    <FormControlLabel value={3}  control={<Radio />} label="Autre raison" />
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </div>
                    <div className='row' style={{ marginTop: `20px` }} >
                        <div className='col-12'>
                            <Button className='btn-send-review' onClick={() => { sendPageReport(); }} variant="contained" >Signaler</Button>
                        </div>
                    </div>
                </div>
                </ModalBody>
        </Modal>
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
                                <RadioGroup name="motif2" value={motif2} onChange={(e) => { setMotif2(parseInt(e.target.value)); }}>
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
        <Modal isOpen={openDeleteAlert} toggle={toggleDeleteAlert} className='modal-success'>
            <ModalBody>
                <div className='container'>
                    <div className='row justify-content-center'>
                        <div className='col-12'>
                            <h4 className='text-center'><FiAlertTriangle className='modal-state-icon-failed' /></h4>
                            <h5 className='text-center modal-state-txt'>Voulez-vous supprimer ce commentaire ?</h5>
                            <br/>
                            <h4 className='text-center'>
                                <Button color="default" variant="contained" onClick={() => { deleteComment(); }} className='btn-send-review'  >Oui</Button>
                                <Button color="default" variant="contained" onClick={toggleDeleteAlert} style={{marginLeft:`10px`}} >Non</Button>
                            </h4>
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


function getIcon(amenitieId) {

    var element = <FaTruck />;
    icons.map((icon, i) => {

        if (icon.id === amenitieId) {
            element = icon.component;
        }
    });

    return element;

}

function Service(props) {

    return (
            <div className='col-6'>
                <FormControl>
                <span className='service-span' ><span className='synopsys-icon' >{getIcon(props.item.amenitieId)}</span> {props.item.name}</span>
                </FormControl>
           </div>
       );

}

const icons = [
    {
        id: 20,
        name: 'home-service',
        component: <BiHome />
    },
    {
        id: 5,
        name: 'reservations',
        component: <BiCalendarCheck />
    },
    {
        id: 13,
        name: 'disabled-people',
        component: <FaAccessibleIcon />
    },
    {
        id: 7,
        name: 'toilets',
        component: <FaToilet />
    },
    {
        id: 18,
        name: 'kids-friendly',
        component: <FaBabyCarriage />
    },
    {
        id: 6,
        name: 'has-tv',
        component: <FaTv />
    },
    {
        id: 4,
        name: 'outdoor',
        component: <FiSun />
    },
    {
        id: 10,
        name: 'credit-card',
        component: <FaCreditCard />
    },
    {
        id: 2,
        name: 'free-wifi',
        component: <RiWifiFill />
    },
    {
        id: 17,
        name: 'pets-friendly',
        component: <FaPaw />
    },
    {
        id: 8,
        name: 'vegan-menu',
        component: <MdRestaurant />
    },
    {
        id: 11,
        name: '2-wheels-parking',
        component: <RiMotorbikeFill />
    },
    {
        id: 9,
        name: 'waiter-service',
        component: <MdRestaurantMenu />
    },
    {
        id: 19,
        name: 'high-safety',
        component: <FiLock />
    },
    {
        id: 14,
        name: 'calm-place',
        component: <BiVolumeMute />
    },
    {
        id: 3,
        name: 'take-away',
        component: <HiOutlineShoppingBag />
    },
    {
        id: 16,
        name: 'seats',
        component: <FaChair />
    },
    {
        id: 15,
        name: 'ambiant-music',
        component: <BsMusicNote />
    },
    {
        id: 12,
        name: '4-wheels-parking',
        component: <FaCar />
    },
    {
        id: 1,
        name: 'home-delivery',
        component: <FaTruck />
    },
];


//<div className='col-12 email-n-phone-2' >
//    <FiPhoneCall style={{ fontSize: `21px` }} /> <a href={`tel:${data.bizPhoneNumber}`} className='email-n-phone-link' >{data.bizPhoneNumber}</a>
//</div>