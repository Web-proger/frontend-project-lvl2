#!/usr/bin/env node
import { program } from 'commander';
import path from 'path';
import fs from 'fs';
import genDiff from './gendiff';
import parsers from './parsers';

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'stylish')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    const catalog = process.cwd();
    const path1 = path.isAbsolute(firstConfig) ? firstConfig : path.join(catalog, firstConfig);
    const path2 = path.isAbsolute(secondConfig) ? secondConfig : path.join(catalog, secondConfig);

    const dataBefore = parsers(fs.readFileSync(path1, 'utf8'), path.extname(path1));
    const dataAfter = parsers(fs.readFileSync(path2, 'utf8'), path.extname(path2));

    const diff = genDiff(dataBefore, dataAfter, program.format);

    console.log(diff);
  });

program.parse(process.argv);
