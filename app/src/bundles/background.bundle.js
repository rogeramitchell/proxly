(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var AppBackground, Application, app,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Application = require('../../common.coffee');

AppBackground = (function(_super) {
  __extends(AppBackground, _super);

  function AppBackground() {
    this.findFileForQueryString = __bind(this.findFileForQueryString, this);
    this.findFileForPath = __bind(this.findFileForPath, this);
    this.getLocalFile = __bind(this.getLocalFile, this);
    return AppBackground.__super__.constructor.apply(this, arguments);
  }

  AppBackground.prototype.retainedDirs = {};

  AppBackground.prototype.init = function() {
    var error;
    this.Storage.retrieveAll((function(_this) {
      return function() {
        _this.data = _this.Storage.data;
        return _this.maps = _this.data.maps;
      };
    })(this));
    this.Server.getLocalFile = this.getLocalFile;
    this.Storage.onChanged('resourceMap', (function(_this) {
      return function(obj) {
        return _this.MSG.Ext(obj);
      };
    })(this));
    this.LISTEN.Ext('resources', (function(_this) {
      return function(result) {
        return _this.Storage.save('currentResources', result);
      };
    })(this));
    this.LISTEN.Local('startServer', (function(_this) {
      return function(results) {
        return _this.Server.start(results.host, results.port);
      };
    })(this));
    this.LISTEN.Local('stopServer', (function(_this) {
      return function() {
        return _this.Server.stop();
      };
    })(this));
    this.startServer();
    try {
      chrome.app.runtime.onLaunched.addListener(this.openApp);
      return chrome.app.runtime.onRestarted.addListener(this.cleanUp);
    } catch (_error) {
      error = _error;
      return show(error);
    }
  };

  AppBackground.prototype.cleanUp = function() {
    return this.stopServer();
  };

  AppBackground.prototype.getLocalFile = function(info, cb, error) {
    return this.findFileForQueryString(info.url, success, (function(_this) {
      return function(error) {
        return _this.findFileForPath(info, cb, error);
      };
    })(this));
  };

  AppBackground.prototype.findFileForPath = function(info, cb, error) {
    return this.findFileForQueryString(info.url, cb, error, info.referer);
  };

  AppBackground.prototype.findFileForQueryString = function(_url, cb, error, referer) {
    var dir, dirEntry, filePath, item, match, url, _i, _len, _ref, _ref1;
    url = _url.replace(/.*?slredir\=/, '');
    _ref = this.maps;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if ((url.match(new RegExp(item.url), item.regexRepl) != null) && (item.url != null) && (typeof match === "undefined" || match === null)) {
        match = item;
      }
    }
    if (match != null) {
      if (referer != null) {
        filePath = (_ref1 = url.match(/.*\/\/.*?\/(.*)/)) != null ? _ref1[1] : void 0;
      } else {
        filePath = url.replace(new RegExp(match.url), match.regexRepl);
      }
      dir = this.Storage.data.directories[match.directory];
      if (dir == null) {
        return err('no match');
      }
      if (this.retainedDirs[dir.directoryEntryId] != null) {
        dirEntry = this.retainedDirs[dir.directoryEntryId];
        return this.FS.readFile(dirEntry, filePath, (function(_this) {
          return function(fileEntry, file) {
            return typeof cb === "function" ? cb(fileEntry, file) : void 0;
          };
        })(this), (function(_this) {
          return function(error) {
            return error();
          };
        })(this));
      } else {
        return chrome.fileSystem.restoreEntry(dir.directoryEntryId, (function(_this) {
          return function(dirEntry) {
            _this.retainedDirs[dir.directoryEntryId] = dirEntry;
            return _this.FS.readFile(dirEntry, filePath, function(fileEntry, file) {
              return typeof cb === "function" ? cb(fileEntry, file) : void 0;
            }, function(error) {
              return error();
            }, function(error) {
              return error();
            });
          };
        })(this));
      }
    } else {
      return error();
    }
  };

  AppBackground.prototype.startServer = function() {
    return this.Server.start(null, null, null, (function(_this) {
      return function() {
        return _this.MSG.Local({
          'server': _this.Server
        });
      };
    })(this));
  };

  AppBackground.prototype.stopServer = function() {
    this.Server.stop;
    return this.MSG.Local({
      'server': null
    });
  };

  return AppBackground;

})(Application);

app = new AppBackground;


/*
 var whitelistedId = 'pmgnnbdfmmpdkgaamkdiipfgjbpgiofc';
  var addDirectory = function() {
    chrome.app.window.create('index.html', {
        id: "mainwin",
        bounds: {
          width: 50,
          height: 50
        },
    }, function(win) {
        mainWin = win;
    });
  }



    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
          // if (sender.id != whitelistedId)
          //   return sendResponse({"result":"sorry, could not process your message"});

          if (request.directoryEntryId) {
            // sendResponse({"result":"Got Directory"});
            show(request.directoryEntryId);
            directories.push(request.directoryEntryId);
            // chrome.fileSystem.restoreEntry(request.directoryEntryId, function(directoryEntry) {
            //     show(directoryEntry);
            // });

          } else {
            // sendResponse({"result":"Ops, I don't understand this message"});
          }
      });
          chrome.runtime.onMessageExternal.addListener(
        function(request, sender, sendResponse) {
          if (sender.id != whitelistedId) {
            sendResponse({"result":"sorry, could not process your message"});
            return;  // don't allow this extension access
          } else if (request.openDirectory) {
            // sendResponse({"result":"Opening Directory"});
            addDirectory();
          } else {
            sendResponse({"result":"Ops, I don't understand this message"});
          }
      });

    socket.create("tcp", {}, function(_socketInfo) {
        socketInfo = _socketInfo;
        socket.listen(socketInfo.socketId, "127.0.0.1", 33333, 50, function(result) {
        show("LISTENING:", result);
        socket.accept(socketInfo.socketId, onAccept);
    });
    });

    var stopSocket = function() {
        socket.destroy(socketInfo.socketId);
    }
 */


