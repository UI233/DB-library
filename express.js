let manage = require(__dirname + '/manager.js')

let exp = require("express")
let app = new exp()
let mysql = require('mysql')
let bodyParser = require('body-parser');
let connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '121121ppxcs',
    database : 'library'
})
app.use(bodyParser.urlencoded({ extended: false }))

let authority = false
// main page
app.get("/",(req, res) => {
    res.sendFile(__dirname + "/index.html")
})

// manager page
app.get("/manager.html", function(req, res){
    if(authority)
        res.sendFile(__dirname + '/manager/manager.html')
    else res.redirect('/')
    authority = false
})


app.post("/managerLogin", (req,res) => {
    req.on('data', function(data)
    {
        obj = JSON.parse(data)
        let query_command = "select * from manager where id = " + "\'" + obj.id + "\'" + " and password = " + "\'" + obj.password + "\' ;"
        authority = false
        connection.query(query_command, function(err, result){
            if(err)
                console.log(err.message)
            console.log(result.length)
            if(result.length > 0)
            {
                res.send('true')
                authority = true
            }
            else res.send('false')
        })

    })
})

// borrow page
app.get("/borrow", function(req,res){
    let id = req.query
    let stringify = (str) => "\'" + str + "\'"
    let sql = "select cno from card where cno=" + stringify(id.id)
    connection.query(sql,function(err, result){
        if(err)
            console.log(err)
        if(result.length > 0)
        {
            res.sendFile(__dirname + "/borrow/borrow.html")
        }
        else res.send("false")
    })
})

app.post("/borrow/lookup", function(req, res){
    req.on('data', function(data){
        data = JSON.parse(data)
        let stringfy = str => "\'" + str + "\'"
        let sqlquery = "select bno, category, title, press, year, author, price, total\
        from book natural join borrow\
        where cno=" + stringfy(data.id)
        connection.query(sqlquery, function(err, result){
            res.send(JSON.stringify({
                returnData : result
            }))            
        })

    })
})

app.post("/borrow/return", function(req, res){
    req.on('data', function(data){
        data = JSON.parse(data)
        let stringfy = str => "\'" + str + "\'"

        let delete_borrow = 'delete from borrow where cno=' + stringfy(data.cno) + " and bno=" + stringfy(data.bno)
        let updata_book = 'update book set total = total + 1 where bno=' + stringfy(data.bno)
        connection.query(delete_borrow, function(err, result){
            connection.query(updata_book, function(err, result){
                res.send("Update completed")
            })
        })
    })
})
// The book page
app.get('/book', function(req, res){
    res.sendFile(__dirname + '/book/book.html')
})

app.post('/book/lookup', function(req, res){
    req.on('data', function(data){
        data = JSON.parse(data)
        let sql = "select * from book";
        let stringfy = str => "\'" + str + "\'"
        // Select those valid conditions
        if(data.category || data.press || data.title || data.price_low || data.year_low || data.year_high || data.price_high)
        {
            sql += " where "
            let condition = []
            if(data.category)
                condition.push("category=" + stringfy(data.category))
            if(data.press)
                condition.push("press=" + stringfy(data.press))
            if(data.title)
                condition.push("title=" + stringfy(data.title))
            if(data.price_low)
                condition.push("price>=" + data.price_low)
            if(data.price_high)
                condition.push("price<=" + data.price_high)
            if(data.year_low)
                condition.push("year>=" + data.year_low)
            if(data.year_high)
                condition.push("year<=" + data.year_high)

            for(let i = 0; i < condition.length; ++i)
            {
                sql += condition[i]
                if(i != condition.length - 1)
                    sql += " and "
            }
        }

        sql += " order by " + data.order + " desc"
        connection.query(sql, function(err, result){
            if(result.length > 50)
                result = result.slice(0, 50)

            res.send(JSON.stringify({
                returnData : result
            }))            
        })
    }) 
})

app.listen(8000);