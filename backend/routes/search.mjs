import express from 'express';
const searchRouter = express.Router();
import db from './db.mjs';
import xss from 'xss';

searchRouter.get('/products', (req, res) => {
   let query = `
        SELECT 
            p.Product_ID,
            p.product_name,
            p.category_id,
            p.brand_id,
            ps.price,
            ps.stock,
            ps.status,
            ps.seller_id,
            s.seller_name,
            AVG(Ratings.rating) AS avg_rate,
            COUNT(Ratings.rating) AS c_rate,
            (
                SELECT GROUP_CONCAT(a.attribute_name || ':' || pa.value)
                FROM Product_Attributes pa
                LEFT JOIN Attributes a
                    ON pa.attribute_id = a.attribute_id
                WHERE pa.Product_ID = p.Product_ID
            ) AS attributes

        FROM Products p
        LEFT JOIN Product_Sellers ps
            ON p.Product_ID = ps.Product_ID
        LEFT JOIN Sellers s
            ON s.Seller_ID = ps.Seller_ID
        LEFT JOIN Ratings 
            ON p.Product_ID = Ratings.Product_ID
        LEFT JOIN Product_Tags 
            ON p.Product_ID = Product_Tags.Product_ID   
        WHERE 1=1
        `;

    let params = [];

    if (req.query.keyword) {
        query += " AND p.product_name LIKE ?";
        params.push(`%${xss(req.query.keyword)}%`);
    }

    if (req.query.category) {
        query += " AND p.category_id = ?";
        params.push(xss(req.query.category));
    }

    if (req.query.brand) {
        query += " AND p.brand_id = ?";
        params.push(xss(req.query.brand));
    }

    if (req.query.seller) {
        query += " AND ps.seller_id = ?";
        params.push(xss(req.query.seller));
    }

     if (req.query.minPrice) {
        query += " AND ps.price >= ?";
        params.push(xss(req.query.minPrice));
    }
 

    if (req.query.maxPrice) {
        query += " AND ps.price <= ?";
        params.push(xss(req.query.maxPrice));
    }


    if (req.query.tags) {
        query += " AND p.Product_ID IN (SELECT Product_ID FROM Product_Tags WHERE tag_id = ?)";
        params.push(xss(req.query.tags));
    }

    if (req.query.attribute && req.query.value) {
         query += " AND p.Product_ID IN (SELECT Product_ID FROM pa WHERE attribute_id = ? AND value = ?)";
        params.push(xss(req.query.attribute));
        params.push(xss(req.query.value));
    }

    query += `
            GROUP BY 
            p.Product_ID,
            ps.seller_id
            `;
      

    try {
    const stmt = db.prepare(query);
    const results = stmt.all(...params);

    const format = results.map(p => ({
        ...p,
        attributes: p.attributes
            ? p.attributes.split(",").map(item => {
                const [name, value] = item.split(":");
                return { name, value };
            })
            : []
        }));
    res.json(format);
    } catch (err) {
        console.error("SQL ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }

});



export default searchRouter;