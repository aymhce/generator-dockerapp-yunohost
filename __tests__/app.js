'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-dockerapp-yunohost:app', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({beautifulName: 'myApp', urlApp: 'http://myapp.org/'});
  });

  it('creates files', () => {
    assert.file(['manifest.json']);
    assert.file(['check_process']);
    assert.file(['conf/docker_run']);
    assert.file(['conf/nginx.conf']);
    assert.file(['conf/docker_rm']);
    assert.file(['conf/docker-compose.yml']);
    assert.file(['manifest.json']);
    assert.file(['scripts/upgrade']);
    assert.file(['scripts/_common']);
    assert.file(['scripts/_dockertest']);
    assert.file(['scripts/install']);
    assert.file(['scripts/remove']);
    assert.file(['scripts/restore']);
    assert.file(['scripts/backup']);
    assert.file(['README.md']);
    assert.file(['LICENSE']);
  });

  it('content files', () => {
    assert.fileContent('manifest.json', /myApp/);
    assert.fileContent('manifest.json', /myapp/);
    assert.fileContent('manifest.json', /http:\/\/myapp.org/);
  });
});
