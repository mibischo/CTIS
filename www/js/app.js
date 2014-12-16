// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('app', ['ionic', 'webStorageModule']);
/*
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});*/

app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/overview');


  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider.state('overview', {
      url: '/overview',
	  views: {
		overview: {
			templateUrl: 'overview.html',
			controller: 'OverviewCtrl'
		}
	  }	
    });
	
	$stateProvider.state('create', {
      url: '/create',
	  views: {
		create: {
			templateUrl: 'create.html',
			controller: 'createCtrl'
		}
	  }	
    });
	
	$stateProvider.state('statistics', {
      url: '/statistics',
	  views: {
		statistics: {
			templateUrl: 'statistics.html'
		}
	  }	
    });
	
	$stateProvider.state('settings', {
      url: '/settings',
	  views: {
		settings: {
			templateUrl: 'settings.html',
			controller: 'settingsCtrl'
		}
	  }	
    });
});

app.controller('OverviewCtrl', function($scope, webStorage) {

	$scope.view.displayButtons = true;
	$scope.view.displaySearch = false;

	$scope.showSearch = function() {
		$scope.view.displayButtons = false;
		$scope.view.displaySearch = true;
	};
	
	$scope.hideSearch = function() {
		$scope.view.displayButtons = true;
		$scope.view.displaySearch = false;
	};

	var activities = webStorage.get('activities');
	var acts = [];
	
	if (activities == undefined) {
		activities = [];
		webStorage.add('activities', activities);
		/*
		activities.push(1);
		activities.push(2);
		activities.push(3);
		activities.push(4);
		activities.push(5);
		
		
		
		webStorage.add(1, {title:'Joggen'});
		webStorage.add(2, {title:'Brunch'});
		webStorage.add(3, {title:'Fitnesscenter'});
		webStorage.add(4, {title:'Fitnesscenter'});
		webStorage.add(5, {title:'Fitnesscenter'});
		
		webStorage.add('lastid', 5);*/
	} else {
		activities.forEach(function(entry) {
			var e = webStorage.get(entry);
			e.timespan = new Date(Date.now());
			e.timespan.setHours(new Date(new Date(e.endtime) - new Date(e.starttime)).getHours());
			e.timespan.setMinutes(new Date(new Date(e.endtime) - new Date(e.starttime)).getMinutes());
			acts.push(e);
		});
	}
	
	$scope.overview = acts;
});

app.controller('createCtrl', function($scope, webStorage) {

	var object;
	$scope.model = {};
	
	var now = new Date();
	var end = new Date();
	end.setHours(now.getHours()+1);
	
	$scope.model = {
		title: "",
		category: {},
		startdate: now,
		starttime: now,
		enddate: end,
		endtime: end,
		allday: false,
		place: "",
		gps: false,
		description: ""
	};
	
	$scope.categories = [
		{ name: 'Sports', value: 1 },
		{ name: 'Freetime', value: 2 },
		{ name: 'Work', value: 3 }
	];

	$scope.createActivity = function() {
		object = {};
		object.title = $scope.model.title;
		object.category = $scope.model.category;
		object.startdate = new Date(Date.parse($scope.model.startdate));
		object.starttime = object.startdate;
		object.starttime.setHours(parseInt($scope.model.starttime.split(":")[0]));
		object.starttime.setMinutes(parseInt($scope.model.starttime.split(":")[1]));
		object.enddate = new Date(Date.parse($scope.model.enddate));
		object.endtime = object.enddate;
		object.endtime.setHours(parseInt($scope.model.endtime.split(":")[0]));
		object.endtime.setMinutes(parseInt($scope.model.endtime.split(":")[1]));
		object.allday = $scope.model.allday;
		object.place = $scope.model.place;
		object.gps = $scope.model.gps;
		object.description = $scope.model.description;
		object.sharedTwitter = false;
		object.sharedFacebook = false;
		object.sharedGooglePlus = false;
		object.imagelist = [];
		object.videolist = [];
		object.memlist = [];
		
		var id = webStorage.get('lastid') + 1;
		webStorage.add(id, object);
		webStorage.remove('lastid');
		webStorage.add('lastid', id);
		
		var activities = webStorage.get('activities');
		activities.push(id);
		webStorage.remove('activities');
		webStorage.add('activities', activities);
	}
});

app.controller('settingsCtrl', function($scope, webStorage) {
	$scope.clearStorage = function() {
		webStorage.remove('activities');
		webStorage.remove('lastId');
	}
});
