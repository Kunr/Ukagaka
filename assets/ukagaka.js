// Typing.js
// https://github.com/coffeedeveloper/typing.js
function Typing(opts){this.version="1.1";this.source=opts.source;this.output=opts.output;this.delay=opts.delay||120;this.chain={parent:null,dom:this.output,val:[]}}Typing.fn=Typing.prototype={toArray:function(eles){var result=[];for(var i=0;i<eles.length;i++){result.push(eles[i])}return result},init:function(){this.chain.val=this.convert(this.source,this.chain.val)},convert:function(dom,arr){var that=this,children=this.toArray(dom.childNodes);children.forEach(function(node){if(node.nodeType===3){arr=arr.concat(node.nodeValue.split(""))}else{if(node.nodeType===1){var val=[];val=that.convert(node,val);arr.push({"dom":node,"val":val})}}});return arr},print:function(dom,val,callback){setTimeout(function(){dom.appendChild(document.createTextNode(val));callback()},this.delay)},play:function(ele){if(!ele){return}if(!ele.val.length&&ele.parent){this.play(ele.parent)}if(!ele.val.length){return}var curr=ele.val.shift();var that=this;if(typeof curr==="string"){this.print(ele.dom,curr,function(){if(ele.val.length){that.play(ele)}else{if(ele.parent){that.play(ele.parent)}}})}else{var dom=document.createElement(curr.dom.nodeName);var attrs=that.toArray(curr.dom.attributes);attrs.forEach(function(attr){dom.setAttribute(attr.name,attr.value)});ele.dom.appendChild(dom);curr.parent=ele;curr.dom=dom;this.play(curr.val.length?curr:curr.parent)}},start:function(){this.init();this.play(this.chain)}};

var Lutachu = function(w, d) {
  if(!w.localStorage || !w.XMLHttpRequest) {
    return alert('请更新浏览器！');
  }

  a = function(d) {
    var a = document.querySelectorAll(d);

    if (a.length == 1)
      a = a[0];

    a.css = function(t) {
      if (!t || typeof t != 'string') return;

      if (t.substr(-1) == ';') {
        t = t.substr(0, t.length - 1);
      }

      if (a.length > 1) {
        for (var i = a.length - 1; i >= 0; i--) {
          a[i].style.cssText += (";" + t);
        };
      } else {
        a.style.cssText += (";" + t);
      }
    }

    return a;
  };

  /* Ajax From iToor.js */
  a.x = function(d) {
    return function(h, l, j, k, g) {
      if (typeof l == "function") {
        k = j;
        j = l;
        l = 0;
      }

      if (d[h]) {
        return j(d[h]);
      }
      
      (g = new XMLHttpRequest()).open(l ? "POST" :"GET", h, 1);
      !l || g.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      
      if (j || k) {
        g.onreadystatechange = function() {
          if (g.readyState == 4) {
            g.status > 199 && g.status < 301 || g.status == 304 ? j(d[h + (l || "")] = (g.getResponseHeader("Content-Type") || "").match(/json/) ? JSON.parse(g.responseText || "null") :g.responseText) :!k || k(g.status);
          }
        };
      }

      g.send(l || "");
      return g;
    };
  }({});

  a.stor = function(k, v) {
    return v ? localStorage[k] = v : localStorage[k];
  }

return a;
}(window, document);

function Ukagaka(data) {
  this.init(data);
}

