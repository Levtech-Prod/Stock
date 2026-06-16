// DEPENDENCIES
//  jquery, jquery.ui, select2, fancybox
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
        var pluginName = "dselector",
        defaults = {
            messages:{
                noClear:'This filter is required',
                checkAll:'Select all filter',
                clearAllFilters:'Deselect all filters',
                toggleFilter:'Open/Close',
                refresh: 'Refresh',
                openFilter: 'Open filter window',
            },
            title:   '',
            opened:  true,
            checked: false,
            info: false,
            boxes:   [],
            triggerChangeOnLoad:true,
            maxChecked: 10,
            showColors:true,
            allowClearAll:true,
            fancybox: true,
            onChange:function($form){},
            onInfoClick:function(){},
            onSortChange:function($form){},
            onClear:function($form){},
        },
        defaultBox = {
            id: 0,
            label:    "",
            name:    "",
            title:   "",
            boxclass:"",
            visible: true,
            disabled: false,
            checked: false,
            colors: ['#7d1e1e', '#807a0e', '#285e0a', '#0a525e', '#300a5e', '#872346', '#ba2727', '#baba27', '#2b9e3c', '#2d67bd'],
            width:'',
            value:"",
            createOptions:{},
            onBoxChange: function($input){},
            onBoxColorChange: function($input){},
            onBoxCheckboxChange: function($input){}
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
                box.id = box.id ? box.id: 'box_'+i;
                // put [] in box name if u want separate values for multi select2 exactly like in html select,
                // without [] it will generate one field with name and values separated by "," like 2,1,3....
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
                this.$element.addClass("dselector");
                this.$header = $("<div title='"+(that.settings.fancybox?that.settings.messages.openFilter:that.settings.title)+"'></div>").addClass("dheader").html(that.settings.title);
                this.$element.append(this.$header);
                this.$form = $("<form></form>").addClass("dcontainer");
                this.$fancy_container = $('<div class="dselector" style="width:692px; margin:20px 1px;"></div>');
                this.$fancy = $('<div style="display:none;"></div>');
                this.$fancy.append(this.$fancy_container);
                if(that.settings.fancybox){
                    this.$element.append(that.$fancy);
                }
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
                //this.fancy_link = $("<a class='fancy_link' data-fancybox data-src='#dcontainer' href='javascript:;'>abrakadabra</a>");
                if(!that.settings.fancybox){
                    this.$element.append(this.$form);
                }else{
                    this.$fancy_container.append(this.$form);
                }
                for ( var i = 0, l = that.settings.boxes.length; i < l; i++ ) {
                    var box = that.settings.boxes[i];
                    box.$thebox = that._create_box(box,((box.color)?box.color:i.toString().split('').pop()));
                    this.$form.append(box.$thebox);
                }
                this._create_plugins();
                this.$header.html(that._get_header());
                $(this._inputselector, this.$form).on('change', function(){
                    if ($('.dinput[type="checkbox"]:checked').length>that.settings.maxChecked){
                        $(this).prop('checked',false);
                        that.$header.html(that._get_header());
                        APP.showMessage(langJS('global_error'),that.settings.messages.tooMuchSelected);
                        return;
                    }
                    var expr = true;
                    if (!that.settings.allowClearAll){
                        var serialized = that.$element.dselector('serializeArray');
                        expr = serialized.length>0;
                    }
                    if (expr){
                        that.$header.html(that._get_header());
                        if (!that._preventmultiple){
                        $(this).data('box').onBoxCheckboxChange($(this));
                        $(this).data('box').onBoxChange($(this));
                            if(!that.settings.fancybox){
                                that._trigger_onChange();
                            }
                        }
                    }else{
                        $(this).prop('checked',true);
                    }
                });
                $('.color-input', this.$form).on('change', function(){
                    that.$header.html(that._get_header());
                    $(this).data('box').onBoxColorChange($(this));
                    if (!that._preventmultiple){
                        if(!that.settings.fancybox){
                            that._trigger_onChange();
                        }
                    }
                });
                this.$header.on('click', function(){
                    if(that.settings.fancybox){
                        let serialized = that.$element.dselector('serialize');
                        let title_html = '<div class="fb-button-holder"><button id="dfilter_ok" class="button-green">'+langJS('global_ok')+'</button></div>';

                        $.fancybox.open({
                            href: that.$fancy_container,
                            type : 'inline',
                            autoSize : false,
                            width: '695px',
                            height: 'auto',
                            helpers : {
                                title:{ type: 'inside' },
                                //overlay:{ closeClick:false },
                            },
                            beforeLoad : function() {
                                this.title= title_html;
                            },
                            afterShow : function() {
                                that.$fancy_container.parent().css('border','none');
                                $('#dfilter_ok').click(function() {
                                    $.fancybox.close();
                                });
                            },
                            beforeClose: function() {
                                if (serialized != that.$element.dselector('serialize')){
                                    that._trigger_onChange();
                                }
                            }
                        });
                    }else{
                        that.$form.toggle("fast",function(){that._toggle_buttons();});
                    }
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
                    that._trigger_onClear();
                    that._trigger_onChange();
                    that._preventmultiple=false;
                    e.preventDefault();
                    e.stopPropagation();
                });
                $(this.$header).on('click','.dhicon-refresh', function(e){
                    that._trigger_onChange();
                    that.$header.html(that._get_header());
                    e.preventDefault();
                    e.stopPropagation();
                });
                $(this.$header).on('click','.dhicon-check', function(e){
                    $('.dinput[type="checkbox"]').each(function(i,v){
                        if ($('.dinput[type="checkbox"]:checked').length>=that.settings.maxChecked){
                            return false;
                        }
                        $(this).prop('checked',true);
                    });
                    that._trigger_onChange();
                    that.$header.html(that._get_header());
                    e.preventDefault();
                    e.stopPropagation();
                });
                $(this.$header).on('click','.dhicon-info', function(e){
                    that._trigger_onInfoClick();
                    e.preventDefault();
                    e.stopPropagation();
                });
                if (!this.settings.opened){
                    this.$form.toggle(0, function(){that._toggle_buttons();});
                }
                if (that.settings.triggerChangeOnLoad){
                    that._trigger_onChange();
                }
                $( ".dcontainer" ).sortable({
                    start: function(e, ui) {
                        // creates a temporary attribute on the element with the old index
                        $(this).attr('data-previndex', ui.item.index());
                    },
                    stop: function( event, ui ) {
                        var newIndex = ui.item.index();
                        var oldIndex = $(this).attr('data-previndex');
                        $(this).removeAttr('data-previndex');
                        array_move(that.settings.boxes, oldIndex, newIndex);
                        if(!that.settings.fancybox){
                            that._trigger_onChange();
                        }
                        that._trigger_onSortChange();
                        that.$header.html(that._get_header());
                    },
                });
            },
            _trigger_onInfoClick:function(){
                this.settings.onInfoClick(this.$form);
            },
            _trigger_onChange:function(){
                this.settings.onChange(this.$form);
            },
            _trigger_onClear:function(){
                this.settings.onClear(this.$form);
            },
            _trigger_onSortChange:function(){
                this.settings.onSortChange(this.$form);
            },
            _clear_input:function(selector){
                var cleared = true;
                var serialized = [];
                var that_sel = this;
                var expr 	= true;
                $.each($(selector,this.$form), function(){
                    if (! $(this).prop("disabled")){
                        //normal input
                        if (!that_sel.settings.allowClearAll){
                            serialized = that_sel.$element.dselector('serializeArray');
                            expr = serialized.length>1;
                        }
                        if (expr){
                            $(this).prop('checked', false);
                            $(this).trigger('change');
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

            _get_info:function(){
                var that = this;
                var btn = '';
                if (that.settings.info){
                    var title = (that.settings.messages.infoTitle)? that.settings.messages.infoTitle : 'Info';
                    btn ='<span class="dhicon dhicon-info fa-stack" title="'+title+'"><i class="fas fa-info-circle fa-stack-1x "></i></span>';
                }
                return btn;
            },
            _get_header:function(){
                return this._get_info()+'<span class="dhtitle">'+this.settings.title+'</span>'+this._get_filters()+this._get_header_buttons();
            },
            _get_header_buttons:function(){
                var that = this;
                var btn='';
                btn+='<span class="dhicon dhicon-check fa-stack" title="'+that.settings.messages.checkAll+'"><i class="fas fa-check fa-stack-1x "></i></span>';
                btn+='<span class="dhicon dhicon-clear fa-stack" title="'+that.settings.messages.clearAllFilters+'"><i class="fas fa-times fa-stack-1x "></i></span>';
                btn+='<span class="dhicon dhicon-refresh fa-stack" title="'+that.settings.messages.refresh+'"><i class="fas fa-sync fa-stack-1x "></i></span>';
                if(!that.settings.fancybox){
                    btn+='<span class="dhicon dhicon-toggle fa-stack" title="'+that.settings.messages.toggleFilter+'"><i class="fas fa-chevron-up fa-stack-1x "></i></span>';
                }
                if(that.settings.fancybox){
                    btn+='<span class="dhicon dhicon-toggle fa-stack" title="'+that.settings.messages.openFilter+'"><i class="fas fa-filter fa-stack-1x "></i></span>';
                }

                return btn;
            },
            _get_filters:function(){
                var that = this;
                var label='';
                var name='';
                var concatVals = function(idx,inp){
                    if (idx>0){
                        val+=' - ';
                    }
                    val += $(inp).val();
                    checked = $(inp).prop('checked');
                };
                for ( var i = 0, l = this.settings.boxes.length; i < l; i++ ) {
                    var box = this.settings.boxes[i];
                    var val='';
                    var checked=false;
                    $.each($(this._inputselector, box.$thebox),concatVals);
                    var title = (box.createOptions.allowClear === false && typeof (box.createOptions.allowClear) !== 'undefined') ? that.settings.messages.noClear : that.settings.messages.clearFilter;
                    var box_label = (box.label)?box.label:box.name;
                    if (checked==true){
                        label += '<span class="dhboxtxt" title="'+title+'" adata="'+box.id+'"><span class="dhname">'+box_label+'</span>'+(that.settings.showColors ? '<span class="color-box" style="background-color:'+$('#color_'+box.id).val()+'" ></span>':'')+'</span>';
                    }
                }
                return label;
            },
            _create_box: function(box, color){
                var $box = $("<div></div>").addClass("dbox").attr('name', box.id).attr('data-id', box.id).addClass(box.boxclass);
                $box.data('box',box); //add settings to box
                color = (color && color.trim().charAt(0)=='#')?color:box.colors[color];
                $box.css('border-left-color',color);
                if (!box.visible) {
                    $box.hide();
                }
                var $div = $("<div></div>").addClass('ddiv').css('width',box.width).attr('title',box.title);
                if (box.type=="hidden"){
                    $box.hide();
                }
                $box.data('color', color);
                this._add_inputs($div, box, color);
                $box.append($div);
                return $box;
            },
            _create_plugins:function(){
                var that=this;
                for ( var i = 0, l = that.settings.boxes.length; i < l; i++ ) {
                    var box=that.settings.boxes[i];
                    var $input = $('input[name="'+box.id+'"]',box.$thebox);
                    var opt_default, opt; //saved_onSelect;
                    $input.attr('placeholder',box.title);
                }
            },
            _add_inputs:function($div,box, color){
                var that=this;
                var iclass='dinput';
                var iname =box.id;
                color = (color && color.trim().charAt(0)=='#')?color:box.colors[color];
                var $input = $("<input />").addClass(iclass).attr('name',iname).attr('type', 'checkbox').data('box',box);
                $input.prop('disabled',box.disabled);
                if(box.checked && $('.dinput[type="checkbox"]:checked').length<this.settings.maxChecked){
                    $input.prop('checked', true);
                }else{
                    $input.prop('checked', false);
                }
                $div.append($input);
                var box_label = (box.label)?box.label:box.name;
                var $label = $("<label></label>").addClass("dlabel").html(box_label).attr('for',box.id).css('width',box.width).attr('title',box.title?box.title:box_label);
                //color picker add
                var $colp="<span class='color-box' id='colorspan_"+box.id+"' style='background-color:"+color+"' ></span><input type='hidden' name='colorspan_"+box.id+"' id='color_"+box.id+"' value='"+color+"' class='color-input'/>";
                $div.append($label);
                $div.append($colp);
                $div.find('.color-box').colpick({
                    colorScheme:'light',
                    layout:'hex',
                    color: color,
                    onSubmit:function(hsb,hex,rgb,el) {
                        $(el).css('background-color', '#'+hex);
                        var getid=$(el).attr('id');
                        $('input[name="'+getid+'"]').val('#'+hex);
                        $(el).colpickHide();
                        $(el).parent('.ddiv').parent('.dbox').css('border-left-color','#'+hex);
                        //$(el).parent('.ddiv').find('input[type="checkbox"]').trigger('change');
                        $(el).parent('.ddiv').find('input[type="hidden"].color-input').data('box',box).trigger('change');
                    },
                });
                if (!that.settings.showColors){
                    $div.find('.color-box').hide();
                }
                $label.on('click', function(){
                    $input.prop('checked', !$input.prop('checked')).trigger('change');
                });
            },
            boxVisible: function(boxname,visible){
                var $box = $('div[name="'+boxname+'"]',this.$form);
                if (typeof(visible) != 'undefined'){
                    if (visible){
                        $box.show();
                    }else{
                        $box.hide();
                    }
                }
                return $box.is(":visible");
            },
            boxEnabled: function(boxname,enabled){
                var $box = $('div[name="'+boxname+'"] '+this._inputselector,this.$form);
                if (typeof(enabled) != 'undefined'){
                    $.each($box, function(){
                            $(this).prop("disabled",!enabled);

                        });
                    return enabled;
                } else {
                    return ! $box.first().prop("disabled");
                }
            },
            serialize: function(){
                return this.$form.serialize();
            },
            serializeArray: function(){
                var arr = [];
                var obj = {};
                $('.dbox').each(function(i,v){
                    var $this = $(this);
                    obj = {};
                    if ($this.find('input[type="checkbox"]').is(':checked')){
                        obj = {
                            id: $this.attr('data-id'),
                            color:  $this.find('.color-input').val(),
                            label: $this.find('.dlabel').attr('title'),
                            name: $this.find('.dlabel').attr('title'),
                        };
                        arr.push(obj);
                    }
                });
                return arr;
            },
            serializeAsArray: function(){
                var data = this.$form.serializeArray();
                var res = [];
                for (var i = 0; i < data.length; i++) {
                    res[data[i]['name']]=data[i]['value'];
                }
                return res;
            },
            getBoxes: function(){
                var arr = [];
                var obj = {};
                $('.dbox',this.$form).each(function(i,v){
                    var $this = $(this);
                    obj = {};
                    obj = {
                        id: $this.attr('data-id'),
                        color:  $this.find('.color-input').val(),
                        label: $this.find('.dlabel').attr('title'),
                        name: $this.find('.dlabel').attr('title'),
                        checked: $this.find('input.dinput[type="checkbox"]').is(':checked'),
                    };
                    arr.push(obj);
                });
                return arr;
            },
            getBoxColor: function(id){
                var color = null;
                if (parseInt(id,10)>0){
                    color = this.$element.find('.dbox[data-id="'+id+'"]').find('input[type="hidden"].color-input').val();
                }
                return color;
            }
        });

        // A really lightweight plugin wrapper around the constructor,
        // preventing against multiple instantiations
        $.fn[ pluginName ] = function ( options ) {
            var args = arguments;
            if (typeof(options) == 'string'){
                // call a method
                var res = {
                };
                this.each(function() {
                        var instance = $.data( this, "plugin_" + pluginName );
                        if ( instance ) {
                            res = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ));
                        }
                    });
                return res;
            } else
            if (typeof(options) == 'object'){
                //init each elem
                this.each(function() {
                        if (($(this).attr("id")) && ($(this).attr("id").toLowerCase()=='filter')){
                            console.warn('Using "filter" as ID for the dselector container breaks TinyMCE :( !!!!!!!!!');
                        } else {
                            var instance = $.data( this, "plugin_" + pluginName );
                            if ( !instance ) {
                                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
                            }
                        }
                    });
                // chain jQuery functions
                return this;
            } else {
                return this;
            }
        };

        //array order by index
        function array_move(arr, old_index, new_index) {
            if (new_index >= arr.length) {
                var k = new_index - arr.length + 1;
                while (k--) {
                    arr.push(undefined);
                }
            }
            arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
            return arr; // for testing
        }


    })( jQuery, window, document );

