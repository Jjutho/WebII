// import server
const server = require('./server');

const PORT = process.env.PORT || 5000

// start listening on server
server.listen(PORT, () => {
  console.log(`Web Engineering II app listening on port ${PORT}`);
})