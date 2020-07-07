import _ from 'lodash';

const getValue = (value) => (_.isObject(value) ? '[complex value]' : value);

const plain = (structure) => {
  const iter = (innerStructure, keys) => innerStructure
    .flatMap(({
      key,
      type,
      status,
      children,
      nodeBefore,
      nodeAfter,
    }) => {
      const pathParts = [...keys, key];
      const path = `'${pathParts.join('.')}'`;

      if (children) {
        return `${iter(children, pathParts)}`;
      }

      switch (status) {
        case 'deleted':
          return `Property ${path} was deleted`;
        case 'added':
          return `Property ${path} was added with value: ${getValue(nodeAfter.value)}`;
        case 'modified':
          return `Property ${path} was changed from: ${getValue(nodeBefore.value)} to ${getValue(nodeAfter.value)}`;
        case 'unmodified':
          return [];
        default:
          throw new Error(`Unknown status "${status}"`);
      }
    }).join('\n');

  return iter(structure, []);
};

export default plain;
