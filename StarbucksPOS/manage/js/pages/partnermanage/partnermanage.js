let users = JSON.parse(window.sessionStorage.getItem('USERS_KEY'));
let token = window.sessionStorage.getItem('TOKEN_KEY');
if (token === null) {
    window.location.href = 'error.html';
}
checkAuthority();
let name = users.name;
let img = users.avatar;
let image = '';
let Titles = $("#Titles");
let fbBucketName = 'images/core-image';
let fileButton = document.getElementById('fileButton');
$('#userAvatar').attr('src', img);
$('#nameOfUser').text(name);

$(document).ready(function () {

    loadPartnerList();
    getTitlesList();
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


function loadPartnerList() {
    $(function () {
        $.ajax({
            type: "GET",
            url: 'http://localhost:8080/storemanager/show',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            },
            //xử lý khi thành công
            success: function (data) {
                let str = "";
                for (let i = 0; i < data.length; i++) {
                    str += `<tr>`
                    str += `<td class="ps-4">${i + 1}</td>`
                    str += `<td>`
                    str += `<img src="${data[i].avatar}" alt="user-img" width="120" class="img-circle">`
                    str += `</td>`
                    str += `</td>`
                    str += `<td>`
                    str += `<h5 class="font-weight-medium mb-0">${data[i].name}</h5>`
                    str += `</td>`
                    str += `<td>`
                    str += `<span>${data[i].username}</span><br>`
                    str += `</td>`
                    str += `<td>`
                    str += `<span>${data[i].email}</span><br>`
                    str += `</td>`
                    str += `<td>`
                    for (let j = 0; j < data[i].roles.length; j++) {
                        str += `<span>${data[i].roles[j].name}</span><br>`
                    }
                    str += `</td>`
                    str += `<td>`
                    str += `<button class="btn btn-primary" data-toggle="modal" data-target="#modalCart" style="margin-right: 10px;" onclick="showEditUser(${data[i].id})"><i class="far fa-edit"></i></button>`
                    str += `<button class="btn btn-primary" onclick="deletePartner(${data[i].id})"><i class="far fa-trash-alt"></i></button>`
                    str += `</td>`
                    str += `</tr>`
                }
                document.getElementById("partnerList").innerHTML = str;
            },
            error: function (err) {
                window.location.href = '403.html';
            }
        })
    })
}

function deletePartner(id) {
    let result = confirm("Do You Want To Delete This Partner?");
    if (result) {
        $.ajax({
            type: "DELETE",
            url: 'http://localhost:8080/storemanager/delete/' + id,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            },
            //xử lý khi thành công
            success: function () {
                loadPartnerList();
                alert("Delete success!")
            },
            error: function (err) {
                console.log(err);
            }
        })
    }

}

function showEditUser(id) {
    $.ajax({
        type: "GET",
        url: 'http://localhost:8080/storemanager/get/' + id,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        //xử lý khi thành công
        success: function (data) {
            document.getElementById("id").value = data.id;
            document.getElementById("nameEdit").value = data.name;
            document.getElementById("imgEdit").value = data.avatar;
            document.getElementById("idEdit").value = data.username;
            document.getElementById("emailEdit").value = data.email;
            document.getElementById("reviewImg").innerHTML = "<img src=" + data.avatar + " \"" + "height='150' width='200'>";
            $('#mess').text("");
        },
        error: function (err) {
            console.log(err);
        }
    })
}

function getTitlesList() {
    $.ajax({
        type: "GET",
        url: 'http://localhost:8080/storemanager/getTitle',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        //xử lý khi thành công
        success: function (s) {
            $.each(s, function (index, title) {
                $("<option>").val(title.name).text(title.name).appendTo(Titles);
            });
        },
        error: function (err) {
            console.log(err);
        }
    })
}

function save() {
    let editForm = {};
    if (image === "") {
        image = document.getElementById("imgEdit").value;
    }
    let password = $('#passwordEdit').val();
    if (password === "password") {
        password = "";
    }
    editForm.id = $('#id').val();
    editForm.name = $('#nameEdit').val();
    editForm.username = $('#idEdit').val();
    editForm.email = $('#emailEdit').val();
    editForm.password = password;
    editForm.roles = [$('#Titles').val()];
    editForm.avatar = image;
    let editFormOBJ = JSON.stringify(editForm);
    console.log(editFormOBJ)
    $.ajax({
        type: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: 'http://localhost:8080/storemanager/editPartner',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        data: editFormOBJ,
        //xử lý khi thành công
        success: function () {
            loadPartnerList();
            $('#mess').text("Edit Successfully!!");
        },
        error: function (err) {
            console.log(err);
        }
    })
}