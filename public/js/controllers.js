var controllers = angular.module('sechi.controllers', []);

controllers.controller('AppController', ['$rootScope', function($rootScope) {
    $rootScope.page = 'map';

}])

controllers.controller('MapController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $rootScope.page = 'map';
}])

controllers.controller('ResourceController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $rootScope.page = 'resource';
}])