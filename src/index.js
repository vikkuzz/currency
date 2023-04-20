import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

function snowFall() {
  const root = ReactDOM.createRoot(document.getElementById("root"));

  let snow = document.getElementById("snow");
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

  let panel = document.querySelector(".call-put-block");

  root.render(
    <React.StrictMode>
      <App panel={panel} />
    </React.StrictMode>
  );
}
