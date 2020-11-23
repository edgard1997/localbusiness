import { createContext } from "react";

const RegisterContext = createContext({
    firstName: '',
    lastName: '',
    address: '',
    password: null,
    phoneNumber: null,
    country: null,
    city: null,
    consent: false,
    addressError: false,
    fnameError: false,
    lnameError: false,
    passwordError: false,
    phoneNumberError: false,
    new:true,
});

export default RegisterContext;