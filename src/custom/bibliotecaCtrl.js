app.controller('bibliotecaCtrl', function($scope, $routeParams) {
  var q = $routeParams.q;
  var path = $routeParams.path;

  if (q) {
    $scope.filterBar.value = q;
    $scope.filter(q, path);
  } else {
    $scope.open(path);
  }
});
