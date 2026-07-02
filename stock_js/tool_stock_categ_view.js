var tool_stock_categ_view = function(params){
    $('#tool_stock_categ').jtable({
            title: params.title+' - '+params.categ_name,
            messages:jtable_lang({}),
            dialogShowEffect:null,
            dialogHideEffect:null,
            insertDialogWidth:'800',
            editDialogWidth:'800',
            insertDialogHeight:'550',
            editDialogHeight:'550',
            paging: true, //Enable paging
            pageSize: 25, //Set page size (default: 10)
            sorting: true, //Enable sorting
            defaultSorting: 'ts DESC', //Set default sorting
            selecting: false,
            multiselect: false,
            selectingCheckboxes: false,
            selectOnRowClick :false,
            visibleAddRecordButton: (params.edit==1),
            visibleEditRecordButton: (params.edit==1),
            visibleDeleteRecordButton: (params.edit==1),
            actions: {
                listAction:   (params.in==1?build_url('index.php/Tool_stock_categ/list_tool_stock_in')+'?categ_id='+params.categ_id:build_url('index.php/Tool_stock_categ/list_tool_stock')+'?categ_id='+params.categ_id),
                createAction: build_url('index.php/Tool_stock_categ/create_tool_stock'),
                updateAction: build_url('index.php/Tool_stock_categ/update_tool_stock'),
                deleteAction: build_url('index.php/Tool_stock_categ/delete_tool_stock')
            },
            fields: {
                id: {
                    title: langJS('global_id'),
                    key: true,
                    create: false,
                    edit: false,
                    list: (params.in==1?false:true),
                    width: '5%',
                },
                stock_params:{
                    create: true,
                    edit: true,
                    list: false,
                    type: 'hidden',
                },
                categ_id:{
                    title: langJS('global_category'),
                    create: true,
                    edit: true,
                    list: false,
                    sorting: true,
                    sortField:'c.name',
                    inputClass: 'sel2-100 select2-done validate[required]',
                    containerClass : 'jtabledlg-w50proc',
                    width: '9%',
                    defaultValue:params.categ_id,
                    display: function(data){
                        return data.record.categ_name;
                    }
                },
                name:{
                    title: langJS('global_name'),
                    list:true,
                    create:true,
                    edit:true,
                    sorting: true,
                    listClass: 'text-left',
                    inputClass: 'validate[required, minSize[2]]',
                    containerClass : 'jtabledlg-w50proc',
                    width: '9%',
                },  
                location:{
                    title: langJS('global_location'),
                    create: true,
                    edit: true,
                    list: true,
                    sorting: true,
                    inputClass: 'validate[required]',
                    containerClass : 'jtabledlg-w50proc',
                    width: '8%'
                },
                quantity:{
                    title: langJS('global_quantity'),
                    create: true,
                    edit: true,
                    list: true,
                    sorting: true,
                    sortField:'s.quantity',
                    width: '5%',
                    listClass: 'text-center',
                    inputClass: 'validate[required]',
                    containerClass : 'jtabledlg-w50proc',
                    display: function(data){
                        return '<b>'+data.record.quantity+'<b>';
                    }
                },
                broken_quantity:{
                    title: langJS('global_broken_quantity'),
                    create: true,
                    edit: true,
                    list: true,
                    sorting: true,
                    sortField:'s.broken_quantity',
                    width: '5%',
                    listClass: 'text-center',
                    inputClass: 'validate[required]',
                    containerClass : 'jtabledlg-w50proc',
                    display: function(data){
                        return '<b>'+data.record.broken_quantity+'<b>';
                    }
                },
                code:{
                    title: langJS('global_code'),
                    list:true,
                    create:false,
                    edit:false,
                    sorting: true,
                    listClass: 'text-left',
                    containerClass : 'jtabledlg-w50proc',
                    width: '9%',
                },
                standard_part:  {
                    title: langJS('global_standard_part'),
                    width: '5%',
                    type: 'checkbox',
                    create: true,
                    list: true,
                    edit:true,
                    values: { '0': '', '1': '' },
                    containerClass: 'jtabledlg-w50proc',
                    display:function(data){
                        return '<input type="checkbox" '+ (data.record.standard_part == 1?'checked':'') +' class="standard_part" data-id="'+data.record.id+'" disabled/>';
                    }
                },
                description: {
                    title: langJS('global_description'),
                    create: true,
                    edit: true,
                    list: true,
                    type: 'textarea',
                    width: '13%',
                    containerClass : 'jtabledlg-w50proc',
                },
                param_list:{
                    title: langJS('global_params'),
                    list:true,
                    create:false,
                    edit:false,
                    sorting: true,
                    listClass: 'text-left param_list',
                    width: '15%',
                },
                
            },
            formCreated: function (event, data) {
                var $dialog = data.form.parent();
                var $quantity = data.form.find('input[name="quantity"]');
                var $broken_quantity = data.form.find('input[name="broken_quantity"]');
                var $categ_id = data.form.find('input[name="categ_id"]');
                
                $quantity.dspinner({
                    suffix: '',
                    step: 1,
                    places:0,
                    increment: 'fast',
                    allowNull: false,
                    min:0,
                    max:999999
                });

                $broken_quantity.dspinner({
                    suffix: '',
                    step: 1,
                    places:0,
                    increment: 'fast',
                    allowNull: false,
                    min:0,
                    max:999999
                });

                $categ_id.select2(APP.select2.select2_options_ajax('Tool_stock/sel2_categs',{
                    allowClear: true,
                    cacheKEY:'sel2.categs',
                })).on('change',function(){
                    APP.get_custom_data($param_div, $(this).val(), (data.record?data.record.id:''));
                });

                $categ_id.prop('readonly', true);

                var $param_div_container = $('<div id="params_div_container" class="dent-input-container" style="float:right; width: 48%;">'+
                '</div>');
                var $param_div = $('<div id="params_div" class="dent-input-container">'+
                '</div>');
                var $title_div = $('<h2 class="title_param" style="color: #3B81CD;font-size: 15px;">'+langJS('global_params')+'</h2>');

                if(data.formType=='edit'){
                    APP.get_custom_data($param_div, data.record.categ_id, data.record.id, data.record);
                }else{
                    APP.get_custom_data($param_div,params.categ_id);
                }

                data.form.find('.clear_left').remove();
                data.form.find('.title_param').remove();
                data.form.prepend('<div class="clear_left" style="width:50%; clear: left; height:22px;"></div>');
                $param_div_container.append($title_div);
                $param_div_container.append($param_div);
                data.form.prepend($param_div_container);
                //data.form.css("width", "50%");
                data.form.find('.jtable-input-field-container').css("float", "left").css("clear", "left");

                data.form.validationEngine();
            },
            formSubmitting: function (event, data) {
                var stock_params = [];
                $.each($('input.custom_field'), function() {
                    let data = $(this).data('data');
                    var serialized = {
                        param_id: data.typeid,
                        id: data.id?data.id:'',
                        value: $(this).val(),
                    };
                    stock_params.push(serialized);
                });
                data.form.find('input[name=stock_params]').val(JSON.stringify(stock_params));

                return data.form.validationEngine('validate');
            },
            recordAdded: function (event, data) {
            },
            recordUpdated: function (event, data){
                data.thisTable.jtable('reload');
            },
            recordDeleted: function (event, data) {
            },
            formClosed: function (event, data) {
                data.form.validationEngine('hide');
                data.form.validationEngine('detach');
            },
            rowInserted: function(event, data){
            },
            recordsLoaded: function(event, data){
                var touchtime = 0;
                $('.jtable-data-row').on('click', function(ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    var row_id = $(this).attr('data-record-key');
                    let rdata = $('#tool_stock_categ').jtable('getRowByKey',row_id).data('record');
                    if (touchtime == 0) {
                        // set first click
                        touchtime = new Date().getTime();
                    } else {
                        // compare first click to this click and see if they occurred within double click threshold
                        if (((new Date().getTime()) - touchtime) < 800) {
                            // double click occurred
                            if(params.in==1){
                                APP.paramDialogIn(row_id, data.thisTable, rdata);
                            }else{
                                APP.paramDialog(row_id, data.thisTable, rdata);
                            }
                            touchtime = 0;
                        } else {
                            // not a double click so set as a new first click
                            touchtime = new Date().getTime();
                        }
                    }
                });
            },
    });

    //$('#tool_stock').jtable('load');
    crud_jsupdate('Tool_settings/list_params', {'categ_id': params.categ_id} ,
            function(data) {
                if (data.Records.length>0) {
                    var boxes_op = [];
                    $.each(data.Records, function(index, value) {
                        var filter = {};
                        switch (value.type) {
                            case '1':
                            case '3':
                                filter = {
                                    name: 'filter_'+value.id,
                                    label:value.name,
                                    type:"text",
                                    visible:true,
                                    disabled:false,
                                    icons:["search","clear"],
                                    value:'',
                                };
                                break;
                            case '2':
                                var op_arr = value.type_values.split(/\r\n|\n\r|\n|\r/);
                                var data = $.map(op_arr, function (obj) {
                                    return {id: obj, name: obj};
                                });
                                filter = {
                                    name: 'filter_'+value.id,
                                    label:value.name,
                                    type:'select2',
                                    sel2DisplayData:'name',
                                    createOptions:APP.select2.select2_options({
                                        allowClear: true,
                                        data:data
                                    })
                                };
                                break;
                            case '4':
                                filter = {
                                    name: 'filter_'+value.id,
                                    label:value.name,
                                    type:    "numberinterval",
                                    visible: true,
                                    disabled: false,
                                    width:'290px'
                                };
                                break;
                            
                        }
                        boxes_op.push(filter);
                    });
                    $('#tool_stock_categ-filter').dfilter({
                        messages:APP.dfilter.messages(),
                        title:langJS('global_filter'),
                        opened:true,
                        triggerChangeOnLoad:true,
                        boxes: boxes_op,
                        onChange:function($form){
                            var serialized = $form.serializeArray();
                            $('#tool_stock_categ').jtable('load', serialized);
                        }
                    });
                }
        }
    );

    function load_categ(){
        crud_jsupdate('Tool_settings/list_tool_categs', function(retData){
            $('#categ_container').html('');
            let categs = retData.Records;
            $.each(categs, function(i, item) {
                var $item = build_item(item);
                $('#categ_container').append($item);
            });
            
        });
    };


    var build_item = function(item, button = true){
        var $categ = $('<div class="categ_item_container"><a style="display: block; height: 150px; cursor:pointer;"><img style="width:100%; height: 100%;" src="'+base_url()+(item.image?'upload/images/'+item.image:'images/image_not_available.png')+'?'+ new Date().getTime()+'"></img></a></div>');
      return $categ;
    };

    load_categ();

};