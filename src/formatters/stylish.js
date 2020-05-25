const isObject = (obj) => typeof obj === 'object';

// Получаем отображение элементов, которые уже не нужно сравнивать
const getValue = (obj, depth) => {
  const string = Object.keys(obj).reduce((acc, key) => {
    const value = typeof obj[key] === 'object' ? getValue(obj[key], depth + 1) : obj[key];
    return acc.concat(`${'    '.repeat(depth)}    ${key}: ${value}\n`);
  }, '');
  return `{\n${string}${'    '.repeat(depth)}}`;
};

// Формируем строку для визуального отображения diff
const stylish = (dataBefore, dataAfter, structure, depth) => {
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
      diff += `${'    '.repeat(depth + 1)}${key}: {\n${stylish(beforeVal, afterVal, structure[key], depth + 1)}${'    '.repeat(depth + 1)}}\n`;
    }
  });

  return diff;
};

export default (bef, aft, str, d = 0) => {
  const diff = stylish(bef, aft, str, d).trimRight();
  return `{\n${diff}\n}`;
};
