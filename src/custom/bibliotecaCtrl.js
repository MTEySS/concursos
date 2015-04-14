app.controller('bibliotecaCtrl', function($scope, $rootScope, $routeParams) {

  console.log($routeParams);

  $scope.open($routeParams.path);
});
