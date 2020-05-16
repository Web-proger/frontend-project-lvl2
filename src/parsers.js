import yaml from 'js-yaml';
import ini from 'ini';

export default (data, ext) => {
  if (ext === '.yml') {
    return yaml.safeLoad(data);
  }

  if (ext === '.ini') {
    return ini.parse(data);
  }

  return JSON.parse(data);
};