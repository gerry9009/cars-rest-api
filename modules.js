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

module.exports = { getRandomId };
