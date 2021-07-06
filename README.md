# Platform APP

*project structure*

```
.
|
|
└────── src
│       |
|       |── client
|       |       |
|       │       └─ angular /*client files*/
|       |
|       |── config
|       │       ├── config.json /*dev,test,production*/
|       |       |
|       │       └── environment.js  
|       |
|       └── controllers
|       │       ├── roles.js
|       │       ├── leaves.js
|       │       ├── rolemapping.js
|       │       ├──
|       │       └── users.js          
|       |
|       ├── middleware
|       │     ├── auth.js
|       │     └── check-auth.js
|       |
|       ├── models
|       │     ├── roles.js
|       │     ├── leaves.js
|       │     ├── rolemapping.js
|       │     ├──
|       │     └── user.js
|       |
|       ├── routes
|       │     ├── roles.js
|       │     ├── leaves.js
|       │     ├── rolemapping.js
|       │     ├──
|       │     └── user.js
|       |
|       └── server.js
|── index.js
|
├── README.md
|
└── package.json

```
---

*Run server*

* sudo NODE_ENV=development npm start || sudo NODE_ENV=development node app.js
