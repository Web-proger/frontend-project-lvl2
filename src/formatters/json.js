import _ from 'lodash';

const getValue = (value) => (typeof value === 'object' ? { ...value } : value);

const json = (dataBefore, dataAfter, structure, name = []) => structure
  .reduce((acc, item) => {
    const [keyName, available, equal, children] = item;
    const beforeVal = dataBefore[keyName];
    const afterVal = dataAfter[keyName];
    const path = [...name, keyName];

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

    if (children.length > 0) {
      const obj = json(beforeVal, afterVal, children, name);
      _.set(acc, path, obj);
    }

    return acc;
  }, {});

export default (bef, aft, str) => {
  const diff = json(bef, aft, str);
  return JSON.stringify(diff);
};
