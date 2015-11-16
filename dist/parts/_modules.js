'use strict';

angular.module('unicornNgDatepicker', ['componentsTemplates']);;
'use strict';

angular.module('unicornNgModal', ['componentsTemplates']);;
'use strict';

angular.module('unicornNgModal').factory('modal', ["$rootScope", "$q", "$compile", "$document", "$templateCache", "$timeout", function ($rootScope, $q, $compile, $document, $templateCache, $timeout) {
  var Modal, modalWrapTemplate, openModals;
  var id = 0;
  openModals = {};
  modalWrapTemplate = '/src/unicornNgModal/directives/modal/modalWrap.html';
  Modal = (function () {
    Modal.animationDuration = 500;

    function Modal(layoutTemplateUrl, scope, options1) {
      this.layoutTemplateUrl = layoutTemplateUrl;
      this.options = options1;
      this.scope = scope || $rootScope;
      this.deferred = $q.defer();
      this.promise = this.deferred.promise;
      this.id = 'modal_' + ++id;
      this.scope.$on('$destroy', (function (_this) {
        return function () {
          if (openModals[_this.id]) {
            return _this.close();
          }
        };
      })(this));
      this;
    }

    Modal.prototype.isOpen = function () {
      return openModals[this.id] !== void 0;
    };

    Modal.prototype.close = function (result) {
      if (!this.isOpen()) {
        return;
      }
      this.layout.addClass('modal_closing');
      $timeout((function (_this) {
        return function () {
          openModals[_this.id] = void 0;
          if (_this.layout) {
            _this.layout.remove();
            _this.layout = void 0;
          }
          _this.modalScope.$destroy();
          _this.modalScope = void 0;
          if (R.filter(R.identity, R.values(openModals)).length === 0) {
            return $document.find('body').removeClass('modal-open');
          }
        };
      })(this), Modal.animationDuration);
      return this.deferred.resolve(result);
    };

    Modal.prototype.show = function () {
      var layout, layoutWrap, modal, modalScope;
      if (this.isOpen()) {
        close();
      }
      modal = this;
      modalScope = this.scope.$new();
      this.modalScope = modalScope;
      this.modalScope.$on('$destroy', function () {
        if (modal.isOpen()) {
          return modal.close();
        }
      });
      modalScope.modal = {
        id: this.id,
        options: this.options,
        close: function close() {
          return modal.close.apply(modal, arguments);
        },
        promise: this.promise
      };
      layoutWrap = angular.element($templateCache.get(modalWrapTemplate));
      layout = $templateCache.get(this.layoutTemplateUrl);
      if (layoutWrap.length === 0) {
        throw new Error("Can't find template " + modalWrapTemplate);
      } else if (!layout) {
        throw new Error("Can't find template " + this.layoutTemplateUrl);
      }
      layoutWrap.find('section').append(layout);
      $document.find('body').append(layoutWrap);
      $compile(layoutWrap)(modalScope);
      this.layout = layoutWrap;
      openModals[this.id] = this;
      $timeout((function (_this) {
        return function () {
          if (!$document.find('body').hasClass('modal-open')) {
            return $document.find('body').addClass('modal-open');
          }
        };
      })(this), Modal.animationDuration);
      return this.promise;
    };

    return Modal;
  })();
  return function (templateUrl, scope, options) {
    var modal;
    modal = new Modal(templateUrl, scope, options);
    modal.show();
    return modal;
  };
}]);;
'use strict';

