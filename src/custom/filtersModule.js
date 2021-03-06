angular.module('concursosFilters', [])
.filter('pretty', function() {

  var translate = function(text) {
    var trans = [
      { search: 'publico'       , replace: 'público' },
      { search: 'publicos'      , replace: 'públicos' },
      { search: 'publica'       , replace: 'pública' },
      { search: 'publicas'      , replace: 'públicas' },
      { search: 'etica'         , replace: 'ética' },
      { search: 'regimen'       , replace: 'régimen' },
      { search: 'examen'        , replace: 'exámen' },
      { search: 'triptico'      , replace: 'tríptico' },
      { search: 'secretaria'    , replace: 'secretaría' },
      { search: 'jovenes'       , replace: 'jóvenes' },
      { search: 'linea'         , replace: 'línea' },
      { search: 'credito'       , replace: 'crédito' },
      { search: 'codigo'        , replace: 'código' },
      { search: 'unico'         , replace: 'único' },
      { search: 'economico'     , replace: 'económico' },
      { search: 'domestico'     , replace: 'doméstico' },
      { search: 'prorroga'      , replace: 'prórroga' },
      { search: 'juridicos'     , replace: 'jurídicos' },
      { search: 'dictamen'      , replace: 'dictámen' },
      { search: 'indigenas'     , replace: 'indígenas' },
      { search: 'titulo'        , replace: 'título' },
      { search: 'validos'       , replace: 'válidos' },
      { search: 'minima'        , replace: 'mínima' },
      { search: 'victima'       , replace: 'víctima' },
      { search: 'guia'          , replace: 'guía' },
      { search: /\bate\b/i      , replace: 'ATE' },
      { search: /\bcct\b/i      , replace: 'CCT' },
      { search: /\bapn\b/i      , replace: 'APN' },
      { search: /\bsinep\b/i    , replace: 'SINEP' },
      { search: /\repsal\b/     , replace: 'REPSAL' },
      { search: /\boit\b/       , replace: 'OIT' },
      { search: /\bmas\b/       , replace: 'más' },
      { search: /ion\b/ig       , replace: 'ión' },
      { search: /ion\b/ig       , replace: 'ión' }
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
    i = i.replace(/\bres\s/ig, 'resolución ')

    i = i.replace(/\bda\s/ig, 'decisión administrativa ')

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

