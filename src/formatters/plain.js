import _ from 'lodash';

const getValue = (value) => (_.isObject(value) ? '[complex value]' : value);

const plain = (structure, keys = []) => {
  const diff = structure
    .map(({
      key,
      available,
      equal,
      children,
      beforeValue,
      afterValue,
    }) => {
      const pathParts = [...keys, key];
      const path = `'${pathParts.join('.')}'`;

      if (children.length > 0) {
        return `${plain(children, pathParts)}\n`;
      }

      switch (available) {
        case 'before':
          return `Property ${path} was deleted\n`;
        case 'after':
          return `Property ${path} was added with value: ${getValue(afterValue)}\n`;
        case 'both':
          return (equal === false) ? `Property ${path} was changed from: ${getValue(beforeValue)} to ${getValue(afterValue)}\n` : '';
        default:
          return '';
      }
    })
    .join('');

  return diff.trim();
};

export default plain;
