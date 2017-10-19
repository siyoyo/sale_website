import React, { Component } from 'react';

class Calculator extends Component {
  render() {
    return (
      <div>
        <div
          className="field"
          style={{
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="control">
            <p style={{ margin: 'auto .5rem', textAlign: 'center' }}>ELTCOIN</p>
            <input
              className="input is-medium"
              style={{ textAlign: 'center' }}
              type="number"
              step="3000"
              min="0"
              value={this.props.eltcoinValue}
              onChange={this.props.handleEltcoinChange}
            />
          </div>
          <p className="title" style={{ margin: '1.8rem .5rem' }}>
            {' '}
            ={' '}
          </p>
          <div className="control">
            <p style={{ margin: 'auto .5rem', textAlign: 'center' }}>ETH</p>
            <input
              className="input is-medium"
              type="number"
              style={{ textAlign: 'center' }}
              step="0.5"
              max="100"
              value={this.props.ethValue}
              onChange={this.props.handleEthChange}
            />
          </div>
        </div>
        <input
          className="slider is-fullwidth"
          style={{ maxWidth: '30rem', margin: 'auto' }}
          step="0.5"
          max="100"
          min="1"
          value={this.props.ethValue}
          onChange={this.props.handleEthChange}
          type="range"
        />
      </div>
    );
  }
}

export default Calculator;
