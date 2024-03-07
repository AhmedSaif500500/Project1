// open Terminal vscode 
// npm init -y
// npm install express pg-promise body-parser dotenv
// create a file named (.env) in root put in it any variables to secure it like pass  for example put this in .env file ( pass="123" ) then call it here like ( password : env.pass)
// this page is name server.js put it in root file
// index.html put it in root file
// make folder named views put it in root file you should put all html files expept index.html file  in it
// make folder named public put it in root file you should make folders in it for  css and scripts

const express = require("express");
const path = require('path'); // استدعاء مكتبة path
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const app = express();
const port = 3000;

const dotenv = require('dotenv'); // npm i dotenv >> create a file named (.env) in root put in it any variables to secure it like pass 
dotenv.config(); // قراءة متغيرات البيئة من ملف .env

const db = pgp({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// التحقق من الاتصال بقاعدة البيانات
db.connect()
    .then(obj => {
        console.log('Connected to the database');
        obj.done(); // success, release the connection;
    })
    .catch(error => {
        console.error('Error connecting to the database:', error.message);
        process.exit(); // terminate the application on connection error
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const multer = require('multer'); // 
const upload = multer();
//const bodyParser = require('body-parser');  app.use(bodyParser.json());   app.use(express.urlencoded({extended:true})); // سطر مهم خاص بالبودى بارسر



// تحميل جميع الملفات في مجلد 'public' > لملفات الـ CSS والجافا سكريبت
app.use('/public', express.static('public')); 

// تعيين المجلد 'views' كمجلد للقوالب
app.set('views', path.join(__dirname, 'views'));

// تعيين نوع المحرك لقوالب الـ HTML
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);





//#region routes 

    // تحديد ملف index.html كملف رئيسي
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'index.html'));
// });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


    // تحديد ملف index2.html كملف ثانوي
app.get('/index2', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index2.html'));
});

   
    app.get('/test', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'test.html'));
    });
    
    app.get('/employees', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'employees.html'));
    });

    app.get('/attendance', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'attendance.html'));
    });

//#endregion

app.get('/getEmployees', async (req, res) => {
    try {
        const data = await db.any('SELECT id, employee_name, datex FROM employees');
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).send('Error fetching data');
    }
});

//#endregion






app.listen(port, () => {
    console.log(`السيرفر يعمل على http://localhost:${port}`);
});

