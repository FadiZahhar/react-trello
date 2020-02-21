import React from 'react';
import logo from './logo.svg';
import Board from './components/Board';
import data from './sampleData';

import './App.css';

class App extends React.Component {
  state = {
    boards: []
  }
  componentDidMount() {
    this.setState({boards : data.boards })
  }
  render() {
    return (
      <div>
        {this.state.boards.map(board => (
         <Board board={board} />
        ))}
        
      </div>
    );
  }
 
}

export default App;
