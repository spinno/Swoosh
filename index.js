// Generated by CoffeeScript 1.6.3
var factory, initialize, loadData, mongoose, parseType;

require('js-yaml');

mongoose = require('mongoose');

factory = require('./factory');

parseType = function(mbyString) {
  if (typeof mbyString === "string") {
    return eval(mbyString);
  } else {
    return mbyString.map(parseType);
  }
};

loadData = function(path, fn) {
  var doc, e, err;
  try {
    doc = require(path);
  } catch (_error) {
    e = _error;
    err = e;
  }
  if (doc) {
    return fn(null, doc);
  } else {
    return fn(err);
  }
};

initialize = function(doc) {
  var collection, data, field, fields, mLog, methods, retval, root, runLogs, url, _ref, _ref1;
  runLogs = (_ref = doc.log) != null ? _ref : true;
  url = doc.database;
  root = (_ref1 = doc.path) != null ? _ref1 : "persistent";
  retval = {};
  mLog = function(str) {
    if (runLogs) {
      return console.log(str);
    }
  };
  for (collection in doc.collections) {
    fields = {};
    for (field in doc.collections[collection].fields) {
      data = parseType(doc.collections[collection].fields[field]);
    }
    methods = doc.collections[collection].methods;
    if (typeof methods === "string" && methods === "all") {
      methods = ["get", "put", "post", "delete"];
    }
    retval[collection] = factory(collection, fields, methods, doc.collections[collection]["public"], root);
  }
  if (url) {
    mLog("Establishing database connection");
    mongoose.connect(url, doc["db-options"], function(err) {
      if (!err) {
        return mLog("Successfully connected to database");
      } else {
        return mLog(err);
      }
    });
  }
  mongoose.connection.on('error', function(err) {
    return mLog(err);
  });
  return retval;
};

module.exports = function(path, fn) {
  var self;
  self = this;
  self.route = function(app) {
    var attr, _results;
    _results = [];
    for (attr in self.collections) {
      _results.push(self.collections[attr].route(app));
    }
    return _results;
  };
  return loadData(path, function(err, doc) {
    if (err) {
      return fn(err);
    } else {
      self.collections = initialize(doc);
      return fn.call(self, null, self.collections);
    }
  });
};
