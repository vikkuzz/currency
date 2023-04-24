/*global chrome*/
import { useEffect } from "react";
import "./App.css";

import eur_usd_1min from "./datas/eur_usd_1min";
import { parseDataString, getCurrentTime } from "./utils/functions";
import { useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const [partData, setPartData] = useState([]);
  const [time, setTime] = useState(getCurrentTime());

  useEffect(() => {
    let preData = parseDataString(eur_usd_1min);
    let arrFromObj = [];
    for (let key in preData) {
      arrFromObj.push({ id: key, ...preData[key] });
    }
    setData(arrFromObj);

    const timer = setInterval(() => setTime(getCurrentTime()), 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    let result = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == getCurrentTime()) {
        result = data.slice(i, i + 50);
      }
    }
    setPartData(result);
  }, [data, time]);

  return (
    <div className="App">
      <header className="App-header">
        <span>Currency: EUR/USD</span>
        <span>Timeframe: 1min</span>
      </header>
      <div className="flex_container">
        {partData?.map((el, i) => {
          return (
            <div
              className="height"
              key={el.id}
              style={{
                border: `${
                  el.вниз < "69%" && el.вверх < "69%"
                    ? "none"
                    : "2px solid gold"
                }`,
              }}
            >
              <span
                className="elem"
                style={{
                  height: `${el.вниз > el.вверх ? el.вниз : el.вверх}`,
                  backgroundColor: `${el.вниз > el.вверх ? "red" : "green"}`,
                }}
              >
                <span>{el.id}:</span>
                <span className="text">
                  {el.вниз > el.вверх ? "вниз " + el.вниз : "вверх " + el.вверх}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
