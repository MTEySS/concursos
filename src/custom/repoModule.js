app.factory('repoHelper', [
  '$http', '$q', 'contents', 'prettyFilter',  // http://blog.tompawlak.org/use-filter-in-controller-angularjs
  function($http, $q, contents, pretty) {

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
  repo.flat = [];
  repo.filtered = null;
  repo.current = [];

  repo.fetch = function(owner, repository, branch, root, callback) {

    repo.owner = owner;
    repo.repository = repository;
    repo.branch = branch;
    repo.root = root;

    repo.url = API_TEMPLATE
      .replace(':owner', repo.owner)
      .replace(':repository', repo.repository)
      .replace(':branch', repo.branch)
    ;

    if (FETCH_REPO) {
      $http.get(repo.url).then(function(response) {
        repo.parse(response.data.tree, root);
        callback(repo);
      });
    } else {
      repo.parse(contents, root);
      callback(repo);
    }

  };

  repo.parse = function(rawData, root) {

    rawData = _.filter(rawData, function(file) {
      var path = file.path;
      if (!_.startsWith(path, '/')) path = '/' + path;
      return _.startsWith(path, root + '/');
    });

    repo.raw = rawData;
    repo.data = repo.parseData(repo.raw, root);
    repo.tree = repo.parseTree(repo.data);
    repo.flat = repo.parseFlat(repo.tree);
    repo.current = repo.tree;
  };

  repo.parseData = function parseData(raw, root) {

    var buildUrl = function(full) {
      return DOWNLOAD_TEMPLATE
        .replace(':owner', repo.owner)
        .replace(':repository', repo.repository)
        .replace(':branch', repo.branch)
        .replace(':full', full)
      ;
    };

    return raw.map(function(file) {

      var full = '/' + file.path;

      var url = buildUrl(full);

      // remove root from file.path and file.full
      if (_.startsWith(full, root)) {
        full = full.substr(root.length);
        if (!_.startsWith(full, '/')) full = '/' + full;
      }

      // parse file path and file name
      var matches = /^(.*\/)(.*)/.exec(full);
      var path = matches[1];
      var name = matches[2];
      var prettyName = pretty(name);

      return {
        name: name,
        pretty: prettyName,
        search: repo.searchString(prettyName),
        path: path,
        full: full,
        type: file.type === 'tree' ? 'folder' : 'file',
        url: url,
        size: file.size
      };
    });
  };

  repo.parseTree = function(raw) {

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

    repo.countChildren(tree);

    return tree;
  };

  repo.parseFlat = function(tree) {
    var flat = [];

    var addChildren = function addChildren(tree) {
      flat.push(tree);
      if (tree.children) {
        // primero proceso los hijos archivos, luego los hijos carpetas
        _.filter(tree.children, {type: 'file'}).forEach(function(child) {
          addChildren(child);
        })
        _.filter(tree.children, {type: 'folder'}).forEach(function(child) {
          addChildren(child);
        })
      }
    };

    addChildren(tree);
    return flat;
  }

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

  repo.searchString = function(text) {
    text = _.deburr(text);
    return text
      .trim()
      .toLowerCase()
      .replace(/\/|,|\:|-|_|\./g, ' ')
      .replace(/\s+/g, ' ')
    ;
  }

  repo.filter = function(filter, path, includeParent) {

    filter = filter || ''
    path = path || '';
    if (includeParent === undefined) includeParent = true;

    if (!path && !filter) {
      repo.filtered = null;
      return repo.filtered;
    }

    var buildRegExp = function(filter) {
      filter = repo.searchString(filter);
      var tokens = filter
        .split(' ')
        .map(function(token) {
          return _.escapeRegExp(token);
        })
      ;
      var regExp = '.*' + tokens.join('.*') + '.*';
      return new RegExp(regExp, 'i');
    };

    var re = buildRegExp(filter);

    if (path && !_.startsWith(path, '/')) path = '/' + path;
    if (path && !_.endsWith(path, '/')) path += '/';

    var filtered = [];
    var files = repo.flat;
    var file = null;

    for (var i = 0; i < files.length; i++) {
      file = files[i];
      if (path && !_.startsWith(file.path, path)) continue; // out of the folder I'm looking for

      if (re.test(file.search)) {     // it matches!
        // include parent folder
        if (includeParent && file.type === 'file') filtered.push(file.parent);
        filtered.push(file);
      }
    }

    repo.filtered = _.uniq(filtered, 'full');
    return repo.filtered
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
    repo.fetch(REPO_USER, REPO_NAME, REPO_BRANCH, REPO_ROOT, function() {
      // repo.open(REPO_ROOT);
      deferred.resolve(repo);
    });
    return deferred.promise;
  };

  return {
    fetch: fetch
  };

}]);
