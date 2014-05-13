//
// Copyright (c) 2014 Max Vilimpoc. All rights reserved.
//
// This code tracks the handful of points where cookies may be sent or received,
// and tracks the amount of time a single page in a tab takes to load. It also
// keeps track of how long a particular page has been open in a tab, so that 
// cookie operations associated with a tab, can be associated with the page that
// caused them.
//

"use strict";

/**
 * Defined just for WebStorm to not keep asking.
 */
var chrome = chrome || {};

/**
 * Tracking table for in-flight page loads.
 *
 * key -- "tabId-processId-frameId"
 */
var inFlight = {};

/**
 * Tracking table for the amount of time spent by a Tab on a specific Page.
 *
 * We look at the web navigation onCommitted events, which tell how long a
 * Tab has been on a page before the next page is browsed to.
 *
 * Data looks something like:
 * pageViewDuration[tabId] = { type: 'pageviewduration', url: URL, entered: timestamp, left: timestamp }
 *
 * When entered and left have been filled in, the entry gets pushed into
 * Local Storage for later processing.
 */
var pageViewTable = {};

/**
 * Use the event count to group the page-load actions together.
 *
 * In other words, even if a page load action is
 * occurring due to a client_redirect / META refresh
 * we need a way to say that all the actions between
 * the webnavCommittedListener and onComplete/ErrorOccurred
 * belong to one page load action.
 *
 * Example: nytimes.com website will META refresh
 * every N seconds, so we want to make sure that
 * all the actions are associated with a page load
 * ID.
 *
 * @type {number}
 */
var pageLoadCount = 0;


var webnavLogger = Logger.get('webnav');
var webreqLogger = Logger.get('webreq');
var cookieLogger = Logger.get('cookie');
var stampsLogger = Logger.get('stamps');


var makeKey = function(tabId, processId, frameId) {
    return tabId + "-" + processId + "-" + frameId;
};

var stampStart = function(details) {
    // Immediate check and return.
    if ('about:blank' === details.url) return;

    // TODO: Immediate check and return.
    // if (tab is incognito) return;

    var key      = makeKey(details.tabId, details.processId, details.frameId);  //!< All frames and subframes have a unique identifier.
    var topFrame = false;
    var process  = makeKey(details.tabId, details.processId, 0);
    var pageload = -1;                                                          //!< All actions between the start and finish of the top-frame action count as the same event.

    var stamp;

    // We need to mark the navigation as user-started when it is using frameId 0.
    //
    // This also means it is /not/ a subframe.
    //
    // If it IS a subframe, then we should add it to the list of subStamps being
    // tracked by the top frame.
    if (0 == details.frameId) {
        topFrame = true;
        pageload = pageLoadCount++;
    } else {
        // Look for the parent-frame timestamp object, and add a reference to the
        // .subStamps property.
        //
        // The parent-frame reference should remain valid in the in-flight table
        // until all subframes have loaded anyway.
        topFrame = false;

        // Look up the parent-frame timestamp and make sure that this subframe
        // is associated with the same eventId.
        if (process in inFlight) {
            stamp    = inFlight[process];
            pageload = stamp.eventId;
        } else {
            // If a subframe load occurs after the parent-frame is no longer in-flight,
            // then it needs its own separate event count.
            pageload = pageLoadCount++;
        }

    }

    // Create an in-flight timestamp object, which waits for the frame to finish loading.
    inFlight[key] = {
        type: 'pageLoad',
        tabId: details.tabId,
        pageload: pageload,
        start: new Date().getTime(),
        finish: 0,
        topFrame: topFrame,
        hostname: new URL(details.url).hostname,
        pageUrl: details.url };

    stampsLogger.debug('key: ' + key + " = " + JSON.stringify(inFlight[key]));
};

