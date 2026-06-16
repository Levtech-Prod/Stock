var tool_production_view = function(params){

    var jtable_options = {};
    
    var jtable_common_options = {
            messages:jtable_lang({}),
            dialogShowEffect:null,
            dialogHideEffect:null,
            insertDialogWidth:'800',
            editDialogWidth:'800',
            insertDialogHeight:'550',
            editDialogHeight:'550',
            paging: true, //Enable paging
            pageSize: 5, //Set page size (default: 10)
            sorting: true, //Enable sorting
            defaultSorting: 'ts DESC', //Set default sorting
            selecting: false,
            multiselect: false,
            selectingCheckboxes: false,
            selectOnRowClick :false,
            actions: {
                listAction:   build_url('index.php/Tool_in/list_tool_stock_in'),
            },
            fields: {
                id: {
                    title: langJS('global_id'),
                    key: true,
                    create: false,
                    edit: false,
                    list: false,
                    width: '5%',
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
                comment: {
                    title: 'Komment (Projekt - Darab ID)',
                    create: true,
                    edit: true,
                    list: true,
                    type: 'textarea',
                    width: '12%',
                    containerClass : 'jtabledlg-w50proc',
                },
                /*
                description: {
                    title: langJS('global_description'),
                    create: true,
                    edit: true,
                    list: true,
                    type: 'textarea',
                    width: '12%',
                    containerClass : 'jtabledlg-w50proc',
                },*/
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
            },
            rowInserted: function(event, data){
            },
            recordsLoaded: function(event, data){
                //console.log(data);
                data.thisTable.find('.jtable-bottom-panel .jtable-page-info').hide();
                data.thisTable.parent().find('.prod_number').html(data.serverResponse.TotalRecordCount);
                var touchtime = 0;
                 data.thisTable.find('.jtable-data-row').on('click', function(ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    var row_id = $(this).attr('data-record-key');
                    let rdata = data.thisTable.jtable('getRowByKey',row_id).data('record');
                    if (touchtime == 0) {
                        // set first click
                        touchtime = new Date().getTime();
                    } else {
                        // compare first click to this click and see if they occurred within double click threshold
                        if (((new Date().getTime()) - touchtime) < 800) {
                            // double click occurred
                            APP.paramDialogIn(row_id, data.thisTable, rdata);
                            touchtime = 0;
                        } else {
                            // not a double click so set as a new first click
                            touchtime = new Date().getTime();
                        }
                    }
                });
            },
    };

    function load_prodcution(){
        crud_jsupdate('Tool_production/getUsers', function(retData){
            $('#production_container').html('');
            let users = retData.users;
            $.each(users, function(i, item) {
                var $item = build_prodcution_item(item);
                $('#production_container').append($item);
                jtable_options = {};
                $.extend(jtable_options, jtable_common_options);
                $('#prod_'+item.id).jtable(jtable_options);
                $('#prod_'+item.id).jtable("load",{'userid': item.id});
            });
            
        });
    };

    load_prodcution();

    var build_prodcution_item = function(item){
        var $user = $('<div class="production_item_container">'+
            '<div class="prod_header_cont"><span class="prod_number" id="number_'+item.id+'">0</span><span class="prod_header">'+item.username+'</span></div>'+
            '<div id="prod_'+item.id+'"></div>'+
        '</div>');
        return $user;
    };
    
};