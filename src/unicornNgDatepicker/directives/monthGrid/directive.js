angular.module('unicornNgDatepicker').directive('datepickerMonthGrid', function(moment, $animate){
  return {
    restrict: 'E',

    require: 'ngModel',

    templateUrl: '/src/unicornNgDatepicker/directives/monthGrid/template.html',

    scope: {
      month: '=',
      options: '='
    },

    link: function (scope, element, attrs, ngModelCtrl) {

      $animate.enabled(element, false)

      var dayLengthMs = 1000 * 60 * 60 * 24

      var chunks = function(array, size) {
        var results = []
        while (array.length) {
          results.push(array.splice(0, size))
        }
        return results
      }

      var uniq = R.uniqWith(function(a, b){ return a === b; })


      function isSelected(date) {

        if(!date || !ngModelCtrl.$modelValue){
          return;
        }

        let dates = R.map(function(date){
          return +moment(date).startOf('day')
        }, ngModelCtrl.$modelValue).sort()

        let min = dates[0]
        let max = R.last(dates)

        let dateTs = +date
        return min <= dateTs && dateTs <= max
      }

      function isDisabled(date, todayMs, disableBeforeMs, disableAfterMs) {

        if(!date){
          return true
        }

        var result = false
        todayMs = todayMs || +new Date

        if(disableBeforeMs > 0){
          if(+date < +disableBeforeMs){
            result = true
          }
        }
        else if(disableBeforeMs !== 0){
          if(+date < +todayMs){
            result = true
          }
        }
        if(! result && disableAfterMs > 0) {
          if(+disableAfterMs < +date){
            result = true
          }
        }
        return result
      }

      function setWeekDays(){
        scope.weekDays = R.times(function(num){
          return (num + scope.options.firstDay) % 7
        }, 7)
      }

      function setDays(){

        if(!scope.weekDays){
          setWeekDays()
        }

        let date = moment(scope.month).startOf('month')
        let prevMonthDays =  R.times(R.identity, R.indexOf(date.day(), scope.weekDays))
        let todayMs = +moment().startOf('day')
        let disableBeforeMs = scope.options.disableBefore > 0 ?
            +moment(scope.options.disableBefore).startOf('day')
            :
            scope.options.disableBefore === 0 ? 1 : todayMs
        let disableAfterMs = scope.options.disableAfter > 0 ?
            +moment(scope.options.disableAfter).startOf('day') : null

        let days = R.map(function(day){
          var dayDate = moment(date).set('date', day + 1)
          return {
            day: day + 1,
            date: dayDate,
            isSelected: isSelected(dayDate),
            isDisabled: isDisabled(dayDate, todayMs, disableBeforeMs, disableAfterMs),
            isToday: +dayDate == todayMs,
            isDisabledBefore: disableBeforeMs ? disableBeforeMs == dayDate + dayLengthMs : false,
            isDisabledAfter: disableAfterMs ? disableAfterMs == dayDate - dayLengthMs : false
          }
        }, R.times(R.identity, date.daysInMonth()))
        days = prevMonthDays.concat(days)
        scope.weeks = chunks(days, 7)
      }

      scope.selectDate = function(date) {
        date = moment(date)
        let selected = ngModelCtrl.$modelValue || []
        if (!scope.options.isRange) {
          selected = [+date]
        } else {
          if(1 < selected.length){
            selected = [+date]
          } else {
            selected.push(+date)
            selected = selected.sort()
            selected = [selected[0], R.last(selected)]
          }
        }
        ngModelCtrl.$setViewValue(uniq(selected))
        setDays()
      }

      scope.$watch('month', function(month, oldMonth){
        if(month === oldMonth){
          return
        }
        setDays()
      })

      scope.$watch('options.firstDay', setDays)

      ngModelCtrl.$render = function(){
        setDays()
      }
    }
  }
})
