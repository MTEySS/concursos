angular.module('concursosFilters', []).filter('pretty', function() {

  var translate = function(text) {
    var trans = [
      { search: 'publico'       , replace: 'público' },
      { search: 'publica'       , replace: 'pública' },
      { search: 'etica'         , replace: 'ética' },
      { search: 'regimen'       , replace: 'régimen' },
      { search: 'examen'        , replace: 'exámen' },
      { search: 'triptico'      , replace: 'tríptico' },
      { search: /sion\b/ig      , replace: 'sión' },
      { search: /cion\b/ig      , replace: 'ción' }
    ];

    trans.forEach(function(t) {
      text = text.replace(t.search, t.replace);
    });

    return text;
  };

  return function(i) {

    i = i.replace(/_/g, ' ');

    i = translate(i);

    // expand res -> resolucion
    i = i.replace(/\bres\s/ig, 'resolucion ')

    // expand dec -> decreto
    i = i.replace(/\bdec\s/ig, 'decreto ')

    // proper case
    i = i.substr(0,1).toUpperCase() + i.substr(1);

    // replace _ with / when in front of years
    i = i.replace(/(\d)\s((?:19|20)\d{2})\b/g, '$1/$2');

    //replace _ with spaces
    // i = i.replace(/_/g, ' ');

    // turn to upper the first letter after a '-'
    i = i.replace( /-([a-zA-Z])/g, function(v) { return v.toUpperCase(); })

    return i;
  };
});