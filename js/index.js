"use strict";

let initItems = [];
let initCates = [];

// public functions
var mixin = {
    methods: {
        getItemsByCategory: function(cateId) {

        },
        getItemsByName: function(name) {

        },
        numberWithCommas: function(x) {
            if (isNaN(x))
                return -1;
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        addToCart: function(product) {
            product.createdAt = Date.now();
            let products = localStorage.getItem('products');
            if (products) {
                let currentProducts = JSON.parse(products);

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
            shoppingBar.numCart = JSON.parse(localStorage.getItem('products')).length;
        },
        getSumCart: function() {
            let products = localStorage.getItem('products');

            products = JSON.parse(products);
            if (products.length === 0) return 0;
            let sum = 0;
            products.forEach((product) => {
                sum += parseInt(product.price) * parseInt(product.quantity);
            });
            return sum;
        }
    }
};

var menu = new Vue({
    el: '#itemlist',
    data: {
        items: [],
        noitem: false
    },
    mixins: [mixin],
    beforeCreate: function() {
        console.log(`before create`);
    },
    created: function() {
        console.log(`created `);
    },
    mounted: function() {
        this.generateItems();

        initItems = this.items;

        console.log(`mounted `);

    },
    methods: {
        generateItems: function() {
            for (let i = 65; i < 90; i++) {
                let price = Math.floor((Math.random() * 200000) + 1000);

                let item = {
                    title: `Món ăn ${String.fromCharCode(i)}`,
                    desc: `Mô tả món ăn ${String.fromCharCode(i)}`,
                    price: price,
                    url: `./img/BK4PV${String.fromCharCode(i)}.jpg`,
                    cateId: Math.floor((Math.random() * 15) + 1),
                    id: i,
                    priceWithComma: this.numberWithCommas(price)
                };
                this.items.push(item);
                // initItems.push(item);
            }
        },
        findItemsByName: function(name) {
            return initItems.filter(v => v.title.trim().toUpperCase().indexOf(name.trim().toUpperCase()) !== -1);
        },
        modifyQuantity: function(event, flag) {
            let txtQuant = event.target.closest('.input-group').childNodes[1].nextSibling;
            if (isNaN(txtQuant.value) || (Math.round(txtQuant.value) === 1 && flag < 0)) {
                txtQuant.value = 1;
                return false;
            }
            txtQuant.value = parseInt(txtQuant.value) + 1 * flag;
        }
    }
});

var topmenu = new Vue({
    el: '#menu1',
    data: {
        keyword: '',
        items: [{
            cateId: 0,
            name: 'tất cả'
        }],
        isActive: false,
        isSearchBarDisplay: false

    },
    beforeCreate: function() {

    },
    created: function() {

    },
    mounted: function() {
        this.generateItems();
        initCates = this.items;
        this.$refs.menu1Link[0].classList.add('active');
        this.$refs.searchBox.style = "display:none;";
        this.$refs.searchClose.style = "display:none;";

    },
    watch: {
        keyword: function(val, oldval) {
            console.log(`change from ${oldval} to ${val}`);
            if (val) {
                menu.items = menu.findItemsByName(val);
            } else {
                menu.items = initItems;
            }
            menu.noitem = menu.items.length === 0;
        }
    },
    methods: {
        generateItems: function() {
            for (let i = 65; i < 90; i++) {
                let item = {
                    name: `Menu ${String.fromCharCode(i)}`,
                    cateId: Math.floor((Math.random() * 15) + 1)
                };
                this.items.push(item);

            }
        },
        setActive: function(index) {
            let actives = document.querySelectorAll('#menu1 li a');
            for (let i = 0; i < actives.length; i++) {
                actives[i].classList.remove('active');
                if (i === index) {
                    actives[i].classList.add('active');
                }
            }

            this.isActive = true;
        },
        findItemsByCat: function(catid, event) {
            let index = this.$refs.menu1Link.indexOf(event.target);
            sideMenu.setActive(index);
            this.setActive(index);
            if (catid === 0) {
                menu.items = initItems;
            } else {
                menu.items = initItems.filter(v => v.cateId === catid);
            }
            if (menu.items === 0) menu.noitem = true;
        },
        showSearchBar: function(event) {
            event.target.style = "display:none;";
            this.$refs.searchBox.focus();
            this.$refs.searchBox.style = "width: 60%;";
            this.$refs.searchClose.style = "display:block;";
        },
        closeSearch: function() {
            event.target.style = "display:none;";

            this.$refs.searchBox.style = "width: 0; display: none";
            this.$refs.searchIcon.style = "display:block;";
        },

    }
});

var shoppingBar = new Vue({
    el: '#shoppingBar',
    data: {
        numCart: 0,
        numBill: 0

    },
    beforeCreate: function() {

    },
    created: function() {

    },
    mounted: function() {
        if (localStorage.getItem('products')) {
            this.numCart = JSON.parse(localStorage.getItem('products')).length;
        } else {
            this.numCart = 0;
        }

    },

    methods: {
        showCart: function() {
            alert('cart');
        },
        showBill: function() {
            alert('bill');
        }
    }
});

var sideBarOpen = new Vue({
    el: '#bar',
    methods: {
        showModal: function() {
            sideMenu.$refs.side.classList.add('in');
            $('#side-menu').modal('show');
        },

    }
});

var sideMenu = new Vue({
    el: '#side-menu',
    data: {
        items: topmenu.items,
    },
    mounted: function() {
        this.$refs.sideLink[0].classList.add('active');
    },

    methods: {
        getItemsByCat: function(id, event) {
            let actives = this.$refs.sideLink;
            let index = actives.indexOf(event.target);
            topmenu.setActive(index);
            this.setActive(index);
            if (id === 0) {
                menu.items = initItems;
            } else {
                menu.items = initItems.filter(v => v.cateId === id);
            }
            if (menu.items === 0) menu.noitem = true;
            $('#side-menu').modal('hide');
        },
        setActive: function(index) {
            let actives = this.$refs.sideLink;
            for (let i = 0; i < actives.length; i++) {
                actives[i].classList.remove('active');
                if (i === index) {
                    actives[i].classList.add('active');
                }
            }
        },
    }
});