import React, { Component } from 'react';
import logo from './images/logo.png';

class Hero extends Component {
  render() {
    if (this.props.currentPrice === 0) return;

    return (
      <section className="hero">
        <div className="hero-body">
          <div className="container has-text-centered">
            <img src={logo} width={150} alt="" />
            <h3 className="is-size-3 hero-subtitle">Token Sale</h3>
            <br />
          </div>
        </div>
      </section>
    );
  }
}

export default Hero;
