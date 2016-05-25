"use strict";

var app = angular.module("stripeApp");

app.controller("mainController", function (AuthServices, StockServices, $scope, $state) {
    console.log("Main Controller");

    $scope.marketplaceCategories = [];

    AuthServices.isActiveUser()
        .then(function (response) {
            console.log("Active User: ", response.data);
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
            console.log("response data: ", response.data)
            response.data.forEach(function (item) {
                console.log("item: ", item)
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
                console.log("response.data: ", response.data);
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


app.controller("stockManagementController", function ($scope, $state, StockServices) {
    console.log("Stock Management Controller");

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
                console.log(response.data);
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
    console.log("Category Contents");
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
   console.log("Item Details Controller");
    
    let currentItemId = $stateParams.itemId;
    
    StockServices.getItem(currentItemId)
        .then(function (response) {
            $scope.currentItem = response.data;
            console.log("current item: ", response.data)
        })
        .catch(function (error) {
            console.log("Error: ", error);
        });
    
});

//needed for the dropdown
app.controller("dropdownController", function ($scope, $log) {
    console.log("Login Controller");
    
});



