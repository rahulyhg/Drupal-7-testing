srJobs.directive('browse', function ($window, $timeout) {
  return function (scope, element) {

    var window = angular.element($window);

    if ($window.innerWidth <= 768)
      scope.vTabs = true;
    else
      scope.vTabs = false;

    window.bind('resize', function () {
      scope.$apply(function () {
        if ($window.innerWidth <= 768) {
          scope.vTabs = true;
          scope.vTabsShow = true;
          scope.accordian = true;

          $timeout(function () {
            document.getElementById("tab_item-" + scope.currentVTab).classList.remove("resp-tab-active");
            document.getElementById("tab_item-" + scope.tabIndex).classList.add("resp-tab-active");
            scope.currentVTab = scope.tabIndex;
          }, 2000);
        }
        else {
          scope.vTabs = false;
          scope.vTabsShow = false;
          scope.accordian = false;
          document.getElementById("candidate-" + scope.currentTTab).classList.remove("resp-tab-active");
          document.getElementById("candidate-" + scope.tabIndex).classList.add("resp-tab-active");
          scope.currentTTab = scope.tabIndex;
        }
      });
    });

  };
});

srJobs.directive('roles', function ($window, $timeout) {
  return function (scope, element) {

    var window = angular.element($window);

    if ($window.innerWidth <= 768)
      scope.vTabs = true;
    else
      scope.vTabs = false;

    window.bind('resize', function () {
      scope.$apply(function () {
        if ($window.innerWidth <= 768) {
          scope.vTabs = true;
          scope.vTabsShow = true;
          scope.accordian = true;

          $timeout(function () {
            document.getElementById("Vtab_item-" + scope.currentVTab).classList.remove("resp-tab-active");
            document.getElementById("Vtab_item-" + scope.tabIndex).classList.add("resp-tab-active");
            scope.currentVTab = scope.tabIndex;
          }, 2000);
        }
        else {
          scope.vTabs = false;
          scope.vTabsShow = false;
          scope.accordian = false;
          document.getElementById("tab_item-" + scope.currentTTab).classList.remove("resp-tab-active");
          document.getElementById("tab_item-" + scope.tabIndex).classList.add("resp-tab-active");
          scope.currentTTab = scope.tabIndex;
        }
      });
    });

  };
});

srJobs.directive('stickyNav', function ($location, $window, $timeout) {
  return {
    scope: false,
    restrict: 'A',
    link: function (scope, element, attrs) {

      var windowEl = angular.element($window);
      var container = document.getElementById('viewContainer');

      if (container) {
        $timeout(function () {
          container.style.paddingTop = element[0].offsetHeight + 'px';
        }, 3000);

        windowEl.on('resize', function () {
          container.style.paddingTop = element[0].offsetHeight + 'px';
        });

        windowEl.on('scroll', function () {
          container.style.paddingTop = element[0].offsetHeight + 'px';
        });
      }
    }
  };
});

srJobs.directive('stickyHome', function ($location, $window, $timeout) {
  return {
    scope: false,
    restrict: 'A',
    link: function (scope, element, attrs) {

      var windowEl = angular.element($window);
      var container = document.getElementById('roles');
      var header = angular.element(document.querySelector('#sticky-header'));

      $timeout(function () {
        container.style.height = (windowEl[0].outerHeight - (element[0].offsetHeight + header[0].offsetHeight)) + 'px';
      }, 3000);

      windowEl.on('resize', function () {
        $timeout(function () {
          container.style.height = (windowEl[0].outerHeight - (element[0].offsetHeight + header[0].offsetHeight)) + 'px';
        }, 3000);
      });

      windowEl.on('scroll', function () {
        $timeout(function () {
          container.style.height = (windowEl[0].outerHeight - (element[0].offsetHeight + header[0].offsetHeight)) + 'px';
        }, 3000);
      });
    }
  };
});

srJobs.directive('stickyBrowse', function ($location, $window, $timeout) {
  return {
    scope: false,
    restrict: 'A',
    link: function (scope, element, attrs) {

      var windowEl = angular.element($window);
      var container = document.getElementById('listCandidates');
      var header = angular.element(document.querySelector('#sticky-header'));
      var footer = angular.element(document.querySelector('.browse-candidates-fixed'));

      $timeout(function () {
        container.style.marginTop = element[0].offsetHeight + 'px';
        container.style.height = (windowEl[0].outerHeight - (element[0].offsetHeight + header[0].offsetHeight + footer[0].offsetHeight)) + 'px';
      }, 3000);

      windowEl.on('resize', function () {
        $timeout(function () {
          container.style.marginTop = element[0].offsetHeight + 'px';
          container.style.height = (windowEl[0].outerHeight - (element[0].offsetHeight + header[0].offsetHeight + footer[0].offsetHeight)) + 'px';
        }, 3000);
      });

      windowEl.on('scroll', function () {
        $timeout(function () {
          container.style.marginTop = element[0].offsetHeight + 'px';
          container.style.height = (windowEl[0].outerHeight - (element[0].offsetHeight + header[0].offsetHeight + footer[0].offsetHeight)) + 'px';
        }, 3000);
      });
    }
  };
});

