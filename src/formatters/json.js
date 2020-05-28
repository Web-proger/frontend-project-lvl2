import _ from 'lodash';

const isObject = (obj) => typeof obj === 'object';

const json = (dataBefore, dataAfter, structure, name = []) => {
  const keys = [...new Set([...Object.keys(dataBefore), ...Object.keys(dataAfter)])].sort();

  return keys.reduce((acc, key) => {
    const { available, equal } = structure[key];
    const beforeVal = dataBefore[key];
    const afterVal = dataAfter[key];
    const path = name.slice();
    path.push(key);

    const item = {
      status: null,
      oldValue: null,
      newValue: null,
    };

    if (available === 'before') {
      item.status = 'deleted';
      item.oldValue = isObject(beforeVal) ? Object.assign(beforeVal) : beforeVal;
      _.set(acc, path, Object.assign(item));
    }

    if (available === 'after') {
      item.status = 'added';
      item.newValue = isObject(afterVal) ? Object.assign(afterVal) : afterVal;
      _.set(acc, path, Object.assign(item));
    }

    if (available === 'both' && equal === false) {
      item.status = 'changed';
      item.oldValue = isObject(beforeVal) ? Object.assign(beforeVal) : beforeVal;
      item.newValue = isObject(afterVal) ? Object.assign(afterVal) : afterVal;
      _.set(acc, path, Object.assign(item));
    }

    if (!available && !equal) {
      const obj = json(beforeVal, afterVal, structure[key], name);
      _.set(acc, path, obj);
    }

    return acc;
  }, {});
};

export default (bef, aft, str) => {
  const diff = json(bef, aft, str);
  return JSON.stringify(diff);
};
