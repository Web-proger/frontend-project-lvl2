#!/usr/bin/env node
import { program } from 'commander';
import path from 'path';
import fs from 'fs';
import _ from 'lodash';

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

const before = JSON.parse(fs.readFileSync(path1, 'utf8'));
const after = JSON.parse(fs.readFileSync(path2, 'utf8'));

let diff = '';

const keys = new Set([...Object.keys(before), ...Object.keys(after)]);

for (const key of keys) {
  const isBefore = _.has(before, key);
  const isAfter = _.has(after, key);
  const beforeValue = before[key];
  const afterValue = after[key];

  if (isBefore && isAfter) {
    if (beforeValue === afterValue) {
      diff = diff.concat(`  ${key}: ${beforeValue}\n`);
    } else {
      diff = diff.concat(`- ${key}: ${beforeValue}\n+ ${key}: ${afterValue}\n`);
    }
  } else {
    if (isBefore) {
      diff = diff.concat(`- ${key}: ${beforeValue}\n`);
    } else {
      diff = diff.concat(`+ ${key}: ${afterValue}\n`);
    }
  }
}

console.log(diff);
