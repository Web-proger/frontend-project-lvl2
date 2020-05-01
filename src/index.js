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

const content1 = JSON.parse(fs.readFileSync(path1));
const content2 = JSON.parse(fs.readFileSync(path2));

console.log(content1, content2);
