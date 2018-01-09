var app = angular.module("wellDoneApp", ['ngRoute', 'angular.filter']);

app.config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider.
      when('/dashboard', {
        templateUrl: 'templates/dashboard.html',
        controller: 'dashboardController'
      }).
      //User
      when('/userdetails', {
        templateUrl: 'templates/userdetail.html',
        controller: 'userdetailController'
      }).
      when('/userdetails/:userid', {
        templateUrl: 'templates/userdetail.html',
        controller: 'userdetailController'
      }).
      //Users (Verwaltung)
      when('/users', {
        templateUrl: 'templates/users.html',
        controller: 'usersController'
      }).
      //User
      when('/users/new', {
        templateUrl: 'templates/usernew.html',
        controller: 'usernewController'
      }).
      //Project
      when('/projects', {
        templateUrl: 'templates/projects.html',
        controller: 'projectsController'
      }).
      when('/projects/new', {
        templateUrl: 'templates/projectnew.html',
        controller: 'projectnewController'
      }).
      when('/projects/:projectid', {
        templateUrl: 'templates/projectdetail.html',
        controller: 'projectdetailController'
      }).
      //Activities (all from DB)
      when('/activitytypes/:activitytypeid', {
        templateUrl: 'templates/activities.html',
        controller: 'activitiesController'
      }).
      when('/activities/new', {
        templateUrl: 'templates/activitynew.html',
        controller: 'activitynewController'
      }).
      when('/activities/:activityid', {
        templateUrl: 'templates/activitydetail.html',
        controller: 'activitydetailController'
      }).
      //Timetracking
      when('/timetracking', {
        templateUrl: 'templates/timetracking.html',
        controller: 'timetrackingController'
      }).
      //Dashboard
      otherwise({
        redirectTo: '/dashboard'
      });
  }]);

var datetimepickeroptions = {
  locale: 'de',
  format: 'L',
  calendarWeeks: true,
  showTodayButton: true,
};

var toLocalDate = function (date) {
  return moment.utc(date).toDate();
};

app.controller('dashboardController', function ($scope, $http) {


});

app.controller('userdetailController', function ($scope, $http, $routeParams) {
  $scope.message = "";
  $scope.iserrmessage = false;
  $scope.password = "";
  $scope.password2 = "";

  $http.post('user/info', { userid: $routeParams.userid }).then(function (response) {
    $scope.user = response.data.data;
    $scope.iserrmessage = !response.data.success;
    $scope.message = response.data.message;

    //Dropdown für Admin
    var selectAdmin = $('#selectadmin');
    selectAdmin.select2();

    //Dropdown für Aactive
    var selectActive = $('#selectactive');
    selectActive.select2();


    if (response.data.success) {
      selectAdmin.val($scope.user.admin);
      selectAdmin.trigger("change");
      selectAdmin.on("select2:select", function (e) {
        var id = selectAdmin.val();
        $scope.user.admin = id;
      });

      selectActive.val($scope.user.active);
      selectActive.trigger("change");
      selectActive.on("select2:select", function (e) {
        var id = selectActive.val();
        $scope.user.active = id;
      });
    }
  });

  $scope.update = function () {
    $scope.message = "";
    $http.post('user/update', {
      userid: $scope.user.id, firstname: $scope.user.firstname, lastname: $scope.user.lastname,
      password: $scope.password, password2: $scope.password2, admin: $scope.user.admin,
      active: $scope.user.active
    }).then(function (response) {

      $scope.iserrmessage = !response.data.success;
      $scope.message = response.data.message;

    });

  };

}); //end userdetailController

app.controller('usernewController', function ($scope, $http, $routeParams) {
  $scope.message = "";
  $scope.iserrmessage = false;
  $scope.password = "";
  $scope.password2 = "";
  $scope.user = { firstname: "", lastname: "", email: "", admin: 0, active: 1 };

  //Dropdown für Admin
  var selectAdmin = $('#selectadmin');
  selectAdmin.select2();

  //Dropdown für Aactive
  var selectActive = $('#selectactive');
  selectActive.select2();


  selectAdmin.val($scope.user.admin);
  selectAdmin.trigger("change");
  selectAdmin.on("select2:select", function (e) {
    var id = selectAdmin.val();
    $scope.user.admin = id;
  });

  selectActive.val($scope.user.active);
  selectActive.trigger("change");
  selectActive.on("select2:select", function (e) {
    var id = selectActive.val();
    $scope.user.active = id;
  });

  $scope.save = function () {
    $scope.message = "";
    $http.post('user/save', {
      firstname: $scope.user.firstname, lastname: $scope.user.lastname, email: $scope.user.email,
      password: $scope.password, password2: $scope.password2, admin: $scope.user.admin,
      active: $scope.user.active
    }).then(function (response) {

      $scope.iserrmessage = !response.data.success;
      $scope.message = response.data.message;

    });

  };

}); //end usernewController



