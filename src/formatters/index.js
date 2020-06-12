import stylish from './stylish';
import plain from './plain';
import json from './json';

export default (dataBefore, dataAfter, structure, format) => {
  if (format === 'stylish') {
    return stylish(dataBefore, dataAfter, structure);
  }
  if (format === 'plain') {
    return plain(dataBefore, dataAfter, structure);
  }
  if (format === 'json') {
    return json(dataBefore, dataAfter, structure);
  }
  return `Unknown format "${format}", specify one of the formats: "stylish", "plain", "json".`;
};
