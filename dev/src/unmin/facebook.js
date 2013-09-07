angular.module('facebook', []).provider('$facebook', function() {

    var initialised = false;
    var queue = [];

    return {
        init: function (initParams) {
            window.fbAsyncInit = function() {
                FB.init(initParams || {status: true, xfbml: true});
                initialised = true;
                angular.forEach(queue, function(func) {
                    func();
                });
            };

            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s);
                js.id = id;
                js.src = "//connect.facebook.net/en_US/all.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        },

        $get: ['$rootScope', '$q',
            function($rootScope, $q){

                var events = {
                    auth: ['login', 'authResponseChange', 'statusChange', 'logout', 'prompt'],
                    xfbml: ['render'],
                    edge: ['create', 'remove'],
                    comment: ['create', 'remove'],
                    message: ['send']
                };

                function subscribe() {
                    angular.forEach(events, function(events, domain){
                        angular.forEach(events, function(event) {
                            subscribeEvent(domain, event);
                        });
                    });
                }

                function subscribeEvent(domain, event) {
                    FB.Event.subscribe(domain+'.'+event,
                        function(response) {
                            $rootScope.$broadcast('facebook.'+domain+'.'+event, response);
                        }
                    );
                }

                function defer(func, errorPredicate, deferred) {
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
                }

                function wrap(func, errorPredicate) {
                    errorPredicate = errorPredicate || function(response) { return response && response.error; };
                    var deferred = $q.defer();
                    if(initialised) {
                        defer(func, errorPredicate, deferred);
                    } else {
                        queue.push(function() {
                            defer(func, errorPredicate, deferred);
                        });
                    }
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

                function logout() {
                    return wrapNoArgs(FB.logout, function() {return false;})
                }

                subscribe();
                return {
                    getAuthResponse: getAuthResponse,
                    getLoginStatus: getLogInStatus,
                    login: login,
                    logout: logout,
                    subscribe: subscribe,
                    api: api,
                    ui: ui
                };
            }]
        }
    });