app.controller('usersController', function ($scope, $http) {
  $scope.message = "";
  $scope.iserrmessage = false;

  $scope.isuserinactive = function (user) {
    if (!user.active) {
      return "inactiveuser";
    } else {
      return "";
    }

  };


  $http.get('users/get').then(function (response) {
    $scope.users = response.data.data;

    $scope.message = response.data.message;
    $scope.iserrmessage = !response.data.success;
  });

});

app.controller('projectsController', function ($scope, $http) {

  $scope.showuserprojects = false;

  $scope.update = function () {
    $http.post('projects/get', { showuserprojects: $scope.showuserprojects }).then(function (response) {
      $scope.projects = response.data.data;


    });


  };


  $scope.update();


});//end projectsController


app.controller('projectdetailController', function ($scope, $http, $routeParams) {
  $scope.message = "";
  $scope.iserrmessage = false;

  $scope.update = function () {
    $scope.message = "";
    $http.post('projects/update', { id: $scope.project.id, title: $scope.project.title, owner: $scope.project.owner, status: $scope.project.status, start: $scope.project.start, end: $scope.project.end }).then(function (response) {

      $scope.iserrmessage = !response.data.success;
      $scope.message = response.data.message;

    });
  };


  $http.post('projects/detail', { projectid: $routeParams.projectid }).then(function (response) {
    $scope.project = response.data.data.project;

    $scope.project.start = toLocalDate($scope.project.start);
    $scope.project.end = toLocalDate($scope.project.end);

    $scope.users = response.data.data.users;
    $scope.status = response.data.data.status;

    $scope.activities = response.data.data.activities;


    var userdata = $.map($scope.users, function (user) {
      user.text = user.firstname + ' ' + user.lastname;
      return user;
    });

    var statusdata = $.map($scope.status, function (status) {
      status.text = status.title;
      return status;
    });

    //Dropdown for owner
    var selectOwner = $('#selectowner');
    selectOwner.select2({
      data: userdata
    });
    selectOwner.val($scope.project.owner);
    selectOwner.trigger("change");
    selectOwner.on("select2:select", function (e) {
      var id = selectOwner.val();
      $scope.project.owner = id;
    });

    //Dropdown for projectstatus
    var selectStatus = $('#selectstatus');
    selectStatus.select2({
      data: statusdata
    });
    selectStatus.val($scope.project.status);
    selectStatus.trigger("change");
    selectStatus.on("select2:select", function (e) {
      var id = selectStatus.val();
      $scope.project.status = id;
    });



    var datestart = $('#datestart');
    var dateend = $('#dateend');

    datestart.datetimepicker(datetimepickeroptions);
    datestart.data('DateTimePicker').maxDate($scope.project.end);
    datestart.data('DateTimePicker').date($scope.project.start);
    datestart.on('dp.change', function (e) {
      $scope.project.start = e.date;
      dateend.data('DateTimePicker').minDate(e.date);
    });

    dateend.datetimepicker(datetimepickeroptions);
    dateend.data('DateTimePicker').minDate($scope.project.start);
    dateend.data('DateTimePicker').date($scope.project.end);
    dateend.on('dp.change', function (e) {
      $scope.project.end = e.date;
      datestart.data('DateTimePicker').maxDate(e.date);
    });
  });

});//end projectdetailController


