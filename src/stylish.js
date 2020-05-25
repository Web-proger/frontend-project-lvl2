const getValue = (obj, depth) => {
  const string = Object.keys(obj).reduce((acc, key) => {
    const value = typeof obj[key] === 'object' ? getValue(obj[key], depth + 1) : obj[key];
    return acc.concat(`${'    '.repeat(depth)}    ${key}: ${value}\n`);
  }, '');
  return `{\n${string}${'    '.repeat(depth)}}`;
};

const getDiff = (dataBefore, dataAfter, structure, depth = 0) => {
  let diff = '';
  const keys = Object.keys(structure).sort();

  keys.forEach((key) => {
    const { available, equal } = structure[key];

    if (available === 'before') {
      const value = typeof dataBefore[key] === 'object' ? getValue(dataBefore[key], depth + 1) : dataBefore[key];
      diff = diff.concat(`${'    '.repeat(depth)}  - ${key}: ${value}\n`);
    }

    if (available === 'after') {
      const value = typeof dataAfter[key] === 'object' ? getValue(dataAfter[key], depth + 1) : dataAfter[key];
      diff = diff.concat(`${'    '.repeat(depth)}  + ${key}: ${value}\n`);
    }

    if (available === 'both') {
      if (equal === true) {
        diff = diff.concat(`${'    '.repeat(depth + 1)}${key}: ${dataBefore[key]}\n`);
      } else {
        const valueBefore = typeof dataBefore[key] === 'object' ? getValue(dataBefore[key], depth + 1) : dataBefore[key];
        const valueAfter = typeof dataAfter[key] === 'object' ? getValue(dataAfter[key], depth + 1) : dataAfter[key];
        diff = diff.concat(`${'    '.repeat(depth)}  - ${key}: ${valueBefore}\n${'    '.repeat(depth)}  + ${key}: ${valueAfter}\n`);
      }
    }

    if (!available && !equal) {
      diff += `${'    '.repeat(depth + 1)}${key}: {\n${getDiff(dataBefore[key], dataAfter[key], structure[key], depth + 1)}${'    '.repeat(depth + 1)}}\n`;
    }
  });

  return diff;
};

export default getDiff;
