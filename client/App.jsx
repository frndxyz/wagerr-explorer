
import Actions from './core/Actions';
import Component from './core/Component';
import { connect } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { isAddress, isBlock, isTX } from '../lib/blockchain';
import { Link, Route, Switch } from 'react-router-dom';
import promise from 'bluebird';
import PropTypes from 'prop-types';
import React from 'react';
import searchHistory from '../lib/searchHistory';

// Route Containers
import Address from './container/Address';
import API from './container/API';
import Block from './container/Block';
import CoinInfo from './container/CoinInfo';
import Error404 from './container/Error404';
import FAQ from './container/FAQ';
import Masternode from './container/Masternode';
import Movement from './container/Movement';
import Overview from './container/Overview';
import Peer from './container/Peer';
import Statistics from './container/Statistics';
import Top100 from './container/Top100';
import TX from './container/TX';
import BetEventList from './container/BetEventList';
import LottoList from './container/LottoList';
import LottoEvent from './container/LottoEvent';
import BetEvent from './container/BetEvent';
import Governance from './container/Governance';

// Layout
import CoinSummary from './container/CoinSummary';
import Footer from './component/Footer';
import Icon from './component/Icon';
import Loading from './component/Loading';
import Menu from './component/Menu';
import Notification from './component/Notification';
import SearchBar from './component/SearchBar';
import SearchEventBar from './component/SearchEventBar';
class App extends Component {
  static propTypes = {
    // Dispatch
    getCoins: PropTypes.func.isRequired,
    getIsBlock: PropTypes.func.isRequired,
    getTXs: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      init: true,
      limit: 10,
      searches: [],
    };
    this.timer = { coins: null, txs: null };
  };

  componentWillMount() {
    this.setState({ searches: searchHistory.get() });
  };

  componentDidMount() {
    promise.all([
        this.props.getCoins({ limit: 12 }),
        this.props.getTXs({ limit: 10 })
      ])
      .then(() => {
        this.getCoins();
        this.getTXs();
        this.setState({ init: false });
      })
      .catch(error => this.setState({ error }, () => {
        this.getCoins();
        this.getTXs();
      }));
  };

  componentWillUnmount() {
    if (this.timer.coins) {
      clearTimeout(this.timer.coins);
    }
    if (this.timer.txs) {
      clearTimeout(this.timer.txs);
    }
    this.timer = { coins: null, txs: null };
  };

  getCoins = () => {
    if (this.timer.coins) {
      clearTimeout(this.timer.coins);
    }

    this.timer.coins = setTimeout(() => {
      this.props
        .getCoins({ limit: 12 })
        .then(this.getCoins)
        .catch(this.getCoins);
    }, 30000); // 30 seconds
  };

  getTXs = () => {
    if (this.timer.txs) {
      clearTimeout(this.timer.txs);
    }

    this.timer.txs = setTimeout(() => {
      this.props
        .getTXs({ limit: 10 })
        .then(this.getTXs)
        .catch(this.getTXs);
    }, 30000); // 30 seconds
  };

  handleRemove = (term) => {
    this.setState({ searches: searchHistory.del(term) });
  };

  isBetEventId = (s) => {
    return typeof(s) === 'string' && s.length === 4 && isNaN(s);
  };

  handleSearch = (term) => {
    // If term doesn't match then ignore.
    if (!isTX(term) && !isBlock(term) && !isAddress(term) && !this.isBetEventId(term)) {
      return;
    }

    // Add to search history using localStorage.
    this.setState({ searches: searchHistory.add(term) });

    // Setup path for search.
    let path = '/#/';
    if (isAddress(term)) {
      document.location.href = `/#/address/${ term }`;
    } else if (this.isBetEventId(term)) {
      document.location.href = `/#/bet/event/${ encodeURIComponent(term) }`;
    } else if (!isNaN(term)) {
      document.location.href = `/#/block/${ term }`;
    } else {
      this.props
        .getIsBlock(term)
        .then((is) => {
          document.location.href = `/#/${ is ? 'block' : 'tx' }/${ term }`;
        });
    }
  };

  handleEventSearch = (term) => {    
    if (term == '') document.location.href = `/#/betevents`    
    else document.location.href = `/#/betevents?search=${term}`    
  }

  render() {
    if (this.state.init) {
      return (
        <Loading />
      );
    }

    return (
      <HashRouter>
        <div className="page-wrapper">
          <Menu onSearch={ this.handleSearch } />
          <div className="content" id="body-content">
            <div className="content__wrapper">
              {/* <Notification /> */}
              <CoinSummary
                onRemove={ this.handleRemove }
                onSearch={ this.handleSearch }
                searches={ this.state.searches.reverse() } />
              <SearchBar
                className="d-none d-md-block mb-3"
                onSearch={ this.handleSearch } />
              <SearchEventBar
                className="d-none d-md-block mb-3"
                onSearch={ this.handleEventSearch } 
              />  
              <div className="content__inner-wrapper">
                <Switch>
                  <Route exact path="/" component={ Overview } />
                  <Route exact path="/address/:hash" component={ Address } />
                  <Route exact path="/api" component={ API } />
                  <Route exact path="/block/:hash" component={ Block } />
                  <Route exact path="/coin" component={ CoinInfo } />
                  <Route exact path="/faq" component={ FAQ } />
                  <Route exact path="/governance" component={ Governance } />
                  <Route exact path="/masternode" component={ Masternode } />
                  <Route exact path="/masternode/:page" component={ Masternode } />
                  <Route exact path="/betevents" component={ BetEventList } />
                  <Route exact path="/betevents/:page" component={ BetEventList } />
                  <Route exact path="/lottos" component={ LottoList } />
                  <Route exact path="/movement" component={ Movement } />
                  <Route exact path="/movement/:page" component={ Movement } />
                  <Route exact path="/peer" component={ Peer } />
                  <Route exact path="/statistics" component={ Statistics } />
                  <Route exact path="/top" component={ Top100 } />
                  <Route exact path="/tx/:hash" component={ TX } />
                  <Route exact path="/bet/event/:eventId" component={ BetEvent } />
                  <Route exact path="/lotto/event/:eventId" component={ LottoEvent } />
                  <Route component={ Error404 } />
                </Switch>
              </div>
              <Footer />
            </div>
          </div>
        </div>
      </HashRouter>
    );
  };
}

const mapDispatch = dispatch => ({
  getCoins: query => Actions.getCoinHistory(dispatch, query),
  getIsBlock: query => Actions.getIsBlock(query),
  getTXs: query => Actions.getTXLatest(dispatch, query)
});

const mapState = state => ({

});

export default connect(mapState, mapDispatch)(App);
