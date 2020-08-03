import React, { Component } from 'react';
import socket from '../utilities/socket-connection';
import './App.css';
import Widget from '../widget/Widget';

class App extends Component {
  constructor() {
    super();
    this.state = {
      performanceData: {},
    };
  }

  componentDidMount() {
    socket.on('data', (data) => {
      const currentState = { ...this.state.performanceData };
      currentState[data.macA] = data;
      this.setState({ performanceData: currentState });
    });
  }

  render() {
    const widgets = [];
    Object.entries(this.state.performanceData).forEach(([key, value]) => {
      widgets.push(<Widget key={key} data={value} />);
    });
    return <div className="App">{widgets}</div>;
  }
}

export default App;
