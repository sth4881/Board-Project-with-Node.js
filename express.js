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

// 글 목록 구현 함수
function list(results) {
    var list = '<ol reversed>'
    for(var i=results.length-1; i>=0; i--) {
        console.log(results[i])
        list += `<li><a href="read/${results[i].id}">${results[i].title}</a>,
         ${results[i].name} posted on ${results[i].datetime}</li>`
    }
    list += '</ol>'
    return list;
}
 
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
        console.log('세션이 존재하지 않습니다.')
        res.render('login')
    }
    else res.redirect('main')
})
app.post('/login', function(req, res) {
    // 입력 데이터랑 mysql 데이터랑 비교해서
    // 일치하면 로그인해서 main.ejs로 보내기
    var sql = "SELECT * FROM user WHERE email=?"
    // 이메일 or 비밀번호 칸이 하나라도 비어있을 경우
    if (req.body.email=='' || req.body.password=='')
        res.send('2')
    else {
        db.query(sql, [req.body.email, req.body.password], function(error, results) {
            if (error) throw error;
            else if(results[0]==undefined) // 회원정보가 존재하지 않을 경우
                res.send('3')
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
            else res.send('2') // 이메일은 일치하지만 비밀번호가 다른 경우
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
    
    // 이메일, 비밀번호, 이름 중에서 하나의 항목이라도 비어있으면 오류 발생
    if(req.body.email=='' || req.body.password=='' || req.body.name=='')
        res.send('2')
    else {
        db.query(sql1, [req.body.email], function(error, info) {
            // 해당 이메일이 회원으로 등록되어있지 않을 경우 실행
            if(info[0]==undefined) {
                db.query(sql2, [req.body.email, req.body.password, req.body.name, req.body.job], 
                    function(error, result) {
                        if(error) throw error
                        else res.send('1')
                    }
                )
            }
            // 해당 이메일이 이미 회원으로 등록되어 있을 경우
            else if(req.body.email==info[0].email) {
                res.send('3')
            }
        })
    }
})

// 글 목록 구현(main에서 가능)
app.get('/main', function(req, res) {
    // var temp = req.session.user.name
    var sql = `SELECT a.id, title, name, DATE_FORMAT(modified, '%Y-%m-%d %H:%i:%s')
                AS datetime FROM article a JOIN user u on a.author_id=u.id`
    db.query(sql, function(error, results) {
        res.render('main', {name : 'temp', list : list(results)})
    })
})

// 글 내용 조회 구현(main에서 가능)
app.get('/read/:id', function(req, res) {
    var sql = 'SELECT * FROM article WHERE id=?'
    db.query(sql, [req.params.id], function(error, results) {
        // :id가 있는 페이지는 앞의 view를 이용해서 구현(DB의 id값을 불러와서 연결하는 방식)
        res.render('read', {title : results[0].title, contents : results[0].contents})
    })
})

// 글 쓰기 구현(main에서 가능)
app.get('/post', function(req, res) {
    //res.render('post')
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