let initItems = [];
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
        noitem = this.items.length > 0;
        console.log(`mounted `);

    },
    methods: {
        generateItems: function() {
            for (let i = 65; i < 90; i++) {
                let item = {
                    title: `Món ăn ${String.fromCharCode(i)}`,
                    desc: `Mô tả món ăn ${String.fromCharCode(i)}`,
                    price: Math.floor((Math.random() * 200000) + 1000),
                    url: `./img/BK4PV${String.fromCharCode(i)}.jpg`,
                    cateId: Math.floor((Math.random() * 15) + 1)
                };
                this.items.push(item);
            }
        },
        findItemsByName: function(name) {
            return initItems.filter(v => v.title.trim().toUpperCase().indexOf(name.trim().toUpperCase()) !== -1);
        },
        findItemsByCat: function(catid) {
            return initItems.filter(v => v.catId === catid);
        }
    }
});

var topmenu = new Vue({
    el: '#menu1',
    data: {
        keyword: '',
        items: [],
        isActive: false
    },
    beforeCreate: function() {

    },
    created: function() {

    },
    mounted: function() {

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

        findItemsByName: function(name) {
            return initItems.filter(v => v.title.trim().toUpperCase().indexOf(name.trim().toUpperCase()) !== -1);
        },
        findItemsByCat: function(catid) {
            console.log(catid);
            this.isActive = true;
            return initItems.filter(v => v.catId === catid);
        }
    }
});