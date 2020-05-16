import _ from 'lodash';

export default (dataBefore, dataAfter) => {
  let diff = '';

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
      item.available = 'both';
      item.equal = beforeValue === afterValue;
    } else {
      item.available = isBefore ? 'before' : 'after';
    }

    return item;
  });

  return structure || `{\n${diff}\n}`;
};
