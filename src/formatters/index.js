import stylish from './stylish';
import plain from './plain';

export default (dataBefore, dataAfter, structure, format) => {
  if (format === 'stylish') {
    return stylish(dataBefore, dataAfter, structure);
  }
  if (format === 'plain') {
    return plain(dataBefore, dataAfter, structure);
  }
  return `неизвестный формат "${format}"`;
};
