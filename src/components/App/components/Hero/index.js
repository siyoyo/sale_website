import React, { Component } from 'react';
import ProgressBar from 'progressbar.js';
import logo from './images/logo.png';

let firstTime = true;

class Hero extends Component {
  componentWillReceiveProps(nextProps) {
    var secondBar = new ProgressBar.Line(document.querySelector('#progress'), {
      strokeWidth: 4,
      easing: 'easeInOut',
      duration: 1000,
      color: '#ffdd57',
      trailColor: '#b5b5b5',
      trailWidth: 10,
      svgStyle: {
        'max-width': '60rem',
        'border-radius': '2rem',
      },
    });

    var firstBar = new ProgressBar.Line(document.querySelector('#progress'), {
      strokeWidth: 4,
      easing: 'easeInOut',
      duration: 1000,
      color: '#23d160',
      trailColor: '#b5b5b5',
      trailWidth: 0.01,
      svgStyle: {
        'max-width': '60rem',
        'border-radius': '2rem',
      },
    });

    const firstBarAmount = nextProps.currentAmount / nextProps.maxAmount;
    const secondBarAmount = Math.min(
      nextProps.selectedAmount / nextProps.maxAmount,
      1,
    );

    if (firstTime) {
      if (firstBarAmount === 0) {
        return;
      }

      firstBar.animate(firstBarAmount);
      secondBar.animate(firstBarAmount + secondBarAmount);

      if (firstBarAmount > 0) {
        firstTime = false;
      }
    } else {
      firstBar.set(firstBarAmount);
      secondBar.set(firstBarAmount + secondBarAmount);
    }
  }

  render() {
    if (this.props.currentPrice === 0) return;

    return (
      <section className="hero">
        <div className="hero-body">
          <div className="container has-text-centered">
            <img src={logo} width={150} alt="" />
            <h3 className="is-size-3 hero-subtitle">Token Sale</h3>
            <br />
            <div id="progress" />
            <p className="is-size-5">
              Only{' '}
              <b>
                {Number(
                  this.props.maxAmount - this.props.currentAmount,
                ).toFixed()}
              </b>{' '}
              remaining ELTCOIN this round
            </p>
            <br />
            <p>
              Current price: <b>${this.props.currentPrice}</b> / Next price:{' '}
              <b>${this.props.currentPrice + 0.01}</b>
            </p>
          </div>
        </div>
      </section>
    );
  }
}

export default Hero;
