import React,{ Component } from 'react';


class BettingSingle extends Component {
    render(){
        return(
          <div className='bet-black-card bet-slip-card animated fadeInUp'>
            <div className="bet-slip-box">
        <div className="slip-body">
          <div className="slip-title">
            <span>Texas vs Okahama</span>
            <button className="slip-close">x</button>
          </div>
              <label>YOUR PICK :</label>
              <label className="team-name">Texas</label>
              <span className="slip-body__points">2.26</span>
              <form className="bet-form">
                <input type="text" id="bet-value" className="bet-value" /><span className='afterElement'></span>
                <input type="submit" className="bet-form__btn-bet" value="BET" />
              </form>
              <div className="bet-returns">
            <p>Potential Returns:</p>
            <p className="total">56.49 tWGR</p>
            </div>
            
          </div>
          </div>
      </div>
        )
        
    }
}
export default BettingSingle;