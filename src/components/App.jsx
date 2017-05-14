import React, { Component } from 'react';
import './../styles/reset.css';
import './../styles/App.css';
import helpers from './../helpers/helpers.js';
import CalendarHelper from './../helpers/calendar.js';

const calendar = new CalendarHelper();

import Searchbox from './Searchbox.jsx';
import ResultList from './ResultList.jsx';
import BookingForm from './BookingForm.jsx';

class App extends Component {



  constructor(){
    super();
    let d = new Date();
    this.state = {
      results: [],
      day: d.getUTCDate(),
      month: d.getUTCMonth() + 1,
      year: d.getFullYear(),
      bookView: false,
      bookInfo: {}
    }
    this.updateResults();
    this.bindEvents();
    helpers.rangeToTime()
  }


  toggleBookView(){
    this.setState({bookView: !this.state.bookView})
  }

  updateResults(){
    let { day, month, year } = this.state
    helpers.getRooms({
        date: new Date(`${year}.${month}.${day}`).getTime() / 1000
    })
    .then( results => {
      this.setState({results})
    })
  }




  bindEvents(){

    //On click of previous day button
    helpers.on('prev-day', (e) => {
      let prevDay = calendar.getPrevDay(this.state);
      this.setState(prevDay, (e) => {
        this.updateResults()
      })
    })

    //On click of next day button
    helpers.on('next-day', (e) => {
      let nextDay = calendar.getNextDay(this.state);
      this.setState(nextDay, (e) => {
        this.updateResults()
      })
    })

    //On click of next day button
    helpers.on('book-room', (bookInfo) => {
      this.setState({ bookView : true, bookInfo })
    })

  }




  render() {
    return (
      <div className="app">
        <div className="app__navbar">
        <h1><span>1aim</span> Room Booking </h1>
        </div>
        <div className="app__container">
          <Searchbox states={this.state} />
          <ResultList results={this.state.results} />
          <div className={ this.state.bookView ?
            `app__booking-modal app__booking-modal--show`:
            `app__booking-modal`} >
            <div className="app__booking-modal-overlay"
              onClick={()=>this.toggleBookView()}></div>
            <div className="app__booking-modal-container">
              <BookingForm config={this.state.bookInfo} />
            </div>
          </div>
        </div>
      </div>
    );
  }



}

export default App;
