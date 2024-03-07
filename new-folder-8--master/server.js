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



//#region Page : index.html



//#endregion



//#region Page : index2.html




//#endregion



//#region Page : employees.html

    // Add new employee
app.post('/addNewEmployee', (req, res) => {
    const { employee_name_input } = req.body;
    const today = new Date();
    const date = today.toLocaleDateString();

    // التحقق من وجود اسم الموظف في قاعدة البيانات بعد استخدام trim
    db.any('SELECT * FROM employees WHERE TRIM(employee_name) = ?', [employee_name_input.trim()], (err, row) => {
        if (err) {
            console.error('Error checking employee existence:', err.message);
            return res.status(500).send('Error checking employee existence');
        }

        // إذا كان اسم الموظف موجودًا بالفعل، أرجع رسالة خطأ
        if (row) {
            return res.json({ success: false, message: 'اسم الموظف موجود بالفعل' });
        }

        // إذا لم يكن الاسم موجودًا، قم بإضافته إلى قاعدة البيانات بعد استخدام trim
        db.none('INSERT INTO employees (employee_name, datex) VALUES (?, ?)', [employee_name_input.trim(), date], function (err) {
            if (err) {
                console.error('Error recording attendance:', err.message);
                return res.status(500).send('Error recording attendance');
            }

            res.json({ success: true, message: 'تم حفظ الموظف بنجاح' });
        });
    });
});

// Update Employee Name
app.post('/updateEmployee', (req, res) => {

        /* 1 : declear variables from attendance.js > function UpdateAttendanceData() 
            de el data ely hast2plha mn el front end to el server here lazem tkon nafs el el names fe el goz2 body: JSON.stringify({
    */
    const { employee_name_input, employee_id } = req.body;
    const today = new Date();
    const date = today.toLocaleDateString();

    // التحقق من وجود اسم الموظف في قاعدة البيانات بعد استخدام trim
    db.any('SELECT * FROM employees WHERE TRIM(id) != ? And trim(employee_name) = ?',
     [employee_id,employee_name_input.trim()],
     (err, row) => {
        if (err) {
            console.error('Error checking employee existence:', err.message);
            return res.status(500).send('Error checking employee existence');
        }

        // إذا كان اسم الموظف موجودًا بالفعل، أرجع رسالة خطأ
        if (row) {
            return res.json({ success: false, message: 'اسم الموظف موجود بالفعل' });
        }

        // إذا لم يكن الاسم موجودًا، قم بإضافته إلى قاعدة البيانات بعد استخدام trim
        db.none(`UPDATE employees
                SET employee_name = ?
                Where id = ?`,
         [employee_name_input.trim(), employee_id], function (err) {
            if (err) {
                console.error('Error recording attendance:', err.message);
                return res.status(500).send('Error recording attendance');
            }

            res.json({ success: true, message: 'تم حفظ الموظف بنجاح' });
        });
    });
});
    



    // get all d employees data
app.get('/getEmployeesData', async (req, res) => {

    db.any('SELECT e.id, e.employee_name FROM employees e', (err, rows) => {
        if (err) {
            console.error('Error fetching data:', err.message);
            return res.status(500).send('Error : getEmployeesData'); 
        }
    
        const data = rows.map(row => ({
            id: row.id,
            name: row.employee_name
        }));
    
        res.json(data);
      });
    });

//#endregion



//#region attendance

    // 1 :- Add new attendance
    app.post('/addNewAttendance', (req, res) => {
        const { id_hidden_input, numberInput, datepicker, numberNote } = req.body;
        
                  // get today in formate yyyy-mm-dd
                //   const date = new Date();
                //   const year = date.getUTCFullYear();
                //   const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
                //   const day = date.getUTCDate().toString().padStart(2, '0');
                //   const today = `${year}-${month}-${day}`;
                  const today = new Date().toISOString().split('T')[0]; // date in formate (yyyy-mm-dd)

        // ابدأ المعاملة
        db.none('BEGIN TRANSACTION');
      
        try {

          // قم بتشغيل استعلام SQL لإدراج بيانات الحضور
          db.none('INSERT INTO attendance (employee_id,datex,value,note,last_update) VALUES (?,?,?,?,?)',
            [id_hidden_input,datepicker,numberInput,numberNote,today],
            function (err) {
              if (err) {
                // حدث خطأ، قم باسترجاع المعاملة
                db.none('ROLLBACK');
                console.error('Error recording attendance:', err.message);
                return res.status(500).send('Error recording attendance');
              }
      
              // تم إدراج البيانات بنجاح، قم بتأكيد المعاملة
              db.none('COMMIT');
              console.log(`تم عمليه الحفظ بنجاح`);
              res.json({ success: true, message: 'تم حفظ الموظف بنجاح' });
            }
          );
        } catch (error) {
          // حدث خطأ غير متوقع، قم باسترجاع المعاملة
          db.none('ROLLBACK');
          console.error('Unexpected error:', error.message);
          res.status(500).send('Unexpected error');
        }
      });
      
    

// 2:- get data to fill dropdownbox of employees
app.get('/getEmployeesData1',(req, res) => {
    db.any('SELECT e.id, e.employee_name FROM employees e', (err, rows) => {
      if (err) {
        console.error('Error fetching data:', err.message);
        return res.status(500).send('Error fetching data'); 
      }
    
      const data = rows.map(row => ({
        id: row.id,
        name: row.employee_name
      }));
    
      res.json(data);
     });
    });


    


// 3:- get data for review tables
app.get('/getEAttendanceData',(req, res) => {
      db.any(`SELECT A.id, A.employee_id, E.employee_name, A.datex,A.value,A.note,A.last_update
      FROM Attendance A
      LEFT JOIN  employees E on A.employee_id = E.id`, (err, rows) => {
        if (err) {
          console.error('Error fetching data:', err.message);
          return res.status(500).send('Error fetching data'); 
        }
      
        const data = rows.map(row => ({
          id: row.id,
          employee_id: row.employee_id,
          employee_name: row.employee_name,
          datex: row.datex,
          value: row.value,
          note: row.note,
          last_update: row.last_update
        }));
      
        res.json(data);
       });
      });


      // 4:- Update Attendance data
app.post('/updateAttendance', (req, res) => {
    console.log(`server : updateAttendance started`);
    const {id_hidden_input,selectedRowIdInput,datepicker,numberNote,numberInput} = req.body;
                const today = new Date().toISOString().split('T')[0]; // date in formate (yyyy-mm-dd)

        console.log(`sql statment will start now`);
        
            db.none(`UPDATE attendance
                    SET employee_id = ?,
                    value = ?,
                    datex = ?,
                    note = ?,
                    last_update = ?
                    Where id = ?`, 
            [id_hidden_input,numberInput,datepicker,numberNote,today,selectedRowIdInput], function (err) {
            if (err) {
                console.error('Error recording attendance:', err.message);
                return res.status(500).send('Error recording attendance');
            }

            res.json({ success: true, message: 'تم حفظ الموظف بنجاح' });
        });
    });

    
//#endregion ( Attendance page )


app.listen(port, () => {
    console.log(`السيرفر يعمل على http://localhost:${port}`);
});

