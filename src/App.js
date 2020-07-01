import React, { Component } from 'react';
import './Board.css';

function Snake(props){
  return(
    <div>
      { props.snakeArray.map(
        (xy, i) => {
          const style = {
            left: `${xy[0]}%`,
            top: `${xy[1]}%`
          }
          return <div className = 'snakepix' key={i} style={style} />
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

const getNewApple = () => {
  let min = 0;
  let max = 49;
  let x = 2 * Math.floor(min + Math.random() * (max + 1 - min));
  let y = 2 * Math.floor(min + Math.random() * (max + 1 - min));
  return [x,y]
}

const initialState = {
  xyApple: getNewApple(),
  snakeArray: [
    [30, 30],
    [32, 30],
    [34, 30]
  ],
  speed: 500,
  intervalId: undefined,
  arrDirection: ["RIGHT"],
  gameIsOn: false,
  showGameOver: false,
  lastResult: 0,
};

class App extends Component {
  state = initialState;

  componentDidMount() {
    document.onkeydown = this.onKeyDown;
  }

  onKeyDown = (e) => {
    
    let arrDirection = this.state.arrDirection.slice();
    let direction = undefined;

    e = e || window.event;
    switch (e.keyCode) {
      case 13:
      case 32:
          if ( !this.state.gameIsOn ) {
            this.startGame();
            return;
          }
        break;
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
    
    if ( direction && direction !== arrDirection[arrDirection.length-1]){ // если нажатие нового направления
      arrDirection.push(direction);
      this.setState({arrDirection: arrDirection});
    }
  }

  setApple = () => {
    this.setState({
      xyApple: getNewApple()
    })
  }

  moveSnake = () => {
    let tSnake = [...this.state.snakeArray];
    let head = tSnake[tSnake.length - 1];

    let arrDirection = this.state.arrDirection.slice();
    if (arrDirection.length > 1){ // если в буфере много нажатий, то возьмем следующее
      arrDirection.shift();
      this.setState({
        arrDirection: arrDirection,
      })
    }

    // рассчитаем, где у нас будет голова
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

    // если врезались в стенку
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      this.onGameOver();
      return;
    }
    
    // если врезались в себя
    tSnake.forEach( (dot,i) => {
      if ( i === 0 ) return;
      if (head[0] === dot[0] && head[1] === dot[1]) {
        this.onGameOver();
        return;
      }
    })

    // узнаем, съели ли яблоко
    let xyApple = this.state.xyApple;
    if (head[0] === xyApple[0] && head[1] === xyApple[1]) { // съели
      xyApple = getNewApple();
      this.speedUp();
    } else { // не съели
      tSnake.shift();
    }

    tSnake.push(head);
    
    this.setState({
      xyApple: xyApple,
      snakeArray: tSnake,
    })
  }

  speedUp = () => {
    clearInterval(this.state.intervalId);
    
    let newSpeed = this.state.speed - 10;
    let intervalId = setInterval(this.moveSnake, newSpeed);

    this.setState({
      speed: newSpeed,
      intervalId: intervalId,
    })
  }

  onGameOver() {
    clearInterval(this.state.intervalId);
    this.setState( _state => { return {
      gameIsOn: false,
      showGameOver: true,
      lastResult: _state.snakeArray.length - initialState.snakeArray.length,
    }});
  }

  startGame = e => {
    e && e.preventDefault();

    this.setState({
      ...initialState,
      gameIsOn: true,
      intervalId: setInterval(this.moveSnake, initialState.speed),
    })
  }

  render (){
    return (
      <div>
        <p>
          { this.state.gameIsOn ?
            "Счет: " + ( this.state.snakeArray.length - initialState.snakeArray.length )
          :
            <button
              onClick = { (e) => this.startGame(e) }
            >
              Начать игру (пробел, энтер)
            </button>
          }
        </p>
        <div className="board">
          <Apple apple = {this.state.xyApple} />
          <Snake snakeArray = {this.state.snakeArray} />
          { this.state.showGameOver &&
            <div className = "gameover" >
              <p>Game Over</p>
              <p>Счет: {this.state.lastResult}</p>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default App;
