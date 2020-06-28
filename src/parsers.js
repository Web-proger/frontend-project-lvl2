import yaml from 'js-yaml';
import ini from 'ini';

export default (data, type) => {
  switch (type) {
    case 'yml':
      return yaml.safeLoad(data);
    case 'ini':
      return ini.parse(data);
    case 'json':
      return JSON.parse(data);
    default:
      throw new Error(`Unknown data format "${type}"`);
  }
};
