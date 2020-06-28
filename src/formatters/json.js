import _ from 'lodash';

const getValue = (data) => {
  const convertToString = (obj) => Object.entries(obj).flatMap(([key, value]) => `"${key}":${getValue(value)}`);

  if (_.isObject(data)) {
    return `{${convertToString(data)}}`;
  }
  return _.isString(data) ? `"${data}"` : data;
};

const json = (structure) => structure
  .flatMap(({
    key,
    status,
    children,
    beforeValue,
    afterValue,
  }, i, arr) => {
    const lastSymbol = arr.length - 1 === i ? '' : ',';
    if (children.length > 0) {
      return [`"${key}":{`, json(children), '}', lastSymbol];
    }

    const beforeTextValue = getValue(beforeValue);
    const afterTextValue = getValue(afterValue);

    switch (status) {
      case 'deleted':
        return [`"${key}":{`, '"status":"deleted",', `"oldValue":${beforeTextValue}}`, lastSymbol];
      case 'added':
        return [`"${key}":{`, '"status":"added",', `"newValue":${afterTextValue}}`, lastSymbol];
      case 'modified':
        return [`"${key}":{`, '"status":"changed",', `"oldValue":${beforeTextValue},`, `"newValue":${afterTextValue}}`, lastSymbol];
      case 'unmodified':
        return [];
      default:
        return [];
    }
  }).join('');

export default (structure) => {
  const diff = json(structure);
  return `{${diff}}`;
};
