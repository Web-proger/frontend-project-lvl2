const getValue = (value) => (typeof value === 'object' ? '[complex value]' : value);

const plain = (before, after, structure, name = []) => {
  const diff = structure.reduce((acc, item) => {
    const [keyName, available, equal, children] = item;
    const beforeVal = before[keyName];
    const afterVal = after[keyName];
    const path = [...name, keyName];
    const pathStr = `'${path.join('.')}'`;

    if (children.length > 0) {
      return acc.concat(`${plain(beforeVal, afterVal, children, path)}\n`);
    }

    switch (available) {
      case 'before':
        return acc.concat(`Property ${pathStr} was deleted\n`);
      case 'after':
        return acc.concat(`Property ${pathStr} was added with value: ${getValue(afterVal)}\n`);
      case 'both':
        return (equal === false) ? acc.concat(`Property ${pathStr} was changed from: ${getValue(beforeVal)} to ${getValue(afterVal)}\n`) : acc;
      default:
        return acc;
    }
  }, '');

  return diff.trim();
};

export default (dataBefore, dataAfter, structure) => plain(dataBefore, dataAfter, structure);
