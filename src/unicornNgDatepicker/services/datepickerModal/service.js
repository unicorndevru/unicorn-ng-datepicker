angular.module('unicornNgDatepicker').factory('datepickerModal', function(modal, $rootScope){
  return function(model, options) {
    let overlayScope = $rootScope.$new()
    overlayScope.model = model
    overlayScope.options = options

    return modal('/src/unicornNgDatepicker/services/datepickerModal/template.html', overlayScope)
  }
})
