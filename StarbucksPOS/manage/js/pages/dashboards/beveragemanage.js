let users = JSON.parse(window.sessionStorage.getItem('USERS_KEY'));
let token = window.sessionStorage.getItem('TOKEN_KEY');
if (token === null) {
    window.location.href = 'error.html';
}
checkAuthority();
let name = users.name;
let img = users.avatar;
let image = '';
let imageAdd = '';
let Category = $("#Category");
let CategoryAdd = $("#CategoryAdd");
let fbBucketName = 'images/drinks';
let fileButton = document.getElementById('fileButton');
let fileButtonAdd = document.getElementById('fileButtonAdd');
$('#userAvatar').attr('src', img);
$('#nameOfUser').text(name);

$(document).ready(function () {

    loadBeverageList();
    getCategoryList();
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
            imageAdd = downloadURL;
            console.log(imageAdd)
        });
});

fileButtonAdd.addEventListener('change', function (e) {
    let file = e.target.files[0];
    let storageRef = firebase.storage().ref(`${fbBucketName}/${file.name}`);
    let uploadTask = storageRef.put(file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function (snapshot) {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploaderAdd.value = progress;
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
            imageAdd = downloadURL;
            console.log(image)
        });
});

function loadBeverageList() {
    $(function () {
        $.ajax({
            type: "GET",
            url: 'http://localhost:8080/products/list',
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
                    str += `<img src="${data[i].img}" alt="user-img" width="120" class="img-circle">`
                    str += `</td>`
                    str += `</td>`
                    str += `<td>`
                    str += `<h5 class="font-weight-medium mb-0">${data[i].productname}</h5>`
                    str += `</td>`
                    str += `<td>`
                    str += `<span>${data[i].id}</span><br>`
                    str += `</td>`
                    str += `<td>`
                    str += `<span>${data[i].price} VND</span><br>`
                    str += `</td>`
                    str += `<td>`
                    str += `<span>${data[i].liked}</span><br>`
                    str += `</td>`
                    str += `<td>`
                    str += `<span>${data[i].category.categoryName}</span><br>`
                    str += `</td>`
                    str += `<td>`
                    str += `<button class="btn btn-primary" data-toggle="modal" data-target="#modalBeverage" style="margin-right: 10px;" onclick="showEditBeverage(${data[i].id})"><i class="far fa-edit"></i></button>`
                    str += `<button class="btn btn-primary" onclick="deleteBeverage(${data[i].id})"><i class="far fa-trash-alt"></i></button>`
                    str += `</td>`
                    str += `</tr>`
                }
                // onclick="showEditBeverage(${data[i].id})"
                document.getElementById("beverageList").innerHTML = str;
            },
            error: function (err) {
                window.location.href = '403.html';
            }
        })
    })
}

function deleteBeverage(id) {
    let result = confirm("Do You Want To Delete This Beverage?");
    if (result) {
        $.ajax({
            type: "DELETE",
            url: 'http://localhost:8080/products/delete/' + id,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            },
            //xử lý khi thành công
            success: function () {
                loadBeverageList();
                alert("Delete success!")
            },
            error: function (err) {
                console.log(err);
            }
        })
    }

}

function showEditBeverage(id) {
    $.ajax({
        type: "GET",
        url: 'http://localhost:8080/products/get/' + id,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        //xử lý khi thành công
        success: function (data) {
            document.getElementById("id").value = data.id;
            document.getElementById("description").value = data.description;
            document.getElementById("nameEdit").value = data.productname;
            document.getElementById("imgEdit").value = data.img;
            document.getElementById("priceEdit").value = data.price;
            document.getElementById("soldEdit").value = data.liked;
            document.getElementById("reviewImg").innerHTML = "<img src=" + data.img + " \"" + "height='150' width='200'>";
            $('#mess').text("");
        },
        error: function (err) {
            console.log(err);
        }
    })
}

function getCategoryList() {
    $.ajax({
        type: "GET",
        url: 'http://localhost:8080/products/category',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        //xử lý khi thành công
        success: function (s) {
            $.each(s, function (index, category) {
                $("<option>").val(category.id).text(category.categoryName).appendTo(Category);
                $("<option>").val(category.id).text(category.categoryName).appendTo(CategoryAdd);
            });
        },
        error: function (err) {
            console.log(err);
        }
    })
}

function save() {
    if (image === "") {
        image = document.getElementById("imgEdit").value;
    }

    let id = document.getElementById("id").value;
    let name = document.getElementById("nameEdit").value;
    let price = document.getElementById("priceEdit").value;
    let description = document.getElementById("description").value;
    let idCategoty = document.getElementById("Category").value;
    let liked = document.getElementById("soldEdit").value;

    let product = {
        id : id,
        productname : name,
        img : image,
        price : price,
        liked : liked,
        description : description,
        category : {id: idCategoty}
    }
    product = JSON.stringify(product);
    console.log(product)
    $.ajax({
        type: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: 'http://localhost:8080/products/save',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        data: product,
        //xử lý khi thành công
        success: function () {
            loadBeverageList();
            $('#mess').text("Edit Successfully!!");
        },
        error: function (err) {
            console.log(err);
        }
    })
}

function add() {
    document.getElementById("name").innerHTML = "";
    document.getElementById("priceAdd").innerHTML = "";
    document.getElementById("descriptionAdd").innerHTML = "";
    document.getElementById("fileButtonAdd").innerHTML = "";
    document.getElementById("messSuccess").innerHTML = "";


    let name = document.getElementById("name").value;
    let price = document.getElementById("priceAdd").value;
    let description = document.getElementById("descriptionAdd").value;
    let idCategoty = document.getElementById("Category").value;

    let product = {
        productname : name,
        img : imageAdd,
        price : price,
        description : description,
        liked : 0,
        category : {id: idCategoty}
    }
    product = JSON.stringify(product);
    console.log(product)
    $.ajax({
        type: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: 'http://localhost:8080/products/save',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        data: product,
        //xử lý khi thành công
        success: function () {
            loadBeverageList();
            $('#messSuccess').text("Add Successfully!!");
        },
        error: function (err) {
            console.log(err);
        }
    })
}