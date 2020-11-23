import React, { Component, Fragment } from 'react';
import { Button, IconButton } from "@material-ui/core";
import { Link, useParams } from 'react-router-dom';
import authService from './AuthorizeService';
import { ApplicationPaths } from './ApiAuthorizationConstants';
import { ImLocation } from "react-icons/im";
import { FiStar, FiUser, FiLogOut, FiLogIn } from 'react-icons/fi';
import { BiHome } from 'react-icons/bi';
import '../NavMenu.css';
import { AiFillShop } from 'react-icons/ai';
import { RiStore2Line } from 'react-icons/ri';


export class LoginMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            userName: null,
            picture: null,
            city: props.city != null && props.city != undefined ? props.city : 'Global',
            role:0,
            toggleCities: props.toggleCities,
            toggleCategories: props.toggleCategories,
        };
    }

    componentDidMount() {
        this._subscription = authService.subscribe(() => this.populateState());
        this.populateState();
    }

    //componentWillUnmount() {
    //    authService.unsubscribe(this._subscription);
    //}

    async populateState() {
        const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()]);
       
        this.setState({
            isAuthenticated,
            userName: user && user.given_name,
            picture: user && user.profile_pic,
            city: user != null ? user.city : this.state.city,
            role: user && user.role
        });


    }

      signIn(e) {
         e.preventDefault();
         authService.signIn(window.location.href);
    return false;
}

    render() {
    const { isAuthenticated, userName } = this.state;

        if (!isAuthenticated) {
            const registerPath = `${ApplicationPaths.Register}`;
            const loginPath = `${ApplicationPaths.Login}`;
            return this.anonymousView(registerPath, loginPath);
        } else {
            const profilePath = `${ApplicationPaths.Profile}`;
            const logoutPath = { pathname: `${ApplicationPaths.LogOut}`, state: { local: true } };
            return this.authenticatedView(userName, profilePath, logoutPath);
        }
    }



    authenticatedView(userName, profilePath, logoutPath) {

        return (
            <div className='row justify-content-end'>
                <div className='authenticated-lg-row col-10 col-md-10'>

                    {
                        this.state.role != 2 ? null :<Link to='/partenaire/dashboard'>
                            <IconButton className='user-icon'  >
                                <BiHome />
                            </IconButton>
                        </Link>
                    }
                    <IconButton className='user-icon'
                        onClick={() => this.state.toggleCategories()} >
                        <FiStar />
                    </IconButton>
                    <Link to='/user/compte'>
                        <IconButton className='user-icon'  >
                            <FiUser />
                        </IconButton>
                    </Link>
                    <img title={userName} className='userProfileImg' src={this.state.picture} />
                    <span className='profileName' >{userName}</span>
                    <Link to={logoutPath}>
                        <IconButton>
                            <FiLogOut />
                        </IconButton>
                    </Link>
                    <Button onClick={() => this.state.toggleCities()} variant="outlined" className="user-city btn-create-seller">
                        <span>{capitalizeFirstLetter(this.state.city)}</span> <ImLocation className="location-icon" />
                    </Button>
                    <IconButton onClick={() => this.state.toggleCities()} variant="outlined" className="user-city-two">
                        <ImLocation className="location-icon" />
                    </IconButton>
                </div>
              
            </div>
        );
    }

    anonymousView(registerPath, loginPath) {
 
        return (
            <Fragment>
                <div className='row justify-content-end'>
                    <div className='anonymous-lg-row col-12 col-md-12'>
                        <IconButton className='user-icon'
                            onClick={() => this.state.toggleCategories()} >
                            <FiStar />
                        </IconButton>
                   <Button
        variant="outlined"
        className="btn-create-seller"
        href={`partenariat/${this.props.city}`}
    >
        Devenir partenaire
            </Button>
    <Button variant="outlined" className="btn-login" onClick={this.signIn} >
        Se connecter
        </Button>
    <Button
        variant="contained"
        className="btn-register"
        href={`inscription/${this.props.city}`}
    >
        S'inscrire
        </Button>
    <Button onClick={() => this.state.toggleCities()} variant="outlined" className="user-city btn-create-seller">
        <span>{capitalizeFirstLetter(this.state.city)}</span> <ImLocation className="location-icon" />
    </Button>
                        <IconButton onClick={() => this.state.toggleCities()} variant="outlined" className="user-city-two">
                            <ImLocation className="location-icon-2" />
                        </IconButton>
                    </div>
                    <div className='anonymous-md-row col-10 col-sm-7 col-md-8'>
                        <IconButton className='user-icon'
                            onClick={() => this.state.toggleCategories()} >
                            <FiStar />
                        </IconButton>
                        <IconButton href={`partenariat/${this.props.city}`} className='user-icon'
                        >
                            <RiStore2Line />
                        </IconButton>
                            <IconButton href={`inscription/${this.props.city}`}  className='user-icon'  >
                                <FiUser />
                            </IconButton>
                            <IconButton onClick={this.signIn} className="logout-icon">
                                <FiLogIn />
                            </IconButton>
                        <IconButton onClick={() => this.state.toggleCities()} variant="outlined" className="user-city-two">
                            <ImLocation className="location-icon-2" />
                        </IconButton>
                    </div>
                <div className='anonymous-xs-row col-12'>
                    <IconButton className='user-icon'
                        onClick={() => this.state.toggleCategories()} >
                        <FiStar />
                        </IconButton>
                        <IconButton href={`partenariat/${this.props.city}`} className='user-icon'
                        >
                            <RiStore2Line />
                        </IconButton>
                        <IconButton href={`inscription/${this.props.city}`} className='user-icon'  >
                            <FiUser />
                        </IconButton>
                            <IconButton onClick={this.signIn} className="logout-icon">
                            <FiLogIn />
                        </IconButton>
                    <IconButton onClick={() => this.state.toggleCities()} variant="outlined" className="user-city-two">
                        <ImLocation className="location-icon-2" />
                    </IconButton>
                    </div>
                </div>
            </Fragment>
        );
    }
}




//<IconButton className='user-icon'
//    onClick={() => this.state.toggleCategories()} >
//    <FiStar />
//</IconButton>
//    <Button
//        variant="outlined"
//        className="btn-create-seller"
//        href={`partenariat/${this.props.city}`}
//    >
//        Devenir partenaire
//            </Button>
//    <Button variant="outlined" className="btn-login" onClick={this.signIn} href={loginPath}>
//        Se connecter
//        </Button>
//    <Button
//        variant="contained"
//        className="btn-register"
//        href={`inscription/${this.props.city}`}
//    >
//        S'inscrire
//        </Button>
//    <Button onClick={() => this.state.toggleCities()} variant="outlined" className="user-city btn-create-seller">
//        <span>{capitalizeFirstLetter(this.state.city)}</span> <ImLocation className="location-icon" />
//    </Button>
//    <IconButton onClick={() => this.state.toggleCities()} variant="outlined" className="user-city-two">
//        <ImLocation className="location-icon" />
//    </IconButton>

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}