angular.module('unicornNgDate').factory('date', function(){
  return {
    today: function(){
      return moment().format('YYYY-MM-DD')
    }
  }
})
