import React, { Component } from 'react';
import Web3 from 'web3';
import TruffleContract from 'truffle-contract';
import Calculator from '../Calculator';
import successImage from './images/success.png';
import saleContractData from '../../data/ELTCoinCrowdsale.json';
import coinContractData from '../../data/ELTCoin.json';
class Sale extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eltcoinBalance: 0,
      ethBalance: 0,
      pageNumber: 1,
    };

    this.getBalances = this.getBalances.bind(this);
    this.renderErrorMessage = this.renderErrorMessage.bind(this);
  }

  componentDidMount() {
    this.getBalances();
  }

  async getBalances(userAddress) {
    const web3Provider = window.web3.currentProvider;
    const web3 = new Web3(web3Provider);

    const saleContract = TruffleContract(saleContractData);
    const coinContract = TruffleContract(coinContractData);

    saleContract.setProvider(web3Provider);
    coinContract.setProvider(web3Provider);

    const saleContractInstance = await saleContract.deployed();
    const tokenAddress = await saleContractInstance.token();
    const coinInstance = await coinContract.at(tokenAddress);
    const eltcoinBalance = await coinInstance.balanceOf(this.props.userAccount);

    web3.eth.getBalance(this.props.userAccount, async (error, balance) => {
      let weiBalance = balance;

      window.amplitude.getInstance().logEvent('Wallet connected', {
        ethAddress: this.props.userAccount,
        eltcoinBalance: (eltcoinBalance.toString('10') / 10 ** 8).toFixed(2),
        ethBalance: (weiBalance.toString('10') / 10 ** 18).toFixed(2),
      });

      this.setState({
        web3,
        saleContractInstance,
        eltcoinBalance: (eltcoinBalance.toString('10') / 10 ** 8).toFixed(2),
        ethBalance: (weiBalance.toString('10') / 10 ** 18).toFixed(2),
      });
    });
  }

  renderBalances() {
    if (!this.state.eltcoinBalance) {
      return;
    }

    return (
      <p>
        <strong>Balances: </strong>
        {this.state.ethBalance} ETH and {this.state.eltcoinBalance} ELTCOIN
      </p>
    );
  }

  setPageNumber(n) {
    this.setState({
      pageNumber: n,
    });
  }

  sendPayment() {
    this.setPageNumber(3);

    window.amplitude.getInstance().logEvent('Send payment clicked', {
      from: this.props.userAccount,
      ethValue: this.props.ethValue,
      eltcoinValue: this.props.eltcoinValue,
    });

    this.state.web3.eth.sendTransaction(
      {
        from: this.props.userAccount,
        to: this.state.saleContractInstance.address,
        value: this.state.web3.toBigNumber(
          this.state.web3.toWei(this.props.ethValue, 'ether'),
        ),
      },
      (err, transactionHash) => {
        if (err) {
          console.error(err);
          return;
        }

        this.setState(
          {
            transactionHash: transactionHash,
          },
          () => {
            window.amplitude.getInstance().logEvent('Payment sent', {
              from: this.props.userAccount,
              ethValue: this.props.ethValue,
              eltcoinValue: this.props.eltcoinValue,
              transactionHash: transactionHash,
            });

            this.setPageNumber(4);
          },
        );
      },
    );
  }

  renderErrorMessage() {
    let message;

    if (+this.props.ethValue < 0.1) {
      message = 'The minimum amount is 0.1 ETH.';
    } else if (+this.props.ethValue > 100) {
      message = 'The maximum amount is 100 ETH.';
    } else if (+this.props.ethValue > this.state.ethBalance) {
      message = 'Your balance is too low.';
    }

    if (!message) return;

    return <p style={{ color: '#ff3860' }}>{message}</p>;
  }

  render() {
    if (this.state.pageNumber === 1) {
      return (
        <div
          className="container has-text-centered card"
          style={{ maxWidth: '60rem' }}
        >
          <div className="card-content">
            <br />
            <p>We've detected an Ethereum wallet on your computer:</p>
            <br />
            <p>
              <strong>Address: </strong>
              <a
                href={'https://etherscan.io/address/' + this.props.userAccount}
                target="_blank"
                rel="noopener noreferrer"
              >
                {this.props.userAccount}
              </a>
            </p>
            {this.renderBalances()}
            <br />
            <p>
              If you want to use this address, please click on the button below.
            </p>
            <br />
            <button className="button" onClick={() => this.setPageNumber(2)}>
              Continue
            </button>
          </div>
        </div>
      );
    } else if (this.state.pageNumber === 2) {
      return (
        <div
          className="container has-text-centered card"
          style={{ maxWidth: '60rem' }}
        >
          <div className="card-content">
            <p className="subtitle">
              Enter the amount of ELTCOIN you want to buy.
            </p>
            <Calculator
              eltcoinValue={this.props.eltcoinValue}
              ethValue={this.props.ethValue}
              handleEltcoinChange={this.props.handleEltcoinChange}
              handleEthChange={this.props.handleEthChange}
            />
            <br />
            {this.renderErrorMessage()}
            <br />
            <button
              className="button"
              onClick={() => this.sendPayment()}
              disabled={
                this.props.eltcoinValue <= 0 ||
                +this.props.ethValue < 0.1 ||
                +this.props.ethValue > 100 ||
                +this.props.ethValue > this.state.ethBalance
              }
            >
              Buy {this.props.eltcoinValue} ELTCOIN
            </button>
            <br />
            <br />
            <p>
              <i className="fa fa-warning" />
              <small>
                <em>
                  {' '}
                  If your transaction spans multiple rounds, the amount of
                  ELTCOIN you will receive is weighted accordingly.
                </em>
              </small>
            </p>
          </div>
        </div>
      );
    } else if (this.state.pageNumber === 3) {
      return (
        <div
          className="container has-text-centered card"
          style={{ maxWidth: '60rem' }}
        >
          <div className="card-content">
            <h1 className="title" style={{ color: '#0a0a0a' }}>
              You're close!
            </h1>
            <br />
            <p>Please confirm the transaction on your wallet</p>
            <br />
          </div>
        </div>
      );
    }

    return (
      <div
        className="container has-text-centered card"
        style={{ maxWidth: '60rem' }}
      >
        <div className="card-content">
          <h1 className="title" style={{ color: '#0a0a0a' }}>
            Your transaction is in progress!
          </h1>
          <img src={successImage} alt="" style={{ maxWidth: '15rem' }} />
          <br />
          <br />
          <a
            className="button"
            href={`https://etherscan.io/tx/${this.state.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Follow its progress
          </a>
        </div>
      </div>
    );
  }
}

export default Sale;
