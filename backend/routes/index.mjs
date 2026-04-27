import express from 'express';
const allRouter = express.Router();
import db from './db.mjs';

allRouter.get('/products', (req, res) => {
    const stmt = db.prepare("SELECT * FROM Products");
    const results = stmt.all();
    res.json(results);
});

allRouter.get('/categories', (req, res) => {
    const stmt = db.prepare("SELECT * FROM Categories");
    const results = stmt.all();
    res.json(results);
});

allRouter.get('/brands', (req, res) => {
    const stmt = db.prepare("SELECT * FROM Brands");
    const results = stmt.all();
    res.json(results);
});

allRouter.get('/sellers', (req, res) => {
    const stmt = db.prepare("SELECT * FROM Sellers");
    const results = stmt.all();
    res.json(results);
});

allRouter.get('/marketplaces', (req, res) => {
    const stmt = db.prepare("SELECT * FROM Marketplaces");
    const results = stmt.all();
    res.json(results);
});

allRouter.get('/tags', (req, res) => {
    const stmt = db.prepare("SELECT * FROM Tags");
    const results = stmt.all();
    res.json(results);
});

export default allRouter;
