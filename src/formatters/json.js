import _ from 'lodash';

const getValue = (value) => (_.isObject(value) ? { ...value } : value);

const json = (structure, keys = []) => structure
  .reduce((acc, {
    key,
    available,
    equal,
    children,
    beforeValue,
    afterValue,
  }) => {
    const path = [...keys, key];

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
      const obj = json(children, keys);
      _.set(acc, path, obj);
    }

    return acc;
  }, {});

export default (structure) => {
  const diff = json(structure);
  return JSON.stringify(diff);
};
