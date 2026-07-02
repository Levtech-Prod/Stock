var stock_view = function(params){
    $('#stock').jtable({
            title: langJS('global_stock'),
            messages:jtable_lang({}),
            dialogShowEffect:null,
            dialogHideEffect:null,
            insertDialogWidth:'400',
            editDialogWidth:'400',
            paging: true, //Enable paging
            pageSize: 25, //Set page size (default: 10)
            sorting: true, //Enable sorting
            defaultSorting: 'name ASC', //Set default sorting
            selecting: false,
            multiselect: false,
            multiSorting: true,
            selectingCheckboxes: false,
            selectOnRowClick :false,
            actions: {
                listAction:   'Stock/list_stock',
                createAction: 'Stock/create_stock',
                updateAction: 'Stock/update_stock',
                deleteAction: 'Stock/delete_stock'
            },
            fields: {
                id: {
                    title: langJS('global_id'),
                    key: true,
                    create: false,
                    edit: false,
                    list: true,
                    width: '5%',
                },
                materialid:{
                    title: langJS('global_material'),
                    create: true,
                    edit: true,
                    list: true,
                    sorting: true,
                    sortField:'m.name',
                    inputClass: 'sel2-100 select2-done validate[required]',
                    containerClass : 'jtabledlg-w100proc',
                    width: '10%',
                    display: function(data){
                        return data.record.material_name + (data.record.material_code?' - '+data.record.material_code+'':"");
                    }
                },
                quantity:{
                    title: langJS('global_quantity'),
                    create: true,
                    edit: true,
                    list: true,
                    sorting: true,
                    sortField:'s.quantity',
                    width: '6%',
                    listClass: 'text-center',
                    inputClass: 'validate[required]',
                    containerClass : 'jtabledlg-w100proc',
                    display: function(data){
                        return '<b>'+data.record.quantity+'<b>';
                    }
                },
                cylinder:{
                    title: langJS('global_cylinder'),
                    list: true,
                    edit: true,
                    create: true,
                    sorting: false,
                    type: 'checkbox',
                    values: { '0': '', '1': '' },
                    listClass: 'text-center',
                    display:function(data){
                        return '<input type="checkbox" class="change_private" '+(data.record.cylinder == 1?"checked":"")+' data-id="'+data.record.id+'" disabled />';
                    }
                },
                height:{
                    title: langJS('global_height'),
                    create: true,
                    edit: true,
                    list: true,
                    sorting: true,
                    sortField:'s.height',
                    width: '10%',
                    listClass: 'text-right',
                    inputClass: 'validate[required]',
                    containerClass : 'jtabledlg-w100proc',
                    display: function(data){
                        return data.record.cylinder==1?' - ':(data.record.height+' '+constJS('UNIT'));
                    }
                },
                width:{
                    title: langJS('global_width'),
                    create: true,
                    edit: true,
                    list: true,
                    sorting: true,
                    sortField:'s.width',
                    width: '10%',
                    listClass: 'text-right',
                    inputClass: 'validate[required]',
                    containerClass : 'jtabledlg-w100proc',
                    display: function(data){
                        return data.record.cylinder==1?' - ':(data.record.width+' '+constJS('UNIT'));
                    }
                },
                length:{
                    title: langJS('global_length'),
                    create: true,
                    edit: true,
                    list: true,
                    sorting: true,
                    sortField:'s.length',
                    width: '10%',
                    listClass: 'text-right',
                    inputClass: 'validate[required]',
                    containerClass : 'jtabledlg-w100proc',
                    display: function(data){
                        return data.record.length+' '+constJS('UNIT');
                    }
                },
                diameter:{
                    title: langJS('global_diameter'),
                    create: true,
                    edit: true,
                    list: true,
                    sorting: true,
                    sortField:'s.diameter',
                    width: '10%',
                    listClass: 'text-right',
                    inputClass: 'validate[required]',
                    containerClass : 'jtabledlg-w100proc',
                    display: function(data){
                        return data.record.diameter+' '+constJS('UNIT');
                    }
                },
                shelf:{
                    title: langJS('global_shelf'),
                    create: true,
                    edit: true,
                    list: true,
                    sorting: true,
                    inputClass: 'validate[required]',
                    containerClass : 'jtabledlg-w100proc',
                    width: '8%'
                },
                description: {
                    title: langJS('global_description'),
                    create: true,
                    edit: true,
                    list: true,
                    type: 'textarea',
                    width: '13%',
                    containerClass : 'jtabledlg-w100proc',
                },
                ts:{
                    title: langJS('global_insert_date'),
                    list:true,
                    create:false,
                    edit:false,
                    width: '10%',
                    listClass: 'text-right',
                    display: function(data){
                        return data.record.ts;
                    }
                },
                weight:{
                    title: langJS('global_weight')+' (kg)',
                    list:true,
                    create:false,
                    edit:false,
                    width: '10%',
                    listClass: 'text-right',
                    display: function(data){
                        return parseFloat(data.record.weight).toFixed(4);
                    }
                },
                quantity_minus:{
                    title: langJS('global_quantity_minus'),
                    create: false,
                    edit: false,
                    list: true,
                    sorting:false,
                    width:'2%',
                    listClass:'text-center',
                    display: function(data){
                        var $btn = APP.jTable.createButton({icon:'fas fa-minus',classes:'rbtn-orange btn-minus',title:langJS("global_quantity_minus")});
                        $btn.off('click').on('click',function(){
                            if(parseInt(data.record.quantity)>0){
                                crud_jsupdate('Stock/update_stock',{id: data.record.id, quantity:parseInt(data.record.quantity)-1, cylinder: data.record.cylinder}, function(retData){
                                    $('#stock').jtable('updateRecord', {
                                        clientOnly: true,
                                        record: {
                                            id: data.record.id,
                                            quantity: parseInt(data.record.quantity)-1
                                        }
                                    });
                                });
                            }
                        });
                        return $btn;
                    }
                },
                quantity_plus:{
                    title: langJS('global_quantity_plus'),
                    create: false,
                    edit: false,
                    list: true,
                    sorting:false,
                    width:'2%',
                    listClass:'text-center',
                    display: function(data){
                        var $btn = APP.jTable.createButton({icon:'fas fa-plus',classes:'rbtn-green btn-plus',title:langJS("global_quantity_plus")});
                        $btn.off('click').on('click',function(){
                            crud_jsupdate('Stock/update_stock',{id: data.record.id, quantity:parseInt(data.record.quantity)+1, cylinder: data.record.cylinder}, function(retData){
                                $('#stock').jtable('updateRecord', {
                                    clientOnly: true,
                                    record: {
                                        id: data.record.id,
                                        quantity: parseInt(data.record.quantity)+1
                                    }
                                });
                            });
                        });
                        return $btn;
                    }
                },
                print_label:{
                    title: langJS('global_print'),
                    create: false,
                    edit: false,
                    list: true,
                    sorting:false,
                    width:'2%',
                    listClass:'text-center',
                    display: function(data){
                        var $btn = APP.jTable.createButton({icon:'fas fa-print',classes:'rbtn-blue btn-print',title:langJS("global_print")});
                        $btn.off('click').on('click',function(){
                            print_record(data.record);                  
                        });
                        return $btn;
                    }
                },
            },
            formCreated: function (event, data) {
                var $quantity = data.form.find('input[name="quantity"]');
                var $width = data.form.find('input[name="width"]');
                var $length = data.form.find('input[name="length"]');
                var $height = data.form.find('input[name="height"]');
                var $cylinder = data.form.find('input[name="cylinder"]');
                var $diameter = data.form.find('input[name="diameter"]');
                var $materialid = data.form.find('input[name="materialid"]');
                
                $quantity.dspinner({
                    suffix: '',
                    step: 1,
                    places:0,
                    increment: 'fast',
                    allowNull: false,
                    min:0,
                    max:999999
                });

                $width.dspinner({
                    suffix: ' '+constJS('UNIT'),
                    step: 1,
                    places: 1,
                    increment: 'fast',
                    allowNull: false,
                    min:0,
                    max:999999
                });

                $length.dspinner({
                    suffix: ' '+constJS('UNIT'),
                    step: 1,
                    places: 1,
                    increment: 'fast',
                    allowNull: false,
                    min:0,
                    max:999999
                });

                $height.dspinner({
                    suffix: ' '+constJS('UNIT'),
                    step: 1,
                    places: 1,
                    increment: 'fast',
                    allowNull: false,
                    min:0,
                    max:999999
                });

                $diameter.dspinner({
                    suffix: ' '+constJS('UNIT'),
                    step: 1,
                    places: 1,
                    increment: 'fast',
                    allowNull: false,
                    min:0,
                    max:999999
                });

                $materialid.select2(APP.select2.select2_options_ajax('Stock/sel2_materials',{
                    allowClear: true,
                    cacheKEY:'sel2.materials',
                }));

                $cylinder.on('click',function(){
                    if($(this).prop('checked')){
                        $width.dspinner( "value", 0 );
                        $width.parent().parent().hide();
                        $height.dspinner( "value", 0 );
                        $height.parent().parent().hide();
                        $diameter.parent().parent().show();
                    }else{
                        $width.parent().parent().show();
                        $height.parent().parent().show();
                        $diameter.dspinner( "value", 0 );
                        $diameter.parent().parent().hide();
                    }
                });

                if (data.formType=='edit'){
                    if($cylinder.prop('checked')){
                        $width.parent().parent().hide();
                        $height.parent().parent().hide();
                    }else{
                        $diameter.parent().parent().hide();
                    }
                }

                if (data.formType=='create'){
                    $diameter.dspinner( "value", 0 );
                    $diameter.parent().parent().hide();
                }

                data.form.validationEngine();
            },
            formSubmitting: function (event, data) {
                var $width = data.form.find('input[name="width"]');
                var $length = data.form.find('input[name="length"]');
                var $height = data.form.find('input[name="height"]');
                var $diameter = data.form.find('input[name="diameter"]');
                $width.val(parseFloat($width.val()).toFixed(1));
                $length.val(parseFloat($length.val()).toFixed(1));
                $height.val(parseFloat($height.val()).toFixed(1));
                $diameter.val(parseFloat($diameter.val()).toFixed(1));
                return data.form.validationEngine('validate');
            },
            recordAdded: function(event, data){
                crud_jsupdate('Stock/get_material_data',{materialid: data.record.materialid}, function(retData){
                    data.record.material_name = retData.Record.name;
                    data.record.material_code = retData.Record.code;
                    print_record(data.record);
                });
                var serialized = $('#stock-filter').dfilter('serializeArray');
                crud_jsupdate('Stock/get_stock_total',serialized, function(retData){
                    $('#total_weight').html(retData.total);
                });
                APP.select2.cache_clear('sel2.stock');
            },
            recordUpdated: function (event, data){
                data.thisTable.jtable('reload');
                var serialized = $('#stock-filter').dfilter('serializeArray');
                crud_jsupdate('Stock/get_stock_total',serialized, function(retData){
                    $('#total_weight').html(retData.total);
                });
                APP.select2.cache_clear('sel2.stock');
            },
            recordDeleted: function (event, data) {
                APP.select2.cache_clear('sel2.stock');
            },
            formClosed: function (event, data) {
                data.form.validationEngine('hide');
                data.form.validationEngine('detach');
            }
    });

    //$('#stock').jtable('load');

    $('#stock-filter').dfilter({
        messages:APP.dfilter.messages(),
        title:langJS('global_filter'),
        opened:true,
        triggerChangeOnLoad:true,
        boxes:[
            {
                name:'filter_material',
                label:langJS('global_material'),
                type:'select2',
                sel2DisplayData:'text',
                createOptions:APP.select2.select2_options_ajax('Stock/sel2_materials',{
                    allowClear: true,
                    cacheKEY:'sel2.materials',
                })
            },
            {
                name:    "filter_height",
                label:   langJS('global_height')+' (min - max)',
                type:    "numberinterval",
                visible: true,
                disabled: false,
                width:'290px'
            },
            {
                name:    "filter_width",
                label:   langJS('global_width')+' (min - max)',
                type:    "numberinterval",
                visible: true,
                disabled: false,
                width:'290px'
            },
            {
                name:    "filter_length",
                label:   langJS('global_length')+' (min - max)',
                type:    "numberinterval",
                visible: true,
                disabled: false,
                width:'290px'
            },
            {
                name:    "filter_diameter",
                label:   langJS('global_diameter')+' (min - max)',
                type:    "numberinterval",
                visible: true,
                disabled: false,
                width:'290px'
            },
            {
                name:    "filter_quantity",
                label:   langJS('global_quantity')+' (min - max)',
                type:    "numberinterval",
                visible: true,
                disabled: false,
                width:'290px'
            },
            {
                name:"filter_search",
                label:langJS('global_shelf')+', '+langJS('global_description'),
                type:"text",
                visible:true,
                disabled:false,
                icons:["search","clear"],
                value:'',
            },
            {
                name:"filter_id",
                label:langJS('global_id'),
                type:"text",
                visible:true,
                disabled:false,
                icons:["search","clear"],
                value:'',
            },
            {
                name:'filter_cylinder',
                label: langJS('global_cylinder'),
                title: langJS('global_cylinder'),
                type:'select2',
                sel2DisplayData:'name',
                createOptions:APP.select2.select2_options({
                    allowClear: true,
                    data:[{id:1,text:langJS('global_yes')},{id:0,text:langJS('global_no')}]
                })
            },
            ],
        onChange:function($form){
            var serialized = $form.serializeArray();
            $('#stock').jtable('load', serialized);
            crud_jsupdate('Stock/get_stock_total',serialized, function(retData){
                $('#total_weight').html(retData.total);
            });
        }
    });

    var print_record = function(record){
        var $container = $('<div />');
        $container.append('<span style="font-size: 24pt;">'+record.material_name+'</span><br/>'+
        '<span style="font-size: 20pt; font-weight:bold;">'+(record.cylinder==1?(record.length+' X '+record.diameter+' (Henger)'):(record.height+' X '+record.width+' X '+record.length))+'</span><br/>'+
        '<span style="font-size: 17pt;">'+record.shelf+'</span><br/>'+
        '<span style="font-size: 14pt; font-weight: bold;">'+record.id+'</span><br/>');
        var style = '<style>body{background:#fff;margin:0;padding:10px;line-height: 1.5;font-family:Verdana,Arial,sans-serif;font-size:12px;}</style>';
        var html = '<html><title>Printing</title><head>'+style+'</head><body><div style="display: inline-block; text-align: center; padding: 20px 10px 20px 10px;">'+$container.html()+'</div></body></html>';
        var newWin= window.open("");
        newWin.document.write(html);
        newWin.print();
        newWin.close();
    }

};