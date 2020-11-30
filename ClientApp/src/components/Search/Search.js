import React, { useEffect, useState } from 'react';
import { Container, Popover, PopoverBody} from 'reactstrap';
import { BrowserRouter as Router, Switch, Route, useRouteMatch, Link, useParams } from "react-router-dom";
import './Search.css';
import { RiErrorWarningLine } from 'react-icons/ri';
import { FaHandPaper, FaRegHandPaper } from 'react-icons/fa';
import Rating from '@material-ui/lab/Rating';
import { ImLocation, ImClock } from 'react-icons/im';
import { Pagination } from '@material-ui/lab';
import 'react-slideshow-image/dist/styles.css';
import { Slide } from 'react-slideshow-image';
import { Checkbox, FormControl, FormControlLabel, IconButton, Button } from '@material-ui/core';
import { GrPrevious, GrNext } from 'react-icons/gr';
import { GetApi, PostApi, baseUrl } from '../../api/ApiConstants';
import { BsInfoCircle } from 'react-icons/bs';
import { useDataContext } from '../Global/GlobalContext';
import { FiFilter } from 'react-icons/fi';
import { TileLayer, Marker, Popup, MapContainer } from 'react-leaflet';
import L from 'leaflet';



function Slideshow(props) {
    return (
        <div style={{ width: `100%` }} >
            <Slide  easing="linear" transitionDuration={100} autoplay={false} nextArrow={<IconButton className='next-icon-arrow' ><GrNext className='icon-arrow' /></IconButton>} prevArrow={<IconButton className='previous-icon-arrow' ><GrPrevious className='icon-arrow' /></IconButton>} >
                {
                    props.pics.map((img, i) => (<div key={i} className="each-slide">
                        <div style={{ 'backgroundImage': `url(${img})` }}>
                        </div>
                </div>))
                }
            </Slide>
        </div>
    )
};


