import React, { Component } from 'react';
import './../styles/Searchbox.css'
import helpers from './../helpers/helpers.js';

class Searchbox extends Component {
  constructor(){
    super();
  }


  prevDay(e){
    helpers.emit('prev-day')
  }


  nextDay(e){
    helpers.emit('next-day')
  }

  onChangeRoomNameFilter(e){
    helpers.emit('change-filter-room-name', e)
  }


  onChangeAvailableNowFilter(e){
    helpers.emit('change-filter-available-now', e)
  }


  render() {
    let {day, month, year} = this.props.states;
    return (
      <div className="app__search-box">
        <div className="app__search-header">
          <h1>Choose a day</h1>
        </div>
        <div className="app__search-controls">
          <button
            className="app__btn app__btn-search app__btn-search--prev"
            onClick={(e) => this.prevDay(e)} >
            <i className="fa fa-angle-left"></i>
          </button>
          <h1>{`${day}.${month}.${year}`}</h1>
          <button
            className="app__btn app__btn-search app__btn-search--next"
            onClick={(e)=>this.nextDay(e)}>
            <i className="fa fa-angle-right"></i>
          </button>
          <button className="app__btn app__btn-search app__btn-search--calendar">
            <i className="fa fa-calendar"></i>
          </button>
        </div>
        <div className="app__search-filters">
          <i className="fa fa-filter"></i> Filters:
          <input className="app__name-filter" placeholder="Room Name" onChange={this.onChangeRoomNameFilter.bind(this)}/>
          <label htmlFor="availableNow">
            <input
              className="app__available-filter"
              type="checkbox"
              name="availableNow"
              onChange={this.onChangeAvailableNowFilter.bind(this)}/>
            Available Now
          </label>
        </div>
      </div>
    );
  }
}

export default Searchbox;
