import sqlite3 from "sqlite3";

const sqlite = sqlite3.verbose()
// 数据库名称
const dbName = 'later.sqlite'
const db = new sqlite.Database(dbName)

db.serialize(()=>{
    const sql = `
        CREATE TABLE IF NOT EXISTS articles 
        (   id integer primary key AUTOINCREMENT,
            title,
            content TEXT
        )
    `;
    db.run(sql)
})

export class Article {
    static all(cb){
        db.all('SELECT * FROM articles',cb)
    }

    static find(id, cb){
        db.get(`SELECT * FROM articles WHERE id = ?`, id, cb)
    }

    static create(data, cb){
        const sql = `INSERT INTO articles(title,content) VALUES(?,?)`;
        db.run(sql, data.title,data.content, cb)
    }
    static delete(id, cb){
        if(!id) return cb(new Error('缺少id'))
        db.run('DELETE FROM articles WHERE id=?', id, cb)
    }
}

export default db

