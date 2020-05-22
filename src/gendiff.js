import _ from 'lodash';

const data = (dataBefore, dataAfter) => {
  const diff = '';

  const keys = [...new Set([...Object.keys(dataBefore), ...Object.keys(dataAfter)])];

  const structure = keys.map((key) => {
    const isBefore = _.has(dataBefore, key);
    const isAfter = _.has(dataAfter, key);
    const beforeValue = dataBefore[key];
    const afterValue = dataAfter[key];

    const item = {
      name: key,
      available: '',
      equal: null,
    };

    if (isBefore && isAfter) {
      if (typeof beforeValue === 'object' && typeof afterValue === 'object') {
        // return `${key}: ${data(beforeValue, afterValue)}`;
        return data(beforeValue, afterValue);
      }
      item.available = 'both';
      item.equal = beforeValue === afterValue;
    } else {
      item.available = isBefore ? 'before' : 'after';
    }

    return item;
  });

  return structure || `{\n${diff}\n}`;
};

export default data;
