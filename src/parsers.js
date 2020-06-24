import yaml from 'js-yaml';
import ini from 'ini';

export default (data, type) => {
  if (type === 'yml') {
    return yaml.safeLoad(data);
  }

  if (type === 'ini') {
    return ini.parse(data);
  }

  if (type === 'json') {
    return JSON.parse(data);
  }

  throw new Error(`Unknown data format "${type}"`);
};
