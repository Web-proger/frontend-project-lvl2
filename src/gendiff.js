import _ from 'lodash';

export default (dataBefore, dataAfter) => {
  let diff = '';

  const keys = new Set([...Object.keys(dataBefore), ...Object.keys(dataAfter)]);

  keys.forEach((key) => {
    const isBefore = _.has(dataBefore, key);
    const isAfter = _.has(dataAfter, key);
    const beforeValue = dataBefore[key];
    const afterValue = dataAfter[key];

    if (isBefore && isAfter) {
      if (beforeValue === afterValue) {
        diff = diff.concat(`  ${key}: ${beforeValue}\n`);
      } else {
        diff = diff.concat(`- ${key}: ${beforeValue}\n+ ${key}: ${afterValue}\n`);
      }
    } else if (isBefore) {
      diff = diff.concat(`- ${key}: ${beforeValue}\n`);
    } else {
      diff = diff.concat(`+ ${key}: ${afterValue}\n`);
    }
  });

  return diff;
};