app.controller('projectnewController', function ($scope, $http, $routeParams) {
  $scope.message = "";
  $scope.iserrmessage = false;

  $scope.save = function () {
    $scope.message = "";
    $http.post('projects/save', { title: $scope.project.title, owner: $scope.project.owner, status: $scope.project.status, type: $scope.project.type, start: $scope.project.start, end: $scope.project.end }).then(function (response) {

      $scope.iserrmessage = !response.data.success;
      if (response.data.success) {
        window.location = '#/projects/' + response.data.data.projectid;
      }
      $scope.message = response.data.message;

    });
  };


  $http.post('projects/data').then(function (response) {


    $scope.users = response.data.data.users;
    $scope.status = response.data.data.status;
    $scope.types = response.data.data.types;

    $scope.project = { start: new Date(), end: new Date(), title: 'Neues Projekt', owner: $scope.users[0].id, status: $scope.status[0].id, type: $scope.types[0].id };

    var userdata = $.map($scope.users, function (user) {
      user.text = user.firstname + ' ' + user.lastname;
      return user;
    });

    var statusdata = $.map($scope.status, function (status) {
      status.text = status.title;
      return status;
    });

    var typedata = $.map($scope.types, function (type) {
      type.text = type.title;
      return type;
    });

    //Dropdown for owner
    var selectOwner = $('#selectowner');
    selectOwner.select2({
      data: userdata
    });

    selectOwner.on("select2:select", function (e) {
      var id = selectOwner.val();
      $scope.project.owner = id;
    });

    //Dropdown for projectstatus
    var selectStatus = $('#selectstatus');
    selectStatus.select2({
      data: statusdata
    });

    selectStatus.on("select2:select", function (e) {
      var id = selectStatus.val();
      $scope.project.status = id;
    });

    //Dropdow for projecttype
    var selectType = $('#selecttype');
    selectType.select2({
      data: typedata
    });

    selectType.on("select2:select", function (e) {
      var id = selectType.val();
      $scope.project.type = id;
    });




    var datestart = $('#datestart');
    var dateend = $('#dateend');

    datestart.datetimepicker(datetimepickeroptions);
    datestart.data('DateTimePicker').maxDate($scope.project.end);
    datestart.data('DateTimePicker').date($scope.project.start);
    datestart.on('dp.change', function (e) {
      $scope.project.start = e.date;
      dateend.data('DateTimePicker').minDate(e.date);
    });

    dateend.datetimepicker(datetimepickeroptions);
    dateend.data('DateTimePicker').minDate($scope.project.start);
    dateend.data('DateTimePicker').date($scope.project.end);
    dateend.on('dp.change', function (e) {
      $scope.project.end = e.date;
      datestart.data('DateTimePicker').maxDate(e.date);
    });
  });

});//end projectnewController


app.controller('activitiesController', function ($scope, $http, $routeParams) {

  $scope.showuseractivities = false;
  $scope.activities = [];



  $scope.update = function () {
    $http.post('activities/get', { showuseractivities: $scope.showuseractivities, activitytype: $routeParams.activitytypeid }).then(function (response) {

      $scope.activitytype = response.data.data.type;

      $scope.activities = response.data.data.activities;
    });
  };
  $scope.update();
});//end activitiesController


