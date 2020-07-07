import getStylishView from './stylish';
import getPlainView from './plain';
import getJsonView from './json';

export default (format) => {
  switch (format) {
    case 'stylish':
      return getStylishView;
    case 'plain':
      return getPlainView;
    case 'json':
      return getJsonView;
    default:
      throw new Error(`Unknown format "${format}", specify one of the formats: "stylish", "plain", "json".`);
  }
};
