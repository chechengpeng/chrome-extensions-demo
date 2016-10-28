/**
 * Created by che on 2016/10/25.
 */
var sites = 'abc',tabId = '';
chrome.browserAction.onClicked.addListener(function(tab) {
  var viewTabUrl = chrome.extension.getURL('popup.html');
  var views = chrome.extension.getViews();
  console.log(views);
  console.log(viewTabUrl);
  if(views[0].location.href == viewTabUrl){
    views[0].setSites(sites);
  }
  chrome.tabs.create({url:"popup.html"});
});

chrome.tabs.onCreated.addListener(function(tab){
  //sites = tab.url+'-'+sites;
});

chrome.tabs.onActivated.addListener(function (tab){
  chrome.tabs.get(tab.tabId, function(tab){
    sites = tab.url+'<br>'+sites;
  })
});


