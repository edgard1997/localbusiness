import React, { Component } from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import authService from './api-authorization/AuthorizeService';
import MobileNavbar from './MobileNavBar';
import './MobileNavbar.css';
import yaillo from "../images/yaillo.png";

export class Layout extends Component {
    static displayName = Layout.name;

  render () {
      return (
          <>
              <div className='outer-mobile-container'>
                  <LogoBar />
                  <div className='mobile-container'>
                      {this.props.children}
                  </div>
                  <Footer />
                  <MobileNavbar />
              </div>
              <div className='outer-desktop-container' >
                  <NavMenu />
                  <div style={{ zIndex: -100, backgroundColor: `#fff` }}>
                      {this.props.children}
                  </div>
                  <Footer />
              </div>
          </>
    );
  }
}

export function LogoBar() {

    return (
        <div className='mobile-logobar'>
            <div className='container'>
                <div className='row justify-content-center'>
                    <div className='col-12'>
                        <h4 className='text-center'>
                            <a href="/">
                                <img className='app-logo-img' src={`${yaillo}`} />
                            </a>
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    );

}


