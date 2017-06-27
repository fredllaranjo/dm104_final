(function () {

    angular.module('CadastroDevApp', [])
        .controller('CadastroDevController', ['$scope', 'CadastroDevService', function ($scope, CadastroDevService) {

            $scope.buttonName = 'Add';
            $scope.dev = {};
            CadastroDevService.getDevs().then(function (data) {
                $scope.devs = [];
                data.forEach(function(dev) {
                    var devBasic = {};
                    devBasic.id = dev.id;
                    devBasic.name = dev.name;
                    devBasic.availableHoursMonth = dev.availableHoursMonth;
                    $scope.devs.push(devBasic);
                }, this);
            }).catch(function (error) {
                console.log('ERROR:' + error);
            });
            $scope.saveDev = function () {
                if ($scope.buttonName == 'Add') {
                    var dev = $scope.dev;
                    CadastroDevService.addDev(dev).then(function (data) {
                        $scope.devs.push(data);
                        $scope.buttonName = 'Add';
                        $scope.index = null;
                        $scope.dev = null;
                    }).catch(function (error) {
                        console.log('ERROR:' + error);
                    });
                } else {
                    var dev = $scope.dev;
                    CadastroDevService.updateDev(dev).then(function (data) {
                        $scope.devs[$scope.index] = data;
                        $scope.buttonName = 'Add';
                        $scope.index = null;
                        $scope.dev = null;
                    }).catch(function (error) {
                        console.log('ERROR:' + error);
                    });
                }
            };
            $scope.editDev = function (index, dev) {
                $scope.buttonName = 'Edit';
                $scope.index = index;
                CadastroDevService.getDev(dev).then(function (data) {
                    $scope.dev = angular.copy(data);
                }).catch(function (error) {
                    console.log('ERROR:' + error);
                });
            }

            $scope.removeDev = function (index, dev) {
                CadastroDevService.removeDev(dev).then(function (data) {
                    $scope.devs.splice(index, 1);
                }).catch(function (error) {
                    console.log('ERROR:' + error);
                });
            };

        }
        ]).service('CadastroDevService', ['$http', '$q', function ($http, $q) {
            var service = this;

            service.getDevs = function () {
                var deferred = $q.defer();
                $http.get('http://localhost:8089/dev').
                    then(function (response) {
                        deferred.resolve(response.data);
                    });
                return deferred.promise;
            };
            service.addDev = function (dev) {
                var deferred = $q.defer();
                $http.post('http://localhost:8089/dev', dev).
                    then(function (response) {
                        deferred.resolve(response.data);
                    });
                return deferred.promise;
            };
            service.getDev = function (dev) {
                var deferred = $q.defer();
                $http.get('http://localhost:8089/dev/' + (dev.id)).
                    then(function (response) {
                        deferred.resolve(response.data);
                    });
                return deferred.promise;
            };
            service.updateDev = function (dev) {
                var deferred = $q.defer();
                $http.put('http://localhost:8089/dev', dev).
                    then(function (response) {
                        deferred.resolve(response.data);
                    });
                return deferred.promise;
            };
            service.removeDev = function (dev) {
                var deferred = $q.defer();
                $http.delete('http://localhost:8089/dev/' + (dev.id)).
                    then(function (response) {
                        deferred.resolve(response.data);
                    });
                return deferred.promise;
            };

        }]);
})();