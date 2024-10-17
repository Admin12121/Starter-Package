#!/usr/bin/env node

import { program } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import path from 'path';
import inquirer from 'inquirer';
import simpleGit from 'simple-git'; // For handling git operations
import fs from 'fs-extra'; // For file system operations

// Define available templates with their subdirectory paths
const templates = {
  next: 'package/next-package',
  react: 'package/react-package',
};

// Define CLI options using Commander
program
  .version('1.0.0')
  .description('CLI to create projects with various starter templates')
  .option('-n, --name <name>', 'Name of the project')
  .option('-t, --template <template>', 'Template to use');

program.parse(process.argv);
const options = program.opts();

// Prompt user for input if necessary
const promptUser = async () => {
  const questions = [];

  // If project name isn't provided, ask for it
  if (!options.name) {
    questions.push({
      type: 'input',
      name: 'name',
      message: 'What is your project name?',
      default: 'my-project',
    });
  }

  // If template isn't provided, ask the user to choose one
  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Choose a project template:',
      choices: Object.keys(templates),
    });
  }

  const answers = await inquirer.prompt(questions);

  // Combine provided options with answers from the prompt
  return {
    name: options.name || answers.name,
    template: options.template || answers.template,
  };
};

// Clone the selected template using simple-git
const cloneTemplate = async (repoUrl, branch, dest, subPath) => {
  const git = simpleGit();
  const spinner = ora('Setting up your project...').start();

  try {
    const tempDir = path.join(dest, 'temp-repo');

    // Clone the entire repository into a temporary directory
    await git.clone(repoUrl, tempDir, ['--branch', branch, '--depth', '1']);

    const subDirPath = path.join(tempDir, subPath);

    // Check if the subdirectory exists
    if (fs.existsSync(subDirPath)) {
      // Move the subdirectory to the destination and remove the temp repo
      await fs.copy(subDirPath, dest, { overwrite: true });
      await fs.remove(tempDir); // Remove temp directory
      spinner.succeed(chalk.green('Project created successfully'));
      console.log(chalk.yellow(`cd ${dest} && npm install`));
    } else {
      throw new Error(`Subdirectory ${subPath} not found in the repository.`);
    }
  } catch (error) {
    spinner.fail(chalk.red('Failed to set up the project'));
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
};

// Main function to run the CLI
const run = async () => {
  const { name, template } = await promptUser();

  // Repository URL (assumed to be the same for all templates)
  const repoUrl = 'https://github.com/Admin12121/Starter-Package.git';
  const branch = 'main'; // Assuming 'main' is the default branch
  const subPath = templates[template]; // Subdirectory for the selected template
  const dest = path.resolve(process.cwd(), name); // Destination directory for the new project

  // Clone the template into the destination folder
  await cloneTemplate(repoUrl, branch, dest, subPath);
};

run();