app.controller('activitydetailController', function ($scope, $http, $routeParams) {
  $scope.message = "";
  $scope.iserrmessage = false;

  $scope.addComment = function () {
    $scope.message = "";

    $http.post('activities/addComment', { text: $scope.commenttext, activityid: $scope.activity.id }).then(function (response) {
      $scope.iserrmessage = !response.data.success;
      $scope.message = response.data.message;

      if (response.data.success) {
        $scope.comments = response.data.data;
        $scope.showCommentBox = false;
      }

    });

  };


  $scope.update = function () {
    $scope.message = "";
    $http.post('activities/update', {
      id: $scope.activity.id, title: $scope.activity.title,
      status: $scope.activity.activitystatus, type: $scope.activity.activitytype,
      responsibleUser: $scope.activity.responsibleUser, start: $scope.activity.start,
      end: $scope.activity.end, description: $scope.activity.description, previous: $scope.activity.previousid,
      projectid: $scope.activity.projectid
    }).then(function (response) {

      $scope.iserrmessage = !response.data.success;
      $scope.message = response.data.message;

    });
  };

  $http.post('activities/detail', { activityid: $routeParams.activityid }).then(function (response) {

    $scope.activity = response.data.data.activity;
    $scope.users = response.data.data.users;
    $scope.status = response.data.data.status;
    $scope.types = response.data.data.types;
    $scope.previous = response.data.data.previous;
    $scope.projects = response.data.data.projects;
    $scope.priorities = response.data.data.priorities;
    $scope.comments = response.data.data.comments;

    $scope.activity.start = toLocalDate($scope.activity.start);
    $scope.activity.end = toLocalDate($scope.activity.end);


    $scope.showPriority = false;
    for (var i = 0; i < $scope.types.length; i++) {
      if ($scope.types[i].id == $scope.activity.activitytype) {
        var x = $scope.types[i].haspriority == 1;
        $scope.showPriority = x;
      }
    }



    var userdata = $.map($scope.users, function (user) {
      user.text = user.firstname + ' ' + user.lastname;
      return user;
    });

    var statusdata = $.map($scope.status, function (astatus) {
      astatus.text = astatus.title;
      return astatus;
    });

    var typedata = $.map($scope.types, function (atypes) {
      atypes.text = atypes.title;
      return atypes;
    });
    var activitydata = $.map($scope.previous, function (prevact) {
      prevact.text = prevact.title;
      return prevact;
    });
    var projectdata = $.map($scope.projects, function (proj) {
      proj.text = proj.title;
      return proj;
    });

    var prioritydata = $.map($scope.priorities, function (prio) {
      prio.text = prio.title;
      return prio;
    });





    //Dropdown für responsibleUser
    var selectUser = $('#selectuser');
    selectUser.select2({
      data: userdata
    });
    selectUser.val($scope.activity.responsibleUser);
    selectUser.trigger("change");
    selectUser.on("select2:select", function (e) {
      var id = selectUser.val();
      $scope.activity.responsibleUser = id;
    });

    //Dropdown für status
    var selectStatus = $('#selectstatus');
    selectStatus.select2({
      data: statusdata
    });
    selectStatus.val($scope.activity.activitystatus);
    selectStatus.trigger("change");
    selectStatus.on("select2:select", function (e) {
      var id = selectStatus.val();
      $scope.activity.activitystatus = id;
    });

    //Dropdown für type
    var selectType = $('#selecttyp');
    selectType.select2({
      data: typedata
    });
    selectType.val($scope.activity.activitytype);
    selectType.trigger("change");
    selectType.on("select2:select", function (e) {
      var id = selectType.val();
      $scope.activity.activitytype = id;


      $scope.showPriority = false;
      for (var i = 0; i < $scope.types.length; i++) {
        if ($scope.types[i].id == $scope.activity.activitytype) {
          var x = $scope.types[i].haspriority == 1;
          $scope.showPriority = x;
        }
      }
      $scope.$apply();
    });

    //Dropdown für PreviousActivity
    var selectActivity = $('#selectactivity');
    selectActivity.select2({
      data: activitydata
    });
    selectActivity.val($scope.activity.previousid);
    selectActivity.trigger("change");
    selectActivity.on("select2:select", function (e) {
      var id = selectActivity.val();
      $scope.activity.previousid = id;
    });

    //Dropdown für Projekt
    var selectProject = $('#selectproject');
    selectProject.select2({
      data: projectdata
    });
    selectProject.val($scope.activity.projectid);
    selectProject.trigger("change");
    selectProject.on("select2:select", function (e) {
      var id = selectProject.val();
      $scope.activity.projectid = id;
    });

    //Dropdown für Priorität
    var selectPriority = $('#selectpriority');
    selectPriority.select2({
      data: prioritydata
    });
    selectPriority.val($scope.activity.priority);
    selectPriority.trigger("change");
    selectPriority.on("select2:select", function (e) {
      var id = selectPriority.val();
      $scope.activity.priority = id;
    });



    //Start und Ende DatePicker

    var datestart = $('#datestart');
    var dateend = $('#dateend');

    datestart.datetimepicker(datetimepickeroptions);
    datestart.data('DateTimePicker').maxDate($scope.activity.end);
    datestart.data('DateTimePicker').date($scope.activity.start);
    datestart.on('dp.change', function (e) {
      $scope.activity.start = e.date;
      dateend.data('DateTimePicker').minDate(e.date);
    });

    dateend.datetimepicker(datetimepickeroptions);
    dateend.data('DateTimePicker').minDate($scope.activity.start);
    dateend.data('DateTimePicker').date($scope.activity.end);
    dateend.on('dp.change', function (e) {
      $scope.activity.end = e.date;
      datestart.data('DateTimePicker').maxDate(e.date);
    });




    $('#selectpriority').next().attr('style', 'width:100%');

  });

});//end activitydetailController



