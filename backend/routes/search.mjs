import express from 'express';
const searchRouter = express.Router();
import db from './db.mjs';
import xss from 'xss';

searchRouter.get('/products', (req, res) => {
   let query = `
        SELECT 
            Products.Product_ID,
            Products.product_name,
            Products.category_id,
            Products.brand_id,
            Product_Sellers.price,
            Product_Sellers.seller_id,
            Sellers.seller_name,
            AVG(Ratings.rating) AS avg_rate,
            COUNT(Ratings.rating) AS c_rate

        FROM Products
        LEFT JOIN Product_Sellers
            ON Products.Product_ID = Product_Sellers.Product_ID
        LEFT JOIN Sellers
            ON Sellers.Seller_ID = Product_Sellers.Seller_ID
        LEFT JOIN Ratings 
            ON Products.Product_ID = Ratings.Product_ID
        LEFT JOIN Product_Tags 
            ON Products.Product_ID = Product_Tags.Product_ID
        LEFT JOIN Product_Attributes 
            ON Products.Product_ID = Product_Attributes.Product_ID    
        LEFT JOIN Attributes 
            ON Product_Attributes.Attribute_ID = Attributes.Attribute_ID       
        WHERE 1=1
        `;

    let params = [];

    if (req.query.keyword) {
        query += " AND Products.product_name LIKE ?";
        params.push(`%${xss(req.query.keyword)}%`);
    }

    if (req.query.category) {
        query += " AND Products.category_id = ?";
        params.push(xss(req.query.category));
    }

    if (req.query.brand) {
        query += " AND Products.brand_id = ?";
        params.push(xss(req.query.brand));
    }

    if (req.query.seller) {
        query += " AND Product_Sellers.seller_id = ?";
        params.push(xss(req.query.seller));
    }

     if (req.query.minPrice) {
        query += " AND Product_Sellers.price >= ?";
        params.push(xss(req.query.minPrice));
    }
 

    if (req.query.maxPrice) {
        query += " AND Product_Sellers.price <= ?";
        params.push(xss(req.query.maxPrice));
    }


    if (req.query.tags) {
        query += " AND Products.Product_ID IN (SELECT Product_ID FROM Product_Tags WHERE tag_id = ?)";
        params.push(xss(req.query.tags));
    }

    if (req.query.attribute && req.query.value) {
         query += " AND Products.Product_ID IN (SELECT Product_ID FROM Product_Attributes WHERE attribute_id = ? AND value = ?)";
        params.push(xss(req.query.attribute));
        params.push(xss(req.query.value));
    }

    query += `
            GROUP BY 
            Products.Product_ID,
            Product_Sellers.seller_id
            `;
      

    try {
    const stmt = db.prepare(query);
    const rows = stmt.all(...params);

    const grouped = {};

    rows.forEach(row => {
        const id = row.Product_ID;

        if (!grouped[id]) {
            grouped[id] = {
                Product_ID: row.Product_ID,
                product_name: row.product_name,
                category_id: row.category_id,
                brand_id: row.brand_id,
                price: row.price,
                seller_id: row.seller_id,
                seller_name: row.seller_name,
                avg_rate: row.avg_rate,
                c_rate: row.c_rate,
                attributes: []
            };
        }

        if (row.Attribute_ID && row.attribute_name) {
            grouped[id].attributes.push({
                name: row.attribute_name,
                value: row.value
            });
        }
    });

    res.json(Object.values(grouped));

} catch (err) {
    console.error("SQL ERROR:", err.message);
    res.status(500).json({ error: err.message });
}

});



export default searchRouter;