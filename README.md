# angular-facebook

Facebook SDK wrapper for AngularJS Apps.

Currently under active development.

## Tooling

This project uses grunt for tooling. To build, navigate to the root directory and run `grunt build`. To run the tests run `grunt karma:jasmine`.

## Support

Currently supported features of the Facebook SDK:

* User Authentication (login, logout etc)
* Graph API
* UI

## Usage

### Initialisation

Include the module in your app and initialise it during the application config block in the same manner you would initialise the FB SDK:

```javascript
angular
    .module('my-angularjs-app', ['facebook'])
    .config(['$facebookProvider', function($facebookProvider) {
        $facebookProvider.init({
            appId: 'myFbApplicationId',
            channel: '//path/to/channel.html'
        });
    }]);
```

### Methods

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

### Events

Events from the facebook SDK are then broadcast through the $rootScope of the application. The naming convention is to use the same event name as the Facebook SDK, prepended with 'facebook.' - so 'auth.authResponseChange' is broadcast as 'facebook.auth.authResponseChange. Consume these events as you would any other angular event:

```javascript
angular
    .module('my-angularjs-app')
    .controller('another-controller', ['$scope', '$facebook', function($scope, $facebook) {
        $scope.$on('facebook.auth.authResponseChange', response) {
            $scope.authStatus = response.status;
        }
    }]);
```
