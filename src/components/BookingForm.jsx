import React, { Component } from 'react';
import './../styles/BookingForm.css'
import helpers from './../helpers/helpers.js';
import Timebar from './Timebar.jsx'


class ResultItem extends Component {
  constructor(){
    super();
    this.state = {
      startTimeRange: 200,
      endTimeRange: 400,
      step:'first',
      description: '',
      eventTitle: '',
      participants: 0,
      atendeeName:'',
      atendeePhone:'',
      atendeeEmail:'',
      atendees:[
      ]
    }
    this.bindEvents()
  }

  resetState(){
    this.setState({
      startTimeRange: 200,
      endTimeRange: 400,
      step:'first',
      description: '',
      eventTitle: '',
      participants: 0,
      atendeeName:'',
      atendeePhone:'',
      atendeeEmail:'',
      atendees:[
      ]
    })
  }

  addAtendee(){
    let temp = this.state.atendees
    temp.push({
      name: this.state.atendeeName,
      email: this.state.atendeeEmail,
      number: this.state.atendeePhone
    })
    this.setState({atendees: temp}, ()=>{
      this.setState({
        atendeeName: '',
        atendeeEmail: '',
        atendeePhone: ''
      })
    })
  }

  removeAtendee(event, atendee, index){
    let temp = this.state.atendees.filter((item, i) => i !== index)
    this.setState({atendees: temp})
  }

  changeAtendeeName(e){
    this.setState({
      atendeeName: e.target.value
    })
  }
  changeAtendeePhone(e){
    this.setState({
      atendeePhone: e.target.value
    })
  }
  changeAtendeeEmail(e){
    this.setState({
      atendeeEmail: e.target.value
    })
  }

  bindEvents(){
    helpers.on('increase', helpers.debounce((picker) => {
      if(picker === 'start')
        if(this.state.startTimeRange >= (this.state.endTimeRange - 10))
          return false;
      this.setState({[`${picker}TimeRange`]: this.state[`${picker}TimeRange`] + 10})
    }, 50))

    helpers.on('decrease', helpers.debounce((picker) => {
      if(picker === 'end')
        if(this.state.endTimeRange <= (this.state.startTimeRange + 10))
          return false;
      this.setState({[`${picker}TimeRange`]: this.state[`${picker}TimeRange`] - 10})
    }, 50) )

    helpers.on('reset-state-booking-form', ()=>{
      this.resetState();
    })
  }

  nextStep(){
    switch(true){
      case this.state.step == 'first':
        this.setState({step: 'second'});
      break;
      case this.state.step == 'second':
        if(this.state.eventTitle.length > 0 &&
            this.state.description.length > 0 &&
            parseInt(this.state.participants) > 0 ){
          this.confirmBooking((e)=>{
            console.log(e)
            this.setState({step: 'third'});
          })
        }
      break;
    }
  }

  confirmBooking(callback){
    let jsonInfo = this.bookingJson();
    helpers.bookRoom(jsonInfo)
    .then( data => {
      if(callback) callback(data)
    })
  }

  changeStartRange(e){
    if(e.target.value < (this.state.endTimeRange - 10) )
    this.setState({ startTimeRange: e.target.value });
  }

  toggleBookView(e){
    helpers.emit('toggle-book-view', e)
  }

  changeEndRange(e){
    if(e.target.value > (this.state.startTimeRange + 10) )
    this.setState({ endTimeRange: e.target.value });
  }

  changeDescription(e){
    this.setState({ description: e.target.value });
  }
  changeParticipants(e){
    this.setState({ participants: e.target.value });
  }
  changeEventTitle(e){
    this.setState({ eventTitle: e.target.value });
  }

  bookingJson(){
    let { startTimeRange, endTimeRange } = this.state
    let {day, month, year} = this.props['app-config'];
    let dateUnix = new Date(`${year}/${month}/${day}`).getTime() / 1000;
    let startUnix = new Date(`${year}/${month}/${day} ${helpers.rangeToTime(startTimeRange)}:00`).getTime() / 1000;
    let endUnix = new Date(`${year}/${month}/${day} ${helpers.rangeToTime(endTimeRange)}:00`).getTime() / 1000;

    return {
      booking: {
        date: dateUnix,
        time_start: startUnix,
        time_end: endUnix,
        title: this.state.eventTitle,
        description: this.state.description,
        room: this.props.config.name
      },
      passes: this.state.atendees
    }
  }

