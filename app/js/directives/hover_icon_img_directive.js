'use strict';

module.exports = function(app) {
  app.directive('hoverIconImgDirective', ['$document', function($document) {

    function link(scope, elem, attrs) {
      var imgHref = elem.find('img')[0]['attributes']['ng-src'];
      console.log('IMG-HREF IS TRUE?: ', !!imgHref);
      console.log('ELEMENT IS: ', elem);
      console.log('ELEM[1]: ', elem[1]);
      console.log('ATTRS IS: ', attrs);
      console.log('SCOPE IS: ', scope);

      // If href for image exists, link to hover event
      if(!!imgHref) {
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
    };


    return {
      restrict: 'A',
      link: link
    };
  }]);
};
