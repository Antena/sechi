var controllers = angular.module('sechi.controllers', []);

controllers.controller('AppController', ['$rootScope','$http', function($rootScope,$http) {
    $rootScope.page = 'map';
    $http({method: 'GET', url: '/currentUser'}).
        success(function (data, status, headers, config) {
            $rootScope.user = data;
        }).error(function (data, status, headers, config) {
            console.log('could not get loggedIn user');
        });

}])

controllers.controller('MapController', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {
    $rootScope.page = 'map';

    var mapOptions = {
        center: new google.maps.LatLng(-34.62, -58.441772),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    $scope.infoWindow = new google.maps.InfoWindow({});

    $http({method: 'GET', url: '/resources'}).
        success(function (data, status, headers, config) {
            data=data.filter(function(d){
                return d.active;
            });

            data.map(function(resource) {
                resource._id = resource._id.$oid;

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(resource.address.lat, resource.address.lng),
                    map: $scope.map
                })

                var content = '<p class="settlement">' + resource.settlement + '</p>';
                content += "<p><strong>" + resource.name + "</strong></p>";
                if(resource.address.street){
                    content += "<p>" + resource.address.street + "</p>";
                }
                if(resource.openingHours){
                    content += "<p>" + resource.openingHours + "</p>";
                }

                if(resource.telephone){
                    content += "<p>" + resource.telephone + "</p>";
                }

                if(resource.openingHours){
                    content += "<p>" + resource.function + "</p>";
                }


                if ($rootScope.user.id == resource.user.id || $rootScope.user.role == "admin") {
                    content += '<p><a href="/#/recurso/' + resource._id + '">Editar</a></p>'
                }

                google.maps.event.addListener(marker, 'click', function() {
                    $scope.infoWindow.setContent(content);
                    $scope.infoWindow.open($scope.map, marker);
                });
            })

        }).
        error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });


    var polygons=[];

    $scope.addListenerToPolygon = function(polygon,properties) {
        google.maps.event.addListener(polygon, 'click', function (event) {
            var infoWindow = $scope.infoWindow;
            var content = "<p><strong>" + properties.Zona + "</strong></p>";
            infoWindow.setContent(content);
            var center = new google.maps.LatLng(properties.center[1],properties.center[0]);
            infoWindow.setPosition( center);
            infoWindow.open($scope.map);
        });
    }

    $http({method: 'GET', url: '/assets/geoJson/UTIUs.geojson'}).
        success(function (data, status, headers, config) {
            console.log(data);        //TODO(gb): Remove trace!!!
            $scope.utius = data.features.reverse();
            
            for (var i=0; i<data.features.length; i++) {
                var points = data.features[i].geometry.coordinates[0].map(function(p) {
                    return  new google.maps.LatLng(p[1],p[0]);
                });
                polygons[i] = new google.maps.Polygon({
                    paths : points,
                    strokeColor : "#000",
                    strokeOpacity : 0.5,
                    strokeWeight : 0.5,
                    fillColor : data.features[i].properties.color,
                    fillOpacity : 0.5
                });
                polygons[i].center = points[0];
                polygons[i].number = i;


                polygons[i].setMap($scope.map);
                $scope.addListenerToPolygon(polygons[i],data.features[i].properties);
            }
        });
}])