app.controller('activitynewController', function ($scope, $http, $routeParams) {
  $scope.message = "";
  $scope.iserrmessage = false;

  $scope.save = function () {
    $scope.message = "";
    $http.post('activities/save', {
      id: $scope.activity.id, title: $scope.activity.title,
      status: $scope.activity.activitystatus, type: $scope.activity.activitytype,
      responsibleUser: $scope.activity.responsibleUser, start: $scope.activity.start,
      end: $scope.activity.end, description: $scope.activity.description, previous: $scope.activity.previousid,
      projectid: $scope.activity.projectid
    }).then(function (response) {

      $scope.iserrmessage = !response.data.success;
      if (response.data.success) {
        window.location = '#/activities/' + response.data.data.activityid;
      }
      $scope.message = response.data.message;

    });
  };


  $http.post('activities/data').then(function (response) {

    $scope.users = response.data.data.users;
    $scope.status = response.data.data.status;
    $scope.types = response.data.data.types;
    $scope.previous = response.data.data.previous;
    $scope.projects = response.data.data.projects;

    $scope.activity = {
      start: new Date(), end: new Date(), title: 'Neue Aufgabe', responsibleUser: $scope.users[0].id,
      status: $scope.status[0].id, type: $scope.types[0].id, project: $scope.projects[0].id
    }; //Übergeordnete Aktivität auch?



    var userdata = $.map($scope.users, function (user) {
      user.text = user.firstname + ' ' + user.lastname;
      return user;
    });

    var statusdata = $.map($scope.status, function (astatus) {
      astatus.text = astatus.title;
      return astatus;
    });

    var typedata = $.map($scope.types, function (atypes) {
      atypes.text = atypes.title;
      return atypes;
    });
    var activitydata = $.map($scope.previous, function (prevact) {
      prevact.text = prevact.title;
      if ($scope.activity.projectid == prevact.projectid) {
        return prevact;
      }

    });
    var projectdata = $.map($scope.projects, function (proj) {
      proj.text = proj.title;
      return proj;
    });



    //Dropdown für responsibleUser
    var selectUser = $('#selectuser');
    selectUser.select2({
      data: userdata
    });
    selectUser.val($scope.activity.responsibleUser);
    selectUser.trigger("change");
    selectUser.on("select2:select", function (e) {
      var id = selectUser.val();
      $scope.activity.responsibleUser = id;
    });

    //Dropdown für status
    var selectStatus = $('#selectstatus');
    selectStatus.select2({
      data: statusdata
    });
    selectStatus.val($scope.activity.activitystatus);
    selectStatus.trigger("change");
    selectStatus.on("select2:select", function (e) {
      var id = selectStatus.val();
      $scope.activity.activitystatus = id;
    });

    //Dropdown für type
    var selectType = $('#selecttyp');
    selectType.select2({
      data: typedata
    });
    selectType.val($scope.activity.activitytype);
    selectType.trigger("change");
    selectType.on("select2:select", function (e) {
      var id = selectType.val();
      $scope.activity.activitytype = id;
    });

    //Dropdown für PreviousActivity
    var selectActivity = $('#selectactivity');
    selectActivity.select2({
      data: activitydata
    });
    selectActivity.val($scope.activity.previousid);
    selectActivity.trigger("change");
    selectActivity.on("select2:select", function (e) {
      var id = selectActivity.val();
      $scope.activity.previousid = id;
    });

    //Dropdown für Projekt
    var selectProject = $('#selectproject');
    selectProject.select2({
      data: projectdata
    });
    selectProject.val($scope.activity.projectid);
    selectProject.trigger("change");
    selectProject.on("select2:select", function (e) {
      var id = selectProject.val();
      $scope.activity.projectid = id;

      selectActivity.removeClass('select2-offscreen').select2({ data: activitydata });

    });


    //Start und Ende DatePicker

    var datestart = $('#datestart');
    var dateend = $('#dateend');

    datestart.datetimepicker(datetimepickeroptions);
    datestart.data('DateTimePicker').maxDate($scope.activity.end);
    datestart.data('DateTimePicker').date($scope.activity.start);
    datestart.on('dp.change', function (e) {
      $scope.activity.start = e.date;
      dateend.data('DateTimePicker').minDate(e.date);
    });

    dateend.datetimepicker(datetimepickeroptions);
    dateend.data('DateTimePicker').minDate($scope.activity.start);
    dateend.data('DateTimePicker').date($scope.activity.end);
    dateend.on('dp.change', function (e) {
      $scope.activity.end = e.date;
      datestart.data('DateTimePicker').maxDate(e.date);
    });


  });

});//end activitynewController


