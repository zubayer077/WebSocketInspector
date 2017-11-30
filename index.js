var self = require("sdk/self");

(function dummy(text, callback) {

  const { Cc, Ci, Cu } = require("chrome");
  const Events = require("sdk/event/core");
  
  function safeImport(...args) {
    for (var i = 0; i < args.length; i++) {
      try {
        return Cu["import"](args[i], {});
      }
      catch (err) {
      }
    }
    return {};
  }
  
  function safeRequire(devtools, ...args) {
    for (var i=0; i<args.length; i++) {
      try {
        return devtools["require"](args[i]);
      }
      catch (err) {
      }
    }
    return {};
  }

  const devtools = safeImport(
    "resource://devtools/shared/Loader.jsm",
    "resource://gre/modules/devtools/shared/Loader.jsm",
    "resource://gre/modules/devtools/Loader.jsm"
  ).devtools;

  const protocol = safeRequire(devtools,
    "devtools/shared/protocol",
    "devtools/server/protocol"
  );

  const { expectState } = devtools["require"]("devtools/server/actors/common");
  
  // Platform
  const { XPCOMUtils } = Cu.import("resource://gre/modules/XPCOMUtils.jsm", {});
  
  // Constants
  const { method, RetVal, ActorClass, FrontClass, Front, Actor, Arg } = protocol;

  function safeRequireWebSocketEventService() {
    try {
      return Cc["@mozilla.org/websocketevent/service;1"].
        getService(Ci.nsIWebSocketEventService);
    } catch (err) {
      Cu.reportError("WebSocket extension: nsIWebSocketEventService " +
        "not available! See bug: " +
        "https://bugzilla.mozilla.org/show_bug.cgi?id=1203802 and " +
        "https://bugzilla.mozilla.org/show_bug.cgi?id=1215092");
    }
  }

  function getInnerId(win) {
    return win.top.QueryInterface(Ci.nsIInterfaceRequestor).
      getInterface(Ci.nsIDOMWindowUtils).currentInnerWindowID;
  }

  const webSocketEventService = safeRequireWebSocketEventService();

  function WebSocketEventListener(events) {
    this.events = events;
  }
  
  WebSocketEventListener.prototype = {
    // nsIWebSocketEventService
  
    QueryInterface:
      XPCOMUtils.generateQI([Ci.nsIWebSocketEventService]),
  
    webSocketCreated: function(webSocketSerialID, uri, protocols) {
      console.log("webSocketCreated called");
    },
  
    webSocketOpened: function(webSocketSerialID, effectiveURI, protocols, extensions) {
      console.log("webSocketOpened called");
    },
  
    webSocketClosed: function(webSocketSerialID, wasClean, code, reason) {
      console.log("webSocketClosed called");
    },
  
    webSocketMessageAvailable: function(webSocketSerialID, data, messageType) {
      console.log("webSocketMessageAvailable called");
    },
  
    frameReceived: function(webSocketSerialID, frame) {
      console.log("frameReceived called");
    },
  
    frameSent: function(webSocketSerialID, frame) {
      console.log("frameSent called");
    },
  
    emit: function(eventName, data) {
      console.log("emit called");
    }
  }



var tabs = require("sdk/tabs"),
  tab_utils = require("sdk/tabs/utils"),
  { viewFor } = require("sdk/view/core"),
  window_utils = require('sdk/window/utils');
tabs.on("ready", function runScript(curTab){
  var tab = tab_utils.getTabForId(curTab.id),
      currentTab = viewFor(curTab),
      chromeWindow = tab_utils.getOwnerWindow(currentTab)

  // var innerId = chromeWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowUtils).currentInnerWindowID;
  var domWindow = window_utils.getMostRecentBrowserWindow(),
      innerId = window_utils.getInnerId(domWindow);

  webSocketEventService.addListener(innerId, new WebSocketEventListener({}));
});

})()

exports.dummy = {};