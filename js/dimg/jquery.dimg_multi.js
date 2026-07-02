// DEPENDENCIES
//  jquery - 2.1.1
//	caman - 4.1.1
//	plupload
//	fancybox
//	dat.gui
//	canvas-toBlob.js
//


// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
//;
(function ( $, window, document/*, undefined */) {

        // undefined is used here as the undefined global variable in ECMAScript 3 is
        // mutable (ie. it can be changed by someone else). undefined isn't really being
        // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
        // can no longer be modified.

        // window and document are passed through as local variable rather than global
        // as this (slightly) quickens the resolution process and can be more efficiently
        // minified (especially when both are regularly referenced in your plugin).

        // Create the defaults once
        var pluginName = "dimg_multi",
            defaults = {
                messages:{
                    clear:	   'Clear image',
                    drag_here: 'Click or drag image file here to upload',
                    MSG_max_upload_count_reached: 'You have reached the maximum number of files for this upload. Save the current files first than start another multi-upload.',
                },
                uploader_url:'upload.php',
                generateUniqueFilenames:true,
                postData:{},
                maxim:2500,// maximum image with or height
                minim: 50,//minimum image width or height
                noImageIcon:'fas fa-camera',// fa-user // the noimage icon
                onUpload:function(uploadedFile, uploader, file, object, succeeded){ succeeded(true); },//callback for upload
                uploadComplete: function(uploaded, callback){ callback(false); },
                onClear:function(callback){ callback(true); },//image clear
                width:'',
                height:'',
                enable_upload:true,
                uploadLimit: 11,
            };

        // The actual plugin constructor
        function Plugin ( element, options ) {
                this.element = element;
                this.$element = $(element);
                // jQuery has an extend method which merges the contents of two or
                // more objects, storing the result in the first object. The first object
                // is generally empty as we don't want to alter the default options for
                // future instances of the plugin
                this.settings = $.extend( true ,{},  defaults, options );
                this.settings.postData = $.extend( true, {}, this.settings.postData,{csrf_token:''});

                /*for ( var i = 0, l = this.settings.boxes.length; i < l; i++ ) {
                    var box = $.extend( true, {}, defaultBox, this.settings.boxes[i] );
                    box.name = box.name ? box.name: 'box_'+i;
                    box.label = box.label ? box.label: box.name;
                    this.settings.boxes[i] = box;
                }*/
                this._defaults = defaults;
                this._name = pluginName;

                //http://www.sitepoint.com/introduction-getusermedia-`api/
                //window.navigator = window.navigator || {};
                //navigator.getUserMedia = navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||null;
                this._opened = false;
                this._finalupload = false;
                this.init();
        }

        // Avoid Plugin.prototype conflicts
        $.extend(Plugin.prototype, {
                _addImage: function(imageData, filename, callback){
                    var that = this;
                    if (typeof callback == 'undefined'){ callback = $.noop; }
                    that.$wait.show();
                    var img = new Image();
                    img.crossOrigin = "Anonymous";
                    img.onload = function(){
                        that.__setImage(img,img.naturalWidth,img.naturalHeight,imageData,filename);
                        callback(true);
                    };
                    img.onerror = function(){
                        //that.__setImage(false,0,0,imageData);
                        that.$wait.hide();
                        callback(false);
                    };
                    img.src = imageData;
                },
                __setImage:function(img,width,height,imageData,filename){
                        var that = this;
                        var $newdimg = $('<div></div>').addClass('dimg-multi-element');
                        var $remove = $('<button title="'+that.settings.messages.clear+'"><i class="fas fa-times"></i></button>').addClass('removeMultiElement rbtn rbtn-red');
                        $newdimg.append($remove);
                        that.$element_scroll.append($newdimg);
                        $newdimg.dimg({
                            uploader_url: build_url('index.php/uploadr/Upload/upload_img'),
                            postData: { makethumbnail:true },
                            messages: APP.dimg.messages(),
                            onUpload: function(uploadedFile, uploader, file, object, succeeded){
                                succeeded(true);
                            },
                            onClear:function(succeeded){
                            },
                            uploadAfterEdit: false,
                        }).dimg('loadImage',imageData);
                        $newdimg.dimg('_setFileName',filename);

                        $remove.on('click', function(){
                            $newdimg.remove();
                            that.fcounter--;
                        });
                        that.$wait.hide();
                },
                _createContainer:function(){
                    var that = this;
                    that.$element.addClass('di dimg-multi').attr('title',that.settings.messages.drag_here);
                    if (that.settings.width) { that.$element.width(that.settings.width); }
                    if (that.settings.height) { that.$element.height(that.settings.height); }
                    that._elemet_backround = that.$element.css('background-color');

                    that.$wait = $('<div><i class="fas fa-circle-notch fa-spin"></i></div>').addClass("di dimg-wait");
                    that.$element.append(that.$wait);
                    that.$wait.hide();
                    that.$msg = $('<div><i class="fas fa-info-circle"></i></div>').addClass("di dimg-msg");that.$element.append(that.$msg);
                    that.$msg.hide();

                    that.$element_add = $('<div class="di dimg dimg-add-image"></div>');
                    that.$element_noimg = $('<i class="di dimg-noimg dimg-icon '+that.settings.noImageIcon+'" title="'+that.settings.messages.drag_here+'"></i>');
                    that.$element_add.append(that.$element_noimg);
                    that.$element_thumbnail = $("<canvas></canvas>").addClass("di dimg-element-thumbnail");that.$element_add.append(that.$element_thumbnail);
                    that.element_thumbnail_context = that.$element_thumbnail[0].getContext("2d");

                    that.$element_scroll = $('<div class="di di-scroll"></div>');
                    that.$element.append(that.$element_scroll);
                    that.$element_scroll.append(that.$element_add);
                },
                clearImages : function(){
                    var that 			= this;
                    that.fcounter		= 0;
                    that._finalupload 	= false;
                    that.uploader.splice(0,100);
                    that.images 		= [];
                    that.$element_scroll.find('.dimg-multi-element').remove();
                    that.$wait.hide();
                },
                _createUploader:function(){
                        var that = this;
                        that.fcounter = 0;
                        that.uploader = new plupload.Uploader({
                            headers:{'dent-upload':'true'}, // this will generate HTTP_DENT_UPLOAD headear in upload request
                            runtimes : 'html5,html4',
                            browse_button : that.$element_add[0], // you can pass in id...
                            container: that.element, // ... or DOM Element itself
                            drop_element : that.settings.enable_upload ? [that.element] : [],
                            url : that.settings.uploader_url,
                            /*flash_swf_url : '../js/Moxie.swf',
                            silverlight_xap_url : '../js/Moxie.xap',*/
                            chunk_size: '1024kb',//'1024kb',
                            multipart:true,
                            multipart_params: that.settings.postData,
                            filters : {
                                max_file_size : '15mb',
                                mime_types: [
                                    {title : "Image files", extensions : "jpg,jpeg,gif,png"},
                                ]
                            },
                            init: {
                                PostInit: function(up, params) {
                                    if (that.uploader.features.dragdrop) {
                                        $.each(that.uploader.settings.drop_element, function(i,target){
                                            target.ondragover = function(event) {
                                                event.dataTransfer.dropEffect = "copy";
                                            };
                                            target.ondragenter = function() {
                                                $(this).addClass("dimg-dragover");
                                            };
                                            target.ondragleave = function() {
                                                $(this).removeClass("dimg-dragover");
                                            };
                                            target.ondrop = function() {
                                                $(this).removeClass("dimg-dragover");
                                                up.doTriggerElemClick = (this == that.element);
                                            };
                                    });
                                    }
                                },
                                BeforeUpload: function(up, file) {
                                    that.$wait.show();
                                    file.origName = file.name;
                                    if (that.settings.generateUniqueFilenames){
                                        file.name = file.id + '.' + file.name.split('.').pop();
                                    }
                                },
                                FilesAdded: function(up, files) {
                                    that.$wait.show();
                                    that.uploader.haserror = false;
                                    if (!that._finalupload){
                                        plupload.each(up.files, function(file) {
                                            setTimeout(function(){
                                                if (that.fcounter < that.settings.uploadLimit){
                                                    that.fcounter++;
                                                    var preloader = new mOxie.Image();  //Wiki: https://github.com/moxiecode/moxie/wiki/Image
                                                    preloader.onload = function() {
                                                        //preloader.downsize( 300, 300 );
                                                        var imgdata = preloader.getAsDataURL();
                                                        that._addImage(imgdata, file.name);
                                                        that.uploader.splice(0,100);// allow only one file
                                                    };
                                                    preloader.load( file.getSource() );  //Wiki: https://github.com/moxiecode/plupload/wiki/File
                                                    return true;
                                                }else{
                                                    that.$wait.hide();
                                                    that._notifyMSG(that.settings.messages.MSG_max_upload_count_reached);
                                                    return false;
                                                }
                                            },up.doTriggerElemClick ? 300:0);
                                        });
                                    }
                                },
                                UploadProgress: function(up, file){
                                },
                                FileUploaded:function(up, file, object){
                                    var response = JSON.parse(object.response);
                                    if (response.OK) {
                                        //response.file contains the the uploaded file
                                        var img = { name: response.file.name , origName: file.origName };
                                        that.images.push(img);
                                        that.settings.onUpload(response.file, up, file, object);
                                    } else {
                                        that.uploader.haserror = true;
                                        that._showMSG('Upload Server Error:'+response.error.message);
                                    }
                                },
                                UploadComplete: function(up) {
                                    that.$wait.show();
                                    that.settings.uploadComplete(that.images, function(retData){
                                        that.clearImages();
                                    });
                                },
                                Error: function(up, err) {//some upload error
                                    that._showMSG('Upload Error:'+err.message);
                                    that.$wait.hide();
                                }
                            }
                        });
                        that.uploader.haserror = false;
                        that.uploader.init();
                },

                _showMSG:function(msg){
                    var that=this;
                    that.$msg.html('<i class="fas fa-info-circle"></i>'+msg);
                    that.$msg.hide().fadeIn(100);
                },

                _hideMSG:function(){
                    var that=this;
                    that.$msg.fadeOut(100);
                },

                _notifyMSG:function(msg, delay){
                    var that=this;
                    delay = delay ? delay : 5000;
                    that.$msg.html('<i class="fas fa-info-circle"></i>'+msg);
                    clearTimeout(that.nTimer);
                    that.$msg.hide().fadeIn(100);
                    that.nTimer = setTimeout( function(){ that.$msg.fadeOut(100); }, delay);
                },
                init: function () {
                        var that 		= this;
                        that.images 	= [];
                        // Place initialization logic here
                        // You already have access to the DOM element and
                        // the options via the instance, e.g. this.element
                        // and this.settings
                        // you can add more functions like the one below and
                        // call them like so: this.yourOtherFunction(this.element, this.settings).
                        that._createContainer();
                        that._createUploader();
                },
                doUpload: function(callback){
                    var that = this;
                    if (typeof callback == 'undefined'){ callback = $.noop; }
                    that.uploader.splice();
                    that.$wait.show();
                    that._finalupload = true;// prevent uploader fileAdded

                    var elements = that.$element_scroll.find('.dimg-multi-element');
                    if (elements.length > 0){
                        elements.each(function(index){
                            var $canvas = $(this).dimg('getCanvasImage');
                            var $filename = $(this).dimg('getFileName');
                            setTimeout(function(){
                                    $canvas.toBlob(function(resultingBlob) {
                                    // var resultingBlob = new Blob(['Hello world'], {type: 'text/text'});
                                    var file = new o.File(null, resultingBlob);
                                    file.name = $filename; // giving it a file name here
                                    that.uploader.addFile(file);
                                    that.uploader.start();
                                }, 'image/jpeg',70);
                            },1);
                        });
                    }else{
                        that.settings.uploadComplete(false, $.noop);
                        that.clearImages();
                    }
                    callback();
                },
        });

        // A really lightweight plugin wrapper around the constructor,
        // preventing against multiple instantiations
        $.fn[ pluginName ] = function ( options, key, value ) {
                var args = arguments;
                if (typeof options == 'string'){// call a method
                    var res = {};
                    this.each(function() {
                        var instance = $.data( this, "plugin_" + pluginName );
                        if ( instance ) {
                            if (options=='option'){
                                var data={};
                                data[key]=value;
                                $.extend(instance.settings,data);
                                res = value;
                            }else{
                                res = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ));
                            }
                        }
                    });
                    return res;
                } else
                if (typeof options == 'object'){//init each elem
                    this.each(function() {
                        if (($(this).attr("id")) && ($(this).attr("id").toLowerCase()=='filter')){
                            console.warn('Using "filter" as ID for the dfilter container breaks TinyMCE :( !!!!!!!!!');
                        } else {
                            var instance = $.data( this, "plugin_" + pluginName );
                            if ( !instance ) {
                                    $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
                            }
                        }
                    });
                    // chain jQuery functions
                    return this;
                } else { return this; }
        };

})( jQuery, window, document );
