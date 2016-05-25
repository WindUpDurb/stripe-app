"use strict";

let express = require("express");
let router = express.Router();

let GeneralStock = require("../models/generalStockList");
let User = require("../models/user");

router.route("/")
    .get(User.authorization("Admin"), function (request, response) {
        GeneralStock.obtainStockList(function (error, stockList) {
            if (error) response.status(400).send(error);
            response.send(stockList);
        })
    })
    .post(User.authorization("Admin"), function (request, response) {
        let newCategoryData = request.data;
        GeneralStock.addCategoryToList(newCategoryData, function (error, savedCategory) {
            if (error) response.status(400).send(error);
            response.send(savedCategory);
        })
    })
    .put(User.authorization("Admin"), function (request, response) {
        let updateData = request.body;
        GeneralStock.updateCategory(updateData, function (error, updatedCategory) {
            if (error) response.status(400).send(error);
            response.send(updatedCategory);
        });
    });


router.post("/deleteCategory", User.authorization("Admin"), function (request, response) {
    let toDelete = request.body;
    GeneralStock.deleteCategory(toDelete, function (error) {
        if (error) response.status(400).send(error);
        response.send("The category has been deleted");
    });
});




module.exports = router;