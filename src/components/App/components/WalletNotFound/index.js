import React, { Component } from 'react';
import Calculator from '../Calculator';

class WalletNotFound extends Component {
  render() {
    return (
      <div
        className="container has-text-centered card"
        style={{ maxWidth: '60rem' }}
      >
        <div className="card-content">
          <br />
          <p>
            To participate in the ELTCOIN token sale, send ETH to this address:
          </p>
          <br />
          <p>
            <b>
              <a
                href="https://etherscan.io/address/0xcc3333acc9dc1f86387b02b4b2b14626a051da8c"
                target="_blank"
                rel="noopener noreferrer"
              >
                0xcc3333acc9dc1f86387b02b4b2b14626a051da8c
              </a>
            </b>
          </p>
          <br />
          <p>
            Minimum amount is <b>0.1 ETH</b> and maximum amount is{' '}
            <b>100 ETH.</b>
          </p>
          <br />
          <Calculator
            eltcoinValue={this.props.eltcoinValue}
            ethValue={this.props.ethValue}
            handleEltcoinChange={this.props.handleEltcoinChange}
            handleEthChange={this.props.handleEthChange}
          />
          <br />
          <p>
            For more information, we recommend reading{' '}
            <a
              href="https://medium.com/officialeltcoin/your-moon-mission-awaits-731d7676a678"
              target="_blank"
              rel="noopener noreferrer"
            >
              our official sale guide
            </a>.
          </p>
          <br />
          <p>
            <i className="fa fa-warning" />
            <small>
              <em>
                {' '}
                If your transaction spans multiple rounds, the amount of ELTCOIN
                you will receive is weighted accordingly.
              </em>
            </small>
          </p>
        </div>
      </div>
    );
  }
}

export default WalletNotFound;
