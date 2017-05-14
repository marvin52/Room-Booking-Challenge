import React, { Component } from 'react';
import helpers from './../helpers/helpers.js';


class Timebar extends Component {
  constructor(){
    super();
    this.state = {
      timeRange: {
        start: false,
        end: false
      }
    }
  }

  componentDidMount() {
    this.updateCanvas();
  }

  componentDidUpdate(){
    this.updateCanvas()
  }

  updateCanvas(){
    if(this.props.ranges &&
        (this.props.ranges.start !== this.state.timeRange.start ||
          this.props.ranges.end !== this.state.timeRange.end) ) {
      this.setState({
        timeRange: {
          start: this.props.ranges.start,
          end: this.props.ranges.end
        }
      })
    }
    let canvas = this.refs.timebar

    let ctx = canvas.getContext('2d');

    //selected time
    let { start, end } = this.state.timeRange

    //Draw the bars
    for(var i = 0; i <= 600; i += 10){

      if( !(((i - 40) === 0 || (i - 40) % 100 === 0) ||
      ((i - 90) === 0 || (i - 90) % 100 === 0)) ){

        let isAvail = helpers.checkInterval({
          avail:this.props.avail,
          value: i
        });

        if( start !== false && end !== false &&
            i >= helpers.valueToRange(start) &&
            i < helpers.valueToRange(end) ){
            ctx.fillStyle = "#FFE900";
          } else {
            ctx.fillStyle = isAvail ? "#009547" : "#E31E2F";
          }
        ctx.fillRect (i, 0, 10, 20);
      }
    }

    //Draw the range pickers
    if(start !== false &&
      end !== false){
        ctx.fillStyle = "#00A0DB";
        ctx.fillRect (helpers.valueToRange(start) - 1, 0, 1, 20);
        ctx.fillRect (helpers.valueToRange(end) - 1, 0, 1, 20);
    }
  }

  pickerPosition(value){
    let time = helpers.rangeToTime(value);
    return (( helpers.timeValues[time] * 93.2 ) / 590) + 2
  }

  render() {
    let times = [], pickers;
    for(var i = 7; i <= 19; i++)
      times.push(<span key={i}> { i < 10 ? `0${i}h`: `${i}h`} </span>);

    if(this.state.timeRange.start !== false){
      let { start, end } = this.state.timeRange
      pickers = (
        <div>
          <span style={{left: `${this.pickerPosition(start)}%`}}
          className="app__time-range app__time-range--start noselect">
            {helpers.rangeToTime(start)}
          </span>
          <span style={{left: `${this.pickerPosition(end)}%`}}
          className="app__time-range app__time-range--end noselect">
            {helpers.rangeToTime(end)}
          </span>
        </div>
      );
    }


    return (
      <div className="app__time-bar">
        <div className="app__time-labels">
          {times}
        </div>
        <canvas className="app__time-canvas"
        ref="timebar" width={590} height={20}/>
        {pickers}
      </div>
    );
  }



}


export default Timebar;
