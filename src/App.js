import React, { Component } from 'react';
import './Board.css';

function Snake(props){
  return(
    <div>
    {props.snakeArray.map(
      (xy, i) => {
        const style = {
          left: `${xy[0]}%`,
          top: `${xy[1]}%`
        }
        return <div className="snakepix" key={i} style={style} />
      }
    )}
    </div>
  );
}

function Apple(props){
  const style = {
    left: `${props.apple[0]}%`,
    top: `${props.apple[1]}%`
  }
  return(
    <div className="apple" style={style} />
  );
}

const getXyApple = () => {
  let min = 0;
  let max = 49;
  let x = 2 * Math.floor(min + Math.random() * (max + 1 - min));
  let y = 2 * Math.floor(min + Math.random() * (max + 1 - min));
  return [x,y]
}

const initialState = {
  xyApple: getXyApple(),
  snakeArray: [
    [30, 30],
    [32, 30],
    [34, 30]
  ],
  speed: 500,
  intervalId: undefined,
  arrDirection: ["RIGHT"],
};

class App extends Component {
  state = initialState;

  componentDidMount() {
    let intervalId = setInterval(this.moveSnake, this.state.speed);
    this.setState({intervalId: intervalId});

    document.onkeydown = this.onKeyDown;
  }

  componentDidUpdate() {
    this.checkIfEat();
    this.checkBorders();
    this.checkSelf();
  }

  speed = () => {
    return this.state.speed;
  }

  onKeyDown = (e) => {
    
    let arrDirection = this.state.arrDirection.slice();
    let direction = undefined;

    e = e || window.event;
    switch (e.keyCode) {
      case 38:
          direction = 'UP';
        break;
      case 40:
          direction = 'DOWN';
        break;
      case 37:
          direction = 'LEFT';
        break;
      case 39:
        direction = 'RIGHT';
        break;
      default:
        break;
    }
    
    if (direction){
      if (direction != arrDirection[arrDirection.length-1]){
        arrDirection.push(direction);
        this.setState({arrDirection: arrDirection});
      }
    }
  }

  setApple = () => {
    this.setState({
      xyApple: getXyApple()
    })
  }

  moveSnake = () => {
    let tSnake = [...this.state.snakeArray];
    let head = tSnake[tSnake.length - 1];

    let arrDirection = this.state.arrDirection.slice();
    if (arrDirection.length > 1){
      arrDirection.shift();
      this.setState({
        arrDirection: arrDirection,
      })
    }

    switch (arrDirection[0]) {
      case 'RIGHT':
        head = [head[0] + 2, head[1]];
        break;
      case 'LEFT':
        head = [head[0] - 2, head[1]];
        break;
      case 'DOWN':
        head = [head[0], head[1] + 2];
        break;
      case 'UP':
        head = [head[0], head[1] - 2];
        break;
      default:
        break;
    }

    tSnake.push(head);
    tSnake.shift();

    this.setState({
      snakeArray: tSnake,
    })
  }

  checkIfEat() {
    let head = this.state.snakeArray[this.state.snakeArray.length - 1];
    let xyApple = this.state.xyApple;
    if (head[0] === xyApple[0] && head[1] === xyApple[1]) {
      this.setState({
        xyApple: getXyApple()
      })
      this.eatApple();
      this.speedUp();
    }
  }

  checkBorders() {
    let head = this.state.snakeArray[this.state.snakeArray.length - 1];
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      this.onGameOver();
    }
  }

  checkSelf() {
    let snake = [...this.state.snakeArray];
    let head = snake[snake.length - 1];
    snake.pop();
    snake.forEach(dot => {
      if (head[0] == dot[0] && head[1] == dot[1]) {
        this.onGameOver();
      }
    })
  }

  onGameOver() {
    alert(`Game Over! Snake length is ${this.state.snakeArray.length}`);
    clearInterval(this.state.intervalId);
    this.setState(initialState);
    this.setState({
      intervalId: setInterval(this.moveSnake, initialState.speed)
    })
  }

  speedUp = () => {
    clearInterval(this.state.intervalId);
    
    let newSpeed = this.state.speed - 10;
    let intervalId = setInterval(this.moveSnake, newSpeed);

    this.setState({
      speed: newSpeed,
      intervalId: intervalId
    })
  }

  eatApple = () => {
    let newS = [...this.state.snakeArray];
    newS.unshift([])
    this.setState({
      snakeArray: newS
    })
  }

  render (){
    return (
      <div className="board">
        <Apple apple={this.state.xyApple} />
        <Snake snakeArray={this.state.snakeArray} />
      </div>
    );
  }
}

export default App;
