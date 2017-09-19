'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the wondrous ' + chalk.red('generator-dockerapp-yunohost') + ' generator!'
    ));

    const prompts = [{
      type: 'input',
      name: 'beautifulName',
      message: 'Your Yunohost App name?',
      default: this.appname
    }, {
      type: 'input',
      name: 'defaultPath',
      message: 'There is a contextPath like /mypath (can be empty)?',
      default: ''
    }, {
      type: 'input',
      name: 'enDescription',
      message: 'English description?',
      default: ''
    }, {
      type: 'input',
      name: 'frDescription',
      message: 'Description en francais',
      default: ''
    }, {
      type: 'input',
      name: 'urlApp',
      message: 'App original url creators?',
      default: ''
    }, {
      type: 'input',
      name: 'authorName',
      message: 'Your name?',
      default: this.user.git.name()
    }, {
      type: 'input',
      name: 'authorEmail',
      message: 'Your email?',
      default: this.user.git.email()
    }];

    if (this.config.getAll() && Object.keys(this.config.getAll()).length) {
      this.props = this.config.getAll();
      return this.props;
    }
    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
      this.props.idName = this.props.beautifulName.toLowerCase();
      if (!this.props.enDescription) {
        this.props.enDescription = String(this.props.beautifulName) + ' App for Yunohost';
      }
      if (!this.props.frDescription) {
        this.props.frDescription = this.props.enDescription;
      }
    });
  }

  writing() {
    this.fs.copyTpl(this.templatePath('check_process'), this.destinationPath('check_process'), this.props);
    if (!this.fs.exists(this.destinationPath('scripts/docker_run'))) {
      this.fs.copyTpl(this.templatePath('scripts/docker_run'), this.destinationPath('scripts/docker_run'), this.props);
    }
    this.fs.copyTpl(this.templatePath('conf/nginx.conf'), this.destinationPath('conf/nginx.conf'), this.props);
    if (!this.fs.exists(this.destinationPath('scripts/docker_rm'))) {
      this.fs.copyTpl(this.templatePath('scripts/docker_rm'), this.destinationPath('scripts/docker_rm'), this.props);
    }
    if (!this.fs.exists(this.destinationPath('scripts/docker-compose.yml'))) {
      this.fs.copyTpl(this.templatePath('scripts/docker-compose.yml'), this.destinationPath('scripts/docker-compose.yml'), this.props);
    }
    this.fs.copyTpl(this.templatePath('manifest.json'), this.destinationPath('manifest.json'), this.props);
    this.fs.copyTpl(this.templatePath('scripts/upgrade'), this.destinationPath('scripts/upgrade'), this.props);
    this.fs.copyTpl(this.templatePath('scripts/_common'), this.destinationPath('scripts/_common'), this.props);
    this.fs.copyTpl(this.templatePath('scripts/_dockertest'), this.destinationPath('scripts/_dockertest'), this.props);
    this.fs.copyTpl(this.templatePath('scripts/install'), this.destinationPath('scripts/install'), this.props);
    this.fs.copyTpl(this.templatePath('scripts/remove'), this.destinationPath('scripts/remove'), this.props);
    this.fs.copyTpl(this.templatePath('scripts/restore'), this.destinationPath('scripts/restore'), this.props);
    this.fs.copyTpl(this.templatePath('scripts/backup'), this.destinationPath('scripts/backup'), this.props);
    if (!this.fs.exists(this.destinationPath('README.md'))) {
      this.fs.copyTpl(this.templatePath('README.md'), this.destinationPath('README.md'), this.props);
    }
    this.fs.copyTpl(this.templatePath('LICENSE'), this.destinationPath('LICENSE'), this.props);
    this.config.set(this.props);
  }

  install() {
    this.log('Please fill up "scripts/docker_run" and "scripts/docker_rm", as you want there is also "scripts/docker-compose.yml"');
  }
};
