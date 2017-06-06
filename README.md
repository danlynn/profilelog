# ProfileLog

ProfileLog is a simple JavaScript profiling class featuring ellapsed timestamp logging and accumulated stats for repeated bits of code.

## Install

ProfileLog can be installed into your project's `package.json` via:

```bash
$ npm install 'danlynn/profilelog' --save
```

This will pull the code from this git repo and install it into your project's node_modules directory.  Your `package.json` file's dependencies will be updated with:

```JSON
"dependencies": {
  ...
  "profilelog": "danlynn/profilelog"
}
```

## Usage - Including in your source

If using ES6 then the ProfileLog class can be imported into your JavaScript source via:

```javascript
import ProfileLog from 'profilelog'
```

If using ES5 then require it into your JavaScript source via:

```javascript
const ProfileLog = require('profilelog').default
```

## Usage - Logging profiling entries

ProfileLog holds all your profiling entries internally until you call `profileLog.writeToConsole()` or `profileLog.toString()`.  This is so that your regular logging won't be littered with a bunch of profiling data.  Instead, you can simply output the formatted profiling entries to the console at the very end.

Regular profiling entries are added via the `addEntry(since, message)` method.  The `since` argument should be the starting Date.now() millisecs that you want the method to use to calculate the ellapsed millisecs.

```javascript
const profileLog = new ProfileLog('Test Performance')
let start = Date.now()
// ...do something being measured...
profileLog.addEntry(start, 'Did something slow')
// ...stuff not being measured...
start = Date.now()
// ...do something being measured again...
profileLog.addEntry(start, 'Did something slow again')
profileLog.writeToConsole()
```

## Usage - Logging repeated usages

For use cases where you will be performing a number of repeated operations and you want to record the durations of each run for a later statistical summary, you can use the `addToGroup(since, group)` method.  The `since` argument works the same was as in the `addEntry(since, message)` method.  However, instead of logging a message with each entry, it instead creates a collection named as specified by `group` where all the ellapsed times will be added.

When later `toString()` or `writeToConsole()` are called, the groups of data will be output showing the group name, min, max, and ave for the data in each group.

```javascript
const profileLog = new ProfileLog('Test Loop Performance')
let start = Date.now()
for (let url in urls) {
  fetch(url).then((response) => {
    profileLog.addToGroup(start, 'images')
  })
}
profileLog.writeToConsole()
```

## Usage - multiple instances

Since `ProfileLog` is a class, you have to first instantiate it before using it via:

```javascript
const profileLog = new ProfileLog('Heading')
```

This means that you can just as easily create multiple instances and add profiling entries into each as desired.  The argument passed to the constructor lets you provide a meaningful heading when the profile log is later output.

## Example outout

In this example, the performance of a system which generate email content is tested by simulating the creation of 4 emails with 6 images each.

Note that the heading is actually a long string with some "\n  " in the middle to display the parameters of the test.

```
Dynamic Email Generator:
  hostname: abc12345.execute-api.us-east-1.amazonaws.com
  count:    4
  rate:     120 rpm
  emails:   2

     695: image 0:4 - 200
     775: image 0:2 - 200
     791: image 0:5 - 200
     890: image 0:3 - 200
     930: image 0:0 - 200
     445: image 1:3 - 200
     934: image 0:1 - 200
     952: email 0  -- 200,200,200,200,200,200
     448: image 1:4 - 200
     447: image 1:5 - 200
     453: image 1:0 - 200
     458: image 1:2 - 200
     507: image 1:1 - 200
     509: email 1  -- 200,200,200,200,200,200
     328: image 2:3 - 200
     327: image 2:5 - 200
     331: image 2:2 - 200
     387: image 2:0 - 200
     469: image 2:1 - 200
     480: image 2:4 - 200
     485: email 2  -- 200,200,200,200,200,200
     386: image 3:0 - 200
     461: image 3:4 - 200
    8927: image 3:1 - 200
    8925: image 3:2 - 200
    8925: image 3:5 - 200
    8927: image 3:3 - 200
    8931: email 3  -- 200,200,200,200,200,200

  images:
    count: 24
    min:   4121
    max:   5734
    ave:   4916

  emails:
    count: 4
    min:   4173
    max:   5740
    ave:   5072
```

From this output, it looks something about email 3 triggered additional processing and delay.  Perhaps, that warrants additional inspection?
