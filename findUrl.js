'use strict';
/**
 * Created by che on 2016/10/25.
 */
function getTabUrl(){
  var queryInfo = {
    url:'https://*.zhihu.com/'
  };
  chrome.tabs.query(queryInfo, function(tabs) {
    if(tabs.length>0){
      document.getElementById('show').textContent = '你浏览器打开着知乎';
      console.log(tabs);
    }else{
      document.getElementById('show').textContent = '你没有看知乎';
    }
  })
}

document.addEventListener('DOMContentLoaded', function() {
  getTabUrl();
});