  render() {
    let { avail, name } = this.props.config;
    let { startTimeRange, endTimeRange } = this.state
    let timeRange = {
      start: startTimeRange,
      end: endTimeRange
    },
      optionsStart = [],
      optionsEnd = [];

    for(let i in helpers.timeValues){
      optionsStart.push(
        <option
          key={helpers.timeValues[i]}
          disabled={helpers.timeValues[i] >= helpers.valueToRange(endTimeRange)}
          value={helpers.timeValues[i]}>
          {i}
        </option>
      );
      optionsEnd.push(
        <option
          key={helpers.timeValues[i]}
          disabled={helpers.timeValues[i] <= helpers.valueToRange(startTimeRange)}
          value={helpers.timeValues[i]}>
          {i}
        </option>
      );
    }

    let isAvailable = helpers.isAvailable({
      avail,
      start: helpers.valueToRange(startTimeRange),
      end: helpers.valueToRange(endTimeRange)
    });


    let atendees = this.state.atendees.map( (e, a) => (
        <span key={a}>
          {e.name}
          <i className="fa fa-close" onClick={ (event) => this.removeAtendee(event, e, a)}></i>
        </span> ))

    return (
      <div className="app__modal-booking-form">
        <div className="app__booking-navbar">
          <h1>Booking a Room</h1>
          <i className="fa fa-close" onClick={this.toggleBookView.bind(this)}></i>
        </div>
        <div className={`app__booking-step--${this.state.step == 'first'? 'show':'hide'}`}>
          <div className="app__booking-form-inputs">
            <h1 className="app__booking-select-title"> Select the time ranges that you want to book </h1>
            <div className="app__booking-select-wrapper">
              <span>Start</span>
              <select className="app__booking-select-start noselect"
                onChange={this.changeStartRange.bind(this)}
                value={helpers.valueToRange(startTimeRange)} >
                {optionsStart}
              </select>
              <span>End</span>
              <select className="app__booking-select-end noselect"
                onChange={this.changeEndRange.bind(this)}
                value={helpers.valueToRange(endTimeRange)} >
                {optionsEnd}
              </select>
            </div>
          </div>
          <Timebar avail={avail} ranges={timeRange}/>
          <div className="app__booking-form-inputs">
            <h1 className={`app__booking-schedule-feedback
              ${isAvailable ? 'app__booking-schedule-feedback--positive':
              'app__booking-schedule-feedback--negative'}`}>
              {isAvailable? 'This time is available!':'This time overlaps an existing booking! '}
            </h1>
            <button onClick={this.nextStep.bind(this)} className="app__booking-next-step-btn" disabled={!isAvailable}>
              Next Step
               <i className="fa fa-angle-double-right"></i>
            </button>
          </div>
        </div>
        <div className={`app__booking-step--${this.state.step == 'second'? 'show':'hide'}`}>
          <div className="app__booking-form-inputs app__booking-fields">
            <h1> Event title: </h1>
            <input
              className="app__booking-event-title"
              placeholder="Type the event title"
              onChange={this.changeEventTitle.bind(this)}
              value={this.state.eventTitle}
              min={0}/>
              <span className={this.state.eventTitle.length > 0 ?'app__booking-validation--valid':'app__booking-validation--invalid'}>*Fill the title field</span>
            <h1> Event description: </h1>
            <textarea
              className="app__booking-description"
              placeholder="Type an event description"
              value={this.state.description}
              rows={3}
              onChange={this.changeDescription.bind(this)}>
            </textarea>
            <span className={this.state.description.length > 0 ?'app__booking-validation--valid':'app__booking-validation--invalid'}>*Fill the description field</span>
            <h1> Number of participants: </h1>
            <input
              className="app__booking-participants"
              onChange={this.changeParticipants.bind(this)}
              type="number"
              value={this.state.participants}
              min={0}/>
              <span className={parseInt(this.state.participants) > 0 ?'app__booking-validation--valid':'app__booking-validation--invalid'}>*Choose a number of participants</span>
          </div>
          <div className="app__booking-form-inputs app__booking-fields-participants">
            <div className="app__row">
              <h1>Add atendees to send LightPasses</h1>
            </div>
            <div className="app__half-width">
              <h1>Name:</h1>
              <input
                className="app__booking-atendee-name"
                value={this.state.atendeeName}
                onChange={this.changeAtendeeName.bind(this)}
                placeholder="Type the atendee name"/>
                <span className={this.state.atendeeName.length > 0 ?'app__atendee-validation--valid':'app__atendee-validation--invalid'}>
                  {this.state.atendeeName.length > 0 ? '': '*Invalid value for the name'}</span>
            </div>
            <div className="app__half-width">
              <h1>Phone:</h1>
              <input
                type="phone"
                className="app__booking-atendee-phone"
                value={this.state.atendeePhone}
                onChange={this.changeAtendeePhone.bind(this)}
                placeholder="Type the atendee phone"/>
                <span className={helpers.isValidPhonenumber(this.state.atendeePhone)?'app__atendee-validation--valid':'app__atendee-validation--invalid'}>
                  {helpers.isValidPhonenumber(this.state.atendeePhone)? '': '*Invalid value for the phone number'}</span>
            </div>
            <div className="app__row">
              <h1>Email:</h1>
              <input
                type="email"
                className="app__booking-atendee-email"
                value={this.state.atendeeEmail}
                onChange={this.changeAtendeeEmail.bind(this)}
                placeholder="Type the atendee email"/>
              <span className={helpers.validateEmail(this.state.atendeeEmail)?'app__atendee-validation--valid':'app__atendee-validation--invalid'}>
                {helpers.validateEmail(this.state.atendeeEmail)? '': '*Invalid email'}</span>
              <button
                disabled={!helpers.validateEmail(this.state.atendeeEmail) || !helpers.isValidPhonenumber(this.state.atendeePhone) || !this.state.atendeeName.length > 0}
                className="app__booking-btn-add"
                onClick={this.addAtendee.bind(this)}>
                <i className="fa fa-plus"></i>
              </button>
            </div>
            <div className="app__row app__atendees-list">
              {atendees}
            </div>
          </div>
          <div className="app__row"></div>
          <div className="app__booking-form-inputs">
            <button onClick={this.nextStep.bind(this)} className="app__booking-next-step-btn" disabled={!isAvailable}>
              Book
               <i className="fa fa-angle-double-right"></i>
            </button>
          </div>
        </div>
        <div className={`app__booking-step--${this.state.step == 'third'? 'show':'hide'}`}>
          <h1>Booking Done!</h1>
        </div>
      </div>
    );
  }
}

export default ResultItem;
