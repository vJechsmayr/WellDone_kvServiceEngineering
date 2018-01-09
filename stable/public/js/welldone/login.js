var app = angular.module("wellDoneApp", []);

app.controller('loginController', function ($scope, $http) {
    $scope.email = "";
	$scope.password = "";
	$scope.message = "";

	$scope.login = function () {
		$http.post('user/login', { email: $scope.email, passwd: $scope.password }).then(function (response) {
			if (response.data.success) {
				window.location = '/dashboard';
			} else {
				$scope.message = "Email oder Passwort falsch!";
			}
		});
	}
});