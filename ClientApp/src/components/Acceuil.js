import React, { Component, useState, useReducer, useContext, useEffect } from 'react';
import {
    Container,
    CardHeader,
    CardContent,
    CardActions,
    Avatar,
    Button,
    IconButton

} from '@material-ui/core';
import './Home.css';
import Carousel from "react-multi-carousel";
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import "react-multi-carousel/lib/styles.css";
import { deviceType } from "react-device-detect";
import { ImLocation } from "react-icons/im";
import { GoLaw } from "react-icons/go";
import { BsPentagonHalf, BsBuilding } from "react-icons/bs";
import { FiChevronDown, FiTv, FiLock, FiShoppingBag } from "react-icons/fi";
import { RiShirtLine, RiFridgeLine, RiRuler2Line, RiHotelBedLine } from "react-icons/ri";
import { GiBrickWall, GiHealthNormal, GiHomeGarage, GiTap, GiLipstick, GiShoppingCart } from "react-icons/gi";
import { ImLab, ImTruck, ImKey } from "react-icons/im";
import { AiFillCar, AiOutlineHome } from "react-icons/ai";
import { MdComputer, MdPhonelinkSetup, MdBuild, MdKeyboardVoice, MdRestaurant } from "react-icons/md";
import { BiBuildingHouse, BiCalendarStar, BiBasketball, BiCodeAlt, BiMaleSign, BiFemaleSign, BiShoppingBag } from "react-icons/bi";
import { CgGirl } from "react-icons/cg";
import { FcBriefcase } from "react-icons/fc";
import { FaRegMoneyBillAlt, FaBullhorn, FaRegStar, FaPaw, FaTooth, FaIceCream, FaTshirt, FaPlaneDeparture, FaBone, FaBook, FaCut, FaShoePrints, FaBaby, FaBriefcaseMedical, FaGraduationCap, FaChair, FaRegLightbulb, FaCocktail, FaVolleyballBall } from "react-icons/fa";
import Rating from '@material-ui/lab/Rating';
import Flag from 'react-world-flags';
import { Link, useParams } from 'react-router-dom';
import { useDataContext } from './Global/GlobalContext';
import authService from './api-authorization/AuthorizeService';
import { GetApi } from '../api/ApiConstants';