angular.module('unicornNgModal').factory('windowPopup', ["$window", function ($window) {
  var windowPopupDefaultParams;
  windowPopupDefaultParams = {
    width: 600,
    height: 500,
    personalbar: 0,
    toolbar: 0,
    scrollbars: 1,
    resizable: 1
  };
  return function (url) {
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
}]);;
'use strict';

angular.module('unicornNgDatepicker').directive('datepickerDateFormat', ["moment", function (moment) {
  return {
    restrict: 'E',
    templateUrl: '/src/unicornNgDatepicker/directives/dateFormat/template.html',
    scope: {
      value: '=',
      parse: '@',
      format: '@'
    },
    link: function link(scope, element, attrs) {
      var setUpValue;
      setUpValue = function () {
        if (scope.value === void 0) {
          return;
        }
        return scope.formattedValue = moment(scope.value, scope.parse).format(scope.format);
      };
      scope.$watch('value', setUpValue);
      return setUpValue();
    }
  };
}]);;
'use strict';

angular.module('unicornNgDatepicker').directive('datepicker', ["datepickerModal", function (datepickerModal) {
  return {
    restrict: 'E',

    templateUrl: '/src/unicornNgDatepicker/directives/datepicker/template.html',

    require: 'ngModel',

    scope: {
      disableBefore: '=',
      disableAfter: '='
    },

    link: function link(scope, element, attrs, ngModelCtrl) {

      var options = {
        isRange: false,
        firstDay: 1 // locale.selected === 'ru-ru' ? 1 : 0
      };

      var datepickerModalEnt = null;

      ngModelCtrl.$render = function () {
        scope.date = R.filter(R.compose(R.not, R.isNil), [].concat(ngModelCtrl.$modelValue));
      };

      scope.$watch('disableBefore', function (value) {
        options.disableBefore = value > 0 || value === 0 ? value : null;
      });

      scope.$watch('disableAfter', function (value) {
        options.disableAfter = value > 0 || value === 0 ? value : null;
      });

      scope.$watch('date', function (date) {
        if (!date || !date.length) {
          return;
        }
        if (options.isRange) {
          ngModelCtrl.$setViewValue([].concat(date));
        } else {
          ngModelCtrl.$setViewValue(date[0]);
        }
      });

      scope.openDatepicker = function () {
        if (datepickerModalEnt !== null) {
          return datepickerModalEnt;
        }

        datepickerModalEnt = datepickerModal(scope.date, options).promise.then(function (date) {
          if (date) {
            scope.date = date;
          }
        }).finally(function () {
          datepickerModalEnt = null;
        });
      };
    }
  };
}]);;
'use strict';

angular.module('unicornNgDatepicker').directive('datepickerGrid', ["moment", function (moment) {
  return {
    restrict: 'E',

    templateUrl: '/src/unicornNgDatepicker/directives/grid/template.html',

    require: 'ngModel',

    scope: {
      options: '='
    },

    link: function link(scope, element, atts, ngModelCtrl) {
      var dayLengthMs = 1000 * 60 * 60 * 24;

      scope.$watch('dates', function (dates) {
        if (!dates) {
          return;
        }
        ngModelCtrl.$setViewValue(dates);
      });

      ngModelCtrl.$render = function () {
        if (ngModelCtrl.$modelValue && 0 < ngModelCtrl.$modelValue.length) {
          scope.month = R.last([].concat(ngModelCtrl.$modelValue).sort());
        } else {
          scope.month = +new Date() + dayLengthMs;
        }
        scope.dates = ngModelCtrl.$modelValue;
      };
    }
  };
}]);;
'use strict';

angular.module('unicornNgDatepicker').directive('datepickerGridControls', ["moment", function (moment) {
  return {
    restrict: 'E',

    require: 'ngModel',

    templateUrl: '/src/unicornNgDatepicker/directives/gridControls/template.html',

    scope: {
      options: '='
    },

    link: function link(scope, element, attrs, ngModelCtrl) {

      scope.months = R.times(R.identity, 12);

      function getCurrentDate() {
        return moment(scope.selectedMonth || +new Date());
      }

      function getCurrentMonth() {
        return getCurrentDate().startOf('month');
      }

      function options(key) {
        return scope.options || {};
      }

      scope.isMin = function () {
        if (options().min) {
          return +getCurrentMonth() === moment(options().min).startOf('month');
        } else {
          return false;
        }
      };

      scope.isMax = function () {
        if (options().max) {
          return +getCurrentMonth() === moment(options().max).startOf('month');
        } else {
          return false;
        }
      };

      scope.shift = function (count) {
        var date = getCurrentDate();
        date.add(count, 'months');

        if (options().max) {
          date = R.min(options().max, +date);
        }

        if (options().min) {
          date = R.max(options().min, +date);
        }

        scope.selectedMonth = date;
      };

      scope.$watch('selectedMonth', function (value, oldValue) {
        if (oldValue == value) {
          return;
        }
        ngModelCtrl.$setViewValue(value);
      });

      ngModelCtrl.$render = function () {
        scope.selectedMonth = ngModelCtrl.$modelValue || +new Date();
      };
    }
  };
}]);;
'use strict';

angular.module('unicornNgDatepicker').directive('datepickerInputFormat', ["moment", function (moment) {
  var formatDate = R.curry(function (format, value) {
    return moment(value).format(format);
  });

  return {
    restrict: 'A',
    require: 'ngModel',

    link: function link(scope, element, attrs, ngModelCtrl) {
      var formatter = formatDate(attrs.datepickerInputFormat);

      ngModelCtrl.$formatters.push(function (value) {
        value = R.filter(R.compose(R.not, R.isNil), [].concat(value));

        if (!value || value.length === 0) {
          return '';
        }

        if (R.is(Array, value)) {
          value = R.map(formatter, value);
          return value.join('—');
        } else {
          return formatter(value);
        }
      });
    }
  };
}]);;
'use strict';

angular.module('unicornNgDatepicker').directive('datepickerMonthGrid', ["moment", "$animate", function (moment, $animate) {
  return {
    restrict: 'E',

    require: 'ngModel',

    templateUrl: '/src/unicornNgDatepicker/directives/monthGrid/template.html',

    scope: {
      month: '=',
      options: '='
    },

    link: function link(scope, element, attrs, ngModelCtrl) {

      $animate.enabled(element, false);

      var dayLengthMs = 1000 * 60 * 60 * 24;

      var chunks = function chunks(array, size) {
        var results = [];
        while (array.length) {
          results.push(array.splice(0, size));
        }
        return results;
      };

      var uniq = R.uniqWith(function (a, b) {
        return a === b;
      });

      function isSelected(date) {

        if (!date || !ngModelCtrl.$modelValue) {
          return;
        }

        var dates = R.map(function (date) {
          return +moment(date).startOf('day');
        }, ngModelCtrl.$modelValue).sort();

        var min = dates[0];
        var max = R.last(dates);

        var dateTs = +date;
        return min <= dateTs && dateTs <= max;
      }

      function isDisabled(date, todayMs, disableBeforeMs, disableAfterMs) {

        if (!date) {
          return true;
        }

        var result = false;
        todayMs = todayMs || +new Date();

        if (disableBeforeMs > 0) {
          if (+date < +disableBeforeMs) {
            result = true;
          }
        } else if (disableBeforeMs !== 0) {
          if (+date < +todayMs) {
            result = true;
          }
        }
        if (!result && disableAfterMs > 0) {
          if (+disableAfterMs < +date) {
            result = true;
          }
        }
        return result;
      }

      function setWeekDays() {
        scope.weekDays = R.times(function (num) {
          return (num + scope.options.firstDay) % 7;
        }, 7);
      }

      function setDays() {

        if (!scope.weekDays) {
          setWeekDays();
        }

        var date = moment(scope.month).startOf('month');
        var prevMonthDays = R.times(R.identity, R.indexOf(date.day(), scope.weekDays));
        var todayMs = +moment().startOf('day');
        var disableBeforeMs = scope.options.disableBefore > 0 ? +moment(scope.options.disableBefore).startOf('day') : scope.options.disableBefore === 0 ? 1 : todayMs;
        var disableAfterMs = scope.options.disableAfter > 0 ? +moment(scope.options.disableAfter).startOf('day') : null;

        var days = R.map(function (day) {
          var dayDate = moment(date).set('date', day + 1);
          return {
            day: day + 1,
            date: dayDate,
            isSelected: isSelected(dayDate),
            isDisabled: isDisabled(dayDate, todayMs, disableBeforeMs, disableAfterMs),
            isToday: +dayDate == todayMs,
            isDisabledBefore: disableBeforeMs ? disableBeforeMs == dayDate : false,
            isDisabledAfter: disableAfterMs ? disableAfterMs == dayDate : false
          };
        }, R.times(R.identity, date.daysInMonth()));
        days = prevMonthDays.concat(days);
        scope.weeks = chunks(days, 7);
      }

      scope.selectDate = function (date) {
        date = moment(date);
        var selected = ngModelCtrl.$modelValue || [];
        if (!scope.options.isRange) {
          selected = [+date];
        } else {
          if (1 < selected.length) {
            selected = [+date];
          } else {
            selected.push(+date);
            selected = selected.sort();
            selected = [selected[0], R.last(selected)];
          }
        }
        ngModelCtrl.$setViewValue(uniq(selected));
        setDays();
      };

      scope.$watch('month', function (month, oldMonth) {
        if (month === oldMonth) {
          return;
        }
        setDays();
      });

      scope.$watch('options.firstDay', setDays);

      ngModelCtrl.$render = function () {
        setDays();
      };
    }
  };
}]);;
'use strict';

angular.module('unicornNgDatepicker').factory('datepickerModal', ["modal", "$rootScope", function (modal, $rootScope) {
  return function (model, options) {
    var overlayScope = $rootScope.$new();
    overlayScope.model = model;
    overlayScope.options = options;

    return modal('/src/unicornNgDatepicker/services/datepickerModal/template.html', overlayScope);
  };
}]);;
'use strict';

angular.module('unicornNgModal').directive('modalClose', function () {
  return {
    restrict: 'E',
    templateUrl: '/src/unicornNgModal/directives/close/template.html',
    scope: {
      close: '&'
    }
  };
});;
'use strict';

angular.module('unicornNgModal').directive('modal', ["$templateCache", "$compile", "$document", function ($templateCache, $compile, $document) {
  return {
    restrict: 'E',
    terminal: true,
    compile: function compile(element, attrs) {
      return {
        pre: function pre(scope, element) {
          var layout, modal;
          layout = angular.element($templateCache.get("/src/unicornNgModal/directives/modal/template.html"));
          modal = angular.element(element.contents());
          layout.find('section').append(modal);
          element.empty();
          element.append(layout);

          function closeHandler(e) {
            if (e.keyCode == 27) {
              scope.modal.close();
            }
          }

          $document.on('keydown', closeHandler);
          scope.$on('$destroy', function () {
            $document.off('keydown', closeHandler);
          });

          return $compile(layout)(scope);
        }
      };
    }
  };
}]);