app.controller('timetrackingController', function ($scope, $http) {


  $scope.message = "";
  $scope.iserrmessage = false;

  $scope.save = function () {
    $scope.message = "";
    $http.post('timetracking/save', { activityid: $scope.activityid, start: $scope.start, end: $scope.end, date: $scope.day }).then(function (response) {

      $scope.iserrmessage = !response.data.success;
      $scope.message = response.data.message;

      if (response.data.success) {
        $scope.loadtimes();
      }
    });

  };

  $scope.loadtimes = function () {
    //Times reset
    $scope.times = [];
    $http.post('timetracking/loadtimes', { date: $scope.day }).then(function (response) {
      if (!response.data.success) {
        $scope.iserrmessage = !response.data.success;
        $scope.message = response.data.message;
      }
      else {
        $scope.times = response.data.data;
      }
    });
  };

  $http.get('timetracking/info').then(function (response) {
    $scope.activities = response.data.data.activities;

    $scope.day = new Date();
    $scope.start = new Date();
    $scope.end = new Date();
    $scope.activityid = $scope.activities[0].id;

    var projects = [];

    for (var i = 0; i < $scope.activities.length; i++) {
      var project = {};
      var found = false;

      for (var j = 0; j < projects.length; j++) {
        if (projects[j].title == $scope.activities[i].pjtitle) {
          project = projects[j];
          found = true;
          break;
        }
      }

      if (!found) {
        project = {
          title: $scope.activities[i].pjtitle,
          activities: []
        };
        projects.push(project);
      }

      project.activities.push($scope.activities[i]);
    }

    var pjData = $.map(projects, function (proj) {
      proj.text = proj.title;
      proj.children = $.map(proj.activities, function (act) {
        act.text = act.acttitle;
        return act
      });
      return proj;
    });

    //Dropdown für Activity
    var selectActivity = $('#selectactivity');
    selectActivity.select2({
      data: pjData
    });
    selectActivity.val($scope.activityid);
    selectActivity.trigger("change");
    selectActivity.on("select2:select", function (e) {
      var id = selectActivity.val();
      $scope.activityid = id;
    });



    //Start und Ende DatePicker

    var datestart = $('#start');
    var dateend = $('#end');
    var day = $('#date');

    day.datetimepicker(datetimepickeroptions);
    day.data('DateTimePicker').maxDate(new Date());
    day.data('DateTimePicker').date($scope.day);
    day.on('dp.change', function (e) {
      $scope.day = new Date(e.date);
      $scope.$apply();
      $scope.loadtimes();


    });

    var timepickeroptions = {
      locale: 'de',
      format: 'LT'
    };

    datestart.datetimepicker(timepickeroptions);
    datestart.data('DateTimePicker').date($scope.start);
    datestart.on('dp.change', function (e) {
      $scope.start = e.date;

      dateend.data('DateTimePicker').minDate(e.date);
    });

    dateend.datetimepicker(timepickeroptions);
    dateend.data('DateTimePicker').date($scope.end);
    dateend.on('dp.change', function (e) {
      $scope.end = e.date;

      datestart.data('DateTimePicker').maxDate(e.date);

    });


    dateend.data('DateTimePicker').minDate($scope.start);
    datestart.data('DateTimePicker').maxDate($scope.end);


    $scope.loadtimes();
  });


}); //end timetrackingController






app.controller('navBarController', function ($scope, $http) {
  $http.post('user/info').then(function (response) {
    $scope.user = response.data.data;
  });

  $scope.logout = function () {

    $http.post('user/logout').then(function (response) {

      window.location = 'login.html';


    });

  };

});


app.controller('sideBarController', function ($scope, $http) {
  $http.get('activitytypes/get').then(function (response) {
    $scope.activitytypes = response.data.data;
  });
});
