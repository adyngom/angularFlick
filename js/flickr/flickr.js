(function() {
    angular.module('Flickr', ['ngRoute'])

    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
        // simple app routing
        $routeProvider.
        when('/', {
            templateUrl: './views/pages/home.html'
        }).
        otherwise({
            redirectTo: '/'
        });

        // let's cache our $http requests by default
        $httpProvider.defaults.cache = true;

        // enable CORS
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }])

    .factory('FlickrFactory', ['$http', function($http) {
        var url = "https://api.flickr.com/services/feeds/photos_public.gne?format=json&tags=popular&jsoncallback=JSON_CALLBACK",
            getRecent = getRecent;

        function getRecent(tags) {
            var _tags = (!!tags) ? tags : "aeroplanes";
            return $http({
                method: 'jsonp',
                url: url
            });
        }

        return {
            getList: getRecent
        };
    }])

    .controller('FlickrController', ['FlickrFactory', function(F) {
        this.json = [];

        F.getList()
        .success(function(response) {
            this.json = response.items;
        }.bind(this))
        .error(function(error) {
            console.log(error);
        });
    }])

    .directive('fList', function() {
        return {
            restrict: 'E',
            controller: 'FlickrController',
            templateUrl: './js/flickr/flickr-list.html',
            replace: true,
            bindToController: true,
            controllerAs: 'vm',
            scope: {},
            link: function(scope, el) {
                el.on('click', function(evt) {
                    evt.preventDefault();
                    var _this = evt.target,
                        _data = _this.dataset;
                    console.log(_data);
                });
            }
        }
    })

    .directive('fImage', function() {
        return {
            restrict: 'E',
            require: '^fList',
            templateUrl: './js/flickr/flickr-list-item.html',
            scope: {
                pic: '='
            },
            replace: true
        }
    });
})();
