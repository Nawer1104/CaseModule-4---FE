let size = 0;
let token = window.sessionStorage.getItem('TOKEN_KEY');
let totalAmount = window.sessionStorage.getItem('AMOUNT_KEY');

$(document).ready(function () {
    if (token === null) {
        window.location.href = 'error.html';
    }
    getSizeListProduct();
    pageProduct();
    getCartList();
});

function updateQuantity(productId, newQty) {
    $.ajax({
        type: "GET",
        url: 'http://localhost:8080/cart/update/' + productId + '/' + newQty,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        //xử lý khi thành công
        success: function (data) {
            let total = 0;
            let str = "";
            let modal = "";
            for (let i = 0; i < data.length; i++) {
                str += `<tr>`
                str += `<td class="align-middle"><img src="${data[i].product.img}" alt="" style="width: 50px;">${data[i].product.productname}</td>`
                str += ` <td class="align-middle">${data[i].product.price} VND</td>`
                str += `<td class="align-middle">`
                str += `<div class="input-group quantity mx-auto" style="width: 120px;">`
                str += `<div class="input-group-btn">`
                str += `<button class="btn btn-sm btn-primary" onclick="updateQuantity(${data[i].product.id}, ${data[i].quantity - 1})">`
                str += `<i class="fa fa-minus"></i>`
                str += `</button>`
                str += `</div>`
                str += `<input type="text" class="form-control form-control-sm bg-secondary text-center" value="${data[i].quantity}" readonly>`
                str += `<div class="input-group-btn">`
                str += `<button class="btn btn-sm btn-primary" onclick="updateQuantity(${data[i].product.id}, ${data[i].quantity + 1})">`
                str += `<i class="fa fa-plus"></i>`
                str += `</button>`
                str += `</div>`
                str += `</div>`
                str += `</td>`
                str += `<td class="align-middle"><span class="productSubtotal">${data[i].subtotal}</span><span> VND</span></td>`
                str += `<td class="align-middle"><button class="btn btn-sm btn-primary" onclick="updateQuantity(${data[i].product.id}, 0)"><i class="fa fa-times"></i></button></td>`
                str += `</tr>`
                total += data[i].subtotal;
            }
            for (let i = 0; i < data.length; i++) {
                modal += `<div class="d-flex justify-content-between">`
                modal += `<p>${data[i].product.productname}</p>`
                modal += `<p>x </p>`
                modal += `<p>${data[i].quantity}</p>`
                modal += `<p>${data[i].product.price} VND</p>`
                modal += `</div>`
            }
            document.getElementById("modalProducts").innerHTML = modal;
            document.getElementById("cart").innerHTML = str;
            document.getElementById("totalAmount").innerHTML = total;
            document.getElementById("totalAmountOnModal").innerHTML = total;
            document.getElementById("messSuccess").innerHTML = "";
            document.getElementById("mess").innerHTML = "";
            window.sessionStorage.removeItem('AMOUNT_KEY');
            window.sessionStorage.setItem('AMOUNT_KEY',total);
        },
        error: function (err) {
            console.log(err)
        }
    })
}

//GET SIZE
function getSizeListProduct() {
    $.ajax({
        async: false,
        //do AJAX là bất động bộ nên phải thêm async: false để chuyển về đồng bộ
        url: "http://localhost:8080/products/list",
        method: 'GET',
        dataType: 'json',
        success: function (data){
            size = data.length;
            console.log('size trong list == ',size)
        }
    });
}

function pageProduct() {
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
                    str += "<div class=\"col-12 col-sm-4 col-md-3 col-lg-2 single-album-item\">"
                    str += `<div class="single-album">`
                    str += `<img src="${data[i].img}">`
                    str += `<div class="album-info">`
                    str += `<a onclick="addProductToCart(${data[i].id})" style="cursor: pointer">`
                    str += `<h5>${data[i].productname}</h5>`
                    str += `<p>${data[i].price} VND</p>`
                    str += `</div>`
                    str += `</div>`
                    str += `</div>`
                }
                document.getElementById("list").innerHTML = str;
                $('#list').attr('style', "position: relative;height: auto;");

            },
            error: function (err) {
                window.location.href = '403.html';
            }
        })
    })
}

