import express from 'express';
const allRouter = express.Router();
import db from './db.mjs';

allRouter.get('/products', (req, res) => {
    const stmt = db.prepare("SELECT * FROM Products");
    const results = stmt.all();
    res.json(results);
});

export default allRouter;
