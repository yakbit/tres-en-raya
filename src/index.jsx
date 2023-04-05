import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => {
          this.props.onClick(i);
        }}
      ></Square>
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat({ squares: squares }),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Go to # " + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    let status;
    if (winner) {
      status = "The winner is: " + winner;
    } else {
      status = "Next pleyer is: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    alert("A name was submitted: " + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

class EssayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "Please write an essay about your favorite DOM element.",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    alert("An esay was submitted: " + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Essay:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
        <input type="file" />
      </form>
    );
  }
}

/************************************************************* */

function BoillingVeredict(props) {
  if (props.celcius >= 100) {
    return <p>The water would boil</p>;
  }
  return <p>The water would not boil</p>;
}

const scaleNames = {
  c: "Celcius",
  f: "Fahrenheit",
};

class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onTemperatureChange(e.target.value);
  }

  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}: </legend>
        <input value={temperature} onChange={this.handleChange} />
      </fieldset>
    );
  }
}

function toCelcius(fahrenheit) {
  return ((fahrenheit - 32) * 5) / 9;
}

function toFahrenheit(celcius) {
  return (celcius * 9) / 5 + 32;
}

function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return "";
  }
  const output = convert(input);
  const rounder = Math.round(output * 1000) / 1000;
  return rounder.toString();
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleCelciusChange = this.handleCelciusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = {
      temperature: "",
      scale: "c",
    };
  }

  handleCelciusChange(temperature) {
    this.setState({ scale: "c", temperature: temperature });
  }

  handleFahrenheitChange(temperature) {
    this.setState({ scale: "f", temperature: temperature });
  }
  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celcius =
      scale === "f" ? tryConvert(temperature, toCelcius) : temperature;
    const fahrenheit =
      scale === "c" ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celcius}
          onTemperatureChange={this.handleCelciusChange}
        />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange}
        />
        <BoillingVeredict celcius={parseFloat(celcius)} />
      </div>
    );
  }
}

/***************************************************************************** */
/***************************************************************************** */

function cambioDeDivisaUa(dinero) {
  return dinero * 0.026;
}

function cambioDivisaEuro(dinero) {
  return dinero * 38.35;
}

const tipoDivisas = {
  eur: "eur",
  ua: "ua",
};

function tryCambioDivisa(dinero, cambio) {
  const cambioRealizado = cambio(dinero);

  return cambioRealizado.toString();
}

class InputComponente extends React.Component {
  constructor(props) {
    super(props);
    this.handler = this.handler.bind(this);
  }
  handler(e) {
    this.props.onChangeDinero(e.target.value, this.props.divisa);
  }
  render() {
    return (
      <fieldset>
        {console.log("soy componente de ", this.props.divisa)}
        <legend>Intoduce: {tipoDivisas[this.props.divisa]}: </legend>
        <input value={this.props.dinero} onChange={this.handler}></input>
      </fieldset>
    );
  }
}

class CambioDivisa extends React.Component {
  constructor(props) {
    super(props);
    this.handler = this.handler.bind(this);
    this.state = {
      divisa: "eur",
      dinero: "",
    };
  }

  handler(dinero, divisa) {
    this.setState({ divisa, dinero });
    console.log(
      "estoy cambiando el estado. Dinero: ",
      this.state.dinero,
      " ",
      this.state.divisa
    );
  }

  render() {
    const dinero = this.state.dinero;
    const divisa = this.state.divisa;
    const euros =
      divisa === "eur" ? tryCambioDivisa(dinero, cambioDivisaEuro) : dinero;
    const grivnya =
      divisa === "eur" ? tryCambioDivisa(dinero, cambioDeDivisaUa) : dinero;

    return (
      <div>
        <div>Cambio de divisa</div>

        <fieldset>
          <InputComponente
            value={euros}
            onChangeDinero={this.handler}
            divisa={"eur"}
          />
          <InputComponente
            value={grivnya}
            onChangeDinero={this.handler}
            divisa={"ua"}
          />
        </fieldset>
      </div>
    );
  }
}
// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