var stampFinish = function(details) {
    // Immediate check and return.
    if ('about:blank' === details.url) return;

    // TODO: Immediate check and return.
    // if (tab is incognito) return;

    var key = makeKey(details.tabId, details.processId, details.frameId);
    var stamp;

    var storeStamp = {};

    // Get the timestamp from the in-flight table, and set the finished-loading timestamp.
    if (key in inFlight) {
        stamp = inFlight[key];
        stamp.finish = new Date().getTime();

        // Persist the record to LocalStorage, using a timestamp as the key (irrelevant).
        storeStamp[stamp.finish] = stamp;
        chrome.storage.local.set(storeStamp, function() {
            stampsLogger.debug("Saved timestamp data.");
            if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);
        });

        // Remove the page-load record from the in-flight table.
        delete inFlight[key];
    }

    stampsLogger.debug('key: ' + key + " = " + JSON.stringify(stamp));
};

function updatePageViewDetails(details) {
    // Immediate check and return.
    if ('about:blank' === details.url) return;

    // Immediate check and return.
    if (0 != details.frameId) return;

    // Check whether the tab was already looking at another webpage.
    //
    // If so, then the duration that the other webpage was being viewed
    // can be determined.
    //
    // If the tab isn't already looking at a webpage (or was newly
    // created and not in the tracking table), then add the page
    // info to the tracking table.
    var stamp;
    var storeStamp = {};
    
    var timeMs = new Date().getTime();

    if (details.tabId in pageViewTable) {
        stamp = pageViewTable[details.tabId];
        stamp.finish = timeMs;

        // Save the stamp into Local Storage.
        storeStamp[timeMs] = stamp;
        chrome.storage.local.set(storeStamp, function() {
            stampsLogger.debug("Saved page view duration data.");
            if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);
        });
    }

    stamp = {
        type: 'pageViewDetails',
        tabId: details.tabId,
        start: timeMs,
        finish: 0,
        hostname: new URL(details.url).hostname,
        pageUrl: details.url };

    pageViewTable[details.tabId] = stamp;
}


/****************************************************************************
 * webNavigation event handlers.
 ****************************************************************************/


//function onBeforeNavigateListener(details) {
//    webnavLogger.debug("onBeforeNavigate" + JSON.stringify(details));
//
//    // stampStart(details);
//};

chrome.webNavigation.onCommitted.addListener(function(details) {
    webnavLogger.debug("onCommitted " + JSON.stringify(details));

    stampStart(details);
    updatePageViewDetails(details);
});

chrome.webNavigation.onCompleted.addListener(function(details) {
    webnavLogger.debug("onCompleted " + JSON.stringify(details));

    stampFinish(details);
});

chrome.webNavigation.onErrorOccurred.addListener(function(details) {
    webnavLogger.debug("onErrorOccurred " + JSON.stringify(details));

    stampFinish(details);
});


/****************************************************************************
 * webRequest event handlers.
 ****************************************************************************/

var standardFilter = {
    urls: ['http://*/*', 'https://*/*']
};

chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
    webreqLogger.debug("onBeforeSendHeaders " + JSON.stringify(details));
}, standardFilter, ['requestHeaders']);

chrome.webRequest.onSendHeaders.addListener(function(details) {
    webreqLogger.debug("onSendHeaders " + JSON.stringify(details));

    // If the current request had a "Cookie" header, then
    // make a note that a cookie was sent.

    var cookiesPresent = _.filter(details.requestHeaders, {'name': 'Cookie'});
    var currentPage;

    // Immediate check and return.
    if (!cookiesPresent || 0 == cookiesPresent.length) return;

    // Look up the current Page in the Tab that is loading.
    if (details.tabId in pageViewTable) {
        currentPage = pageViewTable[details.tabId];

        webreqLogger.debug("Existing page " + JSON.stringify(currentPage));

        // Add an entry to Local Storage associating the current Cookie
        // request to the Page currently in the Tab.

        var storeStamp = {};
        var timeMs = new Date().getTime();

        storeStamp[timeMs] = {
            type: 'cookieSent',
            tabId: details.tabId,
            timestamp: timeMs,
            hostname: new URL(details.url).hostname,
            pageUrl: currentPage.pageUrl,
            targetUrl: details.url,
            cookiesPresent: cookiesPresent };

        chrome.storage.local.set(storeStamp, function() {
            stampsLogger.debug("Saved cookieSent data.");
            if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);
        });
    }
}, standardFilter, ['requestHeaders']);

