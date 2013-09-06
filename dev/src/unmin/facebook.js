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

        function init(appId, channelUrl) {
            $window.fbAsyncInit = function() {
                FB.init({
                    appId      : appId,
                    channelUrl : channelUrl,
                    status     : true,
                    xfbml      : true
                });
            };
            subscribeToEvents();
            $rootScope.$broadcast('facebook.ready');

            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return;
                }
                js = d.createElement(s);
                js.id = id;
                js.src = "//connect.facebook.net/en_US/all.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }

        function subscribeToEvents() {
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

        function api(args) {
            var deferred = $q.defer();
            $rootScope.$apply(function() {
                FB.api(args, function(response){
                    if(response.error) {
                        deferred.resolve(response);
                    } else {
                        deferred.reject(response);
                    }
                });
            });
            return deferred.promise;
        }

        return {
            init: init,
            api: api
        };
    }]);