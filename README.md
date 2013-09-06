# angular-facebook

Facebook SDK wrapper for AngularJS Apps.

Currently under active development.

## Building

**Once the code is in a stable state I will include a pre-built version in this repository**

This project uses grunt for tooling. To build, navigate to the root directory and run `grunt build`. The built file is located at `build/angular-facebook.min.js`.

## Usage

**NB: Some features INCLUDING initialisation are yet to be fully implemented**

You will need to initialise the facebook SDK externally before bootstrapping your angular app. This is the only way I could find to get around problems with the SDKs async loading routine. If you have any ideas to improve this **please comment, or even better submit a pull request!**

```javascript
window.fbAsyncInit = function() {
    FB.init({
        appId      : 'myApplicationId',
        channelUrl : '//path/to/fbChannel.html'
        status     : true
        cookie     : true
        xfbml      : false
    });
    
    angular.bootstrap(document, ['my-angular-js-app']);
    };
```
```html
<html xmlns:ng="yourApp"> // replaces simple ng-app autoloading
```

Include the module in your app and initialise it:
```javascript
angular
    .module('my-angularjs-app', ['facebook'])
    .run(['$facebook', function($facebook) {
        $facebook.init();
    }]);
```

Use `$facebook` much as you would `FB`. Calls are the same as to the traditional `FB` object, except that they use promises instead of callbacks.
```javascript
angular
    .module('my-angularjs-app')
    .controller('my-controller', ['$facebook', function($facebook) {
        // bind directly to the response promise
        $scope.loginStatus = $facebook.getLoginStatus();
        
        // use the promise in code
        $facebook.getLoginStatus().then(
            function(response) {
                $scope.loginResponse = response;
            },
            function(response) {
                $scope.loginError = response.error;
            }
        );
    }]);
```

The one exception to this is `$facebook.getAuthResponse` which is synchronous.

Events from the facebook SDK are broadcast through the $rootScope of the application. The naming convention is to use the same event name as the Facebook SDK, prepended with 'facebook.' - so 'auth.authResponseChange' is broadcast as 'facebook.auth.authResponseChange. Consume these events as you would any other angular event:
```javascript
angular
    .module('my-angularjs-app')
    .controller('another-controller', ['$scope', '$facebook', function($scope, $facebook) {
        $scope.$on('facebook.auth.authResponseChange', response) {
            $scope.authStatus = response.status;
        }
    }]);
```
