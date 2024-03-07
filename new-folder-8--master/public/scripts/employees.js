// Auto resize For ifram(localSpace) in index.html
function adjustIframeHeight() {
    var iframe = parent.document.getElementById("localspace");
    iframe.style.minHeight = iframe.contentWindow.document.body.scrollHeight + "px";
}





// إعلان المتغير على مستوى الـ script  
const tableContainer = document.getElementById('table-container');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');

const employeeNameInput = document.getElementById('employee_name_input');
const employeeIdInput = document.getElementById('employee_id');
const saveBtn = document.getElementById('saveBtn');



//#region  ( baynat el employees mn el database )
// get data from db and store it in array1
let array1 = [];
let array1Copy = [];
let slice_Array1 = [];

async function getEmployeesData_fn() {
    const response = await fetch('/getEmployeesData');
    const data = await response.json();
    array1 = data;

    // تحديث array1Copy بنتيجة الـ slice
    array1Copy = array1.slice();
}

async function showFirst50RowAtTheBegening() {
    await getEmployeesData_fn()
    slice_Array1 = array1Copy.slice(0, 50); // انشاء مصفوفه جديده تحتوى على اول 50 سطر من البيانات فقط
    fillAttendancetable()
}

document.addEventListener("DOMContentLoaded", function () {
    // استدعاء الدالة عندما تكتمل تحميل الصفحة
    showFirst50RowAtTheBegening();
});

async function fillAttendancetable() {
    //  @@ هاااااام جدا 
    // el properties beta3 kol 3amod ytm wad3ha fe el <thead></thead> And <tbody></tbody> And <tfoor></tfoor> kol wa7ed lewa7do
    // el properties hya :
    // 1 : diplay: none; > fe 7alt enak ardt e5fa2 el 3amod -- display: ; hatspha fadya fe7alt enak ardt tezhr el 3amod
    // 2 : white-space: nowrap;  fe 7alt enak ardt en el text maylfsh ta7t ba3do  -- white-space: wrap; fe 7alt enak ardt en el tezt ylf
    // 3 : width: auto;  fe 7alt enak ardt en ykon 3ard el 3amod 3ala ad el mo7tawa -- width: 100%; fe 7alt enak ardt en el 3amod ya5od ba2y el mesa7a el fadla
    // 4 : text-align: center / left / right / justify   da 3ashan tet7km fe el text ymen wala shemal wala fe ele nos
    
        // إعداد رأس الجدول
        let tableHTML = `<table id="employees_table" class="review_table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>ID</th>
                                <th>اسم الموظف</th>
                            </tr>
                            </thead>
                            <tbody>`;

        // إضافة صفوف الجدول بناءً على البيانات
        // slice_Array1 = ""; // تفريغ المصفوفه
        slice_Array1.forEach(employee => {
            tableHTML += `<tr>
                            <td> <button class="button_table_edite" onclick="displayEmployeeData(${employee.id})">تحرير</button> </td>
                            <td>${employee.id}</td>
                            <td style="width: 100%;">${employee.name}</td>
                          </tr>`;
        });

        tableHTML += `</tbody>
        <tfoot>
            <tr>
            <td id="tfooter1"></td>
            <td id="tfooter2"></td>
            <td id="tfooter3"></td>
            </tr>
                        <tr>
                            <td colspan="3">
                                <div class='flex_H'>
                                 <button class="login_button" type="submit" id="updateBtn" onclick="ShowAllDataInAttendanceTable()">All</button>
                                 <button class="login_button" type="submit" id="updateBtn" onclick="showFirst50RowInAttendanceTable()">50</button>
                                </div>
                            </td>
                        </tr>
                    </tfoot>`;

        // إغلاق الجدول
        tableHTML += '</table>';

        // تحديث محتوى الصفحة بناءً على البيانات
        tableContainer.innerHTML = tableHTML;
          //  عمليات صف الاجمالى 
          // جمع القيم في العمود رقم 6
          

//   let totalColumn_Valuu = 0;
//   slice_Array1.forEach(row => {
//     // جمع الاعمده
//     totalColumn_Valuu += row.id; // id hena how esm el column ely mawgod fe el array nafsaha EX. ( row.employee_id ,row.value,row.note ) we kmsal fakt
//     // totalColumn6 += row.employee_id; // value hena how esm el column ely mawgod fe el array nafsaha EX. ( row.employee_id ,row.value,row.note )
// });


// document.getElementById("tFooter6").textContent = totalColumn_Valuu;
document.getElementById("tfooter1").textContent = slice_Array1.length; //  عدد الصفوف

adjustIframeHeight()

}


// search in attendanceTable
async function performSearch() {
    // الحصول على قيمة البحث
    const searchValue = searchInput.value.trim().toLowerCase();

    // فلترة البيانات بناءً على قيمة البحث
    array1Copy = array1.filter(employee => {
        // التحقق من أن employee.id و employee.name ليستان فارغتين
        const idMatch = employee.id && employee.id.toString().toLowerCase().includes(searchValue);
        const nameMatch = employee.name && employee.name.toLowerCase().includes(searchValue);
        return idMatch || nameMatch;
    });

    slice_Array1 = array1Copy.slice(0, 50); // انشاء مصفوفه جديده تحتوى على اول 50 سطر من البيانات فقط
    fillAttendancetable()
}

async function ShowAllDataInAttendanceTable(){
    slice_Array1 = array1Copy.slice(); // انشاء مصفوفه جديده تحتوى على اول 50 سطر من البيانات فقط
    fillAttendancetable()
}

