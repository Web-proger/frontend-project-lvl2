const isObject = (obj) => typeof obj === 'object';
const getValue = (value) => (isObject(value) ? '[complex value]' : value);

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
    let value = '';

    if (available === 'before') {
      value = `Property ${pathStr} was deleted\n`;
    }

    if (available === 'after') {
      value = `Property ${pathStr} was added with value: ${getValue(afterVal)}\n`;
    }

    if (available === 'both' && !equal) {
      value = `Property ${pathStr} was changed from: ${getValue(beforeVal)} to ${getValue(afterVal)}\n`;
    }

    if (!available && !equal) {
      value = `${plain(beforeVal, afterVal, structure[key], path)}\n`;
    }

    diff = diff.concat(value);
  });

  return diff.trim();
};

export default (dataBefore, dataAfter, structure) => plain(dataBefore, dataAfter, structure);
