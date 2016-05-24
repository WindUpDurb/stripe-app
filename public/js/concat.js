"use strict";

var app = angular.module("stripeApp", ["ui.router", "ngAnimate", "ui.bootstrap"]);

app.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state("home", {
            url: "/"
        })
        .state("login", {
            url: "/login",
            views : {
                "body" : {
                    templateUrl: "/html/login.html",
                    controller: "loginController"
                }
            }
        });


    $urlRouterProvider.otherwise("/");
});
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

app.controller("loginController", function (AuthServices, $scope, $state) {
    console.log("Login Controller");
    
});
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
