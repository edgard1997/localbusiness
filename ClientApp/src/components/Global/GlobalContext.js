import React, { createContext, useReducer } from "react";
import GlobalReducer from "./GlobalReducer";
import authService from "../api-authorization/AuthorizeService";

const initialData = {
    profile: null,
    lat: 0,
    long: 0,
    filters:[],
    activeAccountLink: 'details',
};

export const dataContext = createContext(initialData);


export const DataContextProvider = (props) => {
    const [reducer, dispatch] = useReducer(GlobalReducer, dataContext);

    return (<dataContext.Provider value={{
        dataContext: reducer, dcReducer: dispatch,}}>
        {props.children}
    </dataContext.Provider>);
}

export const useDataContext = () => React.useContext(dataContext);