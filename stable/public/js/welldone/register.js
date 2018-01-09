var app = angular.module("wellDoneApp", []);

app.controller('registerController', function ($scope, $http) {
    $scope.firstname = "";
    $scope.lastname = "";
    $scope.email = "";
	$scope.password = "";
    $scope.password2 = "";
	$scope.message = "";

	$scope.register = function () {
		$http.post('user/register', { firstname: $scope.firstname, lastname: $scope.lastname, email: $scope.email, password: $scope.password, password2: $scope.password2 }).then(function (response) {
			console.log('RegSuc: ' + response.data.success);
            if (response.data.success) {
				window.location = '/login.html';
			} else {
				$scope.message = 'Fehler: ' + response.data.message;
			}
		});
	}
});