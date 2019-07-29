"use strict";

const initItems = [];
const initCates = [];
$(document).ready(function() {
    let products = localStorage.getItem('products');
    if (products) {
        $('#shoppingBar').show();
        showCartBar();
    } else {
        $('#shoppingBar').hide();
    }
    generateItems();
    generateMenu();
    showItems(initItems);

    $('#search, #search-close, #noItem').hide();

    $('#bar').on('click', () => {
        $('#side-menu').removeClass('in');
        $('#side-menu').addClass('in');
    });

    $('#btn-search').on('click', function() {
        $('#search, #search-close').show();
        $('#search').css('width', '60%');
        $(this).hide();
        $('#search').focus();
    });
    $('#search-close').on('click', () => {
        closeSearch();

    });
    $('.scrollmenu li, .side-group-item').on('click', function() {
        closeSearch();
        $('.scrollmenu a').removeClass('active');
        $('.list-group-item').removeClass('active');

        const catid = parseInt($(this).data('id'));

        $('.scrollmenu li[data-id=' + catid + ']').children(':first-child').addClass('active');
        $('.list-group a[data-id=' + catid + ']').addClass('active');
        $('#side-menu').modal('hide');

        if (catid == 0) {
            showItems(initItems);
        } else {
            const result = initItems.filter(v => v.cateId === catid);
            if (result.length > 0)
                showItems(result);
            else
                showNoItem();
        }
    });
    $('#search').on('input', function() {
        let keyword = $.trim($(this).val()).toUpperCase();
        $('#itemlist').find('.alert').remove();
        if (keyword) {
            $('#itemlist').find('.menu-item').remove();

            const result = initItems.filter(v => v.title.toUpperCase().indexOf(keyword) !== -1);

            if (result.length > 0) {
                showItems(result);
            } else {
                showNoItem();
            }

        } else {
            showItems(initItems);
        }

    });

    $('#itemlist').on('click', '.thumbnail, .title', function() {
        let info = $(this).closest('.menu-item');

        $('#mdImg').attr('src', info.find('img').attr('src'));
        $('#mdImg').attr('alt', info.find('img').attr('alt'));
        $('#item-name').text(info.find('.title').text());
        $('#item-desc').text(info.find('.desc').text());
        $('#item-price').text(info.find('.price').text());
        $('#btnAddCart').attr('data-id', info.data('id'));
        $('#btnAddCart').attr('data-price', info.find('.price').data('price'));

        $("#mdDetail").modal();

    });
    $('#tbCart').on('click', '.remove-item', function() {
        let id = $(this).data('id');
        let createdAt = $(this).data('createdat');

        let products = localStorage.getItem('products');

        products = JSON.parse(products);
        if (products.length > 0) {
            products.forEach((product) => {

                if (product.id === id && product.createdAt === createdAt) {
                    let total = parseInt($('#sumCart').text().split(' ')[0].replace(',', '')) - parseInt(product.price) * parseInt(product.quantity);
                    $('#sumCart').text(numberWithCommas(total) + 'đ');

                    let index = products.indexOf(product);
                    products.splice(index, 1);
                    localStorage.setItem('products', JSON.stringify(products));
                    $(this).closest('tr').remove();

                    if ($('#tbCart > tbody > tr').length === 0) {
                        localStorage.removeItem('products');
                        $("#mdCart").modal('hide');
                    }
                    showCartBar();

                    return false;
                }
            });
        }
    });
    $('#btnCheckout').click(() => {
        let products = JSON.parse(localStorage.getItem('products'));
        let order = {
            id: '0',
            createdAt: Date.now(),
            foods: products
        };
        localStorage.setItem('order', JSON.stringify(order));
        localStorage.removeItem('products');
        $("#mdCart").modal('hide');
        showCartBar();

    });
    $('#tbCart').on('change input', '.quantity', function(e) {

        if (e.type === 'change' && !$(this).val()) {
            $(this).val(parseInt($(this).data('value')));
        }

        if (!$(this).val() || isNaN($(this).val()) || parseInt($(this).val()) < 1)
            return false;

        let quantity = parseInt($(this).val());




        let id = $(this).closest('tr').find('.remove-item').data('id');
        let createdAt = $(this).closest('tr').find('.remove-item').data('createdat');

        let products = JSON.parse(localStorage.getItem('products'));

        if (products.length > 0) {
            products.forEach((product) => {

                if (product.id === id && product.createdAt === createdAt) {
                    product.quantity = quantity;

                    localStorage.setItem('products', JSON.stringify(products));
                    let total = getSumCart();

                    $('#sumCart').text(numberWithCommas(total) + 'đ');

                    return false;
                }
            });
        }
    });
    $('#btnCart').click(function() {
        let products = localStorage.getItem('products');
        const cartItems = JSON.parse(products);
        if (cartItems && cartItems.length > 0) {

            $('#btnCheckout').show();
            $('#mdCart .modal-title').text('Giỏ hàng');

            $('#tbCart > tbody > tr').remove();

            $('.nav-link').find('span').removeClass('badge-light').addClass('badge-primary');
            $('.nav-link').removeClass('active');
            $(this).children('a').addClass('active');
            $(this).find('span').removeClass('badge-primary').addClass('badge-light');

            let total = 0;

            cartItems.forEach((item) => {
                let html = `
                <tr>
                                    <td><strong>${item.name}</strong>
                                    <a style="color: red" href="javascript:void(0);" class="remove-item" data-id="${item.id}" data-createdAt="${item.createdAt}">Xóa</a>
                                    </td>
                                    <td>
                                    
                                    <input style="max-width:60px; text-align: center;" type="number" inputmode="numeric" class="form-control quantity" min="1" data-value="${item.quantity}" value="${item.quantity}" >
                                    </td>
                                    <td><span class="price-color" style="width:100px;">${numberWithCommas( item.price)} đ</span></td>
                                   
                                </tr>
                `;

                total += parseInt(item.price) * parseInt(item.quantity);

                $('#tbCart tbody').append(html);
            });

            $('#sumCart').text(numberWithCommas(total) + ' đ');

            $('#mdCart').modal();
        }
    });
    $('#btnBill').click(function() {

        $('.nav-link').find('span').removeClass('badge-light').addClass('badge-primary');
        $('.nav-link').removeClass('active');
        $(this).children('a').addClass('active');
        $(this).find('span').removeClass('badge-primary').addClass('badge-light');

        if ($('#billBadge').text() === '0') return false;

        let products = localStorage.getItem('order');
        const cartItems = JSON.parse(products);

        if (cartItems && cartItems.foods.length > 0) {

            $('#btnCheckout').hide();
            $('#mdCart .modal-title').text('Hóa đơn');
            $('#tbCart > tbody > tr').remove();

            $('.nav-link').removeClass('active');
            $(this).children('a').addClass('active');
            $(this).find('span').removeClass('badge-primary').addClass('badge-light');

            let total = 0;

            cartItems.foods.forEach((item) => {

                let html = `
                <tr>
                                    <td><strong>${item.name}</strong></td>
                                    <td>
                                    ${item.quantity}
                                        </td>
                                    <td><span class="price-color" style="width:100px;">${numberWithCommas( item.price)} đ</span></td>
                                   
                                </tr>
                `;

                total += parseInt(item.price) * parseInt(item.quantity);

                $('#tbCart > tbody').append(html);
            });

            $('#sumCart').text(numberWithCommas(total) + ' đ');

            $('#mdCart').modal();
        }

    });
    $('#btnCall').click(function() {
        $('.nav-link').removeClass('active');
        $(this).children('a').addClass('active');
        $(this).find('span').removeClass('badge-primary').addClass('badge-light');
    });
    $('#frmAddCart').submit((e) => {
        e.preventDefault();
        let quantity = $('#quantity').val();
        let name = $('#item-name').text();
        let id = $('#btnAddCart').data('id');
        let price = $('#btnAddCart').data('price');
        let url = $('#mdImg').attr('src');
        console.log(url);
        $("#mdDetail").modal('hide');
        $('.toast-body').text(`Bạn vừa thêm ${quantity} x ${name} vào giỏ hàng.`);
        $('#myToast').toast('show');
        let product = {
            id: id,
            name: name,
            quantity: quantity,
            price: price,
            url: url,
            createdAt: Date.now()
        };

        addToCart(product);
        showCartBar();

        return false;
    });
    $('#itemlist, #mdDetail').on('click', '.substract, .plus', function() {
        let txtQuantity = $(this).closest('.input-group').find('.quantity');
        let quantity = txtQuantity.val();

        if (isNaN(quantity) || Math.round(quantity) < 1) {
            txtQuantity.val(1);
            return false;
        }

        quantity = parseInt(quantity);
        if ($(this).attr('class').indexOf('substract') !== -1) {
            if (quantity > 1)
                quantity = quantity - 1;
        }
        if ($(this).attr('class').indexOf('plus') !== -1) {
            quantity = quantity + 1;
        }
        txtQuantity.val(quantity);

    });

    $('#itemlist').on('click', '.btnAdd', function() {
        let quantity = $(this).closest('.input-group').find('.quantity').val();
        let product = {
            id: $(this).data('id'),
            name: $(this).closest('.info').find('.title').text(),
            quantity: quantity,
            url: $(this).closest('.menu-item').find('img').attr('src'),
            price: $(this).data('price'),
            createdAt: Date.now()
        };
        addToCart(product);

        $('#myToast').css('top', $('#menu1').position().top);
        $('.toast-body').text(`Bạn vừa thêm ${quantity} x ${product.name} vào giỏ hàng.`);
        $('#myToast').toast('show');
        showCartBar();
    });
});

