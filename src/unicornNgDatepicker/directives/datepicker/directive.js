angular.module('unicornNgDatepicker').directive('datepicker', function(datepickerModal){
  return {
    restrict: 'E',

    templateUrl: '/src/unicornNgDatepicker/directives/datepicker/template.html',

    require: 'ngModel',

    scope: {
      disableBefore: '=',
      disableAfter: '='
    },

    link: (scope, element, attrs, ngModelCtrl) => {

      var options = {
        isRange: false,
        firstDay: 1 // locale.selected === 'ru-ru' ? 1 : 0
      }

      var datepickerModalEnt = null

      ngModelCtrl.$render = function(){
        scope.date = R.filter(R.compose(R.not, R.isNil), [].concat(ngModelCtrl.$modelValue))
      }

      scope.$watch('disableBefore', function (value) {
        options.disableBefore = value > 0 || value === 0 ? value : null
      })

      scope.$watch('disableAfter', function (value) {
        options.disableAfter = value > 0 || value === 0 ? value : null
      })

      scope.$watch('date', function(date){
        if(!date || !date.length){
          return
        }
        if(options.isRange){
          ngModelCtrl.$setViewValue([].concat(date))
        } else {
          ngModelCtrl.$setViewValue(date[0])
        }
      })

      scope.openDatepicker = function(){
        if(datepickerModalEnt !== null){
          return datepickerModalEnt
        }

        datepickerModalEnt = datepickerModal(scope.date, options).promise.then(function(date){
          if(date){
            scope.date = date
          }
        }).finally(function(){
          datepickerModalEnt = null
        })
      }
    }
  }
})
