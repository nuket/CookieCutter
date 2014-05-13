//
// Copyright (c) 2014 Max Vilimpoc. All rights reserved.
//

/**
 * Loggers.
 */
var trackerLogger = Logger.get('tracker');

/**
 * Loads all objects from Local Storage.
 * We use Lodash to slice and dice these into views once they're in memory.
 */
var allData = [];

/**
 * Used to calculate the position or width of a time or time duration.
 * @type {number}
 */
var PX_PER_MS = 0.20;

var blockPosition = function(zeroTimeMs, timeMs) {
    return d3.round((timeMs - zeroTimeMs) * PX_PER_MS, 2);
};

var blockWidth = function(timeDurationMs) {
    return d3.round(timeDuration * PX_PER_MS, 2);
};

var nextUpdateOverview = 0;

var liveTrackerInterval;

function updateOverview() {

}

function updateFrameLoads(selector, data) {
}

function updateSubframeLoads(selector, data) {
    var barHeight = 40;

    var zeroTimeMs = d3.min(data, function(d) { return d.start; });

    var timeline = d3.select(selector);

    var pageload = timeline.selectAll('g')
        .data(data)
        .enter().append('g')
        .attr('transform', function(d, i) { return 'translate(' + blockPosition(zeroTimeMs, d.start) + ',' + barHeight + ')'; });

    pageload.append('rect')
        .attr('width', 10)
        .attr('height', 10);
}

function timelineGenerator(selector, data) {
    var width     = 800,
        barHeight = 40;

    var zeroTimeMs = d3.min(data, function(d) { return d.start; });

//    var x = d3.scale.linear()
//        .domain([d3.min(data, function(d) { return d.start; }), d3.max(data, function(d) { return d.finish; })])
//        .range([0, width]);

    var timeline = d3.select(selector);
        // .attr('width', width)
        // .attr('height', );

    var pageload = timeline.selectAll('g')
        .data(data)
          .enter().append('g')
        .attr('transform', function(d, i) { return 'translate(' + blockPosition(zeroTimeMs, d.start) + ',0)'; });

    pageload.append('rect')
        .attr('width', function(d) { return (d.finish - d.start) / 5; })
        .attr('height', barHeight);

    pageload.append('text')
        .attr('x', 0)
        .attr('y', barHeight / 2)
        .attr('dy', '.35em')
        .text(function(d) { return d.hostname + " time: " + (d.finish - d.start) + "ms"; });
};

function updateTable(data) {
    var template = $('#pageload-row-template').html();
    Mustache.parse(template);
    var rendered = Mustache.render(template, { pageloads: data });
    $('#pageloadTable').html(rendered);
}

// function updateTable(data) {
    // var source = $('#pageload-row-template').html();
    // var template = Handlebars.compile(source);
    // var context = { pageloads: [1, 2, 3] };

    // $('#pageloadTable').html(template(context));
// }


// if (!chrome.cookies) {
    // chrome.cookies = chrome.experimental.cookies;
// }

// // A simple Timer class.
// function Timer() {
    // this.start_ = new Date();

    // this.elapsed = function() {
        // return (new Date()) - this.start_;
    // }

    // this.reset = function() {
        // this.start_ = new Date();
    // }
// }

// // Compares cookies for "key" (name, domain, etc.) equality, but not "value"
// // equality.
// function cookieMatch(c1, c2) {
    // return (c1.name == c2.name) && (c1.domain == c2.domain) &&
        // (c1.hostOnly == c2.hostOnly) && (c1.path == c2.path) &&
        // (c1.secure == c2.secure) && (c1.httpOnly == c2.httpOnly) &&
        // (c1.session == c2.session) && (c1.storeId == c2.storeId);
// }

// // Returns an array of sorted keys from an associative array.
// function sortedKeys(array) {
    // var keys = [];
    // for (var i in array) {
        // keys.push(i);
    // }
    // keys.sort();
    // return keys;
// }

// // Shorthand for document.querySelector.
// function select(selector) {
    // return document.querySelector(selector);
// }

// // An object used for caching data about the browser's cookies, which we update
// // as notifications come in.
// function CookieCache() {
    // this.cookies_ = {};

    // this.reset = function() {
        // this.cookies_ = {};
    // }

    // this.add = function(cookie) {
        // var domain = cookie.domain;
        // if (!this.cookies_[domain]) {
            // this.cookies_[domain] = [];
        // }
        // this.cookies_[domain].push(cookie);
    // };

    // this.remove = function(cookie) {
        // var domain = cookie.domain;
        // if (this.cookies_[domain]) {
            // var i = 0;
            // while (i < this.cookies_[domain].length) {
                // if (cookieMatch(this.cookies_[domain][i], cookie)) {
                    // this.cookies_[domain].splice(i, 1);
                // } else {
                    // i++;
                // }
            // }
            // if (this.cookies_[domain].length == 0) {
                // delete this.cookies_[domain];
            // }
        // }
    // };

    // // Returns a sorted list of cookie domains that match |filter|. If |filter| is
    // //  null, returns all domains.
    // this.getDomains = function(filter) {
        // var result = [];
        // sortedKeys(this.cookies_).forEach(function(domain) {
            // if (!filter || domain.indexOf(filter) != -1) {
                // result.push(domain);
            // }
        // });
        // return result;
    // }

    // this.getCookies = function(domain) {
        // return this.cookies_[domain];
    // };
// }


// var cache = new CookieCache();


// function removeAllForFilter() {
    // var filter = select("#filter").value;
    // var timer = new Timer();
    // cache.getDomains(filter).forEach(function(domain) {
        // removeCookiesForDomain(domain);
    // });