function closeSearch() {
    $('#search').css('width', 0);
    $('#search-close').hide();
    $('#search').fadeOut(() => {
        $('#btn-search').show();
    });
    $('#search').val('');
}

function showNoItem() {
    let html = `
    <div class="alert alert-info alert-dismissible fade show">
<button type="button" class="close" data-dismiss="alert">&times;</button>
Không tìm thấy món ăn nào phù hợp.
</div>
`;
    $('#itemlist').html(html);
}

function generateMenu() {
    let cates = [];
    let links = `<a data-id='0' class='list-group-item side-group-item' href='javascript:;'>Tất cả</a>`;
    let lis = `<ul><li data-id='0'><a href='javascript:;'>Tất cả</a></li>`;

    for (let i = 1; i < 16; i++) {
        links += `<a data-id='${i}' class='list-group-item side-group-item' href='javascript:;'>menu ${i}</a>`;
        lis += `<li data-id='${i}'><a href='javascript:;'>menu ${i}</a></li>`;
        initCates.push({
            cateId: i,
            cateName: 'menu ' + i
        });
    }
    lis += `</ul>`;
    $('#side-menu .list-group').html(links);
    $('.simplebar-content').html(lis);
    $('.side-group-item:first').addClass('active');

    $('.simplebar-content li:first a').addClass('active');


}

