# connect-dirty
connect-dirty is a Connect/Express session store that uses [node-dirty](https://github.com/felixge/node-dirty)

## Installation
`npm install connect-dirty`

## Usage
It's super simple to use:
```javascript
var dirtySession = require('connect-dirty'),
express = require('express');

var app = express()
.use(express.cookieParser())
.use(express.session({store: new dirtySession(), secret: 'bro'}));

```
Now you're cooking with gas! Just go about using sessions like you normally would.

### Feel free to contribute!
