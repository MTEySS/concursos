//
// Here is how to define your module
// has dependent on mobile-angular-ui
//
var app = angular.module('MobileAngularUiExamples', [
  'ngRoute',
  'mobile-angular-ui',

  // touch/drag feature: this is from 'mobile-angular-ui.gestures.js'
  // it is at a very beginning stage, so please be careful if you like to use
  // in production. This is intended to provide a flexible, integrated and and
  // easy to use alternative to other 3rd party libs like hammer.js, with the
  // final pourpose to integrate gestures into default ui interactions like
  // opening sidebars, turning switches on/off ..
  'mobile-angular-ui.gestures'
]);

//
// You can configure ngRoute as always, but to take advantage of SharedState location
// feature (i.e. close sidebar on backbutton) you should setup 'reloadOnSearch: false'
// in order to avoid unwanted routing.
//
app.config(function($routeProvider) {
  $routeProvider.when('/',              {templateUrl: 'home.html', reloadOnSearch: false});
  $routeProvider.when('/contenidos',    {templateUrl: 'contenidos.html', reloadOnSearch: false});
  $routeProvider.when('/links',         {templateUrl: 'links.html', reloadOnSearch: false});
  $routeProvider.when('/afiliate',      {templateUrl: 'afiliate.html', reloadOnSearch: false});
  $routeProvider.when('/acerca',        {templateUrl: 'acerca.html', reloadOnSearch: false});
});


// http://markdalgleish.com/2013/06/using-promises-in-angularjs-views/

app.factory('myHelper', function($q, $timeout) {
  var getStatic = function(callback) {
    callback([ {name: 'material_helper01'}, {name: 'material_helper02'}, {name: 'material_helper03'} ]);
  };

  var getTimeout = function(callback) {
    $timeout(function() {
      callback([ {name: 'timeout_helper01'}, {name: 'timeout_helper02'}, {name: 'timeout_helper03'} ]);
    }, 1000);
  };

  var getPTimeout = function(callback) {
    var deferred = $q.defer();
    $timeout(function() {
      deferred.resolve([ {name: 'Ptimeout_helper01'}, {name: 'Ptimeout_helper02'}, {name: 'Ptimeout_helper03'} ]);
    }, 1000);
    return deferred.promise;
  };

  var getContents = function(callback) {
    var deferred = $q.defer();
    repo.fetch('MTEySS', 'concursos', 'gh-pages', function() {
      repo.open('/material_estudio');
      deferred.resolve(repo.current.children);
    });
    return deferred.promise;
  };

  return {
    getPTimeout: getPTimeout,
    getTimeout: getTimeout,
    getStatic: getStatic,
    getContents: getContents
  };
});

//
// For this trivial demo we have just a unique MainController
// for everything
//
app.controller('MainController', [ '$rootScope', '$scope', 'myHelper', function($rootScope, $scope, myHelper) {

  // Needed for the loading screen
  $rootScope.$on('$routeChangeStart', function(){
    $rootScope.loading = true;
  });

  $rootScope.$on('$routeChangeSuccess', function(){
    $rootScope.loading = false;
  });

  // Fake text i used here and there.
  $scope.lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel explicabo, aliquid eaque soluta nihil eligendi adipisci error, illum corrupti nam fuga omnis quod quaerat mollitia expedita impedit dolores ipsam. Obcaecati.';

  //
  // 'Scroll' screen
  //

  //$scope.scrollItems = scrollItems;

/*
  $scope.scrollItems = [
    { name: 'material_estudio01' },
    { name: 'material_estudio02' },
    { name: 'material_estudio03' },
    { name: 'material_estudio04' }
  ];
*/

  myHelper.getContents().then(function(items) {
    $scope.scrollItems = items;
  });

/*
  repo.fetch('MTEySS', 'concursos', 'gh-pages', function(){
    console.log(repo);
    repo.open('/material_estudio');
    $scope.scrollItems = repo.current.children;


    console.log($scope.scrollItems);
  });
*/
  $scope.bottomReached = function() {
    alert('Congrats you scrolled to the end of the list!');
  }

}]);