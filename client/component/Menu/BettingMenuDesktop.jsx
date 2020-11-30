
import Component from 'core/Component';
import PropTypes from 'prop-types';
import React from 'react';
import { bettingMenuData } from './bettingMenuData'

import { Link } from 'react-router-dom';

export default class BettingMenuDesktop extends Component {
  static propTypes = {
    links: PropTypes.array
  };

  static defaultProps = {
    links: []
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: true,
      sports: []
    }
  }

  componentDidMount() {
    console.log("BettingMenuDesktop: ComponentDidMount")
    bettingMenuData().then((sports) => {
      this.setState({ sports: sports })
    })
  }

  getLinks = () => {
    const { props } = this;

    return this.state.sports.map((i, idx) => {
      const isActive = props.location.pathname.includes(i.href);
      return (
        <Link
          key={idx}
          to={'/betting/' + i.href}
          className={`betting-menu ${isActive && 'betting-menu--active'}`}
        >
          <img
            alt={i.href}
            className="betting-menu-desktop__item-icon"
            src={`/img/uiupdate/betting_${i.href}_${isActive ? 'red' : 'white'}.png`}
            title={this.state.isOpen ? null : i.label} />
          <div className="menu-betting-label flex-1" >{i.label}</div>
          <div className="menu-betting-label ft-12" >{i.count > 0 && "(" + i.count + ")"}</div>
        </Link>
      )
    }
    )
  };

  handleToggle = () => this.setState({ isOpen: !this.state.isOpen });

  render() {
    return (
      <div className={`menu-desktop p-0 ${this.state.isOpen ? 'menu-desktop--open' : 'menu-desktop--close'}`}>
        <p className="menu-desktop__title">FILTER BY SPORT</p>
        {this.getLinks()}
      </div>
    )
  }
}

