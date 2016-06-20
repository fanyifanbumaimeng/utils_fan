/**
 * Created by fanyifan1 on 2016/4/19.
 */
var utils = {


    //listToArray:将类数组转换为数组
    listToArray: function listToArray(likeAry) {
        var ary = [];
        try {
            ary = Array.prototype.slice.call(likeAry, 0);
        } catch (e) {
            for (var i = 0; i < likeAry.length; i++) {
                ary[ary.length] = likeAry[i];
            }
        }
        return ary;
    },
    //toJSON:将字符串转换为JSON格式的对象
    toJSON: function toJSON(str) {
        return "JSON" in window ? JSON.parse(str) : eval("(" + str + ")");
    },
    //win:获取或者设置和浏览器相关的盒子模型信息
    getWin :function getWin(attr, value) {
    if (typeof value === "undefined") {
        return document.documentElement[attr] || document.body[attr];
    }
    document.documentElement[attr] = value;
    document.body[attr] = value;
    },

    //getCss:获取当前元素经过浏览器计算的样式
    getCss :function (curEle, attr) {
    var val = reg = null;
    if ("getComputedStyle" in window) {
        val = window.getComputedStyle(curEle, null)[attr];
    } else {
        if (attr === "opacity") {
            val = curEle.currentStyle["filter"];
            reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
            val = reg.test(val) ? reg.exec(val)[1] / 100 : 1;
        } else {
            val = curEle.currentStyle[attr];
        }
    }
    reg = /^-?\d+(\.\d+)?(px|pt|em|rem)?$/;
    return reg.test(val) ? parseFloat(val) : val;
    },

    //offset:获取元素距离body的偏移量(不管body是否为父级参照物)
    offset :function offset(curEle) {
    var t = curEle.offsetTop, l = curEle.offsetLeft, p = curEle.offsetParent;
    while (p) {
        if (navigator.userAgent.indexOf("MSIE 8.0") === -1) {
            t += p.clientTop;
            l += p.clientLeft;
        }
        t += p.offsetTop;
        l += p.offsetLeft;
        p = p.offsetParent;
    }
    return {top: t, left: l};
    },

/*--------------------------------------------------*/

//prev:获取当前元素的上一个哥哥元素节点
    prev :function prev(curEle) {
    if ("previousElementSibling" in curEle) {
        return curEle.previousElementSibling;
    }
    var pre = curEle.previousSibling;
    while (pre && pre.nodeType !== 1) {
        pre = pre.previousSibling;
    }
    return pre;
},

//prevAll:获取当前元素的所有的哥哥元素节点
    prevAll :function prevAll(curEle) {
    //this->utils
    var ary = [], pre = this.prev(curEle);
    while (pre) {
        ary.unshift(pre);
        pre = this.prev(pre);
    }
    return ary;
},

//next:获取当前元素的下一个弟弟元素节点
    next :function next(curEle) {
    if ("nextElementSibling" in curEle) {
        return curEle.nextElementSibling;
    }
    var nex = curEle.nextSibling;
    while (nex && nex.nodeType !== 1) {
        nex = nex.nextSibling;
    }
    return nex;
},

//nextAll:获取当前元素的所有的弟弟元素节点
    nextAll :function nextAll(curEle) {
    var ary = [], nex = this.next(curEle);
    while (nex) {
        ary[ary.length] = nex;
        nex = this.next(nex);
    }
    return ary;
},

//sibling:获取当前元素的相邻节点(上一个哥哥+下一个弟弟)
    sibling : function sibling(curEle) {
    var pre = this.prev(curEle), nex = this.next(curEle);
    var ary = [];
    pre ? ary[ary.length] = pre : null;
    nex ? ary[ary.length] = nex : null;
    return ary;
},

//sibling:获取当前元素的兄弟元素节点(哥哥+弟弟)
    siblings :function sibling(curEle) {
    return this.prevAll(curEle).concat(this.nextAll(curEle));
},

//getIndex:获取当前元素的索引,有几个哥哥,我的索引就是几
    getIndex :function getIndex(curEle) {
    return this.prevAll(curEle).length;
},

/*--------------------------------------------------*/

//hasClass:判断当前元素是否包含某个样式类名
    hasClass :function hasClass(curEle, cName) {
    var reg = new RegExp("(?:^| +)" + cName + "(?: +|$)");
    return reg.test(curEle.className);
},

//addClass:给当前的元素增加样式类名
    addClass : function addClass(curEle, cName) {
    if (!this.hasClass(curEle, cName)) {//->首先判断当前的元素中是否已经存在cName这个样式名了,存在就不在增加了...
        curEle.className += " " + cName;
    }
},

//removeClass:给当前的元素移除某一个样式类名
    removeClass:function removeClass(curEle, cName) {
    if (this.hasClass(curEle, cName)) {//->首先判断当前的元素中是否已经存在cName这个样式名了,有的话才移除...
        var reg = new RegExp("(?:^| +)" + cName + "(?: +|$)", "g");
        curEle.className = curEle.className.replace(reg, " ");
    }
},

/*--------------------------------------------------*/

//children:获取当前元素下所有的元素子节点,如果传递了tag值,意思是在所有的子元素节点中在把标签名为tag的筛选出来
    children :function children(curEle, tag) {
    var nodeList = curEle.childNodes, ary = [];
    for (var i = 0; i < nodeList.length; i++) {
        var cur = nodeList[i];
        if (cur.nodeType === 1) {
            if (typeof tag !== "undefined") {
                var reg = new RegExp("^" + tag + "$", "i");
                reg.test(cur.tagName) ? ary[ary.length] = cur : null;
                continue;
            }
            ary[ary.length] = cur;
        }
    }
    return ary;
},

    //getElementsByClass:通过元素的样式类名,在指定的上下文中获取相关的元素
    getElementsByClass:function (strClass, context) {
    context = context || document;
    if ("getElementsByClassName" in document) {
        return this.listToArray(context.getElementsByClassName(strClass));
    }
    var tagList = context.getElementsByTagName("*"), ary = [];
    strClass = strClass.replace(/(^ +| +$)/g, "").split(/ +/);
    for (var i = 0; i < tagList.length; i++) {
        var curTag = tagList[i], curTagClass = curTag.className;
        var flag = true;
        for (var k = 0; k < strClass.length; k++) {
            var reg = new RegExp("(?:^| +)" + strClass[k] + "(?: +|$)");
            if (!reg.test(curTagClass)) {
                flag = false;
                break;
            }
        }
        flag ? ary[ary.length] = curTag : null;
    }
    return ary;
    },

    getCss: function (curEle, attr) {
        //处理带单位的问题
        var reg = /^-?\d+(\.\d+)?(?:px|em|pt|deg|rem)?$/;
        var val = null;
        if (/MSIE (?:6|7|8)/.test(window.navigator.userAgent)) {

            //这里处理filter的滤镜问题  alpha(opacity=40);
            if (attr === 'opacity') {
                //alpha(opacity=40)
                val = curEle.currentStyle['filter'];
                var reg1 = /^alpha\(opacity=(\d+(\.\d+)?)\)/;
                return reg1.test(val) ? RegExp.$1 / 100 : 1;
            }
            val = curEle.currentStyle[attr];
        } else {
            val = window.getComputedStyle(curEle, null)[attr];
        }
        return reg.test(val) ? parseFloat(val) : val; //如果正则验证通过，寿命返回值是带单位的，那么我们就要人为去掉这个单位。否则不变
    },
    //要想给元素设置值，只能设置行内样式的值。通过元素.style设置
    setCss: function (ele, attr, value) {
        if (attr == 'opacity') { //处理透明度
            // window.navigator.userAgent.indexOf('MSIE') >= 0
            if (/MSIE (?:6|7|8)/.test(window.navigator.userAgent)) {
                ele.style['filter'] = 'alpha(opacity=' + value * 100 + ')';
            } else {
                ele.style.opacity = value;
            }
            return;
        }
        //float的问题也需要处理 cssFloat styleFloat
        if (attr === 'float') {
            ele.style['cssFloat'] = value;
            ele.style['styleFloat'] = value;
            return;
        }
        var reg = /^(width|height|left|top|right|bottom|(margin|padding)(Top|Bottom|Left|Right)?)$/;
        //判断你传进来这个value是否带单位，如果带单位了我就不加了
        // 5px
        if (reg.test(attr)) { //验证通过就证明是width等值
            if (!isNaN(value)) { //不带单位的我就加
                value += 'px';
            }
        }
        ele.style[attr] = value;
    },

    setGroupCss: function (ele, obj) {  //批量设置样式属性
        obj = obj || '0'; //如果没传要做处理保证我们的程序不报错误
        if (obj.toString() != '[object Object]') {
            return;
        }
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                this.setCss(ele, key, obj[key]);
            }
        }
    },

	/**
     *
     * @param fn 需要函数节流的函数
     * @param delay 启动定时器的的时间
     * @param mustRunDelay 函数执行一次的最短时间间隔
     * @returns {Function}
     */
    trottle: function (fn, delay, mustRunDelay) { //函数节流
        var timer = null;
        //时间戳
        var t_start;
        return function () {
            var context = this, args = arguments, t_curr = +new Date();
            clearTimeout(timer);
            //更新时间戳
            if (!t_start) {
                t_start = t_curr;
            }
            //超出最短时间间隔执行一次函数
            if (t_curr - t_start >= mustRunDelay) {
                fn.apply(context, args);
                t_start = t_curr;
            } else {//启动定时器,同时执行和函数,设置延迟时间为delay.
                timer = setTimeout(function () {
                    fn.apply(context, args);
                }, delay);
            }
        };
    },
};



/*
* 判断值的类型,调用方法为utils.isArray
*
* */
var types= ["Array", "Boolean", "Date", "Number", "Object", "RegExp", "String", "Window", "HTMLDocument"];

for(var i = 0,cur;cur=types[i++];){
    utils["is"+cur]=(function(type){
        return function (obj) {
            return Object.prototype.toString.call(obj) == "[object " + type + "]";
        }
    })(cur);
};





