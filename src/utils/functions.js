export function parseDataString(dataString, timeframe = 1) {
  if (!dataString) {
    return;
  }
  let len = timeframe < 5 ? 1400 : 280;
  const lines = dataString.trim().split("\n");
  //console.log(lines);
  const keys = lines[0]
    .split(";")
    .map((key) => key.replace("<", "").replace(">", ""));
  const parsedData = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(";");
    const dataObj = {};

    for (let j = 0; j < values.length; j++) {
      dataObj[keys[j]] = values[j];
    }
    parsedData.push(dataObj);
  }

  const result = parsedData.reduce((acc, curr) => {
    const date = curr.DATE;
    const time = curr.TIME;

    if (!acc[date]) {
      acc[date] = {};
    }

    acc[date][time] = {
      OPEN: curr.OPEN,
      HIGH: curr.HIGH,
      LOW: curr.LOW,
      CLOSE: curr.CLOSE,
      VOL: curr.VOL,
    };

    return acc;
  }, {});

  let values = {};

  Object.keys(result).forEach((dateKey) => {
    const times = Object.keys(result[dateKey]);
    values[dateKey] = {};
    times.forEach((timeKey) => {
      const { OPEN, CLOSE } = result[dateKey][timeKey];
      values[dateKey][timeKey] = OPEN > CLOSE ? "OPEN" : "CLOSE";
    });
  });

  function filterObjects(obj, minLen) {
    let result = {};
    for (let key in obj) {
      let length = Object.keys(obj[key]).length;
      //console.log(length);
      if (length > minLen) {
        result[key] = obj[key];
      }
    }
    return result;
  }
  values = filterObjects(values, len);

  function getEqual(obj) {
    let arr = [];

    for (let key in obj) {
      arr.push(obj[key]);
    }

    function findMatchingField(objectsArray) {
      //console.log(objectsArray);
      const keys = Object.keys(objectsArray[0]);
      let result = {};
      for (let key of keys) {
        const values = objectsArray.map((obj) => obj[key]);
        function countPercentage(arr, targetValue) {
          const total = arr.length;
          const count = arr.filter((value) => value === targetValue).length;
          return ((count / total) * 100).toFixed(2);
        }

        const openPercent = countPercentage(values, "OPEN");
        const closePercent = countPercentage(values, "CLOSE");

        result[key] = {
          вниз: `${openPercent}%`,
          вверх: `${closePercent}%`,
        };
      }
      return result;
    }
    const finalResult = findMatchingField(arr);
    return finalResult;
  }
  return getEqual(values);
}

export function getCurrentTime() {
  const currentTime = new Date();
  const hours = currentTime.getHours().toString();
  const minutes = currentTime.getMinutes().toString().padStart(2, "0");
  const seconds = currentTime.getSeconds().toString().padStart(2, "0");
  return `${hours.length < 2 ? "0" + hours : hours}:${minutes}:00`;
}

export function getDateRange(str) {
  // разбиваем строку на массив строк по символу переноса строки
  const lines = str.split("\n");
  // удаляем первый элемент массива (шапку таблицы)
  lines.shift();

  // создаем массив дат
  const dates = [];
  for (let i = 0; i < lines.length; i++) {
    const data = lines[i].split(";")[0]; // получаем дату из i-ой строки
    if (!dates.includes(data)) {
      // если в массиве дат еще нет такой даты, то добавляем ее
      dates.push(data);
    }
  }

  // сортируем массив дат по возрастанию
  dates.sort((a, b) => new Date(a) - new Date(b));

  // получаем первую и последнюю даты
  const firstDate = dates[0];
  const lastDate = dates[dates.length - 1];

  return { firstDate, lastDate };
}

export function getLastNDates(dataString, days) {
  function getDateFromString(str) {
    const parts = str.split(";");
    const dateStr = parts[0];
    const dateParts = dateStr.split("/");
    const year = parseInt("20" + dateParts[2]);
    const month = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[0]);
    const date = new Date(year, month, day);

    return date;
  }
  const rows = dataString.trim().split("\n"); // Разбиваем на строки и удаляем лишние пробельные символы
  const lastRow = rows[rows.length - 1]; // Получаем последнюю строку
  const firstRow = rows[0]; // Получаем последнюю строку
  const lastDate = getDateFromString(lastRow); // Получаем дату из последней строки
  const cutoffDate = new Date(lastDate - days * 24 * 60 * 60 * 1000); // Вычисляем дату-порог, от которой оставляем данные

  // Фильтруем строки по дате и объединяем их в строку

  const result = `${firstRow}\n${rows
    .filter((row) => new Date(row.slice(0, 8)) <= cutoffDate)
    .join("\n")}`;
  return result;
}

export function roundMinutesUpTo5(time) {
  const minutes = parseInt(time.substring(3, 5), 10);
  // if (minutes % 5 === 0) {
  //   // минуты уже кратные 5
  //   return time;
  // } else {
  let hours = parseInt(time.substring(0, 2), 10);
  let roundedMinutes;
  if (minutes < 55) {
    roundedMinutes = Math.ceil(minutes / 5) * 5;
  } else {
    roundedMinutes = 0;
    hours++;
    if (hours === 24)
      // в случае, если сейчас 23:59, скорректируем час
      hours = 0;
  }
  const roundedTime =
    ("00" + hours).slice(-2) + ":" + ("00" + roundedMinutes).slice(-2) + ":00";
  return roundedTime;
  //}
}
