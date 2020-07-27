const express = require('express')
const app = express()
const mysql = require('mysql')
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'swg18524481',
    database : 'board'
});
db.connect();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index')
})

// 로그인 구현(index에서)
// login.ejs에서 받은 정보와 mysql에 저장된
// 데이터를 비교해서 값이 일치하면 성공
app.get('/login', function(req, res) {
    res.render('login')
})
app.post('/login', function(req, res) {
    db.query('SELECT email, password FROM user', function (error, results) {
        if (error) throw error;
        // 가져온 데이터랑 mysql 데이터랑 비교해서
        // 일치하면 로그인해서 main.ejs로 보내기
        console.log(req.body)
    })
})

// 회원가입 구현(index에서)
app.get('/signup', function(req, res) {
    res.render('signup')
})
app.post('/signup', function(req, res) {

})

// 글쓰기 구현(main에서 가능)
app.get('/post', function(req, res) {
    res.render('post')
})
app.post('/post'), function(req, res) {
    
}

// 글수정 구현(해당 글에서 가능, 제목과 내용만)
app.get('/update', function(req, res) {
    res.render('update')
})
app.post('/update', function(req, res) {

})

// 글목록 구현(main에서 가능)
app.get('/board', function(req, res) {
    res.render('board')
})
app.post('/board', function(req, res) {
    
})

app.listen(3000, console.log('Example app listening at http://localhost:3000'))