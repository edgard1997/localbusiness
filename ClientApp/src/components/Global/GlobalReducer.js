export default function GlobalReducer(state, action) {
    let context = { ...state };

    switch (action.type) {

        case "navigate-account":
            context.activeAccountLink = action.data.activeAccountLink;
           
            return context;
        case "navigate-dashboard":
            context.activeAccountLink = action.data.activeAccountLink;

            return context;

        case "set-profile":
            context.profile = action.data.profile;
            return context;
        case "set-coordinates":
            context.lat = action.data.lat;
            context.long = action.data.long;
            return context;
        case "set-default-coordinates":
            context.lat = action.data.lat;
            context.long = action.data.long;
            return context;
    }
}