controllers.controller('ResourceListController', ['$scope', '$rootScope','$http','$location','$route','ActivityType','Settlement','$filter', function($scope, $rootScope,$http,$location,$route,ActivityType,Settlement,$filter) {


    $scope.activity = {};
    $scope.activityTypes = ActivityType;
    $rootScope.page = 'list';
    $http({method: 'GET', url: '/resources'}).
        success(function (data, status, headers, config) {
            data.map(function (d) {
                d._id = d._id.$oid;
                return d;
            });
            $rootScope.resources = data.filter(function(resource) {
                return resource.user.id == $rootScope.user.id || $rootScope.user.role == "admin";
            });

            $rootScope.resources.sort(function(a,b){
                if(a.name < b.name) return -1;
                if(a.name > b.name) return 1;
                return 0;
            })

        }).
        error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

    $scope.toggle= function(resource){
        var postData=$.extend({},resource);
        postData.active=!resource.active;
        $http({method: 'PUT', url: '/resources', data: postData}).
            success(function (data, status, headers, config) {
                resource.active=!resource.active;
            }).
            error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

    }

    $scope.delete = function(){
        $('#deleteModal').modal('hide');
        $http({method: 'DELETE', url: '/resources/'+$scope.resourceToDeleteId}).
            success(function (data, status, headers, config) {
                $rootScope.resources = $rootScope.resources.filter(function(r){
                    return r._id!=$scope.resourceToDeleteId;
                });
            }).
            error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

    }

    $scope.setResourceToDelete = function(id){
        console.log(id);
        $scope.resourceToDeleteId = id;
    }


    //TODO:refactor , actually copied these functions from activity controller, should reuse component
    $scope.typeChange = function(type) {
        $scope.activity.code = type.code;
    }

    $scope.topicChange = function() {
        $scope.selectedCode = null;
        $scope.selectedType = null;
        $scope.activity.code = null;
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

    var settlementsBarrios=[];
    Settlement.map(function(d){
        settlementsBarrios=settlementsBarrios.concat(d.barrios);
        return d.barrios;
    })

    $scope.getBarrios= function(){
        if($scope.resource && $scope.resource.comuna){
            return Settlement.filter(function(d){
                return d.name==$scope.resource.comuna;
            })[0].barrios

        }
        return []
    }

    $scope.comunas = Settlement;
    $scope.comuna = $scope.comunas[0];
    $scope.settlements = settlementsBarrios;


    //end of TODO

    $scope.getResources = function(){
        var filteredTypes=[];
        var filteredBarrios=[];

        if($scope.resources){
            if($scope.selectedTopic || $scope.selectedType){
                filteredTypes = [];
                if($scope.selectedType){
                    filteredTypes.push($scope.selectedType.code);
                }else{
                    filteredTypes=$filter('filterByTopic')($scope.activityTypes.types, $scope.selectedTopic, $scope.selectedTopic).map(function(d){
                        return d.code;
                    });
                }
            }
            if($scope.resource && ($scope.resource.comuna || $scope.resource.settlement)){
                if($scope.resource.settlement){
                    filteredBarrios.push($scope.resource.settlement);
                }else{
                    filteredBarrios=$scope.getBarrios();
                }
            }

            var filteredResources = $rootScope.resources.filter(function(r){
                var result=true;
                if(filteredTypes.length>0){
                    result=false;
                    for(var i=0;i<r.activities.length;i++){
                        filteredTypes.map(function(d){
                            if(d==r.activities[i].code){
                                result=true;
                            }
                        })
                    }
                }
                if(result && filteredBarrios.length>0){
                    result=false;
                    filteredBarrios.map(function(barrio){
                        if(barrio==r.settlement)
                            result=true;
                    })
                }
                return result;
            });

            $scope.emptySet=filteredResources.length==0;
            return filteredResources;
        }
        return [];
    }

    $scope.resetFilters = function(){
        if($scope.resource){
            $scope.resource.settlement=null;
            $scope.resource.comuna=null;
        }
        $scope.selectedTopic= null;
        $scope.selectedType =null;
    }

    $scope.resetFilters();

}])

controllers.controller('UsersController', ['$scope', '$rootScope','$http', function($scope, $rootScope,$http) {
    $rootScope.page = 'list';
    $http({method: 'GET', url: '/users'}).
        success(function (data, status, headers, config) {
            $rootScope.users = data;
        }).
        error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });


}])

controllers.controller('addUserController', ['$scope', '$rootScope','$http','$location', function($scope, $rootScope,$http,$location) {
    $rootScope.page = 'addUser';
    $scope.user={};
    $scope.editing=false;

    $scope.roles=[{name:"Administrador",value:"admin"},{name:"Encuestador",value:"normal"}]
    $scope.role=$scope.roles[1];


    var urls=$location.path().split('/');
    if(urls.length==3) {
        $scope.editing=true;

        var id = urls[urls.length-1];
        $http({method: 'GET', url: '/users/'+id}).
            success(function (data, status, headers, config) {
                $scope.oldUser=data;
                $rootScope.page = 'addUser';
                $scope.user = data;
                $scope.user.password="";
                $scope.role = $scope.roles.filter(function(r){
                    return r.value==$scope.user.role;
                })[0];
            }).
            error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
    }

    $scope.finish = function(){
        var postData=$.extend({},$scope.user);
        postData.password = CryptoJS.MD5($scope.user.password).toString();
        postData.oldPassword = CryptoJS.MD5($scope.user.oldPassword).toString();
        postData.passwordRepeat = CryptoJS.MD5($scope.user.passwordRepeat).toString();
        postData.role=$scope.role.value;
        if($scope.editing){
            $scope.update(postData);
        }else{
            $scope.save(postData);
        }
    }

    $scope.save = function(postData) {

        $http({method: 'PUT', url: '/users', data:postData}).
            success(function (data, status, headers, config) {
                $location.path('/users')
            }).
            error(function (data, status, headers, config) {
                if(data.code==1){
                    $scope.form.inputEmail.$error.existing=true;
                    $scope.form.inputEmail.$valid=false;
                }
            });
    }

    $scope.update = function(postData) {

        $http({method: 'POST', url: '/users', data:postData}).
            success(function (data, status, headers, config) {
                $location.path('/users')
            }).
            error(function (data, status, headers, config) {
                if(data.error==2){
                    $scope.form.inputOldPassword.$error.wrong=true;
                    $scope.form.inputOldPassword.$invalid=true;
                    $scope.form.inputOldPassword.$valid=false;
                }
            });
    }

    $scope.checkPassword = function () {
        $scope.form.inputPasswordRepeat.$error.dontMatch = $scope.user.password !== $scope.user.passwordRepeat;
        if($scope.form.inputPasswordRepeat.$error.dontMatch)
            $scope.form.inputPasswordRepeat.$valid=false;
        else
            $scope.form.inputPasswordRepeat.$valid=true;
    };

    $scope.changeEmail = function () {
        if($scope.form.inputEmail.$error.existing){
            $scope.form.inputEmail.$error.existing=false;
            $scope.form.inputEmail.$invalid=false;
            $scope.form.inputEmail.$valid=true;
        }

    };



}])


