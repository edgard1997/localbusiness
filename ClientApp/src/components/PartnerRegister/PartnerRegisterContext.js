import { createContext } from "react";

const PartnerRegisterContext = createContext({
    firstName: '',
    lastName: '',
    address: '',
    password: null,
    phoneNumber: null,
    email:null,
    country: null,
    city: null,
    businessName: '',
    businessType: '',
    idCardNumber: null,
    idBackPicture: null,
    idFrontPicture: null,
    consent: false,
    addressError: false,
    fnameError: false,
    lnameError: false,
    passwordError: false,
    phoneNumberError: false,
    businessNameError: false,
    idCardNumberError: false,
    idFrontPictureError: false,
    idBackPictureError: false,
    currentStep: 1,
    new:true,
});

export default PartnerRegisterContext;