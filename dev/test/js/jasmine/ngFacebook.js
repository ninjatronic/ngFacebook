describe('facebook', function() {

    describe('-> $facebookProvider', function() {
        var facebookProvider;

        beforeEach(function() {
            var fakeModule = angular.module('test.config', function() { });
            fakeModule.config(function($facebookProvider) {
                facebookProvider = $facebookProvider;
            });
            module('facebook', 'test.config');
            inject(function() {});
        });

        describe('-> init', function() {
            it('should be defined', function() {
                expect(facebookProvider.init).toBeDefined();
            });

            it('should init the Facebook SDK once loaded', function() {
                var expected = {
                    appId: 'myAppId',
                    channel: '//path/to/channel.html'
                };
                facebookProvider.init(expected);
                spyOn(FB, 'init');
                window.fbAsyncInit();
                expect(FB.init).toHaveBeenCalledWith(expected);
            });
        });
    });

    describe('-> $facebook', function() {
        var rootScope, facebook, facebookProvider;

        beforeEach(function() {
            var fakeModule = angular.module('test.config', function() { });
            fakeModule.config(function($facebookProvider) {
                facebookProvider = $facebookProvider;
            });
            module('facebook', 'test.config');
        });

        describe('creation ->', function() {
            var events = {
                auth: ['login', 'authResponseChange', 'statusChange', 'logout', 'prompt'],
                xfbml: ['render'],
                edge: ['create', 'remove'],
                comment: ['create', 'remove'],
                message: ['send']
            };

            angular.forEach(events, function(events, domain){
                angular.forEach(events, function(event) {
                    var eventName = domain+'.'+event;

                    it('should subscribe to the '+eventName+' event', function() {
                        var subscribedEvents = [];
                        var spy = spyOn(FB.Event, 'subscribe');
                        var faker = spy.and.callFake(function(name) {
                            subscribedEvents.push(name);
                        });
                        inject(function($rootScope, $facebook) {
                            facebookProvider.init();
                            rootScope = $rootScope;
                            facebook = $facebook;

                            window.fbAsyncInit();
                        });
                        expect(subscribedEvents).toContain(eventName);
                    });

                    it('should broadcast the '+eventName+' event as facebook.'+eventName, function() {
                        var subscribedEvents = {};
                        var expected = {data: 'payload'};
                        var response = null;
                        spyOn(FB.Event, 'subscribe').and.callFake(function(name, handler) {
                            subscribedEvents[name] = handler;
                        });
                        inject(function($rootScope, $facebook) {
                            facebookProvider.init();
                            rootScope = $rootScope;
                            facebook = $facebook;

                            window.fbAsyncInit();
                        });
                        rootScope.$on('facebook.'+eventName, function(event, args) {
                            response = args;
                        });
                        subscribedEvents[eventName](expected);
                        expect(response).toBe(expected);
                    });
                });
            });
        });

        describe('operation pre-init ->', function() {
            beforeEach(function() {
                inject(function($rootScope, $facebook) {
                    facebookProvider.init();
                    rootScope = $rootScope;
                    facebook = $facebook;
                })
            });

            describe('-> api', function() {
                it('should be defined', function() {
                    expect(facebook.api).toBeDefined();
                });

                it('should call FB.api with args', function() {
                    spyOn(FB, 'api');
                    facebook.api('/me', 'post');
                    window.fbAsyncInit();
                    expect(FB.api.calls.mostRecent().args[0]).toBe('/me');
                    expect(FB.api.calls.mostRecent().args[1]).toBe('post');
                });

                it('should reject errors', function() {
                    var expected = {error: {}};
                    spyOn(FB, 'api').and.callFake(function(args, callback) {
                        callback(expected);
                    });
                    var result = null;
                    facebook.api('/me').then(null, function(error) {
                        result = error;
                    });
                    window.fbAsyncInit();
                    rootScope.$apply();
                    expect(result).toBe(expected);
                });

                it('should resolve responses', function() {
                    var expected = {success: {}};
                    spyOn(FB, 'api').and.callFake(function(args, callback) {
                        callback(expected);
                    });
                    var result = null;
                    facebook.api('/me').then(function(response) {
                        result = response;
                    });
                    window.fbAsyncInit();
                    rootScope.$apply();
                    expect(result).toBe(expected);
                });

                it('should handle null responses', function() {
                    spyOn(FB, 'api').and.callFake(function(args, callback) {
                        callback(null);
                    });
                    var result = {};
                    facebook.api('/me').then(function(response) {
                        result = response;
                    });
                    window.fbAsyncInit();
                    rootScope.$apply();
                    expect(result).toBeNull();
                });
            });

            describe('-> ui', function() {
                it('should be defined', function() {
                    expect(facebook.api).toBeDefined();
                });

                it('should call FB.ui with args', function() {
                    spyOn(FB, 'ui');
                    facebook.ui('args1', 'args2');
                    window.fbAsyncInit();
                    expect(FB.ui.calls.mostRecent().args[0]).toBe('args1');
                    expect(FB.ui.calls.mostRecent().args[1]).toBe('args2');
                });

                it('should reject errors', function() {
                    var expected = {error: {}};
                    spyOn(FB, 'ui').and.callFake(function(args, callback) {
                        callback(expected);
                    });
                    var result = null;
                    facebook.ui('args').then(null, function(error) {
                        result = error;
                    });
                    window.fbAsyncInit();
                    rootScope.$apply();
                    expect(result).toBe(expected);
                });

                it('should resolve responses', function() {
                    var expected = {success: {}};
                    spyOn(FB, 'ui').and.callFake(function(args, callback) {
                        callback(expected);
                    });
                    var result = null;
                    facebook.ui('args').then(function(response) {
                        result = response;
                    });
                    window.fbAsyncInit();
                    rootScope.$apply();
                    expect(result).toBe(expected);
                });

                it('should handle null responses', function() {
                    spyOn(FB, 'ui').and.callFake(function(args, callback) {
                        callback(null);
                    });
                    var result = {};
                    facebook.ui('args').then(function(response) {
                        result = response;
                    });
                    window.fbAsyncInit();
                    rootScope.$apply();
                    expect(result).toBeNull();
                });
            });

            describe('-> getAuthResponse', function() {
                it('should be defined', function() {
                    expect(facebook.getAuthResponse).toBeDefined();
                });

                it('should return FB.getAuthResponse()', function() {
                    expect(facebook.getAuthResponse()).toBe(null);
                });
            });

            describe('-> getLoginStatus', function() {
                it('should be defined', function() {
                    expect(facebook.getLoginStatus).toBeDefined();
                });

                it('should call FB.getLoginStatus', function() {
                    spyOn(FB, 'getLoginStatus');
                    facebook.getLoginStatus();
                    window.fbAsyncInit();
                    expect(FB.getLoginStatus).toHaveBeenCalled();
                });

                it('should reject errors', function() {
                    var expected = {error: {}};
                    spyOn(FB, 'getLoginStatus').and.callFake(function(callback) {
                        callback(expected);
                    });
                    var result = null;
                    facebook.getLoginStatus().then(null, function(error) {
                        result = error;
                    });
                    window.fbAsyncInit();
                    rootScope.$apply();
                    expect(result).toBe(expected);
                });

                it('should resolve responses', function() {
                    var expected = {success: {}};
                    spyOn(FB, 'getLoginStatus').and.callFake(function(callback) {
                        callback(expected);
                    });
                    var result = null;
                    facebook.getLoginStatus().then(function(response) {
                        result = response;
                    });
                    window.fbAsyncInit();
                    rootScope.$apply();
                    expect(result).toBe(expected);
                });

                it('should handle null responses', function() {
                    spyOn(FB, 'getLoginStatus').and.callFake(function(callback) {
                        callback(null);
                    });
                    var result = {};
                    facebook.getLoginStatus().then(function(response) {
                        result = response;
                    });
                    window.fbAsyncInit();
                    rootScope.$apply();
                    expect(result).toBeNull();
                });
            });

            describe('-> login', function() {
                it('should be defined', function() {
                    expect(facebook.login).toBeDefined();
                });

                it('should call FB.login', function() {
                    spyOn(FB, 'login');
                    facebook.login();
                    window.fbAsyncInit();
                    expect(FB.login).toHaveBeenCalled();
                });

                it('should call FB.login with args', function() {
                    spyOn(FB, 'login');
                    facebook.login('args');
                    window.fbAsyncInit();
                    expect(FB.login.calls.mostRecent().args[1]).toBe('args');
                });

                it('should reject errors', function() {
                    var expected = {};
                    spyOn(FB, 'login').and.callFake(function(callback) {
                        callback(expected);
                    });
                    var result = null;
                    facebook.login().then(null, function(error) {
                        result = error;
                    });
                    window.fbAsyncInit();
                    rootScope.$apply();
                    expect(result).toBe(expected);
                });

                it('should resolve responses', function() {
                    var expected = {authResponse: {}};
                    spyOn(FB, 'login').and.callFake(function(callback) {
                        callback(expected);
                    });
                    var result = null;
                    facebook.login().then(function(response) {
                        result = response;
                    });
                    window.fbAsyncInit();
                    rootScope.$apply();
                    expect(result).toBe(expected);
                });

                it('should handle null responses as errors', function() {
                    spyOn(FB, 'login').and.callFake(function(callback) {
                        callback(null);
                    });
                    var result = {};
                    facebook.login().then(null, function(error) {
                        result = error;
                    });
                    window.fbAsyncInit();
                    rootScope.$apply();
                    expect(result).toBeNull();
                });
            });

            describe('-> logout', function() {
                it('should be defined', function() {
                    expect(facebook.logout).toBeDefined();
                });

                it('should call FB.logout', function() {
                    spyOn(FB, 'logout');
                    facebook.logout();
                    window.fbAsyncInit();
                    expect(FB.logout).toHaveBeenCalled();
                });

                it('should always resolve', function() {
                    var expected = null;
                    spyOn(FB, 'logout').and.callFake(function(callback) {
                        callback(expected);
                    });
                    var result = {};
                    facebook.logout().then(function(response) {
                        result = response;
                    });
                    window.fbAsyncInit();
                    rootScope.$apply();
                    expect(result).toBe(expected);
                });
            });

            describe('-> parse', function() {
                it('should be defined', function() {
                    expect(facebook.parse).toBeDefined();
                });

                it('should call FB.XFBML.parse', function() {
                    spyOn(FB.XFBML, 'parse');
                    facebook.parse();
                    window.fbAsyncInit();
                    expect(FB.XFBML.parse).toHaveBeenCalled();
                });

                it('should always resolve', function() {
                    spyOn(FB.XFBML, 'parse').and.callFake(function(callback) {
                        callback();
                    });
                    var result = {};
                    facebook.parse().then(function(response) {
                        result = response;
                    });
                    window.fbAsyncInit();
                    rootScope.$apply();
                    expect(result).toBeUndefined();
                });
            });
        });

        describe('operation post-init ->', function() {
            beforeEach(function() {
                inject(function($rootScope, $facebook) {
                    facebookProvider.init();
                    rootScope = $rootScope;
                    facebook = $facebook;

                    window.fbAsyncInit();
                })
            });

            describe('-> api', function() {
                it('should be defined', function() {
                    expect(facebook.api).toBeDefined();
                });

                it('should call FB.api with args', function() {
                    spyOn(FB, 'api');
                    facebook.api('/me');
                    expect(FB.api.calls.mostRecent().args[0]).toBe('/me');
                });

                it('should reject errors', function() {
                    var expected = {error: {}};
                    spyOn(FB, 'api').and.callFake(function(args, callback) {
                        callback(expected);
                    });
                    var result = null;
                    facebook.api('/me').then(null, function(error) {
                        result = error;
                    });
                    rootScope.$apply();
                    expect(result).toBe(expected);
                });

                it('should resolve responses', function() {
                    var expected = {success: {}};
                    spyOn(FB, 'api').and.callFake(function(args, callback) {
                        callback(expected);
                    });
                    var result = null;
                    facebook.api('/me').then(function(response) {
                        result = response;
                    });
                    rootScope.$apply();
                    expect(result).toBe(expected);
                });

                it('should handle null responses', function() {
                    spyOn(FB, 'api').and.callFake(function(args, callback) {
                        callback(null);
                    });
                    var result = {};
                    facebook.api('/me').then(function(response) {
                        result = response;
                    });
                    rootScope.$apply();
                    expect(result).toBeNull();
                });
            });

            describe('-> ui', function() {
                it('should be defined', function() {
                    expect(facebook.api).toBeDefined();
                });

                it('should call FB.ui with args', function() {
                    spyOn(FB, 'ui');
                    facebook.ui('args');
                    expect(FB.ui.calls.mostRecent().args[0]).toBe('args');
                });

                it('should reject errors', function() {
                    var expected = {error: {}};
                    spyOn(FB, 'ui').and.callFake(function(args, callback) {
                        callback(expected);
                    });
                    var result = null;
                    facebook.ui('args').then(null, function(error) {
                        result = error;
                    });
                    rootScope.$apply();
                    expect(result).toBe(expected);
                });

                it('should resolve responses', function() {
                    var expected = {success: {}};
                    spyOn(FB, 'ui').and.callFake(function(args, callback) {
                        callback(expected);
                    });
                    var result = null;
                    facebook.ui('args').then(function(response) {
                        result = response;
                    });
                    rootScope.$apply();
                    expect(result).toBe(expected);
                });

                it('should handle null responses', function() {
                    spyOn(FB, 'ui').and.callFake(function(args, callback) {
                        callback(null);
                    });
                    var result = {};
                    facebook.ui('args').then(function(response) {
                        result = response;
                    });
                    rootScope.$apply();
                    expect(result).toBeNull();
                });
            });

            describe('-> getAuthResponse', function() {
                it('should be defined', function() {
                    expect(facebook.getAuthResponse).toBeDefined();
                });

                it('should return FB.getAuthResponse()', function() {
                    var expected = {result:'response'};
                    spyOn(FB, 'getAuthResponse').and.returnValue(expected)
                    expect(facebook.getAuthResponse()).toBe(expected);
                });
            });

            describe('-> getLoginStatus', function() {
                it('should be defined', function() {
                    expect(facebook.getLoginStatus).toBeDefined();
                });

                it('should call FB.getLoginStatus', function() {
                    spyOn(FB, 'getLoginStatus');
                    facebook.getLoginStatus();
                    expect(FB.getLoginStatus).toHaveBeenCalled();
                });

                it('should reject errors', function() {
                    var expected = {error: {}};
                    spyOn(FB, 'getLoginStatus').and.callFake(function(callback) {
                        callback(expected);
                    });
                    var result = null;
                    facebook.getLoginStatus().then(null, function(error) {
                        result = error;
                    });
                    rootScope.$apply();
                    expect(result).toBe(expected);
                });

                it('should resolve responses', function() {
                    var expected = {success: {}};
                    spyOn(FB, 'getLoginStatus').and.callFake(function(callback) {
                        callback(expected);
                    });
                    var result = null;
                    facebook.getLoginStatus().then(function(response) {
                        result = response;
                    });
                    rootScope.$apply();
                    expect(result).toBe(expected);
                });

                it('should handle null responses', function() {
                    spyOn(FB, 'getLoginStatus').and.callFake(function(callback) {
                        callback(null);
                    });
                    var result = {};
                    facebook.getLoginStatus().then(function(response) {
                        result = response;
                    });
                    rootScope.$apply();
                    expect(result).toBeNull();
                });
            });

            describe('-> login', function() {
                it('should be defined', function() {
                    expect(facebook.login).toBeDefined();
                });

                it('should call FB.login', function() {
                    spyOn(FB, 'login');
                    facebook.login();
                    expect(FB.login).toHaveBeenCalled();
                });

                it('should reject errors', function() {
                    var expected = {};
                    spyOn(FB, 'login').and.callFake(function(callback) {
                        callback(expected);
                    });
                    var result = null;
                    facebook.login().then(null, function(error) {
                        result = error;
                    });
                    rootScope.$apply();
                    expect(result).toBe(expected);
                });

                it('should resolve responses', function() {
                    var expected = {authResponse: {}};
                    spyOn(FB, 'login').and.callFake(function(callback) {
                        callback(expected);
                    });
                    var result = null;
                    facebook.login().then(function(response) {
                        result = response;
                    });
                    rootScope.$apply();
                    expect(result).toBe(expected);
                });

                it('should handle null responses as errors', function() {
                    spyOn(FB, 'login').and.callFake(function(callback) {
                        callback(null);
                    });
                    var result = {};
                    facebook.login().then(null, function(error) {
                        result = error;
                    });
                    rootScope.$apply();
                    expect(result).toBeNull();
                });
            });

            describe('-> logout', function() {
                it('should be defined', function() {
                    expect(facebook.logout).toBeDefined();
                });

                it('should call GB.logout', function() {
                    spyOn(FB, 'logout');
                    facebook.logout();
                    expect(FB.logout).toHaveBeenCalled();
                });

                it('should always resolve', function() {
                    var expected = null;
                    spyOn(FB, 'logout').and.callFake(function(callback) {
                        callback(expected);
                    });
                    var result = {};
                    facebook.logout().then(function(response) {
                        result = response;
                    });
                    rootScope.$apply();
                    expect(result).toBe(expected);
                });
            });

            describe('-> parse', function() {
                it('should be defined', function() {
                    expect(facebook.parse).toBeDefined();
                });

                it('should call FB.XFBML.parse', function() {
                    spyOn(FB.XFBML, 'parse');
                    facebook.parse();
                    expect(FB.XFBML.parse).toHaveBeenCalled();
                });

                it('should always resolve', function() {
                    spyOn(FB.XFBML, 'parse').and.callFake(function(callback) {
                        callback();
                    });
                    var result = {};
                    facebook.parse().then(function(response) {
                        result = response;
                    });
                    rootScope.$apply();
                    expect(result).toBeUndefined();
                });
            });
        });
    });
});
