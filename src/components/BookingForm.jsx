import React, { Component } from 'react';
import './../styles/BookingForm.css'
import helpers from './../helpers/helpers.js';
import Timebar from './Timebar.jsx'


class ResultItem extends Component {
  constructor(){
    super();
    this.state = {
      startTimeRange: 200,
      endTimeRange: 400
    }
    this.bindEvents()
  }

  bindEvents(){
    helpers.on('increase', helpers.debounce((picker) => {
      this.setState({[`${picker}TimeRange`]: this.state[`${picker}TimeRange`] + 10})
    }, 50))
    helpers.on('decrease', helpers.debounce((picker) => {
      this.setState({[`${picker}TimeRange`]: this.state[`${picker}TimeRange`] - 10})
    }, 50) )
  }


  render() {
  	let { avail, name } = this.props.config;
    let timeRange = {
      start: this.state.startTimeRange,
      end: this.state.endTimeRange
    }

    return (
      <div className="app__modal-booking-form">
      	<Timebar avail={avail} ranges={timeRange}/>
      </div>
    );
  }
}

export default ResultItem;
