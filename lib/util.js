// Copyright (c) 2016, 2019, Oracle and/or its affiliates. All rights reserved

//-----------------------------------------------------------------------------
//
// You may not use the identified files except in compliance with the Apache
// License, Version 2.0 (the "License.")
//
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//
// See the License for the specific language governing permissions and
// limitations under the License.
//
//-----------------------------------------------------------------------------

'use strict';

const util = require('util');

// node-oracledb version number
let packageJSON;
try {
  packageJSON = require('../package.json');
} catch(err) {
  throw new Error('package.json is missing');
}
const PACKAGE_JSON_VERSION = packageJSON.version;
module.exports.PACKAGE_JSON_VERSION = PACKAGE_JSON_VERSION;

// Directory containing the node-oracledb add-on binary
const RELEASE_DIR = 'build/Release';
module.exports.RELEASE_DIR = RELEASE_DIR;

// The default node-oracledb add-on binary filename for this Node.js
const BINARY_FILE = 'oracledb-' + PACKAGE_JSON_VERSION + '-' + process.platform + '-' + process.arch + '.node';
module.exports.BINARY_FILE = BINARY_FILE;

// Staging directory used by maintainers building the npm package
const STAGING_DIR = 'package/Staging';
module.exports.STAGING_DIR = STAGING_DIR;

// errorMessages is for NJS error messages used in the JavaScript layer
const errorMessages = {
  'NJS-002': 'NJS-002: invalid pool',
  'NJS-004': 'NJS-004: invalid value for property %s',
  'NJS-005': 'NJS-005: invalid value for parameter %d',
  'NJS-009': 'NJS-009: invalid number of parameters',
  'NJS-037': 'NJS-037: incompatible type of value provided',
  'NJS-040': 'NJS-040: connection request timeout. Request exceeded queueTimeout of %d',
  'NJS-041': 'NJS-041: cannot convert ResultSet to QueryStream after invoking methods',
  'NJS-042': 'NJS-042: cannot invoke ResultSet methods after converting to QueryStream',
  'NJS-043': 'NJS-043: ResultSet already converted to QueryStream',
  'NJS-045': 'NJS-045: cannot load a node-oracledb binary for Node.js ' + process.versions.node + ' (' + process.platform + ' ' + process.arch + ') %s',
  'NJS-046': 'NJS-046: poolAlias "%s" already exists in the connection pool cache',
  'NJS-047': 'NJS-047: poolAlias "%s" not found in the connection pool cache',
  'NJS-064': 'NJS-064: connection pool is closing',
  'NJS-065': 'NJS-065: connection pool was closed',
  'NJS-067': 'NJS-067: a pre-built node-oracledb binary was not found for %s',
  'NJS-069': 'NJS-069: node-oracledb %s requires Node.js %s or later'
};

// getInstallURL returns a string with installation URL
function getInstallURL() {
  return('Node-oracledb installation instructions: https://oracle.github.io/node-oracledb/INSTALL.html');
}

module.exports.getInstallURL = getInstallURL;

