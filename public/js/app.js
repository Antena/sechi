var app = angular.module('sechi', ['sechi.controllers', 'sechi.directives']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/', {templateUrl: 'partials/map.html', controller: 'MapController'}).
        when('/recurso', {templateUrl: 'partials/resource.html', controller: 'ResourceDetailController'}).
        when('/recurso/:resourceId', {templateUrl: 'partials/resource.html', controller: 'ResourceController'}).
        otherwise({redirectTo: '/404.html'});
}]);