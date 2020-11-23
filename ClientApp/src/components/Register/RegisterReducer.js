export default function RegisterReducer(state, action) {
    let context = { ...state };

    switch (action.type) {
        case "validate-form":
            context.firstName = action.data.firstName;
            context.lastName = action.data.lastName;
            context.phoneNumber = action.data.phoneNumber;
            context.password = action.data.password;
            context.country = action.data.country;
            context.city = action.data.city;
            context.address = action.data.address;
            context.consent = action.data.consent;

            let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            let phoneRegex = /^\d{6,12}$/;
         
            let validpassword = passwordRegex.test(context.password);
            let validPhoneNumber = phoneRegex.test(context.phoneNumber);
            context.addressError = context.address.length > 4  ? false : true;
            context.phoneNumberError = validPhoneNumber ? false : true;
            context.fnameError = String(context.firstName).length > 2 ? false : true;
            context.lnameError = String(context.lastName).length > 4 ? false : true;
            context.passwordError = validpassword ? false : true;

           
            if (!context.addressError && !context.fnameError && !context.lnameError && !context.passwordError && !context.phoneNumberError && !context.addressError && context.consent) {
                action.data.sendData(context);
            }
           
            context.new = false;

            return context;
    }
}

