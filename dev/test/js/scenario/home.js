describe('Given I have an open browser', function() {
    describe('When I go to the application url without supplying a message', function() {
        beforeEach(function() {
            browser().navigateTo('/dev/src/index.html');
        });

        it('should render the "Hello World" message', function() {
            expect(element('[ng-view] h1:first').text()).toBe('Hello World');
        });
    });

    describe('When I go to the application url with a message supplied', function() {
        beforeEach(function() {
            browser().navigateTo('/dev/src/index.html#/?message=Badger');
        });

        it('should render my "Hello" message', function() {
            expect(element('[ng-view] h1:first').text()).toBe('Hello Badger');
        });
    });
});