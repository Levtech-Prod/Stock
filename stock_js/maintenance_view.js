var maintenance_view = function(params){

    var jtable_options = {};
    var wp_jtable = {};

    const currentYear = new Date().getFullYear();
    const endYear = currentYear + 5;

    let html = '';

    for (let year = currentYear; year <= endYear; year++) {
        html += `
            <label>
                <input type="radio" name="filter_year" id="filter_year" value="${year}">
                ${year}
            </label>
        `;
    }

    $('#main_year_filter').html(html);

    $('#main_year_filter #filter_year:first').prop('checked', true);

    $('#main_year_filter #filter_year').on('change', function(ev){
        //console.log($('#filter_year:checked').val());
        load_maintenance();
    });
    
    var jtable_settings = function(){
        return {
            messages:jtable_lang({}),
            dialogShowEffect:null,
            dialogHideEffect:null,
            insertDialogWidth:'400',
            editDialogWidth:'400',
            insertDialogHeight:'410',
            editDialogHeight:'410',
            paging: true, //Enable paging
            pageSize: 10, //Set page size (default: 10)
            sorting: true, //Enable sorting
            defaultSorting: 'ts DESC', //Set default sorting
            selecting: false,
            multiselect: false,
            selectingCheckboxes: false,
            selectOnRowClick :false,
            actions: {
                listAction:   'Maintenance/list_maintenance',
                //createAction: 'Maintenance/create_maintenance',
                //updateAction: 'Maintenance/update_maintenance',
                //deleteAction: 'Maintenance/delete_maintenance',
            },
            fields: {
                id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                add:{
                    title: langJS('global_select'),
                    list: true,
                    edit: true,
                    create: true,
                    sorting: false,
                    type: 'checkbox',
                    width: '10%',
                    values: { '0': '', '1': '' },
                    listClass: 'text-center',
                    display:function(data){
                        return '<input type="checkbox" class="main_select_one" rec_id="'+data.record.id+'" value="'+data.record.id+'" '+(data.record.selected==1?'checked':'')+' />';
                    }
                },
                machineid:{
                    type:'hidden',
                    defaultValue:params.machineid
                },
                name: {
                    title: langJS('global_name'),
                    width: '30%',
                    inputClass: 'validate[required, minSize[3]]',
                    listClass: 'text-bold',
                },
                description: {
                    title: langJS('global_description'),
                    create: true,
                    edit: true,
                    list: true,
                    type: 'textarea',
                    width: '50%',
                    inputClass: 'height-150 resize-y-300',
                    containerClass : 'jtabledlg-w100proc',
                },
            },
            formCreated: function (event, data) {
            },
            formSubmitting: function (event, data) {
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
            },
        };
    };

    var load_maintenance = function(){
        if($('#main_week').jtable()){
            $('#main_week').jtable('destroy');
            $('#main_week').empty();
        }
        $('#main_week').jtable({
            title: '',
            showTools: true,
            openChildAsAccordion: true,
            toolbar: {
            },
            fields: {
                params: {
                    title: langJS('global_maintenance'),
                    create:false,
                    edit:false,
                    sorting:false,
                    width:'5%',
                    listClass: 'jtable-command-column',
                    display:function(mdata){
                        var $btn = APP.jTable.createButton({icon:'fas fa-list-alt',classes:'rbtn-orange',title:langJS("global_maintenance")});
                        $btn.click(function () {
                            load_jtable($btn, mdata, '#main_week');
                        });
                        return $btn;
                    }
                },
                week: {
                    create: true,
                    edit: false,
                    list: false
                },
                name:{
                    title: langJS("global_name"),
                    sorting: false,
                },
            },
            rowInserted: function(event, data){
                crud_jsupdate('Maintenance/get_ready_maintenance',{ 'type':1, 'machineid':params.machineid, 'year':$('#filter_year:checked').val(),'week': data.record.week },function(retdata){
                    //console.log(retdata);
                    if(retdata.data.num==retdata.data.ready){
                        data.row.addClass('main_ready');
                    }
                });
            },
        });

        if($('#main_month').jtable()){
            $('#main_month').jtable('destroy');
            $('#main_month').empty();
        }
        $('#main_month').jtable({
            title: '',
            showTools: true,
            openChildAsAccordion: true,
            toolbar: {
            },
            fields: {
                params: {
                    title: langJS('global_maintenance'),
                    create:false,
                    edit:false,
                    sorting:false,
                    width:'5%',
                    listClass: 'jtable-command-column',
                    display:function(mdata){
                        var $btn = APP.jTable.createButton({icon:'fas fa-list-alt',classes:'rbtn-orange',title:langJS("global_maintenance")});
                        $btn.click(function () {
                            load_jtable_month($btn, mdata, '#main_month');
                        });
                        return $btn;
                    }
                },
                month: {
                    key: true,
                    create: true,
                    edit: false,
                    list: false
                },
                name:{
                    title: langJS("global_name"),
                    sorting: false,
                },
            },
            rowInserted: function(event, data){
                crud_jsupdate('Maintenance/get_ready_maintenance',{ 'type':2, 'machineid':params.machineid, 'year':$('#filter_year:checked').val(),'month': data.record.month },function(retdata){
                    //console.log(retdata);
                    if(retdata.data.num==retdata.data.ready){
                        data.row.addClass('main_ready');
                    }
                });
            },
        });

        if($('#main_semester').jtable()){
            $('#main_semester').jtable('destroy');
            $('#main_semester').empty();
        }
        $('#main_semester').jtable({
            title: '',
            showTools: true,
            openChildAsAccordion: true,
            toolbar: {
            },
            fields: {
                params: {
                    title: langJS('global_maintenance'),
                    create:false,
                    edit:false,
                    sorting:false,
                    width:'5%',
                    listClass: 'jtable-command-column',
                    display:function(mdata){
                        var $btn = APP.jTable.createButton({icon:'fas fa-list-alt',classes:'rbtn-orange',title:langJS("global_maintenance")});
                        $btn.click(function () {
                            load_jtable_semester($btn, mdata, '#main_semester');
                        });
                        return $btn;
                    }
                },
                semester: {
                    key: true,
                    create: true,
                    edit: false,
                    list: false
                },
                name:{
                    title: langJS("global_name"),
                    sorting: false,
                },
            },
            rowInserted: function(event, data){
                crud_jsupdate('Maintenance/get_ready_maintenance',{ 'type':3, 'machineid':params.machineid, 'year':$('#filter_year:checked').val(),'semester': data.record.semester },function(retdata){
                    //console.log(retdata);
                    if(retdata.data.num==retdata.data.ready){
                        data.row.addClass('main_ready');
                    }
                });
            },
        });

        for(let i=1; i<=53; i++) {
            var jtableData = {
                week: i,
                name: i+'. '+langJS('global_week'),
            };
            $('#main_week').jtable('addRecord',{record:jtableData,clientOnly: true});
        }

        for(let i=1; i<=12; i++) {
            var jtableData = {
                month: i,
                name: i+'. '+langJS('global_month'),
            };
            $('#main_month').jtable('addRecord',{record:jtableData,clientOnly: true});
        }

        for(let i=1; i<=2; i++) {
            var jtableData = {
                semester: i,
                name: i+'. '+langJS('global_semester'),
            };
            $('#main_semester').jtable('addRecord',{record:jtableData,clientOnly: true});
        }
    };

    load_maintenance();

    var load_jtable = function($img, mdata, div){
        //console.log($('#filter_year:checked').val());
        var jtable_opt = {
            toolbar: {
                /*items: [
                {
                    icon: 'fas fa-plus',
                    tooltip: langJS("global_add_from_list"),
                    text: langJS("global_add_from_list"),
                    cssClass: 'rbtn-red',
                    click: function () {
                        addProcessDialog(mdata, 1);
                    }
                },
                ]*/
            },
            fields: {
                year:{
                    create: true,
                    edit: true,
                    list: false,
                    type: 'hidden',
                    defaultValue:$('#filter_year:checked').val(),
                },
                week: {
                    create: true,
                    edit: false,
                    list: false,
                    type: 'hidden',
                    defaultValue:mdata.record.week,
                },
            },
        };
        $(div).jtable('toggleChildTable',
            $img.closest('tr'),
            $img.closest('td'),
            $.extend(true, jtable_opt, jtable_settings(), {
                actions: {
                    listAction:   'Maintenance/list_maintenance?machineid='+params.machineid+'&type=1&week='+mdata.record.week+'&year='+$('#filter_year:checked').val(),
                    //createAction: 'Maintenance/create_maintenance',
                    //updateAction: 'Maintenance/update_maintenance',
                    //deleteAction: 'Maintenance/delete_maintenance',
                },
                recordsLoaded: function(event, data){
                    //console.log(data);
                    data.thisTable.find('.main_select_one').on("click", function(e){
                        e.stopPropagation();
                        var attrib = $(this).prop("checked");
                        var rec_id = $(this).attr("rec_id");
                        let rdata = data.thisTable.jtable('getRowByKey',rec_id).data('record');
                        var active = 0;
                        if(attrib){ active = 1;}
                        var rparams = {'template_id':rec_id, 'selected':active, 'machineid':params.machineid, 'year':$('#filter_year:checked').val(), 'week': mdata.record.week, 'name': rdata.name, 'description': rdata.description};
                        crud_jsupdate('Maintenance/add_maintenance', rparams, nullFunction);

                        let allch = data.thisTable.find('.main_select_one:checked').length;
                        let tot = data.serverResponse.TotalRecordCount;

                        var $parentRow = $(this).closest('.jtable-child-table-container').closest('tr').prev('.jtable-data-row');
                        if(allch==tot){
                            $parentRow.addClass('main_ready');
                        }else{
                            $parentRow.removeClass('main_ready');
                        }
                    });
                },
            }),
            function (data) { //opened handler
                wp_jtable = data;
                try{
                    data.childTable.jtable('load');
                }catch(e){
                }
            }
        );
    };

    var load_jtable_month = function($img, mdata, div){
        var jtable_opt = {
            toolbar: {
                /*items: [
                {
                    icon: 'fas fa-plus',
                    tooltip: langJS("global_add_from_list"),
                    text: langJS("global_add_from_list"),
                    cssClass: 'rbtn-red',
                    click: function () {
                        addProcessDialog(mdata, 2);
                    }
                },
                ]*/
            },
            fields: {
                year:{
                    create: true,
                    edit: true,
                    list: false,
                    type: 'hidden',
                    defaultValue:$('#filter_year:checked').val(),
                },
                month: {
                    create: true,
                    edit: false,
                    list: false,
                    type: 'hidden',
                    defaultValue:mdata.record.month,
                },
            }
        };
        $(div).jtable('toggleChildTable',
            $img.closest('tr'),
            $img.closest('td'),
            $.extend(true, jtable_opt, jtable_settings(), {
                actions: {
                    listAction:   'Maintenance/list_maintenance?machineid='+params.machineid+'&type=2&month='+mdata.record.month+'&year='+$('#filter_year:checked').val(),
                    //createAction: 'Maintenance/create_maintenance',
                    //updateAction: 'Maintenance/update_maintenance',
                    //deleteAction: 'Maintenance/delete_maintenance',
                },
                recordsLoaded: function(event, data){
                    data.thisTable.find('.main_select_one').on("click", function(e){
                        e.stopPropagation();
                        var attrib = $(this).prop("checked");
                        var rec_id = $(this).attr("rec_id");
                        let rdata = data.thisTable.jtable('getRowByKey',rec_id).data('record');
                        var active = 0;
                        if(attrib){ active = 1;}
                        var rparams = {'template_id':rec_id, 'selected':active, 'machineid':params.machineid, 'year':$('#filter_year:checked').val(), 'month': mdata.record.month, 'name': rdata.name, 'description': rdata.description};
                        crud_jsupdate('Maintenance/add_maintenance', rparams, nullFunction);

                        let allch = data.thisTable.find('.main_select_one:checked').length;
                        let tot = data.serverResponse.TotalRecordCount;

                        var $parentRow = $(this).closest('.jtable-child-table-container').closest('tr').prev('.jtable-data-row');
                        if(allch==tot){
                            $parentRow.addClass('main_ready');
                        }else{
                            $parentRow.removeClass('main_ready');
                        }
                    });
                },
            }),
            function (data) { //opened handler
                wp_jtable = data;
                try{
                    data.childTable.jtable('load');
                }catch(e){
                }
            }
        );
    };

    var load_jtable_semester = function($img, mdata, div){
        var jtable_opt = {
            toolbar: {
                /*items: [
                {
                    icon: 'fas fa-plus',
                    tooltip: langJS("global_add_from_list"),
                    text: langJS("global_add_from_list"),
                    cssClass: 'rbtn-red',
                    click: function () {
                        addProcessDialog(mdata, 3);
                    }
                },
                ]*/
            },
            fields: {
                year:{
                    create: true,
                    edit: true,
                    list: false,
                    type: 'hidden',
                    defaultValue:$('#filter_year:checked').val(),
                },
                semester: {
                    create: true,
                    edit: false,
                    list: false,
                    type: 'hidden',
                    defaultValue:mdata.record.semester,
                },
            }
        };
        $(div).jtable('toggleChildTable',
            $img.closest('tr'),
            $img.closest('td'),
            $.extend(true, jtable_opt, jtable_settings(), {
                actions: {
                    listAction:   'Maintenance/list_maintenance?machineid='+params.machineid+'&type=3&semester='+mdata.record.semester+'&year='+$('#filter_year:checked').val(),
                    //createAction: 'Maintenance/create_maintenance',
                    //updateAction: 'Maintenance/update_maintenance',
                    //deleteAction: 'Maintenance/delete_maintenance',
                },
                recordsLoaded: function(event, data){
                    data.thisTable.find('.main_select_one').on("click", function(e){
                        e.stopPropagation();
                        var attrib = $(this).prop("checked");
                        var rec_id = $(this).attr("rec_id");
                        let rdata = data.thisTable.jtable('getRowByKey',rec_id).data('record');
                        var active = 0;
                        if(attrib){ active = 1;}
                        var rparams = {'template_id':rec_id, 'selected':active, 'machineid':params.machineid, 'year':$('#filter_year:checked').val(), 'semester': mdata.record.semester, 'name': rdata.name, 'description': rdata.description};
                        crud_jsupdate('Maintenance/add_maintenance', rparams, nullFunction);

                        let allch = data.thisTable.find('.main_select_one:checked').length;
                        let tot = data.serverResponse.TotalRecordCount;

                        var $parentRow = $(this).closest('.jtable-child-table-container').closest('tr').prev('.jtable-data-row');
                        if(allch==tot){
                            $parentRow.addClass('main_ready');
                        }else{
                            $parentRow.removeClass('main_ready');
                        }
                    });
                },
            }),
            function (data) { //opened handler
                wp_jtable = data;
                try{
                    data.childTable.jtable('load');
                }catch(e){
                }
            }
        );
    };

    var addProcessDialog = function(data, type){
        var rec = data.record;
        var html =  '<div id="template_add_dialog">'+
                '<div id="template_add_maintenance" class="w100-proc"></div>'+
            '</div>';
        var $container 	= $("<div></div>").html(html);
        $('body').append($container);
        var $dialog = $container.dialog({
            title: langJS('global_maintenance'),
            resizable: false,
            width:950,
            minHeight: 550,
            modal: true,
            autoOpen:true,
            buttons: {
                "ok":{
                    text:langJS('global_save'),class: "button-blue",click: function(){
                        var selected_prods = [];
                        $('.main_select:checked').each(function(i,v){
                            selected_prods.push($(v).val());
                        });
                        if (selected_prods.length>0){
                            var ids = selected_prods.join();
                            crud_jsupdate('Maintenance/add_multiple_maintenance',{'ids':ids, 'machineid':params.machineid, 'year':$('#filter_year:checked').val(), 'week': rec.week, 'month': rec.month, 'semester': rec.semester },function(retdata){
                                wp_jtable.childTable.jtable('reload')
                            });
                        }
                        $(this).dialog("close");
                    },
                },
                "cancel":{
                    text: langJS('global_cancel'),
                    class: "button-orange",
                    click: function() {
                        $(this).dialog("close");
                    }
                }
            },
            create: function(ev, ui){
            },
            open: function(ev, ui){
                template_add_maintenance($container, rec, type);
            },
            close: function(){
                $(this).dialog("destroy").remove();
            },
        });
    };

    var template_add_maintenance = function($dialog, rec, type){
        $dialog.find('#template_add_maintenance').jtable({
                title: '',
                messages:jtable_lang(),
                insertDialogWidth:'400',
                editDialogWidth:'400',
                dialogShowEffect:null,
                dialogHideEffect:null,
                paging: false, //Enable paging
                sorting: true, //Enable sorting
                defaultSorting: 'ts asc', //Set default sorting
                actions: {
                        listAction: 'Maintenance/list_add_maintenance?machineid='+params.machineid+'&type='+type,
                },
                fields: {
                    add:{
                        title: langJS('global_select'),
                        list: true,
                        edit: true,
                        create: true,
                        sorting: false,
                        type: 'checkbox',
                        width: '10%',
                        values: { '0': '', '1': '' },
                        listClass: 'text-center',
                        display:function(data){
                            return '<input type="checkbox" class="main_select" checked value="'+data.record.id+'" />';
                        }
                    },
                    name: {
                        title: langJS('global_name'),
                        width: '20%',
                        inputClass: 'validate[required, minSize[3]]',
                        listClass: 'text-bold',
                    },
                    description: {
                        title: langJS('global_description'),
                        create: true,
                        edit: true,
                        list: true,
                        type: 'textarea',
                        width: '50%',
                        inputClass: 'height-150 resize-y-300',
                        containerClass : 'jtabledlg-w100proc',
                    },
                },
                //Initialize validation logic when a form is created
                formCreated: function (event, data) {
                },
                //Validate form when it is being submitted
                formSubmitting: function (event, data) {
                },
                //Dispose validation logic when form is closed
                formClosed: function (event, data) {
                },
                recordsLoaded: function(event, data) {
                }
            });
            $dialog.find('#template_add_maintenance').jtable('load');
    };
    
};