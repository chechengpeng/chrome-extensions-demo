function httpRequest(url, callback){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      callback(xhr.responseText);
    }
  };
  xhr.send();
}


document.addEventListener('DOMContentLoaded', function() {
  httpRequest('http://1212.ip138.com/ic.asp',function(res){
    document.getElementById('show').innerHTML = res;
  });
});