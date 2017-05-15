import EventEmitter from 'events';

class Helpers extends EventEmitter {
	constructor(){
    super();
    this.apiUrl = 'https://challenges.1aim.com/roombooking';
    this.timeValues = {
      '07:00':0, '07:15':10, '07:30':20, '07:45':30,
      '08:00':50, '08:15':60, '08:30':70, '08:45':80,
      '09:00':100, '09:15':110, '09:30':120, '09:45':130,
      '10:00':150, '10:15':160, '10:30':170, '10:45':180,
      '11:00':200, '11:15':210, '11:30':220, '11:45':230,
      '12:00':250, '12:15':260, '12:30':270, '12:45':280,
      '13:00':300, '13:15':310, '13:30':320, '13:45':330,
      '14:00':350, '14:15':360, '14:30':370, '14:45':380,
      '15:00':400, '15:15':410, '15:30':420, '15:45':430,
      '16:00':450, '16:15':460, '16:30':470, '16:45':480,
      '17:00':500, '17:15':510, '17:30':520, '17:45':530,
      '18:00':550, '18:15':560, '18:30':570, '18:45':580,
      '19:00':600
    }
    this.hourValues = {
      7:0, 8:50, 9:100, 10:150, 11:200, 12:250, 13:300,
      14:350, 15:400, 16:450, 17:500, 18:550, 19:590
    }
	}

  getRooms({date = 'today'}){
    // /getrooms
    return new Promise((complete, reject) => {
      const req = new XMLHttpRequest();

      req.open('POST', `${this.apiUrl}/getrooms`, true);

      req.onload = () => {
        complete(JSON.parse(req.response));
      };

      req.onerror = () => {
        reject(Error(req.statusText));
      };

      req.send(JSON.stringify({date}));
    })
  }


  /*
 Check if the current time is between these intervals
  [
    "07:00 - 11:15",
    "14:15 - 16:30",
    "17:15 - 19:00"
  ]
 */
 checkInterval({avail, value}){
  if(typeof avail === 'object' && avail.length > 0){
    let avails = avail.map(item => {
      let t = item.split(' - ');
      return {
        start: this.timeValues[t[0]],
        end: this.timeValues[t[1]]
      }
    });

    for(var i in avails)
      if(avails[i].start <= value &&
        avails[i].end >= value)
        return true
  }
  return false
 }



 rangeToTime(value){

  let val = parseInt(value),
  times = Object.keys(this.timeValues);

  for( let index in times){
    let i = parseInt(index);
    if(val - this.timeValues[times[i]] > 0 &&
       val - this.timeValues[times[i + 1]] <= 0){
      return times[i]
    }
  }
 }

 valueToRange(value){

  let val = parseInt(value),
  times = Object.keys(this.timeValues);

  for( let index in times){
    let i = parseInt(index);
    if(val - this.timeValues[times[i]] > 0 &&
       val - this.timeValues[times[i + 1]] <= 0){
      return this.timeValues[times[i]]
    }
  }
 }


  debounce(fn, time) {
    let flag = '';

    time = time || 300;

    return function () {
      const args = arguments;

      clearTimeout(flag);

      flag = setTimeout(() => {
        fn.apply({}, args);
      }, time);
    };
  }

}

const helpers = new Helpers();


export default helpers