export default function Search() {


    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPage] = useState(1);
    const [filtered, setFiltered] = useState(false);
    const { dataContext, dcReducer } = useDataContext();
    const [data, setData] = useState(null);
    const [ready, setReady] = useState(false);
    const [params, setParams] = useState(null);
    const { city, quer, category, pager } = useParams();
    const [filters, setFilters] = useState({
        openNow: false,
        freeWifi: false,
        creditCard: false,
        parKing: false,
        homeService: false,
        hasToilets: false,
        inTheBlock: false,
        nearby: false,
        inTheTown: false,
        inTheCity: false
    });
    const [coords, setCoords] = useState({ lat: 0, long: 0 });
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [places, setPlaces] = useState([{ title: 'default', lat: 0, long: 0, sponsored:false, home:false }]);

    const togglePopover = () => { setPopoverOpen(!popoverOpen); }

    useEffect(() => {

        initData();
        return () => { };
    }, []);

    function initData() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getCoords);
        }
        else {
            getDefaultCoords();
        }

    }

    function openInNewTab(url) {
        var win = window.open(url, '_blank');
        win.focus();
    }


    function getCoords(position) {

        dcReducer({ type: "set-coordinates", data: { lat: position.coords.latitude, long: position.coords.longitude } });
       
        var cat = category;
        var query = decodeURIComponent(quer);
        var page = pager;
        setPage(page);
        const params = {
            query: query === "default" ? getBusinessType(cat) : query,
            category: cat === "default" ? 0 : parseInt(cat),
            skip: page === undefined ? 0 : parseInt(page),
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            city:city
        };
        setParams(params);
        getDefaultData(params);
    }

    const getDefaultCoords = async () => {

        const result = await fetch("//freegeoip.app/json/");
        const json = await result.json();
        // setCoords({ ...coords, ['lat']: json.latitude, ['long']: json.longitude });
        var cat = category;
        var query = decodeURIComponent(quer);
        var page = pager;
        setPage(page);
        const params = {
            query: query === "default" ? getBusinessType(cat) : query,
            category: cat === "default" ? 0 : parseInt(cat),
            skip: page === undefined ? 0 : parseInt(page),
            latitude: json.latitude,
            longitude: json.longitude,
            city: city
        };
        setParams(params);
        getDefaultData(params);
        dcReducer({ type: "set-default-coordinates", data: { lat: json.latitude, long: json.longitude } });
   
    }

    const getDefaultData = (params) => {
        if (params.category === 0) {

            fetch(`${GetApi.GetByQuery}/${params.query}/${params.latitude}/${params.longitude}/${city}/${params.skip}`, {
                method: 'GET',
                headers: { Accept: 'application/json', 'Content-Type': 'application/json', },
                mode: 'cors',
                cache: 'default',
            })
                .then(response => response.json())
                .then(result => {
                    setData(result);
                    setPage(result.pages);
                    var array = [...places];

                    array.push({ title: 'Votre position', lat: params.latitude, long: params.longitude, sponsored: false, home: true });
                    if (result.items.length > 0) {

                        result.items.forEach((item, i) => { array.push({ title: item.businessName, lat: item.lat, long: item.long, sponsored: false, home:false }) });
                       
                    }

                    if (result.sponsoredItems.length > 0) {

                        result.sponsoredItems.forEach((item, i) => { array.push({ title: item.businessName, lat: item.lat, long: item.long, sponsored: true, home: false }) });

                    }

                    setPlaces(array);

                    setReady(true);
                }).catch(error => console.log(error));
        }
        else {

            fetch(`${GetApi.GetByCategory}/${params.category}/${params.latitude}/${params.longitude}/${city}/${params.skip}`, {
                method: 'GET',
                headers: { Accept: 'application/json', 'Content-Type': 'application/json', },
                mode: 'cors',
                cache: 'default',
            })
                .then(response => response.json())
                .then(result => {
                    setData(result);
                         setPage(result.pages);
                    var array = [...places];
                    
                    array.push({ title: 'Votre position', lat: params.latitude, long: params.longitude, sponsored: false, home: true })
                    if (result.items.length > 0) {

                        result.items.forEach((item, i) => { array.push({ title: item.businessName, lat: item.lat, long: item.long, sponsored: false, home: false }) });

                    }

                    if (result.sponsoredItems.length > 0) {

                        result.sponsoredItems.forEach((item, i) => { array.push({ title: item.businessName, lat: item.lat, long: item.long, sponsored: true, home: false }) });

                    }

                    setPlaces(array);

                    setReady(true);
                }).catch(error => console.log(error));
        }
    }

    function filterData(value, toSkip) {

        setReady(false);

        const dataToSend = {
            category: params === null ? 0 : params.category,
            query: params === null ? "default" : params.query,
            location: "default",
            skip: toSkip,
            openNow: filters.openNow,
            freeWifi: filters.freeWifi,
            creditCard: filters.creditCard,
            parKing: filters.parKing,
            homeService: filters.homeService,
            hasToilets: filters.hasToilets,
            latitude: params === null ? 0 : params.latitude,
            longitude: params === null ? 0 : params.longitude,
            inTheBlock: filters.inTheBlock,
            nearby: filters.nearby,
            inTheTown: filters.inTheTown,
            inTheCity: filters.inTheCity
        };

        fetch(`${PostApi.ApplyFilters}/${dataToSend.category}/${city}/${dataToSend.query}/${dataToSend.skip}/${dataToSend.openNow}/${dataToSend.freeWifi}/${dataToSend.creditCard}/${dataToSend.parKing}/${dataToSend.homeService}/${dataToSend.hasToilets}/${dataToSend.latitude}/${dataToSend.longitude}/${dataToSend.inTheBlock}/${dataToSend.nearby}/${dataToSend.inTheTown}/${dataToSend.inTheCity}`,
            {
                method: 'GET',
                headers: { Accept: 'application/json', 'Content-Type': 'application/json', },
                mode: 'cors',
                cache: 'default',
            }).then(response => response.json())
            .then(result => {
                setData(result);
                setPage(result.pages);
                setCurrentPage(value);
                setFiltered(true);
                var array = [...places];

                array.forEach((item, i) => {
                    if (array.length > 2) {
                        array.pop(item);
                    }
                });

                if (result.items.length > 0) {

                    result.items.forEach((item, i) => { array.push({ title: item.businessName, lat: item.lat, long: item.long, sponsored: false, home: false }) });

                }

                if (result.sponsoredItems.length > 0) {

                    result.sponsoredItems.forEach((item, i) => { array.push({ title: item.businessName, lat: item.lat, long: item.long, sponsored: true, home: false }) });

                }

                setPlaces(array);
                setReady(true);
            }).catch(error => console.log(error));
    }



    const changePageWithFilter = (event, value) => {

        var toSkip = 10 * (value - 1);

        var depthEnd = data.totalCount - toSkip;

        //check if can load more data forward
        if (value > currentPage && depthEnd <= 0) {
            return;
        }

        if (value === currentPage)
            return;

        filterData(value, toSkip);

}


    const changePage = (event, value) => {

        var toSkip = 10 * (value - 1);

        var depthEnd = data.totalCount - toSkip;

        //check if can load more data forward
        if (value > currentPage && depthEnd <= 0) {
            return;
        }

        if (value === currentPage)
            return;

        setReady(false);
        if (params.category === 0) {

            fetch(`${GetApi.GetByQuery}/${params.query}/${params.latitude}/${params.longitude}/${city}/${toSkip}`, {
                method: 'GET',
                headers: { Accept: 'application/json', 'Content-Type': 'application/json', },
                mode: 'cors',
                cache: 'default',
            })
                .then(response => response.json())
                .then(result => {
                    setData(result);
                    setPage(result.pages);
                    setCurrentPage(value);
                    var array = [...places];
                    array.forEach((item, i) => {
                        if (array.length > 2) {
                            array.pop(item);
                        }
                    });
                    if (result.items.length > 0) {

                        result.items.forEach((item, i) => { array.push({ title: item.businessName, lat: item.lat, long: item.long, sponsored: false, home: false }) });

                    }

                    if (result.sponsoredItems.length > 0) {

                        result.sponsoredItems.forEach((item, i) => { array.push({ title: item.businessName, lat: item.lat, long: item.long, sponsored: true, home: false }) });

                    }

                    setPlaces(array);
                    setReady(true);
                }).catch(error => console.log(error));
        }
        else {

            fetch(`${GetApi.GetByCategory}/${params.category}/${params.latitude}/${params.longitude}/${city}/${toSkip}`, {
                method: 'GET',
                headers: { Accept: 'application/json', 'Content-Type': 'application/json', },
                mode: 'cors',
                cache: 'default',
            })
                .then(response => response.json())
                .then(result => {
                    setData(result);
                    setPage(result.pages);
                    setCurrentPage(value);
                    var array = [...places];
                    array.forEach((item, i) => {
                        if (array.length > 2) {
                            array.pop(item);
                        }
                    });
                    if (result.items.length > 0) {

                        result.items.forEach((item, i) => { array.push({ title: item.businessName, lat: item.lat, long: item.long, sponsored: false, home: false }) });

                    }

                    if (result.sponsoredItems.length > 0) {

                        result.sponsoredItems.forEach((item, i) => { array.push({ title: item.businessName, lat: item.lat, long: item.long, sponsored: true, home: false }) });

                    }

                    setPlaces(array);
                    setReady(true);
                }).catch(error => console.log(error));
        }

    }

    function Item(props) {

        return (<div className={props.premium ? 'container search-item-premium' : 'container search-item'}>
            <div className='row'>
                <div className='col-7 col-sm-5 col-md-5 col-lg-6 col-xl-6'>
                    {props.premium ? (<div id="popover-sponsored" className='sponsored-text'>
                        <a href="/business#ad">
                            <BsInfoCircle  style={{ fontSize: `17px` }} />
                        </a> <span>Sponsorisé</span>
                        </div>) : null}
                    <Slideshow pics={props.biz.urlsPictures} />        
                </div>
                <div className='col-5 col-sm-7 col-md-6 col-xl-6'>
                    <div className='row justify-container-between'>
                        <div className='col-12 col-md-9'>
                            <div onClick={() => { openInNewTab(`${baseUrl}/biz/${params.city}/${props.biz.id}`); }}><h4 className='biz-hightlight-title'>{props.biz.businessName}</h4></div>
                            <div className='row'>
                                <div className='col-6 col-sm-3 col-md-5 col-xl-4 biz-hightlight-rating'>
                                    <Rating
                                        name="read-only"
                                        value={props.biz.rating}
                                        precision={0.5}
                                        readOnly
                                        className='biz-hightlight-rating'
                                    />
                                </div>
                                <div className='col-4 col-sm-3 col-md-4  col-xl-4'>
                                    <span className='biz-hightlight-reviews'>{props.biz.reviewsCount}</span>
                                </div>
                            </div>
                            <div className='row justify-content-start' >
                                <div className='col-12 availability-div-hightlight' >
                                    <ImClock className="availability-icon-hightlight" />
                                    <span className={props.biz.isOpen ? 'availability-hightlight-open' : 'availability-hightlight-closed'}>{props.biz.status}</span>
                                </div>
                                <div className='col-12 street-div-hightlight' >
                                    <ImLocation className="street-location-icon-hightlight" />
                                    <span className='street-location-hightlight'>{props.biz.location}</span>
                                </div>
                            </div>
                        </div>
                        <div className='col-3 col-md-3'>
                            <span className='biz-hightlight-distance' >{props.biz.distance}</span>
                        </div>
                        <div className='col-12'>
                            <p className='biz-hightlight-description'>
                                {props.biz.description}
                            </p>
                            <div onClick={() => { openInNewTab(`${baseUrl}/biz/${params.city}/${props.biz.id}`); }} className='biz-read-more-link'>En savoir plus</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }


    function Item2(props) {


        return (
            <div className={props.premium ? 'col-11 col-sm-6 col-md-6 item-search-container-premium' : 'col-11 col-sm-6 col-md-6 item-search-container'}>
                {props.premium ? (<div id="popover-sponsored" className='sponsored-text'>
                    <a href="/business#ad" >
                            <BsInfoCircle style={{ fontSize: `14px` }} />
                        </a> <span>Sponsorisé</span>
                    </div>) : null}
                <h5 >{props.biz.businessName}</h5>
                <div style={{ cursor: `pointer` }} onClick={() => { openInNewTab(`${baseUrl}/biz/${params.city}/${props.biz.id}`); }}>
                <div className='item-search' style={{ 'backgroundImage': `url(${props.biz.urlsPictures[0]})` }} >
                </div>
                <div className='row'>
                        <div className='col-4 col-sm-3 col-md-4 col-lg-4'>
                                 <Rating
                                        name="read-only"
                                        value={props.biz.rating}
                                        precision={0.5}
                                        readOnly
                            className='biz-hightlight-rating-1'
                                    />
                                </div>
                        <div className='col-3 col-sm-2'>
                        <span  className='biz-hightlight-reviews-1' >{props.biz.reviewsCount}</span>
                    </div>
                    <div className='col-12'>
                        <ImLocation className="street-location-icon" />
                        <span className='street-location'>{props.biz.location}</span>
                    </div>
              
                </div>
                </div>
            </div>);

       
    }

    //function Item3() {


    //    return (
    //        <div className='col-11 col-sm-6 col-md-6 item-search-container'>
                
    //            <h5 >Le Marylin's</h5>
    //            <div style={{ cursor: `pointer` }} >
    //                <div className='item-search' style={{ 'backgroundImage': `url(${''})` }} >
    //                </div>
    //                <div className='row'>
    //                    <div className='col-4 col-sm-3 col-md-4 col-lg-4'>
    //                        <Rating
    //                            name="read-only"
    //                            value={0}
    //                            precision={0.5}
    //                            readOnly
    //                            className='biz-hightlight-rating-1'
    //                        />
    //                    </div>
    //                    <div className='col-3 col-sm-2'>
    //                        <span className='biz-hightlight-reviews-1' >0</span>
    //                    </div>
    //                    <div className='col-12'>
    //                        <ImLocation className="street-location-icon" />
    //                            <span className='street-location'>85 Rue Dominique Savio Primaire, Bonapriso</span>
    //                    </div>

    //                </div>
    //            </div>
    //        </div>);


    //}

    return (
        <>
            <div className='desktop-friendly-search-content'>
                <div className='map-container'>
                    <YailloMap items={places} city={city} />
                </div>
                <div className='container search-container'>
                    <div className='row'>
                        <div className='col-12 col-md-4 col-lg-3' >
                            <Button startIcon={<FiFilter />} onClick={() => { filterData(0, 0) }} color="default" variant="contained" className='btn-filter'>Appliquer les filtres</Button>
                            <br />
                            <br />
                            <h4 className='filters-title'>Filtres</h4>
                            <div className='filters-div'>
                                <h6 className='filters-subtitle' >Distance</h6>
                                <FormControl>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={filters.inTheBlock}
                                                onChange={(e) => {
                                                    setFilters({ ...filters, ['inTheBlock']: e.target.checked });

                                                }}

                                                color="secondary"
                                            />
                                        }
                                        label={<span style={{ fontSize: 15 }} > À vue d'oeil ( 5 km )</span>}
                                    />
                                </FormControl>
                                <br />
                                <FormControl>
                                    <FormControlLabel
                                        control={
                                            <Checkbox

                                                checked={filters.nearby}
                                                onChange={(e) => {
                                                    setFilters({ ...filters, ['nearby']: e.target.checked });

                                                }}

                                                color="secondary"
                                            />
                                        }
                                        label={<span style={{ fontSize: 15 }} > À proximité ( 10 km )</span>}
                                    />
                                </FormControl>
                                <br />
                                <FormControl>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={filters.inTheTown}
                                                onChange={(e) => {
                                                    setFilters({ ...filters, ['inTheTown']: e.target.checked });

                                                }}

                                                color="secondary"
                                            />
                                        }
                                        label={<span style={{ fontSize: 15 }} > Dans la commune ( 15 km ) </span>}
                                    />
                                </FormControl>
                                <br />
                                <FormControl>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={filters.inTheCity}
                                                onChange={(e) => {
                                                    setFilters({ ...filters, ['inTheCity']: e.target.checked });

                                                }}

                                                color="secondary"
                                            />
                                        }
                                        label={<span style={{ fontSize: 15 }} > Dans la ville ( 40 km )</span>}
                                    />
                                </FormControl>
                                <br />
                            </div>
                            <div className='filters-div'>
                                <h6 className='filters-subtitle'>Services</h6>
                                <FormControl>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={filters.openNow}
                                                onChange={(e) => {
                                                    setFilters({ ...filters, ['openNow']: e.target.checked });

                                                }}

                                                color="secondary"
                                            />
                                        }
                                        label={<span style={{ fontSize: 15 }} > Ouvert maintenant</span>}
                                    />
                                </FormControl>
                                <br />
                                <FormControl>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={filters.freeWifi}
                                                onChange={(e) => {
                                                    setFilters({ ...filters, ['freeWifi']: e.target.checked });

                                                }}

                                                color="secondary"
                                            />
                                        }
                                        label={<span style={{ fontSize: 15 }} > Wi-Fi gratuit</span>}
                                    />
                                </FormControl>
                                <br />
                                <FormControl>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={filters.creditCard}
                                                onChange={(e) => {
                                                    setFilters({ ...filters, ['creditCard']: e.target.checked });

                                                }}
                                                color="secondary"
                                            />
                                        }
                                        label={<span style={{ fontSize: 15 }} > Carte de crédit</span>}
                                    />
                                </FormControl>
                                <br />
                                <FormControl>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={filters.parKing}
                                                onChange={(e) => {
                                                    setFilters({ ...filters, ['parKing']: e.target.checked });

                                                }}

                                                color="secondary"
                                            />
                                        }
                                        label={<span style={{ fontSize: 15 }} > Parking disponible</span>}
                                    />
                                </FormControl>
                                <br />
                                <FormControl>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={filters.homeService}
                                                onChange={(e) => {
                                                    setFilters({ ...filters, ['homeService']: e.target.checked });

                                                }}

                                                color="secondary"
                                            />
                                        }
                                        label={<span style={{ fontSize: 15 }} > Services à domicile</span>}
                                    />
                                </FormControl>
                                <br />
                                <FormControl>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={filters.hasToilets}
                                                onChange={(e) => {
                                                    setFilters({ ...filters, ['hasToilets']: e.target.checked });

                                                }}

                                                color="secondary"
                                            />
                                        }
                                        label={<span style={{ fontSize: 15 }} > Toilettes gratuites</span>}
                                    />
                                </FormControl>
                                <br />
                                <br />
                            </div>
                            <h6 className='filters-title'>Top catégories</h6>
                            <div className='filters-div'>
                                <br />
                                <div className='top-category-div'>
                                    <a href={`/recherche/${city}/27/0/default`} className='top-category-link' >Fitness-Club</a>
                                </div>
                                <div className='top-category-div'>
                                    <a href={`/recherche/${city}/11/0/default`} className='top-category-link'>Salons de beauté (Femmes)</a>
                                </div>
                                <div className='top-category-div'>
                                    <a href={`/recherche/${city}/39/0/default`} className='top-category-link'>Vente & Location de maisons</a>
                                </div>
                                <div className='top-category-div'>
                                    <a href={`/recherche/${city}/10/0/default`} className='top-category-link'>Salons de coiffure (Hommes)</a>
                                </div>
                                <div className='top-category-div'>
                                    <a href={`/recherche/${city}/44/0/default`} className='top-category-link'>Réparateurs de TV</a>
                                </div>
                                <div className='top-category-div'>
                                    <a href={`/recherche/${city}/48/0/default`} className='top-category-link'>Laveries</a>
                                </div>
                                <div className='top-category-div'>
                                    <a href={`/recherche/${city}/46/0/default`} className='top-category-link'>Réparateurs de smartphones</a>
                                </div>
                                <div className='top-category-div'>
                                    <a href={`/recherche/${city}/1/0/default`} className='top-category-link'>Restaurants & Fast-food</a>
                                </div>
                                <div className='top-category-div'>
                                    <a href={`/recherche/${city}/9/0/default`} className='top-category-link'>Pharmacies</a>
                                </div>
                                <div className='top-category-div'>
                                    <a href={`/recherche/${city}/30/0/default`} className='top-category-link'>Dentistes</a>
                                </div>
                                <div className='top-category-div'>
                                    <a href={`/recherche/${city}/20/0/default`} className='top-category-link'>Graphistes 2D/3D & Logos</a>
                                </div>
                                <div className='top-category-div'>
                                    <a href={`/recherche/${city}/19/0/default`} className='top-category-link'>Développeurs Web & Mobile</a>
                                </div>
                                <div className='top-category-div'>
                                    <a href={`/recherche/${city}/15/0/default`} className='top-category-link'>Pressing / Nettoyage à sec</a>
                                </div>
                                <div className='top-category-div'>
                                    <a href={`/recherche/${city}/36/0/default`} className='top-category-link'>Plombiers</a>
                                </div>
                            </div>
                        </div>
                        <div className='col-12 col-md-8 col-lg-9' >
                            {
                                !ready ? <></> : (<>
                                    {data.items.length === 0 && data.sponsoredItems.length === 0 ? (<h4 className='search-main-title'>Aucun business trouvé pour la recherche '{params.query}'</h4>) :
                                        (<>
                                            <h4 className='search-main-title'>Résultats pour la recherche '{params.query}'</h4>
                                            {data.sponsoredItems.map((biz, i) => (<Item key={i} biz={biz} premium={true} />))}
                                            {data.items.map((biz, i) => (<Item key={i} biz={biz} premium={false} />))}
                                            <div className='row search-pagination'>
                                                <div className='col-8 col-sm-8 col-md-6 col-lg-6 col-xl-6' >
                                                    {filtered ? <Pagination count={pages} shape="rounded" page={currentPage} onChange={changePageWithFilter} /> : <Pagination count={pages} shape="rounded" page={currentPage} onChange={changePage} />}
                                                </div>
                                            </div>

                                        </>)
                                    }

                                </>)
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className='mobile-friendly-search-content'>
                <div className='map-container'>
                    <YailloMap items={places} city={city} />
                </div>
                <div className='container-fluid'>
                    <div className='row justify-content-center'>
                        <div className='col-12' >
                            {
                                !ready ? <></> : (<>
                                    {data.items.length === 0 && data.sponsoredItems.length === 0 ? (<h4 className='search-main-title'>Aucun business trouvé pour la recherche '{params.query}'</h4>) :
                                        (<>
                                            <h4 className='search-main-title'>Résultats sur {city}</h4>
                                            <div className='row justify-content-center' >
                                                {data.sponsoredItems.map((biz, i) => (<Item2 key={i} biz={biz} premium={true} />))}
                                                {data.items.map((biz, i) => (<Item2 key={i} biz={biz} premium={false} />))}
                                            </div>
                                            {pages > 1 ? <div className='row search-pagination'>
                                                <div className='col-8 col-sm-8 col-md-6 col-lg-6 col-xl-6' >
                                                    {filtered ? <Pagination count={pages} shape="rounded" page={currentPage} onChange={changePageWithFilter} /> : <Pagination count={pages} shape="rounded" page={currentPage} onChange={changePage} />}
                                                </div>
                                            </div> : null}

                                        </>)
                                    }

                                </>)
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>);
}


