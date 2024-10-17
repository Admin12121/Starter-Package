#!/usr/bin/env node

const { program } = require('commander');
const ora = require('ora');
const chalk = require('chalk');
const download = require('download-git-repo');

program
  .version('1.0.0')
  .description('CLI to create projects with various starter packages')
  .option('-n, --name <name>', 'Name of the project', 'my-project')
  .option('-t, --template <template>', 'Template to use', 'next');

program.parse(process.argv);
const options = program.opts();

const templates = {
  next: 'Admin12121/statercli/package/next-package',
  react: 'Admin12121/statercli/package/react-package',
};

const spinner = ora('Setting up your project...').start();

if (!templates[options.template]) {
  spinner.fail(chalk.red('Template not found'));
  process.exit(1);
}

download(templates[options.template], options.name, { clone: true }, (err) => {
  if (err) {
    spinner.fail(chalk.red('Failed to download repository'));
    console.error(err);
    process.exit(1);
  }
  spinner.succeed(chalk.green('Project created successfully'));
  console.log(chalk.yellow(`cd ${options.name} && npm install`));
});