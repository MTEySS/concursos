
var API_TEMPLATE = 'https://api.github.com/repos/:owner/:repository/git/trees/:branch?recursive=1';
// https://api.github.com/repos/MTEySS/concursos/git/trees/gh-pages?recursive=1 > test.json

var DOWNLOAD_TEMPLATE = 'https://github.com/:owner/:repository/raw/:branch:full';

// https://github.com/MTEySS/concursos/raw/gh-pages/material_estudio/comunes/convenio_colectivo_trabajo/dec_2098_2008-CCT_SINEP.pdf

var repo = {};

repo.raw = null;
repo.data = [];
repo.tree = [];
repo.current = [];

repo.fetch = function(owner, repository, branch, callback) {

  repo.owner = owner;
  repo.repository = repository;
  repo.branch = branch;

  repo.url = API_TEMPLATE
    .replace(':owner', repo.owner)
    .replace(':repository', repo.repository)
    .replace(':branch', repo.branch)
  ;

  $.getJSON(repo.url, function(data) {
    repo.parse(data.tree);
    callback(repo);
  });

};

repo.parseData = function parseData(raw) {

  var url = function(full) {
    return DOWNLOAD_TEMPLATE
      .replace(':owner', repo.owner)
      .replace(':repository', repo.repository)
      .replace(':branch', repo.branch)
      .replace(':full', full)
    ;
  };

  return raw.map(function(file) {
    var full = '/' + file.path;

    // parse file path and file name
    var matches = /^(.*\/)(.*)/.exec(full);
    var path = matches[1];
    var name = matches[2];
    return {
      name: name,
      path: path,
      full: full,
      type: file.type === 'tree' ? 'folder' : 'file',
      url: url(full),
      size: file.size
    };
  });
};

repo.parseTree = function parseTree(raw, parent, path) {

  var parseChildren = function parseChildren(data, parent, path) {

    // filter and sort data
    var filtered = _(data)
      .filter({path: path})
      .sortByOrder(['type', 'name'], [false, true])
      .value()
    ;

    parent.children = [];

    filtered.forEach(function(child) {
      child = _.clone(child);
      child.parent = parent;
      child.level = parent.level + 1;
      parent.children.push(child);

      // recursive call
      if (child.type === 'folder') {
        parseChildren(raw, child, child.full + '/');
      }
    });
  };

  var tree = {
    name: '',
    path: '/',
    full: '/',
    type: 'folder',
    size: undefined,
    level: 0
  };

  parseChildren(repo.data, tree, '/');

  return tree;
};

repo.parse = function(rawData) {
  repo.raw = rawData;
  repo.data = repo.parseData(repo.raw);
  repo.tree = repo.parseTree(repo.data);
  repo.current = repo.tree;
};

repo.find = function(full) {

  if (full === '') return repo.tree;

  var folders = _.trim(full, '/').split('/');

  var loop = function loop(parent, folders) {
    // found!
    if (folders.length === 0) return parent;

    var folder = folders[0];
    var rest = _.rest(folders);

    var child = _.find(parent.children, { name: folder });
    if (!child) return null;

    // recursive call
    return loop(child, rest);
  };

  return loop(repo.tree, folders);
};

repo.open = function(folder) {
  repo.current = repo.find(folder);
};

repo.normalizeString = function(text) {

  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u')
    .replace(/ú/g, 'u')
  ;
};

repo.filter = function(filter, pre, post) {

  if (pre && !post) {
    pre = '<span class="' + pre + '">';
    post = '</span>';
  }

  var buildRegExp = function(filter) {
    filter = repo.normalizeString(filter);
    var tokens = filter
      .split(/\s+/)           //
      .map(function(token) {
        return '(' + token + ')';
      })
    ;
    var regExp = '(.*)' + tokens.join('(.*)') + '(.*)';
    return new RegExp(regExp, 'ig');
  };

  var r = buildRegExp(filter);

};

/*
repo.tree
[
  {
    name: '/'
    path: ''
    parent: null
    type: 'folder'
    children: [
      {
        name: 'LICENSE'
        path: '/'
        parent: ..
        type: 'file'
        size: 35122
      },
    ]
  }
]



*/

