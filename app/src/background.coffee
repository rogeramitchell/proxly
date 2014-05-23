# server = require './tcp-server.js'

getGlobal = ->
  _getGlobal = ->
    this

  _getGlobal()

root = getGlobal()

Application = require '../../common.coffee'

chrome.app.runtime.onLaunched.addListener ->
  chrome.app.window.create 'index.html',
        id: "mainwin"
        bounds:
          width:770
          height:800




# Config = require '../../config.coffee'
# MSG = require '../../msg.coffee'
# LISTEN = require '../../listen.coffee'
# Storage = require '../../storage.coffee'
# FileSystem = require '../../filesystem.coffee'
Config = require '../../config.coffee'
Storage = require '../../storage.coffee'
FileSystem = require '../../filesystem.coffee'
Server = require '../../server.coffee'


root.app = new Application 
  Storage: new Storage
  FS: new FileSystem
  Server: new Server

root.app.Server.getLocalFile = app.getLocalFile

chrome.runtime.onSuspend.addListener ->
  root.app.Storage.saveAll(null)

#root.app.Storage.retrieveAll()
