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
          <input placeholder="Room Name"/>
          <label htmlFor="availableNow"><input type="checkbox" name="availableNow"/> Available Now </label>
        </div>
      </div>
    );
  }
}

export default Searchbox;