function searchByCate_Id(id) {
        $.ajax({
            type: "GET",
            url: 'http://localhost:8080/products/list/' + id,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            },
            //xử lý khi thành công
            success: function (data) {
                let str = "";
                for (let i = 0; i < data.length; i++) {
                    str += "<div class=\"col-12 col-sm-4 col-md-3 col-lg-2 single-album-item\">"
                    str += `<div class="single-album">`
                    str += `<img src="${data[i].img}">`
                    str += `<div class="album-info">`
                    str += `<a onclick="addProductToCart(${data[i].id})" style="cursor: pointer">`
                    str += `<h5>${data[i].productname}</h5>`
                    str += `<p>${data[i].price} VND</p>`
                    str += `</a>`
                    str += `</div>`
                    str += `</div>`
                    str += `</div>`
                }
                document.getElementById("list").innerHTML = str;
                $('#list').attr('style', "position: relative;height: auto;");
                console.log(data)
            },
            error: function (err) {
                console.log(err)
            }
        })
}

function getCartList() {
    $.ajax({
        type: "GET",
        url: 'http://localhost:8080/cart/list/',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        success: function (data) {
            let total = 0;
            let str = "";
            let modal = "";
            for (let i = 0; i < data.length; i++) {
                str += `<tr>`
                str += `<td class="align-middle"><img src="${data[i].product.img}" alt="" style="width: 50px;">${data[i].product.productname}</td>`
                str += ` <td class="align-middle">${data[i].product.price} VND</td>`
                str += `<td class="align-middle">`
                str += `<div class="input-group quantity mx-auto" style="width: 120px;">`
                str += `<div class="input-group-btn">`
                str += `<button class="btn btn-sm btn-primary" onclick="updateQuantity(${data[i].product.id}, ${data[i].quantity - 1})">`
                str += `<i class="fa fa-minus"></i>`
                str += `</button>`
                str += `</div>`
                str += `<input type="text" class="form-control form-control-sm bg-secondary text-center" value="${data[i].quantity}" readonly>`
                str += `<div class="input-group-btn">`
                str += `<button class="btn btn-sm btn-primary" onclick="updateQuantity(${data[i].product.id}, ${data[i].quantity + 1})">`
                str += `<i class="fa fa-plus"></i>`
                str += `</button>`
                str += `</div>`
                str += `</div>`
                str += `</td>`
                str += `<td class="align-middle"><span class="productSubtotal">${data[i].subtotal}</span><span> VND</span></td>`
                str += `<td class="align-middle"><button class="btn btn-sm btn-primary" onclick="updateQuantity(${data[i].product.id}, 0)"><i class="fa fa-times"></i></button></td>`
                str += `</tr>`
                total += data[i].subtotal;
            }
            for (let i = 0; i < data.length; i++) {
                modal += `<div class="d-flex justify-content-between">`
                modal += `<p>${data[i].product.productname}</p>`
                modal += `<p>x </p>`
                modal += `<p>${data[i].quantity}</p>`
                modal += `<p>${data[i].product.price} VND</p>`
                modal += `</div>`
            }
            document.getElementById("modalProducts").innerHTML = modal;
            document.getElementById("cart").innerHTML = str;
            document.getElementById("totalAmount").innerHTML = total;
            document.getElementById("totalAmountOnModal").innerHTML = total;
            window.sessionStorage.removeItem('AMOUNT_KEY');
            window.sessionStorage.setItem('AMOUNT_KEY',total);
        },
        error: function (err) {
            console.log(err)
        }
    });
}

