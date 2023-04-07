const fs = require("fs");

const data = fs.readFileSync("./api/cars.json");
const cars = JSON.parse(data);

const getRandomId = (data) => {
  let ids = [];
  let maxLength = 1;
  data.forEach((item) => {
    ids.push(item.id);
    maxLength = maxLength < item.id.length ? item.id.length : maxLength;
  });
  let newId = String(randomNumber(maxLength));
  while (true) {
    if (ids.includes(newId)) {
      newId = String(randomNumber(maxLength));
    } else {
      return String(newId);
    }
  }
};

const randomNumber = (maxLength) => {
  let max = "1";
  for (let i = 0; i < maxLength; i++) {
    max = max + "0";
  }
  return Math.floor(Math.random() * Number(max));
};

const getTypeList = () => {
  let types = [];
  cars.forEach((car) => {
    if (!types.includes(car.type)) types.push(car.type);
  });
  return types;
};

const getFuelsList = () => {
  let fuelTypes = [];
  cars.forEach((car) => {
    if (!fuelTypes.includes(car.fuel_type)) fuelTypes.push(car.fuel_type);
  });
  return fuelTypes;
};

module.exports = { getRandomId, getTypeList, getFuelsList };
