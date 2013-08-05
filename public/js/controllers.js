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
            $rootScope.resources = data;

        }).
        error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });


}])


controllers.controller('ResourceDetailController', ['$scope', '$rootScope', 'OrganizationType','$http','$location', function($scope, $rootScope, OrganizationType,$http,$location) {
    $rootScope.page = 'resource';
    $scope.editing = true;

    $rootScope.resource = {
        address: { lat: null, lng: null },
        organizationTypes: OrganizationType.load(),
        activities: []
    };

    var urls=$location.path().split('/');
    if(urls.length==3) {
        var id = urls[urls.length-1];
        $http({method: 'GET', url: '/resources/'+id}).
            success(function (data, status, headers, config) {
                $rootScope.page = 'resource';
                $rootScope.resource = data;
                $rootScope.resource._id = $rootScope.resource._id.$oid;
                $scope.steps.map(function(step) {
                    step.completed = true;
                })
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

    $scope.update = function(e) {
        console.log(e);        //TODO(gb): Remove trace!!!
        var elem = angular.element(e.toElement);
        $(elem).button('loading');
        $http({method: 'PUT', url: '/resources', data:$rootScope.resource}).
            success(function (data, status, headers, config) {
                $(elem).button('reset')
            }).
            error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
    }

    $scope.finish = function() {
        $(".progress-bar").css("width", "100%");
        $scope.steps[$scope.currentStep].completed = true;

        $http({method: 'PUT', url: '/resources', data:$rootScope.resource}).
            success(function (data, status, headers, config) {
                $location.path('/lista')
            }).
            error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
    }

    $scope.initMap = function() {
        if (!$scope.mapLoaded) {
            setTimeout(function() {
                console.log("loadmap");        //TODO(gb): Remove trace!!!
                var mapOptions = {
                    center: new google.maps.LatLng(-34.63123, -58.441772),
                    zoom: 11,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                $scope.map = new google.maps.Map(document.getElementById("address-map"), mapOptions);

                if ($rootScope.resource.address && $rootScope.resource.address.lat && $rootScope.resource.address.lng) {
                    $scope.addMarker();
                }

                google.maps.event.addListener($scope.map, 'click', function(event) {
                    if (!$scope.marker) {
                        $scope.marker = new google.maps.Marker({
                            position: event.latLng,
                            map: $scope.map,
                            draggable: true
                        })
                        $rootScope.resource.address.lat = event.latLng.lat();
                        $rootScope.resource.address.lng = event.latLng.lng();
                        google.maps.event.addListener(
                            $scope.marker,
                            'drag',
                            function() {
                                $rootScope.resource.address.lat = $scope.marker.position.lat();
                                $rootScope.resource.address.lng = $scope.marker.position.lng();
                                $scope.$apply();
                            }
                        );
                    } else {
                        $scope.marker.setPosition(event.latLng);
                        $rootScope.resource.address.lat = event.latLng.lat();
                        $rootScope.resource.address.lng = event.latLng.lng();
                    }
                    $scope.$apply();
                });
            }, 1000)
        }
        $scope.mapLoaded = true;
    }

    $scope.geocoder = new google.maps.Geocoder();
    $scope.geocode = function() {
        var address = $rootScope.resource.address.street + " " + $rootScope.resource.address.number + " Ciudad De Buenos Aires, Buenos Aires Province, Argentina";
        console.log("Geocoding '" + address + "'...");

        $scope.geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var location = results[0].geometry.location;
                $rootScope.resource.address.lat = location.lat();
                $rootScope.resource.address.lng = location.lng();
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
                            $rootScope.resource.address.lat = $scope.marker.position.lat();
                            $rootScope.resource.address.lng = $scope.marker.position.lng();
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
        var location = new google.maps.LatLng($rootScope.resource.address.lat, $rootScope.resource.address.lng);
        if (!$scope.marker) {
            $rootScope.resource.address.lat = location.lat();
            $rootScope.resource.address.lng = location.lng();

            $scope.marker = new google.maps.Marker({
                map: $scope.map,
                position: location,
                draggable: true
            });
            google.maps.event.addListener(
                $scope.marker,
                'drag',
                function() {
                    $rootScope.resource.address.lat = $scope.marker.position.lat();
                    $rootScope.resource.address.lng = $scope.marker.position.lng();
                    $scope.$apply();
                }
            );
        } else {
            $scope.marker.setPosition(location);
        }
        $scope.map.setCenter(location);
    }
}])

controllers.controller('ActivityController', ['$scope', '$rootScope', 'ActivityType', function($scope, $rootScope, ActivityType) {
    $scope.activityTypes = ActivityType;
    $scope.activity = {};
    $scope.editing = false;

    $scope.topicChange = function() {
        $scope.selectedCode = null;
        $scope.selectedType = null;
        $scope.activity.code = null;
    }

    $scope.typeChange = function(type) {
        $scope.activity.code = type.code;
    }

    $scope.codeEntered = function() {
        var filteredType = $scope.activityTypes.types.filter(function (type) {
            return type.code == parseInt($scope.activity.code);
        });
        if (filteredType.length > 0) {
            $scope.selectedTopic = filteredType[0].topic;
            $scope.selectedType = filteredType[0];
        } else {
            $scope.selectedTopic = null;
            $scope.selectedType = null;
        }
    }

    $scope.closeModal = function() {
        $scope.activity = {};
        $('#activityModal').modal('hide');
        $scope.editing = false;
    }

    $scope.newActivity = function() {
        $scope.activity = {};
        $scope.selectedTopic = null;
        $scope.selectedType = null;
        $('#activityModal').modal('show');
        $scope.editing = false;
    }

    $scope.edit = function(activityId) {
        $scope.editing = true;
        $scope.activity = $rootScope.resource.activities[activityId];
        var type = $scope.activityTypes.types.filter(function(type) { return type.code == $scope.activity.code })[0]
        $scope.selectedTopic = type.topic;
        $scope.selectedType = type;
        $('#activityModal').modal('show');
    }

    $scope.setActivityToDelete = function(activityId) {
        $scope.activityToDelete = activityId;
        console.log("$scope.activityToDelete= " + $scope.activityToDelete);     //TODO(gb): Remove trace!!!
    }

    $scope.delete = function() {
        var activityId = $scope.activityToDelete;
        $rootScope.resource.activities.splice(activityId, 1);
        for (var i=0; i<$rootScope.resource.activities.length; i++) {
            $rootScope.resource.activities[i].id = i;
        }
        $scope.activityToDelete = null;
        $('#deleteModal').modal('hide');
    }

    $scope.save = function() {
        $scope.activity.id = $rootScope.resource.activities.length;
        $rootScope.resource.activities.push($scope.activity);
        $scope.closeModal();
    }

    $scope.update = function(activityId) {
        $rootScope.resource.activities[activityId] = $scope.activity;
        $scope.closeModal();
    }

}])

controllers.filter('filterByTopic', function() {
    return function(types, topic) {
        return types.filter(function(type) { return type.topic == topic })
    }
})
