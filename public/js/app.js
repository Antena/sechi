var app = angular.module('sechi', ['sechi.controllers', 'sechi.directives', 'sechi.services', 'sechi.filters']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/', {templateUrl: 'assets/partials/map.html', controller: 'MapController'}).
        when('/recurso', {templateUrl: 'assets/partials/resource.html', controller: 'ResourceDetailController'}).
        when('/recurso/:resourceId', {templateUrl: 'assets/partials/resource.html', controller: 'ResourceController'}).
        otherwise({redirectTo: '/404.html'});
}]);