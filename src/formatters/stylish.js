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

const stylish = (structure, depth) => structure
  .flatMap(({
    key,
    available,
    equal,
    children,
    beforeValue,
    afterValue,
  }) => {
    const indent = getIndent(depth);
    const beforeTextValue = getValue(beforeValue, depth + 1);
    const afterTextValue = getValue(afterValue, depth + 1);

    if (children.length > 0) {
      return [`${indent}    ${key}: {`, stylish(children, depth + 1), `${indent}    }`];
    }

    switch (available) {
      case 'before':
        return [`${indent}  - ${key}: ${beforeTextValue}`];
      case 'after':
        return [`${indent}  + ${key}: ${afterTextValue}`];
      case 'both':
        if (equal === true) {
          return [`${indent}    ${key}: ${beforeValue}`];
        }
        return [`${indent}  - ${key}: ${beforeTextValue}`, `${indent}  + ${key}: ${afterTextValue}`];
      default:
        return [];
    }
  }).join('\n');


export default (structure) => {
  const diff = stylish(structure, 0);
  return `{\n${diff}\n}`;
};
