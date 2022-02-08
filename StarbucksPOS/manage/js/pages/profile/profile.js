let token = window.sessionStorage.getItem('TOKEN_KEY');
if (token === null) {
    window.location.href = 'error.html';
}
checkAuthority();
let image = '';
let fbBucketName = 'images/core-image';
let fileButton = document.getElementById('fileButton');
let users = JSON.parse(window.sessionStorage.getItem('USERS_KEY'));
let id = users.id
let name = users.name
let img = users.avatar
let email = users.email
let username = users.username
let role = users.roles

$(document).ready(function () {
    $('#nameOfUser').text(name);
    $('#userNameContext').text(name);
    $('#userEmailContext').text(email);
    $('#userAvatar').attr('src', img);
    $('#userAvatarContext').attr('src', img);
    $('#userNickName').attr('value', name);
    $('#userId').attr('value', username);
    $('#userIdNumber').attr('value', id);
    $('#userEmail').attr('value', email);
    $('#userAvatarEdit').attr('value', img);

    let str = "";
    for (let i = 0; i < role.length; i++) {
        str += `<span>${role[i].name}</span>`
        str += `<br>`
    }
    document.getElementById("roles").innerHTML = str;

});

const firebaseConfig = {
    apiKey: "AIzaSyC8DOQubJy7nwFL27yDZzlUIvQGLK4OwLI",
    authDomain: "casemodule4-b9134.firebaseapp.com",
    projectId: "casemodule4-b9134",
    storageBucket: "casemodule4-b9134.appspot.com",
    messagingSenderId: "860257443056",
    appId: "1:860257443056:web:ba0a8cf1a83dac0d2d3635",
    measurementId: "G-CR5WT2DV9P"
};
firebase.initializeApp(firebaseConfig);

fileButton.addEventListener('change', function (e) {
    let file = e.target.files[0];
    let storageRef = firebase.storage().ref(`${fbBucketName}/${file.name}`);
    let uploadTask = storageRef.put(file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function (snapshot) {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploader.value = progress;
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'

                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'

                    break;
            }
        }, function (error) {
            switch (error.code) {
                case 'storage/unauthorized':
                    break;
                case 'storage/canceled':
                    break;
                case 'storage/unknown':
                    break;
            }
        }, function () {
            let downloadURL = uploadTask.snapshot.downloadURL;
            image = downloadURL;
            console.log(image)
        });
});

function checkAuthority() {
    $.ajax({
        type: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: 'http://localhost:8080/storemanager',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        //xử lý khi thành công
        success: function () {
        },
        error: function (err) {
            window.location.href = '403.html';
        }
    })
}

function updateProfile() {
    let id = document.getElementById("userIdNumber").value;
    let name = document.getElementById("userNickName").value;
    let username = document.getElementById("userId").value;
    let email = document.getElementById("userEmail").value;
    let password = document.getElementById("userPassWord").value;
    if (password === "password") {
        password = "";
    }
    if (image === "") {
        image = document.getElementById("userAvatarEdit").value;
    }
    let users = {
        id : id,
        name : name,
        username : username,
        email : email,
        avatar : image,
        password : password,
        roles : role
    }
    console.log(JSON.stringify(users))

    $.ajax({
        type: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: 'http://localhost:8080/storemanager/edit',
        data: JSON.stringify(users),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        //xử lý khi thành công
        success: function (data) {
            window.sessionStorage.removeItem('USERS_KEY');
            window.sessionStorage.setItem('USERS_KEY',JSON.stringify(data));
        },
        error: function (err) {
            console.log(err);
        }
    })

}