export default function DeliveryRegisterReducer(state, action) {
    let context = { ...state };

    switch (action.type) {
        case "validate-step-1":
            context.firstName = action.data.firstName;
            context.lastName = action.data.lastName;
            context.phoneNumber = action.data.phoneNumber;
            context.password = action.data.password;
            context.country = action.data.country;
            context.city = action.data.city;
            context.address = action.data.address;

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
           
            context.idCardNumber = action.data.idCardNumber;
            context.idBackPicture = action.data.idBackPicture;
            context.idFrontPicture = action.data.idFrontPicture;
            context.consent = action.data.consent;
           
            let numberRegex = /^\d{6,14}$/;

            //let validCardNumber = numberRegex.test(context.idCardNumber);
            context.idCardNumberError = context.idCardNumber.length > 4 ? false : true;
            context.idBackPictureError = context.idBackPicture != null ? false : true;
            context.idFrontPictureError = context.idFrontPicture != null ? false : true;
            
            if (!context.idCardNumberError && !context.idBackPictureError && !context.idFrontPictureError && context.consent) {
                action.data.sendData(context);
            }

            context.new = false;

            return context;
    }
}

