"use strict";

var app = angular.module("stripeApp");

app.controller("mainController", function (AuthServices, $scope, $state) {
    console.log("Main Controller");

    AuthServices.isActiveUser()
        .then(function (response) {
            console.log("Active User: ", response.data);
            $scope.activeUser = response.data;
        })
        .catch(function (error) {
            console.log("Error: ", error);
        });


    $scope.login = function (loginData) {
        AuthServices.login(loginData)
            .then(function (response) {
                console.log("response.data: ", response.data);
                $scope.activeUser = response.data;
                $state.go("home");
            })
            .catch(function (error) {
                console.log("Error: ", error);
            });
    };

    $scope.logout = function () {
        AuthServices.logout()
            .then(function (response) {
                $scope.activeUser = null;
            })
            .catch(function (error) {
                console.log("Error: ", error);
            });
    };


});

app.controller("dropdownController", function ($scope, $log) {
    console.log("Login Controller");
    
});