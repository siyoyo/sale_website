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
            We've detected a wallet app on your computer but we're not able to
            identify an account.
          </p>
          <br />
          <p>
            Make sure you've linked your account with your wallet and that your
            wallet is unlocked.
          </p>
        </div>
      </div>
    );
  }
}

export default WalletNotFound;
