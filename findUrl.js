'use strict';
/**
 * Created by che on 2016/10/25.
 */
/*
function getTabUrl(){
  var queryInfo = {
    url:'https://!*.zhihu.com/'
  },sites = 'abc';
  chrome.tabs.onCreated.addListener(function(tab){
      sites = tab.id + sites;
  });
  document.getElementById('show').innerHTML = sites;


  /!*
   * 获取当前打开的tab页的url
  chrome.tabs.query({}, function(tabs) {
    for(var i=0;i<tabs.length;i++){
      sites = tabs[i].url +'<br>'+sites;
    }
    document.getElementById('show').innerHTML = sites;
  })*!/
}

document.addEventListener('DOMContentLoaded', function() {
  getTabUrl();
});*/

function setSites(sites){
  document.getElementById('show').innerHTML = sites;
}
