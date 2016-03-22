/*
*插件介绍:图片上传本地预览插件 兼容浏览器(IE 谷歌 火狐) 不支持safari 当然如果是使用这些内核的浏览器基本都兼容
*插件网站:http://jquery.decadework.com
*使用方法:
*界面构造(IMG标签外必须拥有DIV 而且必须给予DIV控件ID)
* <div id='imgdiv'><img id='imgShow' width='120' height='120' /></div>
* <input type='file' id='up_img' />
*调用代码:
* new uploadPreview({ UpBtn: 'up_img', DivShow: 'imgdiv', ImgShow: 'imgShow' });
*参数说明:
*UpBtn:选择文件控件ID;
*DivShow:DIV控件ID;
*ImgShow:图片控件ID;
*Width:预览宽度;
*Height:预览高度;
*ImgType:支持文件类型 格式:['jpg','png'];
*callback:选择文件后回调方法;
*依赖：jquery Jcrop 
*/

/*
*work:图片预览插件
*/
;(function($) {
	'use strict';
    jQuery.fn.extend({
        uploadPreview: function(setting) {
            /*
            *work:this(当前对象)
            */
            var _self = this;
            /*
            *work:判断为null或者空值
            */
            _self.IsNull = function(value) {
                if (value === undefined || value === null || value === '' || value.length === 0) {
                    return true;
                }
                return false;
            };
            /*
            *work:默认配置
            */
            _self.DefautlSetting = {
                DivShow: '',
                ImgShow: 'imgShow',
                ImgType: ['gif', 'jpeg', 'jpg','bmp', 'png'],
                ErrMsg: '选择文件错误,图片类型必须是(gif,jpeg,jpg,bmp,png)中的一种',
                callback: function() { }
            };
            /*
            *work:获取文本控件URL
            */
            _self.getObjectURL = function(file) {
                var url = null;
                if (window.createObjectURL != undefined) {
                    url = window.createObjectURL(file);
                } else if (window.URL != undefined) {
                    url = window.URL.createObjectURL(file);
                } else if (window.webkitURL != undefined) {
                    url = window.webkitURL.createObjectURL(file);
                }
                return url;
            };
            /*
            *work:对预览图片进行截图
            */
            _self.paint = function(imgShow) {
                var jcrop_api,
                    boundx,
                    boundy,

                // Grab some information about the preview pane
                $preview = $('#preview-pane'),
                $pcnt = $('#preview-pane .preview-container'),
                $pimg = $('#preview-pane .preview-container img'),
                xsize = $pcnt.width(),
                ysize = $pcnt.height();
                $pimg.attr('src',imgShow.attr('src'));
                imgShow.Jcrop({
                    onChange: updatePreview,
                    onSelect: updatePreview,
                    aspectRatio: 1
                },function(){
                    // Use the API to get the real image size
                    var bounds = this.getBounds();
                    boundx = bounds[0];
                    boundy = bounds[1];
                    // Store the API in the jcrop_api variable
                    jcrop_api = this;
                    // Move the preview into the jcrop container for css positioning
                    $preview.appendTo(jcrop_api.ui.holder);
                });

                function updatePreview(c){
                    $("#w").attr("value",Math.round(c.w));
                    $("#h").attr("value",Math.round(c.h));
                    $("#x").attr("value",Math.round(c.x));
                    $("#y").attr("value",Math.round(c.y));
                    if (parseInt(c.w) > 0){
                        var rx = xsize / c.w;
                        var ry = ysize / c.h;

                        $pimg.css({
                            width: Math.round(rx * boundx) + 'px',
                            height: Math.round(ry * boundy) + 'px',
                            marginLeft: '-' + Math.round(rx * c.x) + 'px',
                            marginTop: '-' + Math.round(ry * c.y) + 'px'
                        });
                            
                    }
                };
            }
            /*
            *work:绑定事件
            */
            _self.change(function() {
            	var DivShow=$('#'+setting.DivShow),
            	imgShow=_self.IsNull(DivShow.find('img').eq(0).attr('id')) ? _self.DefautlSetting.ImgShow : DivShow.find('img').eq(0).attr('id'),
    			Width=_self.IsNull(setting.Width) ? DivShow.width() : setting.Width,
            	Height=_self.IsNull(setting.Height) ? DivShow.height() : setting.Height,
            	ImgType=_self.IsNull(setting.ImgType) ? _self.DefautlSetting.ImgType : setting.ImgType,
            	ErrMsg=_self.IsNull(setting.ErrMsg) ? _self.DefautlSetting.ErrMsg : setting.ErrMsg,
            	callback=_self.IsNull(setting.callback) ? _self.DefautlSetting.callback : setting.callback;
                if (this.value) {
                    if (!RegExp('\.(' + ImgType.join('|') + ')$', 'i').test(this.value.toLowerCase())) {
                        alert(_self.Setting.ErrMsg);
                        this.value = '';
                        return false;
                    }
                    //清空数据
                    DivShow.empty();
                    var imgHtml = '<img id="'+imgShow+'" /><div id="preview-pane"><div class="preview-container"><img /></div></div>';
                    imgHtml += '<input type="hidden" id="x" name="x"/>';
                    imgHtml += '<input type="hidden" id="y" name="y"/>';
                    imgHtml += '<input type="hidden" id="w" name="w"/>';
                    imgHtml += '<input type="hidden" id="h" name="h"/>';
                    DivShow.html(imgHtml);
                    var ImgShow = $('#'+imgShow);
                    //设置图片url
                    ImgShow.width(Width + 'px');
                    ImgShow.height(Height + 'px');
                    ImgShow.attr('src',_self.getObjectURL(this.files[0]));
                    //对上传图片进行截图
                    _self.paint(ImgShow);
                    //回调方法
                    callback();
                    
                } 
            });
           
        }
    });
//     lion.upload.post=function(url,fileId,data,successfn,errorfn,arg){
//         successfn=successfn||$.noop;
//         errorfn=errorfn||$.noop;
//         $.ajaxFileUpload({
//             url: url, //用于文件上传的服务器端请求地址
//             secureuri: false, //是否需要安全协议，一般设置为false
//             fileElementId: fileId, //文件上传域的ID
//             dataType: 'json', //返回值类型 一般设置为json
//             data: data,//参数
//             success: function (data){  //服务器成功响应处理函数
//                 successfn.call(this,data,arg);
//             },
//             error: function (data){//服务器响应失败处理函数
//                 errorfn.call(this,xhr,textStatus,error);
//             }
//         });
//     };
})(jQuery);