'use strict'

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
export default class ProfileLog {

  constructor(title = "Execution Profiling Log:", enabled = true) {
    this.title = title
    this.enabled = enabled
    this.entries = []
    this.groups = {}
  }

  /**
   * Clear the profiling info entries
   */
  clear() {
    this.entries = []
    this.groups = {}
  }

  /**
   * Add profiling measurement info entry if 'enabled'.
   *
   * @param since {number} Date.now() to be used to calculate
   *            elapsed millisecs
   * @param message {string} description of measurement
   */
  addEntry(since, message) {
    if (this.enabled) {
      const elapsed = since ? ('      ' + (Date.now() - since)).slice(-6) : ''
      this.entries.push(`${elapsed}: ${message}`)
    }
  }

  /**
   * Add an elapsed time into the group list.
   *
   * @param since {number} Date.now() to be used to calculate
   *            elapsed millisecs
   * @param group {string} group name
   */
  addToGroup(since, group) {
    if (this.enabled) {
      if (!this.groups[group])
        this.groups[group] = []
      this.groups[group].push(Date.now() - since)
    }
  }

  /**
   * @returns {string} formatted content of ProfileLog entries
   */
  toString() {
    let output = `${this.title}\n  ${this.entries.join("\n  ")}\n`
    for (let propertyName in this.groups) {
      if (this.groups.hasOwnProperty(propertyName)) {
        const group = this.groups[propertyName]
        output += `\n  ${propertyName}:\n`
        output += `    count: ${group.length}\n`
        output += `    min:   ${Math.min.apply(Math, group)}\n`
        output += `    max:   ${Math.max.apply(Math, group)}\n`
        const sum = group.reduce((a,b) => a + b)
        output += `    ave:   ${(sum / group.length).toFixed(0)}\n`
      }
    }
    return output
  }

  /**
   * Write ProfileLog entries to console if 'enabled'.
   */
  writeToConsole(clear = false) {
    if (this.enabled) {
      console.log(this.toString())
      if (clear)
        this.clear()
    }
  }

}
