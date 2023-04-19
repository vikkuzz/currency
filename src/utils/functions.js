export function parseDataString(dataString) {
  const lines = dataString.trim().split("\n");

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
  console.log(parsedData);

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
      if (length > minLen) {
        result[key] = obj[key];
      }
    }
    console.log(result);
    return result;
  }
  values = filterObjects(values, 1400);

  function getEqual(obj) {
    let arr = [];

    for (let key in obj) {
      arr.push(obj[key]);
    }

    function findMatchingField(objectsArray) {
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
  console.log(getEqual(values));
  return getEqual(values);
}

export function getCurrentTime() {
  const currentTime = new Date();
  const hours = currentTime.getHours().toString();
  const minutes = currentTime.getMinutes().toString().padStart(2, "0");
  const seconds = currentTime.getSeconds().toString().padStart(2, "0");
  return `${hours.length < 2 ? "0" + hours : hours}:${minutes}:00`;
}