function addProductToCart(pid) {
    $.ajax({
        type: "GET",
        url: 'http://localhost:8080/cart/add/' + pid,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        //xử lý khi thành công
        success: function (data) {
            let total = 0;
            let str = "";
            let modal = "";
            for (let i = 0; i < data.length; i++) {
                str += `<tr>`
                str += `<td class="align-middle"><img src="${data[i].product.img}" alt="" style="width: 50px;">${data[i].product.productname}</td>`
                str += ` <td class="align-middle">${data[i].product.price} VND</td>`
                str += `<td class="align-middle">`
                str += `<div class="input-group quantity mx-auto" style="width: 120px;">`
                str += `<div class="input-group-btn">`
                str += `<button class="btn btn-sm btn-primary" onclick="updateQuantity(${data[i].product.id}, ${data[i].quantity - 1})">`
                str += `<i class="fa fa-minus"></i>`
                str += `</button>`
                str += `</div>`
                str += `<input type="text" class="form-control form-control-sm bg-secondary text-center" value="${data[i].quantity}" readonly>`
                str += `<div class="input-group-btn">`
                str += `<button class="btn btn-sm btn-primary" onclick="updateQuantity(${data[i].product.id}, ${data[i].quantity + 1})">`
                str += `<i class="fa fa-plus"></i>`
                str += `</button>`
                str += `</div>`
                str += `</div>`
                str += `</td>`
                str += `<td class="align-middle"><span class="productSubtotal">${data[i].subtotal}</span><span> VND</span></td>`
                str += `<td class="align-middle"><button class="btn btn-sm btn-primary" onclick="updateQuantity(${data[i].product.id}, 0)"><i class="fa fa-times"></i></button></td>`
                str += `</tr>`
                total += data[i].subtotal;
            }
            for (let i = 0; i < data.length; i++) {
                modal += `<div class="d-flex justify-content-between">`
                modal += `<p>${data[i].product.productname}</p>`
                modal += `<p>x </p>`
                modal += `<p>${data[i].quantity}</p>`
                modal += `<p>${data[i].product.price} VND</p>`
                modal += `</div>`
            }
            document.getElementById("modalProducts").innerHTML = modal;
            document.getElementById("cart").innerHTML = str;
            document.getElementById("totalAmount").innerHTML = total;
            document.getElementById("totalAmountOnModal").innerHTML = total;
            window.sessionStorage.removeItem('AMOUNT_KEY');
            window.sessionStorage.setItem('AMOUNT_KEY',total);
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function applyCoupon() {
    let coupon = document.getElementById("discount").value;
    $.ajax({
        async: false,
        url: 'http://localhost:8080/cart/coupon/' + coupon,
        type: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf8'
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        success: function (data){
            let total = 0;
            let str = "";
            let modal = "";
            for (let i = 0; i < data.length; i++) {
                str += `<tr>`
                str += `<td class="align-middle"><img src="${data[i].product.img}" alt="" style="width: 50px;">${data[i].product.productname}</td>`
                str += ` <td class="align-middle">${data[i].product.price} VND</td>`
                str += `<td class="align-middle">`
                str += `<div class="input-group quantity mx-auto" style="width: 120px;">`
                str += `<div class="input-group-btn">`
                str += `<button class="btn btn-sm btn-primary" onclick="updateQuantity(${data[i].product.id}, ${data[i].quantity - 1})">`
                str += `<i class="fa fa-minus"></i>`
                str += `</button>`
                str += `</div>`
                str += `<input type="text" class="form-control form-control-sm bg-secondary text-center" value="${data[i].quantity}" readonly>`
                str += `<div class="input-group-btn">`
                str += `<button class="btn btn-sm btn-primary" onclick="updateQuantity(${data[i].product.id}, ${data[i].quantity + 1})">`
                str += `<i class="fa fa-plus"></i>`
                str += `</button>`
                str += `</div>`
                str += `</div>`
                str += `</td>`
                str += `<td class="align-middle"><span class="productSubtotal">${data[i].subtotal}</span><span> VND</span></td>`
                str += `<td class="align-middle"><button class="btn btn-sm btn-primary" onclick="updateQuantity(${data[i].product.id}, 0)"><i class="fa fa-times"></i></button></td>`
                str += `</tr>`
                total += data[i].subtotal;
            }
            for (let i = 0; i < data.length; i++) {
                modal += `<div class="d-flex justify-content-between">`
                modal += `<p>${data[i].product.productname}</p>`
                modal += `<p>x </p>`
                modal += `<p>${data[i].quantity}</p>`
                modal += `<p>${data[i].product.price} VND</p>`
                modal += `</div>`
            }
            document.getElementById("modalProducts").innerHTML = modal;
            let finalAmount = total - (total * 30)/100;
            document.getElementById("cart").innerHTML = str;
            document.getElementById("totalAmount").innerHTML = finalAmount;
            document.getElementById("totalAmountOnModal").innerHTML = finalAmount;
            document.getElementById("mess").innerHTML = "";
            document.getElementById("messSuccess").innerHTML = "Coupon Applied!!";
            window.sessionStorage.removeItem('AMOUNT_KEY');
            window.sessionStorage.setItem('AMOUNT_KEY',finalAmount);
        },
        error: function (err) {
            document.getElementById("messSuccess").innerHTML = "";
            document.getElementById("mess").innerHTML = "You are not able to do that!!!";
        }
    })
}

function checkOut() {
    let change = document.getElementById("payment").value;
    let totalAmount = window.sessionStorage.getItem('AMOUNT_KEY');
    if (change - totalAmount >= 0) {
        $.ajax({
            async: false,
            url: 'http://localhost:8080/cart/checkout/' + totalAmount,
            type: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf8'
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            },
            success: function (data){
                let total = 0;
                let str = "";
                let modal = "";
                for (let i = 0; i < data.length; i++) {
                    str += `<tr>`
                    str += `<td class="align-middle"><img src="${data[i].product.img}" alt="" style="width: 50px;">${data[i].product.productname}</td>`
                    str += ` <td class="align-middle">${data[i].product.price} VND</td>`
                    str += `<td class="align-middle">`
                    str += `<div class="input-group quantity mx-auto" style="width: 120px;">`
                    str += `<div class="input-group-btn">`
                    str += `<button class="btn btn-sm btn-primary" onclick="updateQuantity(${data[i].product.id}, ${data[i].quantity - 1})">`
                    str += `<i class="fa fa-minus"></i>`
                    str += `</button>`
                    str += `</div>`
                    str += `<input type="text" class="form-control form-control-sm bg-secondary text-center" value="${data[i].quantity}" readonly>`
                    str += `<div class="input-group-btn">`
                    str += `<button class="btn btn-sm btn-primary" onclick="updateQuantity(${data[i].product.id}, ${data[i].quantity + 1})">`
                    str += `<i class="fa fa-plus"></i>`
                    str += `</button>`
                    str += `</div>`
                    str += `</div>`
                    str += `</td>`
                    str += `<td class="align-middle"><span class="productSubtotal">${data[i].subtotal}</span><span> VND</span></td>`
                    str += `<td class="align-middle"><button class="btn btn-sm btn-primary" onclick="updateQuantity(${data[i].product.id}, 0)"><i class="fa fa-times"></i></button></td>`
                    str += `</tr>`
                    total += data[i].subtotal;
                }
                for (let i = 0; i < data.length; i++) {
                    modal += `<div class="d-flex justify-content-between">`
                    modal += `<p>${data[i].product.productname}</p>`
                    modal += `<p>x </p>`
                    modal += `<p>${data[i].quantity}</p>`
                    modal += `<p>${data[i].product.price} VND</p>`
                    modal += `</div>`
                }
                document.getElementById("modalProducts").innerHTML = modal;
                document.getElementById("cart").innerHTML = str;
                document.getElementById("totalAmount").innerHTML = total;
                document.getElementById("totalAmountOnModal").innerHTML = total;
                document.getElementById("mess").innerHTML = "";
                document.getElementById("messSuccess").innerHTML = "";
                document.getElementById("changeView").innerHTML = "";
                document.getElementById("payment").innerHTML = "";
                window.sessionStorage.removeItem('AMOUNT_KEY');
            },
            error: function (err) {
                console.log(err);
            }
        })
    } else {
        $("#changeView").text("Not enough!!!");
    }

}

function changeCalculator() {
    let change = document.getElementById("payment").value;
    let totalAmount = window.sessionStorage.getItem('AMOUNT_KEY');
    if (change - totalAmount >= 0) {
        $("#changeView").text(change - totalAmount + " VND");
    } else {
        $("#changeView").text("Not enough!!!");
    }
}