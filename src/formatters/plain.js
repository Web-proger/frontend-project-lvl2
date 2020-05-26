const isObject = (obj) => typeof obj === 'object';

const plain = (before, after, structure, name = []) => {
  let diff = '';
  const keys = Object.keys(structure).sort();

  keys.forEach((key) => {
    const { available, equal } = structure[key];
    const beforeVal = before[key];
    const afterVal = after[key];
    const path = name.slice();
    path.push(key);
    const pathStr = `'${path.join('.')}'`;

    if (available === 'before') {
      const value = `Property ${pathStr} was deleted\n`;
      diff = diff.concat(value);
    }

    if (available === 'after') {
      const value = `Property ${pathStr} was added with value: ${isObject(afterVal) ? '[complex value]' : afterVal}`;
      diff = diff.concat(value);
    }

    if (available === 'both') {
      if (equal !== true) {
        const value = `Property ${pathStr} was changed from: ${isObject(beforeVal) ? '[complex value]' : beforeVal} to ${isObject(afterVal) ? '[complex value]' : afterVal}\n`;
        diff = diff.concat(value);
      }
    }

    if (!available && !equal) {
      const value = `${plain(beforeVal, afterVal, structure[key], path)}\n`;
      diff = diff.concat(value);
    }
  });

  return diff;
};

export default (dataBefore, dataAfter, structure) => {
  const diff = plain(dataBefore, dataAfter, structure);
  return diff;
};
