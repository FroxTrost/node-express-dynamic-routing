# Node Express Dynamic Routing

Managing large number of routes has always been a tedious task to maintain in node+express app. 
**node-express-dynamic-routing** provides easy way to maintain routes without any hotch potch.

---
## Requirements

You will only need Node, package manager(npm/yarn) and express.

---

## Install
    $ npm i node-express-dynamic-routing

---
## Configure app

Small tweak is required to configure your app to work with **node-express-dynamic-routing**


- ### Writing you routes in a more descriptive way.
/src/routes/auth/index.js
```javascript
/*
Define all the route path's of particular Blueprint with their corresponding handlers and middelwares
*/

const {RouteDefinition, Route, Method} = require('node-express-dynamic-routing')

const handler = require('./handlers')

// blueprint to seprate different routes
const URL_PREFIX = 'account'

const Routes = new Route(URL_PREFIX, [
    // defining the route path with its Http method, list of middelwares and its handler function
  new RouteDefinition('login', Method.GET, [], handler.loginhandler),
  new RouteDefinition('register', Method.GET, [], handler.Registerhandler)
])

module.exports = Routes
```
---

/src/routes/auth/index.js
```javascript
/*
Defining all the route handlers
*/

const loginhandler = async (req, res) => {
  try {
    // call func to perform async task(query database) and sent the result
    res.send('login user')
  } catch (error) {
    res.send(error)
  }
}

const Registerhandler = async (req, res) => {
  try {
    // call func to perform async task(query database) and sent the result
    res.send('Register user')
  } catch (error) {
    res.send(error)
  }
}

module.exports = { loginhandler, Registerhandler }
```

- ### Initializing the Router in server file.
/server.js
```javascript
const express = require('express')
const {initializeRouter} = require('node-express-dynamic-routing')

const app = express()

// Initializing routes
// pass the instance of express.Router() and the path of directory containing all your routes. 
app.use('', initializeRouter(express.Router(), `${__dirname}/src/routes`))

// server
const server = app.listen(8085, () => {
  const host = server.address().address
  const { port } = server.address()
  console.log('Example app listening at http://%s:%s', host, port)
})
```
## and Thats it.... It's all that is required.