// }

// function removeAll() {
    // var all_cookies = [];
    // cache.getDomains().forEach(function(domain) {
        // cache.getCookies(domain).forEach(function(cookie) {
            // all_cookies.push(cookie);
        // });
    // });
    // cache.reset();
    // var count = all_cookies.length;
    // var timer = new Timer();
    // for (var i = 0; i < count; i++) {
        // removeCookie(all_cookies[i]);
    // }
    // timer.reset();
    // chrome.cookies.getAll({}, function(cookies) {
        // for (var i in cookies) {
            // cache.add(cookies[i]);
            // removeCookie(cookies[i]);
        // }
    // });
// }

// function removeCookie(cookie) {
    // var url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain +
        // cookie.path;
    // chrome.cookies.remove({"url": url, "name": cookie.name});
// }

// function removeCookiesForDomain(domain) {
    // var timer = new Timer();
    // cache.getCookies(domain).forEach(function(cookie) {
        // removeCookie(cookie);
    // });
// }

// function resetTable() {
    // var table = select("#cookies");
    // while (table.rows.length > 1) {
        // table.deleteRow(table.rows.length - 1);
    // }
// }

// var reload_scheduled = false;

// function scheduleReloadCookieTable() {
    // if (!reload_scheduled) {
        // reload_scheduled = true;
        // setTimeout(reloadCookieTable, 250);
    // }
// }

// function reloadCookieTable() {
    // reload_scheduled = false;

    // var filter = select("#filter").value;

    // var domains = cache.getDomains(filter);

    // select("#filter_count").innerText = domains.length;
    // select("#total_count").innerText = cache.getDomains().length;

    // select("#delete_all_button").innerHTML = "";
    // if (domains.length) {
        // var button = document.createElement("button");
        // button.onclick = removeAllForFilter;
        // button.innerText = "delete all " + domains.length;
        // select("#delete_all_button").appendChild(button);
    // }

    // resetTable();
    // var table = select("#cookies");

    // domains.forEach(function(domain) {
        // var cookies = cache.getCookies(domain);
        // var row = table.insertRow(-1);
        // row.insertCell(-1).innerText = domain;
        // var cell = row.insertCell(-1);
        // cell.innerText = cookies.length;
        // cell.setAttribute("class", "cookie_count");

        // var button = document.createElement("button");
        // button.innerText = "delete";
        // button.onclick = (function(dom){
            // return function() {
                // removeCookiesForDomain(dom);
            // };
        // }(domain));
        // var cell = row.insertCell(-1);
        // cell.appendChild(button);
        // cell.setAttribute("class", "button");
    // });
// }

// function focusFilter() {
    // select("#filter").focus();
// }

// function resetFilter() {
    // var filter = select("#filter");
    // filter.focus();
    // if (filter.value.length > 0) {
        // filter.value = "";
        // reloadCookieTable();
    // }
// }

// var ESCAPE_KEY = 27;
// window.onkeydown = function(event) {
    // if (event.keyCode == ESCAPE_KEY) {
        // resetFilter();
    // }
// }

// function listener(info) {
    // cache.remove(info.cookie);
    // if (!info.removed) {
        // cache.add(info.cookie);
    // }
    // scheduleReloadCookieTable();
// }

// function startListening() {
    // chrome.cookies.onChanged.addListener(listener);
// }

// function stopListening() {
    // chrome.cookies.onChanged.removeListener(listener);
// }

function updateLiveTracker() {    
    var liveTracker=$('#liveMonitor');
    
    
}

function main() {

    // Configure log levels.
    Logger.useDefaults();
    Logger.setLevel(Logger.WARN);
    
    trackerLogger.setLevel(Logger.DEBUG);
    

    // Timeline Stuff.
    
    // The live tracker updates itself at 30Hz.
    liveTrackerInterval = setInterval(updateLiveTracker, 33);

    // Read all timeline data from LocalStorage.
    chrome.storage.local.get(null, function(item) {
        allData = _.values(item);

        // Callback soup begins.
        // timelineGenerator('svg#liveTimeline', _.sortBy(_.filter(allData, { 'type': 'timestamp', 'topFrame': true }), 'start'));

        // updateSubframeLoads('svg#liveTimeline', _.sortBy(_.filter(allData, { 'type': 'timestamp', 'topFrame': false }), 'start'));

        updateTable(_.sortBy(_.filter(allData, { 'type': 'pageLoad', 'topFrame': true }), 'start'));
    });

    // Register for update event messages from the CookieMonitor extension.
    //
    // The objects are added to Local Storage by the extension already, and
    // can simply be pushed into the allData array (and a screen redraw can
    // be ordered).
    chrome.runtime.onConnect.addListener(function (port) {
        console.assert(port.name == "CookieMonitor");
        port.onMessage.addListener(function (message) {
            // Check that the message is the kind of data object we're expecting.
            // allData.push(message);
        });
    });


    // // Cookie Stuff.

    // focusFilter();
    // var timer = new Timer();
    // chrome.cookies.getAll({}, function(cookies) {
        // startListening();
        // start = new Date();
        // for (var i in cookies) {
            // cache.add(cookies[i]);
        // }
        // timer.reset();
        // reloadCookieTable();
    // });

}

document.addEventListener('DOMContentLoaded', function() {
    main();
    // document.body.addEventListener('click', focusFilter);
    // document.querySelector('#remove_button').addEventListener('click', removeAll);
    // document.querySelector('#filter_div input').addEventListener(
        // 'input', reloadCookieTable);
    // document.querySelector('#filter_div button').addEventListener(
        // 'click', resetFilter);
});
