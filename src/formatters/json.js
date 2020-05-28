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

    const getValue = (value) => (isObject(value) ? Object.assign(value) : value);

    const setData = (status, oldValue, newValue) => {
      _.set(acc, path, {
        status,
        oldValue,
        newValue,
      });
    };

    if (available === 'before') {
      setData('deleted', getValue(beforeVal), null);
    }

    if (available === 'after') {
      setData('added', null, getValue(afterVal));
    }

    if (available === 'both' && equal === false) {
      setData('changed', getValue(beforeVal), getValue(afterVal));
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
