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
                    templateUrl: "/html/login.html"
                }
            }
        });


    $urlRouterProvider.otherwise("/");
});