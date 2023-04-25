import eur_usd_1min from "./datas/eur_usd_1min.js";
import { parseDataString } from "./utils/functions.js";

// получаем доступ к кнопке
let snow = document.getElementById("root");
console.log(snow);
// когда кнопка нажата — находим активную вкладку и запускаем нужную функцию
snow.addEventListener("click", async () => {
  // получаем доступ к активной вкладке
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // выполняем скрипт
  chrome.scripting.executeScript({
    // скрипт будет выполняться во вкладке, которую нашли на предыдущем этапе
    target: { tabId: tab.id },
    // вызываем функцию
    function: snowFall,
  });
});

// запускаем снег
function snowFall() {
  let panel = document.querySelector(".call-put-block");
  const btn1 = document.createElement("button");
  const btn2 = document.createElement("button");

  const url = chrome.runtime.getURL("./datas/eur_usd_1min.js");
  import(url).then((module) => {
    console.log(module);
    // Ваш код здесь
  });

  //console.log(parseDataString(eur_usd_1min));

  panel.appendChild(btn1);
  panel.appendChild(btn2);
}
