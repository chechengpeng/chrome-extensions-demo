document.addEventListener('DOMContentLoaded', function () {
  var urlArr = []; //书签栏所有书签的的url和title
  var arr = []; //历史记录中所有的url和title
  var neverArr = []; // 书签栏url没有出现在历史记录中的
  var initPage = 1, last, nums = 25;// initPage当前页，last总页数，nums每页显示的记录数
  var ele_page = document.getElementById('page'); // 分页按钮组
  var remArr = []; // 选择的想要删除和移动的书签数组
  var pos = {}; //书签所在的文件夹位置
  var items = document.getElementsByName('url');//获取checkbox
  var selectAll = document.getElementById('selectAll'); //全选
  var selectInvert = document.getElementById('selectInvert'); //反选
  var remove = document.getElementById('remove'); //删除书签
  var removeHis = document.getElementById('removeHis'); //删除历史记录
  var move = document.getElementById('move'); //移动书签
  var moveHis = document.getElementById('moveHis'); //移动历史记录
  show();//初始化页面显示内容
  function show() {
    chrome.history.search({
      text: '',
      startTime: 0,
      endTime: new Date().getTime(),
      maxResults: 0  //设置为0可以拿到所有的url地址
    }, function (historyItemArray) {

      chrome.bookmarks.getTree(function (bookmarkArray) {
        historyItemArray.sort(function(a,b){
          return b.visitCount - a.visitCount;
        });
        getAllBookMarksUrl(bookmarkArray);
        neverArr = historyItemArray;
        //neverArr = historyItemArray.slice(0,20);
        for(var i=0;i<neverArr.length;i++){
          neverArr[i].title = neverArr[i].title || '（空标题）';
          // 判断是否收藏并显示其位置
          for(var m = 0;m < urlArr.length;m++){
            if(neverArr[i].url.slice(neverArr[i].url.indexOf(':')) == urlArr[m].url.slice(urlArr[m].url.indexOf(':'))){
              neverArr[i].pos = urlArr[m].pos;
              break;
            }else{
              neverArr[i].pos = '（未收藏）'
            }
          }
          // 消除 http-->https 的影响，选择最大数展示
          for(var j=i+1;j<neverArr.length;j++){
            if(neverArr[i].url.slice(neverArr[i].url.indexOf(':')) == neverArr[j].url.slice(neverArr[j].url.indexOf(':'))){
              if(neverArr[i].visitCount > neverArr[j].visitCount){
                neverArr[j].urlFlag = true;
              }
            }
          }
        }
        var trueList = [];
        for(var k=0;k<neverArr.length;k++){
          if(neverArr[k].urlFlag != true){
            trueList.push(neverArr[k]);
          }
        }

        neverArr = trueList;
        changeShow();
        ele_page.addEventListener('click', pageGo); //ele_page 有内容了给其注册事件
        pageChange();
      });

    });
  }
  //全选按钮
  selectAll.addEventListener('click', function () {
    for(var i in items){
      if(items.hasOwnProperty(i)){
        items[i].checked = true;
      }
    }

  });

  //反选按钮
  selectInvert.addEventListener('click', function () {
    for(var i in items){
      if(items.hasOwnProperty(i)){
        items[i].checked = !items[i].checked;
      }
    }

  });

  //删除书签
  remove.addEventListener('click', function () {
    remArr = [];
    for(var i in items){
      if(items.hasOwnProperty(i)){
        if(items[i].checked){
          remArr.push(items[i]);
        }
      }
    }
    if(remArr.length>0){
      if (confirm("确定删除吗？")) {
        for(var m=0;m<remArr.length;m++){
          chrome.bookmarks.remove(remArr[m].id);
          removeEle(remArr[m].id);
        }
        changeShow();
        pageChange();
      }
    }
  });
  //删除历史记录
  removeHis.addEventListener('click', function () {
    remArr = [];
    for(var i in items){
      if(items.hasOwnProperty(i)){
        if(items[i].checked){
          remArr.push(items[i]);
        }
      }
    }
    console.log(remArr);
    if(remArr.length>0){
      if (confirm("确定删除吗？")) {
        for(var m=0;m<remArr.length;m++){
          chrome.history.deleteUrl({url: remArr[m].dataset['url']});
          removeEle(remArr[m].id);
        }
        changeShow();
        pageChange();
      }
    }
  });

  //移动书签
  move.addEventListener('click', function(){
    remArr = [];
    for(var i in items){
      if(items.hasOwnProperty(i)){
        if(items[i].checked){
          remArr.push(items[i]);
        }
      }
    }
    console.log(remArr);
    if(remArr.length>0){
      if (confirm("确定移到新文件夹吗？")) {
        var markId = localStorage.newBookmarkId;
        // 如果存在这个新建文件夹就直接移到此文件夹，否则再新建一个
        if(pos.hasOwnProperty(markId)){
          for(var m=0;m<remArr.length;m++){
            chrome.bookmarks.move(remArr[m].id,{parentId:markId,index:0});
            removeEle(remArr[m].id);
          }
          changeShow();
          pageChange();
        }else {
          makeNewBookmark();
        }
      }
    }
  });

  //移动历史记录
  moveHis.addEventListener('click', function(){
    remArr = [];//清空
    for(var i in items){
      if(items.hasOwnProperty(i)){
        if(items[i].checked){
          remArr.push(items[i]);
        }
      }
    }
    console.log(remArr);
    if(remArr.length>0){
      if (confirm("确定添加到常用文件夹吗？")) {
        var markIdHis = localStorage.newBookmarkIdHis;
        // 如果存在这个新建文件夹就直接移到此文件夹，否则再新建一个
        if(pos.hasOwnProperty(markIdHis)){
          for(var m=0;m<remArr.length;m++){
            chrome.bookmarks.create({
              parentId:markIdHis,
              url: remArr[m].dataset['url'],
              title: remArr[m].value
            });
            removeEle(remArr[m].id);
          }
          changeShow();
          pageChange();
        }else {
          var newBookmark = { parentId:'1',title:'常用',index:0 };
          chrome.bookmarks.create(newBookmark,function(result){
            localStorage.newBookmarkIdHis = result.id;
            pos[result.id] = '-->书签栏-->常用'; //更新pos对象
            for(var m=0;m<remArr.length;m++){
              chrome.bookmarks.create({
                parentId:result.id,
                url: remArr[m].dataset['url'],
                title: remArr[m].value
              });
              removeEle(remArr[m].id);
            }
            changeShow();
            pageChange();
          });
        }
      }
    }
  });

  // 从neverArr中移除要移动或删除的书签
  function removeEle(ele){
    for(var i=0;i<neverArr.length;i++){
      if(neverArr[i].id == ele){
        neverArr.splice(i,1);
        return true;
      }
    }
  }

  // 新建不常用书签文件夹
  function makeNewBookmark(){
    var newBookmark = { parentId:'1',title:'不常用',index:0 };
    chrome.bookmarks.create(newBookmark,function(result){
      localStorage.newBookmarkId = result.id;
      pos[result.id] = '-->书签栏-->不常用'; //更新pos对象
      for(var m=0;m<remArr.length;m++){
        chrome.bookmarks.move(remArr[m].id,{parentId:result.id,index:0});
        neverArr.splice(remArr[m].value,1);
      }
      changeShow();
      pageChange();
    });
  }

  /**
   * 获取浏览器所有书签的title和所在位置
   * @param arr 子树
   */
  function getAllBookMarksUrl(arr) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].url) {
        urlArr.push({ url: arr[i].url, title: arr[i].title, id: arr[i].id, pos:(pos[arr[i].parentId]).slice(3) });
      }else{
        if(pos.hasOwnProperty(arr[i].parentId)){
          pos[arr[i].id] = pos[arr[i].parentId] +'-->'+ arr[i].title;
        }else{
          pos[arr[i].id] = arr[i].title;
        }
      }
      if (arr[i].children) {
        getAllBookMarksUrl(arr[i].children);
      }
    }
  }
  /**
   * 改变页码的时候，列值也变化，并且控制按钮的点击样式
   */
  function pageChange() {
    var text = '';
    for (var k = nums * (initPage - 1); k < nums * initPage; k++) {
      if (neverArr[k]) {
        text = text + '<li><input type="checkbox" name="url" id="' + neverArr[k].id + '" value="' + neverArr[k].title + '" data-url="' + neverArr[k].url + '"><span class="num">' + (k + 1) + '.</span><a class="title title-h" target="_blank" href="' + neverArr[k].url + '" title="' + neverArr[k].title + '">' + neverArr[k].title + '</a>' +
          '<span class="pos count" title="' + neverArr[k].visitCount + '">' + neverArr[k].visitCount + '</span><span class="pos pos-h" title="' + neverArr[k].pos + '">' + neverArr[k].pos + '</span></li>';
      }
    }
    var actLi = 'li_' + initPage;
    if (actLi) {
      changeActive(document.getElementById(actLi));
    }
    document.getElementById('show').innerHTML = text;
    if (initPage == 1) {
      if (document.getElementById('pre')) {
        document.getElementById('pre').className = 'disable';
      }
    } else if (initPage == last) {
      document.getElementById('next').className = 'disable';
    }
  }

  /**
   * 改变分页按钮的活动状态
   * @param li 所在页码的li
   */
  function changeActive(li) {
    var lis = ele_page.getElementsByTagName('li');
    if (lis.length == 1)return false;
    for (var i = 0; i < lis.length; i++) {
      lis[i].className = '';
    }
    li.className = 'active';
  }

  /**
   * 根据所点击li的 innerText 的值不同，执行不同的操作
   * @param e
   * @returns {boolean}
   */
  function pageGo(e) {
    e = e || window.event;
    var ind = e.target || e.srcElement;
    if (ind.localName == 'ul') { //如果点击区域没有聚焦在li上
      return false;
    }
    if (ind.innerText == '<') { //点击前一页的时候，如果当前是第一页，就不翻页了
      if (initPage == 1) {
        return false;
      } else {
        initPage = initPage - 1;
      }
    } else if (ind.innerText == '>') { //点击下一页的时候，如果当前是最后一页，就不翻页了
      if (initPage == last) {
        return false;
      } else {
        initPage = initPage + 1;
      }
    } else if (ind.innerText == '...') {
      return false;
    } else {
      initPage = parseInt(ind.innerText);
    }
    changeShow();
    pageChange();
  }

  /**
   * 根据initPage,last的值来确定分页按钮的显示样式
   * @returns {number}
   */
  function changeShow() {
    last = Math.ceil(neverArr.length / nums);
    var pageList = '<li id="pre">&lt;</li><li id="li_1" class="active">1</li>';
    if (last < 6) {
      if (last == 1) {
        pageList = '<li id="li_1" class="active only">1</li>';
        ele_page.innerHTML = pageList;
        return 1;
      }
      for (var i = 2; i < last; i++) {
        pageList = pageList + '<li id="li_' + i + '">' + i + '</li>';
      }
    } else {
      if (initPage == 1) {
        pageList = pageList + '<li id="li_2">2</li><li>...</li>';
      } else if (initPage == last) {
        pageList = pageList + '<li>...</li><li id="li_' + (last - 1) + '">' + (last - 1) + '</li>';
      } else {
        var l;
        if (initPage - 1 - 1 <= 2 && last - 1 - initPage > 2) {
          for (l = 2; l < initPage + 2; l++) {
            pageList = pageList + '<li id="li_' + l + '">' + l + '</li>';
          }
          pageList += '<li>...</li>';
        } else if (initPage - 1 - 1 > 2 && last - 1 - initPage <= 2) {
          pageList += '<li>...</li>';
          for (l = initPage - 1; l < last; l++) {
            pageList = pageList + '<li id="li_' + l + '">' + l + '</li>';
          }
        } else if (initPage - 1 - 1 <= 2 && last - 1 - initPage <= 2) {
          for (l = 2; l < last; l++) {
            pageList = pageList + '<li id="li_' + l + '">' + l + '</li>';
          }
        } else {
          pageList += '<li>...</li>';
          for (l = initPage - 1; l < initPage + 2; l++) {
            pageList = pageList + '<li id="li_' + l + '">' + l + '</li>';
          }
          pageList += '<li>...</li>';
        }
      }
    }
    pageList = pageList + '<li id="li_' + last + '">' + last + '</li><li id="next">&gt;</li>';
    ele_page.innerHTML = pageList;
  }
});