Ukagaka.prototype = {
  data: {
    width: 160,
    height: 160,

    client: {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    },

    position: {
      x: 0,
      y: 0
    }
  },

  body: document.createElement('div'),

  init: function(data) {
    for (var d in data) {
      this.data[d] = data[d];
    }

    this.body.id = 'ukagaka';
    this.body.innerHTML = '<div class="ukagaka-character"></div><div class="ukagaka-chatlog"><div class="ukagaka-chatlog-source"></div><div class="ukagaka-chatlog-output"></div></div>';
    Lutachu('body').appendChild(this.body);

    // Set Face
    Lutachu('.ukagaka-character').css('background-image:url(' + data['character'][0] + ')');

    // Set Height & Width
    Lutachu('#ukagaka, .ukagaka-character').css('width:' + data['width'] + 'px;' + 'height:' + data['height'] + 'px');
    Lutachu('.ukagaka-chatlog').css('right:' + (+data['width'] + 10) + 'px');

    // Set Position
    this.data['position'] = JSON.parse(Lutachu.stor('ukagaka_position'));
    if (this.data['position']['x'] > 0) {
      this.body.style.left = this.data['position']['x'] + 'px';
    }

    if (this.data['position']['y'] > 0) {
      this.body.style.top = this.data['position']['y'] + 'px';
    }

    var self = this;
    Lutachu.x(this.data.api, function(data) {
      self.data['born'] = data['born'];
      self.data['notice'] = data['notice'];
      self.data['talk'] = [data['question'], data['answer']];
      self.data['food'] = [data['foods'], data['eatsay']];

      self.show('notice');
    });

    // Set Event
    this.event();
  },


  show: function(t) {
    switch (t) {
      case 'notice':
        this.type(this.data['notice']);
        break;

      case 'menu':
        break;

      case 'set':
        break;

      case 'talk':
        break;
    }
  },

  type: function(v) {
    Lutachu('.ukagaka-chatlog-source').innerHTML = v;
    Lutachu('.ukagaka-chatlog-output').innerHTML = '';

    var typing = new Typing({
      source: Lutachu('.ukagaka-chatlog-source'),
      output: Lutachu('.ukagaka-chatlog-output'),
      delay: 20
    });

    typing.start();
  },

  event: function() {
    var body = this.body;
    var moveX, moveY, moveTop, moveLeft, moveable;

    body.onmousedown = function() {
      moveable = true;
      moveX = window.event.clientX;
      moveY = window.event.clientY;

      moveTop  = parseInt(body.style.top) || ukagaka.body.offsetTop;
      moveLeft = parseInt(body.style.left) || ukagaka.body.offsetLeft;

      if (isFirefox = navigator.userAgent.indexOf("Firefox") > 0) {
        window.getSelection().removeAllRanges();
      }

      document.onmousemove = function() {
        if (moveable) {
          var x = moveLeft + window.event.clientX - moveX;
          var y = moveTop + window.event.clientY - moveY;

          body.style.left = x + 'px';
          body.style.top = y + 'px';
        }
      };

      document.onmouseup = function() {
        if (moveable) {
          Lutachu.stor('ukagaka_position', JSON.stringify({x: body.style.left.replace('px', ''), y: body.style.top.replace('px', '')}));
          moveable = false;
          moveX = moveY = moveTop = moveLeft = 0;
        }
      }
    };
  }
};

