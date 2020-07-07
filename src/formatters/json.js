import _ from 'lodash';

const getJson = (structure, name = []) => structure
  .reduce((acc, {
    key,
    type,
    children,
    beforeValue,
    afterValue,
  }) => {
    const newAcc = _.cloneDeep(acc);
    const path = [...name, key];
    switch (type) {
      case 'withSubstructure':
        return _.set(newAcc, path, getJson(children));
      case 'deleted':
        return _.set(newAcc, path, {
          status: 'deleted',
          oldValue: beforeValue,
        });
      case 'added':
        return _.set(newAcc, path, {
          status: 'added',
          newValue: afterValue,
        });
      case 'modified':
        return _.set(newAcc, path, {
          status: 'changed',
          oldValue: beforeValue,
          newValue: afterValue,
        });
      case 'unmodified':
        return acc;
      default:
        throw new Error(`Unknown status "${type}"`);
    }
  }, {});

export default (structure) => {
  const diff = getJson(structure);
  return JSON.stringify(diff);
};
