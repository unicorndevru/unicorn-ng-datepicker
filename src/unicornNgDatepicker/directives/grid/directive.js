angular.module('unicornNgDatepicker').directive('datepickerGrid', function(){
  return {
    restrict: 'E',

    templateUrl: '/src/unicornNgDatepicker/directives/grid/template.html',

    require: 'ngModel',

    scope: {
      options: '='
    },

    link: function (scope, element, atts, ngModelCtrl) {
      var dayLengthMs = 1000 * 60 * 60 * 24

      scope.$watch('dates', function(dates){
        if(!dates){
          return
        }
        ngModelCtrl.$setViewValue(dates)
      })

      ngModelCtrl.$render = function(){
        if(ngModelCtrl.$modelValue && 0 < ngModelCtrl.$modelValue.length){
          scope.month = R.last([].concat(ngModelCtrl.$modelValue).sort())
        } else {
          scope.month = +new Date + dayLengthMs
        }
        scope.dates = ngModelCtrl.$modelValue
      }
    }
  }
})
