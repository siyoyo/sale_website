import React, { Component } from 'react';

class WalletNotFound extends Component {
  render() {
    return (
      <div
        className="container has-text-centered card"
        style={{ maxWidth: '60rem' }}
      >
        <div className="card-content">
          <p>
            We've detected a wallet app on your computer but it looks like
            you're on the wrong Ethereum network.
          </p>
          <br />
          <p>
            Make sure you've configured your wallet app to use the main network.
          </p>
        </div>
      </div>
    );
  }
}

export default WalletNotFound;
