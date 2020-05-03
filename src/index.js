#!/usr/bin/env node
import { program } from 'commander';
import path from 'path';
import fs from 'fs';

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .arguments('<firstConfig> <secondConfig>');

program.parse(process.argv);

const currentPath = process.cwd();
const [, , file1, file2] = process.argv;
const path1 = path.join(currentPath, file1);
const path2 = path.join(currentPath, file2);

const obj1 = JSON.parse(fs.readFileSync(path1, 'utf8'));
const obj2 = JSON.parse(fs.readFileSync(path2, 'utf8'));

const keys1 = Object.keys(obj1);
const keys2 = Object.keys(obj2);

let diff = '';

for (const key of keys1) {
  const isAfter = keys2.includes(key);
  const beforeValue = obj1[key];
  const afterValue = obj2[key];

  if (isAfter) {
    if (beforeValue === afterValue) {
      diff = diff.concat(`  ${key}: ${beforeValue}\n`);
    } else {
      diff = diff.concat(`- ${key}: ${beforeValue}\n+ ${key}: ${afterValue}\n`);
    }
  } else {
    diff = diff.concat(`- ${key}: ${beforeValue}\n`);
  }
}

for (const key of keys2) {
  if (keys1.includes(key) === false) {
    diff = diff.concat(`+ ${key}: ${obj2[key]}\n`);
  }
}

console.log(diff);
