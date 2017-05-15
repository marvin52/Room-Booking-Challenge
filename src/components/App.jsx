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
      bookInfo: {},
      roomNameFilter: false,
      availableNowFilter: false
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
        date: new Date(`${year}/${month}/${day}`).getTime() / 1000
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

    helpers.on('change-filter-room-name', (e) => {
      if(e.target.value.length === 0){
        this.setState({roomNameFilter: false})
      } else {
        this.setState({roomNameFilter: e.target.value})
      }
    });

    helpers.on('change-filter-available-now', (e) => {
      this.setState({ availableNowFilter: e.target.checked})
    });
  }


  filters(results){
    return results
      .filter( item => {
        if(this.state.roomNameFilter !== false)
          return item.name.toLowerCase().indexOf(
          this.state.roomNameFilter.toLowerCase()) !== -1
        return true;
      })
      .filter(item => {
        if(this.state.availableNowFilter !== false){
          let d = new Date();
          let hours = d.getHours();
          let minutes = d.getMinutes();
          if(hours >= 7 && hours <= 19 ){
            let range = helpers.hourValues[hours] + ((minutes * 40) / 60);
            return helpers.checkInterval({
              avail: item.avail,
              value: range
            })
          } else {
            return false;
          }
        }
        return true;
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
          <ResultList results={this.filters(this.state.results)} />
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
