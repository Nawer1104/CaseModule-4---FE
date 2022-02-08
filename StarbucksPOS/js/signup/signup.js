let dropDownRole = $("#dropDownRole");

$(document).ready(function (){
    showListRoles();
    let signUpForm = {};
    let noUser = {
        message: "username_existed"
    }
    let noEmail = {
        message: "email_existed"
    }
    let createSuccess = {
        message: "yes"
    }
    $('#btn-create-account').click(function (){
        signUpForm.name = $('#InputUserName').val();
        signUpForm.username = $('#InputId').val();
        signUpForm.email = $('#InputEmail').val();
        signUpForm.password = $('#InputPassword').val();
        signUpForm.roles = [$('#dropDownRole').val()];
        let signUpFormOBJ = JSON.stringify(signUpForm);
        console.log('signUpFormOBJ === ',signUpFormOBJ)
        $.ajax({
            async: false,
            url: 'http://localhost:8080/api/auth/signup',
            data: signUpFormOBJ,
            type: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf8'
            },
            success: function (data){
                console.log('data ===', data);
                if(JSON.stringify(data)==JSON.stringify(noUser)){
                    document.getElementById('statusAlert').innerHTML = 'The partner\'id is existed! Please try again!'
                }
                if(JSON.stringify(data)==JSON.stringify(noEmail)){
                    document.getElementById('statusAlert').innerHTML = 'The Email is existed! Please try again!'
                }
                if(JSON.stringify(data)==JSON.stringify(createSuccess)){
                    document.getElementById('statusSuccess').innerHTML = 'Create User Account Success!'
                }
            }
        })
    })
});

function showListRoles() {
    let url = "http://localhost:8080/home/roles";

    $.get(url, function (responseJSon){
        dropDownRole.empty();
        $.each(responseJSon, function (index, role) {
            $("<option>").val(role.name).text(role.name).appendTo(dropDownRole);
        });
    }).done(function (){

    }).fail(function (){

    });
}