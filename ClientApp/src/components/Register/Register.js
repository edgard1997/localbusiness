import React, { useState, useEffect, useContext, useReducer } from 'react';
import {
    Container,
    Avatar,
    Button,
    TextField,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    InputAdornment,    CircularProgress,
    Typography,
    Checkbox,
    FormControlLabel

} from '@material-ui/core';
import { Link } from 'react-router-dom';
import './Register.css';
import countries from '../countries';
import Flag from 'react-world-flags';
import { PostApi, redirectTo, GetApi } from '../../api/ApiConstants';
import RegisterReducer from './RegisterReducer';
import RegisterContext from './RegisterContext';

export default function Register() {



    const ctx = useContext(RegisterContext);
    const [state, dispatch] = useReducer(RegisterReducer, ctx);
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

    const [city, setCity] = useState({ id: 1, name: 'Luanda', checked: false})
    const [citiesList, setCities] = useState([]);
    const [countriesList, setCountries] = useState([]);
    const [code, setCode] = useState(selectedCountry.code);
    const [iso, setIso] = useState(selectedCountry.iso);
    const [loading, setLoading] = useState(false);
    const [table, setTable] = useState([]);

    const [model, setModel] = useState({
        firstName: '',
        lastName: '',
        address: '',
        password: null,
        phoneNumber: null,
        country: null,
        consent: false,
        new: true
    });

 

    useEffect(() => {

        const x = getRandom(images, 6);
        setTable(x);
       
        const items = [];
        const cities = [];
        var setEverything = () => {
            countries.forEach((item, index) => {
                items.push({ id: index + 1, name: item.name, checked: false });
            });
           
            selectedCountry.cities.forEach((city, idx) => {
                cities.push({ id: idx + 1 , name: city, checked: false });
            });

            setModel({ ...model, ['country']: selectedCountry.name, ['city']: cities[0].name });
            setCountries(items);

            setCities(cities);
        };

        setEverything();
  
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
        var iso = selectedCountry.iso;
        var code = selectedCountry.code;
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

    function sendData(state) {

        setLoading(true);
      
        const data = {
            firstName: state.firstName,
            lastName: state.lastName,
            phoneNumber: `${code}${state.phoneNumber}`,
            country: state.country,
            city: state.city,
            address: state.address,
            code: code,
            iso: iso,
            password: state.password
        };

        fetch(PostApi.CreateClientUrl, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (response.status === 200) {
                    redirectTo(GetApi.LoginUrl);
                    setLoading(false);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }
   
    return (

        <div className='row justify-content-between'>
            <div className='col-12 col-lg-7 register-illustration'>
                <p className='register-title'>Accédez à des milliers de business utiles dans votre ville<br />en seulement quelques clics sur Yaillo !</p>
                <div className='row' >
                    {table.map((img, i) => (
                        <div key={i} className='col-12 col-md-12 col-lg-4'>
                            <div className='illustration-img' style={{ backgroundImage: `url(${img})` }}>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='col-12 col-lg-4'>
                <form className='register-form' autoComplete="off">
                    <div className='row justify-content-center'>
                        <div className='col-10 col-sm-8 col-md-3 col-lg-12 col-xl-6'>
                            <TextField className='register-input' label="Nom de famille" placeholder="Konate" variant="outlined"
                                error={state.lnameError ? true : false}
                                helperText={state.lnameError ? 'Remplissez ce champ.' : null}
                                onChange={(e) => {
                                    setModel({ ...model, ['lastName']: e.target.value });

                                }}
                                value={model.lastName}
                            />
                        </div>
                        <div className='col-10 col-sm-8 col-md-3 col-lg-12 col-xl-6'>
                            <TextField className='register-input' label="Prenom(s)" placeholder="Justine Gaelle" variant="outlined"
                                error={state.fnameError ? true : false}
                                helperText={state.fnameError ? 'Remplissez ce champ.' : null}
                                onChange={(e) => {
                                    setModel({ ...model, ['firstName']: e.target.value });

                                }}
                                value={model.firstName}
                            />
                        </div>
                    </div>
                    <div className='row justify-content-center'>
                        <div className='col-10 col-sm-8 col-md-3 col-lg-12 col-xl-6'>
                            <FormControl variant="outlined" className='register-input'>
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
                        <div className='col-10 col-sm-8 col-md-3 col-lg-12 col-xl-6'>
                            <FormControl variant="outlined" className='register-input'>
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
                        <div className='col-10 col-sm-8 col-md-6 col-lg-12'>
                            <TextField className='register-input' label="Adresse / Quartier"
                                placeholder="Koumassi, Rue Ecole Publique n. 02"
                                variant="outlined"
                                error={state.addressError ? true : false}
                                helperText={state.addressError ? 'Ce champ est obligatoire.' : null}
                                onChange={(e) => {
                                    setModel({ ...model, ['address']: e.target.value });

                                }}
                                value={model.address}
                            />
                        </div>
                    </div>
                    <div className='row justify-content-center'>
                        <div className='col-10 col-sm-8 col-md-6 col-lg-12'>
                            <TextField className='register-input' label="Numero de telephone"

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
                                value={model.phoneNumber}
                                error={state.phoneNumberError ? true : false}
                                helperText={state.phoneNumberError ? 'Entrez un numéro de téléphone valide.' : null}
                            />
                        </div>
                    </div>
                    <div className='row justify-content-center'>
                        <div className='col-10 col-sm-8 col-md-6 col-lg-12'>
                            <TextField className='register-input' label="Mot de passe" variant="outlined"
                                onChange={(e) => {
                                    setModel({ ...model, ['password']: e.target.value });

                                }}
                                value={model.password}
                                error={state.passwordError ? true : false}
                                helperText={state.passwordError ? 'Entrez un mot de passe valide. [A-z] [0-9] [@-!]' : null}
                            />
                        </div>
                    </div>
                    <div className='row justify-content-center'>
                        <div className='col-11 col-sm-10 col-md-8 col-lg-12'>
                            <FormControl>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={model.consent}
                                            onChange={(e) => {
                                                setModel({ ...model, ['consent']: e.target.checked });

                                            }}

                                            color="secondary"
                                        />
                                    }
                                    label={<span style={{ fontSize: 15 }} >Je suis d'accord avec les <a href='/terms'>Termes</a> et <a href='/terms' >Conditions d'utilisation</a> de Yaillo.</span>}
                                />
                                <br />
                                {state.consent || state.new ? null : <span style={{ color: `red`, fontSize: 14 }} >Cochez la case ci-dessus pour être d'accord avec les termes et conditions d'utilisation de Yaillo.</span>}
                                <br />
                            </FormControl>
                        </div>
                    </div>
                    <div className='row justify-content-center'>
                        <div className='col-10 col-sm-8 col-md-6 col-lg-12'>
                            <Button onClick={() =>
                                dispatch({
                                    type: "validate-form",
                                    data: {
                                        address: model.address,
                                        password: model.password,
                                        firstName: model.firstName,
                                        lastName: model.lastName,
                                        phoneNumber: model.phoneNumber,
                                        country: model.country,
                                        city: city.name,
                                        consent: model.consent,
                                        sendData: sendData,
                                    }
                                })
                            } variant="contained" className='btn-register-2'>
                                {loading ? null : <span>S'inscrire</span>}</Button>
                            {loading ? <h5 className='text-center loading-progress'><CircularProgress size={24} style={{ color: `#fff` }} /></h5> : null}
                        </div>
                    </div>
                    <div className='row justify-content-center'>
                        <div className='col-10 col-sm-8 col-md-6 col-lg-12'>
                            <br />
                            <span>Vous avez deja compte ? <Link to='/authentication/login'>Connectez-vous !</Link></span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

const images = ['https://st6808.ispot.cc/media/burgers-random.jpg',
    'https://st6808.ispot.cc/media/pancakes-random.jpg',
    'https://st6808.ispot.cc/media/cookies-random.jpg',
    'https://st6808.ispot.cc/media/nike-random.jpg',
    'https://st6808.ispot.cc/media/ysl-random.jpg',
    'https://st6808.ispot.cc/media/clothes-random.jpg',
    'https://st6808.ispot.cc/media/carwash.jpg',
    'https://st6808.ispot.cc/media/barbershop.png',
    'https://st6808.ispot.cc/media/hotel.jpg',
    'https://st6808.ispot.cc/media/repairs.jpg',
    'https://st6808.ispot.cc/media/plumber.jpg',
    'https://st6808.ispot.cc/media/design.jpg',
    'https://st6808.ispot.cc/media/makeup.jpg',
    'https://st6808.ispot.cc/media/webdev.png',
    'https://st6808.ispot.cc/media/dentist.jpg',
    'https://st6808.ispot.cc/media/appliance.jpg',
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