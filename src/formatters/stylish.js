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
    type,
    status,
    children,
    nodeBefore,
    nodeAfter,
  }) => {
    const indent = getIndent(depth);

    if (children) {
      return [`${indent}    ${key}: {`, stylish(children, depth + 1), `${indent}    }`];
    }

    const beforeTextValue = getValue(nodeBefore.value, depth + 1);
    const afterTextValue = getValue(nodeAfter.value, depth + 1);

    switch (status) {
      case 'deleted':
        return [`${indent}  - ${key}: ${beforeTextValue}`];
      case 'added':
        return [`${indent}  + ${key}: ${afterTextValue}`];
      case 'modified':
        return [`${indent}  - ${key}: ${beforeTextValue}`, `${indent}  + ${key}: ${afterTextValue}`];
      case 'unmodified':
        return [`${indent}    ${key}: ${nodeBefore.value}`];
      default:
        throw new Error(`Unknown status "${status}"`);
    }
  }).join('\n');


export default (structure) => {
  const diff = stylish(structure, 0);
  return `{\n${diff}\n}`;
};
