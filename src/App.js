/*global chrome*/
import { useEffect } from "react";
import "./App.css";

import eur_usd_1min from "./datas/eur_usd_1min";
import { parseDataString, getCurrentTime } from "./utils/functions";
import { useState } from "react";

function App({ panel }) {
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
  }, [data]);

  useEffect(() => {
    let result = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == getCurrentTime()) {
        result = data.slice(i, i + 50);
      }
    }
    setPartData(result);
  }, [time]);

  useEffect(() => {
    let count = 0;
    console.log(partData);
    localStorage.setItem("data", partData);

    let snow = document.getElementById("root");
    // когда кнопка нажата — находим активную вкладку и запускаем нужную функцию
    snow.addEventListener("click", async () => {
      // получаем доступ к активной вкладке
      let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      // выполняем скрипт
      chrome.scripting.executeScript({
        // скрипт будет выполняться во вкладке, которую нашли на предыдущем этапе
        target: { tabId: tab.id },
        // вызываем функцию, в которой лежит запуск снежинок
        function: snowFall,
      });
    });

    function snowFall() {
      let panel = document.querySelector(".call-put-block");
      let partData = localStorage.getItem("data");

      console.log(panel, partData);

      for (let i = 0; i < partData.length; i++) {
        if (partData[i].вниз < "69%" && partData[i].вверх < "69%") {
          count += 1;
          if (count < 3) {
            panel?.appendChild(
              <div
                className="height"
                key={partData[i].id}
                style={{
                  border: `${
                    partData[i].вниз < "69%" && partData[i].вверх < "69%"
                      ? "none"
                      : "2px solid gold"
                  }`,
                }}
              >
                <span
                  className="elem"
                  style={{
                    height: `${
                      partData[i].вниз > partData[i].вверх
                        ? partData[i].вниз
                        : partData[i].вверх
                    }`,
                    backgroundColor: `${
                      partData[i].вниз > partData[i].вверх ? "red" : "green"
                    }`,
                  }}
                >
                  <span>{partData[i].id}:</span>
                  <span className="text">
                    {partData[i].вниз > partData[i].вверх
                      ? "вниз " + partData[i].вниз
                      : "вверх " + partData[i].вверх}
                  </span>
                </span>
              </div>
            );
          }
        }
      }
    }
  }, [partData]);

  return (
    <div className="App">
      <header className="App-header">
        <span>Currency: EUR/USD</span>
        <span>Timeframe: 1min</span>
      </header>
      <div className="flex_container">
        {partData?.map((el, i) => {
          if (i < 50) {
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
                    {el.вниз > el.вверх
                      ? "вниз " + el.вниз
                      : "вверх " + el.вверх}
                  </span>
                </span>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

export default App;
