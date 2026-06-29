const express = require('express');
const path = require('path');

const app = express();
const publicPath = path.join(__dirname);
app.use(express.static(publicPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Static app server running at http://localhost:${PORT}`);
});
