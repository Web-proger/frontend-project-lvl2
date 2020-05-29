// Получаем отображение элементов, которые уже не нужно сравнивать
const objToStr = (obj, depth) => {
  const string = Object.keys(obj).reduce((acc, key) => {
    const value = typeof obj[key] === 'object' ? objToStr(obj[key], depth + 1) : obj[key];
    return acc.concat(`${'    '.repeat(depth)}    ${key}: ${value}\n`);
  }, '');
  return `{\n${string}${'    '.repeat(depth)}}`;
};

const getValue = (value, depth) => (typeof value === 'object' ? objToStr(value, depth) : value);
const indent = (depth) => '    '.repeat(depth);

// Формируем строку для визуального отображения diff
const stylish = (dataBefore, dataAfter, structure, depth) => {
  let diff = '';
  const keys = Object.keys(structure).sort();

  keys.forEach((key) => {
    const { available, equal } = structure[key];
    const beforeVal = dataBefore[key];
    const afterVal = dataAfter[key];

    if (available === 'before') {
      diff = diff.concat(`${indent(depth)}  - ${key}: ${getValue(beforeVal, depth + 1)}\n`);
    }

    if (available === 'after') {
      diff = diff.concat(`${indent(depth)}  + ${key}: ${getValue(afterVal, depth + 1)}\n`);
    }

    if (available === 'both') {
      if (equal === true) {
        diff = diff.concat(`${indent(depth + 1)}${key}: ${beforeVal}\n`);
      } else {
        diff = diff.concat(`${indent(depth)}  - ${key}: ${getValue(beforeVal, depth + 1)}\n${indent(depth)}  + ${key}: ${getValue(afterVal, depth + 1)}\n`);
      }
    }

    if (!available && !equal) {
      diff += `${indent(depth + 1)}${key}: {\n${stylish(beforeVal, afterVal, structure[key], depth + 1)}${indent(depth + 1)}}\n`;
    }
  });

  return diff;
};

export default (bef, aft, str, d = 0) => {
  const diff = stylish(bef, aft, str, d).trimRight();
  return `{\n${diff}\n}`;
};
