import _ from 'lodash';

const getValue = (value) => (_.isObject(value) ? '[complex value]' : value);

const plain = (structure, keys = []) => structure
  .flatMap(({
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
      return `${plain(children, pathParts)}`;
    }

    switch (available) {
      case 'before':
        return `Property ${path} was deleted`;
      case 'after':
        return `Property ${path} was added with value: ${getValue(afterValue)}`;
      case 'both':
        return (equal === false) ? `Property ${path} was changed from: ${getValue(beforeValue)} to ${getValue(afterValue)}` : [];
      default:
        return [];
    }
  }).join('\n');


export default plain;
