/* ========================================================================
 * UUI: refer.js v 1.0.0
 *
 * ========================================================================
 * Copyright 2015 yonyou, Inc.
 *
 * ======================================================================== */

/**
 * u.refer({
* contentId: 'mycontent' //内容区id，如果不提供，创建弹出框口div，以弹出方式打开参照
* pageUrl:'xxxx' //自定义参照需要设置此属性
* dataUrl:'yyyyy' //标准参照需要设置此属性
* isPOPMode: false,
* module:  {template:'<div></div>', init：function(){}}    //js模块
* params{}
* onOk: function(data){
*
* },
* onCancel: function(){
*
* }
* })
 */


var Refer = function (options) {
    var contentId = options['contentId'];
    if (u.isEmptyObject(contentId))
        throw new Error('contentId is null');
    this.options = u.extend({}, Refer.DEFAULTS, options);
    this.params = this.options['params'];
    this.create();
    this.loaded = false;
}

Refer.DEFAULTS = {
    isPOPMode: false,
    searchInput: null,
    contentId: null,
    okId: 'okBtn',
    cancelId: 'cancelBtn',
    width: null,
    height: null,
    title: '参照',
    setVal: function () {
    },
    onOk: function () {
    },
    onCancel: function () {
    }
}

Refer.fn = Refer.prototype;

Refer.fn.create = function () {
    var self = this
    self.setVal = this.options.setVal;
    self.searchInput = this.options.searchInput;

    var prefixID = this.options.contentId.replace(/[^\w\s]/gi, '\\$&');
    if (!this.options.isPOPMode) {
        //TODO 后续支持非弹窗模式

        //if ($('#' + this.options.contentId).length === 0) {
        //    $('body').append($('<div>').attr('id', this.options.contentId));
        //}
        //this.$contentEle = $('#' + prefixID)
        //this.$okBtn = $('#' + prefixID + this.options.okId)
        //this.$cancelBtn = $('#' + prefixID + this.options.cancelId)
    } else {
        var dialog = document.querySelector('#' + prefixID);
        self.isDefaultDialog = true;
        if (dialog == null) {
            //var d = document.createElement('DIV')
            //d.innerHTML = '<div class="modal" id="' + prefixID + '"><div class="modal-dialog"><div class="modal-content">' + '<div class="modal-header"><h4 class="modal-title">Modal title</h4></div>' + '<div class="modal-body"></div><div class="modal-footer">' + '<button   type="button" class="btn btn-primary okBtn">确定</button>' + '<button  type="button" class="btn btn-default cancelBtn" data-dismiss="modal">取消</button></div></div></div></div>'
            dialog = u.makeDOM('	<div style="display:none;height:100%" id="' + prefixID + '">' +
                    '<div class="u-msg-title"><h4 class="title">单据名称</h4></div>' +
                    '<div class="u-msg-content">' +
                        '<div class="content"></div>' +
                    '</div>' +
                    '<div class="u-msg-footer">' +
                        '<button class="u-msg-ok u-button">确定<span class="u-button-container"><span class="u-ripple"></span></span></button>' +
                        '<button class="u-msg-cancel u-button">取消<span class="u-button-container"><span class="u-ripple"></span></span></button>' +
                    '</div>' +
                '</div>');
            document.body.appendChild(dialog)
            //dialog = document.body.querySelector('#' + prefixID);
        }
        //this.$contentEle = dialog.find('.modal-body');
        this.titleDiv =dialog.querySelector('.title')
        this.contentDiv = dialog.querySelector('.content');
        this.okBtn = dialog.querySelector('.u-msg-ok');
        this.cancelBtn = dialog.querySelector('.u-msg-cancel');
        this.dialog = dialog;
        //if (this.options.width)
        //    dialog.find('.modal-content').css('width', this.options.width)
        //if (this.options.height)
        //    this.$contentEle.css('height', this.options.height)
        //this.dialog.find('.modal-title').html(this.options.title)
        this.titleDiv.innerHTML = this.options.title;

    }
    u.on(this.okBtn, 'click', function(){
        self.submit();
    })

    u.on(this.cancelBtn, 'click', function(){
        self.cancel();
    })
}


Refer.fn.submit = function () {
    var data = this.submitData()
    this.options.onOk(data)
    Plugin.destroy(this)
}

Refer.fn.cancel = function () {
    this.options.onCancel()
    Plugin.destroy(this)
}

Refer.fn.open = function () {
    var self = this;
    if (self.isDefaultDialog) {
        var opt = {id:this.options.contentId,content:'#' + this.options.contentId,hasCloseMenu:true}
        if (this.options.height)
            opt.height = this.options.height;
        if (this.options.width)
            opt.width = this.options.width;
        self.modalDialog = u.dialog(opt);
        //self.dialog.modal('show')
    }
    if (this.options['module']){
        self.contentDiv.innerHTML = this.options['module'].template;
        this.options['module'].init(self);
    }
    //else if(require && require.amd){
    //    require([this.options.pageUrl], function(module) {
    //        self.contentDiv.innerHTML =  module.template;
    //        module.init(self);
    //        self.loaded = true;
    //    })
    //}
}

/**
 * 参照页面中需注册此方法
 */
Refer.fn.registerSubmitFunc = function (func) {
    this.submitData = func
}

Refer.fn.submitData = function () {
}

var Plugin = function (options) {
    var r = new Refer(options);

    Plugin.addRefer(r);
    r.open();
    return r
}

Refer.fn.destroy = function () {
    if (this.dialog) {
        if (this.isDefaultDialog) {
            //this.dialog.modal('hide');
//	            this.dialog.modal('removeBackdrop');
            this.modalDialog.close();
        }
        //this.dialog.parent().remove();
        this.dialog.parentElement.removeChild(this.dialog)
    }
    delete this.options
}

/**
 * 参照实列
 */
Plugin.instances = {}

Plugin.openRefer = function (options) {
    var r = new Refer(options);
    Plugin.addRefer(r)
    r.open()
}

Plugin.getRefer = function (id) {
    return Plugin.instances[id]
}

Plugin.addRefer = function (refer) {
    Plugin.instances[refer.options.id] = refer
}

Plugin.destroy = function (refer) {
    var r = Plugin.instances[refer.options.id];
    delete Plugin.instances[refer.options.id];
    r.destroy()
}

u.refer = Plugin;


