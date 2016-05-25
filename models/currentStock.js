"use strict";

let mongoose = require("mongoose");

let stockItemSchema = new mongoose.Schema({
    item: { type: String, required: true },
    quantityInStock: { type: Number, required: true },
    price: { type: Number, required: true },
    itemDescription: { type: String, required: false },
    category: { type: String, required: true }
    //category: { type: mongoose.Schema.Types.ObjectId, ref: "GeneralList" }
});


stockItemSchema.statics.obtainCategoryContents = function (category, callback) {
    CurrentStock.find({ category: category }, function (error, listOfItems) {
        if (error || !listOfItems) return callback(error || { error: "There are no items in this category." });
        callback(null, listOfItems);
    })
};

stockItemSchema.statics.itemDetails = function (itemId, callback) {
    CurrentStock.findById(itemId, function (error, item) {
        if (error || !item) return callback(error || { error: "There is no such item." });
        callback(null, item);
    });
};

stockItemSchema.statics.obtainEntireStock = function (callback) {
    CurrentStock.find({}, function (error, stock) {
        if (error || !stock) return callback(error || { error: "The stock is empty." });
        return callback(null, stock);
    });
};


stockItemSchema.statics.addStockItem = function (newStockData, callback) {
    CurrentStock.findOne({ item: newStockData.item }, function (error, databaseItem) {
        if (error || databaseItem) return callback(error || {error: `${newStockData.item} is already cataloged`});
        CurrentStock.create(newStockData, function (error, savedStock) {
            return callback(error, savedStock);
        });
    });
};

stockItemSchema.statics.deleteStockItem = function (itemData, callback) {
    CurrentStock.findByIdAndRemove(itemData._id, function (error) {
        callback(error);
    });
};

stockItemSchema.statics.updateItem = function (itemUpdateData, callback) {
    CurrentStock.findById(itemUpdateData._id, function (error, databaseItem) {
        if (error || !databaseItem) return callback(error || { error : "There is no such item." });
        databaseItem = itemUpdateData;
        databaseItem.save(function (error, savedItem) {
            callback(error, savedItem);
        });
    });
};


let CurrentStock = mongoose.model("CurrentStock", stockItemSchema);

module.exports = CurrentStock;