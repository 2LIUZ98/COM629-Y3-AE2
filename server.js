import express from "express";
import Database from 'better-sqlite3';
import cors from 'cors';
import expressSession from 'express-session';
import betterSqlite3Session from 'express-session-better-sqlite3';

const app = express();

app.get("/", (req, res) => {
  res.send("Express working!");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});