import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { Link } from "react-router-dom";
import NavMenu from './NavMenu';
import './AuthorizedLayout.css';
import MobileNavbar from './MobileNavBar';
import { LogoBar } from './Layout';
import './NavMenu.css';

export class AuthorizedLayout extends Component {

    constructor(props) {
        super(props);
        this.state = { width: window.innerWidth, height: window.innerHeight };
    }
   

    updateDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    };
    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    render() {
        return (
            <>
                {
                    this.state.width > 768 ? <div className='desktop-friendly-authorized-layout' >
                        <NavMenu />
                        <div on className='container-fluid' style={{ zIndex: -100, backgroundColor: `#fff` }}>
                            {this.props.children}
                        </div>
                        <AuthorizedFooter />
                    </div>
                        :
                        <div className='mobile-friendly-authorized-layout'>
                            <LogoBar />
                            <div className='container-fluid' style={{ zIndex: -100, backgroundColor: `#fff` }}>
                                {this.props.children}
                            </div>
                            <MobileNavbar />
                        </div>
                }
                
          </>
        );
    }
}


function AuthorizedFooter() {
    return (<div className="authorized-footer">
        <Container>
            <div className='row'>
                <div className='col-2 col-md-1'>
                    <Link className='authorized-footer-link' to='/terms'>Termes</Link>
                </div>
                <div className='col-2  col-md-1'>
                    <Link className='authorized-footer-link' to='/payment' >Abonnement</Link>
                </div>
                <div className='col-2'>
                    <Link className='authorized-footer-link' to='/help'>Centre d'aide</Link>
                </div>
            </div>
        </Container>
    </div>);
}
