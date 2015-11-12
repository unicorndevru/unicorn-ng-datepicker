angular.module('unicornNgDate').directive('dateFormat', function(moment) {
  return {
    restrict: 'E',
    templateUrl: '/src/unicornNgDate/directives/format/template.html',
    scope: {
      value: '=',
      parse: '@',
      format: '@'
    },
    link: function(scope, element, attrs) {
      var setUpValue;
      setUpValue = function() {
        if (scope.value === void 0) {
          return;
        }
        return scope.formattedValue = moment(scope.value, scope.parse).format(scope.format);
      };
      scope.$watch('value', setUpValue);
      return setUpValue();
    }
  };
});
