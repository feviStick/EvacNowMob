import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Dummy data for GIS locations (e.g., markers)
const locations = [
  { id: 1, name: 'Central Park', coordinates: [40.785091, -73.968285] },
  { id: 2, name: 'Empire State Building', coordinates: [40.748817, -73.985428] },
  { id: 3, name: 'Statue of Liberty', coordinates: [40.689247, -74.044502] }
];

app.get('/api/locations', (req, res) => {
  res.json(locations);
});

app.post('/api/locations', (req, res) => {
  const newLoc = req.body;
  newLoc.id = locations.length + 1;
  locations.push(newLoc);
  res.status(201).json(newLoc);
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
