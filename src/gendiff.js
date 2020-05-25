import _ from 'lodash';

const data = (dataBefore, dataAfter) => {
  const keys = [...new Set([...Object.keys(dataBefore), ...Object.keys(dataAfter)])].sort();

  return keys.reduce((acc, key) => {
    const isBefore = _.has(dataBefore, key);
    const isAfter = _.has(dataAfter, key);
    const beforeValue = dataBefore[key];
    const afterValue = dataAfter[key];

    const item = {
      available: '',
      equal: null,
    };

    if (isBefore && isAfter) {
      if (typeof beforeValue === 'object' && typeof afterValue === 'object') {
        acc[key] = data(beforeValue, afterValue);
        return acc;
      }

      item.available = 'both';
      item.equal = beforeValue === afterValue;
    } else {
      item.available = isBefore ? 'before' : 'after';
    }
    acc[key] = item;

    return acc;
  }, {});
};

export default data;
