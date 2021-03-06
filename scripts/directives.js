// Using old version of angular that doesn't have the ngKeyup directive built in.
angular.module('fl').directive('ngKeyup', function($parse) {
  return function(scope, element, attr) {
    var fn = $parse(attr['ngKeyup']);
    element.bind('keyup', function(event) {
      scope.$apply(function() {
        fn(scope, {$event:event});
      });
    });
  };
});

angular.module('fl').directive('uxTableFilter', function($filter) {
  return {
    restrict: 'A',
    template: [
        '<div>',
          '<input ng-model="searchModel" type="text" placeholder="Search" ng-keyup="onInputKeyup($event, searchModel)" />',
          '<table class="table table-hover">',
            '<thead ng-show="headers">',
              '<tr>',
                '<th>#</th>',
                '<th ng-repeat="cell in headers">{{cell}}</th>',
              '</tr>',
            '</thead>',
            '<tbody>',
              '<tr ng-repeat="row in data | filter:searchModel" ng-click="clicked(row)">',
                '<td>{{$index + 1}}</td>',
                '<td ng-repeat="cell in row">{{cell}}</td>',
              '</tr>',
            '</tbody>',
          '</table>',
        '</div>'
      ].join('\n'),
    scope: {
      'data': '=uxTableFilter',
      'enterPressed': '&tfReturnCallback',
      'itemClicked': '&tfClickCallback',
      'headers': '=tfHeaders'
    },
    link: function($scope, element, attr) {
      if ($scope.enterPressed) {
        $scope.onInputKeyup = function($event, searchText) {
          if (event.keyCode === 13) {
            $scope.searchModel = '';
            var item = $filter('filter')($scope.data, searchText)[0];
            $scope.enterPressed({item: item});
          }
        }
      }
      $scope.clicked = function(item) {
        if ($scope.itemClicked) {
          $scope.searchModel = '';
          $scope.itemClicked({item: item});
        }
      }
    }
  }
});