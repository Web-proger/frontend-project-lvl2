import stylish from './stylish';
import plain from './plain';
import json from './json';

export default (dataBefore, dataAfter, structure, format) => {
  switch (format) {
    case 'stylish':
      return stylish(dataBefore, dataAfter, structure);
    case 'plain':
      return plain(dataBefore, dataAfter, structure);
    case 'json':
      return json(dataBefore, dataAfter, structure);
    default:
      throw new Error(`Unknown format "${format}", specify one of the formats: "stylish", "plain", "json".`);
  }
};
