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
        var pluginName = "dimg",
            defaults = {
                messages:{
                    camera:    'Camera',
                    scanner:   'Scanner',
                    loadfile:  'Load image...',
                    takephoto: 'Take picture',
                    doscan:    'Scan...',
                    docrop:    'Crop image',
                    measure:   'Measure',
                    measure_ref:'Reference',
                    measure_dist:'Distance',
                    upload:    'Upload',
                    clear:	   'Clear image',
                    cancel:    'Cancel',
                    back:      'Back',
                    drag_here: 'Click or drag image file here to upload',
                    scan_with_ui: 'Scan with scanner UI',
                    scan_without_ui: 'Quick scan without scanner UI',
                    GUI_folder_resize:'Crop resize and rotate',
                    GUI_crop:   'Crop',
                    GUI_resize: 'Resize',
                    GUI_rotate: 'Rotate',
                    GUI_folder_tools:'Image Tools',
                    GUI_brightness:	'Brightness',
                    GUI_contrast:	'Contrast',
                    GUI_saturation:	'Saturation',
                    GUI_vibrance:	'Vibrance',
                    GUI_exposure:	'Exposure',
                    GUI_hue:		'Hue',
                    GUI_sepia:		'Sepia',
                    GUI_invert:		'Invert image',
                    GUI_greyscale:	'Greyscale',
                    GUI_reset:  	'Reset',
                    GUI_open:		'Open',
                    GUI_close:		'Close',
                    MSG_access_camera: 'Please allow access to your camera for this web page by answering to the message on the top of your browser window!',
                    MSG_no_camera: 'No camera detected or the user denied access to the camera!',
                    MSG_crop_small: 'The selection is too small!',
                    MSG_crop_large: 'The selection is too big!',
                    MSG_no_scanner: 'No scanners detected or the APP plugin is not installed or started!',
                    MSG_access_scanner: 'Checking for scanners...',
                    MSG_scanner_error: 'Error scanning image!',
                    MSG_scanning: 'Scanning in progress ... If you selected UI mode please switch to the scanner interface and make a scan!',
                    MSG_measure_alert: 'Mesuring is purely indicative, and may be influenced by the image and the reference!',
                },
                image:'', //the image
                uploader_url:'upload.php',
                generateUniqueFilenames:true,
                forceCrop:false,
                postData:{},
                maxim:2500,// maximum image with or height
                minim: 50,//minimum image width or height
                noImageIcon:'fas fa-camera',// fa-user // the noimage icon
                initialCrop:{"x":13,"y":7,"x2":487,"y2":107,"w":474,"h":100}, // the initial crop coordinates
                jcrop:{}, //jcrop init
                onUpload:function(uploadedFile, uploader, file, object, succeeded){ succeeded(true); },//callback for upload
                onClear:function(callback){ callback(true); },//image clear
                onThumbnailSet:$.noop,//thumbnail set
                width:'',
                height:'',
                editOnClick:true,
                enable_camera:true,
                enable_scanner:true,
                enable_upload:true,
                enable_measure:true,
                enable_crop:true,
                enable_clear:true,
                enable_doupload:true,
                uploadAfterEdit: true,
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
                this._filename = "capture.png";
                this.imageLoaded=false;
                this.video_sources_avaiable=0;
                this.scanner_sources_avaiable=0;
                this.selectedCameraId = '';
                this.init();
        }

        // Avoid Plugin.prototype conflicts
        $.extend(Plugin.prototype, {
                startImageEdit:function(callback){
                    var that = this;
                    that._openFancyBox(callback);
                },
                loadImage:function(imageURL, callback){
                    var that = this;
                    if (typeof callback == 'undefined'){ callback = $.noop; }
                    that._flag_loadingImage = true;
                    that._toggeNoImgElement(true);
                    that._loadImage(imageURL, function(result){
                        that._toggeNoImgElement(!result);
                        if (result){ that._makeThumbnail(); }
                        that._flag_loadingImage = false;
                        callback();
                    });
                },
                loadImageEx:function(imageURL, callback){
                    var that = this;
                    that._loadImage(imageURL, callback);
                },
                _loadImage:function(imageData, callback){
                        var that = this;
                        if (typeof callback == 'undefined'){ callback = $.noop; }
                        that.$wait.show();
                        var img = new Image();
                        img.onload = function(){
                            that.__setImage(img,img.naturalWidth,img.naturalHeight);
                            that.$wait.hide();
                            that._doForceCrop();
                            callback(true);
                        };
                        img.onerror = function(){
                            that.__setImage(false,0,0);
                            that.$wait.hide();
                            callback(false);
                        };
                        if ( imageData.substring(0,5) !== 'data:' ){
                            img.crossOrigin = "Anonymous";
                            //var rnd ='?rnd='+Math.floor((Math.random()*100)+1);
                            //var rnd ='?rnd=dimg';
                            //imageData = imageData+rnd;
                        }
                        img.src = imageData;
                },
                _doForceCrop:function(){
                    var that = this;
                    if (that.settings.forceCrop && !that._flag_loadingImage){
                        //console.log('force crop');
                        that._flag_forceCropping = true;
                        that._toggleCrop(true);
                        that._flag_forceCropping = false;
                    }
                },
                _cloneCanvas:function(oldCanvas) {
                    //create a new canvas
                    var $newCanvas = $('<canvas></canvas>');
                    var context = $newCanvas[0].getContext('2d');
                    //set dimensions
                    $newCanvas[0].width = oldCanvas.width;
                    $newCanvas[0].height = oldCanvas.height;
                    //apply the old canvas to the new one
                    context.drawImage(oldCanvas, 0, 0);
                    //return the new canvas
                    return $newCanvas;
                },
                _copyCanvas:function($from, $to, new_width, new_height){
                    var that = this;
                    var width = (typeof new_width == 'undefined') ? $from[0].width : new_width;
                    var height = (typeof new_height == 'undefined') ? $from[0].height : new_height;
                    //console.log(width+'x'+height);
                    var context = $to[0].getContext('2d');
                    $to[0].width = width;
                    $to[0].height = height;
                    context.drawImage($from[0], 0, 0, width, height);
                    if ($to==that.$canvas){
                        that.$canvas_holder.css("width",width+'px');
                        that.$canvas_holder.css("height",height+'px');
                        that._cssCanvasCorrection();
                    }
                },
                __checksize:function(width, height){
                        var that = this;
                        if ((width===0) && (height===0)){ return {width:0, height:0};}
                        var ratio=width/height;
                        if ((width>that.settings.maxim)||(height>that.settings.maxim)){
                            width=that.settings.maxim;
                            height = width/ratio;
                        }
                        if ((width<that.settings.minim)||(height<that.settings.minim)){
                            width=that.settings.minim;
                            height = width/ratio;
                        }
                        return {width:width, height:height};
                },
                __setImage:function(img,width,height,callback){
                        var that = this;
                        if (typeof callback == 'undefined'){ callback = $.noop; }
                        //console.log(width+'x'+height);
                        that.imageLoaded = img ? true:false;
                        that._toggeNoImg(!that.imageLoaded);
                        var size = that.__checksize(width, height);
                        width=size.width; height=size.height;
                        that.$canvas.attr( "width", width );
                        that.$canvas.attr( "height",height );
                        that.$canvas_holder.css("width",width+'px');
                        that.$canvas_holder.css("height",height+'px');
                        if (img){
                            that.canvas_context.drawImage(img, 0, 0, width, height);
                            that.$canvas_clone = that._cloneCanvas(that.$canvas[0]);
                            that.$canvas_backup = that._cloneCanvas(that.$canvas[0]);

                            //console.log('canvas cloned');
                            //console.log(that.$canvas_clone);
                        }else{
                            that.$canvas_clone = null;
                            that.$canvas_backup = null;
                        }
                        that._cssCanvasCorrection();
                        that.$GUI.toggle(that.imageLoaded);
                        that.$btn_crop.toggle(that.imageLoaded && that.settings.enable_crop);
                        that.$btn_measure.toggle(that.imageLoaded && that.settings.enable_measure);
                        that.$btn_clear.toggle(that.imageLoaded && that.settings.enable_clear);
                        that._resetGUIControl();
                },
                _makeThumbnail:function(){
                    var that = this;
                    //console.log('thumbnail');
                    var cwidth = that.$canvas[0].width;
                    var cheight = that.$canvas[0].height;
                    //console.log(cwidth+','+cheight);
                    var twidth = that.$element.width();
                    var theight = that.$element.height();
                    var w,h,p;
                    if ((cwidth/cheight)>(twidth/theight)){//compare aspect ratios
                        // resize by width
                        w=twidth;
                        p=twidth*100/cwidth;
                        h=cheight*p/100;
                    }else{
                        // resize by height
                        h=theight;
                        p=theight*100/cheight;
                        w=cwidth*p/100;
                    }
                    that.$element_thumbnail.attr( "width", w );
                    that.$element_thumbnail.attr( "height", h );
                    //safari bug, if the canvas element's width or height is 0
                    /*w = w?w:200;
                    h = h?h:200;
                    that.$canvas[0].width = w;
                    that.$canvas[0].height = h;*/
                    that.element_thumbnail_context.drawImage(that.$canvas[0],0,0,w,h);
                    if (that.element_thumbnail_context.canvas.width > 0){ //CHECK WITH RICHY
                        that.settings.onThumbnailSet(that.$canvas);
                        RGBaster.colors(that.element_thumbnail_context, {
                            paletteSize: 10,
                            exclude: [ 'rgb(255,255,255)', 'rgb(0,0,0)' ],  // don't count white
                            success: function(payload){
                                //console.log(payload)
                                that.$element.css('background-color',payload.dominant);
                            }
                        });
                    }
                },

                _takePhoto:function(video){
                        var that = this;
                        that.imageLoaded=true;
                        that.__setImage(video,that.$video.width(),that.$video.height());
                        that._setFileName("capture"+new Date().getTime()+".png");
                        that._toggleCamera(false);
                        setTimeout(function(){that._doForceCrop();}, 10);//I dont know why but it's working...
                },

                _doScan:function(video){
                        var that = this;
                        that._notifyMSG(that.settings.messages.MSG_scanning,5*60*1000);
                        that.$wait.show();
                        that.$scanner_sources.toggle(false);
                        that.$scanner_ui.toggle(false);
                        that.$btn_proceed.toggle(false);
                        that.scanPending = DPLUGIN.imageScanner.scan(that.$scanner_sources.val(),that.$scanner_ui.val(),function(image){
                            //that.imageLoaded=true;
                            that.scanPending=false;
                            if (that.$element.data('state_scanner')){// if it's still waiting for the image take it otherwise discard it
                                that._loadImage(image);//this will call _doForceCrop if needed
                                that._setFileName("scan"+new Date().getTime()+".png");
                                that._toggleScanner(false);
                            }
                        },function(error, message){
                            //console.log(error);
                            that.scanPending=false;
                            if (that.$element.data('state_scanner')){// if it's still waiting for the image show error msg otherwise discard it
                                that._toggleScanner(false);
                                that._notifyMSG(message ? message : that.settings.messages.MSG_scanner_error);
                            }
                        });
                },

                _cssCanvasCorrection:function(){
                        var that = this;
                        //some css corrections
                        if (that.$canvas_holder.height()>that.$canvas_holder.parent().height()){
                            that.$canvas_holder.css('bottom','auto');
                        }else{
                            that.$canvas_holder.css('bottom','0px');
                        }

                        $('.di.dimg-GUI ul').css('max-height',(that.$canvas_holder.parent().height()-110)+'px');
                },
                _cssVideoCorrection:function(){
                        var that = this;
                        //some css corrections
                        if (that.$video.height()>that.$video.parent().height()){
                            that.$video.css('bottom','auto');
                        }else{
                            that.$video.css('bottom','0px');
                        }
                },
                _cssNoImgCorrection:function($thediv){
                        //var that = this;
                        //$('.dimg-noimg',$thediv).each(function(){
                            var fs = Math.min($thediv.parent().width(),$thediv.parent().height());
                            fs = fs*75/100;
                            $thediv.css('font-size', fs+'px');
                            $thediv.css('line-height', $thediv.parent().height()+'px');
                        //});
                },

                _toggeNoImg:function(visible){
                        var that = this;
                        that.$container_noimg.toggle(visible);
                        that._cssNoImgCorrection(that.$container_noimg);
                },

                _toggeNoImgElement:function(visible){
                        var that = this;
                        that.$element_noimg.toggle(visible);
                        that._cssNoImgCorrection(that.$element_noimg);
                        that.$element_thumbnail.toggle(!visible);
                        if (visible) {
                            that.$element.css('background-color',that._elemet_backround);
                        }
                },

                _createContainer:function(){
                        var that = this;
                        that.$element.addClass('di dimg');
                        if (that.settings.width) { that.$element.width(that.settings.width); }
                        if (that.settings.height) { that.$element.height(that.settings.height); }
                        that._elemet_backround =that.$element.css('background-color');

                        that.$element_noimg = $('<i class="di dimg-noimg '+that.settings.noImageIcon+'" title="'+that.settings.messages.drag_here+'"></i>');
                        that.$element.append(that.$element_noimg);
                        that.$element_thumbnail = $("<canvas></canvas>").addClass("di dimg-element-thumbnail");that.$element.append(that.$element_thumbnail);
                        that.element_thumbnail_context = that.$element_thumbnail[0].getContext("2d");

                        that.$container = $("<div></div>").addClass("di dimg-container");//$('body').append(that.$container);
                        that.$container_top = $("<div></div>").addClass("di dimg-container-top");that.$container.append(that.$container_top);
                        that.$container_middle = $("<div></div>").addClass("di dimg-container-middle");that.$container.append(that.$container_middle);
                        that.$container_bottom = $("<div></div>").addClass("di dimg-container-bottom");that.$container.append(that.$container_bottom);
                        that.$GUI = $("<div></div>").addClass("di dimg-GUI");that.$container.append(that.$GUI);
                        that.$wait = $('<div><i class="fas fa-circle-notch fa-spin"></i></div>').addClass("di dimg-wait");that.$container.append(that.$wait);
                        that.$wait.hide();
                        that.$msg = $('<div><i class="fas fa-info-circle"></i></div>').addClass("di dimg-msg");that.$container.append(that.$msg);
                        that.$msg.hide();

                        that.$container_middle_left = $("<div></div>").addClass("di dimg-container-middle-left");that.$container_middle.append(that.$container_middle_left);
                        that.$container_noimg = $('<i class="di dimg-noimg '+that.settings.noImageIcon+'" title="'+that.settings.messages.drag_here+'"></i>');
                        that.$container_middle_left.append(that.$container_noimg);
                        that.$container_middle_right = $("<div></div>").addClass("di dimg-container-middle-right");that.$container_middle.append(that.$container_middle_right);

                        that.$btn_doupload = $('<button title="'+that.settings.messages.upload+'"><i class="fas fa-upload"></i></button>').addClass("di dimg-overlay-button dimg-btn-doupload ");that.$container_middle.append(that.$btn_doupload);
                        that.$btn_doupload.toggle(that.settings.enable_doupload);
                        that.$btn_docancel = $('<button title="'+that.settings.messages.cancel+'"><i class="fas fa-times"></i></button>').addClass("di dimg-overlay-button dimg-btn-docancel ");that.$container_middle.append(that.$btn_docancel);

                        that.$btn_camera = $('<button title="'+that.settings.messages.camera+'"><i class="fas fa-video"></i></button>').addClass("di dimg-overlay-button dimg-btn-camera ");that.$container_middle.append(that.$btn_camera);
                        that.$btn_camera.toggle(that.settings.enable_camera);
                        that.$btn_upload = $('<button title="'+that.settings.messages.loadfile+'"><i class="far fa-image"></i></button>').addClass("di dimg-overlay-button dimg-btn-upload ");that.$container_middle.append(that.$btn_upload);
                        that.$btn_upload.toggle(that.settings.enable_upload);
                        that.$btn_scanner = $('<button title="'+that.settings.messages.scanner+'"><i class="far fa-hdd"></i></button>').addClass("di dimg-overlay-button dimg-btn-scanner ");that.$container_middle.append(that.$btn_scanner);
                        that.$btn_scanner.toggle(that.settings.enable_scanner);
                        that.$btn_crop = $('<button title="'+that.settings.messages.GUI_crop+'"><i class="fas fa-crop"></i></button>').addClass("di dimg-overlay-button dimg-btn-crop ");that.$container_middle.append(that.$btn_crop);
                        that.$btn_crop.hide();
                        that.$btn_measure = $('<button title="'+that.settings.messages.measure+'"><i class="fas fa-sliders-h"></i></button>').addClass("di dimg-overlay-button dimg-btn-measure ");that.$container_middle.append(that.$btn_measure);
                        that.$btn_measure.hide();
                        that.$btn_clear = $('<button title="'+that.settings.messages.clear+'"><i class="fas fa-trash"></i></button>').addClass("di dimg-overlay-button dimg-btn-clear ");that.$container_middle.append(that.$btn_clear);
                        that.$btn_clear.hide();
                        that.$btn_back = $('<button title="'+that.settings.messages.back+'"><i class="fas fa-arrow-left"></i></button>').addClass("di dimg-overlay-button dimg-btn-back ");that.$container_middle.append(that.$btn_back);
                        that.$btn_back.hide();

                        that.$btn_proceed = $('<button></button>').addClass("di dimg-overlay-button dimg-btn-proceed ");that.$container_middle.append(that.$btn_proceed);
                        that.$btn_proceed.hide();

                        that.$canvas_holder = $("<div></div>").addClass("di dimg-canvas-holder");that.$container_middle_left.append(that.$canvas_holder);
                        that.$canvas = $("<canvas></canvas>").addClass("di dimg-canvas");that.$canvas_holder.append(that.$canvas);
                        that.canvas_context = that.$canvas[0].getContext("2d");
                        that.$video = $('<video id="video" autoplay="autoplay" controls="false"></video>').addClass("di dimg-video");that.$container_middle_left.append(that.$video);
                        that.$video.hide();

                        that.$video_sources = $('<select></select>').addClass("di dimg-video-sources");that.$container_middle.append(that.$video_sources);
                        that.$video_sources.hide();

                        that.$scanner_sources = $('<select></select>').addClass("di dimg-scanner-sources");that.$container_middle.append(that.$scanner_sources);
                        that.$scanner_sources.hide();

                        that.$scanner_ui = $('<select></select>').addClass("di dimg-scanner-ui");that.$container_middle.append(that.$scanner_ui);
                        that.$scanner_ui.append($('<option></option>').val(0).prop('selected',true).text(that.settings.messages.scan_without_ui));
                        that.$scanner_ui.append($('<option></option>').val(1).text(that.settings.messages.scan_with_ui));
                        that.$scanner_ui.hide();

                        that._toggeNoImg(true);
                        that._toggeNoImgElement(true);

                        that._initGUI();
                },

                _resetGUIControl:function(){
                        var that = this;
                        that.guiControl.resize = 1.0;
                        that.guiControl.rotate = that.guiControl.old_rotate = 0;
                        that._resetGUIControlColor();
                },
                _resetGUIControlColor:function(){
                        var that = this;
                        that.guiControl.brightness = 0;
                        that.guiControl.contrast = 0;
                        that.guiControl.saturation = 0;
                        that.guiControl.vibrance = 0;
                        that.guiControl.exposure = 0;
                        that.guiControl.hue = 0;
                        that.guiControl.sepia = 0;
                },
                _commitImageChanges:function(op){
                        var that = this;
                        if (op!=that._commitOP)	{
                            that._commitOP=op;
                            that._copyCanvas(that.$canvas, that.$canvas_clone);
                        }
                },
                _doImageColorChange:function(){
                        var that = this;
                        that.$wait.show();
                        that._commitImageChanges(101);
                        that._copyCanvas(that.$canvas_clone, that.$canvas);
                        Caman(that.$canvas[0],function(){
                            this.reloadCanvasData();
                            if (that.guiControl.brightness){ this.brightness(that.guiControl.brightness); }
                            if (that.guiControl.contrast){ this.contrast(that.guiControl.contrast); }
                            if (that.guiControl.saturation){ this.saturation(that.guiControl.saturation); }
                            if (that.guiControl.vibrance){ this.vibrance(that.guiControl.vibrance); }
                            if (that.guiControl.exposure){ this.exposure(that.guiControl.exposure); }
                            if (that.guiControl.hue){ this.hue(that.guiControl.hue); }
                            if (that.guiControl.sepia){ this.sepia(that.guiControl.sepia); }
                            this.render(function(){
                                that.$wait.hide();
                            });
                        });
                },
                _doImageChange:function(op){
                        var that = this;
                        that.$wait.show();
                        that._commitImageChanges(op);
                        Caman(that.$canvas[0],function(){
                            this.reloadCanvasData();
                            switch(op) {
                                case 'invert':
                                    this.invert();
                                    break;
                                case 'greyscale':
                                    this.greyscale();
                                    break;
                                default:
                            }
                            this.render(function(){
                                that.$wait.hide();
                            });
                        });
                        that._resetGUIControlColor();
                },

                _initGUI:function(){
                    var that = this;
                    that.guiControlObj = function(){
                        this.resize = 1.0;
                        this.rotate = this.old_rotate = 0;
                        this.reset = function(){
                            that._resetGUIControl();
                            that._copyCanvas(that.$canvas_backup, that.$canvas);
                            that._copyCanvas(that.$canvas_backup, that.$canvas_clone);

                        };
                        this.crop = function(){
                            that._toggleCrop();
                        };
                        this.invert = function(){
                            that._doImageChange('invert');
                        };
                        this.greyscale = function(){
                            that._doImageChange('greyscale');
                        };
                        this.brightness = 0;
                        this.contrast = 0;
                        this.saturation = 0;
                        this.vibrance = 0;
                        this.exposure = 0;
                        this.hue = 0;
                        this.sepia = 0;
                    };

                    that.guiControl = new that.guiControlObj();
                    dat.GUI.TEXT_OPEN = that.settings.messages.GUI_close;
                    dat.GUI.TEXT_CLOSED = that.settings.messages.GUI_open;
                    that.guiTools = new dat.GUI({autoplace:false, width:270, name:''});

                    var f1 = that.guiTools.addFolder(that.settings.messages.GUI_folder_resize);
                    f1.open();
                    var f2 = that.guiTools.addFolder(that.settings.messages.GUI_folder_tools);
                    f2.open();
                    f1.add(that.guiControl, 'resize', 0.1,3).name('<i class="fas fa-expand-arrows-alt"></i> '+that.settings.messages.GUI_resize).listen().onChange(function(){that.$wait.show();}).onFinishChange(function(value){
                        that._commitImageChanges(100);
                        that.$wait.show();
                        var width = that.$canvas_clone.attr("width")*value;
                        var height = that.$canvas_clone.attr("height")*value;
                        //var ratio = width/height;
                        var size = that.__checksize(width, height);
                        width=size.width; height=size.height;
                        that._copyCanvas(that.$canvas_clone, that.$canvas, width, height);
                        that.$wait.hide();
                        that._resetGUIControlColor();
                    });
                    f1.add(that.guiControl, 'rotate', -180,180).step(90).name('<i class="fas fa-undo"></i> '+that.settings.messages.GUI_rotate).listen().onFinishChange(function(value){
                        var TO_RADIANS = Math.PI/180;
                        that._copyCanvas(that.$canvas, that.$canvas_clone);
                        that.guiControl.resize = 1;
                        var angle = value-that.guiControl.old_rotate;
                        if ((angle==90) || (angle==-90)){
                            that.$canvas.attr("width", that.$canvas_clone.attr("height"));
                            that.$canvas.attr("height", that.$canvas_clone.attr("width"));
                        }else{
                            that.$canvas.attr("width", that.$canvas_clone.attr("width"));
                            that.$canvas.attr("height", that.$canvas_clone.attr("height"));
                        }
                        that.$canvas_holder.css("width",that.$canvas.attr("width")+'px');
                        that.$canvas_holder.css("height",that.$canvas.attr("height")+'px');
                        //http://creativejs.com/2012/01/day-10-drawing-rotated-images-into-canvas/
                        that.canvas_context.save();
                        that.canvas_context.drawImage(that.$canvas[0], -(that.$canvas[0].width/2), -(that.$canvas[0].height/2));
                        that.canvas_context.translate((that.$canvas[0].width/2), (that.$canvas[0].height/2));
                        that.canvas_context.rotate(angle * TO_RADIANS);
                        that.canvas_context.drawImage(that.$canvas_clone[0], -(that.$canvas_clone[0].width/2), -(that.$canvas_clone[0].height/2));
                        that.canvas_context.restore();
                        //that.$canvas_clone = that._cloneCanvas(that.$canvas[0]);
                        that._copyCanvas(that.$canvas, that.$canvas_clone);
                        that._cssCanvasCorrection();
                        that.guiControl.old_rotate = value;
                        that._resetGUIControlColor();
                    });
                    f1.add(that.guiControl, 'crop').name('<i class="fas fa-crop"></i> '+that.settings.messages.GUI_crop);

                    f2.add(that.guiControl, 'brightness',-100,100).name(that.settings.messages.GUI_brightness).listen().onFinishChange(function(value){
                        that._doImageColorChange();
                    });
                    f2.add(that.guiControl, 'contrast',-100,100).name(that.settings.messages.GUI_contrast).listen().onFinishChange(function(value){
                        that._doImageColorChange();
                    });
                    f2.add(that.guiControl, 'saturation',-100,100).name(that.settings.messages.GUI_saturation).listen().onFinishChange(function(value){
                        that._doImageColorChange();
                    });

                    f2.add(that.guiControl, 'vibrance',-100,100).name(that.settings.messages.GUI_vibrance).listen().onFinishChange(function(value){
                        that._doImageColorChange();
                    });
                    f2.add(that.guiControl, 'exposure',-100,100).name(that.settings.messages.GUI_exposure).listen().onFinishChange(function(value){
                        that._doImageColorChange();
                    });
                    f2.add(that.guiControl, 'hue',0,100).name(that.settings.messages.GUI_hue).listen().onFinishChange(function(value){
                        that._doImageColorChange();
                    });
                    f2.add(that.guiControl, 'sepia',0,100).name(that.settings.messages.GUI_sepia).listen().onFinishChange(function(value){
                        that._doImageColorChange();
                    });

                    f2.add(that.guiControl, 'invert').name(that.settings.messages.GUI_invert);
                    f2.add(that.guiControl, 'greyscale').name(that.settings.messages.GUI_greyscale);

                    that.guiTools.add(that.guiControl, 'reset').name(that.settings.messages.GUI_reset);

                    that.$GUI.append(that.guiTools.domElement);
                    that.$GUI.toggle(false);
                },

                _openFancyBox:function(callback){
                        if (typeof callback == 'undefined'){ callback = $.noop; }
                        var that = this;
                        if (!that._opened){
                            $.fancybox(that.$container,{
                                title:'',
                                openEffect:'elastic',
                                closeEffect:'elastic',
                                //padding:10,
                                padding:10,
                                margin:30,
                                width   : '100%',
                                height  : '100%',
                                autoCenter:false,
                                autoSize:false,
                                showCloseButton:false,
                                closeBtn:false,
                                //autoResize: false,
                                helpers   : {
                                    overlay : {closeClick: false} // prevents closing when clicking OUTSIDE fancybox
                                },
                                afterLoad : function() {
                                    that._opened = true;
                                    $(".fancybox-overlay .fancybox-inner").addClass("di");
                                },
                                afterShow:function(){
                                    that._toggleCamera(false);
                                    that._toggleScanner(false);
                                    that._toggleCrop(false);
                                    that._toggleMeasure(false);
                                    that._cssNoImgCorrection(that.$container_noimg);
                                    that._cssCanvasCorrection();
                                    /*$('.fancybox-wrap').resizable({
                                        alsoResize: ".fancybox-inner, .fancybox-image"
                                    });*/
                                    that._loadVideoSources( function(){
                                        that.$video_sources.toggle(/*visible && */(that.video_sources_avaiable>1));
                                    });//end loadvideosources

                                    callback();
                                },
                                afterClose : function(){

                                if (that.uploader){ that.uploader.stop(); }

                                    that._opened = false;
                                    that._killVideoStream();
                                    that._toggleCamera(false);
                                    that._toggleScanner(false);
                                    that._toggleCrop(false);
                                    that._toggleMeasure(false);
                                }
                            });
                        }
                },
                _killVideoStream:function(){
                        var that = this;
                        if (that.videoStream){
                            //that.videoStream.stop(); see https://developers.google.com/web/updates/2015/07/mediastream-deprecations?hl=en
                            if (that.videoStream.stop){
                                that.videoStream.stop();
                            }else{
                                var track = that.videoStream.getTracks()[0];
                                track.stop();
                            }
                            that.videoStream=null;
                            //that.$video.prop("src", null);
                        }
                },
                _createUploader:function(){
                        var that = this;
                        that.uploader = new plupload.Uploader({
                            headers:{'dent-upload':'true'}, // this will generate HTTP_DENT_UPLOAD headear in upload request
                            runtimes : 'html5,html4',
                            browse_button : that.$btn_upload[0], // you can pass in id...
                            container: that.element, // ... or DOM Element itself
                            drop_element : that.settings.enable_upload ? [that.element, that.$canvas[0], that.$container[0]] : [],
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
                                    //console.log(that.uploader);
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
                                    file.origName = file.name;
                                    if (that.settings.generateUniqueFilenames){
                                        file.name = file.id + '.' + file.name.split('.').pop();
                                    }
                                },
                                FilesAdded: function(up, files) {
                                    that.uploader.haserror = false;
                                    if (that._finalupload){ that._finalupload=false; /*console.log('nono');*/ return; }
                                    if (up.doTriggerElemClick){ that.$element.trigger('click'); }
                                    /*
                                    //allow only one file per upload !! NOT WORKING Check WHY
                                    while (up.files.length > 1) {
                                        up.removeFile(up.files[0]);
                                    }*/
                                    plupload.each(up.files, function(file) {
                                        setTimeout(function(){
                                            that._setFileName(file.name);
                                            var preloader = new mOxie.Image();  //Wiki: https://github.com/moxiecode/moxie/wiki/Image
                                            preloader.onload = function() {
                                                //preloader.downsize( 300, 300 );
                                                that._loadImage(preloader.getAsDataURL());
                                                that.uploader.splice(0,100);// allow only one file
                                            };
                                            preloader.load( file.getSource() );  //Wiki: https://github.com/moxiecode/plupload/wiki/File
                                        },up.doTriggerElemClick ? 300:0);

                                        return false;// allow only one file
                                    });
                                },
                                UploadProgress: function(up, file) {
                                    //console.log('upload');
                                    //console.log(file);
                                },
                                FileUploaded:function(up, file, object){
                                    //console.log(up);
                                    //console.log(file);
                                    //console.log(object);
                                    var response = JSON.parse(object.response);
                                    //console.log(response);
                                    if (response.OK) {
                                        //response.file contains the the uploaded file
                                        that.settings.onUpload(response.file, up, file, object, function(result){
                                            that._toggeNoImgElement(!result);
                                            if (result){
                                                that._makeThumbnail();
                                            }
                                        });
                                    } else {
                                        that.uploader.haserror = true;
                                        that._showMSG('Upload Server Error:'+response.error.message);
                                    }
                                },
                                UploadComplete: function(up) {
                                    //console.log('complete');
                                    that.uploader.splice(0,100);
                                    that.$wait.hide();
                                    if (!that.uploader.haserror){
                                        $.fancybox.close();
                                    }
                                },
                                Error: function(up, err) {//some upload error
                                    //console.log(err);
                                    that._showMSG('Upload Error:'+err.message);
                                    that.$wait.hide();
                                }
                            }
                        });
                        that.uploader.haserror = false;
                        that.uploader.init();
                },

                _doCrop:function(){
                        var that = this;
                        if (that.$element.data('state_crop')){
                            if ((that.settings.minim>that.crop_sel.w)||(that.settings.minim>that.crop_sel.h)){
                                that._notifyMSG(that.settings.messages.MSG_crop_small);
                                return;
                            }
                            if ((that.settings.maxim<that.crop_sel.w)||(that.settings.maxim<that.crop_sel.h)){
                                that._notifyMSG(that.settings.messages.MSG_crop_large);
                                return;
                            }
                            that._hideMSG();
                            that.$canvas.attr('width',that.crop_sel.w);
                            that.$canvas.attr('height',that.crop_sel.h);
                            that.$canvas_holder.css("width",that.crop_sel.w+'px');
                            that.$canvas_holder.css("height",that.crop_sel.h+'px');
                            that.canvas_context.drawImage(that.$canvas_crop[0], that.crop_sel.x, that.crop_sel.y, that.crop_sel.w, that.crop_sel.h,0,0,that.crop_sel.w, that.crop_sel.h);
                            //that.$canvas_clone = that._cloneCanvas(that.$canvas[0]);
                            that._copyCanvas(that.$canvas, that.$canvas_clone);
                            that._toggleCrop(false);
                            that._cssCanvasCorrection();
                            that._resetGUIControl();
                        }
                },

                _toggleCrop:function(active){
                        var that = this;
                        if (typeof active !='undefined') { that.$element.data('state_crop',!active); }
                        var cropVisible = function(visible){
                            that.$canvas.toggle(!visible);
                            that.$GUI.toggle(visible? false : that.imageLoaded);
                            that._toggeNoImg(visible? false : !that.imageLoaded);
                            that.$btn_proceed.html('<i class="fas fa-crop"></i>').attr('title', that.settings.messages.docrop).toggle(visible);
                            that.$btn_camera.toggle(!visible && that.settings.enable_camera);
                            that.$btn_scanner.toggle(!visible && that.settings.enable_scanner);
                            that.$btn_back.toggle(visible/* && !that._flag_forceCropping*/);
                            that.$btn_upload.toggle(!visible && that.settings.enable_upload);
                            that.$btn_crop.toggle(visible ? false : that.imageLoaded && that.settings.enable_crop);
                            that.$btn_measure.toggle(visible ? false : that.imageLoaded && that.settings.enable_measure);
                            that.$btn_clear.toggle(visible ? false : that.imageLoaded && that.settings.enable_clear);
                            that.$btn_doupload.toggle(!visible && that.settings.enable_doupload);
                            that.$btn_docancel.toggle(!visible ||!that._flag_forceCropping);
                            that.$container_middle_left.scrollTop(0);
                            that.$container_middle_left.scrollLeft(0);
                        };
                        that.$element.data('state_crop_force',that._flag_forceCropping);
                        if (that.$element.data('state_crop')){
                            that.$element.data('state_crop',false);
                            cropVisible(false);
                            that.$canvas_crop=null;
                            if (that.jcrop){
                                that.jcrop.destroy();
                                that.jcrop=null;
                            }
                        }else{
                            that.$element.data('state_crop',true);
                            cropVisible(true);
                            that.$canvas_crop = that._cloneCanvas(that.$canvas[0]);
                            that.$canvas_holder.append(that.$canvas_crop);

                            that.crop_sel = that.settings.initialCrop;
                            var jcrop_defaults = {
                                bgFade: true,
                                setSelect: [that.crop_sel.x,that.crop_sel.y,that.crop_sel.x2,that.crop_sel.y2],
                                //allowSelect:false,
                                bgOpacity:0.4,
                                onChange:function(c){
                                    that.crop_sel=c;
                                    if (that.settings.jcrop.onChange){
                                        that.settings.jcrop.onChange(c);
                                    }
                                },
                                onSelect:function(c){
                                    that.crop_sel=c;
                                    if (that.settings.jcrop.onSelect){
                                        that.settings.jcrop.onSelect(c);
                                    }
                                },
                            };
                            var jcrop_options = $.extend( true ,{},  that.settings.jcrop, jcrop_defaults );
                            that.$canvas_crop.Jcrop(jcrop_options,function(){
                                that.jcrop = this;
                            });
                        }
                },
                _toggleMeasure:function(active){
                        var that = this;
                        if (typeof active !='undefined') { that.$element.data('state_measure',!active); }
                        var measureVisible = function(visible){
                            //that.$canvas.toggle(!visible);
                            that.$GUI.toggle(visible? false : that.imageLoaded);
                            that._toggeNoImg(visible? false : !that.imageLoaded);
                            that.$btn_proceed.toggle(false);
                            that.$btn_camera.toggle(!visible && that.settings.enable_camera);
                            that.$btn_scanner.toggle(!visible && that.settings.enable_scanner);
                            that.$btn_back.toggle(visible/* && !that._flag_forceCropping*/);
                            that.$btn_upload.toggle(!visible && that.settings.enable_upload);
                            that.$btn_crop.toggle(visible ? false : that.imageLoaded && that.settings.enable_crop);
                            that.$btn_measure.toggle(visible ? false : that.imageLoaded && that.settings.enable_measure);
                            that.$btn_clear.toggle(visible ? false : that.imageLoaded && that.settings.enable_clear);
                            that.$btn_doupload.toggle(!visible && that.settings.enable_doupload);
                            that.$btn_docancel.toggle(!visible ||!that._flag_forceCropping);
                            that.$container_middle_left.scrollTop(0);
                            that.$container_middle_left.scrollLeft(0);
                        };
                        if (that.$element.data('state_measure')){
                            that.$element.data('state_measure',false);
                            measureVisible(false);
                            if (that.$canvas_measure){ that.$canvas_measure.clear().renderAll(); }
                            $(".di.dimg-measure-container", that.$canvas_holder).remove();
                            that.$canvas_measure=null;
                        }else{
                            that.$element.data('state_measure',true);
                            measureVisible(true);
                            that._notifyMSG(that.settings.messages.MSG_measure_alert,3*1000);

                            that.$canvas_measure = that._cloneCanvas(that.$canvas[0]);
                            that.$canvas_holder.append(that.$canvas_measure);
                            that.$canvas_measure = new fabric.Canvas(that.$canvas_measure[0], { selection: false, containerClass:'di dimg-measure-container' ,cursor:'pointer',moveCursor:'pointer' });
                            fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

                            var lineRef = that._fabric_makeLine([ 140, 40, 140, 140 ],'yellow'),
                                lineMeas = that._fabric_makeLine([ 240, 40, 240, 240 ],'red');
                            that.$canvas_measure.add(lineRef, lineMeas);
                            that.$canvas_measure.add(
                                that._fabric_makeText(that.settings.messages.measure_ref, lineRef, 'white', '#444'),
                                that._fabric_makeIText('10 mm', lineRef, 'white'),
                                that._fabric_makeText(/*that.settings.messages.measure_dist+*/' -- mm', lineMeas, 'white', '#444')
                            );
                            that.$canvas_measure.add(
                                that._fabric_makeCircle(lineRef.get('x1'), lineRef.get('y1'), lineRef, null,'yellow'),
                                that._fabric_makeCircle(lineRef.get('x2'), lineRef.get('y2'), null, lineRef,'yellow'),
                                that._fabric_makeCircle(lineMeas.get('x1'), lineMeas.get('y1'), lineMeas, null,'red'),
                                that._fabric_makeCircle(lineMeas.get('x2'), lineMeas.get('y2'), null, lineMeas,'red')
                                /*that._fabric_makeDot(lineRef.get('x1'), lineRef.get('y1'), lineRef, null,'yellow'),
                                that._fabric_makeDot(lineRef.get('x2'), lineRef.get('y2'), null, lineRef,'yellow'),
                                that._fabric_makeDot(lineMeas.get('x1'), lineMeas.get('y1'), lineMeas, null,'red'),
                                that._fabric_makeDot(lineMeas.get('x2'), lineMeas.get('y2'), null, lineMeas,'red')*/
                            );
                            var calcmeasure = function(line1,line2){
                                if (lineMeas && lineMeas.text && lineRef && lineRef.itext){
                                    var l = parseFloat(lineRef.itext.get('text'));
                                    l = isNaN(l)? 10:l;
                                    lineRef.itext.set({text:(Math.round(l*100)/100).toString()+' mm'});
                                    var d = that._fabric_lineLength(lineMeas) / that._fabric_lineLength(lineRef) * l;
                                    lineMeas.text.set({text:/*that.settings.messages.measure_dist+': '*/''+(Math.round(d*100)/100).toString()+' mm'});
                                }
                                that.$canvas_measure.renderAll();
                            };

                            that.$canvas_measure.on('object:moving', function(e) {
                                var p = e.target;
                                if (p.line1){ p.line1.set({ 'x1': p.left, 'y1': p.top }); }
                                if (p.line2){ p.line2.set({ 'x2': p.left, 'y2': p.top }); }

                                var lline = p.line1 || p.line2;
                                if (lline && lline.text){ lline.text.set({ left:(lline.x1+lline.x2)/2, top: -10+(lline.y1+lline.y2)/2}); }
                                if (lline && lline.itext){
                                    lline.itext.set({ left:(lline.x1+lline.x2)/2, top: +10+(lline.y1+lline.y2)/2});
                                    lline.itext.enterEditing(); // hack for focus to follow the moved itext
                                }

                                calcmeasure();
                                //that.$canvas_measure.renderAll();
                            });
                            that.$canvas_measure.on('text:changed', function(e) {
                                if (lineMeas && lineMeas.text && lineRef && lineRef.itext){
                                    var l = parseFloat(lineRef.itext.get('text'));
                                    l = isNaN(l)? 10:l;
                                    var d = that._fabric_lineLength(lineMeas) / that._fabric_lineLength(lineRef) * l;
                                    lineMeas.text.set({text:''+(Math.round(d*100)/100).toString()+' mm'});
                                }
                                if (e.target.text===''){ e.target.text='10 mm'; }
                                //console.log('text:changed', e.target, e);
                                //e.preventDefault();
                            });
                            that.$canvas_measure.on('editing:exited', function(e) {
                                //console.log('exit');
                                //console.log('text:changed', e.target, e);
                            });

                            lineRef.text.set({ left:(lineRef.x1+lineRef.x2)/2, top: -8+(lineRef.y1+lineRef.y2)/2});
                            lineRef.itext.set({ left:(lineRef.x1+lineRef.x2)/2, top: +8+(lineRef.y1+lineRef.y2)/2});
                            calcmeasure();
                        }
                },

                __cameraVisible: function(visible){
                        var that = this;
                        that.$element.data('state_camera',visible);
                        that.$canvas_holder.toggle(!visible);
                        that.$video.toggle(visible);
                        that.$btn_proceed.html('<i class="fas fa-camera"></i>').attr('title', that.settings.messages.takephoto).toggle(visible);
                        that.$btn_camera.toggle(!visible && that.settings.enable_camera);
                        that.$btn_scanner.toggle(!visible && that.settings.enable_scanner);
                        that.$btn_back.toggle(visible);
                        that.$btn_crop.toggle(visible ? false : that.imageLoaded && that.settings.enable_crop);
                        that.$btn_measure.toggle(visible ? false : that.imageLoaded && that.settings.enable_measure);
                        that.$btn_clear.toggle(visible ? false : that.imageLoaded && that.settings.enable_clear);
                        that.$btn_upload.toggle(!visible && that.settings.enable_upload);
                        that.$btn_doupload.toggle(!visible && that.settings.enable_doupload);
                        that.$GUI.toggle(visible ? false : that.imageLoaded);
                        that._toggeNoImg(visible ? false : !that.imageLoaded);
                        that._hideMSG();
                        that.$wait.hide();

                },
                __scannerVisible: function(visible){
                        var that = this;
                        that.$element.data('state_scanner',visible);
                        that.$canvas_holder.toggle(!visible);
                        that.$video.toggle(false);
                        that.$btn_proceed.html('<i class="far fa-hdd"></i>').attr('title', that.settings.messages.doscan).toggle(visible);
                        that.$btn_camera.toggle(!visible && that.settings.enable_camera);
                        that.$btn_scanner.toggle(!visible && that.settings.enable_scanner);
                        that.$btn_back.toggle(visible);
                        that.$btn_crop.toggle(visible ? false : that.imageLoaded && that.settings.enable_crop);
                        that.$btn_measure.toggle(visible ? false : that.imageLoaded && that.settings.enable_measure);
                        that.$btn_clear.toggle(visible ? false : that.imageLoaded && that.settings.enable_clear);
                        that.$btn_upload.toggle(!visible && that.settings.enable_upload);
                        that.$btn_doupload.toggle(!visible && that.settings.enable_doupload);
                        that.$GUI.toggle(visible ? false : that.imageLoaded);
                        that._toggeNoImg(visible ? false : !that.imageLoaded);
                        that._hideMSG();
                        that.$wait.hide();

                        that.$scanner_sources.toggle(visible /*&& (that.scanner_sources_avaiable>1)*/);
                        that.$scanner_ui.toggle(visible /*&& (that.scanner_sources_avaiable>1)*/);
                },

                _toggleCamera:function(active){
                        var that = this;
                        if (typeof active !='undefined') { that.$element.data('state_camera',!active); }

                        var cameraPreVisible = function(){
                            that.$canvas_holder.toggle(false);
                            that.$video.toggle(false);
                            that.$btn_crop.toggle(false);
                            that.$btn_measure.toggle(false);
                            that.$btn_clear.toggle(false);
                            that.$btn_camera.toggle(false);
                            that.$btn_scanner.toggle(false);
                            that.$btn_upload.toggle(false);
                            that.$btn_doupload.toggle(false);
                            that.$GUI.toggle(false);
                            that._toggeNoImg(false);
                        };

                        if (that.$element.data('state_camera')){
                            that.__cameraVisible(false);
                        } else {
                            if (!that.videoStream){
                                //if (!navigator.getUserMedia){// on iOS chrome and safari navigator.getUserMedia is not avaiable
                                if (!(navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia)){
                                    that._notifyMSG(that.settings.messages.MSG_no_camera);
                                    return;
                                }
                                cameraPreVisible();
                                that._showMSG(that.settings.messages.MSG_access_camera);
                                that.$wait.show();
//                                that._loadVideoSources( function(){
                                    var getMediaConfig = function(){
                                        var config = {
//                                            video: { width: 1280, height: 720 },
                                            video: true,
                                            audio: false,
                                        };
                                        //https://www.html5rocks.com/en/tutorials/getusermedia/intro/
                                        //if (that.video_sources_avaiable>1){
                                        config.video.deviceId = {exact: that.$video_sources.val()};
                                        //}
                                        return config;
                                    };
                                    //initialize the new camera
                                    navigator.mediaDevices.getUserMedia(getMediaConfig()/*{ video: true, audio: false }*/)
                                    .then(function(stream) {
                                        //https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
                                        that.videoStream = stream;
                                        that.$video[0].srcObject = stream;
                                        that.$wait.show();that._hideMSG();
                                        //that.__cameraVisible called on $video play event !!!!!!!!!!!!!!!!!!!
                                    })
                                    .catch(function(err) {
                                        //console.log(err.message);
                                        console.warn("APP getUserMedia error! " + err);
                                        that.__cameraVisible(false);
                                        that._notifyMSG(that.settings.messages.MSG_no_camera);
                                        if (DENT && DENT.remoteLOG) {
                                            DENT.remoteLOG.log('dimg getUserMedia error', 1002, err.name+' '+err.message, 0, 0);
                                        }
                                        //https://addpipe.com/blog/getusermedia-video-constraints/
                                        //https://addpipe.com/blog/common-getusermedia-errors/
                                        /* handle the error */
                                        /*if (err.name=="NotFoundError" || err.name == "DevicesNotFoundError" ){
                                            //required track is missing
                                        } else if (err.name=="NotReadableError" || err.name == "TrackStartError" ){
                                            //webcam or mic are already in use
                                        } else if (err.name=="OverconstrainedError" || err.name == "ConstraintNotSatisfiedError" ){
                                            //constraints can not be satisfied by avb. devices
                                        } else if (err.name=="NotAllowedError" || err.name == "PermissionDeniedError" ){
                                            //permission denied in browser
                                        } else if (err.name=="TypeError" || err.name == "TypeError" ){
                                            //empty constraints object
                                        } else {
                                            //other errors
                                        }    */
                                    });

//                                });//end loadvideosources
                            }else{
                                that.__cameraVisible(true);
                            }
                        }
                },

                _toggleScanner:function(active){
                        var that = this;
                        if (typeof active !='undefined') { that.$element.data('state_scanner',!active); }

                        var scannerPreVisible = function(){
                            that.$canvas_holder.toggle(false);
                            that.$video.toggle(false);
                            that.$btn_crop.toggle(false);
                            that.$btn_measure.toggle(false);
                            that.$btn_clear.toggle(false);
                            that.$btn_camera.toggle(false);
                            that.$btn_scanner.toggle(false);
                            that.$btn_upload.toggle(false);
                            that.$btn_doupload.toggle(false);
                            that.$GUI.toggle(false);
                            that._toggeNoImg(false);
                            that.$scanner_sources.toggle(false);
                            that.$scanner_ui.toggle(false);

                        };

                        if (that.$element.data('state_scanner')){
                            that.__scannerVisible(false);
                        } else {
                            if ((DPLUGIN && DPLUGIN.enabled && DPLUGIN.current_version>0)){
                                scannerPreVisible();
                                that._showMSG(that.settings.messages.MSG_access_scanner);
                                that.$wait.show();
                                DPLUGIN.imageScanner.getDevices(function(scanners){
                                    var $opt='';
                                    that.$scanner_sources.empty();
                                    $.each(scanners, function(sid,sname){
                                        $opt = $('<option></option>').val(sid).prop('selected',sid==that.selectedScannerId).text(sname);
                                        that.$scanner_sources.append($opt);
                                    });
                                    that.__scannerVisible(true);
                                },function(error, message){
                                    that.__scannerVisible(false);
                                    that._notifyMSG(message ? message : that.settings.messages.MSG_no_scanner);
                                });
                            }else{
                                that._notifyMSG(that.settings.messages.MSG_no_scanner);
                            }
                        }
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

                _loadVideoSources:function(callback){
                    var that=this;
                    if (typeof callback == 'undefined'){ callback = $.noop; }
                    that.$video_sources.empty();
                    that.video_sources_avaiable = 0;
                    if ((navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia)){
                        //https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices
                        navigator.mediaDevices.enumerateDevices()
                        .then(function(devices){
                            var cntVideoSource = 0; var $opt;
                            devices.forEach(function(device) {
                                if (device.kind == 'videoinput') {
                                    cntVideoSource += 1;
                                    if (cntVideoSource==1 && that.selectedCameraId==''){
                                        that.selectedCameraId=device.deviceId;
                                    }
                                    $opt = $('<option></option>').val(device.deviceId).prop('selected',device.deviceId==that.selectedCameraId ? true : false).text(device.label || that.settings.messages.camera +' '+cntVideoSource);
                                    that.$video_sources.append($opt);
                                }
                            });

                            that.video_sources_avaiable = cntVideoSource;
                            callback();
                        })
                        .catch(function(err){
                            //console.log(err.name + ": " + err.message);
                            callback();
                        });
                    }
                },
                init: function () {
                        var that = this;
                        // Place initialization logic here
                        // You already have access to the DOM element and
                        // the options via the instance, e.g. this.element
                        // and this.settings
                        // you can add more functions like the one below and
                        // call them like so: this.yourOtherFunction(this.element, this.settings).
                        that._killVideoStream();
                        that._createContainer();
                        that._createUploader();
                        that._setFileName("capture.png");

                        if (that.settings.image){
                            that.loadImage(that.settings.image);
                        }else {
                            if (that.$element.attr('src')){
                                //console.log(that.$element.attr('src'));
                                that.loadImage(that.$element.attr('src'));
                            }
                        }

                        that.$video.on('play', function (e) {
                            that.__cameraVisible(true);
                            //that.$video.hide();

                            //console.log('playing');
                            //that.$video.show();
                            that._cssVideoCorrection();
                            that.$wait.hide();
                        });

                        that.$msg.click(function(){
                            that.$msg.hide();
                        });
                        that.$container_middle_left.click(function(){
                            that.$msg.hide();
                        });

                        that.$container_noimg.click(function(){
                            that.$btn_upload.trigger('click');
                        });

                        that.$element.click( function(){
                            if (that.settings.editOnClick){
                                that._openFancyBox();
                            }
                        });

                        that.$video_sources.change(function(){
                            that._killVideoStream();
                            that.selectedCameraId = that.$video_sources.val();
                            that._toggleCamera(false);
                            that._toggleCamera(true);
                        });

                        that.$scanner_sources.change(function(){
                            that.selectedScannerId = that.$scanner_sources.val();
                        });

                        that.$btn_proceed.on('click',function(){
                            if (that.$element.data('state_camera')){
                                that._takePhoto(that.$video[0]);
                            }
                            if (that.$element.data('state_scanner')){
                                that._doScan();
                            }
                            if (that.$element.data('state_crop')){
                                that._doCrop();
                            }
                        });

                        that.$btn_camera.on('click',function(){
                            that._toggleCamera(true);
                        });
                        that.$btn_back.on('click',function(){
                            if (that.$element.data('state_camera')){
                                that._toggleCamera(false);
                            }
                            if (that.$element.data('state_scanner')){
                                that._toggleScanner(false);
                            }
                            if (that.$element.data('state_crop')){
                                if (that.$element.data('state_crop_force')){
                                    that.$element.data('state_crop_force',false);
                                    that.__setImage(false,0,0);
                                }
                                that._toggleCrop(false);
                            }
                            if (that.$element.data('state_measure')){
                                that._toggleMeasure(false);
                            }
                        });
                        that.$btn_upload.on('click',function(){
                            that._toggleCamera(false);
                            that._toggleScanner(false);
                        });
                        that.$btn_scanner.on('click',function(){
                            //that._toggleCamera(false);
                            that._toggleScanner(true);
                        });
                        that.$btn_crop.on('click',function(){
                            that._toggleCrop();
                        });
                        that.$btn_measure.on('click',function(){
                            that._toggleMeasure();
                        });
                        that.$btn_clear.on('click',function(){
                            that.__setImage(false,0,0);
                        });

                        that.$btn_doupload.on('click',function(){
                            that.$wait.show();
                            if (that.imageLoaded){
                                if(that.settings.uploadAfterEdit){
                                    setTimeout(function(){
                                        that.$canvas[0].toBlob(function(resultingBlob) {
                                            // var resultingBlob = new Blob(['Hello world'], {type: 'text/text'});
                                            var file = new o.File(null, resultingBlob);
                                            //var file = new o.Blob(null, resultingBlob);
                                            file.name = that._filename; // giving it a file name here
                                            that._finalupload = true;// prevent uploader fileAdded
                                            that.uploader.addFile(file);
                                            that.uploader.start();
                                        //}, that._filetype);
                                        }, 'image/jpeg',70);
                                    },1);
                                }else{
                                    that._makeThumbnail();
                                    $.fancybox.close();
                                }
                            } else {
                                that.settings.onClear(function(result){
                                    if (result){ that._toggeNoImgElement(result); }
                                });
                                $.fancybox.close();
                            }
                        });

                        that.$btn_docancel.on('click',function(){
                            $.fancybox.close();
                        });
                },
                _setFileName:function(name){
                    this._filename = name;
                },
                getCanvasImage: function(){
                    var that = this;
                    return that.$canvas[0];
                },
                getFileName: function(){
                    var that = this;
                    return that._filename;
                },

                /*convertCanvasToPNG: function(canvas) {
                    var image = new Image();
                    image.crossOrigin = "Anonymous";
                    //console.log(canvas);
                    image.src = canvas.toDataURL("image/png");
                    return image;
                },
                convertCanvasToJPG: function(canvas) {
                    var image = new Image();
                    image.crossOrigin = "Anonymous";
                    image.src = canvas.toDataURL("image/jpg");
                    return image;
                },
                canvasToBlob:function(){
                    canvas.toBlob(function(blob) {
                        formData.append("field-name", blob, "upload.png");
                    }, "image/png");
                }*/

                /*_fabric_makeDot: function(left, top, line1, line2, color) {
                    var c = new fabric.Circle({
                        left: left,
                        top: top,
                        strokeWidth: 3,
                        radius: 1,
                        //fill: '#fff',
                        fill:'transparent',
                        stroke: 'blue',
                        hoverCursor:'pointer',
                        moveCursor:'pointer',
                    });
                    c.hasControls = c.hasBorders = false;
                    c.line1 = line1;
                    c.line2 = line2;
                    return c;
                },	*/


                _fabric_makeCircle: function(left, top, line1, line2, color) {
                    var c = new fabric.Circle({
                        left: left,
                        top: top,
                        strokeWidth: 3,
                        radius: 10,
                        //fill: '#fff',
                        fill:'transparent',
                        stroke: color,
                        hoverCursor:'pointer',
                        moveCursor:'pointer',
                    });
                    c.hasControls = c.hasBorders = false;
                    c.line1 = line1;
                    c.line2 = line2;
                    return c;
                },

                _fabric_makeText: function(caption, line, color, textcolor) {
                    var c = new fabric.Text(caption,{
                        left: -8+(line.x1+line.x2)/2,
                        top: -8+(line.y1+line.y2)/2,
                        /*      strokeWidth: 3,
                        radius: 8,
                        fill: '#fff',
                        stroke: '#666'*/
                        selectable:false,
                        fontFamily:"Verdana",
                        fontSize:14,
                        fill:textcolor ? textcolor:'blue',
                        //fontWeight: 'bold',
                        backgroundColor:color ? color:'red',
                        //opacity:0.5,
                    });
                    c.hasControls = c.hasBorders = false;
                    line.text = c;
                    return c;
                },
                _fabric_makeIText: function(caption, line, color, textcolor) {
                    var c = new fabric.IText(caption,{
                        left: +18+(line.x1+line.x2)/2,
                        top: +18+(line.y1+line.y2)/2,
                        /*      strokeWidth: 3,
                        radius: 8,
                        fill: '#fff',
                        stroke: '#666'*/
                        selectable:false,
                        fontFamily:"Verdana",
                        fontSize:14,
                        fill:textcolor ? textcolor:'blue',
                        //fontWeight: 'bold',
                        backgroundColor:color ? color:'yellow',
                        selectionColor:'red',
                        //change:function(){console.log('aaaa');}
                    });
                    c.hasControls = c.hasBorders = false;
                    line.itext = c;
                    return c;
                },
                _fabric_makeLine: function(coords, color) {
                    return new fabric.Line(coords, {
                        fill: color,
                        stroke: color,
                        strokeWidth: 3,
                        selectable: false
                    });
                },

                _fabric_lineLength: function(line){
                    return Math.sqrt((line.x1-line.x2)*(line.x1-line.x2) + (line.y1-line.y2)*(line.y1-line.y2));
                },



        });

        // A really lightweight plugin wrapper around the constructor,
        // preventing against multiple instantiations
        $.fn[ pluginName ] = function ( options, key, value ) {
                var args = arguments;
                if (typeof(options) == 'string'){// call a method
                    var res = {};
                    this.each(function() {
                        var instance = $.data( this, "plugin_" + pluginName );
                        if ( instance ) {
                            if (options=='option'){
                                var data={};
                                data[key]=value;
                                //console.log(data);
                                //console.log(instance.settings);
                                $.extend(instance.settings,data);
                                //console.log(instance.settings);
                                res = value;
                            }else{
                                res = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ));
                            }
                        }
                    });
                    return res;
                } else
                if (typeof(options) == 'object'){//init each elem
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
