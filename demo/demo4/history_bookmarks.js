
var timeRange = new Date().getTime()-7*24*3600*1000;
search();
function search(){
  var urlArr = []; //书签栏所有书签的的url和title
  var arr = []; //历史记录中所有的url和title
  var neverArr = [];
  chrome.history.search({
    text: '',
    startTime: timeRange,
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
      console.log(urlArr);

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

        /*// 书签中的url在历史记录里能找到
         for(var j=0;j<arr.length;j++){
         if(urlArr[i].url == arr[j].url){
         neverArr.push(urlArr[i]);
         break;
         }
         }*/
      }
      console.log('na:%o',neverArr);
      var text = '';
      for(var k=0;k<neverArr.length;k++){
        text = '<ol><span class="title">'+neverArr[k].title+'</span><span class="url">'+neverArr[k].url+'</span></ol>' + text;
      }
      document.getElementById('show').innerHTML = text;
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


function time(t){
  switch (t){
    case 'week':
      timeRange = new Date().getTime()-7*24*3600*1000;
      break;
    case 'month':
      timeRange = new Date().getTime()-30*24*3600*1000;
      break;
    case 'three-month':
      timeRange = new Date().getTime()-90*24*3600*1000;
      break
    case 'year':
      timeRange = new Date().getTime()-90*24*3600*1000;
      break;
    case 'three-year':
      timeRange = new Date().getTime()-90*24*3600*1000;
      break;
  }
  search();
}

function unique(arr){
  return Array.from(new Set(arr));
}

document.addEventListener('DOMContentLoaded', function() {
  var week = document.getElementById('week');
  var month = document.getElementById('month');
  var threeMonth = document.getElementById('three-month');
  var year = document.getElementById('year');
  var threeYear = document.getElementById('three-year');
  // onClick's logic below:
  week.addEventListener('click', function() {
    time('week');
  });
  month.addEventListener('click', function() {
    time('month');
  });
  threeMonth.addEventListener('click', function() {
    time('three-month');
  });
  year.addEventListener('click', function() {
    time('year');
  });
  threeYear.addEventListener('click', function() {
    time('three-year');
  });
});