function GetMarker(props){

    var location = [props.lat, props.long];

    const pointerIcon = new L.Icon({
        iconUrl: `https://st6808.ispot.cc/media/marker.png`,
        iconRetinaUrl: `https://st6808.ispot.cc/media/marker.png`,
        iconAnchor: [20, 40],
        popupAnchor: [0, -35],
        iconSize: [40, 40],
    });
    const pointerIcon2 = new L.Icon({
        iconUrl: `https://st6808.ispot.cc/media/marker2.png`,
        iconRetinaUrl: `https://st6808.ispot.cc/media/marker2.png`,
        iconAnchor: [20, 40],
        popupAnchor: [0, -35],
        iconSize: [40, 40],
    });
    const homeIcon = new L.Icon({
        iconUrl: `https://st6808.ispot.cc/media/marker3.png`,
        iconRetinaUrl: `https://st6808.ispot.cc/media/marker3.png`,
        iconAnchor: [20, 40],
        popupAnchor: [0, -35],
        iconSize: [40, 40],
    });

    if (props.sponsored && !props.home) {
        return (<Marker position={location} icon={pointerIcon2}  >
            <Popup>
                {props.title}
            </Popup>
        </Marker>);
    }
    if (!props.sponsored && !props.home)
    {
       
            return (<Marker position={location} icon={pointerIcon}  >
                <Popup>
                    {props.title}
                </Popup>
            </Marker>);
        
    }

    return (
        <Marker position={location} icon={homeIcon} >
            <Popup>
                <span>Votre position</span>
            </Popup>
        </Marker >
    );

  
}


