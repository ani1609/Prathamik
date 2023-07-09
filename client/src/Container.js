import React from 'react';
import Board from './BoardX';
import './Container.css';

class Container extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      color: '#000000',
      size: '5',
      isEraserActive: false,
    };
  }

  changeColor(event) {
    if (this.state.isEraserActive) {
      this.setState({
        color: 'rgba(255, 255, 255, 1)',
        isEraserActive: false,
      });
    } else {
      this.setState({
        color: event.target.value,
      });
    }
  }

  changeSize(event) {
    this.setState({
      size: event.target.value,
    });
  }

  toggleEraser() {
    this.setState((prevState) => ({
      isEraserActive: !prevState.isEraserActive,
    }));
  }

  render() {
    return (
      <div className="container">
        <div className="tools-section">
          <div className="color-picker-container">
            Select Brush Color : &nbsp;
            <input
              type="color"
              value={this.state.color}
              onChange={this.changeColor.bind(this)}
            />
          </div>

          <div className="brushsize-container">
            Select Brush Size : &nbsp;
            <select value={this.state.size} onChange={this.changeSize.bind(this)}>
              <option> 5 </option>
              <option> 10 </option>
              <option> 15 </option>
              <option> 20 </option>
              <option> 25 </option>
              <option> 30 </option>
            </select>
          </div>

          <div className="eraser-container">
            <label>
              Eraser Tool: &nbsp;
              <input
                type="checkbox"
                checked={this.state.isEraserActive}
                onChange={this.toggleEraser.bind(this)}
                value={this.state.isEraserActive}
              />
            </label>
          </div>
        </div>

        <div className="board-container">
          <Board
            color={this.state.isEraserActive ? 'rgba(255, 255, 255, 1)' : this.state.color}
            size={this.state.size}
            socket={this.props.socket}
            canvasRef={this.props.canvasRef}
            meetingId={this.props.meetingId}
          />
        </div>
      </div>
    );
  }
}

export default Container;