var controllers = angular.module('sechi.controllers', []);

controllers.controller('AppController', ['$rootScope', function($rootScope) {
    $rootScope.page = 'map';

}])

controllers.controller('MapController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $rootScope.page = 'map';
}])

controllers.controller('ResourceListController', ['$scope', '$rootScope','$http', function($scope, $rootScope,$http) {
    $rootScope.page = 'list';
    $http({method: 'GET', url: '/resources'}).
        success(function (data, status, headers, config) {
            data.map(function (d) {
                d.id = d._id.$oid;
            });
            $scope.resources = data;

        }).
        error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });


}])


controllers.controller('ResourceDetailController', ['$scope', '$rootScope', 'OrganizationType','$http','$location', function($scope, $rootScope, OrganizationType,$http,$location) {
    $rootScope.page = 'resource';
    $scope.editing = true;

    $scope.resource = {
        address: { lat: null, lng: null },
        organizationTypes: $scope.organizationTypes
    };

    var urls=$location.path().split('/');
    if(urls.length==3) {
        var id = urls[urls.length-1];
        $http({method: 'GET', url: '/resources/'+id}).
            success(function (data, status, headers, config) {
                $scope.resource=data;
                $scope.resource._id=$scope.resource._id.$oid;
            }).
            error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
    }




    $scope.steps = [

        { step: 0, title: "Indentificación de la organización", template:"assets/partials/form/step1.html", completed: false },
        { step: 1, title: "Dirección", template:"assets/partials/form/step2.html", completed: false, onload: "$scope.initMap()" },
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
        if ($scope.steps[$scope.currentStep].onload) {
            eval($scope.steps[$scope.currentStep].onload);
        }

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

        $http({method: 'PUT', url: '/resources', data:$scope.resource}).
            success(function (data, status, headers, config) {
                console.log('submitted ok')
            }).
            error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
    }

    $scope.initMap = function() {
        if (!$scope.mapLoaded) {
            var mapOptions = {
                center: new google.maps.LatLng(-34.63123, -58.441772),
                zoom: 11,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            $scope.map = new google.maps.Map(document.getElementById("address-map"), mapOptions);
            google.maps.event.addListener($scope.map, 'click', function(event) {
                if (!$scope.marker) {
                    $scope.marker = new google.maps.Marker({
                        position: event.latLng,
                        map: $scope.map,
                        draggable: true
                    })
                    $scope.resource.address.lat = event.latLng.lat();
                    $scope.resource.address.lng = event.latLng.lng();
                    google.maps.event.addListener(
                        $scope.marker,
                        'drag',
                        function() {
                            $scope.resource.address.lat = $scope.marker.position.lat();
                            $scope.resource.address.lng = $scope.marker.position.lng();
                            $scope.$apply();
                        }
                    );
                } else {
                    $scope.marker.setPosition(event.latLng);
                    $scope.resource.address.lat = event.latLng.lat();
                    $scope.resource.address.lng = event.latLng.lng();
                }
                $scope.$apply();
            });
        }
        $scope.mapLoaded = true;
    }

    $scope.geocoder = new google.maps.Geocoder();
    $scope.geocode = function() {
        var address = $scope.resource.address.street + " " + $scope.resource.address.number + " Ciudad De Buenos Aires, Buenos Aires Province, Argentina";
        console.log("Geocoding '" + address + "'...");

        $scope.geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var location = results[0].geometry.location;
                $scope.resource.address.lat = location.lat();
                $scope.resource.address.lng = location.lng();
                $scope.map.setCenter(location);
                if (!$scope.marker) {
                    $scope.marker = new google.maps.Marker({
                        map: $scope.map,
                        position: location,
                        draggable: true
                    });
                    google.maps.event.addListener(
                        $scope.marker,
                        'drag',
                        function() {
                            $scope.resource.address.lat = $scope.marker.position.lat();
                            $scope.resource.address.lng = $scope.marker.position.lng();
                            $scope.$apply();
                        }
                    );
                } else {
                    $scope.marker.setPosition(location);
                }
                $scope.$apply();
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    $scope.addMarker = function() {
        var location = new google.maps.LatLng($scope.resource.address.lat, $scope.resource.address.lng);
        if (!$scope.marker) {
            $scope.resource.address.lat = location.lat();
            $scope.resource.address.lng = location.lng();

            $scope.marker = new google.maps.Marker({
                map: $scope.map,
                position: location,
                draggable: true
            });
            google.maps.event.addListener(
                $scope.marker,
                'drag',
                function() {
                    $scope.resource.address.lat = $scope.marker.position.lat();
                    $scope.resource.address.lng = $scope.marker.position.lng();
                    $scope.$apply();
                }
            );
        } else {
            $scope.marker.setPosition(location);
        }
        $scope.map.setCenter(location);
    }
}])