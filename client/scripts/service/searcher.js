'use strict';

var app = angular.module('app');

app.service('Searcher', function($rootScope, $timeout, $window) {
  let self = this;

  self.stack = 0;
  self.searcher = new Worker('../workers/searcher.js');
  self.searcher.addEventListener('message', function(message) {
    let action = message.data[0];
    let value = message.data[1];
    if (action === 'candidatesNumber') {
      self.candidatesNumber = value;
    } else if (action === 'searchedNumber') {
      self.searchedNumber = value;
    } else if (action === 'result') {
      self.searchedNumber = value.count;
      self.result = value;
      self.stack -= 1;
      $timeout(function() {
        $window.scrollTo(0, angular.element(document).find('button')[0].offsetTop);
      }, 150);
    }
    $rootScope.$digest();
  });

  let search = function(query) {
    if (self.stack === 0) {
      self.stack += 1;
      self.searcher.postMessage(query);
    }
  };

  let getCandidatesNumber = function() {
    return self.candidatesNumber;
  };

  let getSearchedNumber = function() {
    return self.searchedNumber;
  };

  let getResult = function() {
    return self.result;
  };

  return {
    search: search,
    getCandidatesNumber: getCandidatesNumber,
    getSearchedNumber: getSearchedNumber,
    getResult: getResult
  };
});