/*
onload = function() {
  var start = document.getElementById("start");
  var stop = document.getElementById("stop");
  var hosts = document.getElementById("hosts");
  var port = document.getElementById("port");
  var directory = document.getElementById("directory");

  var socket = chrome.socket;
  var socketInfo;
  var filesMap = {};

  var rootDir;
  var port, extPort;
  var directories = [];

  var stringToUint8Array = function(string) {
    var buffer = new ArrayBuffer(string.length);
    var view = new Uint8Array(buffer);
    for(var i = 0; i < string.length; i++) {
      view[i] = string.charCodeAt(i);
    }
    return view;
  };

  var arrayBufferToString = function(buffer) {
    var str = '';
    var uArrayVal = new Uint8Array(buffer);
    for(var s = 0; s < uArrayVal.length; s++) {
      str += String.fromCharCode(uArrayVal[s]);
    }
    return str;
  };

  var logToScreen = function(log) {
    logger.textContent += log + "\n";
  }

  var writeErrorResponse = function(socketId, errorCode, keepAlive) {
    var file = { size: 0 };
    console.info("writeErrorResponse:: begin... ");
    console.info("writeErrorResponse:: file = " + file);
    var contentType = "text/plain"; //(file.type === "") ? "text/plain" : file.type;
    var contentLength = file.size;
    var header = stringToUint8Array("HTTP/1.0 " + errorCode + " Not Found\nContent-length: " + file.size + "\nContent-type:" + contentType + ( keepAlive ? "\nConnection: keep-alive" : "") + "\n\n");
    console.info("writeErrorResponse:: Done setting header...");
    var outputBuffer = new ArrayBuffer(header.byteLength + file.size);
    var view = new Uint8Array(outputBuffer)
    view.set(header, 0);
    console.info("writeErrorResponse:: Done setting view...");
    socket.write(socketId, outputBuffer, function(writeInfo) {
      show("WRITE", writeInfo);
      if (keepAlive) {
        readFromSocket(socketId);
      } else {
        socket.destroy(socketId);
        socket.accept(socketInfo.socketId, onAccept);
      }
    });
    console.info("writeErrorResponse::filereader:: end onload...");

    console.info("writeErrorResponse:: end...");
  };

  var write200Response = function(socketId, file, keepAlive) {
    var contentType = (file.type === "") ? "text/plain" : file.type;
    var contentLength = file.size;
    var header = stringToUint8Array("HTTP/1.0 200 OK\nContent-length: " + file.size + "\nContent-type:" + contentType + ( keepAlive ? "\nConnection: keep-alive" : "") + "\n\n");
    var outputBuffer = new ArrayBuffer(header.byteLength + file.size);
    var view = new Uint8Array(outputBuffer)
    view.set(header, 0);

    var fileReader = new FileReader();
    fileReader.onload = function(e) {
       view.set(new Uint8Array(e.target.result), header.byteLength);
       socket.write(socketId, outputBuffer, function(writeInfo) {
         show("WRITE", writeInfo);
         if (keepAlive) {
           readFromSocket(socketId);
         } else {
           socket.destroy(socketId);
           socket.accept(socketInfo.socketId, onAccept);
         }
      });
    };

    fileReader.readAsArrayBuffer(file);
  };

  var onAccept = function(acceptInfo) {
    show("ACCEPT", acceptInfo)
    readFromSocket(acceptInfo.socketId);
  };

  var readFromSocket = function(socketId) {
    //  Read in the data
    socket.read(socketId, function(readInfo) {
      show("READ", readInfo);
      // Parse the request.
      var data = arrayBufferToString(readInfo.data);
      if(data.indexOf("GET ") == 0) {
        var keepAlive = false;
        if (data.indexOf("Connection: keep-alive") != -1) {
          keepAlive = true;
        }

        // we can only deal with GET requests
        var uriEnd =  data.indexOf(" ", 4);
        if(uriEnd < 0) {   return; }
        var uri = data.substring(4, uriEnd);
        // strip qyery string
        var q = uri.indexOf("?");
        if (q != -1) {
          uri = uri.substring(0, q);
        }

        chrome.fileSystem.restoreEntry(directories[0])
        .then(
            (function(url) {
                return function(directoryEntry) {
                    show(directoryEntry);
                    show(uri);
                    directoryEntry.getFile('myNewAppDEV.resource/index.js', {})
                    .then(function(file) {
                        show(file);
                        write200Response(socketId, file, keepAlive);
                    },function(e) {
                        show(e);
                    });

                }
             })(uri)
        );

        // var file =
        // if(!!file == false) {
        //   console.warn("File does not exist..." + uri);
        //   writeErrorResponse(socketId, 404, keepAlive);
        //   return;
        // }
        // logToScreen("GET 200 " + uri);
        // write200Response(socketId, file, keepAlive);
      // }
      // else {
        // Throw an error
        // socket.destroy(socketId);
      // }

  };
});
}


  var whitelistedId = 'pmgnnbdfmmpdkgaamkdiipfgjbpgiofc';


    chrome.runtime.onMessageExternal.addListener(
        function(request, sender, sendResponse) {
          if (sender.id != whitelistedId) {
            sendResponse({"result":"sorry, could not process your message"});
            return;  // don't allow this extension access
          } else if (request.openDirectory) {
            // sendResponse({"result":"Opening Directory"});
            addDirectory();
          } else {
            sendResponse({"result":"Ops, I don't understand this message"});
          }
      });


    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
          // if (sender.id != whitelistedId)
          //   return sendResponse({"result":"sorry, could not process your message"});

          if (request.directoryEntryId) {
            // sendResponse({"result":"Got Directory"});
            show(request.directoryEntryId);
            directories.push(request.directoryEntryId);
            // chrome.fileSystem.restoreEntry(request.directoryEntryId, function(directoryEntry) {
            //     show(directoryEntry);
            // });

          } else {
            // sendResponse({"result":"Ops, I don't understand this message"});
          }
      });
    socket.create("tcp", {}, function(_socketInfo) {
        socketInfo = _socketInfo;
        socket.listen(socketInfo.socketId, "127.0.0.1", 33333, 50, function(result) {
        show("LISTENING:", result);
        socket.accept(socketInfo.socketId, onAccept);
    });
    });

    var stopSocket = function() {
        socket.destroy(socketInfo.socketId);
    }

  var addDirectory = function() {
    chrome.app.window.create('index.html', {
        id: "mainwin",
        bounds: {
          width: 50,
          height: 50
        },
    }, function(win) {
        mainWin = win;
    });
  }

};
 */


},{"../../common.coffee":2}],2:[function(require,module,exports){
var Application, Data, FileSystem, LISTEN, MSG, Mapping, Server, Storage,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

(function() {
  var methods, noop;
  methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
  noop = function() {
    var m, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = methods.length; _i < _len; _i++) {
      m = methods[_i];
      if (!console[m]) {
        _results.push(console[m] = noop);
      }
    }
    return _results;
  };
  if (Function.prototype.bind != null) {
    return window.show = Function.prototype.bind.call(console.log, console);
  } else {
    return window.show = function() {
      return Function.prototype.apply.call(console.log, console, arguments);
    };
  }
})();

MSG = (function() {
  MSG.prototype.isContentScript = location.protocol !== 'chrome-extension:';

  function MSG(config) {
    this.config = config;
  }

  MSG.prototype.Local = function(message, respond) {
    show("== MESSAGE " + (JSON.stringify(message)) + " ==>");
    return chrome.runtime.sendMessage(message, respond);
  };

  MSG.prototype.Ext = function(message, respond) {
    show("== MESSAGE " + (JSON.stringify(message)) + " ==>");
    return chrome.runtime.sendMessage(this.config.EXT_ID, message, respond);
  };

  return MSG;

})();

LISTEN = (function() {
  LISTEN.prototype.local = {
    api: chrome.runtime.onMessage,
    listeners: {}
  };

  LISTEN.prototype.external = {
    api: chrome.runtime.onMessageExternal,
    listeners: {}
  };

  function LISTEN(config) {
    this._onMessage = __bind(this._onMessage, this);
    this._onMessageExternal = __bind(this._onMessageExternal, this);
    this.Ext = __bind(this.Ext, this);
    this.Local = __bind(this.Local, this);
    var _ref;
    this.config = config;
    this.local.api.addListener(this._onMessage);
    if ((_ref = this.external.api) != null) {
      _ref.addListener(this._onMessageExternal);
    }
  }

  LISTEN.prototype.Local = function(message, callback) {
    return this.local.listeners[message] = callback;
  };

  LISTEN.prototype.Ext = function(message, callback) {
    return this.external.listeners[message] = callback;
  };

  LISTEN.prototype._onMessageExternal = function(request, sender, sendResponse) {
    var key, _base, _results;
    show(("<== EXTERNAL MESSAGE == " + this.config.EXT_TYPE + " ==") + request);
    if (sender.id !== this.config.EXT_ID) {
      return void 0;
    }
    _results = [];
    for (key in request) {
      _results.push(typeof (_base = this.external.listeners)[key] === "function" ? _base[key](request[key], sendResponse) : void 0);
    }
    return _results;
  };

  LISTEN.prototype._onMessage = function(request, sender, sendResponse) {
    var key, _base, _results;
    show(("<== MESSAGE == " + this.config.EXT_TYPE + " ==") + request);
    _results = [];
    for (key in request) {
      _results.push(typeof (_base = this.local.listeners)[key] === "function" ? _base[key](request[key], sendResponse) : void 0);
    }
    return _results;
  };

  return LISTEN;

})();

Data = (function() {
  function Data() {}

  Data.prototype.mapping = [
    {
      directory: null,
      urlPattern: null
    }
  ];

  Data.prototype.resources = [
    {
      resource: null,
      file: null
    }
  ];

  return Data;

})();

Storage = (function() {
  Storage.prototype.api = chrome.storage.local;

  Storage.prototype.data = {};

  Storage.prototype.callback = function() {};

  function Storage(callback) {
    this.callback = callback;
    this.retrieveAll();
    this.onChangedAll();
  }

  Storage.prototype.save = function(key, item) {
    var obj;
    obj = {};
    obj[key] = item;
    return this.api.set(obj);
  };

  Storage.prototype.saveAll = function() {
    return this.api.set(this.data);
  };

  Storage.prototype.retrieve = function(key, cb) {
    return this.api.get(key, function(results) {
      var r;
      for (r in results) {
        this.data[r] = results[r];
      }
      if (cb != null) {
        return cb(results[key]);
      }
    });
  };

  Storage.prototype.retrieveAll = function(cb) {
    return this.api.get((function(_this) {
      return function(result) {
        _this.data = result;
        if (typeof _this.callback === "function") {
          _this.callback(result);
        }
        if (typeof cb === "function") {
          cb(result);
        }
        return show(result);
      };
    })(this));
  };

  Storage.prototype.onChanged = function(key, cb) {
    return chrome.storage.onChanged.addListener(function(changes, namespace) {
      if ((changes[key] != null) && (cb != null)) {
        cb(changes[key].newValue);
      }
      return typeof this.callback === "function" ? this.callback(changes) : void 0;
    });
  };

  Storage.prototype.onChangedAll = function() {
    return chrome.storage.onChanged.addListener((function(_this) {
      return function(changes, namespace) {
        var c;
        for (c in changes) {
          _this.data[c] = changes[c].newValue;
        }
        return typeof _this.callback === "function" ? _this.callback(changes) : void 0;
      };
    })(this));
  };

  return Storage;

})();

FileSystem = (function() {
  FileSystem.prototype.api = chrome.fileSystem;

  function FileSystem() {
    this.openDirectory = __bind(this.openDirectory, this);
  }

  FileSystem.prototype.readFile = function(dirEntry, path, success, error) {
    return this.getFileEntry(dirEntry, path, (function(_this) {
      return function(fileEntry) {
        return fileEntry.file(function(file) {
          return success(fileEntry, file);
        }, function(error) {
          return error();
        });
      };
    })(this), (function(_this) {
      return function(error) {
        return error();
      };
    })(this));
  };

  FileSystem.prototype.getFileEntry = function(dirEntry, path, success, error) {
    if ((dirEntry != null ? dirEntry.getFile : void 0) != null) {
      return dirEntry.getFile(path, {}, function(fileEntry) {
        return success(fileEntry);
      });
    } else {
      return error();
    }
  };

  FileSystem.prototype.openDirectory = function(callback) {
    return this.api.chooseEntry({
      type: 'openDirectory'
    }, (function(_this) {
      return function(directoryEntry, files) {
        return _this.api.getDisplayPath(directoryEntry, function(pathName) {
          var dir;
          dir = {
            relPath: directoryEntry.fullPath.replace('/' + directoryEntry.name, ''),
            directoryEntryId: _this.api.retainEntry(directoryEntry),
            entry: directoryEntry
          };
          return callback(pathName, dir);
        });
      };
    })(this));
  };

  return FileSystem;

})();

Mapping = (function() {
  Mapping.prototype.resource = null;

  Mapping.prototype.local = null;

  Mapping.prototype.regex = null;

  function Mapping(resource, local, regex) {
    var _ref;
    _ref = [local, resource, regex], this.local = _ref[0], this.resource = _ref[1], this.regex = _ref[2];
  }

  Mapping.prototype.getLocalResource = function() {
    return this.resource.replace(this.regex, this.local);
  };

  Mapping.prototype.setRedirectDeclarative = function(tabId) {
    var rules;
    rules = [].push({
      priority: 100,
      conditions: [
        new chrome.declarativeWebRequest.RequestMatcher({
          url: {
            urlMatches: this.regex
          }
        })
      ],
      actions: [
        new chrome.declarativeWebRequest.RedirectRequest({
          redirectUrl: this.getLocalResource()
        })
      ]
    });
    return chrome.declarativeWebRequest.onRequest.addRules(rules);
  };

  return Mapping;

})();


/*
class File
    constructor: (directoryEntry, path) ->
        @dirEntry = directoryEntry
        @path = path
 */

Server = (function() {
  Server.prototype.socket = chrome.socket;

  Server.prototype.host = "127.0.0.1";

  Server.prototype.port = 8082;

  Server.prototype.maxConnections = 500;

  Server.prototype.socketProperties = {
    persistent: true,
    name: 'SLRedirector'
  };

  Server.prototype.socketInfo = null;

  Server.prototype.getLocalFile = null;

  Server.prototype.socketIds = [];

  Server.prototype.stopped = false;

  function Server() {
    this._onAccept = __bind(this._onAccept, this);
    this._onListen = __bind(this._onListen, this);
    this._onReceive = __bind(this._onReceive, this);
  }

  Server.prototype.start = function(host, port, maxConnections, cb) {
    this.host = host != null ? host : this.host;
    this.port = port != null ? port : this.port;
    this.maxConnections = maxConnections != null ? maxConnections : this.maxConnections;
    return this.killAll((function(_this) {
      return function() {
        return _this.socket.create('tcp', {}, function(socketInfo) {
          _this.socketIds = [];
          _this.socketIds.push(socketInfo.socketId);
          chrome.storage.local.set({
            'socketIds': _this.socketIds
          });
          return _this.socket.listen(socketInfo.socketId, _this.host, _this.port, function(result) {
            show('listening ' + socketInfo.socketId);
            _this.stopped = false;
            _this.socketInfo = socketInfo;
            return _this.socket.accept(socketInfo.socketId, _this._onAccept);
          });
        });
      };
    })(this));
  };

  Server.prototype.killAll = function(callback) {
    return chrome.storage.local.get('socketIds', (function(_this) {
      return function(result) {
        var s, _fn, _i, _len, _ref;
        show('got ids');
        show(result);
        _this.socketIds = result.socketIds;
        _ref = _this.socketIds != null;
        _fn = function(s) {
          var error;
          try {
            _this.socket.disconnect(s);
            _this.socket.destroy(s);
            return show('killed ' + s);
          } catch (_error) {
            error = _error;
            return show("could not kill " + s + " because " + error);
          }
        };
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          s = _ref[_i];
          _fn(s);
        }
        return typeof callback === "function" ? callback() : void 0;
      };
    })(this));
  };

  Server.prototype.stop = function() {
    this.killAll();
    return this.stopped = true;
  };

  Server.prototype._onReceive = function(receiveInfo) {
    return show("Client socket 'receive' event: sd=" + receiveInfo.socketId, +", bytes=" + receiveInfo.data.byteLength);
  };

  Server.prototype._onListen = function(serverSocketId, resultCode) {
    if (resultCode < 0) {
      return show('Error Listening: ' + chrome.runtime.lastError.message);
    }
    this.serverSocketId = serverSocketId;
    this.tcpServer.onAccept.addListener(this._onAccept);
    this.tcpServer.onAcceptError.addListener(this._onAcceptError);
    return this.tcp.onReceive.addListener(this._onReceive);
  };

  Server.prototype._onAcceptError = function(error) {
    return show(error);
  };

  Server.prototype._onAccept = function(socketInfo) {
    show("Server socket 'accept' event: sd=" + socketInfo.socketId);
    return this._readFromSocket(socketInfo.socketId, (function(_this) {
      return function(info) {
        return _this.getLocalFile(info, function(fileEntry, fileReader) {
          return _this._write200Response(socketInfo.socketId, fileEntry, fileReader, info.keepAlive);
        }, function(error) {
          return _this._writeError(socketInfo.socketId, 404, info.keepAlive);
        });
      };
    })(this));
  };

  Server.prototype.stringToUint8Array = function(string) {
    var buffer, i, view;
    buffer = new ArrayBuffer(string.length);
    view = new Uint8Array(buffer);
    i = 0;
    while (i < string.length) {
      view[i] = string.charCodeAt(i);
      i++;
    }
    return view;
  };

  Server.prototype.arrayBufferToString = function(buffer) {
    var s, str;
    str = new Uint8Array(buffer);
    s = 0;
    while (s < uArrayVal.length) {
      str += String.fromCharCode(uArrayVal[s]);
      s++;
    }
    return str;
  };

  Server.prototype._write200Response = function(socketId, fileEntry, file, keepAlive) {
    var contentLength, contentType, header, outputBuffer, reader, view;
    contentType = (file.type === "" ? "text/plain" : file.type);
    contentLength = file.size;
    header = this.stringToUint8Array("HTTP/1.0 200 OK\nContent-length: " + file.size + "\nContent-type:" + contentType + (keepAlive ? "\nConnection: keep-alive" : "") + "\n\n");
    outputBuffer = new ArrayBuffer(header.byteLength + file.size);
    view = new Uint8Array(outputBuffer);
    view.set(header, 0);
    reader = new FileReader;
    reader.onload = (function(_this) {
      return function(ev) {
        view.set(new Uint8Array(ev.target.result), header.byteLength);
        return _this.socket.write(socketId, outputBuffer, function(writeInfo) {
          show(writeInfo);
          return _this.end(socketId, keepAlive);
        });
      };
    })(this);
    reader.onerror = (function(_this) {
      return function(error) {
        return _this.end(socketId, keepAlive);
      };
    })(this);
    return reader.readAsArrayBuffer(file);
  };

  Server.prototype._readFromSocket = function(socketId, cb) {
    return this.socket.read(socketId, (function(_this) {
      return function(readInfo) {
        var data, info, keepAlive, uri, uriEnd, _ref;
        show("READ", readInfo);
        data = _this.arrayBufferToString(readInfo.data);
        show(data);
        if (data.indexOf("GET ") !== 0) {
          _this.end(socketId);
          return;
        }
        keepAlive = false;
        if (data.indexOf('Connection: keep-alive' !== -1)) {
          keepAlive = true;
        }
        uriEnd = data.indexOf(" ", 4);
        if (uriEnd < 0) {
          return end(socketId);
        }
        uri = data.substring(4, uriEnd);
        if (uri == null) {
          writeError(socketId, 404, keepAlive);
          return;
        }
        info = {
          uri: uri,
          keepAlive: keepAlive
        };
        info.referer = (_ref = data.match(/Referer:\s(.*)/)) != null ? _ref[1] : void 0;
        return typeof cb === "function" ? cb(info) : void 0;
      };
    })(this));
  };

  Server.prototype.end = function(socketId, keepAlive) {
    this.socket.disconnect(socketId);
    this.socket.destroy(socketId);
    show('ending ' + socketId);
    return this.socket.accept(this.socketInfo.socketId, this._onAccept);
  };

  Server.prototype._writeError = function(socketId, errorCode, keepAlive) {
    var contentLength, contentType, file, header, outputBuffer, view;
    file = {
      size: 0
    };
    console.info("writeErrorResponse:: begin... ");
    console.info("writeErrorResponse:: file = " + file);
    contentType = "text/plain";
    contentLength = file.size;
    header = this.stringToUint8Array("HTTP/1.0 " + errorCode + " Not Found\nContent-length: " + file.size + "\nContent-type:" + contentType + (keepAlive ? "\nConnection: keep-alive" : "") + "\n\n");
    console.info("writeErrorResponse:: Done setting header...");
    outputBuffer = new ArrayBuffer(header.byteLength + file.size);
    view = new Uint8Array(outputBuffer);
    view.set(header, 0);
    console.info("writeErrorResponse:: Done setting view...");
    return this.socket.write(socketId, outputBuffer, (function(_this) {
      return function(writeInfo) {
        show("WRITE", writeInfo);
        return _this.end(socketId, keepAlive);
      };
    })(this));
  };

  return Server;

})();

