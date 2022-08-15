import express from "express";
// 消息体解析器
import bodyParser from "body-parser";
import read from "node-readability";
import {Article} from './models/db.mjs'
const app = express()


const port = process.env.PORT || 3000

// 支持json请求消息
app.use(bodyParser.json())
// 支持编码表单的消息体
app.use(bodyParser.urlencoded({extended:true}))

// 用 express.static 把文件注册到对应的URL上
app.use(
    '/css/bootstrap.css',
    express.static('node_modules/bootstrap/dist/css/bootstrap.css')
)




const  articles = [{title:'例子：'}]
// 获取所有文章
app.get('/articles',(req,res,next)=>{
    Article.all((err,articles)=>{
        if(err) return next(err)
        res.format({
            html:()=>{
                res.render('articles.ejs',{articles:articles})
            },
            json:()=>{
                res.send(articles)
            }
        })
    })
})

// 创建文章
app.post('/articles', (req,res,next)=>{
    const url = req.body.url
    read(url, (err,result)=>{
        if(err||!result) res.status(500).send('下载文章错误')
        console.log(result.title);
        console.log(result.content);
        Article.create({title:result.title, content:result.content}, (err, article)=>{
            if(err||!result) return next(err)
            res.send({message:'添加成功'})
        })
    })
})

// 获取指定文章
app.get('/articles/:id', (req,res,next)=>{
    const id = req.params.id;
    Article.find(id,(err, article)=>{
        if(err) return next(err)
        res.send(article)
    })
})

// 删除指定文章
app.delete('/articles/:id', (req,res,next)=>{
    const id = req.params.id;
    console.log(`delete ${id}`)
    delete articles[id]
    Article.delete(id, (err)=>{
        if(err) return next(err)
        res.send({message:'Deleted'})
    })
})



app.listen(port, ()=>{
    console.log(`open : http://127.0.0.1:${port}`);
})
