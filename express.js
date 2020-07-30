const express = require('express')
const app = express()
const mysql = require('mysql')
const session = require('express-session')
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'swg18524481',
    database : 'board'
});
db.connect();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.json())
app.use(express.urlencoded({ extended : true }))

// express-session 미들웨어
app.use(session({
    secret: '@#@$MYBOARD#@$#$',
    resave: false,
    saveUninitialized: true
}))
 
// 로그인 or 회원가입 선택
app.get('/', function(req, res) {
    if(!req.session.user) {
        console.log('세션이 존재하지 않습니다.')
        res.render('index')
    }
    else res.redirect('main')
})

// 로그아웃 기능 구현
app.get('/logout', function(req, res) {
    req.session.destroy(function(error){
        console.log('세션을 종료합니다.')
        res.redirect('/')
    })
})

// 로그인 기능 구현
// login.ejs로부터 받은 'password' 값과
// DB에 저장된 'password' 값이 일치하면 성공
app.get('/login', function(req, res) {
    if(!req.session.user) {
        console.log('세션이 존재하지 않습니다.')
        res.render('login')
    }
    else res.redirect('main')
})
app.post('/login', function(req, res) {
    var sess = req.session // 세션 초기화
    // 입력 데이터랑 mysql 데이터랑 비교해서
    // 일치하면 로그인해서 main.ejs로 보내기
    var sql = 'SELECT * FROM user WHERE email=?'
    db.query(sql, [req.body.email], function (error, results) {
        if (error) throw error;
        if (req.body.email=='' || req.body.password=='')
            res.send('2')
        else if (results[0].password==req.body.password) {
            // 세션이 없을 경우 생성
            if(!req.session.user) {
                req.session.user = {
                    email : results[0].email,
                    name : results[0].name,
                    job : results[0].job
                }
            }
            console.log(req.session)
            res.send('1')
        }
        else res.send('2')
    })
})

// 회원가입 구현(index에서)
app.get('/signup', function(req, res) {
    res.render('signup')
})
app.post('/signup', function(req, res) {

})

// 글목록 구현(main에서 가능)
app.get('/main', function(req, res) {
    res.render('main')
})
app.post('/main', function(req, res) {
    
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

app.listen(3000, console.log('App listening at http://localhost:3000'))