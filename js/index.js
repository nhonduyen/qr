"use strict";

let initItems = [];
let initCates = [];
var menu = new Vue({
    el: '#itemlist',
    data: {
        items: [],
        noitem: false
    },
    beforeCreate: function() {
        console.log(`before create ${this.items}`);
    },
    created: function() {
        console.log(`created ${this.items}`);
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
                    priceWithComma: 0
                };
                this.items.push(item);
                // initItems.push(item);
            }
        },
        findItemsByName: function(name) {
            return initItems.filter(v => v.title.trim().toUpperCase().indexOf(name.trim().toUpperCase()) !== -1);
        },
        findItemsByCat: function(catid) {
            return initItems.filter(v => v.catId === catid);
        },
        numberWithCommas: function(x) {
            if (isNaN(x))
                return -1;
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        modifyQuantity: function(event, flag) {

            console.log(event);
            //return txtQuant + 1 * flag;
        }
    }
});

var topmenu = new Vue({
    el: '#menu1',
    data: {
        keyword: '',
        items: [],
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
            console.log([initItems, menu.items, val]);
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
        findItemsByName: function(name) {
            return initItems.filter(v => v.title.trim().toUpperCase().indexOf(name.trim().toUpperCase()) !== -1);
        },
        findItemsByCat: function(catid, event) {

            let actives = document.querySelectorAll('#menu1 li .active');
            for (let i = 0; i < actives.length; i++) {
                actives[i].classList.remove('active');
            }
            event.target.classList.add('active');

            this.isActive = true;

            menu.items = initItems.filter(v => v.cateId === catid);
            if (menu.items === 0) menu.noitem = true;
        },
        showSearchBar: function(event) {
            event.target.style = "display:none;";
            this.$refs.searchBox.focus();
            this.$refs.searchBox.style = "width: 60%;";
            this.$refs.searchClose.style = "display:block;";
            //this.isSearchBarDisplay = true;
        },
        closeSearch: function() {
            event.target.style = "display:none;";

            this.$refs.searchBox.style = "width: 0; display: none";
            this.$refs.searchIcon.style = "display:block;";
        }
    }
});

// public functions
Vue.mixin({
    methods: {
        getItemsByCategory: function(cateId) {

        },
        getItemsByName: function(name) {

        },

    }
})