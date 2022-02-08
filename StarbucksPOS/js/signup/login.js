$(document).ready(function (){
    let signInForm = {};
    $('#btn-login').click(function (){
        signInForm.username = $('#InputId').val();
        signInForm.password = $('#InputPassword').val();
        let signInFormOBJ = JSON.stringify(signInForm);
        console.log('signInFormOBJ == ',signInFormOBJ)
        $.ajax({
            async: false,
            url: 'http://localhost:8080/api/auth/signin',
            type: 'POST',
            data: signInFormOBJ,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf8'
            },
            success: function (data){
                console.log('data login ===> ', data)
                console.log('data.status', data.status)
                if(data.status === 202){
                    document.getElementById('statusAlert').innerHTML = 'Login Failed! Please try again!';
                    return
                }
                window.sessionStorage.removeItem('TOKEN_KEY');
                window.sessionStorage.setItem('TOKEN_KEY',data.token);
                window.sessionStorage.removeItem('USERS_KEY');
                window.sessionStorage.setItem('USERS_KEY',JSON.stringify(data.users));
                window.location.href = 'index.html';
            }
        })
    })
})