controllers.controller('ResourceDetailController', ['$scope', '$rootScope', 'OrganizationType', 'Settlement', '$http', '$location', function($scope, $rootScope, OrganizationType, Settlement, $http, $location) {
    $rootScope.page = 'resource';
    $scope.editing = true;
    var settlementsBarrios=[];

    Settlement.map(function(d){
        settlementsBarrios=settlementsBarrios.concat(d.barrios);
        return d.barrios;
    })

    $scope.getBarrios= function(){
        if($scope.resource.comuna){
            return Settlement.filter(function(d){
                return d.name==$scope.resource.comuna;
            })[0].barrios

        }
        return []
    }

    $scope.getComuna = function(d){
        console.log('comuna for:')
        console.log(d);
        var comuna = Settlement.filter(function(r){
            return r.name==d;
        })[0];
        return comuna;
    }

    $scope.comunas = Settlement;
    $scope.comuna = $scope.comunas[0];
    $scope.settlements = settlementsBarrios;

    $rootScope.resource = {
        user: $rootScope.user,
        active: true,
        address: { lat: null, lng: null },
        organizationType: 'state',
        organizationTypes: OrganizationType.load(),
        activities: [],
        state: 'state',
        isState: function() { return this.state == 'state' },
        legalPersonality: 'no',
        legalPersonalityInProcess: 'no',
        resources: { physical: { bathroom: 'no' } }
    };

    var urls=$location.path().split('/');
    if(urls.length==3) {
        var id = urls[urls.length-1];
        $http({method: 'GET', url: '/resources/'+id}).
            success(function (data, status, headers, config) {
                $rootScope.page = 'resource';
                $rootScope.resource = data;
                $rootScope.resource.isState = function() { return this.state == 'state' }
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
        { step: 0, name:'step0', title: "Ficha", template:"assets/partials/form/step0.html", completed: false, active: function() { return true } },
        { step: 1, name:'step1', title: "Organización", template:"assets/partials/form/step1.html", completed: false, active: function() { return true } },
        { step: 2, name:'step2', title: "Ubicación", template:"assets/partials/form/step2.html", completed: false, onload: "$scope.initMap()", active: function() { return true } },
        { step: 3, name:'step3', title: "Tipo de organización", template:"assets/partials/form/step3.html", completed: false, active: function() { return true } },
        { step: 4, name:'step4', title: "Actividades de la organización", template:"assets/partials/form/step4.html", completed: false, active: function() { return true } },
        { step: 5, name:'step5', title: "Información adicional", template:"assets/partials/form/step5.html", completed: false, active: function() { return !$rootScope.resource.isState() } }
    ];

    $scope.stepslength = function() {
        return $scope.steps.filter(function(step) { return step.active() }).length;
    }

    $scope.currentStep = 0;
    $scope.completed = 0;
    $scope.$formunchanged = true;

    $scope.next = function(form) {

        if (form.$invalid) {
            $scope.$formunchanged = false;
            for (key in form) {
                if (key.indexOf("$") < 0) {
                    form[key].$dirty = true;
                }
            }
            return;
        }

        if (!$scope.steps[$scope.currentStep].completed) {
            $scope.steps[$scope.currentStep].completed = true;
            $scope.completed++;
        }
        $scope.currentStep++;
        if ($scope.steps[$scope.currentStep].onload) {
            eval($scope.steps[$scope.currentStep].onload);
        }

        $scope.$formunchanged = true;
    }

    $scope.prev = function() {
        $scope.currentStep--;
        if ($scope.steps[$scope.currentStep].onload) {
            eval($scope.steps[$scope.currentStep].onload);
        }
    }

    $scope.goto = function(index) {
        if ($scope.steps[index].completed) {
            $scope.currentStep = index;
            if ($scope.steps[$scope.currentStep].onload) {
                eval($scope.steps[$scope.currentStep].onload);
            }
        }
    }

    $scope.update = function(e, form) {

        if (form.$invalid) {
            $scope.$formunchanged = false;
            for (key in form) {
                if (key.indexOf("$") < 0) {
                    form[key].$dirty = true;
                }
            }
            return;
        }

        var elem = angular.element(e.toElement);
        $(elem).button('loading');
        $http({method: 'PUT', url: '/resources', data:$rootScope.resource}).
            success(function (data, status, headers, config) {
                $(elem).button('reset')
            }).
            error(function (data, status, headers, config) {

            });
    }

    $scope.finish = function(e, form) {
        if (form.$invalid) {
            $scope.$formunchanged = false;
            for (key in form) {
                if (key.indexOf("$") < 0) {
                    form[key].$dirty = true;
                }
            }
            return;
        }

        var elem = angular.element(e.toElement);
        $(elem).button('loading');
        $(".progress-bar").animate({
            width: "100%"
        }, 1000, function() {
            $scope.steps[$scope.currentStep].completed = true;
            $rootScope.resource.date = new Date();

            $http({method: 'PUT', url: '/resources', data: $rootScope.resource}).
                success(function (data, status, headers, config) {
                    $(elem).button('reset');
                    $location.path('/lista')
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        });
    }

    $scope.initMap = function() {
        if (!$scope.mapLoaded) {
            setTimeout(function() {
                var mapOptions = {
                    center: new google.maps.LatLng(-34.63123, -58.441772),
                    zoom: 11,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                var comuna=$scope.getComuna($scope.resource.comuna);
                console.log(comuna);
                if(comuna && comuna.center){
                    $scope.zoomedComuna = comuna;
                    mapOptions.center= new google.maps.LatLng(comuna.center[1], comuna.center[0]);
                    mapOptions.zoom = 14;
                }

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
                $scope.initUsig();
            }, 1000)
        }
        $scope.mapLoaded = true;
        console.log($scope.zoomedComuna);
        if($scope.zoomedComuna && $scope.resource.comuna!=$scope.zoomedComuna.name){
            console.log("centering..");
            var comuna=$scope.getComuna($scope.resource.comuna);
            var center=new google.maps.LatLng(comuna.center[1], comuna.center[0]);
            $scope.map.setCenter(center);
        }
    }

    $scope.initUsig = function(){
        var ac = new usig.AutoCompleter('inputAddress', {
            rootUrl: 'http://servicios.usig.buenosaires.gob.ar/usig-js/2.4/',
            skin: 'usig4',
            onReady: function() {
//       			$('#inputAddress').val('').removeAttr('disabled').focus();	        			
            },
            afterSelection: function(option) {inputAddress
            },

            afterGeoCoding : function(pt) {
                if (pt instanceof usig.Punto) {
                    $.ajax({
                        type : "GET",
                        url : 'http://ws.usig.buenosaires.gob.ar/rest/convertir_coordenadas?x=' + pt.x +'&y=' + pt.y + '&output=lonlat',
                        data : null,
                        dataType: 'jsonp',
                        success : function(d) {
                            var location = new google.maps.LatLng(d.resultado.y,d.resultado.x);

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
                        },
                        error : null
                    });
                }
            }
        });

        ac.addSuggester('Catastro', {
            inputPause : 200,
            minTextLength : 1,
            showError : false
        });
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

    $scope.$formunchanged = true;

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

    $scope.closeModal = function(form) {
        $scope.activity = {};
        $('#activityModal').modal('hide');
        $scope.editing = false;
        $scope.$formunchanged = true;
        form.$invalid = false;
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

    $scope.save = function(form) {
        if (form.$invalid && form.$error.required && form.$error.required[0].$name != "inputFunction") {
            $scope.$formunchanged = false;
            for (key in form) {
                if (key.indexOf("$") < 0) {
                    form[key].$dirty = true;
                }
            }
            return;
        }

        $scope.$formunchanged = true;
        $scope.activity.id = $rootScope.resource.activities.length;
        $rootScope.resource.activities.push($scope.activity);
        $scope.closeModal();
    }

    $scope.update = function(activityId, form) {
        if (form.$invalid) {
            $scope.$formunchanged = false;
            for (key in form) {
                if (key.indexOf("$") < 0) {
                    form[key].$dirty = true;
                }
            }
            return;
        }
        $rootScope.resource.activities[activityId] = $scope.activity;
        $scope.closeModal();
    }

}])

controllers.filter('filterByTopic', function() {
    return function(types, topic) {
        return types.filter(function(type) { return type.topic == topic })
    }
})


