import Actions from '../core/Actions'
import Component from '../core/Component';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import PropTypes from 'prop-types'
import data from '../fixture/data';
import ClientUtils from '../component/utils/utils';
import React from 'react';
import Card from '../component/Card';
import BettingMenuDesktop from '../component/Menu/BettingMenuDesktop';
import CardBettingTable from '../component/Card/CardBettingTable';
import BettingMobileMenu from '../component/Menu/BettingMobileMenu';
import BettingSingle from '../component/BettingSingle';
import BettingParlay from '../component/BettingParlay';
class Betting extends Component {
 
  static propTypes = {
    getEvents: PropTypes.func.isRequired,
  }
  
  constructor(props) {
    super(props)
    this.state = {
      connected: false,
      events: [],
      filteredEvents: [],
      loading: true,
      search: '',
      sport: 'allevent'
    }

  }

  componentWillReceiveProps(props) {

    const sport = props.match.params.id;
    this.setState({ sport: sport }, this.filterEvents);

  }

  componentDidMount() {
    this.getEvents()
  }

  filterEvents = () => {
    let tempevents = [];
    let sport = this.props.match.params.id;
    if (sport == "allevent") {

      tempevents = JSON.parse(JSON.stringify(this.state.events))
    }
    else {
      const filtered = this.state.events.filter(e => e.sport.toLowerCase() == sport);
      tempevents = JSON.parse(JSON.stringify(filtered))
    }

    if (this.state.search !== "") {
      const searchedEvents = tempevents.filter((e) => {
        const searchValue = this.state.search.toLowerCase()
        return e.tournament.toLowerCase().includes(searchValue) ||
          e.teams.home.toLowerCase().includes(searchValue) ||
          e.teams.away.toLowerCase().includes(searchValue) ||
          e.event_id.toString().includes(searchValue)
      })

      tempevents = searchedEvents;
    }

    this.setState({ filteredEvents: tempevents });


  }

  searchEvents = (value) => {
    setTimeout(() => {
      this.setState({ search: value });
      this.filterEvents()
    }, 700)

  }

  getEvents = () => {

    this.setState({ loading: true }, () => {

      let getMethod = this.props.getEvents;

      getMethod()
        .then((eventdata) => {
          this.setState({ events: data, loading: false }, this.filterEvents)
        })
        .catch(error => {
          console.log('error', error);
          this.setState({ error, loading: false })
        })

    })
  }
  render() {
    const { toggleSwitchOddsStyle, toggleSwitchOdds } = this.props;
    return (
      <div className='content'>
        <div className="menu-wrapper">
          <BettingMenuDesktop location={this.props.location} />
        </div>
        <div className="content__wrapper_total">
          <BettingMobileMenu />
          <div className="row m-20">
            <div className="col-lg-9 col-md-12">
              <div className="bet-search">
                {/* <div>Showing 80 events 1</div> */}
                <input placeholder={'Search...'} onChange={(e) => this.searchEvents(e.target.value)} />
              </div>
              <div> {
                this.state.filteredEvents.map((event) => {

                  let moneylineHomeOdds = (event.odds[0].mlHome / 10000)
                  let moneylineAwayOdds = (event.odds[0].mlAway / 10000)
                  let moneylineDrawOdds = (event.odds[0].mlDraw / 10000)

                  moneylineHomeOdds = ClientUtils.convertToOdds(moneylineHomeOdds, toggleSwitchOddsStyle, toggleSwitchOdds)
                  moneylineAwayOdds = ClientUtils.convertToOdds(moneylineAwayOdds, toggleSwitchOddsStyle, toggleSwitchOdds)
                  moneylineDrawOdds = ClientUtils.convertToOdds(moneylineDrawOdds, toggleSwitchOddsStyle, toggleSwitchOdds)

                  let spreadPoints = (event.odds[1].spreadPoints / 100)

                  let spreadHomeOdds = (event.odds[1].spreadHome / 10000)
                  let spreadAwayOdds = (event.odds[1].spreadAway / 10000)

                  spreadHomeOdds = ClientUtils.convertToOdds(spreadHomeOdds, toggleSwitchOddsStyle, toggleSwitchOdds)
                  spreadAwayOdds = ClientUtils.convertToOdds(spreadAwayOdds, toggleSwitchOddsStyle, toggleSwitchOdds)

                  spreadHomeOdds = spreadHomeOdds
                  spreadAwayOdds = spreadAwayOdds


                  let totalsOverOdds = (event.odds[2].totalsOver / 10000)
                  let totalsUnderOdds = (event.odds[2].totalsUnder / 10000)
                  let totalPoints = (event.odds[2].totalsPoints / 100)

                  totalsOverOdds = ClientUtils.convertToOdds(totalsOverOdds, toggleSwitchOddsStyle, toggleSwitchOdds)
                  totalsUnderOdds = ClientUtils.convertToOdds(totalsUnderOdds, toggleSwitchOddsStyle, toggleSwitchOdds)

                  totalsOverOdds = totalsOverOdds
                  totalsUnderOdds = totalsUnderOdds

                  const tempevent = JSON.parse(JSON.stringify(event))

                  tempevent.odds[0].mlHome = moneylineHomeOdds
                  tempevent.odds[0].mlAway = moneylineAwayOdds
                  tempevent.odds[0].mlDraw = moneylineDrawOdds

                  tempevent.odds[1].spreadHome = spreadHomeOdds
                  tempevent.odds[1].spreadAway = spreadAwayOdds
                  tempevent.odds[1].spreadPoints = spreadPoints

                  tempevent.odds[2].totalsOver = totalsOverOdds
                  tempevent.odds[2].totalsUnder = totalsUnderOdds
                  tempevent.odds[2].totalsPoints = totalPoints

                  return <CardBettingTable data={tempevent} />
                })
              }


              </div>
            </div>
            <div className="col-lg-3 col-md-12">
            <div className="bet-select">
                    <label className="radio-container">Single
                        <input type="radio" name="bet" value="Single"checked/>
                        <span className="checkmark"></span>
                    </label>
                    <label className="radio-container">Parlay
                    <input type="radio" name="bet" value="Parlay"/>
                    <span className="checkmark"></span>
                    </label>
                    <button id="clearSlip" className="btn-clear-slip">CLEAR SLIP</button>
                </div>
               
                <BettingSingle/>
               {/* <BettingParlay /> */}
                 
              

            </div>
          </div>
        </div>
        {this.state.connected && <div className='m-20'>
          <h2>Betting</h2>
          <Card>
            <div className='m-20 flex-center'>
              <div>Looks like Wallet Not Connected</div>
              <div>Go to <span className='link'>Help</span>  to install wallet</div>
            </div>
          </Card>
        </div>}
      </div>
    );
  };
}

const mapDispatch = dispatch => ({
  getEvents: query => Actions.getListEvents(query),
})

export default compose(
  connect(null, mapDispatch),
  translate('betting'),
)(Betting);