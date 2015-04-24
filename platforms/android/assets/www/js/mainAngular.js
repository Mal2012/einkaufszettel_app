/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var shoppingApp = angular.module('shoppingApp', []);

shoppingApp.controller('shoppingController',
                        function shoppingController($scope, $http) {
                                var sessionID = window.localStorage.getItem("sessionID");

                            $http.get("http://einkaufszettel.devdungeon.de/api/api.php?a=getZettelJSON&session="+sessionID+"").
                            success(function(data, status, headers, config) {
                                console.log(data);
                                $scope.posts = data;
                            }).
                            error(function(data, status, headers, config) {
                              // log error
                            });
                        }
                    );

