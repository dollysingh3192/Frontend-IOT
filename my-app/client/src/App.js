import React, { Component } from 'react';
import './App.css';
import car from './car.png';

function Item(props) {
  return (
    <div className="center" key={props.i}>
      <div className={`grid-item ${(parseInt(props.item.state)) ? 'green' : 'red'}`}>
        {
          !parseInt(props.item.state) && <img alt="car" src={car} />
        }
      </div>
      <span>{`ST ${props.item.station_id}`}</span>
    </div>
  )
}

class App extends Component {
  state = {
    response: ''
  };

  componentDidMount() {
    this.getAvailList();
    setInterval(
      function () {
        this.getAvailList();
      }
        .bind(this),
      3000
    );
  }

  getAvailList = () => {
    this.callApi()
      .then(res => {
        this.setState({ response: res });
      }
      )
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/iot');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  render() {
    const { response } = this.state;
    let availCount = 0;
    let totalCount = response && response.length;
    response && response.forEach((item) => {
      if (parseInt(item.state))
        availCount += 1;
    });
    return (
      <div className="App">
        <div className="grid-container">
          {
            response
            && response.map((item, i) => (
              <Item item={item} i={i} />
            )
            )
          }
        </div>
        <span className="counter">
          {
            `${availCount} slot available out of ${totalCount}`
          }
        </span>
      </div>
    );
  }
}
export default App;
