angular.module('facebook', []).factory('$facebook',
    ['$rootScope', '$window', '$q',
    function($rootScope, $window, $q){

        var events = {
            auth: ['login', 'authResponseChange', 'statusChange', 'logout', 'prompt'],
            xfbml: ['render'],
            edge: ['create', 'remove'],
            comment: ['create', 'remove'],
            message: ['send']
        };

        function init() {
            angular.forEach(events, function(events, domain){
                angular.forEach(events, function(event) {
                    FB.Event.subscribe(domain+'.'+event,
                        function(response) {
                            $rootScope.$broadcast('facebook.'+domain+'.'+event, response);
                        }
                    );
                });
            });
        }

        function wrap(func) {
            var deferred = $q.defer();
            func(function(response){
                if(response && response.error) {
                    $rootScope.$apply(function(){
                        deferred.reject(response);
                    });
                } else {
                    $rootScope.$apply(function(){
                        deferred.resolve(response);
                    });
                }
            });
            return deferred.promise;
        }

        function wrapWithArgs(func, args) {
            return wrap(function(callback) {
                func(args, callback);
            });
        }

        function wrapNoArgs(func) {
            return wrap(func);
        }

        function api(args) {
            return wrapWithArgs(FB.api, args);
        }

        function ui(args) {
            return wrapWithArgs(FB.ui, args);
        }

        function getAuthResponse() {
            return FB.getAuthResponse();
        }

        function getLogInStatus() {
            return wrapNoArgs(FB.getLoginStatus);
        }

        return {
            getAuthResponse: getAuthResponse,
            getLoginStatus: getLogInStatus,
            login: {},
            init: init,
            api: api,
            ui: ui
        };
    }]);