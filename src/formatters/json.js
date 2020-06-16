import _ from 'lodash';

const getValue = (value) => (typeof value === 'object' ? { ...value } : value);

const json = (dataBefore, dataAfter, structure, keys = []) => structure
  .reduce((acc, [keyName, available, equal, children]) => {
    const beforeValue = dataBefore[keyName];
    const afterValue = dataAfter[keyName];
    const path = [...keys, keyName];

    const setData = (status, oldValue, newValue) => {
      _.set(acc, path, {
        status,
        oldValue,
        newValue,
      });
    };

    if (available === 'before') {
      setData('deleted', getValue(beforeValue), null);
    }

    if (available === 'after') {
      setData('added', null, getValue(afterValue));
    }

    if (available === 'both' && equal === false) {
      setData('changed', getValue(beforeValue), getValue(afterValue));
    }

    if (children.length > 0) {
      const obj = json(beforeValue, afterValue, children, keys);
      _.set(acc, path, obj);
    }

    return acc;
  }, {});

export default (bef, aft, str) => {
  const diff = json(bef, aft, str);
  return JSON.stringify(diff);
};
