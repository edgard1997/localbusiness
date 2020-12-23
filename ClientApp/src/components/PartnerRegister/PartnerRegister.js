import React, { useState, useEffect, useContext, useReducer } from 'react';
import {

    Button,
    TextField,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    InputAdornment,
    Checkbox,
    FormControlLabel,
    CircularProgress

} from '@material-ui/core';
import { Link } from 'react-router-dom';
import './PartnerRegister.css';
import countries from '../countries';
import Flag from 'react-world-flags';
import PartnerRegisterContext from './PartnerRegisterContext';
import PartnerRegisterReducer from './PartnerRegisterReducer';
import { HiOutlineLightBulb } from 'react-icons/hi';
import { ImLocation } from 'react-icons/im';
import { PostApi, redirectTo, GetApi } from '../../api/ApiConstants';
import { style } from '@material-ui/system';

export default function PartnerRegister() {


    const ctx = useContext(PartnerRegisterContext);
    const [state, dispatch] = useReducer(PartnerRegisterReducer, ctx);
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

    const [city, setCity] = useState({ id: 1, name: 'Luanda', checked: false })
    const [citiesList, setCities] = useState([]);
    const [countriesList, setCountries] = useState([]);
    const [code, setCode] = useState(selectedCountry.code);
    const [iso, setIso] = useState(selectedCountry.iso);
    const [file1, setCardOne] = useState('https://rust-steam.com/wp-content/uploads/2019/10/Front-ID-Example-300x192.jpg');
    const [file2, setCardTwo] = useState('https://rust-steam.com/wp-content/uploads/2019/10/Front-ID-Example-300x192.jpg');
    const [loading, setLoading] = useState(false);
    const [latitude, setLat] = useState(0);
    const [longitude, setLong] = useState(0);
    const [longError, setLongError] = useState(false);
    const [latError, setLatError] = useState(false);
    const [table, setTable] = useState([]);
    const [model, setModel] = useState({
        firstName: '',
        lastName: '',
        address: '',
        email: '',
        website:'',
        password: null,
        phoneNumber: null,
        country: null,
        businessName: '',
        businessType:1,
        idCardNumber: '',
        idBackPicture: null,
        idFrontPicture: null,
        consent: false,
        
    });

    useEffect(() => {

        const x = getRandom(images, 1);
        setTable(x);

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

    function getLocation() {
        if (!navigator.geolocation)
            return;
            navigator.geolocation.watchPosition(getCoords);
    }

    function getCoords(position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude); 
    }

    function submitStep2() {

        var latError = latitude === 0 ? setLatError(true) : setLatError(false);
        var longError = longitude === 0 ? setLongError(true) : setLongError(false);

        if (latitude === 0 || longitude === 0 || latError || longError )
            return;
       
        dispatch({
            type: "validate-step-2",
            data: {
                businessName: model.businessName,
                businessType: model.businessType,
                idCardNumber: model.idCardNumber,
                email: model.email,
                consent: model.consent,
                sendData: sendData,
            }
        });
    }

    function sendData(state){

        setLoading(true);

        var data = {
            firstName: state.firstName,
            lastName: state.lastName,
            phoneNumber: `${code}${state.phoneNumber}`,
            country: state.country,
            city: state.city,
            address: state.address,
            code: code,
            iso: iso,
            password: state.password,
            businessName: state.businessName,
            businessType: state.businessType,
            email: state.email,
            idCardNumber: state.idCardNumber,
            lat: latitude,
            long:longitude,
        };

        console.log(data);

        fetch(PostApi.CreateBusinessUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if(response.status === 200) {
                    redirectTo(GetApi.LoginUrl);
                    setLoading(false);
                }
            })
            .catch(error => {
                console.log(error);
            });

    }


    return (
       state.currentStep === 1 ? <div className='row justify-content-between' >
            <div className='col-12 col-lg-7 register-illustration'>
                <p className='register-title'>Sur Yaillo ! votre entreprise est disponible 24h/7 <br /> aux potentiels clients de votre localité.</p>
                <div className='row' >
                    <div className='col-12 col-lg-12'>
                        <div className='illustration-img-2' style={{ backgroundImage: `url(${table[0]})` }}>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-12 col-lg-4'>
                <form className='register-form' noValidate autoComplete="off">
                    <div className='row justify-content-center'>
                        <div className='col-10 col-sm-8 col-md-3 col-lg-12 col-xl-6'>
                            <TextField className='register-input' label="Nom de famille" placeholder="Konate" variant="outlined"
                                error={state.lnameError ? true : false}
                                helperText={state.lnameError ? 'Remplissez ce champ.' : null}
                                onChange={(e) => {
                                    setModel({ ...model, ['lastName']: e.target.value });

                                }}
                            />
                        </div>
                        <div className='col-10 col-sm-8 col-md-3 col-lg-12 col-xl-6'>
                            <TextField className='register-input' label="Prénom(s)" placeholder="Justine Gaelle" variant="outlined"
                                error={state.fnameError ? true : false}
                                helperText={state.fnameError ? 'Remplissez ce champ.' : null}
                                onChange={(e) => {
                                    setModel({ ...model, ['firstName']: e.target.value });

                                }}
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
                            <TextField className='register-input' label="Adresse de rue ( entreprise )"
                                placeholder="Koumassi, Rue Ecole Publique n. 02"
                                variant="outlined"
                                error={state.addressError ? true : false}
                                helperText={state.addressError ? 'Ce champ est obligatoire.' : null}
                                onChange={(e) => {
                                    setModel({ ...model, ['address']: e.target.value });

                                }}
                            />
                        </div>
                    </div>
                    <div className='row justify-content-center'>
                        <div className='col-10 col-sm-8 col-md-6 col-lg-12'>
                            <TextField className='register-input' label="Numéro whatsapp ( entreprise )"
                                error={state.phoneNumberError ? true : false}
                                helperText={state.phoneNumberError ? 'Entrez un numéro de téléphone valide.' : null}
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
                        <div className='col-10 col-sm-8 col-md-6 col-lg-12'>
                            <TextField className='register-input' label="Adresse email ( optionnel )"
                                placeholder="exemple@gmail.com"
                                variant="outlined"
                                onChange={(e) => {
                                    setModel({ ...model, ['email']: e.target.value });

                                }}
                            />
                        </div>
                    </div>
                    <div className='row justify-content-center'>
                        <div className='col-10 col-sm-8 col-md-6 col-lg-12'>
                            <TextField className='register-input' label="Mot de passe" onChange={(e) => {
                                setModel({ ...model, ['password']: e.target.value });

                            }} variant="outlined"
                                error={state.passwordError ? true : false}
                                helperText={state.passwordError ? 'Entrez un mot de passe valide. [A-z] [0-9] [@-!]' : null}
                            />
                        </div>
                    </div>
                    <div className='row justify-content-center'>
                        <div className='col-10 col-sm-8 col-md-6 col-lg-12'>
                            <Button variant="contained" className='btn-register-2' onClick={() =>
        dispatch({
            type: "validate-step-1",
            data: {
                address: model.address,
                password: model.password,
                firstName: model.firstName,
                lastName: model.lastName,
                phoneNumber: model.phoneNumber,
                country: model.country,
                city: city.name,
                email: model.email
                  }
              })
                        } >Continuer</Button>
                        </div>
                    </div>
                    <div className='row justify-content-center'>
                        <div className='col-10 col-sm-8 col-md-6 col-lg-12'>
                            <br />
                            <span>Vous avez déjà compte ? <a href="/login" >Connectez-vous !</a></span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
            :

            <div className='row justify-content-between'>
                <div className='col-12 col-lg-7 register-illustration'>
                    <p className='register-title'>À 6000 FCFA/an,  votre business est recommandé sur le marché local !<br /> </p>
                    <p>*Paiement requis 7 jours après inscription.</p>
                    <div className='row' >
                        <div class="col-12 col-md-8 col-lg-8">
                            <img title="Orange money" className='img-pay-method' src="https://st6808.ispot.cc/media/orangemoney.jpg" />
                            <img title="MTN mobile money" className='img-pay-method' src="https://st6808.ispot.cc/media/mtnmobile.jpg" />
                            <img title="Moov money" className='img-pay-method' src="https://st6808.ispot.cc/media/moov.png" />
                            <img title="Airtel money" className='img-pay-method' src="https://st6808.ispot.cc/media/airtel.jpg" />
                        </div>
                    </div>
                </div>
                <div className='col-12 col-lg-4'>
                    <form className='register-form' noValidate autoComplete="off">
                        <div className='row justify-content-center'>
                            <div className='col-10 col-sm-8 col-md-6 col-lg-12'>
                                <TextField className='register-input' label="Nom de l'entreprise"  variant="outlined"
                                    error={state.businessNameError ? true : false}
                                    helperText={state.businessNameError ? 'Remplissez ce champ.' : null}
                                    value={model.businessName}
                                    placeholder="Danny's Shopping"
                                    onChange={(e) => {
                                        setModel({ ...model, ['businessName']: e.target.value });

                                    }}
                                />
                            </div>
                        </div>
                        <div className='row justify-content-center'>
                            <div className='col-10 col-sm-8 col-md-6 col-lg-12'>
                                <FormControl variant="outlined" className='register-input'>
                                    <InputLabel id="demo-simple-select-outlined-label">Secteur d'activité</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={model.businessType}
                                        onChange={(e) => {
                                            setModel({ ...model, ['businessType']: e.target.value });

                                        }}
                                        label="Type de business"
                                    >
                                        {businessTypes.map((biz, i) => (
                                            <MenuItem key={i} value={i+1}>{biz}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className='row justify-content-center'>
                            <div className='col-10 col-sm-8 col-md-6 col-lg-12'>
                                <TextField className='register-input' label="Numéro de votre CNI"
                                    placeholder="0272990143"
                                    variant="outlined"
                                    value={model.idCardNumber}
                                    error={state.idCardNumberError ? true : false}
                                    helperText={state.idCardNumberError ? 'Ce champ est obligatoire.' : null}
                                    onChange={(e) => {
                                        setModel({ ...model, ['idCardNumber']: e.target.value });

                                    }}
                                />
                            </div>
                        </div>
                        <div className='row justify-content-center'>
                            <div className='col-10 col-sm-8 col-md-6 col-lg-12'>
                                <TextField className='register-input' label="Coordonnées géographiques ( X )"
                                    disabled
                                    placeholder="0.00000"
                                    variant="outlined"
                                    value={longitude}
                                    error={longError ? true : false}
                                    helperText={longError ? "Cliquez sur le bouton ci-dessous, puis sur 'Allow' pour générer vos coordonnées géographiques." : null }

                            />
                            </div>
                        </div>
                        <div className='row justify-content-center'>
                            <div className='col-10 col-sm-8 col-md-6 col-lg-12'>
                                <Button onClick={() => getLocation()} variant="contained" color="default" >
                                   Ma position <ImLocation className="location-icon" />
                                </Button>
                                <br />
                                <br />
                            </div>
                        </div>
                        <div className='row justify-content-center'>
                            <div className='col-10 col-sm-8 col-md-6 col-lg-12'>
                                <TextField className='register-input' label="Coordonnées géographiques ( Y )"
                                    disabled
                                    placeholder="0.00000"
                                    variant="outlined"
                                    value={latitude}
                                    error={latError ? true : false}
                                    helperText={latError ? "Cliquez sur le bouton ci-dessus, puis sur 'Allow' pour générer vos coordonnées géographiques." : null}
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
                                        label={<span style={{fontSize: 15 }} >Je suis d'accord avec les <a href='/terms'>Termes</a> et <a href='/terms' >Conditions d'utilisation</a> de Yaillo !</span>}
                                    />

                                    {state.consent || state.new ? null : <span style={{ color: `red`, fontSize: 14 }} >Cochez la case ci-dessus pour être d'accord avec les termes et conditions d'utilisation de Yaillo !</span>}
                             </FormControl>
                            </div>
                        </div>
                       
                        <div className='row justify-content-center'>
                            <div className='col-10 col-sm-8 col-md-6 col-lg-12'>
                                <br />
                     
                                <div>
                                    <Button variant="contained" className='btn-register-2' onClick={() => submitStep2()} >{loading ? null : <span>S'inscrire</span>}</Button>
                                    {loading ? <h5 className='text-center loading-progress'><CircularProgress size={24}  style={{ color:`#fff` }} /></h5> : null}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
       
    );
}


const images = [
    'https://st6808.ispot.cc/media/barbershop.png',
    'https://st6808.ispot.cc/media/repairs.jpg',
    'https://st6808.ispot.cc/media/hotel.jpg',
    'https://st6808.ispot.cc/media/dentist.jpg',
    'https://st6808.ispot.cc/media/appliance.jpg',
    'https://st6808.ispot.cc/media/makeup.jpg',
    'https://st6808.ispot.cc/media/decoration.jpg',
    'https://st6808.ispot.cc/media/building.jpg',
    'https://st6808.ispot.cc/media/topograph.jpg'
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


const businessTypes = [
    'Restaurant & Fast-food',
    'Shopping',
    'Epicerie',
    'Snack-Bar & Boite de nuit',
    'Hôtel & Appartement',
    'Art & Divertissement',
    'Salle de fête',
    'Mécano-automobile',
    'Pharmacie',
    'Salon de coiffure (Hommes)',
    'Salon de beauté (Femmes)',
    'Salon de beauté (Mixte)',
    'Collège & Lycée',
    'Boulangerie & Pâtisserie',
    'Pressing & Nettoyage à sec',
    'Crèche & Maternelle',
    'Agence de voyage',
    'Artiste Make-Up',
    'Developpeur Web & Mobile',
    'Graphiste 2D/3D & Logo',
    "Cabinet d'avocats",
    'Beatmaking & enregistrement',
    'Cabinet de topographie',
    'Formation professionnelle',
    'Petite & Grande surface',
    'Vétérinaire',
    'Fitness Club',
    'Hôpital & Clinique',
    'Laboratoire LAM',
    'Dentiste',
    'Soins de beauté & Spa',
    'Cabinet medical',
    "Transfert d'argent",
    'Quincaillerie',
    'Menuiserie',
    'Plomberie',
    'Vidange',
    'Agence immobilière',
    'Vente & Location de maisons',
    'Serrurier',
    'Briqueterie',
    'Électricien',
    'Froid & Climatisation',
    'Réparateur de TV',
    'Réparateur Informatique',
    'Réparateur Smartphones',
    'Cordonnerie',
    'Lavage auto',
    'Événementiel',
    'Expert en Marketing',
    'Manutention'
];

