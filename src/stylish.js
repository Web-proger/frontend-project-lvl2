import _ from 'lodash';

const getDiff = (dataBefore, dataAfter, structure, depth = 0) => {
  let diff = '';
  const keys = Object.keys(structure);

  keys.forEach((key) => {
    if (structure[key].available === 'before') {
      diff = diff.concat(`${'    '.repeat(depth)}  - ${key}: ${dataBefore[key]}\n`);
    }

    if (structure[key].available === 'after') {
      diff = diff.concat(`${'    '.repeat(depth)}  + ${key}: ${dataAfter[key]}\n`);
    }

    if (structure[key].available === 'both') {
      if (structure[key].equal === true) {
        diff = diff.concat(`${'    '.repeat(depth + 1)}${key}: ${dataBefore[key]}\n`);
      } else {
        diff = diff.concat(`${'    '.repeat(depth)}  - ${key}: ${dataBefore[key]}\n${'    '.repeat(depth)}  + ${key}: ${dataAfter[key]}\n`);
      }
    }

    if (!structure[key].available && !structure[key].equal) {
      diff += `${'    '.repeat(depth + 1)}${key}:\n${getDiff(dataBefore[key], dataAfter[key], structure[key], depth + 1)}`;
    }
  });

  return diff;
};

export default getDiff;
