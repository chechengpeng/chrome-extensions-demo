search();
function search(){
  var urlArr = []; //书签栏所有书签的的url和title
  var arr = []; //历史记录中所有的url和title
  var neverArr = [];
  chrome.history.search({
    text: '',
    startTime: 0,
    endTime: new Date().getTime(),
    maxResults: 0  //设置为0可以拿到所有的url地址
  }, function(historyItemArray){
    for(var i=0;i<historyItemArray.length;i++){
      arr.push({url: historyItemArray[i].url,title: historyItemArray[i].title });
    }
    console.log(arr);
    chrome.bookmarks.getTree(function(bookmarkArray){
      console.log(bookmarkArray);
      getAllBookMarksUrl(bookmarkArray);

      // 书签中的url在历史记录里找不到
      for(var i=0;i<urlArr.length;i++){
        var j=0;
        while(j<arr.length){
          if(urlArr[i].url == arr[j].url){
            break;
          }else{
            j++;
          }
        }
        if(j==arr.length){
          neverArr.push(urlArr[i]);
        }
      }
      var text = '';
      var pageList = '<li>&lt;</li>';
      var len = neverArr.length;
      console.log('len:',len);
      var page = Math.ceil(len/20);
      for(var k=0;k<20;k++){
        text = text + '<li><span class="title"><span class="num">'+ (k+1)+'</span>'+neverArr[k].title+'</span><span class="url">'+neverArr[k].url+'</span></li>' ;
      }

      var first = 1;
      var last = page;
      if(last<4){
        for(var l=1;l<page+1;l++){
          pageList = pageList + '<li>'+l+'</li>';
        }
      }else{
        if(first==1){
          for(var l=first;l<first+3;l++){
            pageList = pageList + '<li>'+l+'</li>';
          }
        }else if(first>1 && first<last){

        }
        pageList+='<li>...</li><li>'+last+'</li>';

      }

      pageList = pageList + '<li>&gt;</li>';
      document.getElementById('show').innerHTML = text;
      document.getElementById('page').innerHTML = pageList;
    });
  });
  function getAllBookMarksUrl(arr){
    for(var i=0;i<arr.length;i++){
      if(arr[i].url){
        urlArr.push({url: arr[i].url, title: arr[i].title});
      }
      if(arr[i].children){
        getAllBookMarksUrl(arr[i].children);
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {

});

