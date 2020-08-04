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

// express-session 미들웨어 사용
app.use(session({
    secret: '@#@$MYBOARD#@$#$',
    resave: false,
    saveUninitialized: true
}))
 
// 로그인 or 회원가입 선택
app.get('/', function(req, res) {
    if(!req.session.user) {
        //console.log('세션이 존재하지 않습니다.')
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
        //console.log('세션이 존재하지 않습니다.')
        res.render('login')
    }
    else res.redirect('main')
})
app.post('/login', function(req, res) {
    // 입력 데이터랑 mysql 데이터랑 비교해서
    // 일치하면 로그인해서 main.ejs로 보내기
    var sql = 'SELECT * FROM user WHERE email=?'
    if (req.body.email=='' || req.body.password=='')
        res.send('2')
    else {
        db.query(sql, [req.body.email], function(error, results) {
            if (error) throw error;
            else if (req.body.password==results[0].password) {
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
    }
})

// 회원가입 기능 구현
// JOB을 제외한 항목이 하나라도 비어있으면 가입 불가
// 회원가입하려는 이메일이 이미 존재할 경우 가입 불가
app.get('/signup', function(req, res) {
    res.render('signup')
})
app.post('/signup', function(req, res) {
    var sql1 = 'SELECT * from user WHERE email=?'
    var sql2 = 'INSERT INTO user(email, password, name, job) VALUES(?, ?, ?, ?)'
    db.query(sql1, [req.body.email], function(error, results) {
        if(error) throw error
        // 이메일, 비밀번호, 이름 중에서 하나의 항목이라도 비어있으면 오류 발생
        else if(req.body.email=='' || req.body.password=='' || req.body.name=='')
            res.send('2')
        // 이메일을 대조하여 이미 가입된 아이디면 오류 발생
        else if(req.body.email==results[0].email)
            res.send('3')
        // 회원가입 완료
        else {
            db.query(sql2, [req.body.email, req.body.password, req.body.name, req.body.job], function(error, results) {
                if(error) throw error
                else res.send('1')
            })
        }
    })
})

// 글 목록 구현(main에서 가능)
app.get('/main', function(req, res) {
    res.render('main')
})
app.post('/main', function(req, res) {
    
})

// 글 쓰기 구현(main에서 가능)
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