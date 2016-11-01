
function getTime(el){
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  var ms = today.getMilliseconds();
  h = h<10 ? '0'+ h : h;
  m = m<10 ? '0'+ m : m;
  s = s<10 ? '0'+ s : s;
  el.innerHTML = h + ' : ' + m + ' : ' + s;
  setTimeout(function(){getTime(el)},1000);
  //setTimeout(getTime(el),1000);
}


document.addEventListener('DOMContentLoaded', function() {
  getTime(document.getElementById('show'));
});