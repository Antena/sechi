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
        center: new google.maps.LatLng(-34.63123, -58.441772),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    $http({method: 'GET', url: '/resources'}).
        success(function (data, status, headers, config) {
        	data=data.filter(function(d){
        		return d.active;
        	});
        	
            data.map(function(resource) {

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(resource.address.lat, resource.address.lng),
                    map: $scope.map
                })

                var content =
                    "<p><strong>" + resource.name + "</strong></p>"

                var infowindow = new google.maps.InfoWindow({
                    content: content
                });

                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.open($scope.map,marker);
                });
            })

        }).
        error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

}])

controllers.controller('ResourceListController', ['$scope', '$rootScope','$http', function($scope, $rootScope,$http) {
    $rootScope.page = 'list';
    $http({method: 'GET', url: '/resources'}).
        success(function (data, status, headers, config) {
            data.map(function (d) {
                d._id = d._id.$oid;
                return d;
            });
            $rootScope.resources = data;

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
    
    $scope.role={};
    $scope.roles=[{name:"Administrador",value:"admin"},{name:"Encuestador",value:"normal"}]
    
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
            	console.log(data);
            });
    }
    
    $scope.update = function(postData) {
    	
        $http({method: 'POST', url: '/users', data:postData}).
            success(function (data, status, headers, config) {
                $location.path('/users')
            }).
            error(function (data, status, headers, config) {
            	console.log(data);
            });
    }
    
    


}])


controllers.controller('ResourceDetailController', ['$scope', '$rootScope', 'OrganizationType', 'Settlement', '$http', '$location', function($scope, $rootScope, OrganizationType, Settlement, $http, $location) {
    $rootScope.page = 'resource';
    $scope.editing = true;
    $scope.settlements = Settlement;

    $rootScope.resource = {
    	user: $rootScope.user,
    	active:false,
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
                // called asynchronously if an error occurs
                // or server returns response with an error status.
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
        if (form.$invalid) {
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
