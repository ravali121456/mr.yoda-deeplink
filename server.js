// const express = require('express');
// const path = require('path');
// const app = express();

// // Serve the .well-known directory statically
// app.use('/.well-known', express.static(path.join(__dirname, 'well-known')));

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running at http://localhost:${PORT}`);
// });


const express = require('express');
const path = require('path');
const app = express();

const filePath = path.join(__dirname, '.well-known');
console.log('Serving static files from:', filePath);

app.use('/.well-known', express.static(filePath));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