function generateItems() {

    for (let i = 65; i < 90; i++) {
        let price = Math.floor((Math.random() * 100000) + 1000);
        initItems.push({
            title: `Món ăn ${String.fromCharCode(i)}`,
            desc: `Mô tả món ăn ${String.fromCharCode(i)}`,
            price: price,
            priceWithComma: numberWithCommas(price),
            url: `./img/BK4PV${String.fromCharCode(i)}.jpg`,
            cateId: Math.floor((Math.random() * 16) + 1),
            id: i
        });

    }
}

function showItems(items) {
    let itemlist = $('#itemlist');
    itemlist.find('.menu-item').remove();
    itemlist.find('.alert').remove();
    items.forEach((item) => {
        let html = generateItem(item);
        itemlist.append(html);
    });
}

function generateItem(item) {
    let itemshtml = `
    <div class="menu-item" data-catid="${item.cateId}" data-id="${item.id}">
    <a class="thumbnail" href="javascript:void(0);">
        <img src="${item.url}" alt="${item.title}" />
    </a>
    <div class="info">
        <a class="title" href="javascript:void(0);">${item.title}</a>
        <div class="desc">${item.desc}</div>
        <div class="price" data-price="${item.price}">
            <div class="price-color">
            ${item.priceWithComma} đ
            </div>
        </div>
        <div class="row">
                                    <div class="col-sm-12">
                                        <div class="input-group">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text substract" style="cursor: pointer;">-</span>
                                            </div> 
                                            <input style="max-width:50px; text-align: center;" type="number" inputmode="numeric" class="form-control quantity" min="1" value="1" data-price="${item.price}">
                                            <div class="input-group-prepend">

                                                <span class="input-group-text plus" style="cursor: pointer;">+</span>
                                            </div>
                                            <div class="input-group-append">
                                                <button type="button" class="btn btn-info btnAdd" data-id="${item.id}" data-price="${item.price}"><i class="fa fa-cart-plus"></i>Thêm</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
    </div>
   
</div>
    `;
    return itemshtml;

}

function showCartBar() {
    let products = localStorage.getItem('products');
    let order = localStorage.getItem('order');

    let numOrder = !order ? 0 : 1;
    let numCartItems = 0;

    if (!products) numCartItems = 0;
    else numCartItems = JSON.parse(products).length

    $('#billBadge').text(numOrder);
    $('#shopBadge').text(numCartItems);
    $('#shoppingBar').show();
}

function numberWithCommas(x) {
    if (isNaN(x))
        return -1;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function addToCart(product) {
    let products = localStorage.getItem('products');
    if (products) {
        let currentProducts = JSON.parse(localStorage.getItem('products'));

        // check duplicate then increase the quantity
        let duplicate = false;
        for (let i = 0; i < currentProducts.length; i++) {
            if (currentProducts[i].id === product.id &&
                currentProducts[i].createdAt !== product.createdAt) {
                currentProducts[i].quantity = parseInt(currentProducts[i].quantity) + parseInt(product.quantity);
                currentProducts[i].createdAt = product.createdAt;

                duplicate = true;
                break;
            }
        }
        if (!duplicate) {
            currentProducts.push(product);
        }

        localStorage.setItem('products', JSON.stringify(currentProducts));

    } else {
        let newProducts = [];
        newProducts.push(product);
        localStorage.setItem('products', JSON.stringify(newProducts));
    }
}

function getSumCart() {
    let products = localStorage.getItem('products');

    products = JSON.parse(products);
    if (products.length === 0) return 0;
    let sum = 0;
    products.forEach((product) => {
        sum += parseInt(product.price) * parseInt(product.quantity);
    });
    return sum;
}