// getInstallHelp returns a string with installation usage tips that may be helpful
function getInstallHelp() {
  let arch, url;
  let mesg = getInstallURL() + '\n';
  if (process.platform === 'linux') {
    if (process.arch === 'x64') {
      url = 'http://www.oracle.com/technetwork/topics/linuxx86-64soft-092277.html\n';
      arch = '64-bit';
    } else if (process.arch === 'x32') {
      url = 'http://www.oracle.com/technetwork/topics/linuxsoft-082809.html\n';
      arch = '32-bit';
    } else {
      url = 'http://www.oracle.com/technetwork/database/database-technologies/instant-client/overview/index.html\n';
      arch = process.arch;
    }
    mesg += 'You must have ' + arch + ' Oracle client libraries in LD_LIBRARY_PATH, or configured with ldconfig.\n';
    mesg += 'If you do not have Oracle Database on this computer, then install the Instant Client Basic or Basic Light package from \n';
    mesg += url;
  } else if (process.platform === 'darwin') {
    if (process.arch === 'x64') {
      url = 'http://www.oracle.com/technetwork/topics/intel-macsoft-096467.html';
      arch = '64-bit';
    } else if (process.arch === 'x32') {
      url = 'http://www.oracle.com/technetwork/topics/intel-macsoft-096467.html';
      arch = '32-bit';
    } else {
      url = 'http://www.oracle.com/technetwork/database/database-technologies/instant-client/overview/index.html\n';
      arch = process.arch;
    }
    mesg += 'You must have the ' + arch + ' Oracle Instant Client Basic or Basic Light package in ~/lib or /usr/local/lib\n';
    mesg += 'They can be downloaded from ' + url;
  } else if (process.platform === 'win32') {
    if (process.arch === 'x64') {
      url = 'http://www.oracle.com/technetwork/topics/winx64soft-089540.html\n';
      arch = '64-bit';
    } else if (process.arch === 'x32') {
      url = 'http://www.oracle.com/technetwork/topics/winsoft-085727.html\n';
      arch = '32-bit';
    } else {
      url = 'http://www.oracle.com/technetwork/database/database-technologies/instant-client/overview/index.html\n';
      arch = process.arch;
    }
    mesg += 'You must have ' + arch + ' Oracle client libraries in your PATH environment variable.\n';
    mesg += 'If you do not have Oracle Database on this computer, then install the Instant Client Basic or Basic Light package from\n';
    mesg += url;
    mesg += 'A Microsoft Visual Studio Redistributable suitable for your Oracle client library version must be available.\n';
  } else {
    url = 'http://www.oracle.com/technetwork/database/database-technologies/instant-client/overview/index.html\n';
    mesg += 'You must have ' + process.arch + ' Oracle client libraries in your operating system library search path.\n';
    mesg += 'If you do not have Oracle Database on this computer, then install an Instant Client Basic or Basic Light package from: \n';
    mesg += url;
  }
  return mesg;
}

module.exports.getInstallHelp = getInstallHelp;

// getErrorMessage is used to get and format error messages to make throwing
// errors a little more convenient.
function getErrorMessage(errorCode) {
  let args = Array.prototype.slice.call(arguments);
  args[0] = errorMessages[errorCode];
  return util.format.apply(util, args);
}

module.exports.getErrorMessage = getErrorMessage;

// assert is typically used at the beginning of public functions to assert
// preconditions for the function to execute. Most commonly it is used to
// validate the number of arguments and their types and throw an error if they
// don't match what is expected.
function assert(condition, errorCode, messageArg1) {
  if (!condition) {
    throw new Error(getErrorMessage(errorCode, messageArg1));
  }
}

module.exports.assert = assert;

// The promisify function is used to wrap async methods to add optional promise
// support. If the last parameter passed to a method is a function, then it is
// assumed that the callback pattern is being used and the method is invoked as
// usual. Otherwise a promise is returned and later resolved or rejected based
// on the return of the method.
function promisify(oracledb, func) {
  return function() {
    const self = this;
    let args;

    if (!oracledb.Promise || typeof arguments[arguments.length - 1] === 'function') {
      return func.apply(self, arguments);
    } else {
      // Converting to an array so we can extend it later with a custom callback
      args = Array.prototype.slice.call(arguments);

      return new oracledb.Promise(function(resolve, reject) {
        let errorCode;

        try {
          args[args.length] = function(err, result) {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          };

          func.apply(self, args);
        } catch (err) {
          errorCode = err.message.substr(0, 7);

          // Check for invalid number or type of parameter(s) as they should be
          // eagerly thrown.
          if (errorCode === 'NJS-009' || errorCode === 'NJS-005') {
            // Throwing the error outside of the promise wrapper so that its not
            // swallowed up as a rejection.
            process.nextTick(function() {
              throw err;
            });
          } else {
            reject(err);
          }
        }
      });
    }
  };
}

module.exports.promisify = promisify;

function isObject(value) {
  return value !== null && typeof value === 'object';
}

module.exports.isObject = isObject;

function isObjectOrArray(value) {
  return (value !== null && typeof value === 'object') || Array.isArray(value);
}

module.exports.isObjectOrArray = isObjectOrArray;

function isSodaDocument(value) {
  return (value != null && value._sodaDocumentMarker);
}

module.exports.isSodaDocument = isSodaDocument;
