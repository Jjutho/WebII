// import server
const server = require('./server');

let PORT;
// port
if (process.env.NODE_ENV === 'production') {
  PORT = process.env.PORT || 5000
} else {
  const config = require('config');
  PORT = config.get('app.port');
}

// start listening on server
server.listen(PORT, () => {
  console.log(`Web Engineering II app listening on port ${PORT}`);
})