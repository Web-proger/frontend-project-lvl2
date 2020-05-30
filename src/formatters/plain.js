const getValue = (value) => (typeof value === 'object' ? '[complex value]' : value);

const plain = (before, after, structure, name = []) => {
  const keys = Object.keys(structure).sort();

  const diff = keys.reduce((acc, key) => {
    const { available, equal } = structure[key];
    const beforeVal = before[key];
    const afterVal = after[key];
    const path = name.slice();
    path.push(key);
    const pathStr = `'${path.join('.')}'`;

    if (available === 'before') {
      return acc.concat(`Property ${pathStr} was deleted\n`);
    }

    if (available === 'after') {
      return acc.concat(`Property ${pathStr} was added with value: ${getValue(afterVal)}\n`);
    }

    if (available === 'both' && !equal) {
      return acc.concat(`Property ${pathStr} was changed from: ${getValue(beforeVal)} to ${getValue(afterVal)}\n`);
    }

    if (!available && !equal) {
      return acc.concat(`${plain(beforeVal, afterVal, structure[key], path)}\n`);
    }
    return acc;
  }, '');

  return diff.trim();
};

export default (dataBefore, dataAfter, structure) => plain(dataBefore, dataAfter, structure);
