import React, { useState } from "react";
import ReactDOM from "react-dom";

import "./style.css";

const App = () => {
  const [lastCommand, updateLastCommand] = useState(' ');
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
  }
  return (
    <div className="App">
      <h1>Active command: {lastCommand}</h1>
      <table>
        <tbody>
          <tr>
            <td>
            </td>
            <td>
              <button onClick={() => sendCommand('w')}>F</button>
            </td>
            <td>
            </td>
          </tr>
          <tr>
            <td>
              <button onClick={() => sendCommand('a')}>L</button>
            </td>
            <td>
              <button onClick={() => sendCommand(' ')}>stop</button>
            </td>
            <td>
              <button onClick={() => sendCommand('d')}>R</button>
            </td>
          </tr>
          <tr>
            <td>
            </td>
            <td>
              <button onClick={() => sendCommand('s')}>B</button>
            </td>
            <td>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
};

ReactDOM.render(
  <App />,
  document.getElementById("root"),
);
