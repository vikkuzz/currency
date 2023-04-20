/*global chrome*/

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

let panel = document.querySelector(".call-put-block");
console.log("done", document.getElementById("root"));
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

root.render(
  <React.StrictMode>
    <App panel={panel} />
  </React.StrictMode>
);

// запускаем снег
function snowFall() {
  let panel = document.querySelector(".call-put-block");
  const root = ReactDOM.createRoot(document.getElementById("root"));

  root.render(
    <React.StrictMode>
      <App panel={panel} />
    </React.StrictMode>
  );
}
