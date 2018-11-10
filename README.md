# SQL Template Engine

[![Service Status](https://david-dm.org/MitMaro/node-sql-template-engine.svg)](https://david-dm.org/MitMaro/node-sql-template-engine)
[![Build Status](https://travis-ci.org/MitMaro/node-sql-template-engine.svg?branch=master)](https://travis-ci.org/MitMaro/node-sql-template-engine)
[![Coverage Status](https://coveralls.io/repos/github/MitMaro/node-sql-template-engine/badge.svg?branch=master)](https://coveralls.io/github/MitMaro/node-sql-template-engine?branch=master)
[![NPM version](https://img.shields.io/npm/v/@mitmaro/sql-template-engine.svg)](https://www.npmjs.com/package/@mitmaro/sql-template-engine)
[![GitHub license](https://img.shields.io/badge/license-ISC-blue.svg)](https://raw.githubusercontent.com/MitMaro/node-sql-template-engine/master/LICENSE.md)
[![Known Vulnerabilities](https://snyk.io/test/github/mitmaro/node-sql-template-engine/badge.svg?targetFile=package.json)](https://snyk.io/test/github/mitmaro/node-sql-template-engine?targetFile=package.json)

## Install

    npm install --save @mitmaro/sql-template-engine

## Documentation

* [API Documentation][documentation]

## Usage

### Creating an instance

Creating a SQL Template Engine instance is very straight forward.

#### JavaScript
```javascript
const createSqlTemplateEngine = require('@mitmaro/sql-template-engine');
const sqlTemplateEngine = createSqlTemplateEngine({
    // options
});
```

#### TypeScript
```typescript
import createSqlTemplateEngine from '@mitmaro/sql-template-engine';
const sqlTemplateEngine = createSqlTemplateEngine({
    // options
});
```

#### Options

|Name             |Type                      |Description                                                     |Default                   |
|-----------------|--------------------------|----------------------------------------------------------------|--------------------------|
|cache            |`AbstractSyntaxTreeCache` |A custom abstract syntax tree cache                             |Memory                    |
|epsilon          |`number`                  |The allowed error due to rounding in floating point comparisons |`Number.EPSILON`          |
|fileEncoding     |`string`                  |The file encoding for template files                            |UTF-8                     |
|rootPath         |`string`                  |The root directory for looking for template files               |Current working directory |
|maximumCallDepth |`number`                  |The maximum depth of nested includes                            |64                        |

### Invoking a template file

```javascript
const result = await sqlTemplateEngine.invokeTemplateFile('template.tpl', {foo: 'bar'});
```

## Development

Development is done using Node 8 and NPM 5, and tested against both Node 8 and Node 10. To get started

* Install Node 8 from [NodeJS.org][node] or using [nvm]
* Clone the repository using `git clone git@github.com:MitMaro/node-sql-template-engine.git`
* `cd node-sql-template-engine`
* Install the dependencies `npm install`
* Make changes, add tests, etc.
* Run linting and test suite using `npm run test`
* Build using `npm run build`

## License

This project is released under the ISC license. See [LICENSE](LICENSE.md).


[documentation]: http://www.mitmaro.ca/node-sql-template-engine/
[LICENSE]:LICENSE
[node]:https://nodejs.org/en/download/
[nvm]:https://github.com/creationix/nvm#installation
