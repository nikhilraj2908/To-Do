function loadpage(pageName) {
    $.ajax({
        method: "get",
        url: `../public/${pageName}`,
        success: (responce) => {
            $('section').show();
            $('section').html(responce);
            $('#btn-container').hide()
        }
    })
}
function LoadMain(){
    $('main').html("")
                $.ajax({
                    method: 'get',
                    url: `http://127.0.0.1:2908/get-tasks/${$.cookie('userid')}`,
                    success: (tasks) => {
                        $("#lblusername").html($.cookie("username"))
                        tasks.map(task => {
                            $(`
                        <div class="alert alert-success">
                          <h4 class="d-flex justify-content-between">${task.title}</h4>
                          <p>${task.discription}</p>
                          <p>${task.date}</p>
                          <button value=${task.appointID} data-bs-target="#modal-container-edit" data-bs-toggle="modal" class="btn btn-warning" id="btnedittask">Edit</button>
                          <button class="btn btn-danger" value=${task.appointID} id="btndlttask">delete</button>
                        </div>
                     `).appendTo("main");
                        })
                    }
                })
}
function requestdashboard() {
    $.ajax({
        method: "get",
        url: "http://localhost:2908/get-users",
        success: (responce) => {
            var user = responce.find(user => user.userID == $("#signinID").val())
            $.cookie("username", user.userName)
            $.cookie("userid", user.userID)
            loadpage("dashboard_login.html")
            $.ajax({
                method: 'get',
                url: `http://127.0.0.1:2908/get-tasks/${user.userID}`,
                success: (tasks) => {
                    $("#lblusername").html($.cookie("username"))
                    tasks.map(task => {
                        $(`
                    <div class="alert alert-success">
                      <span><h4 class="d-flex justify-content-between">${task.title}</h4></span>
                      <p>${task.discription}</p>
                      <p>${task.date}</p>
                      <button id="btnedittask" value=${task.appointID} data-bs-target="#modal-container-edit" data-bs-toggle="modal" class="btn btn-warning">Edit</button>
                      <button id="btndlttask" value=${task.appointID} class="btn btn-danger">delete</button>
                    </div>
                 `).appendTo("main");
                    })
                }
            })
        }
    })

}
$(function () {
    $('#registeruser').click(() => {
        loadpage("ragister_user.html")
    })
    $(document).on('click', "#btncancel", () => {
        $("#btn-container").show();
        $('section').hide()
    })
    $("#signinUser").click(() => {
        loadpage("signin_user.html")
    })
    $(document).on("click", "#btnSignin", () => {
        $.ajax({
            method: "get",
            url: "http://localhost:2908/get-users",
            success: (responce) => {
                var user = responce.find(user => user.userID == $("#signinID").val())
                if (user.password == $("#signinPass").val()) {
                    requestdashboard();
                } else {
                    alert("wrong info")
                }
            }
        })

    })
    $(document).on("click", "#btnsignout", () => {
        $.removeCookie("username")
        $.removeCookie("userid");
        loadpage("signin_user.html")

    })
    $(document).on("click", "#btnFrmRegister", () => {
        var user = {
            userID: $("#userID").val(),
            userName: $("#userName").val(),
            password: $("#password").val(),
            emailID: $("#emailID").val(),
            mobile: $("#mobileNo").val()
        };
        $.ajax({
            method: "post",
            url: "http://127.0.0.1:2908/register-user",
            data: user,
            success: () => {
                alert("ragisteres succefully");
                loadpage("signin_user.html")
            }
        })
    })
    $(document).on("click", "#btnaddappoint", () => {
        var task = {
            userID: $.cookie("userid"),
            appointID: $("#Add_appointID").val(),
            title: $("#Add_title").val(),
            date: $("#Add_date").val(),
            discription: $("#Add_discription").val()
        };
        $.ajax({
            method: "post",
            url: "http://127.0.0.1:2908/add-task",
            data: task,
            success: () => {
                alert("added succefully");
                LoadMain();
            }
        })
    })
    $(document).on("click","#btndlttask",(e)=>{
        var id=e.target.value;
        var choice=confirm("are you sure \n want to delete this??")
        if(choice==true){
            $.ajax({
                method:"delete",
                url:`http://127.0.0.1:2908/delete-task/${id}`,
                success:()=>{
                    LoadMain();
                }
            })
        }
    })
    $(document).on("click","#btnedittask",(e)=>{
        $.ajax({
            method: "get",
            url: `http://127.0.0.1:2908/get-appoint/${e.target.value}`,
            success: (tasks) => {
                var datestring=tasks[0].date
                $("#edit_appointID").val(tasks[0].appointID)
                $("#edit_title").val(tasks[0].title)
                $("#edit_discription").val(tasks[0].discription)
                $("#edit_date").val(datestring.substring(datestring.indexOf("T"),0))
                
            }
        })  
    })
    $(document).on("click","#btnsaveappoint",(e)=>{
        var task = {
            userID: $.cookie("userid"),
            appointID: $("#edit_appointID").val(),
            title: $("#edit_title").val(),
            date: $("#edit_date").val(),
            discription: $("#edit_discription").val()
        };
        $.ajax({
            method:"put",
            url:`http://127.0.0.1:2908/edit-task/${$("#edit_appointID").val()}`,
            data:task,
            success:()=>{
                alert("task edited")
                LoadMain()
            }
        })
    })
})