Application = (function() {
  var show;

  Application.prototype.config = {
    APP_ID: 'cecifafpheghofpfdkhekkibcibhgfec',
    EXTENSION_ID: 'dddimbnjibjcafboknbghehbfajgggep'
  };

  Application.prototype.data = null;

  Application.prototype.LISTEN = null;

  Application.prototype.MSG = null;

  Application.prototype.Storage = null;

  Application.prototype.FS = null;

  Application.prototype.Server = null;

  function Application() {
    this.setRedirect = __bind(this.setRedirect, this);
    this.openApp = __bind(this.openApp, this);
    this.startServer = __bind(this.startServer, this);
    this.init = __bind(this.init, this);
    this.Storage = new Storage;
    this.FS = new FileSystem;
    this.Server = new Server;
    this.config.SELF_ID = chrome.runtime.id;
    this.config.EXT_ID = this.config.APP_ID === this.config.SELF_ID ? this.config.EXTENSION_ID : this.config.APP_ID;
    this.config.EXT_TYPE = this.config.APP_ID !== this.config.SELF_ID ? 'EXTENSION' : 'APP';
    this.MSG = new MSG(this.config);
    this.LISTEN = new LISTEN(this.config);
    this.appWindow = null;
    this.port = 31337;
    this.data = this.Storage.data;
    this.init();
  }

  Application.prototype.init = function() {};

  Application.prototype.addMapping = function() {};

  Application.prototype.launchApp = function(cb) {
    return chrome.management.launchApp(this.config.APP_ID);
  };

  Application.prototype.startServer = function() {};

  Application.prototype.openApp = function() {
    return chrome.app.window.create('index.html', {
      id: "mainwin",
      bounds: {
        width: 500,
        height: 800
      }
    }, (function(_this) {
      return function(win) {
        return _this.appWindow = win;
      };
    })(this));
  };

  Application.prototype.setRedirect = function() {
    return void 0;
  };

  show = function() {
    var log;
    if (window.console) {
      if (Function.prototype.bind) {
        log = Function.prototype.bind.call(console.log, console);
      } else {
        log = function() {
          Function.prototype.apply.call(console.log, console, arguments_);
        };
      }
      return log.apply(this, arguments_);
    }
  };

  return Application;

})();

