
// 什么时候用DOMContentLoaded,为什么不用，有时候显示不出内容
document.addEventListener('DOMContentLoaded', function () {
  var text = '';
  var pageList = '<li id="pre">&lt;</li>';
  var len = 80;
  var page = Math.ceil(len / 20);
  var initPage = 1;
  var first = 1;
  var last = page;
  if (last < 5) {
    for (var l = 1; l < page + 1; l++) {
      pageList = pageList + '<li id="li_' + l + '">' + l + '</li>';
    }
  } else {
    if (first == 1) {
      for (var j = first; j < first + 3; l++) {
        pageList = pageList + '<li>' + j + '</li>';
      }
    } else if (first > 1 && first < last) {

    }
    pageList += '<li>...</li><li>' + last + '</li>';
  }

  pageList = pageList + '<li id="next">&gt;</li>';

  document.getElementById('page').innerHTML = pageList;

  var ele_page = document.getElementById('page');
  ele_page.addEventListener('click', pageGo);
  function pageGo(){
    var ev =  window.event;
    var ind = ev.target || ev.srcElement;
    console.log(ind.innerText);
    if(ind.innerText == '<'){ //点击前一页的时候，如果当前是第一页，就不翻页了
      if(initPage == 1){
        return false;
      }else{
        initPage = initPage - 1;
      }
    }else if(ind.innerText == '>'){ //点击下一页的时候，如果当前是最后一页，就不翻页了
      if(initPage == 4){
        return false;
      }else{
        initPage = initPage + 1;
      }
    }else{
      initPage = parseInt(ind.innerText);
    }
    pageChange();
  }

  function pageChange(){
    text = '';
    for (var k = (initPage-1)*20+1; k < 1 +(initPage*20); k++) {
      text = text + '<li><span class="title"><span class="num">' + k + '</li>';
    }
    var actLi = 'li_'+initPage;
    changeActive(document.getElementById(actLi));
    document.getElementById('show').innerHTML = text;
    if(initPage == 1) {
      document.getElementById('pre').className = 'disable';
    }else if(initPage == 4){
      document.getElementById('next').className = 'disable';
    }
  }

  /**
   * 改变分页按钮的活动状态
   * @param li 所在页码的li
   */
  function changeActive(li){
    var lis = ele_page.getElementsByTagName('li');
    for( var i=0;i<lis.length;i++){
      lis[i].className = '';
    }
    li.className = 'active';
  }
  pageChange();

});

