"use strict";

var app = angular.module("stripeApp", ["ui.router", "ngAnimate", "ui.bootstrap"]);

app.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state("home", {
            url : "/"
        })


    $urlRouterProvider.otherwise("/");
});
"use strict";

var app = angular.module("stripeApp");

app.controller("mainController", function () {
    console.log("Main Controller");
});
"use strict";

var app = angular.module("stripeApp");

app.service("someService", function () {

});
