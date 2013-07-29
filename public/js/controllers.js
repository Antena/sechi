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

controllers.controller('ResourceDetailController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $rootScope.page = 'resource';
    $scope.editing = true;

    $scope.steps = [
        { step: 0, title: "Indentificación de la organización", template:"assets/partials/form/step1.html", completed: false },
        { step: 1, title: "Dirección", template:"assets/partials/form/step2.html", completed: false },
        { step: 2, title: "Tipo de organización", template:"assets/partials/form/step3.html", completed: false },
        { step: 3, title: "Actividades de la organización", template:"assets/partials/form/step4.html", completed: false },
        { step: 4, title: "Información adicional", template:"assets/partials/form/step5.html", completed: false }
    ];

    $scope.currentStep = 0;
    $scope.completed = 0;

    $scope.next = function() {
        if (!$scope.steps[$scope.currentStep].completed) {
            $scope.steps[$scope.currentStep].completed = true;
            $scope.completed++;
        }

        $scope.currentStep++;

    }

    $scope.prev = function() {
        $scope.currentStep--;
    }

    $scope.goto = function(index) {
        if ($scope.steps[index].completed)
            $scope.currentStep = index;
    }

    $scope.finish = function() {
        $(".progress-bar").css("width", "100%");
        $scope.steps[$scope.currentStep].completed = true;
        console.log("submit the form");        //TODO(gb): Remove trace!!!
    }
}])