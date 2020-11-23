export default function PartnerRegisterReducer(state, action) {
    let context = { ...state };

    switch (action.type)
    {
        case "validate-step-1":
            context.firstName = action.data.firstName;
            context.lastName = action.data.lastName;
            context.phoneNumber = action.data.phoneNumber;
            context.password = action.data.password;
            context.country = action.data.country;
            context.city = action.data.city;
            context.address = action.data.address;
            
            //let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            let phoneRegex = /^\d{6,12}$/;
         
            let validpassword = passwordRegex.test(context.password);
            let validPhoneNumber = phoneRegex.test(context.phoneNumber);
            context.addressError = context.address.length > 4  ? false : true;
            context.phoneNumberError = validPhoneNumber ? false : true;
            context.fnameError = String(context.firstName).length > 2 ? false : true;
            context.lnameError = String(context.lastName).length > 4 ? false : true;
            context.passwordError = validpassword ? false : true;

           
            if (!context.addressError && !context.fnameError && !context.lnameError && !context.passwordError && !context.phoneNumberError && !context.addressError) {
                context.currentStep = 2;
            }

            return context;

        case "validate-step-2":
            context.businessName = action.data.businessName;
            context.businessType = action.data.businessType;
            context.idCardNumber = action.data.idCardNumber;
            context.email = action.data.email;
            context.consent = action.data.consent;
           
            let numberRegex = /^\d{6,14}$/;

            context.idCardNumberError = context.idCardNumber.length > 4 ? false : true;
            context.businessNameError = String(context.businessName).length > 4 ? false : true;
            if (!context.businessNameError && !context.idCardNumberError && context.consent) {
               action.data.sendData(context);
               
            }

            context.new = false;

            return context;
    }
}