function YailloMap(props) {

    if (props.items.length === 1) {
        return (<></>);
    }

    var city = getCityLocation(props.city);
    const cityPointer = [city.lat, city.long];

    return (
        props.items.length > 1 ? (<MapContainer center={cityPointer} zoom={11} >
            <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {props.items.map((item, i) => {

                if (i === 0)
                    return <></>;
                else {

                    return (
                        <GetMarker key={i} title={item.title} lat={item.lat} long={item.long} home={item.home} sponsored={item.sponsored} />
                    );
                }
            })}
        </MapContainer>) : null);

}

function getBusinessType(index) {
    var type = businessTypes[index - 1];
    return type;
}

const businessTypes = [
    'Restaurant & Fast-food',
    'Shopping',
    'Epicerie',
    'Snack-Bar & Boîtes de nuit',
    'Hotels & Appartement',
    'Art & Divertissement',
    'Salles de fête',
    'Mécano-automobile',
    'Pharmacie',
    'Salons de coiffure (Hommes)',
    'Salons de beauté (Femmes)',
    'Salons de beauté (Mixte)',
    'Collèges & Lycées',
    'Boulangeries & Pâtisseries',
    'Pressing & Nettoyage à sec',
    'Crèches & Maternelles',
    'Agences de voyage',
    'Artistes Make-Up',
    'Developpeurs Web & Mobile',
    'Graphistes 2D/3D & Logo',
    "Cabinets d'avocats",
    'Beatmaking & enregistrement',
    'Cabinets de topographie',
    'Formations professionnelles',
    'Petites & Grandes surfaces',
    'Vétérinaires',
    'Fitness Club',
    'Hôpitaux & Cliniques',
    'Laboratoires LAM',
    'Dentistes',
    'Soins de beauté & Spa',
    'Cabinets medicaux',
    "Transfert d'argent",
    'Quincailleries',
    'Menuiseries',
    'Plomberies',
    'Vidanges',
    'Agences immobilières',
    'Vente & Location de maisons',
    'Serruriers',
    'Briqueteries',
    'Électriciens',
    'Froid & Climatisation',
    'Réparateurs de TV',
    'Réparateurs Informatique',
    'Réparateurs Smartphones',
    'Cordonneries',
    'Laveries',
    'Événementiel',
    'Experts en Marketing'
];

