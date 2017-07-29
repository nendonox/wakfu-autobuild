'use strict';

app.directive('statsDirective', function(AppConst) {
  return {
    restrict: 'E',
    scope: {
      stats: '='
    },
    templateUrl: 'directive/stats.html',
    link: function(scope) {
      const existsStatLabels =  _.filter(AppConst.statLabels, (statLabel) => {
        return scope.stats[statLabel];
      });
      scope.normalizedStats = _.map(existsStatLabels, (statLabel) => {
        return {
          label: statLabel,
          value: scope.stats[statLabel]
        };
      });
    }
  };
});
