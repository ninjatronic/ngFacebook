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
                            if($rootScope.$$phase) {
                                deferred.reject(response);
                            } else {
                                $rootScope.$apply(function(){
                                    deferred.reject(response);
                                });
                            }
                        } else {
                            if($rootScope.$$phase) {
                                deferred.resolve(response);
                            } else {
                                $rootScope.$apply(function(){
                                    deferred.resolve(response);
                                });
                            }
                        }
                    });
                }

                function wrap(func, deferred, errorPredicate) {
                    errorPredicate = errorPredicate || function(response) { return response && response.error; };
                    defer(func, errorPredicate, deferred);
                }

                function wrapWithArgs(func, deferred, args, errorPredicate) {
                    var argsArray = Array.prototype.slice.call(args, 0);

                    wrap(function(callback) {
                        argsArray.push(callback);
                        func.apply(FB, argsArray);
                    }, deferred, errorPredicate);
                }

                function wrapWithOptions(func, deferred, opts, errorPredicate) {
                    wrap(function(callback) {
                        func(callback, opts);
                    }, deferred, errorPredicate);
                }

                function wrapNoArgs(func, deferred, errorPredicate) {
                    wrap(func, deferred, errorPredicate);
                }

                function api() {
                    var deferred = $q.defer();
                    var apiArguments = arguments;
                    if(initialised) {
                        wrapWithArgs(FB.api, deferred, apiArguments );
                    } else {
                        queue.push(function() {
                            wrapWithArgs(FB.api, deferred, apiArguments );
                        });
                    }
                    return deferred.promise;
                }

                function ui() {
                    var deferred = $q.defer();
                    var uiArguments = arguments;
                    if(initialised) {
                        wrapWithArgs(FB.ui, deferred, uiArguments);
                    } else {
                        queue.push(function() {
                            wrapWithArgs(FB.ui, deferred, uiArguments);
                        });
                    }
                    return deferred.promise;
                }

                function getAuthResponse() {
                    if(initialised) {
                        return FB.getAuthResponse();
                    } else {
                        return null;
                    }
                }

                function getLogInStatus() {
                    var deferred = $q.defer();
                    if(initialised) {
                        wrapNoArgs(FB.getLoginStatus, deferred);
                    } else {
                        queue.push(function() {
                            wrapNoArgs(FB.getLoginStatus, deferred);
                        });
                    }
                    return deferred.promise;
                }

                function login(opts) {
                    var deferred = $q.defer();
                    if(initialised) {
                        if (opts) {
                            wrapWithOptions(FB.login, deferred, opts, function(response) {return !response || !response.authResponse;});
                        } else {
                            wrapNoArgs(FB.login, deferred, function(response) {return !response || !response.authResponse;});
                        }
                    } else {
                        if (opts) {
                            queue.push(function() {
                                wrapWithOptions(FB.login, deferred, opts, function(response) {return !response || !response.authResponse;});
                            });
                        } else {
                            queue.push(function() {
                                wrapNoArgs(FB.login, deferred, function(response) {return !response || !response.authResponse;});
                            });
                        }
                    }
                    return deferred.promise;
                }

                function logout() {
                    var deferred = $q.defer();
                    if(initialised) {
                        wrapNoArgs(FB.logout, deferred, function() {return false;});
                    } else {
                        queue.push(function() {
                            wrapNoArgs(FB.logout, deferred, function() {return false;});
                        });
                    }
                    return deferred.promise;
                }

	            function parse() {
		            var deferred = $q.defer();
		            var parseArguments = arguments;
		            if(initialised) {
                        wrapWithArgs(FB.XFBML.parse, deferred, parseArguments);
                    } else {
                        queue.push(function() {
                            wrapWithArgs(FB.XFBML.parse, deferred, parseArguments);
                        });
                    }
		            return deferred.promise;
	            }

                if(initialised) {
                    subscribe();
                } else {
                    queue.push(subscribe);
                }

                return {
                    getAuthResponse: getAuthResponse,
                    getLoginStatus: getLogInStatus,
                    logout: logout,
                    login: login,
                    api: api,
                    ui: ui,
                    parse: parse
                };
            }]
    }
});