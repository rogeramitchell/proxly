!function(){var e={Etag:1,"Last-Modified":1,"Content-Length":1,"Content-Type":1},t={},o={},n={},a={},s=1e3,r=!1,i={html:1,css:1,js:1},c={heartbeat:function(){document.body&&(r||c.loadresources(),c.checkForChanges()),setTimeout(c.heartbeat,s)},loadresources:function(){function e(e){var t=document.location,o=new RegExp("^\\.|^/(?!/)|^[\\w]((?!://).)*$|"+t.protocol+"//"+t.host);return e.match(o)}for(var o=document.getElementsByTagName("script"),a=document.getElementsByTagName("link"),s=[],l=0;l<o.length;l++){var d=o[l],u=d.getAttribute("src");if(u&&e(u)&&s.push(u),u&&u.match(/\blive.js#/)){for(var h in i)i[h]=null!=u.match("[#,|]"+h);u.match("notify")}}i.js||(s=[]),i.html&&s.push(document.location.href);for(var l=0;l<a.length&&i.css;l++){var m=a[l],f=m.getAttribute("rel"),v=m.getAttribute("href",2);v&&f&&f.match(new RegExp("stylesheet","i"))&&e(v)&&(s.push(v),n[v]=m)}for(var l=0;l<s.length;l++){var g=s[l];c.getHead(g,function(e,o){t[e]=o})}var p=document.getElementsByTagName("head")[0],w=document.createElement("style"),y="transition: all .3s ease-out;";css=[".livejs-loading * { ",y," -webkit-",y,"-moz-",y,"-o-",y,"}"].join(""),w.setAttribute("type","text/css"),p.appendChild(w),w.styleSheet?w.styleSheet.cssText=css:w.appendChild(document.createTextNode(css)),r=!0},checkForChanges:function(){for(var e in t)o[e]||c.getHead(e,function(e,o){var n=t[e],a=!1;t[e]=o;for(var s in n){var r=n[s],i=o[s],l=o["Content-Type"];switch(s.toLowerCase()){case"etag":if(!i)break;default:a=r!=i}if(a){c.refreshResource(e,l);break}}})},refreshResource:function(e,t){var t=e.split(".")[e.split(".").length-1];switch(void 0==t&&(t=""),t.toLowerCase()){case"css":var o=n[e],s=document.body.parentNode,r=o.parentNode,i=o.nextSibling,l=document.createElement("link");s.className=s.className.replace(/\s*livejs\-loading/gi,"")+" livejs-loading",l.setAttribute("type","text/css"),l.setAttribute("rel","stylesheet"),l.setAttribute("href",e+"?now="+1*new Date),i?r.insertBefore(l,i):r.appendChild(l),n[e]=l,a[e]=o,c.removeoldLinkElements();break;case"html":if(e!=document.location.href)return;case"js":chrome.runtime.reload()}},removeoldLinkElements:function(){var e=0;for(var t in a){try{var o=n[t],s=a[t],r=document.body.parentNode,i=o.sheet||o.styleSheet,l=i.rules||i.cssRules;l.length>=0&&(s.parentNode.removeChild(s),delete a[t],setTimeout(function(){r.className=r.className.replace(/\s*livejs\-loading/gi,"")},100))}catch(d){e++}e&&setTimeout(c.removeoldLinkElements,50)}},getHead:function(t,n){o[t]=!0;var a=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XmlHttp");a.open("HEAD",t,!0),a.onreadystatechange=function(){if(delete o[t],4==a.readyState&&304!=a.status){a.getAllResponseHeaders();var s={};for(var r in e){var i=a.getResponseHeader(r);"etag"==r.toLowerCase()&&i&&(i=i.replace(/^W\//,"")),"content-type"==r.toLowerCase()&&i&&(i=i.replace(/^(.*?);.*?$/i,"$1")),s[r]=i}n(t,s)}},a.send()}};"file:"!=document.location.protocol?(window.liveJsLoaded||c.heartbeat(),window.liveJsLoaded=!0):window.console}();