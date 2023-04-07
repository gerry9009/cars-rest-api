const fs = require("fs");

let types = [];
let fuelTypes = [];

const data = fs.readFileSync("./api/cars.json");
const cars = JSON.parse(data);

cars.forEach((car) => {
  if (!types.includes(car.type)) types.push(car.type);
  if (!fuelTypes.includes(car.fuel_type)) fuelTypes.push(car.fuel_type);
});

const schema = {
  name: { type: "string", required: true },
  price: { type: "string", required: true, values: "^[$].*" },
  type: { type: "string", required: true, values: types },
  seats: { type: "number", required: true },
  production_year: { type: "number", required: true },
  fuel_type: { type: "string", required: true, values: fuelTypes },
};

const dataValidation = (object) => {
  const keys = Object.keys(schema);

  let error = {};
  for (const key of keys) {
    if (object[key]) {
      if (schema[key].required) {
        if (String(object[key]).length === 0) {
          error[key] = `required`;
        }
      }

      if (typeof object[key] !== schema[key].type) {
        error[key] = `Invalid type`;
      }

      if (schema[key].values) {
        if (typeof schema[key].values === "string") {
          if (!object[key].match(schema[key].values)) {
            error[key] = `Invalid value`;
          }
        } else {
          if (!schema[key].values.includes(object[key])) {
            error[key] = `Invalid value`;
          }
        }
      }
    }
  }

  return error;
};

module.exports = { dataValidation };
