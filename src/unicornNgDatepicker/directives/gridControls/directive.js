angular.module('unicornNgDatepicker').directive('datepickerGridControls', function(moment){
  return {
    restrict: 'E',

    require: 'ngModel',

    templateUrl: '/src/unicornNgDatepicker/directives/gridControls/template.html',

    scope: {
      options: '='
    },

    link: function (scope, element, attrs, ngModelCtrl) {

      scope.months = R.times(R.identity, 12)

      function getCurrentDate(){
        return moment(scope.selectedMonth || +new Date)
      }

      function getCurrentMonth(){
        return getCurrentDate().startOf('month')
      }

      function options(key){
        return scope.options || {}
      }

      scope.isMin = function() {
        if(options().min){
          return +getCurrentMonth() === moment(options().min).startOf('month')
        } else {
          return false
        }
      }

      scope.isMax = function() {
        if(options().max){
          return +getCurrentMonth() === moment(options().max).startOf('month')
        } else {
          return false
        }
      }

      scope.shift = function(count) {
        let date = getCurrentDate()
        date.add(count, 'months')

        if(options().max) {
          date = R.min(options().max, +date)
        }

        if(options().min) {
          date = R.max(options().min, +date)
        }

        scope.selectedMonth = date
      }


      scope.$watch('selectedMonth', function(value, oldValue){
        if(oldValue == value){
          return;
        }
        ngModelCtrl.$setViewValue(value)
      })

      ngModelCtrl.$render = function(){
        scope.selectedMonth = ngModelCtrl.$modelValue || +new Date
      }
    }
  }
})
