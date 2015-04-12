angular.module('concursosFilters', []).filter('pretty', function() {
  return function(i) {

    var trans = {
      'publico': 'público',
      'etica': 'ética',
      'resolucion': 'resolución',
      'funcion': 'función',
      'regulacion': 'regulación',
      'formacion': 'formación',
      'regimen': 'régimen',
      'presentacion': 'presentación',
      'modificacion': 'modificación',
      'revision': 'revisión',
      'examen': 'exámen',
      'triptico': 'tríptico'
    };

    for (key in trans) {
      i = i.replace(key, trans[key]);
    }

    // expand res -> resolucion
    i = i.replace(/\bres_/ig, 'resolucion_')

    // expand dec -> decreto
    i = i.replace(/\bdec_/ig, 'decreto_')

    // proper case
    i = i.substr(0,1).toUpperCase() + i.substr(1);

    // replace _ with / when in front of years
    i = i.replace(/(\d)_((?:19|20)\d{2})\b/g, '$1/$2');

    //replace _ with spaces
    i = i.replace(/_/g, ' ');

    // turn to upper the first letter after a '-'
    i = i.replace( /-([a-zA-Z])/g, function(v) { return v.toUpperCase(); })

    return i;
  };
});