"use strict";

let express = require("express");
let router = express.Router();

let CurrentStock = require("../models/currentStock");
let User = require("../models/user");

router.route("/")
    .get(function (request, response) {
        CurrentStock.obtainEntireStock(function (error, stockList) {
            if (error) response.status(400).send(error);
            response.send(stockList);
        })
    })
    .post(User.authorization("Admin"), function (request, response) {
        let newStockItem = request.body;
        CurrentStock.addStockItem(newStockItem, function (error, savedItem) {
            if (error) response.status(400).send(error);
            response.send(savedItem);
        })
    })
    .put(User.authorization("Admin"), function (request, response) {
        let updateData = request.body;
        CurrentStock.updateItem(updateData, function (error, updatedItem) {
            if (error) response.status(400).send(error);
            response.send(updatedItem);
        });
    });

router.get("/category/:category", function (request, response) {
    let category = request.params.category;
    CurrentStock.obtainCategoryContents(category, function (error, categoryContents) {
        if (error) response.status(400).send(error);
        response.send(categoryContents);
    });
});

router.get("/item/:itemId", function (request, response) {
    let itemId = request.params.itemId;
    CurrentStock.itemDetails(itemId, function (error, itemData) {
        if (error) response.status(400).send(error);
        response.send(itemData);
    });
});

router.post("/deleteStockItem", User.authorization("Admin"), function (request, response) {
    let toDelete = request.body;
    CurrentStock.deleteStockItem(toDelete, function (error) {
        if (error) response.status(400).send(error);
        response.send("The item has been deleted");
    });
});




module.exports = router;