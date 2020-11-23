export const baseUrl = "https://yaillo.com"; /// "https://localhost:44313"; //"http://192.168.1.145:19000"; 

export function redirectTo(url) {
     window.location.replace(url);
}

export const Controllers = {
  Home: 'home',
  Account: 'account',
    Business: 'business',
  Search:'search',
  Review:'review'
};

export const PostActions = {
  Register: 'register',
  NewBusiness: 'newBusiness',
  NewDeliveryMan: 'newdeliveryman',
    Details: 'details',
    Details2: 'details2',
    PostUsersAmenities: 'synopsis',
    ChangePassword: 'changePassword',
    PostAboutBiz: 'aboutBusiness',
    PostVerification: 'verify',
    PostChangeHours: 'changeHours',

    //businnes dashboard
    PostAddPhoto: 'addPhoto',
    PostEditPhoto: 'editPhoto',
    OwnedPhotoAlbum: 'ownedAlbum',
     //anonymous
    ApplyFilters: 'filters',
    PostReview1: 'postReview1',
    PostReview2: 'postReview2',
    PostReportPage: 'reportPage',
    PostReportReview: 'reportReview',
    PostVisitCounter: 'visitCounter',

};

export const GetActions = {
    Home: '',
    Login: 'authentication/login',
    Details: 'details',
    GetUsersAmenities: 'synopsis',
    GetSubInfo: 'subscriptionInfo',
    GetAboutBiz: 'aboutBusiness',
    GetVerification: 'verify',
    GetChangeHours: 'getHours',
    GetDeleteAccount: 'deleteAccount',
    //business dashboard
    GetDeletePhoto: 'deletePhoto',
    GetInsight: 'getInsight',

     //anonymous
    GetSuggestions: `getSuggestions`,
    GetByQuery: 'byQuery',
    GetByCategory: 'byCategory',
    GetBiz: 'biz',
    GetDeleteComment: 'deleteReview',
    GetMoreReviews: 'moreReviews',
    GetLocal: 'getLocal',
};


export const PostApi = {
    //account
    CreateClientUrl: `${baseUrl}/${Controllers.Account}/${PostActions.Register}`,
    CreateBusinessUrl: `${baseUrl}/${Controllers.Account}/${PostActions.NewBusiness}`,
    Details: `${baseUrl}/${Controllers.Account}/${PostActions.Details}`,
    Details2: `${baseUrl}/${Controllers.Account}/${PostActions.Details2}`,
    PostUsersAmenities: `${baseUrl}/${Controllers.Account}/${PostActions.PostUsersAmenities}`,
    ChangePassword: `${baseUrl}/${Controllers.Account}/${PostActions.ChangePassword}`,
    PostAboutBiz: `${baseUrl}/${Controllers.Account}/${PostActions.PostAboutBiz}`,
    PostVerification: `${baseUrl}/${Controllers.Account}/${PostActions.PostVerification}`,
    PostChangeHours: `${baseUrl}/${Controllers.Account}/${PostActions.PostChangeHours}`,

    //business dashboard
    PostAddPhoto: `${baseUrl}/${Controllers.Business}/${PostActions.PostAddPhoto}`,
    PostEditPhoto: `${baseUrl}/${Controllers.Business}/${PostActions.PostEditPhoto}`,
    OwnedPhotoAlbum: `${baseUrl}/${Controllers.Business}/${PostActions.OwnedPhotoAlbum}`,

    //anonymous
    ApplyFilters: `${baseUrl}/${Controllers.Search}/${PostActions.ApplyFilters}`,
    PostVisitCounter: `${baseUrl}/${Controllers.Search}/${PostActions.PostVisitCounter}`,

    //user
    PostReview1: `${baseUrl}/${Controllers.Review}/${PostActions.PostReview1}`,
    PostReview2: `${baseUrl}/${Controllers.Review}/${PostActions.PostReview2}`,
    PostReportPage: `${baseUrl}/${Controllers.Review}/${PostActions.PostReportPage}`,
    PostReportReview: `${baseUrl}/${Controllers.Review}/${PostActions.PostReportReview}`,
};

export const GetApi = {
    HomeUrl: `${baseUrl}`,
    LoginUrl: `${baseUrl}/${GetActions.Login}`,
    Details: `${baseUrl}/${Controllers.Account}/${GetActions.Details}`,
    GetUsersAmenities: `${baseUrl}/${Controllers.Account}/${GetActions.GetUsersAmenities}`,
    GetSubInfo: `${baseUrl}/${Controllers.Account}/${GetActions.GetSubInfo}`,
    GetAboutBiz: `${baseUrl}/${Controllers.Account}/${GetActions.GetAboutBiz}`,
    GetVerification: `${baseUrl}/${Controllers.Account}/${GetActions.GetVerification}`,
    GetChangeHours: `${baseUrl}/${Controllers.Account}/${GetActions.GetChangeHours}`,
    GetDeleteAccount: `${baseUrl}/${Controllers.Account}/${GetActions.GetDeleteAccount}`,
    //business dashboard
    GetDeletePhoto: `${baseUrl}/${Controllers.Business}/${GetActions.GetDeletePhoto}`,
    GetInsight: `${baseUrl}/${Controllers.Business}/${GetActions.GetInsight}`,

    //anonymous
    GetSuggestions: `${baseUrl}/${Controllers.Search}/${GetActions.GetSuggestions}`,
    GetByQuery: `${baseUrl}/${Controllers.Search}/${GetActions.GetByQuery}`,
    GetByCategory: `${baseUrl}/${Controllers.Search}/${GetActions.GetByCategory}`,
    PostReview1: `${baseUrl}/${Controllers.Review}/${GetActions.PostReview1}`,
    PostReview2: `${baseUrl}/${Controllers.Review}/${GetActions.PostReview2}`,
    GetBiz: `${baseUrl}/${Controllers.Search}/${GetActions.GetBiz}`,
    GetAlbum: `${baseUrl}/${Controllers.Search}/album`,
    GetDeleteComment: `${baseUrl}/${Controllers.Review}/${GetActions.GetDeleteComment}`,
    GetMoreReviews: `${baseUrl}/${Controllers.Review}/${GetActions.GetMoreReviews}`,
    GetLocal: `${baseUrl}/${Controllers.Review}/${GetActions.GetLocal}`,
};
