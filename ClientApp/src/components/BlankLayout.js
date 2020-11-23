import React, { Component } from 'react';
import { Container } from 'reactstrap';


export class BlankLayout extends Component {
    static displayName = BlankLayout.name;

    render() {
        return (
            <div>
              
                <Container>
                    {this.props.children}
                </Container>
                
            </div>
        );
    }
}
