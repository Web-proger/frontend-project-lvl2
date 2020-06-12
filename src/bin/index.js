#!/usr/bin/env node
import { program } from 'commander';
import genDiff from '../gendiff';

program
  .version('0.0.5')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'stylish')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    const diff = genDiff(firstConfig, secondConfig, program.format);
    console.log(diff);
  });

program.parse(process.argv);
