import React,{ Component } from 'react';

class BettingParlay extends Component{
    render(){
        return(
            <div>
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
                  </div>
                   </div>
                 </div>
                 <div className="place-bet-box">
                    <div className="total-parlay">
                        <span>Total Legs : 2</span>
                        <span>Total Odds : 2.55</span>
                    </div>
                  <form className="parlay-form"> 
                      <label className="total-parlay">
                        <span class="span_bet">BET</span>
                        <input type="text" className="bet-value" placeholder="0" /><span className="afterInput"></span>
                      </label>
                      <label className="place-bet-box__label">Potential Returns : <span>64.00 tWGR</span></label>
                    <button type="submit" className="btn-place-bet">PLACE BET</button>
                  </form>
             </div>
        </div>
        )
    }
}
export default BettingParlay;