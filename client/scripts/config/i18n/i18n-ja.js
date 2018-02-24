'use strict';

app.config(function($translateProvider) {
  let translations = {
    label: {
      title: 'Wakfu Resistance Puzzle Solver'
    }
  };
  $translateProvider.translations('en', translations);
});
