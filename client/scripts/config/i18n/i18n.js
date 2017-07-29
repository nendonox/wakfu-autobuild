'use strict';

app.config(function($translateProvider) {
  $translateProvider.determinePreferredLanguage();
  $translateProvider.fallbackLanguage('en');
  $translateProvider.useSanitizeValueStrategy('escape');
});
