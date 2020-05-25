import stylish from './stylish';

export default (dataBefore, dataAfter, structure, format) => {
  if (format === 'stylish') {
    return stylish(dataBefore, dataAfter, structure);
  }
  return `неизвестный формат "${format}"`;
};
