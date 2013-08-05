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
