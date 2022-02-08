let token = window.sessionStorage.getItem('TOKEN_KEY');
let size = 0;
let limit = 5;
let currentPage = window.sessionStorage.getItem('CURRENTPAGE_KEY');
if (currentPage === null) {
    currentPage = 1;
}

$(document).ready(function () {
    if (token === null) {
        window.location.href = 'error.html';
    }
    getListReport(currentPage);
});

function getListReport(currentPage) {
    $(function () {
        $.ajax({
            type: "GET",
            url: 'http://localhost:8080/orders/orderdetail/' + currentPage + '/' + limit,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            },
            //xử lý khi thành công
            success: function (data) {
                let str = "";
                let pagi = "";
                for (let i = 0; i < data.orders.length; i++) {
                    str += `<tr>`
                    str += `<td>`
                    str += `<div class="widget-content">`
                    str += `<p>${i + 1}</p>`
                    str += `</div>`
                    str += `</td>`
                    str += `<td>`
                    str += `<div class="widget-content">`
                    str += `<button class="btn btn--normal" data-toggle="modal" data-target="#orderDetailModal" onclick="showOrderDetail(${data.orders[i].id})">${data.orders[i].id}</button>`
                    str += `</div>`
                    str += `</td>`
                    str += `<td>`
                    str += `<div class="widget-content">`
                    str += `<p>${data.orders[i].createdDate}</p>`
                    str += `</div>`
                    str += `</td>`
                    str += `<td>`
                    str += `<div class="widget-content">`
                    str += `<p>${data.orders[i].users.name}</p>`
                    str += `</div>`
                    str += `</td>`
                    str += `<td>`
                    str += `<div class="widget-content">`
                    str += `<p>${data.orders[i].amount}</p>`
                    str += `</div>`
                    str += `</td>`
                    str += `</tr>`
                }

                for (let i = 0; i < data.totalPage; i++) {
                    pagi += `<li class="page-item ${i === currentPage - 1 ? 'active' : ''}"><span class="page-link" onclick="getListReport(${i + 1})">${i + 1}</span></li>`
                }

                document.getElementById("tableBody").innerHTML = str;
                document.getElementById("paginationPage").innerHTML = pagi;
                window.sessionStorage.removeItem('CURRENTPAGE_KEY');
                window.sessionStorage.setItem('CURRENTPAGE_KEY',data.page);

            },
            error: function (err) {
                window.location.href = '403.html';
            }
        })
    })
}

function showOrderDetail(id) {
    $.ajax({
        type: "GET",
        url: 'http://localhost:8080/orders/showorderdetail/' + id,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        //xử lý khi thành công
        success: function (data) {
            let str = "";
            for (let i = 0; i < data.length; i++) {
                str += `<tr>`
                str += `<td>`
                str += `<span class="text-inverse">${data[i].productName}</span><br>`
                str += `</td>`
                str += `<td class="text-center">${data[i].quantity}</td>`
                str += `<td class="text-right">${data[i].price} VND</td>`
                str += `</tr>`

            }
            document.getElementById("orderDetailProducts").innerHTML = str;
            document.getElementById("partnerName").innerHTML = data[0].name;
            document.getElementById("idNumber").innerHTML = data[0].id;
            document.getElementById("createdDate").innerHTML = new Date(data[0].created_Date);
            document.getElementById("total").innerHTML = data[0].amount + " VND";
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function searchOrder() {
    let keyword = document.getElementById("keyword").value;
    if (keyword !== "") {
        $.ajax({
            type: "GET",
            url: 'http://localhost:8080/orders/search/' + keyword,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            },
            //xử lý khi thành công
            success: function (data) {
                let str = "";
                for (let i = 0; i < data.length; i++) {
                    str += `<tr>`
                    str += `<td>`
                    str += `<div class="widget-content">`
                    str += `<p>${i + 1}</p>`
                    str += `</div>`
                    str += `</td>`
                    str += `<td>`
                    str += `<div class="widget-content">`
                    str += `<button class="btn btn--normal" data-toggle="modal" data-target="#orderDetailModal" onclick="showOrderDetail(${data[i].id})">${data[i].id}</button>`
                    str += `</div>`
                    str += `</td>`
                    str += `<td>`
                    str += `<div class="widget-content">`
                    str += `<p>${data[i].createdDate}</p>`
                    str += `</div>`
                    str += `</td>`
                    str += `<td>`
                    str += `<div class="widget-content">`
                    str += `<p>${data[i].users.name}</p>`
                    str += `</div>`
                    str += `</td>`
                    str += `<td>`
                    str += `<div class="widget-content">`
                    str += `<p>${data[i].amount}</p>`
                    str += `</div>`
                    str += `</td>`
                    str += `</tr>`
                }
                document.getElementById("tableBody").innerHTML = str;
                document.getElementById("paginationPage").innerHTML = "";
            },
            error: function (err) {
                window.location.href = '403.html';
            }
        })
    } else {
        getListReport(1);
    }
}

function getInCome() {
    let IncomeForm = {};
    IncomeForm.fromDate = document.getElementById("fromDate").value;
    IncomeForm.toDate = document.getElementById("toDate").value;
    IncomeForm = JSON.stringify(IncomeForm);
    console.log(IncomeForm);
    $.ajax({
        url: 'http://localhost:8080/orders/checkIncome',
        type: 'POST',
        data: IncomeForm,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf8',
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        success: function (data){
            let str = "";
            let income = 0;
            for (let i = 0; i < data.length; i++) {
                str += `<tr>`
                str += `<td>`
                str += `<div class="widget-content">`
                str += `<p>${i + 1}</p>`
                str += `</div>`
                str += `</td>`
                str += `<td>`
                str += `<div class="widget-content">`
                str += `<button class="btn btn--normal" data-toggle="modal" data-target="#orderDetailModal" onclick="showOrderDetail(${data[i].id})">${data[i].id}</button>`
                str += `</div>`
                str += `</td>`
                str += `<td>`
                str += `<div class="widget-content">`
                str += `<p>${data[i].created_Date}</p>`
                str += `</div>`
                str += `</td>`
                str += `<td>`
                str += `<div class="widget-content">`
                str += `<p>${data[i].name}</p>`
                str += `</div>`
                str += `</td>`
                str += `<td>`
                str += `<div class="widget-content">`
                str += `<p>${data[i].amount}</p>`
                str += `</div>`
                str += `</td>`
                str += `</tr>`
                income += data[i].amount;
            }
            document.getElementById("tableBody").innerHTML = str;
            document.getElementById("paginationPage").innerHTML = "";
            document.getElementById("income").innerHTML = income + " VND";

        },error: function (err) {
            console.log(err)
        }
    })
}