/*
var smjq = jQuery;
var _typei = 0;
var weichuncai_text = '';
smjq(document).ready(function(){
  var getwidth = getCookie("historywidth");
  var getheight = getCookie("historyheight");
  if(getwidth != null && getheight != null){
  	var width = getwidth;
  	var height = getheight;
  }else{
  	var width = document.documentElement.clientWidth- 200 - imagewidth;
  	var height = document.documentElement.clientHeight- 180 - imageheight;
  	if(parseInt(height) > 2000) {
    var height = smjq(window).height() - 180 - imageheight;
  	}
  }

  var cwidth = document.documentElement.clientWidth-100;
  var cheight = document.documentElement.clientHeight-20;
  //var height = document.body.clientHeight-200;
  var moveX = 0;
  var moveY = 0;
  var moveTop = 0;
  var moveLeft = 0;
  var moveable = false;
  var docMouseMoveEvent = document.onmousemove;
  var docMouseUpEvent = document.onmouseup;

  smjq("body").append('<div id="smchuncai" onfocus="this.blur();" style="color:#626262;z-index:999;"><div id="chuncaiface"></div><div id="dialog_chat"><div id="chat_top"></div><div id="dialog_chat_contents"><div id="dialog_chat_loading"></div><div id="tempsaying"></div><div id="showchuncaimenu"><ul class="wcc_mlist" id="shownotice">显示公告</ul><ul class="wcc_mlist" id="chatTochuncai">聊&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;天</ul><ul class="wcc_mlist" id="foods">吃 零 食</ul><ul class="wcc_mlist" id="lifetimechuncai">生存时间</ul><ul class="wcc_mlist" id="closechuncai">关闭春菜</ul></div><div><ul id="chuncaisaying"></ul></div><div id="getmenu"> </div></div><div id="chat_bottom"></div></div></div>');
  smjq("#smchuncai").append('<div id="addinput"><div id="inp_l"><input id="talk" type="text" name="mastersay" onkeydown="if(event.keyCode==13){submitTalk(this);}" value="" /> <input id="talkto" type="button" value=" " /></div><div id="inp_r"> X </div></div>');
  smjq("body").append('<div id="callchuncai">召唤春菜</div>');
  //判断春菜是否处于隐藏状态
  var is_closechuncai = getCookie("is_closechuncai");
  if(is_closechuncai == 'close'){
  	closechuncai_init();
  }
  //设置初始状态
  getdata("getnotice");
  setFace(1);

  smjq("#smchuncai").css('left', width+'px');
  smjq("#smchuncai").css('top', height+'px');
  smjq("#smchuncai").css('width', imagewidth+'px');
  smjq("#smchuncai").css('height', imageheight+'px');
  smjq("#callchuncai").attr("style", "top:"+cheight+"px; left:"+cwidth+"px; text-align:center;");

  smcc = document.getElementById("smchuncai");
  smcc.onmousedown = function(){
  	var ent = event;
  	moveable = true;
  	moveX = ent.clientX;
  	moveY = ent.clientY;
  	var obj = document.getElementById("smchuncai");
  	moveTop = parseInt(obj.style.top);
  	moveLeft = parseInt(obj.style.left);
  	if(isFirefox=navigator.userAgent.indexOf("Firefox")>0){
    window.getSelection().removeAllRanges();
  	}  	
  	document.onmousemove = function(){
    if(moveable){
    	var ent = event;
    	var x = moveLeft + ent.clientX - moveX;
    	var y = moveTop + ent.clientY - moveY;
    	var w = 200;
    	var h = 200;	//w,h为浮层宽高
    	obj.style.left = x + "px";
    	obj.style.top = y + "px";
    }
  	};
  	document.onmouseup = function(){
    if(moveable){
    	var historywidth = obj.style.left;
    	var historyheight = obj.style.top;
    	historywidth = historywidth.replace('px', '');
    	historyheight = historyheight.replace('px', '');
    	setCookie("historywidth", historywidth, 60*60*24*30*1000);
    	setCookie("historyheight", historyheight, 60*60*24*30*1000);
    	document.onmousemove = docMouseMoveEvent;
    	document.onmouseup = docMouseUpEvent;
    	moveable = false; 
    	moveX = 0;
    	moveY = 0;
    	moveTop = 0;
    	moveLeft = 0;
    }
  	}
  };
  smjq("#getmenu").click(function(){
    chuncaiMenu();
    setFace(1);
    });
  smjq("#shownotice").click(function(){
    getdata("getnotice");
                                setFace(1);
  });
  smjq("#closechuncai").click(function(){
    setFace(3);
    closechuncai();
    });
  smjq("#callchuncai").click(function(){
    setFace(2);
    callchuncai();
    setCookie("is_closechuncai", '', 60*60*24*30*1000);
    });
  smjq("#shownotice").click(function(){
    setFace(1);
    closeChuncaiMenu();
    });
  smjq("#lifetimechuncai").click(function(){
    closeChuncaiMenu();
    closeNotice();
    setFace(2);
    getdata('showlifetime');
    });
  smjq("#chatTochuncai").click(function(){
    showInput();
    });
  smjq("#inp_r").click(function(){
    closeInput();
    chuncaiSay('不聊天了吗？(→_→)');
    setFace(3);
    });
  smjq("#talkto").click(function(){
    getdata("talking");
    });
  smjq("#foods").click(function(){
    closeChuncaiMenu();
    closeNotice();
    getdata("foods");
    });
  smjq("#showchuncaimenu").hover(function(){
    },function(){
    smjq("#showchuncaimenu").slideUp('slow').show();
    });
  document.onmousemove = function(){
  	stoptime();
  	tol = 0;
  	setTime();
  	//chuncaiSay("啊，野生的主人出现了！ ～～～O口O");
  }
  talkSelf(talktime);
  document.getElementById("smchuncai").onmouseover = function(){
  	if(talkobj){
    clearTimeout(talkobj);
  	}
  	talktime = 0;
  	talkSelf(talktime);
  }
  });

function getEvent() {
	return window.event || arguments.callee.caller.arguments[0];
}

var eattimes = 0;
function eatfood(obj){
	var gettimes = getCookie("eattimes");
	if(parseInt(gettimes) > parseInt(9)){
  chuncaiSay("主人是个大混蛋！！");
  setFace(3);
  closechuncai_evil();
	}else if(parseInt(gettimes) > parseInt(7)){
  chuncaiSay(".....................肚子要炸了，死也不要再吃了～～！！！TAT");
  setFace(3);
	}else if(parseInt(gettimes) == parseInt(5)){
  chuncaiSay("我已经吃饱了，不要再吃啦......");
  setFace(3);
	}else if(parseInt(gettimes) == parseInt(3)){
  chuncaiSay("多谢款待，我吃饱啦～～～ ╰（￣▽￣）╭");
  setFace(2);
	}else{
  var id = obj.replace("f",'');
  getdata('eatsay', id);
	}
	eattimes++;
	setCookie("eattimes", eattimes, 60*10*1000);
}
function chuncaiMenu(){
	//smjq("#showchuncaimenu").slideDown('fast').show();
	clearChuncaiSay();
	closeInput();
	chuncaiSay("准备做什么呢？");
	smjq("#showchuncaimenu").css("display", "block");
	smjq("#getmenu").css("display", "none");
	smjq("#chuncaisaying").css("display", "none");
}
function closeChuncaiMenu(){
	clearChuncaiSay();
	smjq("#showchuncaimenu").css("display", "none");
	//smjq("#chuncaisaying").css("display", "block");
	showNotice();
	smjq("#getmenu").css("display", "block");
}
function showNotice(){
	smjq("#chuncaisaying").css("display", "block");
}
function closechuncai(){
	stopTalkSelf();
	chuncaiSay("记得再叫我出来哦...");
	smjq("#showchuncaimenu").css("display", "none");
	setTimeout(function(){
  	smjq("#smchuncai").fadeOut(1200);
  	smjq("#callchuncai").css("display", "block");}, 2000);
	//保存关闭状态的春菜
	setCookie("is_closechuncai", 'close', 60*60*24*30*1000);
}
function closechuncai_evil(){
	stopTalkSelf();
	smjq("#showchuncaimenu").css("display", "none");
	setTimeout(function(){
  	smjq("#smchuncai").fadeOut(1200);
  	smjq("#callchuncai").css("display", "block");}, 2000);
}
function closechuncai_init(){
	stopTalkSelf();
	smjq("#showchuncaimenu").css("display", "none");
	setTimeout(function(){
  	smjq("#smchuncai").css("display", "none");
  	smjq("#callchuncai").css("display", "block");}, 30);
}
function callchuncai(){
	talkSelf(talktime);
	smjq("#smchuncai").fadeIn('normal');
	smjq("#callchuncai").css("display", "none");
	closeChuncaiMenu();
	closeNotice();
	chuncaiSay("我回来啦～");
	setCookie("is_closechuncai", '', 60*60*24*30*1000);
}

function chuncaiSay(s){
	clearChuncaiSay();
	smjq("#tempsaying").append(s);
	smjq("#tempsaying").css("display", "block");
	weichuncai_text = s;
	typeWords();
}
function clearChuncaiSay(){
	document.getElementById("tempsaying").innerHTML = '';
}
function closeNotice(){
	smjq("#chuncaisaying").css("display", "none");
}
function showInput(){
	closeChuncaiMenu();
	closeNotice();
	chuncaiSay("............?");
	//setFace(1);
	smjq("#addinput").css("display", "block");
}
function closeInput(){
	setFace(3);
	smjq("#addinput").css("display", "none");
}
function clearInput(){
	document.getElementById("talk").value = '';
}
function createFace(a, b, c){
	smjq("head").append('<div id="hiddenfaces"><img id="hf1" src="'+a+'" /><img id="hf2" src="'+b+'" /><img id="hf3" src="'+c+'" /></div>');
	setFace(1);
}
function setFace(num){
	obj = document.getElementById("hf"+num).src;
	smjq("#chuncaiface").attr("style", "background:url("+obj+") no-repeat scroll 50% 0% transparent; width:"+imagewidth+"px;height:"+imageheight+"px;");
}
function getdata(el, id){
	smjq.ajax({
  type:	'GET',
  url:	actionurl,
  cache:	'false',
  dataType: 'html',
  contentType: 'application/json; charset=utf8',
  beforeSend: function(){
  	//smjq("#dialog_chat").fadeOut("normal");
  	smjq("#tempsaying").css('display', "none");
  	smjq("#dialog_chat_loading").fadeIn("normal");
  },
  success: function(data){
  	smjq("#dialog_chat_loading").css('display', "none");
  	//smjq("#dialog_chat").fadeIn("normal");
  	smjq("#tempsaying").css('display', "");
  	var dat = eval("("+data+")");
  	if(el == 'defaultccs'){
    chuncaiSay(dat.defaultccs);
  	}else if(el == 'getnotice'){
    chuncaiSay(dat.notice);
    setFace(1);
  	}else if(el == 'showlifetime'){
    chuncaiSay(dat.showlifetime);
  	}else if(el == 'talking'){
    var talkcon = smjq("#talk").val();
    var i = in_array(talkcon, dat.ques);
    var types = typeof(i);
    if(types != 'boolean'){
    	chuncaiSay(dat.ans[i]);
    	setFace(2);
    }else{
    	chuncaiSay('.......................嗯？');
    	setFace(3);
    }
    clearInput();
  	}else if(el == 'foods'){
    var str='';
    var arr = dat.foods;
    var preg = /function/;	
    for(var i in arr){
    	if(arr[i] != '' && !preg.test(arr[i]) ){
      str +='<ul id="f'+i+'" class="eatfood" onclick="eatfood(this.id)">'+arr[i]+'</ul>';
    	}
    }
    chuncaiSay(str);
  	}else if(el = "eatsay"){
    var str = dat.eatsay[id];
    chuncaiSay(str);
    setFace(2);
  	}else if(el = "talkself"){
    var arr = dat.talkself;
    return arr;
  	}
  },
  error: function(){
  	chuncaiSay('好像出错了，是什么错误呢...请联系管理猿');
  }
  });
}

function in_array(str, arr){
	for(var i in arr){
  if(arr[i] == str){
  	return i;
  }
	}
	return false;
}

var timenum;
var tol=0;
//10分钟后页面没有响应就停止活动
var goal = 10*60;
function setTime(){
	tol++;
	//document.body.innerHTML(tol);
	timenum = window.setTimeout("setTime('"+tol+"')", 1000);
	if(parseInt(tol) == parseInt(goal)){
  stopTalkSelf();
  closeChuncaiMenu();
  closeNotice();
  closeInput();
  chuncaiSay("主人跑到哪里去了呢....");
  setFace(3);
  stoptime();
	}
}
function stoptime(){
	if(timenum){
  clearTimeout(timenum);
	}
}
var talktime = 0;
//设置自言自语频率（单位：秒）
var talkself = 60;
var talkobj;
var tsi = 0;

function talkSelf(talktime){
	talktime++;
	var tslen = talkself_arr.length;
/*	if(parseInt(tsi) >= parseInt(tslen)){
  tsi = 0;
	}
//var yushu = talktime%talkself;
if(parseInt(yushu) == parseInt(9)){
  closeChuncaiMenu();
  closeNotice();
  closeInput();
  if(talkself_arr){	
  	tsi = Math.floor(Math.random() * talkself_arr.length + 1)-1;
  	chuncaiSay(talkself_arr[tsi][0]);
  	setFace(talkself_arr[tsi][1]);
  } else {
  	var hitokotourl = 'http://api.hitokoto.us/rand?encode=jsc&charset=utf-8';
  	smjq.ajax({
  	type: "GET",
  	cache: false,
      dataType: 'jsonp',
      jsonp: 'fun',
      async: false,
      url: hitokotourl+'&fun=?',
      success: function(data) {
    chuncaiSay(data.hitokoto);
    setFace(1);
      },
  });	
  }
	}
	talkobj = window.setTimeout("talkSelf("+talktime+")", 1000);
}
function stopTalkSelf(){
	if(talkobj){
  clearTimeout(talkobj);
	}
}
function arrayShuffle(arr){
	var result = [],
	len = arr.length;
	while(len--){
  result[result.length] = arr.splice(Math.floor(Math.random()*(len+1)),1);
	}
	return result;
}


function typeWords() {
	var p = 1;
	var str = weichuncai_text.substr(0,_typei);
	var w = weichuncai_text.substr(_typei,1);
	if(w=="<"){
  str += weichuncai_text.substr(_typei,weichuncai_text.substr(_typei).indexOf(">")+1);
  p= weichuncai_text.substr(_typei).indexOf(">")+1;
	}
	_typei+=p;
	document.getElementById("tempsaying").innerHTML = str;
	txtst = setTimeout("typeWords()",50);
	if (_typei> weichuncai_text.length){
  clearTimeout(txtst);
  _typei = 0;
	}
}

function setCookie(name, val, ex){
	var times = new Date();
	times.setTime(times.getTime() + ex);
	if(ex == 0){
  document.cookie = name+"="+val+";";
	}else{
  document.cookie = name+"="+val+"; expires="+times.toGMTString();
	}
}

function getCookie(name){
	var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));   
	if(arr != null) return unescape(arr[2]); return null;
}

function submitTalk(t) {
  getdata("talking");
}
*/