async function showFirst50RowInAttendanceTable(){
    slice_Array1 = array1Copy.slice(0,50); // انشاء مصفوفه جديده تحتوى على اول 50 سطر من البيانات فقط
    fillAttendancetable()
}

// clearArrow1 fe el search dive
document.querySelector('#clearArrow1').addEventListener('click', function () {
    document.getElementById('searchInput').innerText = ""
    showFirst50RowAtTheBegening();
})




searchBtn.addEventListener('click', performSearch);

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        performSearch();
    }

});


function displayEmployeeData(employeeId) {
    // عثر على الموظف باستخدام معرف الموظف
    const selectedEmployee = array1.find(X => X.id === employeeId);

    // اعرض بيانات الموظف في الفورم



    employeeNameInput.value = selectedEmployee.name;
    employeeIdInput.value = selectedEmployee.id;
    saveBtn.style.display = 'none'
    // saveBtn.style.display = 'block'

    // input text focus
    if (employeeNameInput) {
        employeeNameInput.focus();
    }

}


function saveEmployee() {
    // 1. الحصول على قيمة اسم الموظف
    const employeeName = document.getElementById('employee_name_input').value.trim();

    // 2. التحقق إذا كان اسم الموظف غير فارغ

    if (!employeeName) {
        alert(`ادخل اسم الموظف`);
        return;
    }

    // Confirmation

    if (!confirm(`Please Confirm..
              DOyou want to continue saving ?`)) {
        return;
    }





    // 3. إرسال طلب POST إلى الخادم
    fetch('/addNewEmployee', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            employee_name_input: employeeName
        })
    })
        // 4. معالجة الرد من الخادم
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    // 5.1. التحقق من رسالة الخطأ وعرض تنبيه
                    if (error.success === false && error.message === 'اسم الموظف موجود بالفعل') {
                        alert(`اسم الموظف موجود من قبل`)
                        // لا تقوم بإعادة تحميل الصفحة هنا
                    } else {
                        // 5.2. عرض رسالة خطأ في وحدة التحكم
                        console.error('Error from server:', error.message);
                        alert(`حدث خطأ اثناء حفظ البيانات`);
                    }

                    throw new Error('خطأ في الطلب');
                });
            }
            // 6. إذا كان الرد ناجحًا، قراءة البيانات من الخادم
            return response.json();
        })
        // 7. معالجة البيانات الردة
        .then(data => {
            if (data.success) {
                // 8.1. عرض تنبيه بنجاح الحفظ وإعادة تحميل الصفحة
                alert(`تم الحفظ بنجاح`);
                location.reload();
            } else if (data.message === 'اسم الموظف موجود بالفعل') {
                // 8.2. عرض تنبيه بأن اسم الموظف موجود بالفعل
                alert(`اسم الموظف موجود من قبل`);
            } else {
                // 8.3. عرض تنبيه بحدوث خطأ غير متوقع
                console.error('Error from server:', data.message);
                alert(`حدث خطأ اثناء حفظ البيانات`);
            }
        })
        // 9. التعامل مع الأخطاء العامة
        .catch(error => {
            console.error('Error saving employee:', error.message);
            alert(`حدث خطأ اثناء حفظ البيانات`);
        });

} // #end saveEmployee function



function updateEmployee() {
    // 1. الحصول على قيمة اسم الموظف
    const employeeName = document.getElementById('employee_name_input').value.trim();
    const employeeId = document.getElementById('employee_id').value.trim();

    // 2. التحقق إذا كان اسم الموظف غير فارغ
    if (!employeeName) {
        alert(`ادخل اسم الموظف`);
        return;
    }

    if (!confirm(`Please Confirm..
              do you want to continue edite ?`)) {
        return;
    }


    // 3. إرسال طلب POST إلى الخادم
    //  el fetch('/updateEmployee'  >> da mawgod fe saf7t el server lazem ykon bnfs el esm
    fetch('/updateEmployee', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            employee_name_input: employeeName,
            employee_id: employeeId
        })
    })
        // 4. معالجة الرد من الخادم
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    // 5.1. التحقق من رسالة الخطأ وعرض تنبيه
                    if (error.success === false && error.message === 'اسم الموظف موجود بالفعل') {
                        alert(`اسم الموظف موجود من قبل`)
                        // لا تقوم بإعادة تحميل الصفحة هنا
                    } else {
                        // 5.2. عرض رسالة خطأ في وحدة التحكم
                        console.error('Error from server:', error.message);
                        alert(`حدث خطأ اثناء تعديل البيانات`);
                    }

                    throw new Error('خطأ في الطلب');
                });
            }
            // 6. إذا كان الرد ناجحًا، قراءة البيانات من الخادم
            return response.json();
        })
        // 7. معالجة البيانات الردة
        .then(data => {
            if (data.success) {
                // 8.1. عرض تنبيه بنجاح الحفظ وإعادة تحميل الصفحة
                alert(`تم الحفظ بنجاح`);
                location.reload();
            } else if (data.message === 'اسم الموظف موجود بالفعل') {
                // 8.2. عرض تنبيه بأن اسم الموظف موجود بالفعل
                alert(`اسم الموظف موجود من قبل`);
            } else {
                // 8.3. عرض تنبيه بحدوث خطأ غير متوقع
                console.error('Error from server:', data.message);
                alert(`حدث خطأ اثناء تعديل بيانات الموظف`);
            }
        })
        // 9. التعامل مع الأخطاء العامة
        .catch(error => {
            console.error('Error saving employee:', error.message);
            alert(`حدث خطأ اثناء تعديل بيانات الموظف`);
        });

} // function updateEmployee()


//#region 