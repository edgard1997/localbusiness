export default function AccountReducer(state, action) {
    let context = { ...state };

    switch (action.type) {

        case "biz-change-details":
            context.firstName = action.data.firstName;
            context.lastName = action.data.lastName;
            context.phoneNumber = action.data.phoneNumber;
            context.country = action.data.country;
            context.city = action.data.city;
            context.address = action.data.address;
            context.email = action.data.email;
            context.userId = action.data.userId;

            let numberRegex = /^\d{6,14}$/;
            let phoneRegex = /^\d{6,12}$/;
            let validPhoneNumber = phoneRegex.test(context.phoneNumber);
            context.addressError = String(context.address).length > 4 ? false : true;
            context.phoneNumberError = validPhoneNumber ? false : true;
            context.fnameError = String(context.firstName).length > 2 ? false : true;
            context.lnameError = String(context.lastName).length > 4 ? false : true;
           

            if (!context.addressError && !context.fnameError && !context.lnameError && !context.phoneNumberError && !context.addressError) {
                action.data.sendData(context);
            }

            return context;

        case "change-password":
            context.oldPassword = action.data.oldPassword;
            context.newPassword = action.data.newPassword;
            context.confirmNewPassword = action.data.confirmNewPassword;
            let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            let validOldPassword = passwordRegex.test(context.oldPassword);
            let validnewPassword = passwordRegex.test(context.newPassword);
            context.oldPasswordError = validOldPassword ? false : true;
            context.newPasswordError = validnewPassword ? false : true;
            context.passwordsDontMatch = context.newPassword === context.confirmNewPassword ? false : true;
            if (!context.confirmNewPasswordError && !context.newPasswordError && !context.oldPasswordError && !context.passwordsDontMatch)
            {
                action.data.sendData(context);
            }

            return context;

        case "about-you":
            context.aboutYou = action.data.aboutYou;
            context.aboutYouError = context.aboutYou !== null ? false : true;
            if (!context.aboutYouError) {
                action.data.sendData(context);
            }

            return context;
      
    }
}
