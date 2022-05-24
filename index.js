// import server
const server = require('./server');
// load port from config
const config = require('config');
const port = config.get('app.port');

// start listening on server
server.listen(port, () => {
  console.log(`Web Engineering II app listening on port ${port}`);
})