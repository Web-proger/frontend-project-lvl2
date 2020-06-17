import _ from 'lodash';

const getValue = (value) => (_.isObject(value) ? '[complex value]' : value);

const plain = (beforeData, afterData, structure, keys = []) => {
  const diff = structure.reduce((acc, [keyName, available, equal, children]) => {
    const beforeValue = beforeData[keyName];
    const afterValue = afterData[keyName];
    // Массив ключей до текущего объекта
    const path = [...keys, keyName];
    // Строковое представление пути к текущему объекту
    const pathStr = `'${path.join('.')}'`;

    if (children.length > 0) {
      return acc.concat(`${plain(beforeValue, afterValue, children, path)}\n`);
    }

    switch (available) {
      case 'before':
        return acc.concat(`Property ${pathStr} was deleted\n`);
      case 'after':
        return acc.concat(`Property ${pathStr} was added with value: ${getValue(afterValue)}\n`);
      case 'both':
        return (equal === false) ? acc.concat(`Property ${pathStr} was changed from: ${getValue(beforeValue)} to ${getValue(afterValue)}\n`) : acc;
      default:
        return acc;
    }
  }, '');

  return diff.trim();
};

export default plain;
