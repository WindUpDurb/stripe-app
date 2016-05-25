"use strict";

var app = angular.module("stripeApp", ["ui.router", "ngAnimate", "ui.bootstrap", "stripe.checkout"]);



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
        .state("register", {
            url: "/register",
            views: {
                "body": {
                    templateUrl: "/html/register.html"
                }
            }
        })
        .state("shoppingCart", {
            url: "/shoppingCart",
            views: {
                "body": {
                    templateUrl: "/html/shoppingCart.html",
                    controller: "shoppingCartController"
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
/*"use strict";

var app = angular.module("stripeApp");

app.factory("MainSocket", function (socketFactory) {
    var service = socketFactory();
    service.forward('error');
    return service;
});*/

"use strict";

var app = angular.module("stripeApp");

app.controller("mainController", function (AuthServices, StockServices, $scope, $state) {
    $scope.personalShoppingCart = StockServices.personalShoppingCart;

    $scope.marketplaceCategories = [];

    AuthServices.isActiveUser()
        .then(function (response) {
            $scope.activeUser = response.data;
            if (response.data.authorization === "Admin") {
                $scope.admin = true;
            }
        })
        .catch(function (error) {
            console.log("Error: ", error);
        });

    StockServices.getEntireStock()
        .then(function (response) {
            $scope.marketStock = response.data;
            response.data.forEach(function (item) {
                if ($scope.marketplaceCategories.indexOf(item.category) === -1 ) {
                    $scope.marketplaceCategories.push(item.category);
                }
            });
        })
        .catch(function (error) {
            console.log("Error: ", error);
        })

    $scope.login = function (loginData) {
        AuthServices.login(loginData)
            .then(function (response) {
                $scope.activeUser = response.data;
                if (response.data.authorization === "Admin") {
                    $scope.admin = true;
                }
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
                $scope.admin = null;
            })
            .catch(function (error) {
                console.log("Error: ", error);
            });
    };

    $scope.register = function (newUser) {

        if (newUser.password === newUser.passwordConfirm) {
            AuthServices.registerNewUser(newUser)
                .then(function (response) {
                    $state.go("home");
                })
                .catch(function (error) {
                    console.log("Error: ", error);
                });
        } else {
            alert("Your passwords must match")
        };

    };

});

app.controller("shoppingCartController", function ($scope, StockServices) {
   console.log("Shopping Cart Controller");
    $scope.removeItemFromCart = function (itemToRemove) {
        StockServices.removeFromShoppingCart(itemToRemove);
    };

    this.doCheckout = function(token) {
        alert("Got Stripe token: " + token.id);
    };


});


app.controller("stockManagementController", function ($scope, $state, StockServices) {
    if ($state.current.name === "listAllStock" || "updateItem") {
        StockServices.getEntireStock()
            .then(function (response) {
                $scope.stockList = response.data;
            })
            .catch(function (error) {
                console.log("Error: ", error);
            });
    }

    $scope.addItemToStock = function (newStockData) {
        StockServices.addItemToStock(newStockData)
            .then(function (response) {
                $state.go("stockManagement");

            })
            .catch(function (error) {
                console.log("Error: ", error);
            })
    };

    $scope.deleteItem = function (itemToDelete) {
        StockServices.deleteItemFromStock(itemToDelete)
            .then(function (response) {
                return StockServices.getEntireStock();
            })
            .then(function (response) {
                $scope.stockList = response.data;
            })
            .catch(function (error) {
                console.log("Error: ", error);
            });
    };
});

app.controller("categoryContentsController", function ($stateParams, $scope, StockServices) {
     $scope.currentCategory = $stateParams.category;
    StockServices.getCategoryContents($scope.currentCategory)
        .then(function (response) {
            $scope.categoryContents = response.data;
        })
        .catch(function (error) {
            console.log("Error: ", error);
        });

});

app.controller("itemDetailsController", function ($stateParams, $scope, StockServices) {
    let currentItemId = $stateParams.itemId;
    
    StockServices.getItem(currentItemId)
        .then(function (response) {
            $scope.currentItem = response.data;
        })
        .catch(function (error) {
            console.log("Error: ", error);
        });


    $scope.addToShoppingCart = function () {
        StockServices.addToShoppingCart($scope.currentItem);
        alert("The item has been added to your cart.")
    };
    
});

//need for the dropdown
app.controller("dropdownController", function ($scope, $log) {
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




