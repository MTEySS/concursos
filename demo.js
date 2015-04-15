//
// Here is how to define your module
// has dependent on mobile-angular-ui
//
var app = angular.module('ConcursosBrowser', [
  'concursosFilters',
  'bookmarkModule',
  'ngRoute',
  'ngSanitize',
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
  $routeProvider.when('/',           {templateUrl: 'home.html', reloadOnSearch: false});
  // $routeProvider.when('/biblioteca', {templateUrl: 'biblioteca.html', reloadOnSearch: false});
  // $routeProvider.when('/biblioteca', {
  //   templateUrl: 'biblioteca.html',
  //   controller: 'bibliotecaCtrl',
  //   reloadOnSearch: false
  // });
  $routeProvider.when('/biblioteca/?:path*?', {
    templateUrl: 'biblioteca.html',
    controller: 'bibliotecaCtrl',
    reloadOnSearch: false
  });
  $routeProvider.when('/preguntas',      {templateUrl: 'preguntas.html', reloadOnSearch: false});
  $routeProvider.when('/links',          {templateUrl: 'links.html', reloadOnSearch: false});
  $routeProvider.when('/afiliate',       {templateUrl: 'afiliate.html', reloadOnSearch: false});
  $routeProvider.when('/acerca',         {templateUrl: 'acerca.html', reloadOnSearch: false});
  $routeProvider.when('/desarrollado',   {templateUrl: 'desarrollado.html', reloadOnSearch: false});
});

//
// For this trivial demo we have just a unique MainController
// for everything
//
app.controller('MainController', [
  '$rootScope', '$scope', 'repoHelper', 'faqs', '$location', '$window',
  function($rootScope, $scope, repoHelper, faqs, $location, $window) {

  // Needed for the loading screen
  $rootScope.$on('$routeChangeStart', function() {
    $rootScope.loading = true;
  });

  $rootScope.$on('$routeChangeSuccess', function() {
    $rootScope.loading = false;
  });

  // Fake text i used here and there.
  $scope.lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel explicabo, aliquid eaque soluta nihil eligendi adipisci error, illum corrupti nam fuga omnis quod quaerat mollitia expedita impedit dolores ipsam. Obcaecati.';

  //
  // 'Scroll' screen
  //
/*
  $scope.scrollItems = [
    { name: 'material_estudio01' }, { name: 'material_estudio02' },
    { name: 'material_estudio03' }, { name: 'material_estudio04' }
  ];
*/

  $scope.open = function(path) {
    var folder = null;
    if (!path || path == '') {
      folder = $scope.root;
    } else {
      folder = $scope.repo.find(path);
      if (!folder) folder = $scope.root;
    }
    $scope.current = folder;
    $scope.parent = (folder === $scope.root) ? null : folder.parent;
    $scope.items = folder.children;
  };

// http://markdalgleish.com/2013/06/using-promises-in-angularjs-views/
  repoHelper.fetch().then(function(repo) {
    $scope.repo = repo;
    $scope.root = repo.current;
    $scope.root.name = 'Biblioteca digital de Concursos';

    $scope.open($scope.root);
  });

  // preguntas frecuentes
  $scope.faqs = faqs;

/*
  $scope.bottomReached = function() {
    alert('Congrats you scrolled to the end of the list!');
  };
*/

  $rootScope.$on('$routeChangeSuccess', function(event) {
    if (!$window.ga) return;
    $window.ga('send', 'pageview', { page: $location.path() });
  });

}]);