import _ from 'lodash';

const getValue = (value) => (_.isObject(value) ? '[complex value]' : value);

const plain = (structure) => {
  const iter = (innerStructure, keys) => innerStructure
    .flatMap(({
      key,
      status,
      children,
      beforeValue,
      afterValue,
    }) => {
      const pathParts = [...keys, key];
      const path = `'${pathParts.join('.')}'`;

      if (children.length > 0) {
        return `${iter(children, pathParts)}`;
      }

      switch (status) {
        case 'deleted':
          return `Property ${path} was deleted`;
        case 'added':
          return `Property ${path} was added with value: ${getValue(afterValue)}`;
        case 'modified':
          return `Property ${path} was changed from: ${getValue(beforeValue)} to ${getValue(afterValue)}`;
        default:
          return [];
      }
    }).join('\n');

  return iter(structure, []);
};

export default plain;
