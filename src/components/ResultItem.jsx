import React, { Component } from 'react';
import './../styles/ResultItem.css'
import Timebar from './Timebar.jsx'
import helpers from './../helpers/helpers.js';


class ResultItem extends Component {
  constructor(){
    super();
    this.state = {
      seeMore: false
    }
  }

  bookRoom(config){
    helpers.emit('book-room', config)
  }

  toggleSeeMore(){
    this.setState({seeMore: !this.state.seeMore})
  }

  componentWillUpdate(){
    if(this.state.seeMore == true){
      this.setState({seeMore: false})
    }
  }

  render() {
    let { avail, name, location, equipment, capacity, size, images } = this.props.config;
    let equipmentList = [], imageList = [];

    for(var i in equipment)
      equipmentList.push(<li key={i}>{equipment[i]}</li>)

    for(var a in images)
      imageList.push(
        <img
          className="app__result-image"
          alt="Image description text"
          src={`${helpers.apiUrl}/${images[a]}`}
          key={a}
        />
      );

    return (
      <div className="app__result-item">
        <div className="app__result-title">
          <h1>Room {name}</h1>
        </div>
        <Timebar avail={avail}/>
        <div className="app__result-description">
          <table>
            <thead>
              <tr>
                <td><i className="fa fa-building"></i> Location</td>
                <td><i className="fa fa-desktop"></i> Equipments</td>
                <td><i className="fa fa-group"></i> Capacity</td>
                <td><i className="fa fa-map-o"></i> Size</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><p>{location}</p></td>
                <td><ul>{equipmentList}</ul></td>
                <td><p>{capacity}</p></td>
                <td><p>{size}</p></td>
              </tr>
            </tbody>
          </table>
          { this.state.seeMore ? imageList : ''}
        </div>
        <button className="app__result-see-more" onClick={(e)=> this.toggleSeeMore(e) }>
          <i className={this.state.seeMore ? 'fa fa-eye-slash' : 'fa fa-eye'}></i>
          {this.state.seeMore ? ' Hide Details' : ' See Details'}
        </button>
        <button className="app__result-booking" onClick={()=> this.bookRoom(this.props.config) }>
          <i className="fa fa-ticket"></i> Book this Room
        </button>
      </div>
    );
  }
}

export default ResultItem;
