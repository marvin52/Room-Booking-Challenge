import React, { Component } from 'react';
import './../styles/BookingForm.css'
import helpers from './../helpers/helpers.js';
import Timebar from './Timebar.jsx'


class ResultItem extends Component {

  render() {
  	let { avail, name } = this.props.config;
  	let ranges = { start: 360, end: 400 }

    return (
      <div className="app__modal-booking-form">
      	<Timebar avail={avail} ranges={ranges}/>
      </div>
    );
  }
}

export default ResultItem;
