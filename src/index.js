#!/usr/bin/env node
import { program } from 'commander';
import path from 'path';
import genDiff from './gendiff';

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .arguments('<firstConfig> <secondConfig>');

program.parse(process.argv);

const currentPath = process.cwd();
const [, , file1, file2] = process.argv;
const path1 = path.isAbsolute(file1) ? file1 : path.join(currentPath, file1);
const path2 = path.isAbsolute(file2) ? file2 : path.join(currentPath, file2);

const diff = genDiff(path1, path2);

console.log(diff);