chrome.webRequest.onHeadersReceived.addListener(function(details) {
    webreqLogger.debug("onHeadersReceived " + JSON.stringify(details));

    // If the current request had a "Set-cookie" header, then
    // make a note that a cookie was received.
    
    // var cookiePresent = _.find(details.responseHeaders, {'name': 'Set-Cookie'});
    var cookiesPresent = _.filter(details.responseHeaders, function(header) {
        return header.name.match(/set\-cookie/i);
    });
    var currentPage;

    // Immediate check and return.
    if (!cookiesPresent || 0 == cookiesPresent.length) return;

    // Look up the current Page in the Tab that is loading.
    if (details.tabId in pageViewTable) {
        currentPage = pageViewTable[details.tabId];

        webreqLogger.debug("Existing page " + JSON.stringify(currentPage));

        // Add an entry to Local Storage associating the current Cookie
        // request to the Page currently in the Tab.

        var storeStamp = {};
        var timeMs = new Date().getTime();

        storeStamp[timeMs] = {
            type: 'cookieReceived',
            tabId: details.tabId,
            timestamp: timeMs,
            hostname: new URL(details.url).hostname,
            pageUrl: currentPage.url,
            targetUrl: details.url,
            cookiesPresent: cookiesPresent };

        chrome.storage.local.set(storeStamp, function() {
            stampsLogger.debug("Saved cookieReceived data.");
            if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);
        });
    }
}, standardFilter, ['responseHeaders']);

chrome.webRequest.onCompleted.addListener(function(details) {
    webreqLogger.debug("onCompleted " + JSON.stringify(details));
}, standardFilter, ['responseHeaders']);


/****************************************************************************
 * Tab event handlers.
 ****************************************************************************/


chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    var timeMs = new Date().getTime();
    var stamp;
    var storeStamp = {};
    
    // Look up the pageView object, and mark its finished timestamp.
    if (tabId in pageViewTable) {
        stamp = pageViewTable[tabId];
        stamp.finish = timeMs;

        // Save the stamp into Local Storage.
        storeStamp[timeMs] = stamp;
        chrome.storage.local.set(storeStamp, function() {
            stampsLogger.debug("Tab removed: Saved page view duration data.");
            if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);
        });
        
        // Remove the object from the pageViewTable, otherwise it's a leak.
        delete pageViewTable[tabId];
    }
});


/****************************************************************************
 * Cookie event handlers.
 ****************************************************************************/


// chrome.cookies.onChanged.addListener(function(details) {
    // // Add a timestamp to the Details object (as it's not currently provided).
    // details['timestamp'] = new Date().getTime();
    // cookieLogger.debug("onChanged " + JSON.stringify(details));

    // // Record the details into the cookie objects to be persisted into
    // // Local Storage.
// });


/****************************************************************************
 * Management page stuff.
 ****************************************************************************/


function focusOrCreateTab(url) {
  chrome.windows.getAll({"populate":true}, function(windows) {
    var existing_tab = null;
    for (var i in windows) {
      var tabs = windows[i].tabs;
      for (var j in tabs) {
        var tab = tabs[j];
        if (tab.url == url) {
          existing_tab = tab;
          break;
        }
      }
    }
    if (existing_tab) {
      chrome.tabs.update(existing_tab.id, {"selected":true});
    } else {
      chrome.tabs.create({"url":url, "selected":true});
    }
  });
}

chrome.browserAction.onClicked.addListener(function(tab) {
    var manager_url = chrome.extension.getURL("manager.html");
    focusOrCreateTab(manager_url);
});


/****************************************************************************
 * Debugging Stuff.
 ****************************************************************************/

 
function clearLocalStorage() {
    chrome.storage.local.clear();
}

function dumpLocalStorage() {
    chrome.storage.local.get(null, function(dump) {
        console.log(dump);
    });
}

function sizeLocalStorage() {
    chrome.storage.local.getBytesInUse(null, function(data) { 
        console.log(data); 
    });
}

/****************************************************************************
 * main()
 ****************************************************************************/


(function main() {
    Logger.useDefaults();
    Logger.setLevel(Logger.WARN);

    webnavLogger.setLevel(Logger.WARN);
    webreqLogger.setLevel(Logger.WARN);
    cookieLogger.setLevel(Logger.WARN);
    stampsLogger.setLevel(Logger.DEBUG);
})();

