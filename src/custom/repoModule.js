app.factory('repoHelper', function($http, $q, contents) {

  'use strict';

  var FETCH_REPO = false;

  var REPO_USER = 'MTEySS';
  var REPO_NAME = 'concursos';
  var REPO_BRANCH = 'gh-pages';
  var REPO_ROOT = '/contenidos';

  var API_TEMPLATE = 'https://api.github.com/repos/:owner/:repository/git/trees/:branch?recursive=1';
  // https://api.github.com/repos/MTEySS/concursos/git/trees/gh-pages?recursive=1 > test.json

  // var DOWNLOAD_TEMPLATE = 'https://github.com/:owner/:repository/raw/:branch:full';
  var DOWNLOAD_TEMPLATE = 'http://mteyss.github.io/concursos:full';
  //http://mteyss.github.io/concursos/contenidos/comunes/convenio_colectivo_trabajo/dec_2098_2008-CCT_SINEP.pdf

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

    if (FETCH_REPO) {
      $http.get(repo.url).then(function(response) {
        repo.parse(response.data.tree);
        callback(repo);
      });
    } else {
      repo.parse(contents);
      callback(repo);
    }

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

  repo.parseTree = function(raw, root) {

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

    root = root || REPO_ROOT + '/';

    parseChildren(repo.data, tree, root);

    repo.countChildren(tree);

    return tree;
  };

  repo.countChildren = function countChildren(tree) {
    var count = 0;
    if (!tree.children || !tree.type === 'folder') return count;

    tree.children.forEach(function(leaf) {
      if (leaf.type === 'file') count++;
      if (leaf.type === 'folder') count += countChildren(leaf);
    })
    tree.childrenCount = count;
    return count;
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
      .replace(/ñ/g, 'ni')
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
  var fetch = function(callback) {
    var deferred = $q.defer();
    repo.fetch(REPO_USER, REPO_NAME, REPO_BRANCH, function() {
      // repo.open(REPO_ROOT);
      deferred.resolve(repo);
    });
    return deferred.promise;
  };

  return {
    fetch: fetch
  };

});
