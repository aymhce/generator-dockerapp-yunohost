'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    this.log(yosay(
      'Welcome to the wondrous ' + chalk.red('generator-dockerapp-yunohost') + ' generator!'
    ));

    const prompts = [{
      type: 'input',
      name: 'beautifulName',
      message: 'Your Yunohost App name ?',
      default: this.appname
    }, {
      type: 'input',
      name: 'defaultPathOption',
      message: 'Active context path option (like "/mypath") - can be empty ?',
      default: ''
    }, {
      type: 'confirm',
      name: 'forceSecureAccess',
      message: 'Active secure access by default ?',
      default: true
    }, {
      type: 'confirm',
      name: 'secureAccessOption',
      message: 'Active secure access option (public access or yunohost auth) ?',
      default: false
    }, {
      type: 'confirm',
      name: 'adminUserOption',
      message: 'Active admin user option (admin app access for user) ?',
      default: false
    }, {
      type: 'input',
      name: 'enDescription',
      message: 'English description ?',
      default: ''
    }, {
      type: 'input',
      name: 'frDescription',
      message: 'Description en francais',
      default: ''
    }, {
      type: 'input',
      name: 'urlApp',
      message: 'App original url creators ?',
      default: ''
    }, {
      type: 'input',
      name: 'urlDockerHub',
      message: 'DockerHub image url ?',
      default: ''
    }, {
      type: 'input',
      name: 'authorName',
      message: 'Your name ?',
      default: this.user.git.name()
    }, {
      type: 'input',
      name: 'authorEmail',
      message: 'Your email ?',
      default: this.user.git.email()
    }];

    if (this.config.getAll() && Object.keys(this.config.getAll()).length) {
      this.props = this.config.getAll();
      return this.props;
    }
    return this.prompt(prompts).then(props => {
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
    if (!this.fs.exists(this.destinationPath('scripts/docker/run.sh'))) {
      this.fs.copyTpl(this.templatePath('scripts/docker/run.sh'), this.destinationPath('scripts/docker/run.sh'), this.props);
    }
    this.fs.copyTpl(this.templatePath('conf/nginx.conf'), this.destinationPath('conf/nginx.conf'), this.props);
    if (!this.fs.exists(this.destinationPath('scripts/docker/rm.sh'))) {
      this.fs.copyTpl(this.templatePath('scripts/docker/rm.sh'), this.destinationPath('scripts/docker/rm.sh'), this.props);
    }
    if (!this.fs.exists(this.destinationPath('scripts/docker/docker-compose.yml'))) {
      this.fs.copyTpl(this.templatePath('scripts/docker/docker-compose.yml'), this.destinationPath('scripts/docker/docker-compose.yml'), this.props);
    }
    if (!this.fs.exists(this.destinationPath('scripts/docker/_specificvariablesapp.sh'))) {
      this.fs.copyTpl(this.templatePath('scripts/docker/_specificvariablesapp.sh'), this.destinationPath('scripts/docker/_specificvariablesapp.sh'), this.props);
    }
    this.fs.copyTpl(this.templatePath('conf/app/.gitkeep'), this.destinationPath('conf/app/.gitkeep'), this.props);
    this.fs.copyTpl(this.templatePath('manifest.json'), this.destinationPath('manifest.json'), this.props);
    this.fs.copyTpl(this.templatePath('scripts/upgrade'), this.destinationPath('scripts/upgrade'), this.props);
    this.fs.copyTpl(this.templatePath('scripts/_common.sh'), this.destinationPath('scripts/_common.sh'), this.props);
    this.fs.copyTpl(this.templatePath('scripts/_dockertest.sh'), this.destinationPath('scripts/_dockertest.sh'), this.props);
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
    this.log('Please fill up "scripts/docker/run.sh" and "scripts/docker/rm.sh", as you want there is "scripts/docker/docker-compose.yml" and "scripts/docker/_specificvariablesapp.sh". Also, place your app config in conf/app, will be copied in /home/yunohost.docker/{appname}');
  }
};
