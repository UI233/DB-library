let exp = require("express")
let app = new exp()
let mysql = require('mysql')
let path = require('path')
let formidable = require('formidable')
let bodyParser = require('body-parser')
let connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '121121ppxcs',
    database : 'library_sys',
    multipleStatements: true
})
let esp = mysql.escape

let fs = require('fs')
let cookies = new Map()

app.use(bodyParser.urlencoded({ extended: false }))
app.use('/manager', exp.static(__dirname + '/manager'))
app.use('/borrow', exp.static(__dirname + '/borrow'))
app.use('/book', exp.static(__dirname + '/book'))
app.use('/card', exp.static(__dirname + '/card'))
app.use('/image', exp.static(__dirname + '/image'))


function getDateString(){
    let myDate = new Date()
    let year = myDate.getFullYear()
    let month = myDate.getMonth() + 1
    let day = myDate.getDate()
    return year + '-' + month + '-' + day
}

function stringify(str){
    return  esp(str) 
}

function isValidManager(req){
    return cookies.has(req.headers.cookie)
}

// Convert the information of a book to a single SQL insert statement
function getBookQueryString(obj){
    return 'insert into book values(' + stringify(obj.bno) + ',' + stringify(obj.category) + ','
    + stringify(obj.title) + ',' + stringify(obj.press) + ',' + esp(obj.year) + ','  + stringify(obj.author) + ','
    + esp(obj.price) + ',' + esp(obj.total) + ',' + esp(obj.total) + ')'
}

// main page
app.get("/",(req, res) => {
    let cookie = req.headers.cookie
    cookies.delete(cookie)
    res.sendFile(__dirname + "/login.html")
})

// manager page(for updating books)
app.get("/manager", function(req, res){
    if(isValidManager(req))
        res.sendFile(__dirname + '/manager/manager.html')
    else res.redirect('/')
})


app.post("/managerLogin", (req,res) => {
    req.on('data', function(data)
    {
        obj = JSON.parse(data)
        let query_command = "select * from manager where id = " + stringify(obj.id) + " and password = " + stringify(obj.password)  
        console.log(query_command)
        connection.query(query_command, function(err, result){
            if(err)
                res.send(err.message)
            else if(result.length > 0)
            {
                res.send('true')
                cookies.set(req.headers.cookie, obj.id)
            }
            else res.send('false')
        })
    })
})

app.post('/manager/single', function(req, res){
    req.on('data', function(data){
        let obj = JSON.parse(data)
        connection.query(getBookQueryString(obj), function(err, result){
            if(err)
                res.send('Updata Failed')
            else res.send('Update Completed')
        }) 
    })
})

// handle the request for upload the file to update it
app.post('/manager/file_upload', function(req, res){
    let form = new formidable.IncomingForm()
    
    form.parse(req,function(err,fields,files){
        fs.readFile(files.uploadJSON.path,function(err, data){
            let sql = data.toString()
            connection.query(data.toString(), (err, result) => {
               if(err)
                    res.send(err.sqlMessage)
                else res.send(JSON.stringify({
                    msg : 'Update Completed'
                }))
            })
        })
    })
})

