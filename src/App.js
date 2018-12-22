import React, { Component } from 'react';
import TimeAgo from 'timeago-react';
import './styles.scss'

class App extends Component {

  constructor(props){
    super(props);
    this.state  = {
      stocks: {

      }
    }

    this.handleUpdate = this.handleUpdate.bind(this);

  }

  handleUpdate(event){
    JSON.parse(event.data).forEach(([name,price]) => {
      const {stocks} = this.state;
      let color = "white"
      if(Object.keys(stocks).includes(name)){
        if(price => stocks[name].price){
          color = "green"
        }else{
          color = "red"
        }
      }
      this.setState({
        stocks : {
          ...this.state.stocks,
          [name]: {
            price,
            time: new Date().toISOString(),
            color
          }
        }
      })
    });
  }
  
  componentDidMount(){
    if ("WebSocket" in window) {
      const ws = new WebSocket("ws://stocks.mnet.website/")
      const handleUpdate = this.handleUpdate
      ws.onmessage = function (evt) { 
          handleUpdate(evt)
      };

      ws.onclose = function() { 
          
      console.log("Connection is closed..."); 
    };
    } else {
  
      alert("WebSocket NOT supported by your Browser!");
    }
  }
  render() {
    const {stocks} = this.state;
    const stocksList = Object.keys(stocks).map( (key,index) => {
      const {price,time,color} = stocks[key]
      return(
        <tr key={key} className={color}>
          <td>{key}</td>
          <td>{price}</td>
          <td>
            <TimeAgo
              datetime={time} 
               />
          </td>
        </tr>
      )
    })
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3">
          <h1>Live Stock App</h1>
            <table className="table table-bordered">
              <thead>
                <tr>
                <th>Ticker</th>
                <th>Price</th>
                <th>Last Update</th>
                </tr>
              </thead>
              <tbody>
                {stocksList}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
