angular.module('unicornNgDate').directive('dateFrom', function(moment) {
  return {
    restrict: 'E',
    templateUrl: '/src/unicornNgDate/directives/from/template.html',
    scope: {
      value: '=',
      parse: '@'
    },
    link: function(scope, element) {
      var setUpValue;
      setUpValue = function() {
        return scope.formattedValue = moment(scope.value, scope.parse).from();
      };
      scope.$watch('value', function(value) {
        if (value === void 0) {
          return;
        }
        return setUpValue();
      });
    }
  };
});
