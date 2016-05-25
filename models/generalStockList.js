"use strict";

let mongoose = require('mongoose');

let generalStockListItemSchema = new mongoose.Schema({
    category: { type: String, required: true },
    availableStock: [{ type: mongoose.Schema.Types.ObjectId, ref: "CurrentStock" }]
});


generalStockListItemSchema.statics.obtainStockList = function (callback) {
    GeneralList.find({}, function (error, stockList) {
        if (error || !stockList) return callback(error || { error: "The stock list is empty" });
        return callback(null, stockList);
    });
};


generalStockListItemSchema.statics.addCategoryToList = function (newCategoryData, callback) {
    GeneralList.findOne({ category: newCategoryData.category }, function (error, databaseCategory) {
        if (error || databaseCategory) return callback(error || {error: `${newCategoryData.category} is already cataloged`});
            GeneralList.create(newCategoryData, function (error, savedCategory) {
                return callback(error, savedCategory);
            });
    });
};

generalStockListItemSchema.statics.deleteCategory = function (categoryId, callback) {
    GeneralList.findByIdAndRemove(categoryId, function (error) {
        callback(error);
    });
};

generalStockListItemSchema.statics.updateCategory = function (updatedCategoryData, callback) {
    GeneralList.findById(updatedCategoryData._id, function (error, databaseCategory) {
        if (error || !databaseCategory) return callback(error || { error : "There is no such category." });
        databaseCategory = updatedCategoryData;
        databaseCategory.save(function (error, savedUser) {
            callback(error, savedUser);
        });
    });
};




let GeneralList = mongoose.model("GeneralList", generalStockListItemSchema);


module.exports = GeneralList;