const { getTypeList, getFuelsList } = require("./modules");

let types = getTypeList();
let fuelTypes = getFuelsList();

const schema = {
  name: { type: "string", required: true },
  price: { type: "string", required: true, values: "^[$].*" },
  type: { type: "string", required: true, values: types },
  seats: { type: "number", required: true },
  production_year: { type: "number", required: true },
  fuel_type: { type: "string", required: true, values: fuelTypes },
};

const checkType = (schemaType, addedType) => {
  return typeof addedType !== schemaType;
};

const checkValue = (schemaValue, addedValue) => {
  if (typeof schemaValue === "string") {
    return !addedValue.match(schemaValue);
  } else {
    return !schemaValue.includes(addedValue);
  }
};

const dataValidation = (object) => {
  const keys = Object.keys(schema);

  let error = {};
  for (const key of keys) {
    if (schema[key].required) {
      if (object[key]) {
        const typeIsNotValid = checkType(schema[key].type, object[key]);
        if (typeIsNotValid) {
          error[key] = `Invalid type`;
        }
        if (schema[key].values) {
          const valueIsNotValid = checkValue(schema[key].values, object[key]);
          if (valueIsNotValid) {
            error[key] = `Invalid value`;
          }
        }
      } else {
        error[key] = "Required value";
      }
    } else {
      const typeIsNotValid = checkType(schema[key].type, object[key]);
      if (typeIsNotValid) {
        error[key] = `Invalid type`;
      }
      if (schema[key].values) {
        const valueIsNotValid = checkValue(schema[key].values, object[key]);
        if (valueIsNotValid) {
          error[key] = `Invalid value`;
        }
      }
    }
  }

  return error;
};

module.exports = { dataValidation };
