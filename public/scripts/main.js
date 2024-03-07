
//#region main page


// openPages 
function adjustIframeHeight() {
    //   parent.document.body.style.height = '100vh' // رد طول البودى الى اصله كبدايه
      var iframe = parent.document.getElementById("localspace");
      iframe.style.minHeight = iframe.contentWindow.document.body.scrollHeight + "px";
    }

function adjustIframeHeight() {
    document.body.style.height = '100vh'; // رد طول البودى الى اصله كبدايه
    const iframe = document.getElementById("localspace");
    iframe.style.height = iframe.contentWindow.document.body.scrollHeight + "px";
}

function openPage(pageName) {
    const iframe = document.getElementById('localspace');
    iframe.src = `/${pageName}`; // pagename without use .html

    iframe.onload = function() {
        adjustIframeHeight();
    };
    
    return false;
}





function test(){


    const root = document.querySelector(':root');
    const rootstyles = getComputedStyle(root);
    const backGroundColor_sections = rootstyles.getPropertyValue('--backGroundColor_sections');
    
    rootstyles.setProperty('--backGroundColor_sections', 'red')

}

//#endregion 

//#region "Dark Mode"
//----------------------------
// hanshof eza kan feh value fe el local storage wala no , Low magod value hanst7derha
if (localStorage.getItem("--backGroundColor_body") != null) {
    document.documentElement.style.setProperty('--backGroundColor_body', localStorage.getItem("--backGroundColor_body"));
    document.documentElement.style.setProperty('--backGroundColor_sections', localStorage.getItem("--backGroundColor_sections"));
    document.documentElement.style.setProperty('--backGroundColor_btn_hover', localStorage.getItem("--backGroundColor_btn_hover"));
    document.documentElement.style.setProperty('--borderColor_focus', localStorage.getItem("--borderColor_focus"));
    document.documentElement.style.setProperty('--Font_normal', localStorage.getItem("--Font_normal"));
    document.documentElement.style.setProperty('--Font_Color', localStorage.getItem("--Font_Color"));
    document.documentElement.style.setProperty('--border_normal', localStorage.getItem("--border_normal"));
    document.documentElement.style.setProperty('--border_normal_hover', localStorage.getItem("--border_normal_hover"));
    document.documentElement.style.setProperty('--box_shadow_border', localStorage.getItem("--box_shadow_border"));
    document.documentElement.style.setProperty('--sound_cloud_backgroundcolor', localStorage.getItem("--sound_cloud_backgroundcolor"));
    document.documentElement.style.setProperty('--icon_color', localStorage.getItem("--icon_color"));
}

// function de 5asa be zorar el darkmode 
function dark_mode_fn() {
    const iframe = document.getElementById('localspace')

    const darkMode = localStorage.getItem("darkMode");
    // alert(`this is a darkmode ${darkMode}`)
    if (darkMode === "on" || darkMode === null) {
        // hena lazem t7ot el value el wel fe el local storage 3ashan lama y3mel refrsh hays7ap mnha
        localStorage.setItem("--backGroundColor_body", "rgb(229, 229, 229)");
        localStorage.setItem("--backGroundColor_sections", "rgb(250, 250, 250)");
        localStorage.setItem("--backGroundColor_btn_hover", "rgb(230, 230, 230)");
        localStorage.setItem("--borderColor_focus", "rgb(255, 85, 0)");
        /* font: [ [ <'font-style'> || <'font-variant'> || <'font-weight'> ]? <'font-size'> [ / <'line-height'> ]? <'font-family'> ] :  */
        localStorage.setItem("--Font_normal", "normal normal normal 1.3rem/1.3rem  Helvetica, Courier New, Segoe UI, Times New Roman, Arial, sans-serif");
        localStorage.setItem("--Font_Color", "rgb(51, 51, 51)");
        localStorage.setItem("--border_normal", "1px solid #cccccc");
        localStorage.setItem("--border_normal_hover", "1px solid #66afe9");
        localStorage.setItem("--box_shadow_border", "inset 0 1px 1px rgb(0 0 0 / 8%), 0 0 8px hsla(207, 75%, 66%, 0.6)");
        localStorage.setItem("--icon_color", "rgb(51, 51, 51)");

        
        localStorage.setItem("darkMode", "off")
        location.reload()
        // iframe.contentWindow.location.reload();
}   else {
        document.documentElement.style.setProperty('--backGroundColor_body', '#001');
        localStorage.setItem("--backGroundColor_sections", "#123");
        localStorage.setItem("--backGroundColor_btn_hover", "#ffffff55");
        localStorage.setItem("--borderColor_focus", "rgb(255, 85, 0)");

        localStorage.setItem("--icon_color", "white");

        localStorage.setItem("darkMode", "on")
        location.reload()
        // iframe.contentWindow.location.reload();
    };
};


//-----------------------
//#endregion

//#region dropdown
const dropdowns = document.querySelectorAll(".dropdown");

dropdowns.forEach(dropdown => {
    const dropdown_select = dropdown.querySelector(".dropdown_select");
    const dropdown_menue = dropdown.querySelector(".dropdown_menue");
    // show menue
    dropdown_select.addEventListener("click", function(){
        dropdown_menue.classList.toggle("active");
    });

    // when click out of dropdown
    document.addEventListener("click", function(event){
        if (!dropdown.contains(event.target)){ // ! ta3nt 3aks el el value ya3ny  if el target ely dost 3aleh click ((msh)) wa7ed mn 3nasr el dropdwon
            dropdown_menue.classList.remove("active")
        }
    });

    // when click Esc 
    document.addEventListener("keydown",function(event){
        if (event.keyCode === 27) {
            if (dropdown.contains(event.target)){
                dropdown_menue.classList.remove("active");
            };
        };
    });
});


//#region Open Menue
const MenueIcon = document.querySelector('#MenueIcon');
const sidebar_Parent = document.querySelector('#sidebar_Parent');
const closeMenueIcon = document.querySelector('#closeMenueIcon');

// اظهار القائمة بشكل ثابت عند الضغط على زرار القائمة
MenueIcon.addEventListener('click',function () {
        sidebar_Parent.classList.toggle("sidebar_parent_Media_Show"); 
})

// اخفاء القائمة عند الضغط على زر الاغلاق الموجود فى اعلى القائمة
closeMenueIcon.addEventListener('click', function(){
    sidebar_Parent.classList.add("sidebar_Parent_Media_hidden"); // اخفاء القائمة الطبيعيه الاصليه
    sidebar_Parent.classList.remove("sidebar_parent_Media_Show"); // اخفاء القائمة اذا كانت مفتوحه من الزرار ايضا
})

//  التحكم فى اظهار القائمة عن التصغير والتكبير
  function menueShow() {
    const width = window.innerWidth;
    if (width < 750) {
        MenueIcon.classList.add("MenueIcon_Width750"); // اظهار ايقون القائمة
        sidebar_Parent.classList.add("sidebar_Parent_Media_hidden"); // اخفاء القائمة
        
    }
    else{
        MenueIcon.classList.remove("MenueIcon_Width750");
        sidebar_Parent.classList.remove("sidebar_Parent_Media_hidden"); // اخفاء القائمة
        sidebar_Parent.classList.remove("sidebar_parent_Media_Show"); // اخفاء القائمة اذا كانت مفتوحه من الزرار ايضا
    }
  }

  window.addEventListener('load', menueShow);  // استدعاء الدالة عند تحميل الصفحة
  window.addEventListener('resize', menueShow); // استدعاء الدالة عند تغيير حجم الشاشه


//#endregion Open Menue



//#endregion

