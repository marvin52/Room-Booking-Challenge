import React, { Component } from 'react';
import ResultItem from './ResultItem.jsx';
import './../styles/ResultList.css'

class ResultList extends Component {
  render() {
    let resultList = [], results = this.props.results;
    if(typeof this.props.results === 'object'
      && this.props.results.length > 0){
      for(var i in results){
        resultList.push(
          <ResultItem
            key={i}
            config={results[i]}/>);
      }
    }
    return (
      <div className="app__result-list">
        {resultList}
      </div>
    );
  }
}

export default ResultList;
