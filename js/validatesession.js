"use strict";

let url = new URL(window.location.href);
let table = url.searchParams.get('t');
let shop = url.searchParams.get('s');

if (table && shop) {
    localStorage.setItem('info', JSON.stringify({ shop: shop, table: table }));
    window.history.pushState("state", "Title", "/index.html");
}

const MAX_SESSION_TIME = 28800000; // 8h

let products = localStorage.getItem('products');
let order = localStorage.getItem('order');

if (products) {
    let jsonProducts = JSON.parse(products);

    if (jsonProducts.length === 0 || (Date.now() - jsonProducts[0].createdAt) > MAX_SESSION_TIME) {
        localStorage.removeItem('products');
    }
}

if (order) {
    let jsonOrder = JSON.parse(order);
    if (jsonOrder.length === 0 || (Date.now() - jsonOrder.createdAt) > MAX_SESSION_TIME) {
        localStorage.removeItem('order');
    }
}