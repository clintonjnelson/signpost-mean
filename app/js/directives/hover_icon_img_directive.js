'use strict';

module.exports = function(app) {
  app.directive('hoverIconImgDirective', [function() {

    function link(scope, elem, attrs) {
      var picUrl = scope.sign.picUrl;     // picUrl for Current Elem

      // If picUrl for image exists, link to hover event
      if(picUrl) {
        elem.parent().on('mouseenter mousedown', function() {
          elem.find('svg').css({
            opacity: 0,
            // transition: 'visibility 0.5s linear, opacity 0.5s linear',
            visibility: 'hidden',
          });
          elem.find('img').css({
            opacity: 1,
            // transition: 'visibility 0.5s linear, opacity 0.5s linear',
            visibility: 'visible',
          });
        });
        elem.parent().on('mouseleave mouseup', function() {
          elem.find('svg').css({
            opacity: 1,
            // transition: 'visibility 0.5s linear, opacity 0.5s linear',
            visibility: 'visible',
          });
          elem.find('img').css({
            opacity: 0,
            // transition: 'visibility 0.5s linear, opacity 0.5s linear',
            visibility: 'hidden',
          });
        });
      }
    }


    return {
      restrict: 'A',
      link: link
    };
  }]);
};
