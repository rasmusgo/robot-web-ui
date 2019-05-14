import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import "./style.css";
import { Arc } from "./arc_control";

// Hook
const useKeyPress = (targetKey: string) => {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);

  // If pressed key is our target key then set to true
  const downHandler = ({ key }: KeyboardEvent) => {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  // If released key is our target key then set to false
  const upHandler = ({ key }: KeyboardEvent) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return keyPressed;
}

const PressableCell: React.SFC<{
  callback: (pressed: boolean) => void,
  pressed: boolean,
}> = (props) => {
  type TouchEvent = React.TouchEvent<HTMLTableDataCellElement>;
  type MouseEvent = React.MouseEvent<HTMLTableDataCellElement>;
  const onPress = (event: TouchEvent | MouseEvent) => {
    event.preventDefault();
    props.callback(true);
  };
  const onRelease = (event: TouchEvent | MouseEvent) => {
    event.preventDefault();
    props.callback(false);
  };
  return (
    <td
      onTouchStart={ onPress }
      onTouchEnd={ onRelease }
      onMouseDown={ onPress }
      onMouseUp={ onRelease }
      className={ props.pressed ? 'pressed' : '' }
    >
      { props.children }
    </td>
  );
};

const App = () => {
  const [lastCommand, updateLastCommand] = useState(' ');
  const pressedKeyW = useKeyPress('w');
  const pressedKeyA = useKeyPress('a');
  const pressedKeyS = useKeyPress('s');
  const pressedKeyD = useKeyPress('d');
  const pressedKeyQ = useKeyPress('q');
  const pressedKeyE = useKeyPress('e');
  const pressedKeyZ = useKeyPress('z');
  const pressedKeyX = useKeyPress('x');
  const pressedKeyC = useKeyPress('c');
  const [pressedCellQ, updatePressedCellQ ] = useState(false);
  const [pressedCellW, updatePressedCellW ] = useState(false);
  const [pressedCellE, updatePressedCellE ] = useState(false);
  const [pressedCellA, updatePressedCellA ] = useState(false);
  const [pressedCellD, updatePressedCellD ] = useState(false);
  const [pressedCellZ, updatePressedCellZ ] = useState(false);
  const [pressedCellX, updatePressedCellX ] = useState(false);
  const [pressedCellC, updatePressedCellC ] = useState(false);

  const sendCommand = (command: string) => {
    fetch(
      '/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command,
        }),
      })
      .then(console.log)
      .catch(console.error);
    updateLastCommand(command);
  };

  const y: number =
    (pressedKeyQ || pressedKeyW || pressedKeyE || pressedCellQ || pressedCellW || pressedCellE ? 1 : 0) -
    (pressedKeyZ || pressedKeyS || pressedKeyC || pressedCellZ || pressedCellX || pressedCellC ? 1 : 0);
  const x: number =
    (pressedKeyE || pressedKeyD || pressedKeyC || pressedCellE || pressedCellD || pressedCellC ? 1 : 0) -
    (pressedKeyQ || pressedKeyA || pressedKeyZ || pressedCellQ || pressedCellA || pressedCellZ ? 1 : 0);

  const computeNewCommand = (): string => {
    if (pressedKeyX) {
      return 'x';
    }
    if (y > 0) {
      if (x < 0) {
        return 'q';
      }
      if (x > 0) {
        return 'e';
      }
      return 'w';
    }
    if (y < 0) {
      if (x < 0) {
        return 'z';
      }
      if (x > 0) {
        return 'c';
      }
      return 's';
    }

    if (x < 0) {
      return 'a';
    }
    if (x > 0) {
      return 'd';
    }
    return ' ';
  };

  const newCommand = computeNewCommand();
  if (newCommand != lastCommand) {
    sendCommand(newCommand);
  }

  return (
    <div className="App">
      <h1>Active command: {lastCommand}</h1>
      <p>x: { x } y { y }</p>
      <table className="controller-table">
        <tbody>
          <tr>
            <PressableCell pressed={ lastCommand == 'q' } callback={ updatePressedCellQ }>⬉</PressableCell>
            <PressableCell pressed={ lastCommand == 'w' } callback={ updatePressedCellW }>⬆</PressableCell>
            <PressableCell pressed={ lastCommand == 'e' } callback={ updatePressedCellE }>⬈</PressableCell>
          </tr>
          <tr>
            <PressableCell pressed={ lastCommand == 'a' } callback={ updatePressedCellA }>⟲</PressableCell>
            <PressableCell pressed={ lastCommand == ' ' } callback={ () => {}           }> </PressableCell>
            <PressableCell pressed={ lastCommand == 'd' } callback={ updatePressedCellD }>⟳</PressableCell>
          </tr>
          <tr>
            <PressableCell pressed={ lastCommand == 'z' } callback={ updatePressedCellZ }>⬋</PressableCell>
            <PressableCell pressed={ lastCommand == 's' } callback={ updatePressedCellX }>↓</PressableCell>
            <PressableCell pressed={ lastCommand == 'c' } callback={ updatePressedCellC }>⬊</PressableCell>
          </tr>
        </tbody>
      </table>
      <div>
        <Arc/>
      </div>
    </div>
  )
};

ReactDOM.render(
  <App />,
  document.getElementById("root"),
);
