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
      grey: '#d5d7e0'
    };

    this.toggleEraser = this.toggleEraser.bind(this);
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

  toggleEraser () {
    this.setState((prevState) => ({
      isEraserActive: !prevState.isEraserActive,
    }));

    if(this.state.grey === '#d5d7e0') {
      this.setState({
        grey: '#9a9eae'
      });
    }
    else {
      this.setState({
        grey: '#d5d7e0'
      });
    }
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

          <div>
            <label className='eraser-container'>
              Eraser Tool: &nbsp;
              <div style={{backgroundColor: this.state.grey}} className='erazerBtn' onClick={this.toggleEraser}></div>
            </label>
          </div>
        </div>

        <div className={this.state.isEraserActive?"board-container eraser_cursor":"board-container pencil_cursor"}>
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