module.exports = Application;


},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZGFuaWVsL0RyaXZlL2Rldi9yZXNlYXJjaC9yZWRpcmVjdG9yL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2RhbmllbC9Ecml2ZS9kZXYvcmVzZWFyY2gvcmVkaXJlY3Rvci9hcHAvc3JjL2JhY2tncm91bmQuY29mZmVlIiwiL1VzZXJzL2RhbmllbC9Ecml2ZS9kZXYvcmVzZWFyY2gvcmVkaXJlY3Rvci9jb21tb24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDVUEsSUFBQSwrQkFBQTtFQUFBOztpU0FBQTs7QUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLHFCQUFSLENBQWQsQ0FBQTs7QUFBQTtBQUdJLGtDQUFBLENBQUE7Ozs7Ozs7R0FBQTs7QUFBQSwwQkFBQSxZQUFBLEdBQWEsRUFBYixDQUFBOztBQUFBLDBCQUNBLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFDRixRQUFBLEtBQUE7QUFBQSxJQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFxQixDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQSxHQUFBO0FBQ2pCLFFBQUEsS0FBQyxDQUFBLElBQUQsR0FBUSxLQUFDLENBQUEsT0FBTyxDQUFDLElBQWpCLENBQUE7ZUFDQSxLQUFDLENBQUEsSUFBRCxHQUFRLEtBQUMsQ0FBQSxJQUFJLENBQUMsS0FGRztNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJCLENBQUEsQ0FBQTtBQUFBLElBSUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxZQUFSLEdBQXVCLElBQUMsQ0FBQSxZQUp4QixDQUFBO0FBQUEsSUFLQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsQ0FBbUIsYUFBbkIsRUFBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNB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QyxDQUFBLFNBQUQsR0FBYSxJQURmO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FMQSxFQURPO0VBQUEsQ0E1Q1QsQ0FBQTs7QUFBQSx3QkFxREEsV0FBQSxHQUFhLFNBQUEsR0FBQTtXQUNYLE9BRFc7RUFBQSxDQXJEYixDQUFBOztBQUFBLEVBdURBLElBQUEsR0FBTyxTQUFBLEdBQUE7QUFDTCxRQUFBLEdBQUE7QUFBQSxJQUFBLElBQUcsTUFBTSxDQUFDLE9BQVY7QUFDRSxNQUFBLElBQUcsUUFBUSxDQUFBLFNBQUUsQ0FBQSxJQUFiO0FBQ0UsUUFBQSxHQUFBLEdBQU0sUUFBUSxDQUFBLFNBQUUsQ0FBQSxJQUFJLENBQUMsSUFBZixDQUFvQixPQUFPLENBQUMsR0FBNUIsRUFBaUMsT0FBakMsQ0FBTixDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsR0FBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLFVBQUEsUUFBUSxDQUFBLFNBQUUsQ0FBQSxLQUFLLENBQUMsSUFBaEIsQ0FBcUIsT0FBTyxDQUFDLEdBQTdCLEVBQWtDLE9BQWxDLEVBQTJDLFVBQTNDLENBQUEsQ0FESTtRQUFBLENBQU4sQ0FIRjtPQUFBO2FBTUEsR0FBRyxDQUFDLEtBQUosQ0FBVSxJQUFWLEVBQWdCLFVBQWhCLEVBUEY7S0FESztFQUFBLENBdkRQLENBQUE7O3FCQUFBOztJQXhZRixDQUFBOztBQUFBLE1BMGNNLENBQUMsT0FBUCxHQUFpQixXQTFjakIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiIyBzZXJ2ZXIgPSByZXF1aXJlICcuL3RjcC1zZXJ2ZXIuanMnXG5cbiMgZ2V0R2xvYmFsID0gLT5cbiMgICBfZ2V0R2xvYmFsID0gLT5cbiMgICAgIHRoaXNcblxuIyAgIF9nZXRHbG9iYWwoKVxuXG4jIHJvb3QgPSBnZXRHbG9iYWwoKVxuXG5BcHBsaWNhdGlvbiA9IHJlcXVpcmUgJy4uLy4uL2NvbW1vbi5jb2ZmZWUnXG4jYXBwID0gbmV3IGxpYi5BcHBsaWNhdGlvblxuY2xhc3MgQXBwQmFja2dyb3VuZCBleHRlbmRzIEFwcGxpY2F0aW9uXG4gICAgcmV0YWluZWREaXJzOnt9XG4gICAgaW5pdDogKCkgLT5cbiAgICAgICAgQFN0b3JhZ2UucmV0cmlldmVBbGwgKCkgPT5cbiAgICAgICAgICAgIEBkYXRhID0gQFN0b3JhZ2UuZGF0YVxuICAgICAgICAgICAgQG1hcHMgPSBAZGF0YS5tYXBzXG5cbiAgICAgICAgQFNlcnZlci5nZXRMb2NhbEZpbGUgPSBAZ2V0TG9jYWxGaWxlXG4gICAgICAgIEBTdG9yYWdlLm9uQ2hhbmdlZCAncmVzb3VyY2VNYXAnLCAob2JqKSA9PlxuICAgICAgICAgICAgQE1TRy5FeHQgb2JqXG5cbiAgICAgICAgQExJU1RFTi5FeHQgJ3Jlc291cmNlcycsIChyZXN1bHQpID0+XG4gICAgICAgICAgICBAU3RvcmFnZS5zYXZlICdjdXJyZW50UmVzb3VyY2VzJywgcmVzdWx0XG5cbiAgICAgICAgQExJU1RFTi5Mb2NhbCAnc3RhcnRTZXJ2ZXInLCAocmVzdWx0cykgPT5cbiAgICAgICAgICAgIEBTZXJ2ZXIuc3RhcnQgcmVzdWx0cy5ob3N0LCByZXN1bHRzLnBvcnRcblxuICAgICAgICBATElTVEVOLkxvY2FsICdzdG9wU2VydmVyJywgKCkgPT5cbiAgICAgICAgICAgIEBTZXJ2ZXIuc3RvcCgpXG5cbiAgICAgICAgQHN0YXJ0U2VydmVyKClcbiAgICAgICAgdHJ5XG4gICAgICAgICAgICBjaHJvbWUuYXBwLnJ1bnRpbWUub25MYXVuY2hlZC5hZGRMaXN0ZW5lciBAb3BlbkFwcFxuICAgICAgICAgICAgY2hyb21lLmFwcC5ydW50aW1lLm9uUmVzdGFydGVkLmFkZExpc3RlbmVyIEBjbGVhblVwXG4gICAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgICAgICBzaG93IGVycm9yXG5cblxuICAgIGNsZWFuVXA6ICgpIC0+XG4gICAgICAgIEBzdG9wU2VydmVyKClcblxuICAgIGdldExvY2FsRmlsZTogKGluZm8sIGNiLCBlcnJvcikgPT5cblxuICAgICAgICBAZmluZEZpbGVGb3JRdWVyeVN0cmluZyBpbmZvLnVybCwgc3VjY2VzcyxcbiAgICAgICAgICAgIChlcnJvcikgPT5cbiAgICAgICAgICAgICAgICBAZmluZEZpbGVGb3JQYXRoIGluZm8sIGNiLCBlcnJvclxuXG4gICAgZmluZEZpbGVGb3JQYXRoOiAoaW5mbywgY2IsIGVycm9yKSA9PlxuICAgICAgICBAZmluZEZpbGVGb3JRdWVyeVN0cmluZyBpbmZvLnVybCwgY2IsIGVycm9yLCBpbmZvLnJlZmVyZXJcblxuICAgIGZpbmRGaWxlRm9yUXVlcnlTdHJpbmc6IChfdXJsLCBjYiwgZXJyb3IsIHJlZmVyZXIpID0+XG4gICAgICAgIHVybCA9IF91cmwucmVwbGFjZSAvLio/c2xyZWRpclxcPS8sICcnXG5cbiAgICAgICAgbWF0Y2ggPSBpdGVtIGZvciBpdGVtIGluIEBtYXBzIHdoZW4gdXJsLm1hdGNoKG5ldyBSZWdFeHAoaXRlbS51cmwpLCBpdGVtLnJlZ2V4UmVwbCk/IGFuZCBpdGVtLnVybD8gYW5kIG5vdCBtYXRjaD9cblxuICAgICAgICBpZiBtYXRjaD9cbiAgICAgICAgICAgIGlmIHJlZmVyZXI/XG4gICAgICAgICAgICAgICAgZmlsZVBhdGggPSB1cmwubWF0Y2goLy4qXFwvXFwvLio/XFwvKC4qKS8pP1sxXVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGZpbGVQYXRoID0gdXJsLnJlcGxhY2UgbmV3IFJlZ0V4cChtYXRjaC51cmwpLCBtYXRjaC5yZWdleFJlcGxcbiAgICAgICAgICAgIGRpciA9IEBTdG9yYWdlLmRhdGEuZGlyZWN0b3JpZXNbbWF0Y2guZGlyZWN0b3J5XVxuXG4gICAgICAgICAgICBpZiBub3QgZGlyPyB0aGVuIHJldHVybiBlcnIgJ25vIG1hdGNoJ1xuXG4gICAgICAgICAgICBpZiBAcmV0YWluZWREaXJzW2Rpci5kaXJlY3RvcnlFbnRyeUlkXT9cbiAgICAgICAgICAgICAgICBkaXJFbnRyeSA9IEByZXRhaW5lZERpcnNbZGlyLmRpcmVjdG9yeUVudHJ5SWRdXG4gICAgICAgICAgICAgICAgQEZTLnJlYWRGaWxlIGRpckVudHJ5LCBmaWxlUGF0aCxcbiAgICAgICAgICAgICAgICAgICAgKGZpbGVFbnRyeSwgZmlsZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNiPyhmaWxlRW50cnksIGZpbGUpXG4gICAgICAgICAgICAgICAgICAgICwoZXJyb3IpID0+IGVycm9yKClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBjaHJvbWUuZmlsZVN5c3RlbS5yZXN0b3JlRW50cnkgZGlyLmRpcmVjdG9yeUVudHJ5SWQsIChkaXJFbnRyeSkgPT5cbiAgICAgICAgICAgICAgICAgICAgQHJldGFpbmVkRGlyc1tkaXIuZGlyZWN0b3J5RW50cnlJZF0gPSBkaXJFbnRyeVxuICAgICAgICAgICAgICAgICAgICBARlMucmVhZEZpbGUgZGlyRW50cnksIGZpbGVQYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgKGZpbGVFbnRyeSwgZmlsZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYj8oZmlsZUVudHJ5LCBmaWxlKVxuICAgICAgICAgICAgICAgICAgICAgICAgLChlcnJvcikgPT4gZXJyb3IoKVxuICAgICAgICAgICAgICAgICAgICAsKGVycm9yKSA9PiBlcnJvcigpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGVycm9yKClcblxuXG4gICAgc3RhcnRTZXJ2ZXI6ICgpIC0+XG4gICAgICAgIEBTZXJ2ZXIuc3RhcnQgbnVsbCxudWxsLG51bGwsICgpID0+XG4gICAgICAgICAgICBATVNHLkxvY2FsICdzZXJ2ZXInOkBTZXJ2ZXJcblxuICAgIHN0b3BTZXJ2ZXI6ICgpIC0+XG4gICAgICAgIEBTZXJ2ZXIuc3RvcFxuICAgICAgICBATVNHLkxvY2FsICdzZXJ2ZXInOm51bGxcblxuYXBwID0gbmV3IEFwcEJhY2tncm91bmRcblxuXG5cbiMjI1xuIHZhciB3aGl0ZWxpc3RlZElkID0gJ3BtZ25uYmRmbW1wZGtnYWFta2RpaXBmZ2picGdpb2ZjJztcbiAgdmFyIGFkZERpcmVjdG9yeSA9IGZ1bmN0aW9uKCkge1xuICAgIGNocm9tZS5hcHAud2luZG93LmNyZWF0ZSgnaW5kZXguaHRtbCcsIHtcbiAgICAgICAgaWQ6IFwibWFpbndpblwiLFxuICAgICAgICBib3VuZHM6IHtcbiAgICAgICAgICB3aWR0aDogNTAsXG4gICAgICAgICAgaGVpZ2h0OiA1MFxuICAgICAgICB9LFxuICAgIH0sIGZ1bmN0aW9uKHdpbikge1xuICAgICAgICBtYWluV2luID0gd2luO1xuICAgIH0pO1xuICB9XG5cblxuXG4gICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKFxuICAgICAgICBmdW5jdGlvbihyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xuICAgICAgICAgIC8vIGlmIChzZW5kZXIuaWQgIT0gd2hpdGVsaXN0ZWRJZClcbiAgICAgICAgICAvLyAgIHJldHVybiBzZW5kUmVzcG9uc2Uoe1wicmVzdWx0XCI6XCJzb3JyeSwgY291bGQgbm90IHByb2Nlc3MgeW91ciBtZXNzYWdlXCJ9KTtcblxuICAgICAgICAgIGlmIChyZXF1ZXN0LmRpcmVjdG9yeUVudHJ5SWQpIHtcbiAgICAgICAgICAgIC8vIHNlbmRSZXNwb25zZSh7XCJyZXN1bHRcIjpcIkdvdCBEaXJlY3RvcnlcIn0pO1xuICAgICAgICAgICAgc2hvdyhyZXF1ZXN0LmRpcmVjdG9yeUVudHJ5SWQpO1xuICAgICAgICAgICAgZGlyZWN0b3JpZXMucHVzaChyZXF1ZXN0LmRpcmVjdG9yeUVudHJ5SWQpO1xuICAgICAgICAgICAgLy8gY2hyb21lLmZpbGVTeXN0ZW0ucmVzdG9yZUVudHJ5KHJlcXVlc3QuZGlyZWN0b3J5RW50cnlJZCwgZnVuY3Rpb24oZGlyZWN0b3J5RW50cnkpIHtcbiAgICAgICAgICAgIC8vICAgICBzaG93KGRpcmVjdG9yeUVudHJ5KTtcbiAgICAgICAgICAgIC8vIH0pO1xuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHNlbmRSZXNwb25zZSh7XCJyZXN1bHRcIjpcIk9wcywgSSBkb24ndCB1bmRlcnN0YW5kIHRoaXMgbWVzc2FnZVwifSk7XG4gICAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAgICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlRXh0ZXJuYWwuYWRkTGlzdGVuZXIoXG4gICAgICAgIGZ1bmN0aW9uKHJlcXVlc3QsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSB7XG4gICAgICAgICAgaWYgKHNlbmRlci5pZCAhPSB3aGl0ZWxpc3RlZElkKSB7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2Uoe1wicmVzdWx0XCI6XCJzb3JyeSwgY291bGQgbm90IHByb2Nlc3MgeW91ciBtZXNzYWdlXCJ9KTtcbiAgICAgICAgICAgIHJldHVybjsgIC8vIGRvbid0IGFsbG93IHRoaXMgZXh0ZW5zaW9uIGFjY2Vzc1xuICAgICAgICAgIH0gZWxzZSBpZiAocmVxdWVzdC5vcGVuRGlyZWN0b3J5KSB7XG4gICAgICAgICAgICAvLyBzZW5kUmVzcG9uc2Uoe1wicmVzdWx0XCI6XCJPcGVuaW5nIERpcmVjdG9yeVwifSk7XG4gICAgICAgICAgICBhZGREaXJlY3RvcnkoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHtcInJlc3VsdFwiOlwiT3BzLCBJIGRvbid0IHVuZGVyc3RhbmQgdGhpcyBtZXNzYWdlXCJ9KTtcbiAgICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHNvY2tldC5jcmVhdGUoXCJ0Y3BcIiwge30sIGZ1bmN0aW9uKF9zb2NrZXRJbmZvKSB7XG4gICAgICAgIHNvY2tldEluZm8gPSBfc29ja2V0SW5mbztcbiAgICAgICAgc29ja2V0Lmxpc3Rlbihzb2NrZXRJbmZvLnNvY2tldElkLCBcIjEyNy4wLjAuMVwiLCAzMzMzMywgNTAsIGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICBzaG93KFwiTElTVEVOSU5HOlwiLCByZXN1bHQpO1xuICAgICAgICBzb2NrZXQuYWNjZXB0KHNvY2tldEluZm8uc29ja2V0SWQsIG9uQWNjZXB0KTtcbiAgICB9KTtcbiAgICB9KTtcblxuICAgIHZhciBzdG9wU29ja2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHNvY2tldC5kZXN0cm95KHNvY2tldEluZm8uc29ja2V0SWQpO1xuICAgIH1cblxuXG4jIyNcblxuIyMjXG5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHN0YXJ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGFydFwiKTtcbiAgdmFyIHN0b3AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0b3BcIik7XG4gIHZhciBob3N0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaG9zdHNcIik7XG4gIHZhciBwb3J0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3J0XCIpO1xuICB2YXIgZGlyZWN0b3J5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkaXJlY3RvcnlcIik7XG5cbiAgdmFyIHNvY2tldCA9IGNocm9tZS5zb2NrZXQ7XG4gIHZhciBzb2NrZXRJbmZvO1xuICB2YXIgZmlsZXNNYXAgPSB7fTtcblxuICB2YXIgcm9vdERpcjtcbiAgdmFyIHBvcnQsIGV4dFBvcnQ7XG4gIHZhciBkaXJlY3RvcmllcyA9IFtdO1xuXG4gIHZhciBzdHJpbmdUb1VpbnQ4QXJyYXkgPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICB2YXIgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKHN0cmluZy5sZW5ndGgpO1xuICAgIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKTtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgc3RyaW5nLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2aWV3W2ldID0gc3RyaW5nLmNoYXJDb2RlQXQoaSk7XG4gICAgfVxuICAgIHJldHVybiB2aWV3O1xuICB9O1xuXG4gIHZhciBhcnJheUJ1ZmZlclRvU3RyaW5nID0gZnVuY3Rpb24oYnVmZmVyKSB7XG4gICAgdmFyIHN0ciA9ICcnO1xuICAgIHZhciB1QXJyYXlWYWwgPSBuZXcgVWludDhBcnJheShidWZmZXIpO1xuICAgIGZvcih2YXIgcyA9IDA7IHMgPCB1QXJyYXlWYWwubGVuZ3RoOyBzKyspIHtcbiAgICAgIHN0ciArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHVBcnJheVZhbFtzXSk7XG4gICAgfVxuICAgIHJldHVybiBzdHI7XG4gIH07XG5cbiAgdmFyIGxvZ1RvU2NyZWVuID0gZnVuY3Rpb24obG9nKSB7XG4gICAgbG9nZ2VyLnRleHRDb250ZW50ICs9IGxvZyArIFwiXFxuXCI7XG4gIH1cblxuICB2YXIgd3JpdGVFcnJvclJlc3BvbnNlID0gZnVuY3Rpb24oc29ja2V0SWQsIGVycm9yQ29kZSwga2VlcEFsaXZlKSB7XG4gICAgdmFyIGZpbGUgPSB7IHNpemU6IDAgfTtcbiAgICBjb25zb2xlLmluZm8oXCJ3cml0ZUVycm9yUmVzcG9uc2U6OiBiZWdpbi4uLiBcIik7XG4gICAgY29uc29sZS5pbmZvKFwid3JpdGVFcnJvclJlc3BvbnNlOjogZmlsZSA9IFwiICsgZmlsZSk7XG4gICAgdmFyIGNvbnRlbnRUeXBlID0gXCJ0ZXh0L3BsYWluXCI7IC8vKGZpbGUudHlwZSA9PT0gXCJcIikgPyBcInRleHQvcGxhaW5cIiA6IGZpbGUudHlwZTtcbiAgICB2YXIgY29udGVudExlbmd0aCA9IGZpbGUuc2l6ZTtcbiAgICB2YXIgaGVhZGVyID0gc3RyaW5nVG9VaW50OEFycmF5KFwiSFRUUC8xLjAgXCIgKyBlcnJvckNvZGUgKyBcIiBOb3QgRm91bmRcXG5Db250ZW50LWxlbmd0aDogXCIgKyBmaWxlLnNpemUgKyBcIlxcbkNvbnRlbnQtdHlwZTpcIiArIGNvbnRlbnRUeXBlICsgKCBrZWVwQWxpdmUgPyBcIlxcbkNvbm5lY3Rpb246IGtlZXAtYWxpdmVcIiA6IFwiXCIpICsgXCJcXG5cXG5cIik7XG4gICAgY29uc29sZS5pbmZvKFwid3JpdGVFcnJvclJlc3BvbnNlOjogRG9uZSBzZXR0aW5nIGhlYWRlci4uLlwiKTtcbiAgICB2YXIgb3V0cHV0QnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKGhlYWRlci5ieXRlTGVuZ3RoICsgZmlsZS5zaXplKTtcbiAgICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KG91dHB1dEJ1ZmZlcilcbiAgICB2aWV3LnNldChoZWFkZXIsIDApO1xuICAgIGNvbnNvbGUuaW5mbyhcIndyaXRlRXJyb3JSZXNwb25zZTo6IERvbmUgc2V0dGluZyB2aWV3Li4uXCIpO1xuICAgIHNvY2tldC53cml0ZShzb2NrZXRJZCwgb3V0cHV0QnVmZmVyLCBmdW5jdGlvbih3cml0ZUluZm8pIHtcbiAgICAgIHNob3coXCJXUklURVwiLCB3cml0ZUluZm8pO1xuICAgICAgaWYgKGtlZXBBbGl2ZSkge1xuICAgICAgICByZWFkRnJvbVNvY2tldChzb2NrZXRJZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzb2NrZXQuZGVzdHJveShzb2NrZXRJZCk7XG4gICAgICAgIHNvY2tldC5hY2NlcHQoc29ja2V0SW5mby5zb2NrZXRJZCwgb25BY2NlcHQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnNvbGUuaW5mbyhcIndyaXRlRXJyb3JSZXNwb25zZTo6ZmlsZXJlYWRlcjo6IGVuZCBvbmxvYWQuLi5cIik7XG5cbiAgICBjb25zb2xlLmluZm8oXCJ3cml0ZUVycm9yUmVzcG9uc2U6OiBlbmQuLi5cIik7XG4gIH07XG5cbiAgdmFyIHdyaXRlMjAwUmVzcG9uc2UgPSBmdW5jdGlvbihzb2NrZXRJZCwgZmlsZSwga2VlcEFsaXZlKSB7XG4gICAgdmFyIGNvbnRlbnRUeXBlID0gKGZpbGUudHlwZSA9PT0gXCJcIikgPyBcInRleHQvcGxhaW5cIiA6IGZpbGUudHlwZTtcbiAgICB2YXIgY29udGVudExlbmd0aCA9IGZpbGUuc2l6ZTtcbiAgICB2YXIgaGVhZGVyID0gc3RyaW5nVG9VaW50OEFycmF5KFwiSFRUUC8xLjAgMjAwIE9LXFxuQ29udGVudC1sZW5ndGg6IFwiICsgZmlsZS5zaXplICsgXCJcXG5Db250ZW50LXR5cGU6XCIgKyBjb250ZW50VHlwZSArICgga2VlcEFsaXZlID8gXCJcXG5Db25uZWN0aW9uOiBrZWVwLWFsaXZlXCIgOiBcIlwiKSArIFwiXFxuXFxuXCIpO1xuICAgIHZhciBvdXRwdXRCdWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoaGVhZGVyLmJ5dGVMZW5ndGggKyBmaWxlLnNpemUpO1xuICAgIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkob3V0cHV0QnVmZmVyKVxuICAgIHZpZXcuc2V0KGhlYWRlciwgMCk7XG5cbiAgICB2YXIgZmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgZmlsZVJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgdmlldy5zZXQobmV3IFVpbnQ4QXJyYXkoZS50YXJnZXQucmVzdWx0KSwgaGVhZGVyLmJ5dGVMZW5ndGgpO1xuICAgICAgIHNvY2tldC53cml0ZShzb2NrZXRJZCwgb3V0cHV0QnVmZmVyLCBmdW5jdGlvbih3cml0ZUluZm8pIHtcbiAgICAgICAgIHNob3coXCJXUklURVwiLCB3cml0ZUluZm8pO1xuICAgICAgICAgaWYgKGtlZXBBbGl2ZSkge1xuICAgICAgICAgICByZWFkRnJvbVNvY2tldChzb2NrZXRJZCk7XG4gICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICBzb2NrZXQuZGVzdHJveShzb2NrZXRJZCk7XG4gICAgICAgICAgIHNvY2tldC5hY2NlcHQoc29ja2V0SW5mby5zb2NrZXRJZCwgb25BY2NlcHQpO1xuICAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGZpbGVSZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoZmlsZSk7XG4gIH07XG5cbiAgdmFyIG9uQWNjZXB0ID0gZnVuY3Rpb24oYWNjZXB0SW5mbykge1xuICAgIHNob3coXCJBQ0NFUFRcIiwgYWNjZXB0SW5mbylcbiAgICByZWFkRnJvbVNvY2tldChhY2NlcHRJbmZvLnNvY2tldElkKTtcbiAgfTtcblxuICB2YXIgcmVhZEZyb21Tb2NrZXQgPSBmdW5jdGlvbihzb2NrZXRJZCkge1xuICAgIC8vICBSZWFkIGluIHRoZSBkYXRhXG4gICAgc29ja2V0LnJlYWQoc29ja2V0SWQsIGZ1bmN0aW9uKHJlYWRJbmZvKSB7XG4gICAgICBzaG93KFwiUkVBRFwiLCByZWFkSW5mbyk7XG4gICAgICAvLyBQYXJzZSB0aGUgcmVxdWVzdC5cbiAgICAgIHZhciBkYXRhID0gYXJyYXlCdWZmZXJUb1N0cmluZyhyZWFkSW5mby5kYXRhKTtcbiAgICAgIGlmKGRhdGEuaW5kZXhPZihcIkdFVCBcIikgPT0gMCkge1xuICAgICAgICB2YXIga2VlcEFsaXZlID0gZmFsc2U7XG4gICAgICAgIGlmIChkYXRhLmluZGV4T2YoXCJDb25uZWN0aW9uOiBrZWVwLWFsaXZlXCIpICE9IC0xKSB7XG4gICAgICAgICAga2VlcEFsaXZlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHdlIGNhbiBvbmx5IGRlYWwgd2l0aCBHRVQgcmVxdWVzdHNcbiAgICAgICAgdmFyIHVyaUVuZCA9ICBkYXRhLmluZGV4T2YoXCIgXCIsIDQpO1xuICAgICAgICBpZih1cmlFbmQgPCAwKSB7ICAgcmV0dXJuOyB9XG4gICAgICAgIHZhciB1cmkgPSBkYXRhLnN1YnN0cmluZyg0LCB1cmlFbmQpO1xuICAgICAgICAvLyBzdHJpcCBxeWVyeSBzdHJpbmdcbiAgICAgICAgdmFyIHEgPSB1cmkuaW5kZXhPZihcIj9cIik7XG4gICAgICAgIGlmIChxICE9IC0xKSB7XG4gICAgICAgICAgdXJpID0gdXJpLnN1YnN0cmluZygwLCBxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNocm9tZS5maWxlU3lzdGVtLnJlc3RvcmVFbnRyeShkaXJlY3Rvcmllc1swXSlcbiAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAoZnVuY3Rpb24odXJsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGRpcmVjdG9yeUVudHJ5KSB7XG4gICAgICAgICAgICAgICAgICAgIHNob3coZGlyZWN0b3J5RW50cnkpO1xuICAgICAgICAgICAgICAgICAgICBzaG93KHVyaSk7XG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdG9yeUVudHJ5LmdldEZpbGUoJ215TmV3QXBwREVWLnJlc291cmNlL2luZGV4LmpzJywge30pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3coZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB3cml0ZTIwMFJlc3BvbnNlKHNvY2tldElkLCBmaWxlLCBrZWVwQWxpdmUpO1xuICAgICAgICAgICAgICAgICAgICB9LGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3coZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgIH0pKHVyaSlcbiAgICAgICAgKTtcblxuICAgICAgICAvLyB2YXIgZmlsZSA9XG4gICAgICAgIC8vIGlmKCEhZmlsZSA9PSBmYWxzZSkge1xuICAgICAgICAvLyAgIGNvbnNvbGUud2FybihcIkZpbGUgZG9lcyBub3QgZXhpc3QuLi5cIiArIHVyaSk7XG4gICAgICAgIC8vICAgd3JpdGVFcnJvclJlc3BvbnNlKHNvY2tldElkLCA0MDQsIGtlZXBBbGl2ZSk7XG4gICAgICAgIC8vICAgcmV0dXJuO1xuICAgICAgICAvLyB9XG4gICAgICAgIC8vIGxvZ1RvU2NyZWVuKFwiR0VUIDIwMCBcIiArIHVyaSk7XG4gICAgICAgIC8vIHdyaXRlMjAwUmVzcG9uc2Uoc29ja2V0SWQsIGZpbGUsIGtlZXBBbGl2ZSk7XG4gICAgICAvLyB9XG4gICAgICAvLyBlbHNlIHtcbiAgICAgICAgLy8gVGhyb3cgYW4gZXJyb3JcbiAgICAgICAgLy8gc29ja2V0LmRlc3Ryb3koc29ja2V0SWQpO1xuICAgICAgLy8gfVxuXG4gIH07XG59KTtcbn1cblxuXG4gIHZhciB3aGl0ZWxpc3RlZElkID0gJ3BtZ25uYmRmbW1wZGtnYWFta2RpaXBmZ2picGdpb2ZjJztcblxuXG4gICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlRXh0ZXJuYWwuYWRkTGlzdGVuZXIoXG4gICAgICAgIGZ1bmN0aW9uKHJlcXVlc3QsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSB7XG4gICAgICAgICAgaWYgKHNlbmRlci5pZCAhPSB3aGl0ZWxpc3RlZElkKSB7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2Uoe1wicmVzdWx0XCI6XCJzb3JyeSwgY291bGQgbm90IHByb2Nlc3MgeW91ciBtZXNzYWdlXCJ9KTtcbiAgICAgICAgICAgIHJldHVybjsgIC8vIGRvbid0IGFsbG93IHRoaXMgZXh0ZW5zaW9uIGFjY2Vzc1xuICAgICAgICAgIH0gZWxzZSBpZiAocmVxdWVzdC5vcGVuRGlyZWN0b3J5KSB7XG4gICAgICAgICAgICAvLyBzZW5kUmVzcG9uc2Uoe1wicmVzdWx0XCI6XCJPcGVuaW5nIERpcmVjdG9yeVwifSk7XG4gICAgICAgICAgICBhZGREaXJlY3RvcnkoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHtcInJlc3VsdFwiOlwiT3BzLCBJIGRvbid0IHVuZGVyc3RhbmQgdGhpcyBtZXNzYWdlXCJ9KTtcbiAgICAgICAgICB9XG4gICAgICB9KTtcblxuXG4gICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKFxuICAgICAgICBmdW5jdGlvbihyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xuICAgICAgICAgIC8vIGlmIChzZW5kZXIuaWQgIT0gd2hpdGVsaXN0ZWRJZClcbiAgICAgICAgICAvLyAgIHJldHVybiBzZW5kUmVzcG9uc2Uoe1wicmVzdWx0XCI6XCJzb3JyeSwgY291bGQgbm90IHByb2Nlc3MgeW91ciBtZXNzYWdlXCJ9KTtcblxuICAgICAgICAgIGlmIChyZXF1ZXN0LmRpcmVjdG9yeUVudHJ5SWQpIHtcbiAgICAgICAgICAgIC8vIHNlbmRSZXNwb25zZSh7XCJyZXN1bHRcIjpcIkdvdCBEaXJlY3RvcnlcIn0pO1xuICAgICAgICAgICAgc2hvdyhyZXF1ZXN0LmRpcmVjdG9yeUVudHJ5SWQpO1xuICAgICAgICAgICAgZGlyZWN0b3JpZXMucHVzaChyZXF1ZXN0LmRpcmVjdG9yeUVudHJ5SWQpO1xuICAgICAgICAgICAgLy8gY2hyb21lLmZpbGVTeXN0ZW0ucmVzdG9yZUVudHJ5KHJlcXVlc3QuZGlyZWN0b3J5RW50cnlJZCwgZnVuY3Rpb24oZGlyZWN0b3J5RW50cnkpIHtcbiAgICAgICAgICAgIC8vICAgICBzaG93KGRpcmVjdG9yeUVudHJ5KTtcbiAgICAgICAgICAgIC8vIH0pO1xuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHNlbmRSZXNwb25zZSh7XCJyZXN1bHRcIjpcIk9wcywgSSBkb24ndCB1bmRlcnN0YW5kIHRoaXMgbWVzc2FnZVwifSk7XG4gICAgICAgICAgfVxuICAgICAgfSk7XG4gICAgc29ja2V0LmNyZWF0ZShcInRjcFwiLCB7fSwgZnVuY3Rpb24oX3NvY2tldEluZm8pIHtcbiAgICAgICAgc29ja2V0SW5mbyA9IF9zb2NrZXRJbmZvO1xuICAgICAgICBzb2NrZXQubGlzdGVuKHNvY2tldEluZm8uc29ja2V0SWQsIFwiMTI3LjAuMC4xXCIsIDMzMzMzLCA1MCwgZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgIHNob3coXCJMSVNURU5JTkc6XCIsIHJlc3VsdCk7XG4gICAgICAgIHNvY2tldC5hY2NlcHQoc29ja2V0SW5mby5zb2NrZXRJZCwgb25BY2NlcHQpO1xuICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdmFyIHN0b3BTb2NrZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgc29ja2V0LmRlc3Ryb3koc29ja2V0SW5mby5zb2NrZXRJZCk7XG4gICAgfVxuXG4gIHZhciBhZGREaXJlY3RvcnkgPSBmdW5jdGlvbigpIHtcbiAgICBjaHJvbWUuYXBwLndpbmRvdy5jcmVhdGUoJ2luZGV4Lmh0bWwnLCB7XG4gICAgICAgIGlkOiBcIm1haW53aW5cIixcbiAgICAgICAgYm91bmRzOiB7XG4gICAgICAgICAgd2lkdGg6IDUwLFxuICAgICAgICAgIGhlaWdodDogNTBcbiAgICAgICAgfSxcbiAgICB9LCBmdW5jdGlvbih3aW4pIHtcbiAgICAgICAgbWFpbldpbiA9IHdpbjtcbiAgICB9KTtcbiAgfVxuXG59O1xuIyMjXG5cbiIsIiMgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjE3NDIwOTNcbigoKSAtPlxuICBtZXRob2RzID0gW1xuICAgICdhc3NlcnQnLCAnY2xlYXInLCAnY291bnQnLCAnZGVidWcnLCAnZGlyJywgJ2RpcnhtbCcsICdlcnJvcicsXG4gICAgJ2V4Y2VwdGlvbicsICdncm91cCcsICdncm91cENvbGxhcHNlZCcsICdncm91cEVuZCcsICdpbmZvJywgJ2xvZycsXG4gICAgJ21hcmtUaW1lbGluZScsICdwcm9maWxlJywgJ3Byb2ZpbGVFbmQnLCAndGFibGUnLCAndGltZScsICd0aW1lRW5kJyxcbiAgICAndGltZVN0YW1wJywgJ3RyYWNlJywgJ3dhcm4nXVxuICBub29wID0gKCkgLT5cbiAgICAjIHN0dWIgdW5kZWZpbmVkIG1ldGhvZHMuXG4gICAgZm9yIG0gaW4gbWV0aG9kcyAgd2hlbiAgIWNvbnNvbGVbbV1cbiAgICAgIGNvbnNvbGVbbV0gPSBub29wXG5cbiAgaWYgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQ/XG4gICAgd2luZG93LnNob3cgPSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZC5jYWxsKGNvbnNvbGUubG9nLCBjb25zb2xlKVxuICBlbHNlXG4gICAgd2luZG93LnNob3cgPSAoKSAtPlxuICAgICAgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwoY29uc29sZS5sb2csIGNvbnNvbGUsIGFyZ3VtZW50cylcbikoKVxuXG5jbGFzcyBNU0dcbiAgaXNDb250ZW50U2NyaXB0OiBsb2NhdGlvbi5wcm90b2NvbCBpc250ICdjaHJvbWUtZXh0ZW5zaW9uOidcbiAgY29uc3RydWN0b3I6IChjb25maWcpIC0+XG4gICAgQGNvbmZpZyA9IGNvbmZpZ1xuICBMb2NhbDogKG1lc3NhZ2UsIHJlc3BvbmQpIC0+XG4gICAgc2hvdyBcIj09IE1FU1NBR0UgI3sgSlNPTi5zdHJpbmdpZnkgbWVzc2FnZSB9ID09PlwiXG4gICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UgbWVzc2FnZSwgcmVzcG9uZFxuICBFeHQ6IChtZXNzYWdlLCByZXNwb25kKSAtPlxuICAgIHNob3cgXCI9PSBNRVNTQUdFICN7IEpTT04uc3RyaW5naWZ5IG1lc3NhZ2UgfSA9PT5cIlxuICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlIEBjb25maWcuRVhUX0lELCBtZXNzYWdlLCByZXNwb25kXG5cbmNsYXNzIExJU1RFTlxuICBsb2NhbDpcbiAgICBhcGk6IGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZVxuICAgIGxpc3RlbmVyczp7fVxuICBleHRlcm5hbDpcbiAgICBhcGk6IGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZUV4dGVybmFsXG4gICAgbGlzdGVuZXJzOnt9XG4gIGNvbnN0cnVjdG9yOiAoY29uZmlnKSAtPlxuICAgIEBjb25maWcgPSBjb25maWdcbiAgICBAbG9jYWwuYXBpLmFkZExpc3RlbmVyIEBfb25NZXNzYWdlXG4gICAgQGV4dGVybmFsLmFwaT8uYWRkTGlzdGVuZXIgQF9vbk1lc3NhZ2VFeHRlcm5hbFxuXG4gIExvY2FsOiAobWVzc2FnZSwgY2FsbGJhY2spID0+XG4gICAgQGxvY2FsLmxpc3RlbmVyc1ttZXNzYWdlXSA9IGNhbGxiYWNrXG5cbiAgRXh0OiAobWVzc2FnZSwgY2FsbGJhY2spID0+XG4gICAgQGV4dGVybmFsLmxpc3RlbmVyc1ttZXNzYWdlXSA9IGNhbGxiYWNrXG5cbiAgX29uTWVzc2FnZUV4dGVybmFsOiAocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+XG4gICAgc2hvdyBcIjw9PSBFWFRFUk5BTCBNRVNTQUdFID09ICN7IEBjb25maWcuRVhUX1RZUEUgfSA9PVwiICsgcmVxdWVzdFxuICAgIGlmIHNlbmRlci5pZCBpc250IEBjb25maWcuRVhUX0lEIHRoZW4gcmV0dXJuIHVuZGVmaW5lZFxuICAgIEBleHRlcm5hbC5saXN0ZW5lcnNba2V5XT8gcmVxdWVzdFtrZXldLCBzZW5kUmVzcG9uc2UgZm9yIGtleSBvZiByZXF1ZXN0XG5cbiAgX29uTWVzc2FnZTogKHJlcXVlc3QsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSA9PlxuICAgIHNob3cgXCI8PT0gTUVTU0FHRSA9PSAjeyBAY29uZmlnLkVYVF9UWVBFIH0gPT1cIiArIHJlcXVlc3RcbiAgICBAbG9jYWwubGlzdGVuZXJzW2tleV0/IHJlcXVlc3Rba2V5XSwgc2VuZFJlc3BvbnNlIGZvciBrZXkgb2YgcmVxdWVzdFxuXG5jbGFzcyBEYXRhXG4gIG1hcHBpbmc6W1xuICAgIGRpcmVjdG9yeTpudWxsXG4gICAgdXJsUGF0dGVybjpudWxsXG4gIF1cbiAgcmVzb3VyY2VzOltcbiAgICByZXNvdXJjZTpudWxsXG4gICAgZmlsZTpudWxsXG4gIF1cblxuXG5cbmNsYXNzIFN0b3JhZ2VcbiAgYXBpOiBjaHJvbWUuc3RvcmFnZS5sb2NhbFxuICBkYXRhOiB7fVxuICBjYWxsYmFjazogKCkgLT5cbiAgY29uc3RydWN0b3I6IChjYWxsYmFjaykgLT5cbiAgICBAY2FsbGJhY2sgPSBjYWxsYmFja1xuICAgIEByZXRyaWV2ZUFsbCgpXG4gICAgQG9uQ2hhbmdlZEFsbCgpXG5cbiAgc2F2ZTogKGtleSwgaXRlbSkgLT5cbiAgICBvYmogPSB7fVxuICAgIG9ialtrZXldID0gaXRlbVxuICAgIEBhcGkuc2V0IG9ialxuXG4gIHNhdmVBbGw6ICgpIC0+XG4gICAgQGFwaS5zZXQgQGRhdGFcblxuICByZXRyaWV2ZTogKGtleSwgY2IpIC0+XG4gICAgQGFwaS5nZXQga2V5LCAocmVzdWx0cykgLT5cbiAgICAgIEBkYXRhW3JdID0gcmVzdWx0c1tyXSBmb3IgciBvZiByZXN1bHRzXG4gICAgICBpZiBjYj8gdGhlbiBjYiByZXN1bHRzW2tleV1cblxuXG4gIHJldHJpZXZlQWxsOiAoY2IpIC0+XG4gICAgQGFwaS5nZXQgKHJlc3VsdCkgPT5cbiAgICAgIEBkYXRhID0gcmVzdWx0XG4gICAgICBAY2FsbGJhY2s/IHJlc3VsdFxuICAgICAgY2I/IHJlc3VsdFxuICAgICAgc2hvdyByZXN1bHRcblxuICBvbkNoYW5nZWQ6IChrZXksIGNiKSAtPlxuICAgIGNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZC5hZGRMaXN0ZW5lciAoY2hhbmdlcywgbmFtZXNwYWNlKSAtPlxuICAgICAgaWYgY2hhbmdlc1trZXldPyBhbmQgY2I/IHRoZW4gY2IgY2hhbmdlc1trZXldLm5ld1ZhbHVlXG4gICAgICBAY2FsbGJhY2s/IGNoYW5nZXNcblxuICBvbkNoYW5nZWRBbGw6ICgpIC0+XG4gICAgY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyIChjaGFuZ2VzLG5hbWVzcGFjZSkgPT5cbiAgICAgIEBkYXRhW2NdID0gY2hhbmdlc1tjXS5uZXdWYWx1ZSBmb3IgYyBvZiBjaGFuZ2VzXG4gICAgICBAY2FsbGJhY2s/IGNoYW5nZXNcblxuXG4jIGNsYXNzIERpcmVjdG9yeVN0b3JlXG4jICAgZGlyZWN0b3JpZXMgPVxuIyAgIGNvbnN0cnVjdG9yICgpIC0+XG5cbiMgY2xhc3MgRGlyZWN0b3J5XG5cblxuY2xhc3MgRmlsZVN5c3RlbVxuICBhcGk6IGNocm9tZS5maWxlU3lzdGVtXG5cbiAgY29uc3RydWN0b3I6ICgpIC0+XG5cbiAgIyBAZGlyczogbmV3IERpcmVjdG9yeVN0b3JlXG4gICMgZmlsZVRvQXJyYXlCdWZmZXI6IChibG9iLCBvbmxvYWQsIG9uZXJyb3IpIC0+XG4gICMgICByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gICMgICByZWFkZXIub25sb2FkID0gb25sb2FkXG5cbiAgIyAgIHJlYWRlci5vbmVycm9yID0gb25lcnJvclxuXG4gICMgICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIgYmxvYlxuXG4gIHJlYWRGaWxlOiAoZGlyRW50cnksIHBhdGgsIHN1Y2Nlc3MsIGVycm9yKSAtPlxuICAgIEBnZXRGaWxlRW50cnkgZGlyRW50cnksIHBhdGgsXG4gICAgICAoZmlsZUVudHJ5KSA9PlxuICAgICAgICBmaWxlRW50cnkuZmlsZSAoZmlsZSkgPT5cbiAgICAgICAgICBzdWNjZXNzKGZpbGVFbnRyeSwgZmlsZSlcbiAgICAgICAgLChlcnJvcikgPT4gZXJyb3IoKVxuICAgICAgLChlcnJvcikgPT4gZXJyb3IoKVxuXG4gIGdldEZpbGVFbnRyeTogKGRpckVudHJ5LCBwYXRoLCBzdWNjZXNzLCBlcnJvcikgLT5cbiAgICBpZiBkaXJFbnRyeT8uZ2V0RmlsZT9cbiAgICAgIGRpckVudHJ5LmdldEZpbGUgcGF0aCwge30sIChmaWxlRW50cnkpIC0+XG4gICAgICAgIHN1Y2Nlc3MgZmlsZUVudHJ5XG4gICAgZWxzZSBlcnJvcigpXG5cbiAgb3BlbkRpcmVjdG9yeTogKGNhbGxiYWNrKSA9PlxuICAgIEBhcGkuY2hvb3NlRW50cnkgdHlwZTonb3BlbkRpcmVjdG9yeScsIChkaXJlY3RvcnlFbnRyeSwgZmlsZXMpID0+XG4gICAgICBAYXBpLmdldERpc3BsYXlQYXRoIGRpcmVjdG9yeUVudHJ5LCAocGF0aE5hbWUpID0+XG4gICAgICAgIGRpciA9XG4gICAgICAgICAgICByZWxQYXRoOiBkaXJlY3RvcnlFbnRyeS5mdWxsUGF0aC5yZXBsYWNlKCcvJyArIGRpcmVjdG9yeUVudHJ5Lm5hbWUsICcnKVxuICAgICAgICAgICAgZGlyZWN0b3J5RW50cnlJZDogQGFwaS5yZXRhaW5FbnRyeShkaXJlY3RvcnlFbnRyeSlcbiAgICAgICAgICAgIGVudHJ5OiBkaXJlY3RvcnlFbnRyeVxuXG4gICAgICAgICAgY2FsbGJhY2sgcGF0aE5hbWUsIGRpclxuICAgICAgICAgICAgIyBAZ2V0T25lRGlyTGlzdCBkaXJcbiAgICAgICAgICAgICMgU3RvcmFnZS5zYXZlICdkaXJlY3RvcmllcycsIEBzY29wZS5kaXJlY3RvcmllcyAocmVzdWx0KSAtPlxuXG5cblxuY2xhc3MgTWFwcGluZ1xuICByZXNvdXJjZTogbnVsbCAjaHR0cDovL2JsYWxhLmNvbS93aGF0L2V2ZXIvaW5kZXguanNcbiAgbG9jYWw6IG51bGwgIy9zb21lc2hpdHR5RGlyL290aGVyU2hpdHR5RGlyL1xuICByZWdleDogbnVsbFxuICBjb25zdHJ1Y3RvcjogKHJlc291cmNlLCBsb2NhbCwgcmVnZXgpIC0+XG4gICAgW0Bsb2NhbCwgQHJlc291cmNlLCBAcmVnZXhdID0gW2xvY2FsLCByZXNvdXJjZSwgcmVnZXhdXG5cbiAgZ2V0TG9jYWxSZXNvdXJjZTogKCkgLT5cbiAgICBAcmVzb3VyY2UucmVwbGFjZShAcmVnZXgsIEBsb2NhbClcblxuICBzZXRSZWRpcmVjdERlY2xhcmF0aXZlOiAodGFiSWQpIC0+XG4gICAgcnVsZXMgPSBbXS5wdXNoXG4gICAgICBwcmlvcml0eToxMDBcbiAgICAgIGNvbmRpdGlvbnM6IFtcbiAgICAgICAgbmV3IGNocm9tZS5kZWNsYXJhdGl2ZVdlYlJlcXVlc3QuUmVxdWVzdE1hdGNoZXJcbiAgICAgICAgICB1cmw6XG4gICAgICAgICAgICB1cmxNYXRjaGVzOkByZWdleFxuICAgICAgICBdXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgIG5ldyBjaHJvbWUuZGVjbGFyYXRpdmVXZWJSZXF1ZXN0LlJlZGlyZWN0UmVxdWVzdFxuICAgICAgICAgIHJlZGlyZWN0VXJsOkBnZXRMb2NhbFJlc291cmNlKClcbiAgICAgIF1cbiAgICBjaHJvbWUuZGVjbGFyYXRpdmVXZWJSZXF1ZXN0Lm9uUmVxdWVzdC5hZGRSdWxlcyBydWxlc1xuXG4jIGNsYXNzIFN0b3JhZ2VGYWN0b3J5XG4jICAgbWFrZU9iamVjdDogKHR5cGUpIC0+XG4jICAgICBzd2l0Y2ggdHlwZVxuIyAgICAgICB3aGVuICdSZXNvdXJjZUxpc3QnXG4jICAgX2NyZWF0ZTogKHR5cGUpIC0+XG4jICAgICBAZ2V0RnJvbVN0b3JhZ2UudGhlbiAob2JqKSAtPlxuIyAgICAgICByZXR1cm4gb2JqXG5cbiMgICBnZXRGcm9tU3RvcmFnZTogKCkgLT5cbiMgICAgIHByb21pc2UgPSBuZXcgUHJvbWlzZSAoc3VjY2VzcywgZmFpbCkgLT5cbiMgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0IChhKSAtPlxuIyAgICAgICAgIGIgPSBuZXcgUmVzb3VyY2VMaXN0XG4jICAgICAgICAgZm9yIGtleSBvZiBhXG4jICAgICAgICAgICBkbyAoYSkgLT5cbiMgICAgICAgICAgICAgYltrZXldID0gYVtrZXldXG4jICAgICAgICAgc3VjY2VzcyBiXG4jIyNcbmNsYXNzIEZpbGVcbiAgICBjb25zdHJ1Y3RvcjogKGRpcmVjdG9yeUVudHJ5LCBwYXRoKSAtPlxuICAgICAgICBAZGlyRW50cnkgPSBkaXJlY3RvcnlFbnRyeVxuICAgICAgICBAcGF0aCA9IHBhdGhcbiMjI1xuXG4jVE9ETzogcmV3cml0ZSB0aGlzIGNsYXNzIHVzaW5nIHRoZSBuZXcgY2hyb21lLnNvY2tldHMuKiBhcGkgd2hlbiB5b3UgY2FuIG1hbmFnZSB0byBtYWtlIGl0IHdvcmtcbmNsYXNzIFNlcnZlclxuICBzb2NrZXQ6IGNocm9tZS5zb2NrZXRcbiAgIyB0Y3A6IGNocm9tZS5zb2NrZXRzLnRjcFxuICBob3N0OlwiMTI3LjAuMC4xXCJcbiAgcG9ydDo4MDgyXG4gIG1heENvbm5lY3Rpb25zOjUwMFxuICBzb2NrZXRQcm9wZXJ0aWVzOlxuICAgICAgcGVyc2lzdGVudDp0cnVlXG4gICAgICBuYW1lOidTTFJlZGlyZWN0b3InXG4gIHNvY2tldEluZm86bnVsbFxuICBnZXRMb2NhbEZpbGU6bnVsbFxuICBzb2NrZXRJZHM6W11cbiAgc3RvcHBlZDpmYWxzZVxuXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuXG4gIHN0YXJ0OiAoaG9zdCxwb3J0LG1heENvbm5lY3Rpb25zLCBjYikgLT5cbiAgICBAaG9zdCA9IGlmIGhvc3Q/IHRoZW4gaG9zdCBlbHNlIEBob3N0XG4gICAgQHBvcnQgPSBpZiBwb3J0PyB0aGVuIHBvcnQgZWxzZSBAcG9ydFxuICAgIEBtYXhDb25uZWN0aW9ucyA9IGlmIG1heENvbm5lY3Rpb25zPyB0aGVuIG1heENvbm5lY3Rpb25zIGVsc2UgQG1heENvbm5lY3Rpb25zXG5cbiAgICBAa2lsbEFsbCAoKSA9PlxuICAgICAgQHNvY2tldC5jcmVhdGUgJ3RjcCcsIHt9LCAoc29ja2V0SW5mbykgPT5cbiAgICAgICAgQHNvY2tldElkcyA9IFtdXG4gICAgICAgIEBzb2NrZXRJZHMucHVzaCBzb2NrZXRJbmZvLnNvY2tldElkXG4gICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCAnc29ja2V0SWRzJzpAc29ja2V0SWRzXG4gICAgICAgIEBzb2NrZXQubGlzdGVuIHNvY2tldEluZm8uc29ja2V0SWQsIEBob3N0LCBAcG9ydCwgKHJlc3VsdCkgPT5cbiAgICAgICAgICBzaG93ICdsaXN0ZW5pbmcgJyArIHNvY2tldEluZm8uc29ja2V0SWRcbiAgICAgICAgICBAc3RvcHBlZCA9IGZhbHNlXG4gICAgICAgICAgQHNvY2tldEluZm8gPSBzb2NrZXRJbmZvXG4gICAgICAgICAgQHNvY2tldC5hY2NlcHQgc29ja2V0SW5mby5zb2NrZXRJZCwgQF9vbkFjY2VwdFxuXG4gIGtpbGxBbGw6IChjYWxsYmFjaykgLT5cbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQgJ3NvY2tldElkcycsIChyZXN1bHQpID0+XG4gICAgICBzaG93ICdnb3QgaWRzJ1xuICAgICAgc2hvdyByZXN1bHRcbiAgICAgIEBzb2NrZXRJZHMgPSByZXN1bHQuc29ja2V0SWRzXG4gICAgICBmb3IgcyBpbiBAc29ja2V0SWRzP1xuICAgICAgICBkbyAocykgPT5cbiAgICAgICAgICB0cnlcbiAgICAgICAgICAgIEBzb2NrZXQuZGlzY29ubmVjdCBzXG4gICAgICAgICAgICBAc29ja2V0LmRlc3Ryb3kgc1xuICAgICAgICAgICAgc2hvdyAna2lsbGVkICcgKyBzXG4gICAgICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgICAgIHNob3cgXCJjb3VsZCBub3Qga2lsbCAjeyBzIH0gYmVjYXVzZSAjeyBlcnJvciB9XCJcbiAgICAgIGNhbGxiYWNrPygpXG5cbiAgc3RvcDogKCkgLT5cbiAgICBAa2lsbEFsbCgpXG4gICAgQHN0b3BwZWQgPSB0cnVlXG5cbiAgX29uUmVjZWl2ZTogKHJlY2VpdmVJbmZvKSA9PlxuICAgIHNob3coXCJDbGllbnQgc29ja2V0ICdyZWNlaXZlJyBldmVudDogc2Q9XCIgKyByZWNlaXZlSW5mby5zb2NrZXRJZFxuICAgICsgXCIsIGJ5dGVzPVwiICsgcmVjZWl2ZUluZm8uZGF0YS5ieXRlTGVuZ3RoKVxuXG4gIF9vbkxpc3RlbjogKHNlcnZlclNvY2tldElkLCByZXN1bHRDb2RlKSA9PlxuICAgIHJldHVybiBzaG93ICdFcnJvciBMaXN0ZW5pbmc6ICcgKyBjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSBpZiByZXN1bHRDb2RlIDwgMFxuICAgIEBzZXJ2ZXJTb2NrZXRJZCA9IHNlcnZlclNvY2tldElkXG4gICAgQHRjcFNlcnZlci5vbkFjY2VwdC5hZGRMaXN0ZW5lciBAX29uQWNjZXB0XG4gICAgQHRjcFNlcnZlci5vbkFjY2VwdEVycm9yLmFkZExpc3RlbmVyIEBfb25BY2NlcHRFcnJvclxuICAgIEB0Y3Aub25SZWNlaXZlLmFkZExpc3RlbmVyIEBfb25SZWNlaXZlXG4gICAgIyBzaG93IFwiW1wiK3NvY2tldEluZm8ucGVlckFkZHJlc3MrXCI6XCIrc29ja2V0SW5mby5wZWVyUG9ydCtcIl0gQ29ubmVjdGlvbiBhY2NlcHRlZCFcIjtcbiAgICAjIGluZm8gPSBAX3JlYWRGcm9tU29ja2V0IHNvY2tldEluZm8uc29ja2V0SWRcbiAgICAjIEBnZXRGaWxlIHVyaSwgKGZpbGUpIC0+XG4gIF9vbkFjY2VwdEVycm9yOiAoZXJyb3IpIC0+XG4gICAgc2hvdyBlcnJvclxuXG4gIF9vbkFjY2VwdDogKHNvY2tldEluZm8pID0+XG4gICAgIyByZXR1cm4gbnVsbCBpZiBpbmZvLnNvY2tldElkIGlzbnQgQHNlcnZlclNvY2tldElkXG4gICAgc2hvdyhcIlNlcnZlciBzb2NrZXQgJ2FjY2VwdCcgZXZlbnQ6IHNkPVwiICsgc29ja2V0SW5mby5zb2NrZXRJZClcbiAgICBAX3JlYWRGcm9tU29ja2V0IHNvY2tldEluZm8uc29ja2V0SWQsIChpbmZvKSA9PlxuICAgICAgQGdldExvY2FsRmlsZSBpbmZvLFxuICAgICAgICAoZmlsZUVudHJ5LCBmaWxlUmVhZGVyKSA9PlxuICAgICAgICAgIEBfd3JpdGUyMDBSZXNwb25zZSBzb2NrZXRJbmZvLnNvY2tldElkLCBmaWxlRW50cnksIGZpbGVSZWFkZXIsIGluZm8ua2VlcEFsaXZlLFxuICAgICAgICAoZXJyb3IpID0+XG4gICAgICAgICAgQF93cml0ZUVycm9yIHNvY2tldEluZm8uc29ja2V0SWQsIDQwNCwgaW5mby5rZWVwQWxpdmVcbiAgICAjIEBzb2NrZXQuYWNjZXB0IHNvY2tldEluZm8uc29ja2V0SWQsIEBfb25BY2NlcHRcblxuXG5cbiAgc3RyaW5nVG9VaW50OEFycmF5OiAoc3RyaW5nKSAtPlxuICAgIGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcihzdHJpbmcubGVuZ3RoKVxuICAgIHZpZXcgPSBuZXcgVWludDhBcnJheShidWZmZXIpXG4gICAgaSA9IDBcblxuICAgIHdoaWxlIGkgPCBzdHJpbmcubGVuZ3RoXG4gICAgICB2aWV3W2ldID0gc3RyaW5nLmNoYXJDb2RlQXQoaSlcbiAgICAgIGkrK1xuICAgIHZpZXdcblxuICBhcnJheUJ1ZmZlclRvU3RyaW5nOiAoYnVmZmVyKSAtPlxuICAgIHN0ciA9IG5ldyBVaW50OEFycmF5KGJ1ZmZlcilcbiAgICBzID0gMFxuXG4gICAgd2hpbGUgcyA8IHVBcnJheVZhbC5sZW5ndGhcbiAgICAgIHN0ciArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHVBcnJheVZhbFtzXSlcbiAgICAgIHMrK1xuICAgIHN0clxuXG4gIF93cml0ZTIwMFJlc3BvbnNlOiAoc29ja2V0SWQsIGZpbGVFbnRyeSwgZmlsZSwga2VlcEFsaXZlKSAtPlxuICAgIGNvbnRlbnRUeXBlID0gKGlmIChmaWxlLnR5cGUgaXMgXCJcIikgdGhlbiBcInRleHQvcGxhaW5cIiBlbHNlIGZpbGUudHlwZSlcbiAgICBjb250ZW50TGVuZ3RoID0gZmlsZS5zaXplXG4gICAgaGVhZGVyID0gQHN0cmluZ1RvVWludDhBcnJheShcIkhUVFAvMS4wIDIwMCBPS1xcbkNvbnRlbnQtbGVuZ3RoOiBcIiArIGZpbGUuc2l6ZSArIFwiXFxuQ29udGVudC10eXBlOlwiICsgY29udGVudFR5cGUgKyAoKGlmIGtlZXBBbGl2ZSB0aGVuIFwiXFxuQ29ubmVjdGlvbjoga2VlcC1hbGl2ZVwiIGVsc2UgXCJcIikpICsgXCJcXG5cXG5cIilcbiAgICBvdXRwdXRCdWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoaGVhZGVyLmJ5dGVMZW5ndGggKyBmaWxlLnNpemUpXG4gICAgdmlldyA9IG5ldyBVaW50OEFycmF5KG91dHB1dEJ1ZmZlcilcbiAgICB2aWV3LnNldCBoZWFkZXIsIDBcblxuICAgIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyXG4gICAgcmVhZGVyLm9ubG9hZCA9IChldikgPT5cbiAgICAgIHZpZXcuc2V0IG5ldyBVaW50OEFycmF5KGV2LnRhcmdldC5yZXN1bHQpLCBoZWFkZXIuYnl0ZUxlbmd0aFxuICAgICAgQHNvY2tldC53cml0ZSBzb2NrZXRJZCwgb3V0cHV0QnVmZmVyLCAod3JpdGVJbmZvKSA9PlxuICAgICAgICBzaG93IHdyaXRlSW5mb1xuICAgICAgICAjIEBfcmVhZEZyb21Tb2NrZXQgc29ja2V0SWRcbiAgICAgICAgQGVuZCBzb2NrZXRJZCwga2VlcEFsaXZlXG4gICAgcmVhZGVyLm9uZXJyb3IgPSAoZXJyb3IpID0+XG4gICAgICBAZW5kIHNvY2tldElkLCBrZWVwQWxpdmVcbiAgICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIgZmlsZVxuXG5cbiAgICAjIEBlbmQgc29ja2V0SWRcbiAgICAjIGZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gICAgIyBmaWxlUmVhZGVyLm9ubG9hZCA9IChlKSA9PlxuICAgICMgICB2aWV3LnNldCBuZXcgVWludDhBcnJheShlLnRhcmdldC5yZXN1bHQpLCBoZWFkZXIuYnl0ZUxlbmd0aFxuICAgICMgICBAc29ja2V0LndyaXRlIHNvY2tldElkLCBvdXRwdXRCdWZmZXIsICh3cml0ZUluZm8pID0+XG4gICAgIyAgICAgc2hvdyBcIldSSVRFXCIsIHdyaXRlSW5mb1xuICAgICMgICAgICAgQF93cml0ZTIwMFJlc3BvbnNlIHNvY2tldElkXG5cblxuICBfcmVhZEZyb21Tb2NrZXQ6IChzb2NrZXRJZCwgY2IpIC0+XG4gICAgQHNvY2tldC5yZWFkIHNvY2tldElkLCAocmVhZEluZm8pID0+XG4gICAgICBzaG93IFwiUkVBRFwiLCByZWFkSW5mb1xuXG4gICAgICAjIFBhcnNlIHRoZSByZXF1ZXN0LlxuICAgICAgZGF0YSA9IEBhcnJheUJ1ZmZlclRvU3RyaW5nKHJlYWRJbmZvLmRhdGEpXG4gICAgICBzaG93IGRhdGFcblxuICAgICAgaWYgZGF0YS5pbmRleE9mKFwiR0VUIFwiKSBpc250IDBcbiAgICAgICAgQGVuZCBzb2NrZXRJZFxuICAgICAgICByZXR1cm5cblxuICAgICAga2VlcEFsaXZlID0gZmFsc2VcbiAgICAgIGtlZXBBbGl2ZSA9IHRydWUgaWYgZGF0YS5pbmRleE9mICdDb25uZWN0aW9uOiBrZWVwLWFsaXZlJyBpc250IC0xXG5cbiAgICAgIHVyaUVuZCA9IGRhdGEuaW5kZXhPZihcIiBcIiwgNClcblxuICAgICAgcmV0dXJuIGVuZCBzb2NrZXRJZCBpZiB1cmlFbmQgPCAwXG5cbiAgICAgIHVyaSA9IGRhdGEuc3Vic3RyaW5nKDQsIHVyaUVuZClcbiAgICAgIGlmIG5vdCB1cmk/XG4gICAgICAgIHdyaXRlRXJyb3Igc29ja2V0SWQsIDQwNCwga2VlcEFsaXZlXG4gICAgICAgIHJldHVyblxuXG4gICAgICBpbmZvID1cbiAgICAgICAgdXJpOiB1cmlcbiAgICAgICAga2VlcEFsaXZlOmtlZXBBbGl2ZVxuICAgICAgaW5mby5yZWZlcmVyID0gZGF0YS5tYXRjaCgvUmVmZXJlcjpcXHMoLiopLyk/WzFdXG4gICAgICAjc3VjY2Vzc1xuICAgICAgY2I/IGluZm9cblxuICBlbmQ6IChzb2NrZXRJZCwga2VlcEFsaXZlKSAtPlxuICAgICAgIyBpZiBrZWVwQWxpdmVcbiAgICAgICMgICBAX3JlYWRGcm9tU29ja2V0IHNvY2tldElkXG4gICAgICAjIGVsc2VcbiAgICBAc29ja2V0LmRpc2Nvbm5lY3Qgc29ja2V0SWRcbiAgICBAc29ja2V0LmRlc3Ryb3kgc29ja2V0SWRcbiAgICBzaG93ICdlbmRpbmcgJyArIHNvY2tldElkXG4gICAgQHNvY2tldC5hY2NlcHQgQHNvY2tldEluZm8uc29ja2V0SWQsIEBfb25BY2NlcHRcblxuICBfd3JpdGVFcnJvcjogKHNvY2tldElkLCBlcnJvckNvZGUsIGtlZXBBbGl2ZSkgLT5cbiAgICBmaWxlID0gc2l6ZTogMFxuICAgIGNvbnNvbGUuaW5mbyBcIndyaXRlRXJyb3JSZXNwb25zZTo6IGJlZ2luLi4uIFwiXG4gICAgY29uc29sZS5pbmZvIFwid3JpdGVFcnJvclJlc3BvbnNlOjogZmlsZSA9IFwiICsgZmlsZVxuICAgIGNvbnRlbnRUeXBlID0gXCJ0ZXh0L3BsYWluXCIgIyhmaWxlLnR5cGUgPT09IFwiXCIpID8gXCJ0ZXh0L3BsYWluXCIgOiBmaWxlLnR5cGU7XG4gICAgY29udGVudExlbmd0aCA9IGZpbGUuc2l6ZVxuICAgIGhlYWRlciA9IEBzdHJpbmdUb1VpbnQ4QXJyYXkoXCJIVFRQLzEuMCBcIiArIGVycm9yQ29kZSArIFwiIE5vdCBGb3VuZFxcbkNvbnRlbnQtbGVuZ3RoOiBcIiArIGZpbGUuc2l6ZSArIFwiXFxuQ29udGVudC10eXBlOlwiICsgY29udGVudFR5cGUgKyAoKGlmIGtlZXBBbGl2ZSB0aGVuIFwiXFxuQ29ubmVjdGlvbjoga2VlcC1hbGl2ZVwiIGVsc2UgXCJcIikpICsgXCJcXG5cXG5cIilcbiAgICBjb25zb2xlLmluZm8gXCJ3cml0ZUVycm9yUmVzcG9uc2U6OiBEb25lIHNldHRpbmcgaGVhZGVyLi4uXCJcbiAgICBvdXRwdXRCdWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoaGVhZGVyLmJ5dGVMZW5ndGggKyBmaWxlLnNpemUpXG4gICAgdmlldyA9IG5ldyBVaW50OEFycmF5KG91dHB1dEJ1ZmZlcilcbiAgICB2aWV3LnNldCBoZWFkZXIsIDBcbiAgICBjb25zb2xlLmluZm8gXCJ3cml0ZUVycm9yUmVzcG9uc2U6OiBEb25lIHNldHRpbmcgdmlldy4uLlwiXG4gICAgQHNvY2tldC53cml0ZSBzb2NrZXRJZCwgb3V0cHV0QnVmZmVyLCAod3JpdGVJbmZvKSA9PlxuICAgICAgc2hvdyBcIldSSVRFXCIsIHdyaXRlSW5mb1xuICAgICAgQGVuZCBzb2NrZXRJZCwga2VlcEFsaXZlXG5cbmNsYXNzIEFwcGxpY2F0aW9uXG5cbiAgY29uZmlnOlxuICAgIEFQUF9JRDogJ2NlY2lmYWZwaGVnaG9mcGZka2hla2tpYmNpYmhnZmVjJ1xuICAgIEVYVEVOU0lPTl9JRDogJ2RkZGltYm5qaWJqY2FmYm9rbmJnaGVoYmZhamdnZ2VwJ1xuXG4gIGRhdGE6bnVsbFxuICBMSVNURU46IG51bGxcbiAgTVNHOiBudWxsXG4gIFN0b3JhZ2U6IG51bGxcbiAgRlM6IG51bGxcbiAgU2VydmVyOiBudWxsXG5cbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgQFN0b3JhZ2UgPSBuZXcgU3RvcmFnZVxuICAgIEBGUyA9IG5ldyBGaWxlU3lzdGVtXG4gICAgQFNlcnZlciA9IG5ldyBTZXJ2ZXJcbiAgICBAY29uZmlnLlNFTEZfSUQgPSBjaHJvbWUucnVudGltZS5pZFxuICAgIEBjb25maWcuRVhUX0lEID0gaWYgQGNvbmZpZy5BUFBfSUQgaXMgQGNvbmZpZy5TRUxGX0lEIHRoZW4gQGNvbmZpZy5FWFRFTlNJT05fSUQgZWxzZSBAY29uZmlnLkFQUF9JRFxuICAgIEBjb25maWcuRVhUX1RZUEUgPSBpZiBAY29uZmlnLkFQUF9JRCBpc250IEBjb25maWcuU0VMRl9JRCB0aGVuICdFWFRFTlNJT04nIGVsc2UgJ0FQUCdcbiAgICBATVNHID0gbmV3IE1TRyBAY29uZmlnXG4gICAgQExJU1RFTiA9IG5ldyBMSVNURU4gQGNvbmZpZ1xuXG4gICAgQGFwcFdpbmRvdyA9IG51bGxcbiAgICBAcG9ydCA9IDMxMzM3XG4gICAgQGRhdGEgPSBAU3RvcmFnZS5kYXRhXG4gICAgQGluaXQoKVxuXG4gIGluaXQ6ICgpID0+XG5cbiAgICAjIExJU1RFTi5FWFQgJ2RpcmVjdG9yeUVudHJ5SWQnIChkaXJJZCkgLT5cbiAgICAgICMgQGRpcmVjdG9yaWVzLnB1c2ggZGlySWRcbiAgYWRkTWFwcGluZzogKCkgLT5cbiAgIyBpZiBAZGF0YS5kaXJlY3Rvcmllc1tdXG4gICAgICAjIEBGUy5vcGVuRGlyZWN0b3J5IChwYXRoTmFtZSwgZGlyKSAtPlxuICAgICAgIyBtYXRjaCA9IEBkYXRhLnJlc291cmNlc1xuICAgICAgIyBpZiBtYXRjaC5sZW5ndGggPiAwIHRoZW5cblxuICBsYXVuY2hBcHA6IChjYikgLT5cbiAgICBjaHJvbWUubWFuYWdlbWVudC5sYXVuY2hBcHAgQGNvbmZpZy5BUFBfSURcblxuICBzdGFydFNlcnZlcjogKCkgPT5cblxuICAgICMgQHNlcnZlciA9IG5ldyBUY3BTZXJ2ZXIoJzEyNy4wLjAuMScsIEBwb3J0KVxuICAgICMgQHNlcnZlci5saXN0ZW5cblxuICBvcGVuQXBwOiAoKSA9PlxuICAgIGNocm9tZS5hcHAud2luZG93LmNyZWF0ZSgnaW5kZXguaHRtbCcsXG4gICAgICBpZDogXCJtYWlud2luXCJcbiAgICAgIGJvdW5kczpcbiAgICAgICAgd2lkdGg6NTAwXG4gICAgICAgIGhlaWdodDo4MDAsXG4gICAgKHdpbikgPT5cbiAgICAgIEBhcHBXaW5kb3cgPSB3aW4pXG5cbiAgc2V0UmVkaXJlY3Q6ICgpID0+XG4gICAgdW5kZWZpbmVkXG4gIHNob3cgPSAtPiAjIGpzaGludCAtVzAyMVxuICAgIGlmIHdpbmRvdy5jb25zb2xlXG4gICAgICBpZiBGdW5jdGlvbjo6YmluZFxuICAgICAgICBsb2cgPSBGdW5jdGlvbjo6YmluZC5jYWxsKGNvbnNvbGUubG9nLCBjb25zb2xlKVxuICAgICAgZWxzZVxuICAgICAgICBsb2cgPSAtPlxuICAgICAgICAgIEZ1bmN0aW9uOjphcHBseS5jYWxsIGNvbnNvbGUubG9nLCBjb25zb2xlLCBhcmd1bWVudHNfXG4gICAgICAgICAgcmV0dXJuXG4gICAgICBsb2cuYXBwbHkgdGhpcywgYXJndW1lbnRzX1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQXBwbGljYXRpb25cbiJdfQ==
