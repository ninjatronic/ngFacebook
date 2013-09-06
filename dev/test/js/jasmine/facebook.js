describe('facebook', function() {
    beforeEach(module('facebook'));

    var rootScope, window, facebook;

    describe('-> $facebook', function() {
        beforeEach(inject(function($rootScope, $window, $facebook) {
            rootScope = $rootScope;
            window = $window;
            facebook = $facebook;
        }));

        describe('-> init', function() {
            it('should be defined', function() {
                expect(facebook.init).toBeDefined();
            });
        });

        describe('-> api', function() {
            it('should be defined', function() {
                expect(facebook.api).toBeDefined();
            });

            it('should call FB.api with args', function() {
                var thruArgs = null;
                spyOn(FB, 'api').andCallFake(function(args){
                    thruArgs = args;
                });
                facebook.api('/me');
                expect(thruArgs).toBe('/me');
            });

            it('should reject errors', function() {
                var expected = {error: {}};
                spyOn(FB, 'api').andCallFake(function(args, callback) {
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
                spyOn(FB, 'api').andCallFake(function(args, callback) {
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
                spyOn(FB, 'api').andCallFake(function(args, callback) {
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
                var thruArgs = null;
                spyOn(FB, 'ui').andCallFake(function(args){
                    thruArgs = args;
                });
                facebook.ui('args');
                expect(thruArgs).toBe('args');
            });

            it('should reject errors', function() {
                var expected = {error: {}};
                spyOn(FB, 'ui').andCallFake(function(args, callback) {
                    callback(expected);
                });
                var result = null;
                facebook.ui('args').then(null, function(error) {
                    console.log(error);
                    result = error;
                });
                rootScope.$apply();
                expect(result).toBe(expected);
            });

            it('should resolve responses', function() {
                var expected = {success: {}};
                spyOn(FB, 'ui').andCallFake(function(args, callback) {
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
                spyOn(FB, 'ui').andCallFake(function(args, callback) {
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
                spyOn(FB, 'getAuthResponse').andReturn(expected)
                expect(facebook.getAuthResponse()).toBe(expected);
            });
        });

        describe('-> getLoginStatus', function() {
            it('should be defined', function() {
                expect(facebook.getLoginStatus).toBeDefined();
            });

            it('should call FB.getLoginStatus with args', function() {
                spyOn(FB, 'getLoginStatus');
                facebook.getLoginStatus();
                expect(FB.getLoginStatus).toHaveBeenCalled();
            });

            it('should reject errors', function() {
                var expected = {error: {}};
                spyOn(FB, 'getLoginStatus').andCallFake(function(callback) {
                    callback(expected);
                });
                var result = null;
                facebook.getLoginStatus().then(null, function(error) {
                    console.log(error);
                    result = error;
                });
                rootScope.$apply();
                expect(result).toBe(expected);
            });

            it('should resolve responses', function() {
                var expected = {success: {}};
                spyOn(FB, 'getLoginStatus').andCallFake(function(callback) {
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
                spyOn(FB, 'getLoginStatus').andCallFake(function(callback) {
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
    });
});