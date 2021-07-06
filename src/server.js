const path = require('path'),
      fs= require('fs'),
      app = require('express'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      checkAuth = require("./middleware/authorize"),
      connection=require('./config/mongoose-connection'),
      auth = require('./middleware/auth'),
      adminAuth = require('./middleware/admin-auth'),
      errorHandler = require('./middleware/error-handler'),
      requestHandler= require('./middleware/request-handler'),
      Config = require("../src/config/config"),
      compression = require('compression'),
      helmet = require('helmet');


const server = app();

server.use(bodyParser.json({ limit: '30mb' })); 

server.use(bodyParser.urlencoded({ extended: false }));
server.use(compression())
server.use(helmet())

server.use(cors());

server.use(requestHandler);

var morgan = require('morgan');

//TODO: create a write stream (in append mode)

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

//TODO: setup the logger

server.use(morgan('combined', { stream: accessLogStream }))

//TODO: Serve Static Files/Images

server.use('/images', app.static(path.join(__dirname, 'images')));
server.use('/files', app.static(path.join(__dirname, 'files')));
server.use('/uploads', app.static(path.join(__dirname, '../uploads')));

var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '4d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
}

server.use(app.static(path.resolve(__dirname, "client/courier-app"))); 

server.use(auth);

server.use(errorHandler);

server.use("/api/auth", require("./routes/auth"));
server.use("/api/users", checkAuth, require("./routes/user"));
server.use("/api/leave", checkAuth, require("./routes/leaves"));
server.use("/api/attachment", checkAuth, require("./routes/attachments"));
server.use("/api/projects", checkAuth, require("./routes/projects"));
server.use("/api/tickets", checkAuth, require("./routes/tickets"));
server.use("/api/comments", checkAuth, require("./routes/comments"));
server.use("/api/tasks", checkAuth, require("./routes/tasks"));
server.use("/api/leavetypes", checkAuth, require("./routes/leave-types"));
server.use("/api/education", checkAuth, require("./routes/user-education"));
server.use("/api/work", checkAuth, require("./routes/user-work-experience"));

server.use("/api/roles", adminAuth, require("./routes/roles"));
server.use("/api/category", adminAuth, require("./routes/categories"));
server.use("/api/subcategory", adminAuth, require("./routes/subcategories"));
server.use("/api/job", adminAuth, require("./routes/job-positions"));
server.use("/api/courierOrders", checkAuth, require("./routes/courier-order"));


server.use("/api/user", auth, require("./routes/chat-user"));
server.use("/api/chat", auth, require("./routes/chat"));
server.use("/api/posts", require("./routes/posts"));
//TODO: Boot Scripts/Jobs

let resetLeave= require('./boot/reset_leave.js')();
let birthday= require('./boot/birth_day.js')();
let marriage_anniversary= require('./boot/marriage_anniversary.js')();
let emp_anniversary= require('./boot/emp_anniversary.js')();
let mongo_backup= require('./boot/mongo_backup.js')();


server.get('/api/*', function(req, res) {
 res.status(404).json({
    status: false,
    message: "API not there",
  });
});

server.all('/*', (req, res) => {
   res.sendFile(path.resolve(__dirname, "client/courier-app/index.html"));
});
 
// connection();
module.exports=server;
