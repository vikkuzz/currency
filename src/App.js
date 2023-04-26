/*global chrome*/
import { useEffect } from "react";
import "./App.css";

import eur_usd_1min from "./datas/eur_usd_1min";
import eur_usd_5min from "./datas/eur_usd_5min";
import {
  parseDataString,
  getCurrentTime,
  getDateRange,
  getLastNDates,
  roundMinutesUpTo5,
} from "./utils/functions";
import { useState } from "react";

let count = 0;

function App() {
  const [data, setData] = useState([]);
  const [partData, setPartData] = useState([]);
  const [time, setTime] = useState(getCurrentTime());
  const [timeframe, setTimeframe] = useState("1min");
  const [range, setRange] = useState(30);
  //const [rangeData, setRangeData] = useState(getLastNDates(eur_usd_1min, 30));

  console.log("counter: ", (count += 1));

  let preData = parseDataString(eur_usd_1min);

  function getData(obj, callback) {
    let arrFromObj = [];
    for (let key in obj) {
      arrFromObj.push({ id: key, ...obj[key] });
    }
    callback(arrFromObj);
  }

  useEffect(() => {
    setTime(getCurrentTime());

    const timer = setInterval(() => setTime(getCurrentTime()), 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    let result = [];

    for (let i = 0; i < data.length; i++) {
      if (
        data[i].id == getCurrentTime() ||
        data[i].id == roundMinutesUpTo5(getCurrentTime())
      ) {
        result = data.slice(i, i + 50);
      }
    }
    setPartData(result);
    console.log("data was changed");
  }, [data]);

  useEffect(() => {
    let tableString = timeframe == "1min" ? eur_usd_1min : eur_usd_5min;
    tableString = getLastNDates(tableString, range);
    preData = parseDataString(tableString, timeframe == "1min" ? 1 : 5);
    getData(preData, setData);
  }, [timeframe, time, range]);

  const getCurrentTimeframe = (e) => {
    setTimeframe(e.target.value);
  };
  const changeRange = (e) => {
    let value = e.target.value;
    if (e.target.value === "") {
      value = 1;
    }
    setRange(e.target.value);
    console.log("onblur", e.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <span>Currency: EUR/USD</span>
        <select onChange={getCurrentTimeframe}>
          <option value={"1min"}>1min</option>
          <option value={"5min"}>5min</option>
        </select>

        {/* <div>{data[0]?.id}</div> */}
      </header>
      <div className="input_wrapper">
        <span className="input_text">
          за сколько дней рассчитывать статистику?
        </span>
        <input defaultValue={range} type="tel" onBlur={changeRange}></input>
      </div>
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
