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

//const db = pgp('postgresql://AhmedSaif500500:pD1UnvLHVok6@ep-ancient-mud-a5011hoj.us-east-2.aws.neon.tech/employee?sslmode=require'); //
const db = pgp(process.env.DB_CONNECTION_STRING); //
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
app.post('/addNewEmployee', async (req, res) => {

    try {
        const { employee_name_input } = req.body;
        const today = new Date().toISOString().split('T')[0];
        const rows = await db.any('SELECT * FROM employees WHERE TRIM(employee_name) = $1', [employee_name_input.trim()]);
        if (rows.length > 0) { // اذا حصل على نتائج 
            return res.json({ success: false, message: 'اسم الموظف موجود بالفعل' });
        }

        // إذا لم يكن الاسم موجودًا، قم بإضافته إلى قاعدة البيانات بعد استخدام trim
        await db.none('INSERT INTO employees (employee_name, datex) VALUES ($1, $2)', [employee_name_input.trim(), today]);

        res.json({ success: true, message: 'تم حفظ الموظف بنجاح' });
    } catch (error) {
        console.error('Error adding employee:', error.message);
        res.status(500).json({ success: false, message: 'حدث خطأ أثناء اضافة  الموظف' });
    }

});

// Update Employee Name
app.post('/updateEmployee', async (req, res) => {
    try {

        const { employee_name_input, employee_id } = req.body; // de el data ely hast2plha mn el front end to el server here lazem tkon nafs el el names fe el goz2 body: JSON.stringify({

        const today = new Date().toISOString().split('T')[0];

        const rows = await db.any('SELECT * FROM employees WHERE id != $1 And trim(employee_name) = $2',
            [employee_id, employee_name_input.trim()]);

        // إذا كان اسم الموظف موجودًا بالفعل، أرجع رسالة خطأ
        if (rows.length > 0) {
            return res.json({ success: false, message: 'اسم الموظف موجود بالفعل' });
        }

        // إذا لم يكن الاسم موجودًا، قم بإضافته إلى قاعدة البيانات بعد استخدام trim
        await db.none(`UPDATE employees
        SET employee_name = $1
        Where id = $2`,
            [employee_name_input.trim(), employee_id]);

        // إعادة تحميل الصفحة بمجرد اكتمال العمليات
        res.json({ success: true, message: 'تم حفظ الموظف بنجاح' });
      
    } catch (error) {
        console.error('Error updating employee:', error.message);
        res.status(500).json({ success: false, message: 'حدث خطأ أثناء تحديث الموظف' });
    }

});




//_______________________________________________

// get all d employees data
app.get('/getEmployeesData', async (req, res) => {
    try {
        const rows = await db.any('SELECT e.id, e.employee_name FROM employees e');

        const data = rows.map(row => ({
            id: row.id,
            name: row.employee_name
        }));

        res.json(data);
    } catch (err) {
        console.error('Error fetching data:', err.message);
        res.status(500).send('Error: getEmployeesData');
    }
});

//#endregion



//#region attendance

// 1 :- Add new attendance
app.post('/addNewAttendance', async (req, res) => {
    const { id_hidden_input, numberInput, datepicker, numberNote } = req.body;
    const today = new Date().toISOString().split('T')[0]; // date in format (yyyy-mm-dd)

    try {
        await db.none('BEGIN TRANSACTION'); // start transaction

        // Run SQL query to insert attendance data
        await db.none('INSERT INTO attendance (employee_id, datex, value, note, last_update) VALUES ($1, $2, $3, $4, $5)',
            [id_hidden_input, datepicker, numberInput, numberNote, today]
        );

        // Commit the transaction
        await db.none('COMMIT');
        
        // إعادة تحميل الصفحة بمجرد اكتمال العمليات
        res.json({ success: true, message: 'تم حفظ الموظف بنجاح' });

    } catch (error) {
        await db.none('ROLLBACK');
        console.error('خطأ في تسجيل الحضور:', error.message);
        res.status(500).json({ success: false, message: 'خطأ في تسجيل الحضور' });
    }
});




// 2:- get data to fill dropdownbox of employees
app.get('/getEmployeesData1', async (req, res) => {

    try {

        const rows = await db.any('SELECT e.id, e.employee_name FROM employees e');
        const data = rows.map(row => ({
            id: row.id,
            name: row.employee_name
        }));
        res.json(data);

    } catch (error) {
        console.error('Error while get Employees Data', error.message);
        res.join
        res.status(500).json({ success: false, message: 'Error while get Employees Data' });
    }
});





// 3:- get data for review tables
app.get('/getEAttendanceData', async (req, res) => {
    try {

        const rows = await db.any(`SELECT A.id, A.employee_id, E.employee_name, A.datex,A.value,A.note,A.last_update
        FROM Attendance A
        LEFT JOIN  employees E on A.employee_id = E.id
        ORDER BY A.datex DESC`);

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

    } catch (error) {
        console.error('Error get attendance Data:', error.message);
        res.status(500).json({ success: false, message: 'حدث خطأ أثناء عرض البيانات' });
    }

});


// 4:- Update Attendance data
app.post('/updateAttendance', (req, res) => {
    console.log(`server : updateAttendance started`);
    const { id_hidden_input, selectedRowIdInput, datepicker, numberNote, numberInput } = req.body;
    const today = new Date().toISOString().split('T')[0]; // date in formate (yyyy-mm-dd)

    console.log(`sql statment will start now`);

    db.none(`UPDATE attendance
                    SET employee_id = $1,
                    value = $2,
                    datex = $3,
                    note = $4,
                    last_update = $5
                    Where id = $6`,
        [id_hidden_input, numberInput, datepicker, numberNote, today, selectedRowIdInput], function (err) {
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

//  test 2

