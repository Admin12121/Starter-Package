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


// #!/usr/bin/env node

// import { program } from 'commander';
// import { execSync } from 'child_process';
// import fs from 'fs-extra';
// import path from 'path';
// import ora from 'ora';
// import chalk from 'chalk';
// import inquirer from 'inquirer';
// import fetch from 'node-fetch';

// // Define CLI options using Commander
// program
//   .version('1.0.0')
//   .description('CLI to create a Next.js app with custom setup')
//   .option('-n, --name <name>', 'Name of the project', 'my-next-app');

// program.parse(process.argv);
// const options = program.opts();

// // Function to run shell commands
// const runCommand = (command) => {
//   try {
//     execSync(command, { stdio: 'inherit' });
//   } catch (error) {
//     console.error(`Error executing command: ${command}`, error);
//     process.exit(1);
//   }
// };

// // Function to download a file from a URL
// const downloadFile = async (url, dest) => {
//   const res = await fetch(url);
//   if (!res.ok) throw new Error(`Failed to fetch ${url}`);
//   const fileStream = fs.createWriteStream(dest);
//   await new Promise((resolve, reject) => {
//     res.body.pipe(fileStream);
//     res.body.on('error', reject);
//     fileStream.on('finish', resolve);
//   });
// };

// // Function to download and set up files from GitHub
// const setupFiles = async (baseUrl, dest, useSrc) => {
//   const folders = ['components', 'lib', 'constants', 'icons', 'schemas', 'hooks'];
//   for (const folder of folders) {
//     const folderPath = useSrc ? path.join(dest, 'src', folder) : path.join(dest, folder);
//     fs.ensureDirSync(folderPath);
//     // Assuming you have a way to list files in the folder, e.g., an API or a predefined list
//     const files = ['file1.tsx', 'file2.tsx']; // Replace with actual file names
//     for (const file of files) {
//       const fileUrl = `${baseUrl}/${folder}/${file}`;
//       const fileDest = path.join(folderPath, file);
//       await downloadFile(fileUrl, fileDest);
//     }
//   }
// };

// // Main function to run the CLI
// const run = async () => {
//   const { name } = options;
//   const { template, useSrc } = await inquirer.prompt([
//     {
//       type: 'list',
//       name: 'template',
//       message: 'Choose a project template:',
//       choices: ['next', 'react'],
//     },
//     {
//       type: 'confirm',
//       name: 'useSrc',
//       message: 'Do you want to use a src directory?',
//       default: true,
//     },
//   ]);

//   if (template === 'react') {
//     console.log(chalk.yellow('React setup is not implemented yet.'));
//     return;
//   }

//   const spinner = ora('Creating Next.js app...').start();

//   try {
//     // Step 1: Create a new Next.js app
//     runCommand(`npx create-next-app@latest ${name}`);

//     // Step 2: Change directory to the new app
//     const appPath = path.resolve(process.cwd(), name);
//     process.chdir(appPath);

//     // Step 3: Download and set up files
//     const baseUrl = 'https://raw.githubusercontent.com/Admin12121/Starter-Package/main/package/next-package/src';
//     await setupFiles(baseUrl, appPath, useSrc);

//     spinner.succeed(chalk.green('Next.js app created and customized successfully'));
//   } catch (error) {
//     spinner.fail(chalk.red('Failed to create and customize the Next.js app'));
//     console.error(chalk.red(`Error: ${error.message}`));
//     process.exit(1);
//   }
// };

// run();