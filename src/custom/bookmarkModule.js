angular.module("bookmarkModule", [])
  .directive("bookmarkPage", function ($window, $location) {
  return {
    restrict: "AEC",
    link: function (scope, element, attrs) {
      // var $ = angular.element;
      element.bind('click', function (e) {
        var bookmarkURL = window.location.href;
        var bookmarkTitle = document.title;
        var triggerDefault = false;

        if (window.sidebar && window.sidebar.addPanel) {
          // Firefox version < 23
          window.sidebar.addPanel(bookmarkTitle, bookmarkURL, '');
        } else if ((window.sidebar && (navigator.userAgent.toLowerCase().indexOf('firefox') > -1)) || (window.opera && window.print)) {
          // Firefox version >= 23 and Opera Hotlist
          var $this = $(this);
          $this.attr('href', bookmarkURL);
          $this.attr('title', bookmarkTitle);
          $this.attr('rel', 'sidebar');
          $this.off(e);
          triggerDefault = true;
        } else if (window.external && ('AddFavorite' in window.external)) {
          // IE Favorite
          window.external.AddFavorite(bookmarkURL, bookmarkTitle);
        } else {
          // WebKit - Safari/Chrome
          alert('Presioná ' + (navigator.userAgent.toLowerCase().indexOf('mac') != -1 ? 'Cmd' : 'Ctrl') + '+D para agregar esta página a tus favoritos.');
        }

        return triggerDefault;
      });
    }

  }
});