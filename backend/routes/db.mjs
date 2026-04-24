import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.join(process.cwd(), "dissertation.db"));
console.log("DB PATH WORKING");

export default db;