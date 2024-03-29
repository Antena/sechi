var filters = angular.module('sechi.filters', []);

filters.filter('truncate', [function() {
    return function(text, n) {
        if (!text) {
            return "";
        }
        var useWordBoundary = true;
        var toLong = text.length>n,
            s_ = toLong ? text.substr(0,n-1) : text;
        s_ = useWordBoundary && toLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
        return  toLong ? s_ + '...' : s_;
    }
}])

filters.filter('activityName', ['ActivityType', function(ActivityType) {
    return function(code) {
        if (!code) {
            return "";
        }
        var type = ActivityType.types.filter(function(type) {
            return type.code == code;
        })[0];
        if (!type) {
            return "";
        }
        return type.name + " (" + type.topic + ")";
    }
}])


filters.filter('roleName', [function(RoleName) {
    return function(code) {
        if (!code) {
            return "";
        }
        if(code=='admin'){
        	return "Administrador";
        }
        
        if(code=="normal"){
        	return "Encuestador";
        }
        
        return "";
    }
}])

filters.filter('activityAges', [function() {
    return function(ages) {
    	if(ages){
    		if( typeof ages === 'string' ) {
                ages = [ {name:ages,checked:true} ];
            }
    		return ages.map(function(a){
            	return a.name;
            }).join(',');
    	}
        
    	return null;
        
    }
}])
