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



