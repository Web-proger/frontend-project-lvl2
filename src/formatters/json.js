import _ from 'lodash';

// Получаем отображение элементов, которые уже не нужно сравнивать
function convertToString(obj) {
  const string = Object.keys(obj)
    .flatMap((key) => {
      const value = obj[key];
      const stringValue = getValue(value);
      return [`"${key}":${stringValue}`];
    });

  return ['{', string, '}'].join('');
}

function getValue(value) {
  if (_.isObject(value)) {
    return convertToString(value);
  }
  if (_.isString(value)) {
    return `"${value}"`;
  }
  return value;
}

// Формируем строку для визуального отображения diff
const json = (structure) => structure
  .flatMap(({
    key,
    available,
    equal,
    children,
    beforeValue,
    afterValue,
  }, i, arr) => {
    if (children.length > 0) {
      return [`"${key}":{`, json(children), '}'];
    }

    const lastSymbol = arr.length - 1 === i ? '' : ',';

    const beforeTextValue = getValue(beforeValue);
    const afterTextValue = getValue(afterValue);

    switch (available) {
      case 'before':
        return [`"${key}":{`, '"status":"deleted",', `"oldValue":${beforeTextValue}}`, lastSymbol];
      case 'after':
        return [`"${key}":{`, '"status":"added",', `"newValue":${afterTextValue}}`, lastSymbol];
      case 'both':
        return (equal === false) ? [`"${key}":{`, '"status":"changed",', `"oldValue":${beforeTextValue},`, `"newValue":${afterTextValue}}`, lastSymbol] : [];
      default:
        return [];
    }
  }).join('');

export default (structure) => {
  const diff = json(structure);
  return `{${diff}}`;
};
