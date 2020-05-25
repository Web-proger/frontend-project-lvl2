import _ from 'lodash';

// Получаем структуру дифа
const getStructure = (dataBefore, dataAfter) => {
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
        acc[key] = getStructure(beforeValue, afterValue);
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

// Получаем отображение элементов, которые уже не нужно сравнивать
const getValue = (obj, depth) => {
  const string = Object.keys(obj).reduce((acc, key) => {
    const value = typeof obj[key] === 'object' ? getValue(obj[key], depth + 1) : obj[key];
    return acc.concat(`${'    '.repeat(depth)}    ${key}: ${value}\n`);
  }, '');
  return `{\n${string}${'    '.repeat(depth)}}`;
};

const isObject = (obj) => typeof obj === 'object';

// Формируем строку для визуального отображения diff
const getVision = (dataBefore, dataAfter, structure, depth = 0) => {
  let diff = '';
  const keys = Object.keys(structure).sort();

  keys.forEach((key) => {
    const { available, equal } = structure[key];
    const beforeVal = dataBefore[key];
    const afterVal = dataAfter[key];

    if (available === 'before') {
      const value = isObject(beforeVal) ? getValue(beforeVal, depth + 1) : beforeVal;
      diff = diff.concat(`${'    '.repeat(depth)}  - ${key}: ${value}\n`);
    }

    if (available === 'after') {
      const value = isObject(afterVal) ? getValue(afterVal, depth + 1) : afterVal;
      diff = diff.concat(`${'    '.repeat(depth)}  + ${key}: ${value}\n`);
    }

    if (available === 'both') {
      if (equal === true) {
        diff = diff.concat(`${'    '.repeat(depth + 1)}${key}: ${beforeVal}\n`);
      } else {
        const strBefore = isObject(beforeVal) ? getValue(beforeVal, depth + 1) : beforeVal;
        const strAfter = isObject(afterVal) ? getValue(afterVal, depth + 1) : afterVal;
        diff = diff.concat(`${'    '.repeat(depth)}  - ${key}: ${strBefore}\n${'    '.repeat(depth)}  + ${key}: ${strAfter}\n`);
      }
    }

    if (!available && !equal) {
      diff += `${'    '.repeat(depth + 1)}${key}: {\n${getVision(beforeVal, afterVal, structure[key], depth + 1)}${'    '.repeat(depth + 1)}}\n`;
    }
  });

  return diff;
};

export default (dataBefore, dataAfter, stylish = 'stylish') => {
  const structure = getStructure(dataBefore, dataAfter);
  let diff;
  if (stylish === 'stylish') {
    diff = getVision(dataBefore, dataAfter, structure).trimRight();
    diff = `{\n${diff}\n}`;
  }
  return diff;
};
