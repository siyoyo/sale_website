import React, { Component } from 'react';
import moment from 'moment';

import {
  ClosedSale,
  Footer,
  Hero,
  NoAccount,
  ParticlesBackground,
  Sale,
  WalletNotFound,
  WrongNetwork,
} from './components';

const START_DATE = moment.utc('2017-10-15 22:59');
const END_DATE = moment.utc('2017-11-04 23:59');
const RATE_CHANGE_THRESHOLD = 300000;
const START_RATE = 640000 / 10 ** 10;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasCompatibleWallet: false,
      tokensSold: 0,
      currentRate: START_RATE,
      eltcoinValue: 1 / START_RATE,
      ethValue: 1,
    };

    this.checkWeb3 = this.checkWeb3.bind(this);
    this.renderMainContent = this.renderMainContent.bind(this);
    this.startAccountChangeListener = this.startAccountChangeListener.bind(
      this,
    );
    this.getTokensSold = this.getTokensSold.bind(this);
  }

  componentDidMount() {
    window.Raven
      .config('https://ad5e6c16abb2421a872fdcae8de08703@sentry.io/230880')
      .install();
  }

  startAccountChangeListener(userAccount) {
    const accountInterval = setInterval(() => {
      window.web3.eth.getAccounts((error, accounts) => {
        if (accounts[0] !== userAccount) {
          this.checkWeb3();
        }
      });
    }, 1000);

    this.setState({
      accountInterval,
    });
  }

  getTokensSold() {
    fetch('https://eltcoin-api.now.sh/api/v1/sale/tokens_sold')
      .then(data => data.json())
      .then(json => {
        const tokensSold = json.value;
        const tokensSoldCurrentRound = tokensSold % RATE_CHANGE_THRESHOLD;
        const currentPrice =
          0.02 + 0.01 * Math.floor(tokensSold / RATE_CHANGE_THRESHOLD);

        const newRate =
          START_RATE +
          Math.floor(tokensSold / RATE_CHANGE_THRESHOLD) * START_RATE;

        this.setState({
          currentRate: newRate,
          currentPrice,
          tokensSold: tokensSoldCurrentRound,
          eltcoinValue: 1 / newRate,
        });
      });
  }

  checkWeb3() {
    const hasCompatibleWallet = typeof window.web3 !== 'undefined';

    if (!hasCompatibleWallet) {
      this.setState({
        hasCompatibleWallet,
      });

      return;
    }

    window.web3.version.getNetwork((err, netId) => {
      if (this.state.accountInterval) {
        clearInterval(this.state.accountInterval);
      }

      if (netId !== '1') {
        this.setState({
          hasCompatibleWallet,
          isMainNetwork: false,
          hasAccount: false,
        });
      } else {
        window.web3.eth.getAccounts(async (error, accounts) => {
          if (accounts.length === 0) {
            this.setState({
              hasCompatibleWallet,
              isMainNetwork: true,
              hasAccount: false,
            });
          } else {
            const userAccount = accounts[0];

            const identify = new window.amplitude.Identify();
            identify.set('ethAddress', userAccount);
            window.amplitude.identify(identify);

            this.startAccountChangeListener(userAccount);

            this.setState({
              hasCompatibleWallet,
              isMainNetwork: true,
              hasAccount: true,
              userAccount,
            });
          }
        });
      }
    });
  }

  handleEltcoinChange(event) {
    window.amplitude.getInstance().logEvent('ELTCOIN value changed', {
      value: event.target.value,
      hasCompatibleWallet: this.state.hasCompatibleWallet,
    });

    if (event.target.value >= 0 || event.target.value === '') {
      this.setState({
        eltcoinValue: event.target.value,
        ethValue: event.target.value * this.state.currentRate,
      });
    }
  }

  handleEthChange(event) {
    window.amplitude.getInstance().logEvent('ETH value changed', {
      value: event.target.value,
      hasCompatibleWallet: this.state.hasCompatibleWallet,
    });

    if (event.target.value >= 0 || event.target.value === '') {
      this.setState({
        eltcoinValue: event.target.value / this.state.currentRate,
        ethValue: event.target.value,
      });
    }
  }

  renderMainContent() {
    const currentDate = moment.utc();
    const isSaleClosed =
      currentDate.isBefore(START_DATE) || currentDate.isAfter(END_DATE);

    if (isSaleClosed) {
      return <ClosedSale />;
    } else if (!this.state.hasCompatibleWallet) {
      window.amplitude.getInstance().logEvent('Wallet not found');
      return (
        <WalletNotFound
          currentRate={this.state.currentRate}
          eltcoinValue={this.state.eltcoinValue}
          ethValue={this.state.ethValue}
          handleEltcoinChange={this.handleEltcoinChange.bind(this)}
          handleEthChange={this.handleEthChange.bind(this)}
        />
      );
    } else if (!this.state.isMainNetwork) {
      window.amplitude.getInstance().logEvent('Wrong network');
      return <WrongNetwork />;
    } else if (!this.state.hasAccount) {
      window.amplitude.getInstance().logEvent('No account');
      return <NoAccount />;
    }

    return (
      <Sale
        userAccount={this.state.userAccount}
        currentRate={this.state.currentRate}
        eltcoinValue={this.state.eltcoinValue}
        ethValue={this.state.ethValue}
        handleEltcoinChange={this.handleEltcoinChange.bind(this)}
        handleEthChange={this.handleEthChange.bind(this)}
      />
    );
  }

  render() {
    return (
      <div>
        <div
          style={{
            minHeight: 'calc(100vh - 184px)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ParticlesBackground />
          <Hero
            currentAmount={this.state.tokensSold}
            maxAmount={RATE_CHANGE_THRESHOLD}
            currentPrice={this.state.currentPrice}
            selectedAmount={this.state.eltcoinValue}
          />{' '}
          {this.renderMainContent()}
        </div>{' '}
        <Footer />
      </div>
    );
  }
}

export default App;
