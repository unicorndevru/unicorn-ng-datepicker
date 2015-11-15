angular.module('unicornNgDatepicker').directive('datepickerInputFormat', function(moment) {
  var formatDate = R.curry(function(format, value) {
    return moment(value).format(format)
  })

  return {
    restrict: 'A',
    require: 'ngModel',

    link: function(scope, element, attrs, ngModelCtrl) {
      var formatter = formatDate(attrs.datepickerInputFormat)

      ngModelCtrl.$formatters.push(function(value) {
        value = R.filter(R.compose(R.not, R.isNil), [].concat(value))

        if(!value || value.length === 0){
          return ''
        }

        if(R.is(Array, value)){
          value = R.map(formatter, value)
          return value.join('—')
        } else {
          return formatter(value)
        }
      })
    }
  }
})
