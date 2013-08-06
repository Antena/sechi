var app = angular.module('sechi', ['sechi.controllers', 'sechi.directives', 'sechi.services', 'sechi.filters']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/', {templateUrl: 'assets/partials/map.html', controller: 'MapController'}).
        when('/recurso', {templateUrl: 'assets/partials/resource.html', controller: 'ResourceDetailController'}).
        when('/lista', {templateUrl: 'assets/partials/list.html', controller: 'ResourceListController'}).
        when('/recurso/:resourceId', {templateUrl: 'assets/partials/resource.html', controller: 'ResourceDetailController'}).
        when('/users', {templateUrl: 'assets/partials/users.html', controller: 'UsersController'}).
        when('/users/:userId', {templateUrl: 'assets/partials/addUser.html', controller: 'addUserController'}).
        when('/addUser', {templateUrl: 'assets/partials/addUser.html', controller: 'addUserController'}).
        otherwise({redirectTo: '/404.html'});
}]);