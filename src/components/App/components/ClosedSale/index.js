import React, { Component } from 'react';

class ClosedSale extends Component {
  render() {
    return (
      <div
        className="container has-text-centered card"
        style={{ maxWidth: '60rem' }}
      >
        <div className="card-content">
          <p>The ELTCOIN token sale is currently closed.</p>
        </div>
      </div>
    );
  }
}

export default ClosedSale;
