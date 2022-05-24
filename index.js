// import server
const server = require('./server');

let PORT;

if (process.env.NODE_ENV === 'heroku-prod') {
  PORT = process.env.PORT || 80;
} else {
  PORT = 443;
}

// start listening on server
server.listen(PORT, () => {
  console.log(`Web Engineering II app listening on port ${PORT}`);
})