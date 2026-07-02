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
        var pluginName = "dimg_view",
            defaults = {
                image:'', //the image
                noImageIcon:'fas fa-camera',// fa-user // the noimage icon
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
                /*for ( var i = 0, l = this.settings.boxes.length; i < l; i++ ) {
                    var box = $.extend( true, {}, defaultBox, this.settings.boxes[i] );
                    box.name = box.name ? box.name: 'box_'+i;
                    box.label = box.label ? box.label: box.name;
                    this.settings.boxes[i] = box;
                }*/
                this._defaults = defaults;
                this._name = pluginName;

                this.imageLoaded=false;
                this.init();
        }

        // Avoid Plugin.prototype conflicts
        $.extend(Plugin.prototype, {
                loadImage:function(imageURL){
                        var that = this;
                        that._flag_loadingImage = true;
                        that._toggeNoImgElement(true);
                        that._loadImage(imageURL, function(result){
                            that._toggeNoImgElement(!result);
                            that._flag_loadingImage = false;
                        });
                },
                _loadImage:function(imageData, callback){
                        var that = this;
                        if (typeof callback == 'undefined'){ callback = $.noop; }
                        var img = new Image();
                        img.crossOrigin = "Anonymous";
                        img.onload = function(){
                            that._makeThumbnail(img,img.naturalWidth,img.naturalHeight);
                            callback(true);
                        };
                        img.onerror = function(){
                            that._makeThumbnail(false,0,0);
                            callback(false);
                        };
                        img.src = imageData;
                },


                /*__setImage:function(img,width,height){
                        var that = this;
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
                        }else{
                        }
                        that._cssCanvasCorrection();
                        that.$GUI.toggle(that.imageLoaded);
                        that.$btn_clear.toggle(that.imageLoaded);
                        that._resetGUIControl();
                },*/
                _makeThumbnail:function(img,cwidth,cheight){
                    var that = this;
                    that.imageLoaded = img ? true:false;
                    if (img){
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
                        that.element_thumbnail_context.drawImage(img,0,0,w,h);
                        if (that.element_thumbnail_context.canvas.width > 0){
                            RGBaster.colors(that.element_thumbnail_context, {
                                paletteSize: 10,
                                exclude: [ 'rgb(255,255,255)', 'rgb(0,0,0)' ],  // don't count white
                                success: function(payload){
                                    //console.log(payload)
                                    that.$element.css('background-color',payload.dominant);
                                }
                            });
                        }
                    }
                },
                _cssNoImgCorrection:function($thediv){
                        //var that = this;
                        //$('.dimg-noimg',$thediv).each(function(){
                            var fs = Math.min($thediv.parent().width(),$thediv.parent().height());
                            fs = fs*85/100;
                            $thediv.css('font-size', fs+'px');
                            $thediv.css('line-height', $thediv.parent().height()+'px');
                        //});
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
                        that.$element.addClass('di-v dimg-view');
                        that._elemet_backround =that.$element.css('background-color');
                        that.$element_noimg = $('<i class="di-v dimg-view-noimg '+that.settings.noImageIcon+'"></i>');
                        that.$element.append(that.$element_noimg);
                        that.$element_thumbnail = $("<canvas></canvas>").addClass("di-v dimg-view-element-thumbnail");that.$element.append(that.$element_thumbnail);
                        that.element_thumbnail_context = that.$element_thumbnail[0].getContext("2d");
                        that._toggeNoImgElement(true);
                },


                init: function () {
                        var that = this;
                        // Place initialization logic here
                        // You already have access to the DOM element and
                        // the options via the instance, e.g. this.element
                        // and this.settings
                        // you can add more functions like the one below and
                        // call them like so: this.yourOtherFunction(this.element, this.settings).
                        that._createContainer();

                        if (that.settings.image){
                            that.loadImage(that.settings.image);
                        }else {
                            if (that.$element.attr('src')){
                                that.loadImage(that.$element.attr('src'));
                            }
                        }
                },


        });

        // A really lightweight plugin wrapper around the constructor,
        // preventing against multiple instantiations
        $.fn[ pluginName ] = function ( options ) {
                var args = arguments;
                if (typeof options == 'string'){// call a method
                    var res = {};
                    this.each(function() {
                        var instance = $.data( this, "plugin_" + pluginName );
                        if ( instance ) {
                            res = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ));
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
