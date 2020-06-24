import _ from 'lodash';

const getValue = (value) => (_.isObject(value) ? '[complex value]' : value);

const plain = (beforeData, afterData, structure, keys = []) => {
  const diff = structure
    .map(({
      key,
      available,
      equal,
      children,
    }) => {
      const beforeValue = beforeData[key];
      const afterValue = afterData[key];
      // Массив ключей до текущего объекта
      const path = [...keys, key];
      // Строковое представление пути к текущему объекту
      const pathStr = `'${path.join('.')}'`;

      if (children.length > 0) {
        return `${plain(beforeValue, afterValue, children, path)}\n`;
      }

      switch (available) {
        case 'before':
          return `Property ${pathStr} was deleted\n`;
        case 'after':
          return `Property ${pathStr} was added with value: ${getValue(afterValue)}\n`;
        case 'both':
          return (equal === false)
            ? `Property ${pathStr} was changed from: ${getValue(beforeValue)} to ${getValue(afterValue)}\n`
            : '';
        default:
          return '';
      }
    })
    .join('');

  return diff.trim();
};

export default plain;
