/**
 * Created by tranthanhit on 24/07/2017.
 */

module.exports = function Cart (oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    // Add a item by id.
    this.add = function (item, id) {
        // Check exist from cart.
        var storedItem = this.items[id];
        // Don't exist item.
        if (!storedItem) {
            storedItem = this.items[id] = {
                item: item,
                qty: 0,
                price: 0
            };
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.maxPrice * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.maxPrice;
    };

    // Reduce one item by id.
    this.reduceByOne = function (id) {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.maxPrice;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.maxPrice;

        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
    };

    // Remove one item.
    this.removeItem = function (id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };

    // GenerateArray.
    this.generateArray = function () {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};