import _ from 'lodash';

const getValue = (value) => (_.isObject(value) ? '[complex value]' : value);

export default (structure) => {
  const iter = (innerStructure, keys) => innerStructure
    .flatMap(({
      key,
      type,
      children,
      beforeValue,
      afterValue,
    }) => {
      const pathParts = [...keys, key];
      const path = `'${pathParts.join('.')}'`;

      switch (type) {
        case 'withSubstructure':
          return `${iter(children, pathParts)}`;
        case 'deleted':
          return `Property ${path} was deleted`;
        case 'added':
          return `Property ${path} was added with value: ${getValue(afterValue)}`;
        case 'modified':
          return `Property ${path} was changed from: ${getValue(beforeValue)} to ${getValue(afterValue)}`;
        case 'unmodified':
          return [];
        default:
          throw new Error(`Unknown status "${type}"`);
      }
    }).join('\n');

  return iter(structure, []);
};
