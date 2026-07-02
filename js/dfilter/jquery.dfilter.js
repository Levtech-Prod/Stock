// DEPENDENCIES
//  jquery, jquery.ui, select2
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
        var pluginName = "dfilter",
            defaults = {
                messages:{
                    noClear:'This filter is required',
                    clearFilter:'Remove filter',
                    clearAllFilters:'Clear all filters',
                    toggleFilter:'Open/Close',
                    title_date_from: "Date from",
                    title_date_to: "Date to",
                    refresh: 'Refresh',
                    save_filter: 'Save/Delete filter',
                },
                title:   '',
                opened:  true,
                boxes:   [],
                hash: '',
                triggerChangeOnLoad:true,
                onChange:function($form){},
            },
            defaultBox = {
                name:    "",
                title:   "",
                label:   "",
                type:    "text",
                boxclass:"",
                visible: true,
                disabled: false,
                color:"",
                icons:[],//"search","clear","today"
                width:'',
                value:"",
                sel2DisplayData:'text',// the sel2 data to display
                createOptions:{},
                onBoxChange: function($input){},
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
                for ( var i = 0, l = this.settings.boxes.length; i < l; i++ ) {
                    var box = $.extend( true, {}, defaultBox, this.settings.boxes[i] );
                    box.name = box.name ? box.name: 'box_'+i;
                    box.label = box.label ? box.label: box.name;
                    // put [] in box name if u want separate values for multi select2 exactly like in html select,
                    // without [] it will generate one field with name and values separated by "," like 2,1,3....
                    /*if ((box.type=='select2') && (box.createOptions.multiple)){// make sure multi choice select2 has [] in the name
                        if (box.name.indexOf('[]')===-1){
                            box.name+='[]';
                        }
                    };*/
                    if (box.type=='select2'){box.icons=[];}// NO ICONS WILL BE NEEDED FOR SELECT2
                    this.settings.boxes[i] = box;
                }
                this._defaults = defaults;
                this._name = pluginName;
                this._inputselector = 'input.dinput';
                this._preventmultiple = false;

                this.init();
        }

        // Avoid Plugin.prototype conflicts
        $.extend(Plugin.prototype, {
                init: function () {
                        var that = this;
                        // Place initialization logic here
                        // You already have access to the DOM element and
                        // the options via the instance, e.g. this.element
                        // and this.settings
                        // you can add more functions like the one below and
                        // call them like so: this.yourOtherFunction(this.element, this.settings).
                        this.$element.addClass("dfilter");
                        this.$header = $("<div></div>").addClass("dheader").html(that.settings.title);
                        this.$element.append(this.$header);
                        this.$element.append('<input class="dfilter-focusout"/>');
                        this.$form = $("<form></form>").addClass("dcontainer");
                        // IMPORTANT HACK
                        // overwrite default serializeArray to work correctly with select2's with multiple choices
                        // since serialize uses serializeArray internally it is not needed to overwrite that
                        // the name of multple choice select 2 must contain [] in order to work correctly
                        this.$form.orig_serializeArray = this.$form.serializeArray;
                        this.$form.serializeArray = function(){
                            var arr = that.$form.orig_serializeArray();
                            var res = [];
                            for ( var el, vals, i = 0, l = arr.length; i < l; i++ ) {
                                el = arr[i];
                                if (el.name.indexOf('[]')!==-1){
                                    // selected multple choice select2 values are comma separated in a hidden input field as 1,2,3
                                    if (el.value!==''){
                                        vals = el.value.split(',');
                                        for ( var j = 0, ll = vals.length; j < ll; j++ ) {
                                            res.push({name:el.name, value:vals[j]});
                                        }
                                    }
                                } else {
                                    res.push(el);
                                }
                            }
                            return res;
                        };

                        this.settings.hash = "dfilter_"+CryptoJS.MD5(JSON.stringify(that.settings.boxes)).toString();
                        this.$element.append(this.$form);
                        for ( var i = 0, l = that.settings.boxes.length; i < l; i++ ) {
                            var box = that.settings.boxes[i];
                            box.$thebox = that._create_box(box);
                            this.$form.append(box.$thebox);
                        }
                        this._create_plugins();
                        this.$header.html(that._get_header());
                        $(this._inputselector, this.$form).on('change', function(){
                            //var val = this.$form.serializeArray();
                            that.$header.html(that._get_header());
                            let box = $(this).data('box');
                            box.onBoxChange($(this));
                            if (!that._preventmultiple){
                                that._trigger_onChange(box);
                            }
                        });
                        this.$header.on('click', function(){
                            that.$form.toggle("fast",function(){that._toggle_buttons();});
                        });
                        $(".dicon-search",this.$form).on('click', function(){
                            //do nothing it will blur automatically
                        });
                        $(".dicon-clear",this.$form).on('click', function(){
                            $(this).data('input').val('').trigger('change');
                        });
                        $(".dicon-time",this.$form).on('click', function(){
                            $(this).data('input').val(moment().format('YYYY-MM-DD')).trigger('change');
                        });

                        $(this.$header).on('click','.dhboxtxt', function(e){
                            that._preventmultiple=true;
                            if (that._clear_input('.dbox[name="'+$(this).attr("adata")+'"] '+that._inputselector)){
                                that._trigger_onChange();
                            }
                            e.preventDefault();
                            e.stopPropagation();
                            that._preventmultiple=false;
                        });
                        $(this.$header).on('click','.dhicon-clear', function(e){
                            that._preventmultiple=true;
                            that._clear_input(that._inputselector);
                            that._preventmultiple=false;
                            that._trigger_onChange();
                            e.preventDefault();
                            e.stopPropagation();
                        });
                        $(this.$header).on('click','.dhicon-refresh', function(e){
                            that._trigger_onChange();
                            e.preventDefault();
                            e.stopPropagation();
                        });
                        $(this.$header).on('click','.dhicon-pin', function(e){
                            that._save_unsave_pin();
                            e.preventDefault();
                            e.stopPropagation();
                        });
                        if (!this.settings.opened){
                            this.$form.toggle(0, function(){that._toggle_buttons();});
                        }
                        if (that.settings.triggerChangeOnLoad){
                            that._trigger_onChange();
                        }
                },
                _trigger_onChange:function(box, data){

                    //console.log('implement here if u want to keep saved filter valuea actual');
                    var formdata = this.serializeAsArray();
                    this.$header.html(this._get_header());
                    this.settings.onChange(this.$form, box, formdata);
                },
                _clear_input:function(selector){
                    var cleared = true;
                    $.each($(selector,this.$form), function(){
                        if (!$(this).prop("disabled")){
                            if ($(this).hasClass('select2-offscreen')){//if it's select2
                                if ($(this).prev().hasClass('select2-allowclear') || $(this).prev().hasClass('select2-container-multi')){
                                    $(this).select2('val','').trigger('change');
                                }else{
                                    cleared = false;
                                }
                            }else{//normal input
                                $(this).val('').trigger('change');
                            }
                        }
                    });
                    return cleared;
                },
                _toggle_buttons:function(){
                    if (this.$form.is(":visible")){
                        $(".dhicon-toggle .fa-stack-1x",this.$header).addClass('fa-chevron-up').removeClass('fa-chevron-down');
                    }else{
                        $(".dhicon-toggle .fa-stack-1x",this.$header).addClass('fa-chevron-down').removeClass('fa-chevron-up');
                    }
                },

                _save_unsave_pin:function(){
                    var that = this;
                    if ($("."+this.settings.hash).hasClass("fa-ellipsis-h")){
                        $("."+this.settings.hash).addClass('fa-ellipsis-v').removeClass('fa-ellipsis-h').parent().css('color','red');
                        APP.localStorage.setItem(this.settings.hash, JSON.stringify(this.$form.serializeArray()));
                    }else{
                        $("."+this.settings.hash).addClass('fa-ellipsis-h').removeClass('fa-ellipsis-v').parent().css('color','');
                        APP.localStorage.removeItem(this.settings.hash);
                    }
                },

                _get_header:function(){
                    return '<span class="dhtitle">'+this.settings.title+'</span>'+this._get_filters()+this._get_header_buttons();
                },
                _get_header_buttons:function(){
                    var that = this;
                    //var btn='<span class="dhicon dhicon-toggle fa-stack"><i class="far fa-circle fa-stack-2x"></i><i class="fas fa-chevron-up fa-stack-1x"></i></span>';
                    //btn+='<span class="dhicon dhicon-clear fa-stack"><i class="far fa-circle fa-stack-2x"></i><i class="fas fa-times fa-stack-1x"></i></span>';
                    var btn='<span class="dhicon dhicon-toggle fa-stack" title="'+that.settings.messages.toggleFilter+'"><i class="fas fa-chevron-up fa-stack-1x "></i></span>';
                    btn+='<span class="dhicon dhicon-clear fa-stack" title="'+that.settings.messages.clearAllFilters+'"><i class="fas fa-times fa-stack-1x "></i></span>';
                    btn+='<span class="dhicon dhicon-refresh fa-stack" title="'+that.settings.messages.refresh+'"><i class="fas fa-sync fa-stack-1x "></i></span>';
                    btn+='<span class="dhicon dhicon-pin fa-stack" title="'+that.settings.messages.save_filter+'" style="color:'+(APP.localStorage.getItem(that.settings.hash)?'red':'')+'"><i class="fas '+(APP.localStorage.getItem(that.settings.hash)?'fa-ellipsis-v':'fa-ellipsis-h')+' fa-stack-1x '+that.settings.hash+'"></i></span>';
                    return btn;
                },
                _get_filters:function(){
                    var that = this;
                    var label='';
                    var concatVals = function(idx,inp){
                        if( $(inp).hasClass('select2-offscreen')){//if it's select2
                            var data = $(inp).select2('data');
                            //console.log(data);
                            if ($.isArray(data)){
                                for ( var i = 0, l = data.length; i < l; i++ ) {
                                    val += data[i][box.sel2DisplayData]+', ';
                                }
                            }else{
                                if (data){val += data[box.sel2DisplayData];}
                            }
                        }else{// any other input
                            if (idx>0){ val+=' - ';}
                            val += $(inp).val();
                        }
                    };
                    for ( var i = 0, l = this.settings.boxes.length; i < l; i++ ) {
                        var box = this.settings.boxes[i];
                        var val='';
                        $.each($(this._inputselector, box.$thebox),concatVals);
                        var title = (box.createOptions.allowClear === false && typeof(box.createOptions.allowClear) !== 'undefined') ? that.settings.messages.noClear : that.settings.messages.clearFilter;
                        if (val!=='' && val!=' - '){
                            label += '<span class="dhboxtxt" title="'+title+'" adata="'+box.name+'"><span class="dhname">'+box.label+'</span><span class="dhval">'+val+'</span></span>';
                        }
                    }
                    return label;
                },
                _create_box: function(box){
                    var $box = $("<div></div>").addClass("dbox").attr('name', box.name).addClass(box.boxclass);
                    $box.data('box',box); //add settings to box
                    if (box.color) { $box.css('border-left-color',box.color); }
                    if (!box.visible) { $box.hide(); }
                    var $label = $("<label></label>").addClass("dlabel").html(box.label).attr('for',box.name).css('width',box.width).attr('title',box.title?box.title:box.label);
                    $box.append($label);
                    var $div = $("<div></div>").addClass('ddiv').css('width',box.width).attr('title',box.title);
                    if (box.type=="hidden"){$box.hide();}
                    this._add_inputs($div, box);
                    $box.append($div);
                    return $box;
                },
                _mkdate:function($input){
                    return ($input.val()) ? moment($input.val()).format('YYYY-MM-DD') : null;
                },
                _create_plugins:function(){
                    var that=this;
                    var setMIN = function(){
                        var dt = that._mkdate($(this));
                        var $in = $('input[name="'+$(this).data('box').name+'_to"]', $(this).parent());
                        $in.datepicker('option', 'minDate', dt);
                        $(this).datepicker('setDate',dt);
                    };
                    var setMAX = function(){
                        var dt = that._mkdate($(this));
                        var $in = $('input[name="'+$(this).data('box').name+'_from"]', $(this).parent());
                        $in.datepicker('option', 'maxDate', dt);
                        $(this).datepicker('setDate',dt);
                    };
                    var setDATE = function(){
                        var dt = that._mkdate($(this));
                        $(this).datepicker('setDate',dt);
                    };
                    var initSel2Options = function($input, box){
                        var isInit = ($input.val()=='init');
                        if (box.createOptions.initSelection){
                            var initSelection_orig = box.createOptions.initSelection;
                            var initSelection_new = function (element, callback) {
                                var callback_tmp = function(data){
                                    if(data.length==0 && box.createOptions.allowClear==true){
                                        $input.val('');
                                        if(APP.localStorage.getItem(that.settings.hash)){
                                            APP.localStorage.setItem(that.settings.hash, JSON.stringify(that.$form.serializeArray()));
                                        }
                                        that._trigger_onChange(box, data);
                                    }
                                    callback(data);
                                    that.$header.html(that._get_header());
                                    if (isInit){
                                        if (data.id) { $input.val(data.id); } else { $input.val(''); }
                                        box.onBoxChange($input);
                                        if (!that._preventmultiple){
                                            that._trigger_onChange(box, data);
                                        }
                                    }
                                };
                                initSelection_orig(element,callback_tmp);
                            };
                            box.createOptions.initSelection = initSelection_new;
                        }
                        return box.createOptions;
                    };

                    for ( var i = 0, l = that.settings.boxes.length; i < l; i++ ) {
                        var box=that.settings.boxes[i];
                        var $input = $('input[name="'+box.name+'"]',box.$thebox);
                        var opt_default, opt;
                        switch(box.type) {
                            case "text":
                                // do nothing
                                //console.log($input.attr('name'));
                                $input.attr('placeholder',box.title);
                                break;
                            case "hidden":
                                // do nothing
                                //console.log($input.attr('name'));

                                break;
                            case "checkbox":
                                $input;
                                $input.attr('placeholder',box.title);
                                $input.attr('type', 'checkbox');
                                $input.val('1');
                                break;
                            case "date":{
                                    let saved_onClose = box.createOptions.onClose;
                                    opt_default = {
                                        onClose:function(){
                                            if (saved_onClose){ saved_onClose(); }
                                            that.$element.find(".dfilter-focusout").show().focus().hide();
                                        },
                                    };
                                    opt = $.extend( true ,{},  box.createOptions, opt_default );
                                    $input.datepicker(opt);
                                    $input.datepicker('setDate',that._mkdate($input));
                                    $input.on('change', setDATE);
                                }
                                break;
                            case "dateinterval":{
                                    let saved_onClose = box.createOptions.onClose;
                                    opt_default = {
                                        onClose:function(){
                                            if (saved_onClose){ saved_onClose(); }
                                            that.$element.find(".dfilter-focusout").show().focus().hide();
                                        },
                                    };
                                    opt = $.extend( true ,{},  box.createOptions, opt_default );
                                    // create for from input
                                    $input = $('input[name="'+box.name+'_from"]',box.$thebox);
                                    $input.attr('title', that.settings.messages.title_date_from);
                                    $input.attr('placeholder', that.settings.messages.title_date_from);
                                    $input.datepicker(opt);
                                    $input.datepicker('setDate',that._mkdate($input));
                                    $input.on('change', setMIN);
                                    // create for to input
                                    $input = $('input[name="'+box.name+'_to"]',box.$thebox);
                                    $input.attr('title', that.settings.messages.title_date_to);
                                    $input.attr('placeholder', that.settings.messages.title_date_to);
                                    $input.datepicker(opt);
                                    $input.datepicker('setDate',that._mkdate($input));
                                    $input.on('change', setMAX);
                                }
                                break;
                            case "ageinterval":
                                // create for from input
                                $input = $('input[name="'+box.name+'_from"]',box.$thebox);
                                $input.attr('title', that.settings.messages.title_age_from);
                                $input.attr('placeholder', that.settings.messages.title_age_from);
                                $input.attr('min', 1);
                                $input.attr('max', 120);
                                // create for to input
                                $input = $('input[name="'+box.name+'_to"]',box.$thebox);
                                $input.attr('title', that.settings.messages.title_age_to);
                                $input.attr('placeholder', that.settings.messages.title_age_to);
                                $input.attr('min', 1);
                                $input.attr('max', 120);
                                break;
                            case "numberinterval":
                                // create for from input
                                $input = $('input[name="'+box.name+'_from"]',box.$thebox);
                                $input.attr('min', -1000);
                                // create for to input
                                $input = $('input[name="'+box.name+'_to"]',box.$thebox);
                                $input.attr('min', -1000);
                                break;
                            case "select2":
                                var selid = box.name+'_'+(moment().format('x'));
                                $input.attr('id',selid);
                                //console.log($input.attr('name')+' '+$input.val());
                                opt_default = {};// no forced options
                                box.createOptions = initSel2Options($input, box);
                                opt = $.extend( true ,{},  box.createOptions, opt_default );
                                $input.select2(opt);
                                break;
                            default:
                        }
                    }
                },
                _add_inputs:function($div,box){
                    var ll=((box.type=='dateinterval') || (box.type=='ageinterval') || (box.type=='numberinterval'))? 2:1;
                    if(APP.localStorage.getItem(this.settings.hash)){
                        var pin_values = this.serializeFromObject(JSON.parse(APP.localStorage.getItem(this.settings.hash)));
                    }
                    for ( var j = 0; j < ll; j++ ) {
                        var iclass='dinput '+((ll>1)?"dinput_double":"dinput_single");
                        var iname =box.name+((ll>1)?((j===0)?"_from":"_to"):'');
                        if(pin_values){
                            box.value = pin_values[iname];
                        }
                        var $input = $('<input autocomplete="off"/>').addClass(iclass).attr('name',iname).attr('type',((box.type=='ageinterval'||box.type=='numberinterval')?'number':(box.type=='hidden'?'hidden':'text'))).data('box',box);
                        $input.prop('disabled',box.disabled);
                        //if (typeof(box.value)=='string'){ $input.val(box.value);} else { $input.val(box.value[j]); }
                        if (!$.isArray(box.value)){ $input.val(box.value);} else { $input.val(box.value[j]); }
                        $input.css('width',(ll>1)?(($div.width()-5)/2)+'px':'100%');
                        $div.append($input);

                        // add icons
                        for ( var i = 0, l = box.icons.length; i < l; i++ ) {
                            var $icon=$("<div></div>").data('input',$input);
                            iclass="dicon dicon-"+(i)+" dicon-pos-"+(ll-1-j);
                            switch(box.icons[i]) {
                                case "search":
                                    $icon.html('<i class="fas fa-search"></i>');
                                    iclass+=' dicon-search';
                                    break;
                                case "clear":
                                    $icon.html('<i class="fas fa-times"></i>');
                                    iclass+=' dicon-clear';
                                    break;
                                case "today":
                                    $icon.html('<i class="far fa-calendar"></i>');
                                    iclass+=' dicon-time';
                                    break;
                                default:
                            }
                            $icon.addClass(iclass);
                            $div.append($icon);
                        }
                    }
                },
                boxVisible: function(boxname,visible){
                    var $box = $('div[name="'+boxname+'"]',this.$form);
                    if (typeof(visible) != 'undefined'){
                        if (visible){ $box.show(); }else{ $box.hide(); }
                    }
                    return $box.is(":visible");
                },
                boxEnabled: function(boxname,enabled){
                    var $box = $('div[name="'+boxname+'"] '+this._inputselector,this.$form);
                    if (typeof(enabled) != 'undefined'){
                        $.each($box, function(){
                            if( $(this).hasClass('select2-offscreen')){//if it's select2
                                $(this).prop("disabled",!enabled);
                                $(this).select2("enable",enabled);
                            }else{
                                $(this).prop("disabled",!enabled);
                            }
                        });
                        return enabled;
                    } else {
                        return !$box.first().prop("disabled");
                    }
                },
                boxText: function(boxname,text){
                    var $box = $('div[name="'+boxname+'"] '+this._inputselector,this.$form);
                    if (typeof(text) != 'undefined'){
                        if( !$(this).hasClass('select2-offscreen')){//if it's NOT select2
                            $box.val(text).trigger('change');
                        }
                        return text;
                    } else {
                        return $box.val();
                    }
                },
                serialize: function(){
                    return this.$form.serialize();
                },
                serializeArray: function(){
                    return this.$form.serializeArray();
                },
                serializeAsArray: function(){
                    var data = this.$form.serializeArray();
                    var res = [];
                    for (var i = 0; i < data.length; i++) {
                        res[data[i]['name']]=data[i]['value'];
                    }
                    return res;
                },
                serializeFromObject: function(data){
                    var res = [];
                    for (var i = 0; i < data.length; i++) {
                        res[data[i]['name']]=data[i]['value'];
                    }
                    return res;
                },
        });

        // A really lightweight plugin wrapper around the constructor,
        // preventing against multiple instantiations
        $.fn[ pluginName ] = function ( options ) {
                var args = arguments;
                if (typeof(options) == 'string'){// call a method
                    var res = {};
                    this.each(function() {
                        var instance = $.data( this, "plugin_" + pluginName );
                        if ( instance ) {
                            res = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ));
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
