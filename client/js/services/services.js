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

});
