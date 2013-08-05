var directives = angular.module('sechi.directives', []);

// Stops the propagation of the click event
directives.directive('swallowClick', function() {
    return function(scope, element, attrs) {
        $(element).click(function(event) {
            event.stopPropagation();
        })
    }
})

// Prevents click default event
directives.directive('preventClick', function() {
    return function(scope, element, attrs) {
        $(element).click(function(event) {
            event.preventDefault();
        })
    }
})

directives.directive('tooltip', function() {
    return function(scope, element, attrs) {
        $(element).tooltip()
    }
})
