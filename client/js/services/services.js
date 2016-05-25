"use strict";

var app = angular.module("stripeApp");

app.service("AuthServices", function ($http) {

    this.login = function (loginData) {
        return $http.post("/api/users/login", loginData);
    };
    
    this.logout = function () {
        return $http.delete("/api/users/logout");
    };

    this.isActiveUser = function () {
        return $http.get("/api/users/activeUser");
    };

    this.registerNewUser = function (newUser) {
        return $http.post("/api/users", newUser);
    }

});

app.service("StockServices", function ($http) {

    this.personalShoppingCart = [];

    this.addToShoppingCart = function (itemToAdd) {
      this.personalShoppingCart.push(itemToAdd);
    };

    this.removeFromShoppingCart = function (itemToRemove) {
        let index = this.personalShoppingCart.indexOf(itemToRemove);
        this.personalShoppingCart.splice(index, 1);
    };

    this.addItemToStock = function (newStockData) {
        return $http.post("/api/currentStock", newStockData);
    };
    
    this.getEntireStock = function () {
        return $http.get("/api/currentStock");
    };
    
    this.getCategoryContents = function (category) {
        return $http.get(`/api/currentStock/category/${category}`);
    };
    
    this.deleteItemFromStock = function (itemToDelete) {
        return $http.post("/api/currentStock/deleteStockItem", itemToDelete);
    };
    
    this.getItem = function (itemId) {
        return $http.get(`/api/currentStock/item/${itemId}`);
    };
    
});




