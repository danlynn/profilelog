'use strict';

/**
 * Simple profile logging utility
 *
 * add to package.json:
 *   "dependencies": {
 *     "profilelog": "danlynn/profilelog"
 *   }
 *
 * ES6 usage:
 *   import ProfileLog from 'profilelog'
 *
 * ES5 usage:
 *   const ProfileLog = require('profilelog').default
 *   profileLog = new ProfileLog('Test Performance')
 *   let start = Date.now()
 *   ...do something being measured...
 *   profileLog.addEntry(start, 'Did something slow')
 *   start = Date.now()
 *   ...do something being measured again...
 *   profileLog.addEntry(start, 'Did something slow again')
 *   start = Date.now()
 *   for (let url in urls) {
 *     fetch(url).then((response) => {
 *       profileLog.addToGroup(start, 'images')
 *     })
 *   }
 *   profileLog.writeToConsole()
 *
 * output:
 *   Test Performance:
 *      11185: Did something slow
 *       2089: Did something slow again
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ProfileLog = function () {
  function ProfileLog() {
    var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Execution Profiling Log:";
    var enabled = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    _classCallCheck(this, ProfileLog);

    this.title = title;
    this.enabled = enabled;
    this.entries = [];
    this.groups = {};
  }

  /**
   * Clear the profiling info entries
   */


  _createClass(ProfileLog, [{
    key: 'clear',
    value: function clear() {
      this.entries = [];
      this.groups = {};
    }

    /**
     * Add profiling measurement info entry if 'enabled'.
     *
     * @param since {number} Date.now() to be used to calculate
     *            elapsed millisecs
     * @param message {string} description of measurement
     */

  }, {
    key: 'addEntry',
    value: function addEntry(since, message) {
      if (this.enabled) {
        var elapsed = since ? ('      ' + (Date.now() - since)).slice(-6) : '';
        this.entries.push(elapsed + ': ' + message);
      }
    }

    /**
     * Add an elapsed time into the group list.
     *
     * @param since {number} Date.now() to be used to calculate
     *            elapsed millisecs
     * @param group {string} group name
     */

  }, {
    key: 'addToGroup',
    value: function addToGroup(since, group) {
      if (this.enabled) {
        if (!this.groups[group]) this.groups[group] = [];
        this.groups[group].push(Date.now() - since);
      }
    }

    /**
     * @returns {string} formatted content of ProfileLog entries
     */

  }, {
    key: 'toString',
    value: function toString() {
      var output = this.title + '\n  ' + this.entries.join("\n  ") + '\n';
      for (var propertyName in this.groups) {
        if (this.groups.hasOwnProperty(propertyName)) {
          var group = this.groups[propertyName];
          output += '\n  ' + propertyName + ':\n';
          output += '    count: ' + group.length + '\n';
          output += '    min:   ' + Math.min.apply(Math, group) + '\n';
          output += '    max:   ' + Math.max.apply(Math, group) + '\n';
          var sum = group.reduce(function (a, b) {
            return a + b;
          });
          output += '    ave:   ' + (sum / group.length).toFixed(0) + '\n';
        }
      }
      return output;
    }

    /**
     * Write ProfileLog entries to console if 'enabled'.
     */

  }, {
    key: 'writeToConsole',
    value: function writeToConsole() {
      var clear = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (this.enabled) {
        console.log(this.toString());
        if (clear) this.clear();
      }
    }
  }]);

  return ProfileLog;
}();

exports.default = ProfileLog;