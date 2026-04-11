import express from 'express';
const searchRouter = express.Router();
import db from './db.mjs';
import xss from 'xss';

searchRouter.get('/product/:keyword', (req, res) => {
    const keyword = "%" + xss(req.params.keyword) + "%";

    const stmt = db.prepare(
        "SELECT * FROM Products WHERE product_name LIKE ?"
    );

    const results = stmt.all(keyword);
    res.json(results);
});

export default searchRouter;