// borrow page
app.get("/borrow", function(req,res){
    if(isValidManager(req))
        res.sendFile(__dirname + "/borrow/borrow.html")
    else res.redirect('/')
})
// Handle the request for looking up the books that are borrowed by certain user
app.post("/borrow/lookup", function(req, res){
    req.on('data', function(data){
        data = JSON.parse(data)
        let sqlquery = "select bno, title, cno, name, type, borrow_date\
        from book natural join borrow natural join card\
        where isnull(return_date) and cno=" + stringify(data.id)
        connection.query(sqlquery, function(err, result){
            res.send(JSON.stringify({
                returnData : result
            }))            
        })
    })
})
// Handle the request for returning the book
app.post("/borrow/return", function(req, res){
    req.on('data', function(data){
        data = JSON.parse(data)
       
        let update_borrow = 'update borrow set return_date = ' + stringify(getDateString()) + 
         'where cno=' + stringify(data.cno) + " and bno=" + stringify(data.bno)
        connection.query(update_borrow, function(err, result){
            if(err)
                res.send(err.sqlMessage) 
            else if(result.affectedRows == 0) res.send('No corresponding record')
            else res.send("Update Completed")
        })
    })
})
// Handle the request for borrowing the book
app.post("/borrow/borrow", function(req, res){
    req.on('data', function(data){
        data = JSON.parse(data)

        let admin_id = cookies.get(req.headers.cookie)
        if(admin_id == undefined)
            res.send('Invalid Manager')
        let query_book = 'select stock from book where bno=' + stringify(data.bno)
        let query_user = 'select * from card where cno=' + stringify(data.cno)
        connection.query(query_user, function(err, result){
            if(err)
                res.send(err.sqlMessage)
            else if(result.length == 0)
                res.send('Card does not exist')
            else connection.query(query_book, function(err, result){
                    if(result.length == 0)
                        res.send('Book does not exist')
                    else if(result[0].stock > 0){
                        let update_borrow = 'insert into borrow values('  + stringify(data.cno) + 
                        ',' + stringify(data.bno) + ',' + stringify(getDateString()) + ', null,' + stringify(admin_id) +  ')'
                        connection.query(update_borrow,function(err, result){
                            if(err)
                            {
                                res.send(err.sqlMessage)
                                console.log(err)
                            }
                            else if(result.affectedRows == 0)
                                res.send('No record has been deleted. Please check your input')
                            else res.send("Update completed")
                        })
                    }
                    else{
                        let query_return = 'select return_date from borrow where bno=' + stringify(data.bno) + ' order by return_date desc'
                        connection.query(query_return, function(err, result){
                            res.send(JSON.stringify({
                                date : result[0]
                            }
                            ))
                        })
                    }
                })
        })
        
    })
})
// The book page
app.get('/book', function(req, res){
    if(isValidManager(req))
        res.sendFile(__dirname + '/book/book.html')
    else res.redirect('/')
})

app.post('/book/lookup', function(req, res){
    req.on('data', function(data){
        data = JSON.parse(data)
        let sql = "select * from book";
        // Select those valid conditions
        if(data.category || data.press || data.title || data.price_low || data.year_low || data.year_high || data.price_high)
        {
            sql += " where "
            let condition = []
            if(data.category)
                condition.push("category=" + stringify(data.category))
            if(data.press)
                condition.push("press=" + stringify(data.press))
            if(data.title)
                condition.push("title=" + stringify(data.title))
            if(data.price_low)
                condition.push("price>=" + esp(data.price_low))
            if(data.price_high)
                condition.push("price<=" + esp(data.price_high))
            if(data.year_low)
                condition.push("year>=" + esp(data.year_low))
            if(data.year_high)
                condition.push("year<=" + esp(data.year_high))

            for(let i = 0; i < condition.length; ++i)
            {
                sql += condition[i]
                if(i != condition.length - 1)
                    sql += " and "
            }
        }

        sql += " order by " + data.order + ' ' + data.desc
        connection.query(sql, function(err, result){
            if(result.length > 50)
                result = result.slice(0, 50)

            res.send(JSON.stringify({
                returnData : result
            }))            
        })
    }) 
})
// card page
app.get('/card', function(req, res){
    if(isValidManager(req))
        res.sendFile(__dirname + '/card/card.html')
    else res.redirect('/')
})

app.post('/card/add', function(req, res){
    req.on('data', function(data){
        let card = JSON.parse(data)
        let query = 'insert into card values(' +stringify(card.cno) +',' + stringify(card.name) + ',' + stringify(card.dept)
         + ',' + stringify(card.type) + ')'

         connection.query(query, function(err, result){
            if(err)
            {
                res.send(err.sqlMessage)
            }
            else res.send('Update Completed')
         })
    })
})

app.post('/card/delete', function(req, res){
    req.on('data', function(data){
        let card = JSON.parse(data)
        let query = 'delete from card where cno=' + stringify(card.cno)
        connection.query(query, function(err, result){
            console.log(result)
            if(err)
                res.send(err.sqlMessage)
            else if(result.affectedRows == 0) 
                res.send('Card does not exist')
            else res.send('Update Completed')

        })
    })
})

app.listen(8000)