import React from 'react';

import './BoardX.css';

class Board extends React.Component {
  timeout;
  isDrawing = false;

  componentDidMount() {
    this.drawOnCanvas();
    this.setupSocketListeners();
  }

  componentWillReceiveProps(newProps) {
    this.ctx.strokeStyle = newProps.color;
    this.ctx.lineWidth = newProps.size;
  }

  drawOnCanvas() {
    const canvas = document.querySelector('#board');
    this.ctx = canvas.getContext('2d');
    const ctx = this.ctx;

    const sketch = document.querySelector('#sketch');
    const sketch_style = getComputedStyle(sketch);
    canvas.width = parseInt(sketch_style.getPropertyValue('width'));
    canvas.height = parseInt(sketch_style.getPropertyValue('height'));

    const mouse = { x: 0, y: 0 };
    const last_mouse = { x: 0, y: 0 };

    /* Mouse Capturing Work */
    canvas.addEventListener(
      'mousemove',
      function (e) {
        last_mouse.x = mouse.x;
        last_mouse.y = mouse.y;

        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
      },
      false
    );

    /* Drawing on Paint App */
    ctx.lineWidth = this.props.size;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = this.props.color;

    canvas.addEventListener(
      'mousedown',
      function (e) {
        canvas.addEventListener('mousemove', onPaint, false);
      },
      false
    );

    canvas.addEventListener(
      'mouseup',
      function () {
        canvas.removeEventListener('mousemove', onPaint, false);
      },
      false
    );

    const onPaint = () => {
      ctx.beginPath();
      ctx.moveTo(last_mouse.x, last_mouse.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.closePath();
      ctx.stroke();

      if (this.timeout != undefined) clearTimeout(this.timeout);
      
      const base64ImageData = canvas.toDataURL('image/png');
      this.props.socket.emit('canvas-data', base64ImageData);
    };
  }

  setupSocketListeners() {
    this.props.socket.on('canvas-data', (data) => {
      const image = new Image();
      const canvas = document.querySelector('#board');
      const ctx = canvas.getContext('2d');
      image.onload = function () {
        ctx.drawImage(image, 0, 0);
      };
      image.src = data;
    });
  }
  captureScreenshot() {
    const canvas = document.querySelector('#board');
    canvas.toBlob((blob) => {
      const formData = new FormData();
      formData.append('image', blob, 'screenshot.png');
    
      fetch('http://localhost:5000/ocr', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              console.log('Screenshot sent successfully');
              console.log('Server output:', data);
            });
          } else {
            console.error('Error sending screenshot:', response.statusText);
          }
        })
        .catch((error) => {
          console.error('Error sending screenshot:', error);
        });
    });
  }  
  render() {
    return (
      <div className="sketch" id="sketch">
        <canvas className="board" id="board"></canvas>
        <button onClick={() => this.captureScreenshot()}>Capture Screenshot</button>
      </div>
    );
  }
}

export default Board;
