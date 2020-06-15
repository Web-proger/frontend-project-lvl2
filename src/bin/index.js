#!/usr/bin/env node
import { program } from 'commander';
import genDiff from '..';

program
  .version('0.0.5')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'stylish')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    try {
      const diff = genDiff(firstConfig, secondConfig, program.format);
      console.log(diff);
    } catch (e) {
      console.log(e.message);
    }
  });

program.parse(process.argv);