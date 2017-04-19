'use strict';
/**
 * Created by che on 2016/11/2.
 */
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({url:"popup.html"});
});