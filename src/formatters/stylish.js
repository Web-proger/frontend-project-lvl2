import _ from 'lodash';

const getIndent = (size) => '    '.repeat(size);

const convertToString = (obj, depth) => {
  const indent = getIndent(depth);

  const string = Object.entries(obj).flatMap(([key, value]) => {
    const stringValue = _.isObject(value) ? convertToString(value, depth + 1) : value;
    return `${indent}    ${key}: ${stringValue}`;
  });

  return ['{', string, `${indent}}`].join('\n');
};

const getValue = (value, depth) => (_.isObject(value) ? convertToString(value, depth) : value);

export default (structure) => {
  const iter = (innerStructure, depth) => innerStructure
    .flatMap(({
      key,
      type,
      children,
      beforeValue,
      afterValue,
    }) => {
      const indent = getIndent(depth);
      const beforeTextValue = getValue(beforeValue, depth + 1);
      const afterTextValue = getValue(afterValue, depth + 1);

      switch (type) {
        case 'withSubstructure':
          return [
            `${indent}    ${key}: {`,
            iter(children, depth + 1),
            `${indent}    }`,
          ];
        case 'deleted':
          return `${indent}  - ${key}: ${beforeTextValue}`;
        case 'added':
          return `${indent}  + ${key}: ${afterTextValue}`;
        case 'modified':
          return [
            `${indent}  - ${key}: ${beforeTextValue}`,
            `${indent}  + ${key}: ${afterTextValue}`,
          ];
        case 'unmodified':
          return `${indent}    ${key}: ${beforeValue}`;
        default:
          throw new Error(`Unknown status "${type}"`);
      }
    }).join('\n');

  const diff = iter(structure, 0);
  return `{\n${diff}\n}`;
};