function getCityLocation(city) {
    var coords = {name: "douala", lat: 4.062305083946346, long: 9.703938593214488 };
    if (city === null || city === undefined) {
        return coords;
    }

    cities.forEach((item, i) => {
        if (item.name === city) {
            coords.name = item.name;
            coords.lat = item.lat;
            coords.long = item.long;
       
        }
    });

    return coords;
  
}

const cities = [{ name: "abidjan", lat: 5.352544812365578, long: -4.004860745800187 },
    { name: "bouake", lat: 7.688339564187033, long: -5.036736179883731 } ,
    { name: "yamoussoukro", lat: 6.809840489751288, long: -5.269894608870574 },
    { name: "khorogo", lat: 9.456735048100457, long: -5.629878608479587 },
    { name: "dakar", lat: 14.717323095145671, long: -17.454154516856853 },
    { name: "conakry", lat: 9.633541195419113, long: -13.590319948600932 },
    { name: "bamako", lat: 12.642599566899445, long: -7.991114659917241 },
    { name: "lome", lat: 6.1613624058397205, long: 1.2405892790508868 } ,
    { name: "ouagadougou", lat: 12.370220648256087, long: -1.5200229922878434 },
    { name: "cotonou", lat: 6.36692048301572, long: 2.396236703126107 },
    { name: "porto-novo", lat: 6.493903477075459, long: 2.625388474194161 },
    { name: "abomey-calavi", lat: 6.452623721933518, long: 2.3450767966156008 },
    { name: "libreville", lat: 0.4193636987434619, long: 9.435227890895845 },
    { name: "oyem", lat: 1.6018101380486647, long: 11.572948490543434 },
    { name: "brazzaville", lat: -4.272004588889839, long: 15.266660387745482 },
    { name: "pointe-noire", lat: -4.792116273556241, long: 11.883170453105757 },
    { name: "kinshasa", lat: -4.34952422572521, long: 15.301026987861722 },
    { name: "lumumbashi", lat: -11.661545500645262, long: 27.49008611213785 },
    { name: "douala", lat: 4.062305083946346, long: 9.703938593214488 },
    { name: "yaounde", lat: 3.8673403875822707, long: 11.517274159192299 },
    { name: "garoua", lat: 9.330864539426793, long: 13.39450055250033 },
    { name: "bafoussam", lat: 5.47753450256532, long: 10.416055375634397},
    { name: "limbe", lat: 4.02097404086149, long: 9.18596491957453 },
    { name: "kribi", lat: 2.939890512370546, long: 9.908058513480249 },
]