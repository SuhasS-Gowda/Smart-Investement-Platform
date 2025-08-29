import express from 'express';

const app = express();
const port = 3001;

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test server is working!' });
});

app.listen(port, () => {
  console.log(`Test server running at http://localhost:${port}`);
}); 