export default function Accueil() {

    const [modalCategories, setModalCategories] = useState(false);
    const toggleCategories = () => {
        setModalCategories(!modalCategories);
    };

    const { city } = useParams();

    const pros = [{
        id: 0,
        title: "Cabinets d'avocats & juristes",
        image: 'https://st6808.ispot.cc/media/lawyers.jpg',
        number: 317,
        link: `/recherche/${city}/21/0/default`
    },
    {
        id: 1,
        title: "Agences immobilières",
        image: 'https://st6808.ispot.cc/media/building.jpg',
        number: 661,
        link: `/recherche/${city}/38/0/default`
    },
    {
        id: 2,
        title: "Experts en Marketing",
        image: 'https://st6808.ispot.cc/media/marketing.jpg',
        number: 224,
        link: `/recherche/${city}/50/0/default`
    },
    {
        id: 3,
        title: "Développeurs web et mobiles",
        image: 'https://st6808.ispot.cc/media/webdev.png',
        number: 582,
        link: `/recherche/${city}/19/0/default`
    }
        , {
        id: 4,
        title: "Graphistes 2D/3D et Logos",
        image: 'https://st6808.ispot.cc/media/design.jpg',
        number: 710,
        link: `/recherche/${city}/20/0/default`
    },
    {
        id: 5,
        title: 'Géomètres/Topographes',
        image: 'https://st6808.ispot.cc/media/topograph.jpg',
        number: 160,
        link: `/recherche/${city}/23/0/default`
    }
        ,
    {
        id: 6,
        title: "Laboratoires d'analyses (LAM)",
        image: 'https://st6808.ispot.cc/media/laboratories.png',
        number: 98,
        link: `/recherche/${city}/29/0/default`
    },
    {
        id: 7,
        title: 'Beatmaking et enregistrements',
        image: 'https://st6808.ispot.cc/media/record.jpg',
        number: 192,
        link: `/recherche/${city}/22/0/default`
    },
    {
        id: 8,
        title: 'Artistes Make-Up (MUA)',
        image: 'https://st6808.ispot.cc/media/makeup.jpg',
        number: 450,
        link: `/recherche/${city}/18/0/default`
    },
    {
        id: 9,
        title: "Collèges et lycées",
        image: 'https://st6808.ispot.cc/media/schools.png',
        number: 317,
        link: `/recherche/${city}/13/0/default`
    },
    {
        id: 10,
        title: "Salles de fêtes",
        image: 'https://st6808.ispot.cc/media/partyroom.jpg',
        number: 661,
        link: `/recherche/${city}/7/0/default`
    },
    {
        id: 11,
        title: "Pharmacies & Centres de santé",
        image: 'https://st6808.ispot.cc/media/pharmacies.jpg',
        number: 224,
        link: `/recherche/${city}/9/0/default`
    },
    {
        id: 12,
        title: "Hôpitaux & Cliniques",
        image: 'https://st6808.ispot.cc/media/hospitals.jpg',
        number: 582,
        link: `/recherche/${city}/28/0/default`
    }
        , {
        id: 13,
        title: "Vétérinaires",
        image: 'https://st6808.ispot.cc/media/vets.jpg',
        number: 710,
        link: `/recherche/${city}/26/0/default`
    },
    {
        id: 14,
        title: 'Menuisiers & meubliers',
        image: 'https://st6808.ispot.cc/media/decoration.jpg',
        number: 160,
        link: `/recherche/${city}/35/0/default`
    }
        ,
    {
        id: 15,
        title: "Électriciens",
        image: 'https://st6808.ispot.cc/media/appliance.jpg',
        number: 98,
        link: `/recherche/${city}/42/0/default`
    },
    {
        id: 17,
        title: 'Dentistes',
        image: 'https://st6808.ispot.cc/media/dentist.jpg',
        number: 450,
        link: `/recherche/${city}/30/0/default`
    }];

    const bizs = [{
        id: 1,
        title: "Plomberie",
        image: 'https://st6808.ispot.cc/media/plumber.jpg',
        link: `/recherche/${city}/36/0/default`
    },
    {
        id: 2,
        title: "Salons de coiffure",
        image: 'https://st6808.ispot.cc/media/barbershop.png',
        link: `/recherche/${city}/10/0/default`
    },
    {
        id: 3,
        title: "Réparateurs",
        image: 'https://st6808.ispot.cc/media/repairs.jpg',
        link: `/recherche/${city}/46/0/default`
    },
    {
        id: 4,
        title: "Hotels et Appartements",
        image: 'https://st6808.ispot.cc/media/hotel.jpg',
        link: `/recherche/${city}/5/0/default`
    },
    {
        id: 5,
        title: "Laveries",
        image: 'https://st6808.ispot.cc/media/carwash.jpg',
        link: `/recherche/${city}/48/0/default`
    },
    {
        id: 6,
        title: "Salons de beauté",
        image: 'https://st6808.ispot.cc/media/beautysalon.jpg',
        link: `/recherche/${city}/11/0/default`
    },
    {
        id: 7,
        title: "Crèches et Maternelles",
        image: 'https://st6808.ispot.cc/media/nursery.jpg',
        link: `/recherche/${city}/16/0/default`
    },
    {
        id: 8,
        title: "Snack-bars & Boîtes de nuit",
        image: 'https://st6808.ispot.cc/media/snacks.jpg',
        link: `/recherche/${city}/4/0/default`
    },
    {
        id: 10,
        title: "Restaurants et fast-food",
        image: 'https://st6808.ispot.cc/media/restaurant.jpg',
        link: `/recherche/${city}/1/0/default`
    },
    ]

    const { dataContext, dcReducer } = useDataContext();
    const [profile, setProfile] = useState(null);
    const [professionals, setPros] = useState(pros);
    const [biz, setBiz] = useState(bizs);
    const [ready, setReady] = useState(false);
    const [model, setModel] = useState(null);

    useEffect(() => {
        
        if (city === undefined || city === null) {

            fetch(`${GetApi.GetSuggestions}/douala`, {
                method: 'GET',
                headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                mode: 'cors',
                cache: 'default',
            })
                .then(response => response.json())
                .then(data => {
                    setModel(data);
                    setReady(true);
                }).catch(error => console.log(error));


        }
        else {
            fetch(`${GetApi.GetSuggestions}/${city}`, {
                method: 'GET',
                headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                mode: 'cors',
                cache: 'default',
            })
                .then(response => response.json())
                .then(data => {
                    setModel(data);
                    setReady(true);
                }).catch(error => console.log(error));

        }


        setLocation();
        var randomsPros = getRandom(pros, 8);
        var randomsBiz = getRandom(bizs, 4);
        setBiz(randomsBiz);
        setPros(randomsPros);
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

    const responsivePro = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,


        },
        tablet: {
            breakpoint: { max: 1024, min: 769 },
            items: 3,
        },
        tabletxs: {
            breakpoint: { max: 769, min: 400 },
            items: 1,
        },
        mobile: {
            breakpoint: { max: 400, min: 0 },
            items: 1,

        }
    };


    function Review(props) {
        return (
            <div className='container'>
                <div className='row'>
                    <div className='col-12' >
                        <CardHeader
                            avatar={
                                <Avatar aria-label={props.rev.authorName} src={props.rev.authorProfileUrl} className='author-avatar'></Avatar>
                            }
                            title={props.rev.authorName}
                            subheader={props.rev.date}
                        />
                    </div>
                </div>
                {
                    props.rev.picturesUrls.length === 0 ? null :
                        <div className='row'>
                            <div className='col-12' >
                                <div className='item-bg' style={{ backgroundImage: `url(${props.rev.picturesUrls[0]})` }}>
                                </div>
                            </div>
                        </div>
                }
                <div className='row justify-content-between'>
                    <div className='col-5'>
                        <Rating name="half-rating-read" value={props.rev.rating} readOnly />
                    </div>
                    <div className='col-3 item-rating'>
                    </div>
                </div>
                <div className='row justify-content-between'>
                    <div className='col-12'>
                        <p className='item-title text-truncate'>{props.rev.text}</p>
                    </div>
                </div>
                <div className='row-see-biz'>
                    <div className='col-12'>
                        <h6 className='text-center'><Link to={`/biz/${city}/${props.rev.bizId}`} className='see-biz-text' >Voir ce business</Link></h6>
                    </div>
                </div>
            </div>
        );
    }

    return (
        !ready ? null :

            <div className='home-content'>
                <div>

                    {
                        model.items.length === 0 ? null :

                            <div className='container-fluid'>
                                <div className='row'>
                                    <div className='col-12 col-md-12 col-lg-6'>
                                        <div className='title-1'>
                                            <br />
                                            Les meilleurs coins et services<br />
                                            de ta ville sont sur Yaillo !
                                          </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-12 home-promo-top-items'>
                                        <div className='row'>
                                            {
                                                model.items.map((item, i) => (

                                                    <div key={i} className='col-12 col-md-6 col-lg-4 col-xl-3 top-item-container'>
                                                        <Link to={`/biz/${city}/${item.id}`} >
                                                            <span className='home-top-item-name'>{item.businessName}</span>
                                                            <div className='top-item' style={{ backgroundImage: `url(${item.urlsPictures[0]})` }} >
                                                            </div>
                                                            <div className='col-12 street-div' >
                                                                <ImLocation className="street-location-icon" />
                                                                <span className='home-street-location'>{item.location}</span>
                                                            </div>
                                                        </Link>
                                                    </div>

                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                    }

                    <div className='container'>
                        <div className='row justify-content-center categories-row'>
                            <div className='col-12'>
                                <h3 className='text-center title-1'>Business par catégories</h3>
                                <br />
                                <br />
                            </div>
                            <div className='col-12 col-sm-6 col-md-4 col-lg-3'>
                                <div className='category-card'>
                                    <a href={`/recherche/${city}/1/0/default`}>
                                        <h6 className='text-center'>
                                            <img className='category-img' src={'https://st6808.ispot.cc/media/burger-logo.jpg'} />
                                        </h6>
                                        <h6 className='text-center category-text'>Restaurants & Fast-food</h6>
                                    </a>
                                </div>
                            </div>
                            <div className='col-12 col-sm-6 col-md-4 col-lg-3'>
                                <div className='category-card'>
                                    <a href={`/recherche/${city}/2/0/default`}>
                                        <h6 className='text-center'>
                                            <img className='category-img' src={'https://st6808.ispot.cc/media/shopping-logo.png'} />
                                        </h6>
                                        <h6 className='text-center category-text'>Shopping</h6>
                                    </a>
                                </div>
                            </div>
                            <div className='col-12 col-sm-6 col-md-4 col-lg-3'>
                                <div className='category-card'>
                                    <a href={`/recherche/${city}/3/0/default`} >
                                        <h6 className='text-center'>
                                            <img className='category-img' src={'https://st6808.ispot.cc/media/groceries-logo.png'} />
                                        </h6>
                                        <h6 className='text-center category-text'>Épiceries</h6>
                                    </a>
                                </div>
                            </div>
                            <div className='col-12 col-sm-6 col-md-4 col-lg-3'>
                                <div className='category-card'>
                                    <a href={`/recherche/${city}/4/0/default`}>
                                        <h6 className='text-center'>
                                            <img className='category-img' src={'https://st6808.ispot.cc/media/apero-logo.png'} />
                                        </h6>
                                        <h6 className='text-center category-text'>Bars & Boîtes de nuit</h6>
                                    </a>
                                </div>
                            </div>
                            <div className='col-12 col-sm-6 col-md-4 col-lg-3'>
                                <div className='category-card'>
                                    <a href={`/recherche/${city}/6/0/default`}>
                                        <h6 className='text-center'>
                                            <img className='category-img' src={'https://st6808.ispot.cc/media/ball-logo.png'} />
                                        </h6>
                                        <h6 className='text-center category-text'>Art & Divertissement</h6>
                                    </a>
                                </div>
                            </div>
                            <div className='col-12 col-sm-6 col-md-4 col-lg-3'>
                                <div className='category-card'>
                                    <a href={`/recherche/${city}/8/0/default`}>
                                        <h6 className='text-center'>
                                            <img className='category-img' src={'https://st6808.ispot.cc/media/car-repair.png'} />
                                        </h6>
                                        <h6 className='text-center category-text'>Mécano-automobiles</h6>
                                    </a>
                                </div>
                            </div>
                            <div className='col-12 col-sm-6 col-md-4 col-lg-3'>
                                <div className='category-card'>
                                    <a href={`/recherche/${city}/5/0/default`}>
                                        <h6 className='text-center'>
                                            <img className='category-img' src={'https://st6808.ispot.cc/media/building-logo.png'} />
                                        </h6>
                                        <h6 className='text-center category-text'>Hotels & Appartements</h6>
                                    </a>
                                </div>
                            </div>
                            <div className='col-12 col-sm-6 col-md-4 col-lg-3'>
                                <div className='category-card'>
                                    <a href={`/recherche/${city}/9/0/default`} >
                                        <h6 className='text-center'>
                                            <img className='category-img' src={'https://st6808.ispot.cc/media/pharma-logo.png'} />
                                        </h6>
                                        <h6 className='text-center category-text'>Pharmacies</h6>
                                    </a>
                                </div>
                            </div>
                            <div className='col-12'>
                                <br />
                                <br />
                                <h6 className='text-center'><Button variant="outlined"
                                    className="btn-create-delivery-man random-category-text" onClick={toggleCategories}><FiChevronDown /> Voir toutes les categories</Button></h6>
                            </div>
                        </div>
                    </div>

                    {
                        model.reviews.length === 0 ? null :

                            <>
                                <div className='container reviews-home-container'>
                                    <div className='row justify-content-between'>
                                        <div className='col-md-8 col-xl-8'>
                                            <div className='title-1'>
                                                <br />
                                                <br />
                                                <br />
                                                <span>Forgez vous une idée</span>
                                                <br />
                                                <span>grâce aux commentaires des clients dans votre région.</span>
                                                <br />
                                                <br />
                                            </div>
                                        </div>
                                        <div className='col-md-3 col-xl-2'>
                                            <div>
                                                <br />
                                                <br />
                                                <br />
                                                <br />
                                                <br />
                                                <br />
                                                <br />
                                                <Button variant="outlined" className="btn-see-more" href={`/activite/${city}`}  >Voir plus</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='container-fluid reviews-home-container'>
                                    <div className='row'>
                                        <div className='col-12'>
                                            <Carousel

                                                responsive={responsive}
                                                ssr
                                                removeArrowOnDeviceType={["tablet", "mobile"]}
                                                deviceType={deviceType}
                                                itemClass="image-item"
                                                transitionDuration={1000}

                                            >
                                                {model.reviews.map((rev, i) => (<Review rev={rev} key={i} />))}
                                            </Carousel>
                                        </div>
                                    </div>
                                </div>
                            </>

                    }

                    <div className='container-fluid'>
                        <div className='row justify-content-center random-categories-row'>
                            <div className='col-12'>
                                <h2 className='text-center title-1'>
                                    Les business essentiels dans votre ville sont sur Yaillo !
                          </h2>
                                <br />
                                <br />
                                <br />
                            </div>
                            {
                                biz.map((item, i) => (
                                    <div key={i} className='col-6 col-md-4 col-xl-3' >
                                        <a href={item.link}>
                                            <div className='random-category' style={{ backgroundImage: `url('${item.image}')` }} >
                                            </div>
                                            <h6 className='text-center random-category-text-1'>{item.title}</h6>
                                        </a>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <div className='container'>
                        <div className='row justify-content-between'>
                            <div className='col-10'>
                                <div className='title-1'>
                                    <br />
                                    <br />
                                    Les professionnels de votre région
                                <br />
                                    sont aussi présent sur Yaillo !
                              <br />
                                    <br />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='col-12'>
                                <Carousel

                                    responsive={responsivePro}
                                    ssr
                                    removeArrowOnDeviceType={["tablet", "mobile"]}
                                    deviceType={deviceType}
                                    itemClass="image-item"
                                    transitionDuration={1000}

                                >
                                    {professionals.map((pro, i) => (<ProCard pro={pro} key={i} />))}
                                </Carousel>
                            </div>
                        </div>
                    </div>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                </div>
                <CategoriesModal closeModal={toggleCategories} modal={modalCategories} toggle={toggleCategories} />
            </div>
    );
}



function ProCard(props) {
    return (
        <div className='col-12'>
            <div className='pro-card'>
                <a href={props.pro.link}>
                    <div className='row'>
                        <div className='col-12' >
                            <div className='item-pro-bg' style={{ backgroundImage: `url(${props.pro.image})` }}>
                            </div>
                        </div>
                    </div>
                    <div className='row justify-content-between'>
                        <div className='col-12 pro-card-info'>
                            <span className='item-pro-title'>{props.pro.title}</span>
                            <br />
                            <span className='item-pro-number'>{props.pro.number}</span>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
}


export function CategoriesModal(props) {

    const { city } = useParams();

    return (
        <Modal isOpen={props.modal} toggle={props.toggle} className='categories-modal' size="xl" >
            <ModalHeader toggle={props.toggle} >Tous les services de votre ville sont sur Yaillo !</ModalHeader>
            <ModalBody>
                <div className='container-fluid'>
                    <div className='row more-businesses-row' >
                        <div className='col-12 col-md-6 col-lg-3'>
                            <span><a href={`/recherche/${city}/1/0/default`} ><MdRestaurant className='business-icon biz-icon-1' /> Restaurants & Fast-food</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/2/0/default`} ><BiShoppingBag className='business-icon biz-icon-2' /> Shopping</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/3/0/default`} ><GiShoppingCart className='business-icon biz-icon-3' /> Épiceries</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/4/0/default`} ><FaCocktail className='business-icon biz-icon-4' /> Snack-Bar & Boîtes de nuit</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/5/0/default`} ><BsBuilding className='business-icon biz-icon-5' /> Hotels & Appartements</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/6/0/default`} ><FaVolleyballBall className='business-icon biz-icon-6' /> Art & Divertissement</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/8/0/default`} ><AiFillCar className='business-icon biz-icon-7' /> Mécano-automobile</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/11/0/default`}><BiFemaleSign className='business-icon biz-icon-8' /> Salons de beauté (Femmes)</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/12/0/default`} ><FaCut className='business-icon biz-icon-9' /> Salons de beauté (Mixte)</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/10/0/default`} ><BiMaleSign className='business-icon biz-icon-10' /> Salons de coiffure (Hommes)</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/13/0/default`} ><FaBook className='business-icon biz-icon-1' /> Collèges et lycées</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/14/0/default`} ><FaIceCream className='business-icon biz-icon-2' /> Boulangeries & Patisseries</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/24/0/default`} ><FaGraduationCap className='business-icon biz-icon-3' /> Formations professionnelles</a></span>
                            <br />
                            <br />
                        </div>
                        <div className='col-12 col-md-6 col-lg-3'>
                            <span><a href={`/recherche/${city}/25/0/default`} ><FiShoppingBag className='business-icon biz-icon-4' /> Petites & Grandes surfaces</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/21/0/default`} ><GoLaw className='business-icon biz-icon-5' /> Cabinets d'avocats</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/27/0/default`} ><BiBasketball className='business-icon biz-icon-6' /> Fitness-Club</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/26/0/default`} ><FaPaw className='business-icon biz-icon-7' /> Vétérinaires</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/28/0/default`} ><GiHealthNormal className='business-icon biz-icon-8' /> Hôpitaux & Cliniques</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/29/0/default`} ><ImLab className='business-icon biz-icon-9' /> Laboratoires LAM</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/30/0/default`} ><FaTooth className='business-icon biz-icon-10' /> Dentistes</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/31/0/default`} ><CgGirl className='business-icon biz-icon-1' /> Soins de beauté & Spa</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/7/0/default`} ><FaRegStar className='business-icon biz-icon-2' /> Salles de fête</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/9/0/default`} ><GiHealthNormal className='business-icon biz-icon-3' /> Pharmacies</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/32/0/default`} ><FaBriefcaseMedical className='business-icon biz-icon-4' /> Cabinets médicaux</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/33/0/default`} ><FaRegMoneyBillAlt className='business-icon biz-icon-5' /> Transfert d'argent</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/23/0/default`} ><RiRuler2Line className='business-icon biz-icon-6' /> Cabinets de topographie</a></span>
                            <br />
                            <br />
                        </div>
                        <div className='col-12 col-md-6 col-lg-3'>
                            <span><a href={`/recherche/${city}/15/0/default`} ><FaTshirt className='business-icon biz-icon-7' /> Pressing / Nettoyage à sec</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/16/0/default`} ><FaBaby className='business-icon biz-icon-8' /> Crèches et Maternelles</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/17/0/default`} ><FaPlaneDeparture className='business-icon biz-icon-9' /> Agences de voyage</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/34/0/default`} ><MdBuild className='business-icon biz-icon-10' /> Quincailleries</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/35/0/default`} ><FaChair className='business-icon biz-icon-1' /> Menuisieries</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/36/0/default`} ><GiTap className='business-icon biz-icon-2' /> Plomberies</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/37/0/default`} ><ImTruck className='business-icon biz-icon-3' /> Vidanges</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/38/0/default`} ><BiBuildingHouse className='business-icon biz-icon-4' /> Agences immobilières</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/39/0/default`} ><AiOutlineHome className='business-icon biz-icon-5' /> Vente & Location de maisons</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/40/0/default`} ><ImKey className='business-icon biz-icon-6' /> Serruriers</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/41/0/default`} ><GiBrickWall className='business-icon biz-icon-7' /> Briqueteries</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/20/0/default`} ><BsPentagonHalf className='business-icon biz-icon-8' /> Graphistes 2D/3D & Logos</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/50/0/default`} ><FaBullhorn className='business-icon biz-icon-9' /> Experts en Marketing</a></span>
                            <br />
                            <br />
                        </div>
                        <div className='col-12 col-md-6 col-lg-3'>
                            <span><a href={`/recherche/${city}/19/0/default`} ><BiCodeAlt className='business-icon biz-icon-10' /> Développeurs Web & Mobile</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/48/0/default`} ><AiFillCar className='business-icon biz-icon-1' /> Laveries</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/49/0/default`} ><BiCalendarStar className='business-icon biz-icon-2' /> Événements</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/42/0/default`} ><FaRegLightbulb className='business-icon biz-icon-3' /> Électriciens</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/43/0/default`} ><RiFridgeLine className='business-icon biz-icon-4' /> Froid & Climatisation</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/44/0/default`} ><FiTv className='business-icon biz-icon-5' /> Réparateurs de TV</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/45/0/default`} ><MdComputer className='business-icon biz-icon-6' /> Réparateurs Informatique</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/46/0/default`} ><MdPhonelinkSetup className='business-icon biz-icon-7' /> Reparateurs Smartphones</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/47/0/default`} ><FaShoePrints className='business-icon biz-icon-8' /> Cordonneries</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/18/0/default`} ><GiLipstick className='business-icon biz-icon-9' /> Artistes Make-Up</a></span>
                            <br />
                            <br />
                            <span><a href={`/recherche/${city}/22/0/default`} ><MdKeyboardVoice className='business-icon biz-icon-10' /> Beatmaking & enregistrement</a></span>
                            <br />
                            <br />
                        </div>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
}

export function CitiesModal(props) {

    const [canCloseModal, setCanCloseModal] = useState(false);
    const { city } = useParams();

    useEffect(() => {

        if (window.location.href.indexOf("user") > -1 || window.location.href.indexOf("dashboard") > -1 || window.location.href.indexOf("authentication") > -1) {
            setCanCloseModal(true);
            return;
        }
        if (city != undefined && city != null) {

            cities.forEach((cit, i) => {
                if (cit === city) {

                    setCanCloseModal(true);
                }
            })
        }
        return () => { };
    }, []);

    return (
        <Modal isOpen={!canCloseModal ? true : props.modal} toggle={props.toggle} className='cities-modal' size="lg" >
            <ModalHeader >Yaillo afrique francophone</ModalHeader>
            <ModalBody>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-12 col-sm-6 col-lg-3 city-column'>
                            <span className="city-link"><a href="/location/abidjan"><Flag code="CI" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Abidjan</a></span>
                            <br />
                            <br />
                            <span className="city-link"><a href="/location/bouake"><Flag code="CI" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Bouake</a></span>
                            <br />
                            <br />
                            <span className="city-link"><a href="/location/yamoussoukro"><Flag code="CI" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Yamoussoukro </a></span>
                            <br />
                            <br />
                            <span className="city-link"><a href="/location/korhogo"><Flag code="CI" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Korhogo </a></span>
                            <br />
                            <br />
                            <span className="city-link"><a href="/location/dakar"><Flag code="SN" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Dakar </a></span>
                            <br />
                            <br />
                            <span className="city-link"><a href="/location/ouagadougou"><Flag code="BF" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Ouagadougou </a></span>
                            <br />
                        </div>
                        <div className='col-12 col-sm-6 col-lg-3 city-column'>
                            <span className="city-link"><a href="/location/conakry"><Flag code="GN" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Conakry </a></span>
                            <br />
                            <br />
                            <span className="city-link"><a href="/location/lome"><Flag code="TG" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Lome </a></span>
                            <br />
                            <br />
                            <span className="city-link"><a href="/location/porto-novo"><Flag code="BJ" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Porto-Novo </a></span>
                            <br />
                            <br />
                            <span className="city-link"><a href="/location/cotonou"><Flag code="BJ" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Cotonou </a></span>
                            <br />
                            <br />
                            <span className="city-link"><a href="/location/abomey-calavi"><Flag code="BJ" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Abomey-Calavi </a></span>
                            <br />
                            <br />
                            <span className="city-link"><a href="/location/bamako"><Flag code="ML" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Bamako </a></span>
                            <br />
                        </div>
                        <div className='col-12 col-sm-6 col-lg-3 city-column'>
                            <span className="city-link"><a href="/location/libreville"><Flag code="GA" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Libreville </a></span>
                            <br />
                            <br />
                            <span className="city-link"><a href="/location/oyem"><Flag code="GA" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Oyem </a></span>
                            <br />
                            <br />
                            <span className="city-link"><a href="/location/brazzaville"><Flag code="CG" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Brazzaville </a></span>
                            <br />
                            <br />
                            <span className="city-link"><a href="/location/pointe-noire"><Flag code="CG" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Pointe-Noire </a></span>
                            <br />
                            <br />
                            <span className="city-link"><a href="/location/kinshasa"><Flag code="CD" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Kinshasa </a></span>
                            <br />
                            <br />
                            <span className="city-link"><a href="/location/lumumbashi"><Flag code="CD" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Lumumbashi </a></span>
                            <br />
                        </div>
                        <div className='col-12 col-sm-6 col-lg-3 city-column'>
                            <span className="city-link"><a href="/location/douala"><Flag code="CM" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Douala </a></span>
                            <br />
                            <br />
                            <span className="city-link"><a href="/location/yaounde"><Flag code="CM" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Yaounde </a></span>
                            <br />
                            <br />
                            <span className="city-link"><a href="/location/garoua"><Flag code="CM" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Garoua </a></span>
                            <br />
                            <br />
                            <span className="city-link"><a href="/location/bafoussam"><Flag code="CM" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Bafoussam </a></span>
                            <br />
                            <br />
                            <span className="city-link"><a href="/location/limbe"><Flag code="CM" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Limbe </a></span>
                            <br />
                            <br />
                            <span className="city-link"><a href="/location/kribi"><Flag code="CM" fallback={<span>nan</span>} height="16" className='flag-size-list' /> Kribi </a></span>
                            <br />
                        </div>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
}

const cities = ["abidjan",
    "bouake",
    "yamoussoukro",
    "khorogo",
    "dakar",
    "conakry",
    "bamako",
    "lome",
    "ouagadougou",
    "cotonou",
    "porto-novo",
    "abomey-calavi",
    "libreville",
    "oyem",
    "brazzaville",
    "pointe-noire",
    "kinshasa",
    "lumumbashi",
    "douala",
    "yaounde",
    "garoua",
    "bafoussam",
    "limbe",
    "kribi",
]


function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}