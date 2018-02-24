'use strict';

app.service('Searcher', function($rootScope, $timeout, $window) {
  let self = this;

  let init = () => {
    self.stack = 0;
    self.searcher = new Worker('./workers/searcher.js');
    self.searcher.addEventListener('message', function(message) {
      let action = message.data[0];
      let value = message.data[1];
      if (action === 'candidatesNumber') {
        self.candidatesNumber = value;
      } else if (action === 'searchInfo') {
        self.searchInfo = value;
      } else if (action === 'result') {
        self.searchedNumber = value.count;
        self.result = value;
        self.stack -= 1;
        $timeout(function() {
          $window.scrollTo(0, angular.element(document).find('button')[2].offsetTop);
        }, 150);
      }
      $rootScope.$digest();
    });
  };

  init();

  let search = function(query) {
    if (self.stack === 0) {
      self.stack += 1;
      self.searcher.postMessage(query);
    }
  };

  let cancel = function() {
    if (self.stack > 0) {
      self.searcher.terminate();
      init();
    }
  };

  let getCandidatesNumber = function() {
    return self.candidatesNumber;
  };

  let getSearchInfo = function() {
    return self.searchInfo;
  };

  let getResult = function() {
    return self.result;
  };

  return {
    cancel: cancel,
    search: search,
    getCandidatesNumber: getCandidatesNumber,
    getSearchInfo: getSearchInfo,
    getResult: getResult
  };
});
