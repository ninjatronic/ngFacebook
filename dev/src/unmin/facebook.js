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

        function wrap(func, errorPredicate) {
            errorPredicate = errorPredicate || function(response) { return response && response.error; };
            var deferred = $q.defer();
            func(function(response){
                if(errorPredicate(response)) {
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

        function wrapWithArgs(func, args, errorPredicate) {
            return wrap(function(callback) {
                func(args, callback);
            }, errorPredicate);
        }

        function wrapNoArgs(func, errorPredicate) {
            return wrap(func, errorPredicate);
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

        function login() {
            return wrapNoArgs(FB.login, function(response) {
                return !response || !response.authResponse;
            });
        }

        return {
            getAuthResponse: getAuthResponse,
            getLoginStatus: getLogInStatus,
            login: login,
            init: init,
            api: api,
            ui: ui
        };
    }]);