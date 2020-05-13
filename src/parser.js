import yaml from 'js-yaml';

export default (data, ext) => {

  if (ext === '.yml') {
    return yaml.safeLoad(data)
  }

  return JSON.parse(data);
};
