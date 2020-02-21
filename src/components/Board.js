import React from 'react'
import List from './List'

class Board extends React.Component {
    render() {
        return (
            <div>
            <p>{this.props.board.title}</p>
            </div>
        )
    }
    
}

export default Board;