srJobs.directive('stickyRoles', function ($location, $window, $timeout) {
  return {
    scope: false,
    restrict: 'A',
    link: function (scope, element, attrs) {

      var windowEl = angular.element($window);
      var container = document.getElementById('listRoles');
      var header = angular.element(document.querySelector('#sticky-header'));

      $timeout(function () {
        container.style.marginTop = element[0].offsetHeight + 'px';
        container.style.height = (windowEl[0].outerHeight - (element[0].offsetHeight + header[0].offsetHeight)) + 'px';
      }, 3000);

      windowEl.on('resize', function () {
        $timeout(function () {
          container.style.marginTop = element[0].offsetHeight + 'px';
          container.style.height = (windowEl[0].outerHeight - (element[0].offsetHeight + header[0].offsetHeight)) + 'px';
        }, 3000);
      });

      windowEl.on('scroll', function () {
        $timeout(function () {
          container.style.marginTop = element[0].offsetHeight + 'px';
          container.style.height = (windowEl[0].outerHeight - (element[0].offsetHeight + header[0].offsetHeight)) + 'px';
        }, 3000);
      });
    }
  };
});

srJobs.directive('stickyRoleNav', function ($location, $window) {
  return {
    scope: false,
    restrict: 'A',
    link: function (scope, element, attrs) {

      var windowEl = angular.element($window);
      var navBar = element;
      var navBarStick = element.next();
      var container = element.parent().next();

      function check() {
        if (window.innerWidth <= 480) {
          navBarStick.removeClass("fixed-role-big");
          if (navBar.offset().top > (window.scrollY * 1 + window.innerHeight * 1)) {
            navBarStick.addClass("fixed-role");
          }
          else {
            navBarStick.removeClass("fixed-role");
          }
        }
        else {
          navBarStick.addClass("fixed-role-big");
        }
      }

      check();
      windowEl.on('scroll', function () {
        check();
      });
      windowEl.on('resize', function () {
        check();
      });

    }
  };
});

srJobs.directive("scrollTo", ["$window", function ($window) {
  return {
    restrict: "AC",
    compile: function () {

      var document = $window.document;

      function scrollInto(idOrName) {
        if (!idOrName)
          $window.scrollTo(0, 0);
        var el = document.getElementById(idOrName);
        if (!el) {//check if an element can be found with name attribute if there is no such id
          el = document.getElementsByName(idOrName);
          if (el && el.length)
            el = el[0];
          else
            el = null;
        }

        if (el) //if an element is found, scroll to the element
          el.scrollIntoView();
        //otherwise, ignore

        $window.scrollTo(0, 0);
      }

      scrollInto();
      return function (scope, element, attr) {
        element.bind("click", function (event) {
          scrollInto(attr.scrollTo);
        });
      };
    }
  };
}]);

srJobs.directive('handlePhoneSubmit', function () {
  return function (scope, element, attr) {
    var textFields = element.find('input');
    element.bind('submit', function () {
      var i = 0;
      var count = textFields.length;
      for (; i < count; i++)
        textFields[i].blur();
    });
  };
});


srJobs.directive('iframeSrc', function () {
  return {
    restrict: 'EA',
    scope: { lat: '@lat', lon: '@lon'},
    replace: true,
    link: function (scope, elem, attrs) {
      var geocoder = new google.maps.Geocoder();
      var latlng = new google.maps.LatLng(scope.lat, scope.lon);
      geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            scope.code = 'https://www.google.com/maps/embed/v1/place?q=' + encodeURI((results[1].formatted_address).split(',').join('+')) + '&zoom=14&key=AIzaSyBt0zuShsvdZ1BvdusdsL5RFeKWjzKsr04&zoom=5';
            elem.attr('src', scope.code);
            scope.locationState = true;
          } else {
            scope.locationState = false;
          }
        } else {
          scope.locationState = false;
        }
      });
    },
    template: '<iframe class="maps" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>'
  };
}); 
