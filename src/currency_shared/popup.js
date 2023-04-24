// получаем доступ к кнопке
let snow = document.getElementById("root");
// когда кнопка нажата — находим активную вкладку и запускаем нужную функцию
snow.addEventListener("click", async () => {
  // получаем доступ к активной вкладке
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // выполняем скрипт
  chrome.scripting.executeScript({
    // скрипт будет выполняться во вкладке, которую нашли на предыдущем этапе
    target: { tabId: tab.id },
    // вызываем функцию, в которой лежит запуск снежинок
    function: snowFall,
  });
});

// запускаем снег
function snowFall() {
  let panel = document.querySelector(".call-put-block");
  const btn = document.createElement("button");
  panel.appendChild(btn);
}
