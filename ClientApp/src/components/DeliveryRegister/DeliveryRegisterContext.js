import { createContext } from "react";

const DeliveryRegisterContext = createContext({
    firstName: '',
    lastName: '',
    address: '',
    password: null,
    phoneNumber: null,
    country: null,
    city: null,
    idCardNumber: null,
    idBackPicture: null,
    idFrontPicture: null,
    consent: false,
    addressError: false,
    fnameError: false,
    lnameError: false,
    passwordError: false,
    phoneNumberError: false,
    idCardNumberError: false,
    idFrontPictureError: false,
    idBackPictureError: false,
    currentStep: 1,
    new:true,
});

export default DeliveryRegisterContext;