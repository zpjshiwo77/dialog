// dialog
/*
var myDialog = new dialog("default");
myDialog.show({"title": "标题", "message": "消息", "body": [
    [{"type": "label", "text": "用户名"}, {"type": "input", "name": "username"}],
    [{"type": "label", "text": "密码"}, {"type": "input", "name": "password"}],
    [{"type": "frame", "url": "dialog.html"}]
]}, function (result, dialog) { console.log(result); });

*/
(function (global) {
    var dialogs = new Array;
    var $,  // 迟绑定 jQuery 对象。
        defaultDialog;
    var settings = {
        "register": false,
        "theme": "dialog-dft",
    };
    var getDefaultDialog = function () {
        if (!defaultDialog) {
            return new dialog();
        }
        return defaultDialog;
    };

    var BUTTON_OK = {
        "ok":   {"text": "确定", "primary": true, "default": true}   // primary: true 表示该按钮是主按钮，在界面上应该着重表示
    }, BUTTON_OK_CANCEL = {
        "ok":       {"text": "确定", "primary": true, "default": true},   // default: true 表示该按钮响应回车按键
        "cancel":   {"text": "取消", "cancel": true}  // cancel: true 表示该按钮响应ESC按键
    }, BUTTON_YES_NO = {
        "yes":  {"text": "是", "primary": true},
        "no":   {"text": "否", "primary": true}
    }, BUTTON_YES_NO_CANCEL = { 
        "yes":      {"text": "是", "primary": true},
        "no":       {"text": "否", "primary": true},
        "cancel":   {"text": "取消", "cancel": true}
    };

    var dialog = function (theme) {
        dialogs.push(this);//向全局对象添加该元素
        this.symbol = dialogs.length;
        // theme 是主题名称。可以设计成导入不同的CSS文件。
        this.theme = theme ? theme : settings["theme"];
        this.buttons = this.body = {};
        this.title = this.message = "";
        this.width = this.height = 0;   // 0 表示默认宽度和高度
        this.position = "center";       // position 允许的值和CSS中background-position的值一致
        this.modal = this.closable = this.draggable = this.animation = true;

        // 初始化对话框
        this.init = function (options, onClose) {
            if (onClose) this._closeHandler = onClose;
            if (!options) return;
            if (typeof options["title"] == "undefined") this.title = options["title"];
            if (typeof options["message"] == "undefined") this.message = options["message"];
            if (typeof options["body"] != "object") this.body = $.extend(options["body"]);
            if (typeof options["buttons"] != "object") this.buttons = $.extend(options["buttons"]);
            if (typeof options["width"] == "undefined") this.width = options["width"]; 
            if (typeof options["height"] == "undefined") this.height = options["height"];
            if (typeof options["position"] == "undefined") this.position = options["position"];
            if (typeof options["modal"] == "undefined") this.modal = Boolean(options["modal"]);//遮罩
            if (typeof options["closable"] == "undefined") this.closable = Boolean(options["closable"]);//关闭按钮
            if (typeof options["draggable"] == "undefined") this.draggable = Boolean(options["draggable"]);//拖动 有问题
            if (typeof options["animation"] == "undefined") this.animation = Boolean(options["animation"]);//动画效果 有问题
            this.Ctheme(this.theme);
        };
        // 更换主题
        this.Ctheme =function(theme){
            var path;
            $("script").each(function(){
                var item = /dialog.js$/.test(this.src);
                if(item){
                    path = this.src.replace(/[^\/]+$/,"");
                }
            });
            var href = path+"css/"+theme+'.css';
            $("head")[0].appendChild($("<link />", {
                href: href,
                rel: "stylesheet",
                type: "text/css",
                charset: "utf-8",
                ids: this.symbol
            })[0]);
        }
        // 显示对话框
        this.show = function (options, onClose) {
            // {title: "title", message: "message", body: {}, buttons: {}, width: 100, height: 50, position: "center", modal: true, closable: true, draggable: true, animation: true};
            // 宽和高是指client区域，不包含标题栏和按钮栏
            // function onClose(result, dialog) { return true; }
            // onClose 为回调函数。返回 true 表示允许关闭操作，返回 false 表示阻止关闭操作。result 表示点击按钮的结果。dialog 是当前对话框对象。
            // body 是一个数组对象。每个元素代表一行的布局。每行的布局元素也是一个数组对象。
            this.init(options, onClose);
            // todo
            //<------------------------------------------------------------------------------------>
            //必有元素
            var bodyObj = document.body;
            var box=$("<div>",{"class":"dialog-tipBoxStyle-"+this.theme,"ids":"dialog-tipBox"+this.symbol});
            var boxP=$("<p>",{"class":"dialog-ybBoxTitleStyle-"+this.theme,"ids":"dialog-ybBoxTitle"+this.symbol});
            var boxHr=$("<hr>",{"class":"dialog-tipBoxHrStyle-"+this.theme,"ids":"dialog-tipBoxHr"+this.symbol});
            var boxText=$("<div>",{"class":"dialog-BoxTextStyle-"+this.theme,"ids":"dialog-BoxText"+this.symbol});
            if($("[ids=dialog-tipBox"+this.symbol+"]").length == 0){
                $(box).append(boxP,boxHr,boxText);
                $(bodyObj).append(box);
                $("[ids=dialog-tipBox"+this.symbol+"]").css("z-index",10001+this.symbol);
            }
            //自定义元素
            var boxBtn=$("<div>",{"class":"dialog-BoxBtnStyle-"+this.theme,"ids":"dialog-BoxBtn"+this.symbol});
            var shade=$("<div>",{"class":"dialog-shadeStyle-"+this.theme,"ids":"dialog-shade"+this.symbol});
            var title=$("<span>",{"class":"dialog-TitlefontStyle-"+this.theme,"ids":"dialog-Titlefont"+this.symbol});
            var closeBtn=$("<a>",{"class":"dialog-tipBoxXXStyle-"+this.theme,"ids":"dialog-tipBoxXX"+this.symbol});
            var message=$("<p>",{"class":"dialog-BoxContStyle-"+this.theme,"ids":"dialog-BoxCont"+this.symbol});
            var BTN_ok=$("<a>",{"class":"dialog-BtnStyle-y-"+this.theme,"ids":"dialog-BtnStyle-y"+this.symbol});
            var BTN_no=$("<a>",{"class":"dialog-BtnStyle-n-"+this.theme,"ids":"dialog-BtnStyle-n"+this.symbol});
            var body=$("<div>",{"class":"dialog-BodyStyle-"+this.theme,"ids":"dialog-Body"+this.symbol});
            var label=$("<label>",{"class":"dialog-LabelStyle-"+this.theme,"ids":"dialog-Label"+this.symbol});
            var input=$("<input>",{"class":"dialog-InputStyle-"+this.theme,"ids":"dialog-Input"+this.symbol});
            var TextP=$("<p>",{"class":"dialog-TextPStyle-"+this.theme,"ids":"dialog-TextP"+this.symbol});
            var iFrame=$("<iframe>",{"class":"dialog-iframeStyle-"+this.theme,"ids":"dialog-iframe"+this.symbol});
            var TextBtn=$("<a>",{"class":"dialog-TextBtnStyle-"+this.theme,"ids":"dialog-Btn"+this.symbol});
            var TextImg=$("<img>",{"class":"dialog-TextImgStyle-"+this.theme,"ids":"dialog-Img"+this.symbol});
            var that=this;//记录该对象
            //设置弹窗标题
            if(typeof options["title"] != "undefined"){
                this.title = options["title"];
                $("[ids=dialog-ybBoxTitle"+this.symbol+"]").append(title);
                $("[ids=dialog-Titlefont"+this.symbol+"]").html(options["title"]);
            }
            //设置弹窗消息
            if (typeof options["message"] != "undefined"){
                this.message = options["message"];
                $("[ids=dialog-BoxText"+this.symbol+"]").append(message);
                $("[ids=dialog-BoxCont"+this.symbol+"]").html(options["message"]);
            }
            //设置botton样式
            if(typeof options["buttons"] != "undefined" && typeof options["buttons"] == "object" && options["buttons"] != null){
                $("[ids=dialog-tipBox"+this.symbol+"]").append(boxBtn);
                this.buttons = options["buttons"];
                var btns = options["buttons"];
                function addBtn(value,btn,btntp){//给按钮赋值
                    btntp[0].value=value;
                    if(typeof btn.text != "undefined"){
                        $(btntp).html(btn.text);
                    }
                    if(typeof btn.primary != "undefined"){
                        btntp[0].primary = btn.primary;
                        if(btntp.st=="y" && btn.primary == true){$(btntp).css("background-color","#fe8333");}
                        else if(btntp.st=="n" && btn.primary == true){$(btntp).css("background-color","#c3c3c3");}
                    }
                    if(typeof btn.default != "undefined"){
                        btntp[0].default = btn.default;
                    }
                    if(typeof btn.cancel != "undefined"){
                        btntp[0].cancel = btn.cancel;
                    }
                    return btntp;
                }
                for(var btn in btns){
                    if(btn == "ok" || btn == "yes"){
                        BTN_ok.st="y";
                        var item = addBtn(btn,btns[btn],BTN_ok);
                        $("[ids=dialog-BoxBtn"+this.symbol+"]").append(item);
                        var BTN_ok=$("<a>",{"class":"dialog-BtnStyle-y-"+this.theme,"ids":"dialog-BtnStyle-y"+this.symbol});
                    }
                    else if(btn == "no" || btn == "cancel"){
                        BTN_no.st="n";
                        var item = addBtn(btn,btns[btn],BTN_no);
                        $("[ids=dialog-BoxBtn"+this.symbol+"]").append(item);
                        var BTN_no=$("<a>",{"class":"dialog-BtnStyle-n-"+this.theme,"ids":"dialog-BtnStyle-n"+this.symbol});
                    }
                }
                $("[ids=dialog-BtnStyle-n"+this.symbol+"]").click(function(){
                    if(typeof onClose != 'undefined'){
                        if(onClose(this.value,that)){
                            that.close();
                        }
                    }
                    else{
                        that.close();
                    }
                });
                $("[ids=dialog-BtnStyle-y"+this.symbol+"]").click(function(){
                    if(typeof onClose != 'undefined'){
                        if(onClose(this.value,that)){
                            that.close();
                        }
                    }
                    else{
                        that.close();
                    }
                });
                $("body").on('keydown.Enter'+this.symbol,null,this.symbol,function (event){ //响应回车事件
                    var code = event.keyCode; 
                    if (code == 13 && event.data == dialogs.length) { 
                        $("[ids=dialog-BtnStyle-y"+that.symbol+"]").each(function(){
                            if(this.default == true){
                                $(this).click();
                                return false;
                            }
                        });
                    } 
                });
                $("body").on('keydown.Esc'+this.symbol,null,this.symbol,function (event){ //响应Esc事件
                    var code = event.keyCode; 
                    if (code == 27 && event.data == dialogs.length) { 
                        $("[ids=dialog-BtnStyle-n"+that.symbol+"]").each(function(){
                            if(this.cancel == true){
                                $(this).click();
                                return false;
                            }
                        });
                    } 
                });
            }
            //设置宽和高
            if(typeof options["width"]!="undefined"){
                this.width = options["width"];
                $("[ids=dialog-BoxText"+this.symbol+"]").css("width",options["width"]+"px");
                var boxWidth = 637+parseInt(options["width"])-523;
                $("[ids=dialog-tipBox"+this.symbol+"]").css("margin-left",-boxWidth/2+"px");
            }
            if(typeof options["height"]!="undefined"){
                this.height = options["height"];
                $("[ids=dialog-BoxText"+this.symbol+"]").css("height",options["height"]+"px");
                var boxHeight = 277+parseInt(options["height"])-112;
                $("[ids=dialog-tipBox"+this.symbol+"]").css("margin-top",-boxHeight/2+"px");
            }
            //设置位置
            if(typeof options["position"] != "undefined"){
                this.position = options["position"];
                if(typeof options["width"] == "undefined"){
                            var width=645;
                }
                else{
                    var width=637+parseInt(options["width"])-523+8;
                }
                if(typeof options["height"] == "undefined"){
                        var height=285;
                }
                else{
                    var height=277+parseInt(options["height"])-112+8;
                }
                switch(options["position"]){
                    case "top left":
                        $("[ids=dialog-tipBox"+this.symbol+"]").css({"margin-top":0,"margin-left":0,"top":0,"left":0});
                        break;
                    case "top center": case "top":
                        $("[ids=dialog-tipBox"+this.symbol+"]").css({"margin-top":0,"top":0});
                        break;
                    case "top right":
                        $("[ids=dialog-tipBox"+this.symbol+"]").css({"margin-top":0,"margin-left":-width,"top":0,"left":100+"%"});
                        break;
                    case "center left": case "left":
                        $("[ids=dialog-tipBox"+this.symbol+"]").css({"margin-left":0,"left":0});
                        break;
                    case "center center":
                        break;
                    case "center right": case "right":
                        $("[ids=dialog-tipBox"+this.symbol+"]").css({"margin-left":-width,"left":100+"%"});
                        break;
                    case "bottom left":
                        $("[ids=dialog-tipBox"+this.symbol+"]").css({"margin-top":-height,"top":100+"%","margin-left":0,"left":0});
                        break;
                    case "bottom center": case "bottom":
                        $("[ids=dialog-tipBox"+this.symbol+"]").css({"margin-top":-height,"top":100+"%"});
                        break;
                    case "bottom right":
                        $("[ids=dialog-tipBox"+this.symbol+"]").css({"margin-top":-height,"top":100+"%","margin-left":-width,"left":100+"%"});
                        break;
                }
                if(/^\d+\s{1}\d+$/.test(options["position"])){
                    var TopLeft = options["position"].split(" ");
                    $("[ids=dialog-tipBox"+this.symbol+"]").css({"margin-top":0,"top":TopLeft[0]+"px","margin-left":0,"left":TopLeft[1]+"px"});
                }
                else if(/^\d+%{1}\s{1}\d+%{1}$/.test(options["position"])){
                    var TopLeft = options["position"].split(" ");
                    $("[ids=dialog-tipBox"+this.symbol+"]").css({"margin-top":0,"top":TopLeft[0],"margin-left":0,"left":TopLeft[1]});
                }
            }
            // 设置遮罩层
            if(options["modal"]){
                this.modal = options["modal"];
                $(bodyObj).append(shade);
                $("[ids=dialog-shade"+this.symbol+"]").css("z-index",10000+this.symbol);
            }
            //设置关闭按钮
            if(options["closable"]){
                this.closable = options["closable"];
                $("[ids=dialog-ybBoxTitle"+this.symbol+"]").append(closeBtn);
                $("[ids=dialog-tipBoxXX"+this.symbol+"]").click(function(){
                    if(typeof onClose != 'undefined'){
                        if(onClose("cancel",that)){
                            that.close();
                        }
                    }
                    else{
                        that.close();
                    }
                });
                // $("body").off('keydown.Esc'+this.symbol);//解绑按钮的esc事件为了使X的优先级更高
                $("body").on('keydown.EscX'+this.symbol,null,this.symbol,function (event){ //响应Esc事件
                    var code = event.keyCode; 
                    if (code == 27 && event.data == dialogs.length) { 
                        $("[ids=dialog-tipBoxXX"+that.symbol+"]").click();
                    } 
                });
            }
            //设置body区
            if(typeof options["body"] != "undefined" && typeof options["body"] == "object" && options["body"] != null){
                $("[ids=dialog-BoxText"+that.symbol+"]").append(body);
                for(var bdi in options["body"]){
                    for(var bdj in options["body"][bdi]){
                        var body_items = options["body"][bdi][bdj];
                        if(body_items.type == "label"){
                            label.text(body_items.text);
                            $("[ids=dialog-Body"+that.symbol+"]").append(label);
                            var label=$("<label>",{"class":"dialog-LabelStyle-"+this.theme,"ids":"dialog-Label"+this.symbol});
                        }
                        if(body_items.type == "input"){
                            input.attr("name",body_items.name);
                            $("[ids=dialog-Body"+that.symbol+"]").append(input);
                            var input=$("<input>",{"class":"dialog-InputStyle-"+this.theme,"ids":"dialog-Input"+this.symbol});
                        }
                        if(body_items.type == "button"){
                            TextBtn.text(body_items.text);
                            TextBtn[0].value = body_items.value;
                            TextBtn.click(function(){
                                if(typeof onClose != 'undefined'){

                                    onClose(this.value,that);
                                }
                            });
                            $("[ids=dialog-Body"+that.symbol+"]").append(TextBtn);
                            var TextBtn=$("<a>",{"class":"dialog-TextBtnStyle-"+this.theme,"ids":"dialog-Btn"+this.symbol});
                        }
                        if(body_items.type == "tip"){  
                            TextP.text(body_items.text);
                            $("[ids=dialog-Body"+that.symbol+"]").append(TextP);
                            var TextP=$("<p>",{"class":"dialog-TextPStyle-"+this.theme,"ids":"dialog-TextP"+this.symbol});
                        }
                        if(body_items.type == "frame"){
                            iFrame.attr("src",body_items.url);
                            iFrame.attr("height","100px");
                            iFrame.attr("width","100%");
                            if(typeof body_items.height !="undefined"){
                                iFrame.attr("height",body_items.height);
                            }
                            if(typeof body_items.width !="undefined"){
                                iFrame.attr("width",body_items.width);
                            }
                            $("[ids=dialog-Body"+that.symbol+"]").append(iFrame);
                            var iFrame=$("<iframe>",{"class":"dialog-iframeStyle-"+this.theme,"ids":"dialog-iframe"+this.symbol});
                        }
                        if(body_items.type == "img"){
                            TextImg.attr("src",body_items.url);
                            if(typeof body_items.height !="undefined"){
                                TextImg.css("height",body_items.height);
                            }
                            if(typeof body_items.width !="undefined"){
                                TextImg.css("width",body_items.width);
                            }
                            $("[ids=dialog-Body"+that.symbol+"]").append(TextImg);
                            var TextImg=$("<img>",{"class":"dialog-TextImgStyle-"+this.theme,"ids":"dialog-Img"+this.symbol});
                        }
                    }
                }
            }
            //<------------------------------------------------------------------------------------>
            return this;
        };
        // 关闭对话框。result 为 "close"
        this.close = function () { 
            // todo
            //<------------------------------------------------------------------------------------>
            $("[ids=dialog-shade"+this.symbol+"]").remove();
            $("[ids=dialog-tipBox"+this.symbol+"]").remove();
            //解绑body事件
            $("body").off('keydown.Enter'+this.symbol);
            $("body").off('keydown.Esc'+this.symbol);
            $("body").off('keydown.EscX'+this.symbol);
            //移除css
            var that = this;
            $("link").each(function(){
                var reg = new RegExp(that.theme+'.css$');
                var item = reg.test(this.href);
                if(item && this.getAttribute("ids") == dialogs.length){
                    var navigatorName = "Microsoft Internet Explorer"; 
                    if(navigator.appName == navigatorName){
                        this.removeNode(true);
                    }else{
                        this.remove();
                    }
                }
            });
            dialogs.pop();
            // delete this;//移除该对象
            //<------------------------------------------------------------------------------------>
            return this;
        };
        
        // 重新渲染对话框
        this.update = function (options, onClose) {//可以修改所有属性
            this.init(options, onClose);
            // todo
            //<------------------------------------------------------------------------------------>
            if(typeof options["title"] != "undefined"){
                $("[ids=dialog-Titlefont"+this.symbol+"]").remove();
            }
            //设置弹窗消息
            if (typeof options["message"] != "undefined"){
                $("[ids=dialog-BoxCont"+this.symbol+"]").remove();
            }
            //设置botton样式
            if(typeof options["buttons"] != "undefined" && typeof options["buttons"] == "object"){
                $("[ids=dialog-BoxBtn"+this.symbol+"]").remove();
                $("body").off('keydown.Enter'+this.symbol);
                $("body").off('keydown.Esc'+this.symbol);
            }
            // 设置遮罩层
            if(typeof options["modal"] != "undefined"){
                $("[ids=dialog-shade"+this.symbol+"]").remove();
            }
            //设置关闭按钮
            if(typeof options["closable"] != "undefined"){
                $("[ids=dialog-tipBoxXX"+this.symbol+"]").remove();
                $("body").off('keydown.EscX'+this.symbol);
            }
            //设置body区
            if(typeof options["body"] != "undefined" && typeof options["body"] === "object"){
                 $("[ids=dialog-Body"+that.symbol+"]").remove();
            }
            this.show(options,onClose);
            //<------------------------------------------------------------------------------------>
            return this;
        };
        // 注册系统全局接口
        this.register = function () {
            this._originalAlertHandler = global.alert; 
            this._originalConfirmHandler = global.confirm;
            this._originalPromptHandler = global.prompt;
            this._originalOpenHandler = global.open;
            global.alert = function (message, options) {    // 和系统原生接口保持一致，options是可选参数。
                getDefaultDialog().show({"message": message, "buttons": BUTTON_OK});
            };
            global.confirm = function (message, onClose, options) {   // 由于模拟函数不能阻塞执行，所以需要通过 onClose 回调函数来获取结果。
                getDefaultDialog().show({"message": message, "buttons": BUTTON_OK_CANCEL}, function (result) {

                    var x = onClose(result == "ok" ? true : false);
                    return x;
                });
            };
            // global.prompt = function (message, defaultText, onClose, options) {
            //     getDefaultDialog().show({"message": message, "body": [[{"type": "input", "value": defaultText, "name": "prompt"}]], "buttons": BUTTON_OK_CANCEL}, function (result, dialog) {
            //         onClose($(dialog.get("prompt")).val());
            //         return true;
            //     });
            // };
            // global.open = function (url, name, specs, replace, onClose, options) {
            //     // todo
            // };
            return this;
        };
        // 恢复系统全局接口
        this.restore = function () {
            this._originalAlertHandler && (global.alert = this._originalAlertHandler);
            this._originalConfirmHandler && (global.confirm = this._originalConfirmHandler);
            this._originalPromptHandler && (global.prompt = this._originalPromptHandler);
            this._originalOpenHandler && (global.open = this._originalOpenHandler);
            return this;
        };
        
        // 根据元素名称返回元素的 DOM 对象。
        this.getElement = function (name) {
            // todo
            //<------------------------------------------------------------------------------------>
            var item;
            $("[ids=dialog-Input"+this.symbol+"]").each(function(){
                if (this.name == name){
                    item=this;
                }
            })
            return item;
            //<------------------------------------------------------------------------------------>
            // return DOMObject
        };
    };
    
    dialog.BUTTON_OK = BUTTON_OK;
    dialog.BUTTON_OK_CANCEL = BUTTON_OK_CANCEL;
    dialog.BUTTON_YES_NO = BUTTON_YES_NO;
    dialog.BUTTON_YES_NO_CANCEL = BUTTON_YES_NO_CANCEL;
    
    // 尝试自动注册全局接口
    var autoRegister = function () {
        if (typeof global.__dialog_settings == "object") {
            settings = $.extend(settings, global.__dialog_settings);
        }
        if (settings["register"]) {
            getDefaultDialog().register();
        }
    };
    
    if (typeof module === "object" && typeof module.exports === "object") {
        // CommonJS
        module.exports = dialog;
        $ = require("jquery");
        autoRegister();
    } else if (typeof define === "function" && define.amd) {
        // AMD
        define("dialog", ["jquery"], function(jQuery) {
            $ = jQuery;
            autoRegister();
            return dialog;
        });
    } else {
        // 注册全局变量
        global.dialog = dialog;
        $ = global.$ ? global.$ : global.jQuery;
        autoRegister();
    }
})(window);
