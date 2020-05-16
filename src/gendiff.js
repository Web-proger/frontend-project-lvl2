import _ from 'lodash';

export default (dataBefore, dataAfter) => {
  let diff = '';

  const keys = [...new Set([...Object.keys(dataBefore), ...Object.keys(dataAfter)])];

  keys.forEach((key, i) => {
    const isBefore = _.has(dataBefore, key);
    const isAfter = _.has(dataAfter, key);
    const beforeValue = dataBefore[key];
    const afterValue = dataAfter[key];
    const isLast = keys.length - 1 === i ? '' : '\n';

    if (isBefore && isAfter) {
      if (beforeValue === afterValue) {
        diff = diff.concat(`    ${key}: ${beforeValue}${isLast}`);
      } else {
        diff = diff.concat(`  - ${key}: ${beforeValue}\n  + ${key}: ${afterValue}${isLast}`);
      }
    } else if (isBefore) {
      diff = diff.concat(`  - ${key}: ${beforeValue}${isLast}`);
    } else {
      diff = diff.concat(`  + ${key}: ${afterValue}${isLast}`);
    }
  });

  return `{\n${diff}\n}`;
};
