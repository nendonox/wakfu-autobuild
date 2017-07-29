'use strict';

app.filter('statsFilter', function(AppConst) {
  return (stats) => {
    return _.filter(AppConst.statLabels, (statLabel) => {
      return stats[statLabel];
    });
  };
});
