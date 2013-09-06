# angular-facebook

Facebook SDK wrapper for AngularJS Apps.

Currently under active development.

## Building

**Once the code is in a stable state I will include a pre-built version in this repository**

This project uses grunt for tooling. To build, navigate to the root directory and run `grunt build`. The built file is located at `build/angular-facebook.min.js`.

## Usage

**NB: Some features INCLUDING initialisation are yet to be fully implemented**

Include the module in your app and initialise it with your app ID:
```javascript
angular
    .module('my-angularjs-app', ['facebook'])
    .config(['$facebook', function($facebook) {
        $facebook.init('myApplicationId', 'url/of/channel.html')
            .then(function() {
                // further initialisation code here
            });
    }]);
```

Use `$facebook` as you would expect. Calls are the same as to the traditional `FB` object, except that they use promises instead of callbacks.
```javascript
angular
    .module('my-angularjs-app')
    .controller('my-controller', ['$facebook', function($facebook){
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
