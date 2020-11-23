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
    InputAdornment,
    Checkbox,
    FormControlLabel,
    CircularProgress

} from '@material-ui/core';
import { Link } from 'react-router-dom';
import './DeliveryRegister.css';
import countries from '../countries';
import Flag from 'react-world-flags'
import DeliveryRegisterContext from './DeliveryRegisterContext';
import DeliveryRegisterReducer from './DeliveryRegisterReducer';
import { HiOutlineLightBulb } from 'react-icons/hi';
import flatdeliverybike from '../../images/flatdeliverybike.jpg';
import { PostApi, redirectTo, GetApi } from '../../api/ApiConstants';

export default function DeliveryRegister() {


    const ctx = useContext(DeliveryRegisterContext);
    const [state, dispatch] = useReducer(DeliveryRegisterReducer, ctx);
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


    const [model, setModel] = useState({
        firstName: '',
        lastName: '',
        address: '',
        password: null,
        phoneNumber: null,
        country: null,
        idCardNumber: '',
        idBackPicture: null,
        idFrontPicture: null,
        consent: false,
        
    });

    function sendData(state) {

        setLoading(true);

        var formData = new FormData();
        formData.append('FirstName', state.firstName);
        formData.append('LastName', state.lastName);
        formData.append('Country', state.country);
        formData.append('City', state.city);
        formData.append('Address', state.address);
        formData.append('Password', state.password);
        formData.append('PhoneNumber', `${code}${state.phoneNumber}`);
        formData.append('Code', code);
        formData.append('Iso', iso);
        formData.append('IdCardNumber', state.idCardNumber);
        formData.append('IdCardFront', state.idFrontPicture, 'front.jpg');
        formData.append('IdCardBack', state.idBackPicture, 'back.jpg');

        fetch(PostApi.CreateDeliveryManUrl, {
            method: 'POST',
            body: formData
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

    const [loading, setLoading] = useState(false);

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


    return (
       state.currentStep === 1 ? <div className='row justify-content-between' >
            <div className='col-12 col-lg-7 register-illustration'>
                <p className='register-title'>Devenez livreur indépendant sur Nicewix !<br />Acheminez les colis vers leurs destinataires et faites vous rémunérer selon le <Link to='/'>Kilométrage</Link> </p>
                <div className='row' >
                    <div className='col-12 col-lg-12'>
                        <div className='illustration-img-2' style={{ backgroundImage: `url(${'https://images.assettype.com/freepressjournal%2F2020-06%2Fb689b62f-2b25-4a9a-b28c-009ea41883e5%2Fpixabay.webp?w=1200'})` }}>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-12 col-lg-4'>
                <form className='register-form' noValidate autoComplete="off">
                    <div className='row justify-content-center'>
                        <div className='col-8 col-sm-6 col-md-4 col-lg-6'>
                            <TextField className='register-input' label="Nom de famille" placeholder="Konate" variant="outlined"
                                error={state.lnameError ? true : false}
                                helperText={state.lnameError ? 'Remplissez ce champ.' : null}
                                onChange={(e) => {
                                    setModel({ ...model, ['lastName']: e.target.value });

                                }}
                            />
                        </div>
                        <div className='col-8 col-sm-6 col-md-4 col-lg-6'>
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
                        <div className='col-8 col-sm-6 col-md-4 col-lg-6'>
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
                        <div className='col-8 col-sm-6 col-md-4 col-lg-6'>
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
                        <div className='col-8 col-sm-6 col-md-4 col-lg-12'>
                            <TextField className='register-input' label="Adresse / Quartier"
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
                        <div className='col-8 col-sm-6 col-md-4 col-lg-12'>
                            <TextField className='register-input' label="Numéro de téléphone"
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
                        <div className='col-8 col-sm-6 col-md-4 col-lg-12'>
                            <TextField className='register-input' label="Mot de passe" onChange={(e) => {
                                setModel({ ...model, ['password']: e.target.value });

                            }} variant="outlined"
                                error={state.passwordError ? true : false}
                                helperText={state.passwordError ? 'Entrez un mot de passe valide. [A-z] [0-9] [@-!]' : null}
                            />
                        </div>
                    </div>
                    <div className='row justify-content-center'>
                        <div className='col-8 col-sm-6 col-md-4 col-lg-12'>
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
                                    }
                                })
                            } >Continuer</Button>
                        </div>
                    </div>
                    <div className='row justify-content-center'>
                        <div className='col-8 col-sm-6 col-md-4 col-lg-12'>
                            <br />
                            <span>Vous avez déjà compte ? <Link to='/login'>Connectez-vous !</Link></span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
            :




            <div className='row justify-content-between'>
                <div className='col-12 col-lg-7 register-illustration'>
                    <p className='register-title'><HiOutlineLightBulb style={{ color: '#ebbb2a', marginTop: -10 }} size={35} /> Astuce ! Un excellent livreur doit être équipé d'un sac à dos et posséder un moyen de déplacement à 2 roues  ( bicyclette, mobylette, etc ). <br /> C'est plus pratique, rapide...et économique !</p>
                    <div className='row' >
                        <div className='col-12 col-lg-12'>
                            <div className='illustration-img-3' style={{ backgroundImage: `url(${flatdeliverybike})` }}>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-12 col-lg-4'>
                    <form className='register-form' noValidate autoComplete="off">
                        <div className='row justify-content-center'>
                            <div className='col-8 col-sm-6 col-md-4 col-lg-12'>
                                <TextField className='register-input' label="Numéro de votre Carte Nationale D'identité"
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
                            <div className='col-8 col-sm-6 col-md-4 col-lg-12'>
                                <TextField className='register-input' label="Capture recto de votre CNI"
                                    error={state.idFrontPictureError ? true : false}
                                    helperText={state.idFrontPictureError ? 'Uploadez une capture recto de votre CNI.' : null}
                                    placeholder=""
                                    type="file"
                                    accept="*jpg/*jpeg/*png"
                                    variant="outlined"
                                    onChange={(e) => {
                                        setModel({ ...model, ['idFrontPicture']: e.target.files[0] });
                                        var file = URL.createObjectURL(e.target.files[0]);
                                        setCardOne(file);
                                    }}
                                />
                              
                                <div className='id-card-preview' style={{ backgroundImage: `url(${file1})` }}>
                                </div>
                            </div>
                        </div>
                        <div className='row justify-content-center'>
                            <div className='col-8 col-sm-6 col-md-4 col-lg-12'>
                                <TextField className='register-input' label="Capture verso de votre CNI"
                                    error={state.idBackPictureError ? true : false}
                                    helperText={state.idBackPictureError ? 'Uploadez une capture verso de votre CNI.' : null}
                                  
                                    type="file"
                                    accept="*jpg/*jpeg/*png"
                                    variant="outlined"
                                    onChange={(e) => {
                                        setModel({ ...model, ['idBackPicture']: e.target.files[0] });
                                        var file = URL.createObjectURL(e.target.files[0]);
                                        setCardTwo(file);
                                    }}
                                />
                         
                                <div className='id-card-preview' style={{ backgroundImage:`url(${file2})` }}>
                                </div>
                            </div>
                        </div>
                        <div className='row justify-content-center'>
                            <div className='col-8 col-sm-6 col-md-4 col-lg-12'>
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
                                        label={<span style={{fontSize: 15 }} >Je suis d'accord avec les <Link to='/'>Termes</Link> et <Link to='/' >Conditions d'utilisation</Link> de Nicewix.</span>}
                                    />

                                    {state.consent || state.new ? null : <span style={{ color: `red`, fontSize:14 }} >Cochez la case ci-dessus pour etre d'accord avec les termes et conditions d'utilisation de Nicewix.</span>}
                             </FormControl>
                            </div>
                        </div>
                       
                        <div className='row justify-content-center'>
                            <div className='col-8 col-sm-6 col-md-4 col-lg-12'>
                                <br />
                     
                                <Button variant="contained" className='btn-register-2' onClick={() =>
                                    dispatch({
                                        type: "validate-step-2",
                                        data: {
                                            
                                            idCardNumber: model.idCardNumber,
                                            idFrontPicture: model.idFrontPicture,
                                            idBackPicture: model.idBackPicture,
                                            consent: model.consent,
                                            sendData: sendData,
                                        }
                                    })
                                } >{loading ? null : <span>S'inscrire</span>}</Button>
                                {loading ? <h5 className='text-center loading-progress'><CircularProgress size={24} style={{ color: `#fff` }} /></h5> : null}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
       
    );
}