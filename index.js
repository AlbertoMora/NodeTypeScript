#!/usr/bin/env node
const spawn = require('cross-spawn');
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const projectName = process.argv[2] || 'template-project';

const currentDir = process.cwd();
const projectDir = path.resolve(currentDir, projectName);

const allDependencies = ['dotenv', 'cors'];
const allDevDependencies = ['typescript', 'ts-node', 'ts-loader', 'copyfiles', 'nodemon'];

const install = () => {
    let command = 'npm';
    const args = ['install', '--no-audit', '--save', '--save-exact', '--loglevel', 'error'].concat(allDependencies);
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('close', code => {
        if (code !== 0) {
            console.log('Dependecies installation failed. Please retry the installation manually');
        } else {
            console.log('Dependencies installed successfully');
            const devArgs = ['install', '--no-audit', '--dev', '--loglevel', 'error'].concat(allDevDependencies);
            const child2 = spawn(command, devArgs, { stdio: 'inherit' });
            child2.on('close', code => {
                if (code !== 0) {
                    console.log('Dev dependecies installation failed. Please retry the installation manually');
                } else {
                    console.log(colors.blue('Dev dependencies installed successfully'));
                    console.log('====================================');
                    console.log(colors.blue('Project has been templated successfully'));
                    console.log('====================================');
                }
            });
        }
    });
};

const init = () => {
    console.log(`Creating NodeJS TypeScript project in ${colors.green(projectDir)}`);
    fs.mkdirSync(projectDir, { recursive: true });

    const templateDir = path.resolve(__dirname, 'template');
    fs.cpSync(templateDir, projectDir, { recursive: true });
    fs.renameSync(path.join(projectDir, 'gitignore'), path.join(projectDir, '.gitignore'));

    process.chdir(projectDir);

    console.log(colors.blue('Directory created successfully.'));
    install();
};

init();
