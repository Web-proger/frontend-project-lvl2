import stylish from './stylish';
import plain from './plain';
import json from './json';

export default (format) => {
  switch (format) {
    case 'stylish':
      return stylish;
    case 'plain':
      return plain;
    case 'json':
      return json;
    default:
      throw new Error(`Unknown format "${format}", specify one of the formats: "stylish", "plain", "json".`);
  }
};
