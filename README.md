# connect-dirty
connect-dirty is a session store that you can use to interface with the sessions of an Express or Connect server

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
