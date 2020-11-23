import React, { useState, useContext, useEffect, useReducer } from 'react';
import { Container } from 'reactstrap';
import { Link } from "react-router-dom";
import './Account.css';
import {
    Button,
    IconButton,
    TextField,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    InputAdornment,
    FormControlLabel,
    CircularProgress,    Avatar

} from '@material-ui/core';
import countries from '../countries';
import Flag from 'react-world-flags';
import AccountReducer from './AccountReducer';
import AccountContext from './AccountContext';
import { FiCamera } from 'react-icons/fi';
import authService from '../api-authorization/AuthorizeService';
import { GetApi, PostApi } from '../../api/ApiConstants';
import { useDataContext } from '../Global/GlobalContext';


export default function ChangeDetails(props) {

    const { dcReducer } = useDataContext();
    const ctx = useContext(AccountContext);
    const [state, dispatch] = useReducer(AccountReducer, ctx);
    const [selectedCountry, setCountry] = useState({
        id: 1,
        name: 'Angola',
        iso: 'AO',
        code: '+244',
        cities: [
            'Luanda',
            'Cabinda',
            'Huambo',
            'Lubango',
            "N'dalatando",
            'Soyo',
            'Uíge',
            'Benguela',
        ],
    });

    const [city, setCity] = useState({ id: 1, name: 'Luanda', checked: false });
    const [citiesList, setCities] = useState([]);
    const [countriesList, setCountries] = useState([]);
    const [code, setCode] = useState(selectedCountry.code);
    const [iso, setIso] = useState(selectedCountry.iso);
    const [loading, setLoading] = useState(false);


    const [model, setModel] = useState({
        firstName: '',
        lastName: '',
        address: '',
        email: '',
        phoneNumber: '',
        country: null,
        city:null,
        userId: null,
        profilePictureUrl:null,
    });

    useEffect(() => {
        const items = [];
        const cities = [];
        var setEverything = () => {
            countries.forEach((item, index) => {
                items.push({ id: index + 1, name: item.name, checked: false });
            });

            selectedCountry.cities.forEach((city, idx) => {
                cities.push({ id: idx + 1, name: city, checked: false });
            });

            setModel({ ...model, ['country']: selectedCountry.name, ['city']: cities[0].name });
            setCountries(items);

            setCities(cities);
        }

        dcReducer({ type: 'navigate-account', data: { activeAccountLink: 'details' }});

        authService.getUser().then(res => {

            if (res !== null && res !== undefined) {
           
                authService.getAccessToken().then(token => {

                    fetch(`${GetApi.Details}/${res.sub}`, {
                        method: 'GET',
                        headers: !token ? {} : { 'Authorization': `Bearer ${token}`, Accept:'application/json' ,'Content-Type': 'application/json', },
                        mode: 'cors',
                        cache: 'default',
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data != null && data != undefined) {

                                data.phoneNumber = data.phoneNumber.substring(4);
                                setModel(data);
                                setIso(data.iso);
                                setCode(data.code);
                                setImg(data.profilePictureUrl);
                                countries.forEach((item, index) => {
                                    if (item.name === data.country) {

                                        var cities = [];

                                        item.cities.forEach((city, i) => {
                                            if (city === data.city) {
                                                setCity({ id: i + 1, name: city, checked: true });
                                            }
                                            cities.push({ id: i + 1, name: city, checked: true });

                                        });

                                        setCities(cities);

                                        setCountry(item);
                                    }
                                });
                            }

                        });
                   

                });
              
            }

            setEverything();
        });

    }, []);

    const onselectedCity = (event) => {

        citiesList.forEach((city, index) => {
            if (event.target.value === city.id) {

                setModel({ ...model, ['city']: city.name });
                setCity(city);
            }
        });

    }

    const onselectedCountry = (event) => {

        const items = [];
        countries.forEach((country, index) => {
            if (event.target.value === country.id) {
                country.cities.forEach((city, idx) => {
                    items.push({ id: idx + 1, name: city, checked: false });
                });
                setCities(items);
                setCountry(country);
                setIso(country.iso);
                setCode(country.code);

                setModel({ ...model, ['country']: country.name });


                setCity({ id: 1, name: country.cities[0], checked: false });
            }
        });


    };

    const [img, setImg] = useState(null);
    const [file, setFile] = useState(null);

    function sendData(state) {

        setLoading(true);

        if (file === null)
        {
            const data = {
                userId: state.userId,
                firstName: state.firstName,
                lastName: state.lastName,
                phoneNumber: `${code}${state.phoneNumber}`,
                email: state.email,
                country: state.country,
                city:state.city,
                address: state.address,
                code: code,
                iso: iso
            }
            authService.getAccessToken().then(token => {
                fetch(PostApi.Details2, {
                    method: 'POST',
                    headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type' : 'application/json' },
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
        else
        {

            const formData = new FormData();
            formData.append('firstName', state.firstName);
            formData.append('lastName', state.lastName);
            formData.append('phoneNumber', `${code}${state.phoneNumber}`);
            formData.append('country', state.country);
            formData.append('city', state.city);
            formData.append('address', state.address);
            formData.append('code', code);
            formData.append('iso', iso);
            formData.append('email', state.email);
            formData.append('userId', state.userId);
            formData.append('picture', file, 'picture.jpg');
            authService.getAccessToken().then(token => {
                fetch(PostApi.Details, {
                    method: 'POST',
                    headers: !token ? {} : { 'Authorization': `Bearer ${token}` },
                    body: formData,
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

       
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-12'>
                    <h4 className='account-hint-title'>Modifiez vos informations personnelles.</h4>
                </div>
                <div className='col-12'>
                    <form className='account-form' noValidate autoComplete="off">
                        <div className='row justify-content-center' >
                            <div className='col-12 col-sm-10 col-md-3 col-lg-11 col-xl-12'>
                                <input
                                    accept="*/image"
                                    className="input-upload"
                                    id="button-profile-img"
                                    multiple
                                    type="file"
                                    onChange={(e) => {
                                        setFile(e.target.files[0]);
                                        var imgUrl = URL.createObjectURL(e.target.files[0]);
                                        setImg(imgUrl);
                                        
                                    }}
                                />
                                <label htmlFor="button-profile-img">
                                    <Avatar className='user-profile-preview' src={img} />
                                </label>
                                <br />
                            </div>
                        </div>
                        <div className='row justify-content-center'>
                            <div className='col-12 col-sm-10 col-md-3 col-lg-12 col-xl-6'>
                                <TextField className='account-input' label="Nom de famille" placeholder="Konate" variant="outlined"
                                    error={state.lnameError ? true : false}
                                    helperText={state.lnameError ? 'Remplissez ce champ.' : null}
                                    value={model.lastName}
                                    onChange={(e) => {
                                        setModel({ ...model, ['lastName']: e.target.value });

                                    }}
                                />
                            </div>
                            <div className='col-12 col-sm-10 col-md-3 col-lg-12 col-xl-6'>
                                <TextField className='account-input' label="Prénom(s)" placeholder="Justine Gaelle" variant="outlined"
                                    error={state.fnameError ? true : false}
                                    value={model.firstName}
                                    helperText={state.fnameError ? 'Remplissez ce champ.' : null}
                                    onChange={(e) => {
                                        setModel({ ...model, ['firstName']: e.target.value });

                                    }}
                                />
                            </div>  
                        </div>
                        <div className='row justify-content-center'>
                            <div className='col-12 col-sm-10 col-md-3 col-lg-12 col-xl-6'>
                                <FormControl variant="outlined" className='account-input'>
                                    <InputLabel id="demo-simple-select-outlined-label">Pays de residence</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={selectedCountry.id}
                                        onChange={onselectedCountry}
                                        label="Pays de residence"
                                    >
                                        {countriesList.map((country, i) => (
                                            <MenuItem key={i} value={country.id}>{country.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div className='col-12 col-sm-10 col-md-3 col-lg-12 col-xl-6'>
                                <FormControl variant="outlined" className='account-input'>
                                    <InputLabel id="demo-simple-select-outlined-label">Ville</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={city.id}
                                        label="Ville"
                                        onChange={onselectedCity}
                                    >
                                        {citiesList.map((city, i) => (
                                            <MenuItem key={i} value={city.id}>{city.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className='row justify-content-center'>
                            <div className='col-12 col-sm-10 col-md-6 col-lg-12'>
                                <TextField className='account-input' label="Adresse email ( optionnel )"
                                    placeholder="exemple@gmail.com"
                                    value={model.email}
                                    variant="outlined"
                                    onChange={(e) => {
                                        setModel({ ...model, ['email']: e.target.value });

                                    }}
                                />
                            </div>
                        </div>
                        <div className='row justify-content-center' >
                            <div className='col-12 col-sm-10 col-md-6 col-lg-12'>
                                <TextField className='account-input' label="Numéro whatsapp ( entreprise )"
                                    error={state.phoneNumberError ? true : false}
                                    helperText={state.phoneNumberError ? 'Entrez un numéro de téléphone valide.' : null}
                                    value={model.phoneNumber}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Flag code={iso} fallback={<span>nan</span>} height="16" />
                                                <span style={{ marginLeft: `3px` }}>{`${code}`}</span>
                                            </InputAdornment>
                                        ),
                                    }}
                                    placeholder="690232997"
                                    variant="outlined"
                                    onChange={(e) => {
                                        setModel({ ...model, ['phoneNumber']: e.target.value });

                                    }}
                                />
                            </div>
                        </div>
                    <div className='row justify-content-center'>
                            <div className='col-12 col-sm-10 col-md-6 col-lg-12'>
                                <TextField className='account-input' label="Adresse de rue ( entreprise )"
                                    placeholder="Koumassi, Rue Ecole Publique n. 02"
                                    variant="outlined"
                                    value={model.address}
                                    error={state.addressError ? true : false}
                                    helperText={state.addressError ? 'Ce champ est obligatoire.' : null}
                                    onChange={(e) => {
                                        setModel({ ...model, ['address']: e.target.value });

                                    }}
                                />
                            </div>
                    </div>
                        <div className='row justify-content-center' >
                            <div className='col-12 col-sm-10 col-md-6 col-lg-12'>
                                <br />

                                {loading ? <Button variant="contained" className='account-btn-loading' ><h5 className='text-center'><CircularProgress size={24} style={{ color: `#fff`, marginTop:`8px` }} /></h5></Button>

                                    :

                                    <Button variant="contained" className='account-btn' onClick={() => {

                                    dispatch({
                                        type: "biz-change-details",
                                        data: {
                                            address: model.address,
                                            password: model.password,
                                            firstName: model.firstName,
                                            lastName: model.lastName,
                                            phoneNumber: model.phoneNumber,
                                            country: model.country,
                                            city: city.name,
                                            email: model.email,
                                            userId:model.userId,
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



