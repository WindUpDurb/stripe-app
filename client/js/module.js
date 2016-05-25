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
                "body": {
                    templateUrl: "/html/login.html"
                }
            }
        })
        .state("categoryContents", {
            url: "/categories/:category",
            views: {
                "body": {
                    templateUrl: "/html/categoryContents.html",
                    controller: "categoryContentsController"
                }
            }
        })
        .state("itemDetails", {
            url: "/item/:itemId",
            views: {
                "body": {
                    templateUrl: "/html/itemDetails.html",
                    controller: "itemDetailsController"
                }
            }
        })
        .state("stockManagement", {
            url: "/stockManagement",
            views: {
                "body": {
                    templateUrl: "/html/stockManagement.html",
                    controller: "stockManagementController"
                }
            }
        })
        .state("listAllStock", {
            url: "/stockManagement/listAllStock",
            views: {
                "body": {
                    templateUrl: "/html/stockManagement.listAll.html",
                    controller: "stockManagementController"
                }
            }
        })
        .state("addItem", {
            url: "/stockManagement/addItem",
            views: {
                "body": {
                    templateUrl: "/html/stockManagement.addItem.html",
                    controller: "stockManagementController"
                }
            }
        })
        .state("removeItem", {
            url: "/stockManagement/removeItem",
            views: {
                "body": {
                    templateUrl: "/html/stockManagement.removeItem.html",
                    controller: "stockManagementController"
                }
            }
        })
        .state("updateItem", {
            url: "/stockManagement/updateItem",
            views: {
                "body": {
                    templateUrl: "/html/stockManagement.updateItem.html",
                    controller: "stockManagementController"
                }
            }
        })


    $urlRouterProvider.otherwise("/");
});