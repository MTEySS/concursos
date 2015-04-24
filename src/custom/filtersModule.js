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
      { search: 'validos'       , replace: 'válidos' },
      { search: 'minima'        , replace: 'mínima' },
      { search: 'victima'       , replace: 'víctima' },
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
})
.filter('selected', function() {

  var normalize = function(text) {
    text = _.deburr(text);
    return text
      .toLowerCase()
      .replace(/\/|,|\:|-|_|\./g, ' ')
    ;
  }

  return function(text, search) {
    var normalText = normalize(text);

    var buildRegExp = function(search) {
      var normalSearch =
        normalize(search)
        .trim()
        .replace(/\s+/g, ' ')
      ;
      var tokens = normalSearch
        .split(' ')
        .map(function(token) {
          return _.escapeRegExp(token);
        })
      ;
      var regExp = '(.*)' + tokens.join('(.*)') + '(.*)';
      return new RegExp(regExp, 'i');
    };

    var pre = "<span class='filter-text'>";
    var post = "</span>";

    var re = buildRegExp(search);

    var normalMatches = re.exec(text);

    if (!normalMatches) return text;

    // remove first element of regular expression result
    normalMatches = normalMatches.slice(1);

    var pos = 0;
    var matches = [];

    normalMatches.forEach(function(normalMatch) {
      var len = normalMatch.length;
      matches.push(text.substr(pos, len));
      pos += len;
    });

    var selected = matches[0];

    for (var i = 1; i < matches.length; i += 2) {
      selected += pre + matches[i] + post + matches[i+1];
    }

    return selected;
  };

});

