app.controller('evaluateCtrl', [
  '$scope', '$routeParams', 'quizzes', 'string',
  function($scope, $routeParams, quizzes, s) {

    var initResult = function() {
      $scope.result = {
        correct: 0,
        incorrect: 0,
        total: 0,
        score: 0
      }
    };

    var openQuiz = function(quizCode) {
      $scope.quiz = null;
      $scope.question = null;
      $scope.questionIndex = null;
      initResult();

      quizCode = s.slugify(quizCode);
      if (!quizCode) return;

      var quiz = _.find($scope.quizzes, {code: quizCode});
      if (!quiz) return;

      $scope.quiz = quiz;
      $scope.result.total = quiz.questions.length;
      openQuestion();
    };

    var openQuestion = function(index) {
      index = index || 0;

      $scope.questionIndex = index;
      $scope.question = $scope.quiz.questions[index];
    };

    $scope.quizzes = quizzes;
    $scope.quiz = null;

    $scope.openQuiz = openQuiz;

    openQuiz($routeParams.quiz);

    console.log($scope.quizzes);
    console.log($scope.quiz);
    console.log($scope.question);
  }
]);
