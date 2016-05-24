"use strict";

let mongoose = require('mongoose');

let generalStockListItemSchema = new mongoose.Schema({
    category: { type: String, required: true },
    availableStock: [{ type: mongoose.Schema.Types.ObjectId, ref: "CurrentStock" }]
});


let GeneralList = mongoose.model("GeneralList", generalStockListItemSchema);





module.exports = GeneralList;