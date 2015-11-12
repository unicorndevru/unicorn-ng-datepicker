angular.module('unicornNgModal').factory('windowPopup', function($window) {
  var windowPopupDefaultParams;
  windowPopupDefaultParams = {
    width: 600,
    height: 500,
    personalbar: 0,
    toolbar: 0,
    scrollbars: 1,
    resizable: 1
  };
  return function(url) {
    var params, win, windowParams;
    params = windowPopupDefaultParams;
    windowParams = angular.extend(windowPopupDefaultParams, {
      left: Math.round(screen.width / 2 - params.width / 2),
      top: screen.height > params.height ? Math.round(screen.height / 3 - params.height / 2) : void 0
    });
    win = $window.open(url, R.join(',', R.map(R.join('='), R.toPairs(windowParams))));
    if (win) {
      return win.focus();
    }
  };
});
