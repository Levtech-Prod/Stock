var jobs_status_view = function(params){
    $('#jobs_status').jtable({
            title: langJS('global_statuses'),
            messages:jtable_lang({}),
            dialogShowEffect:null,
            dialogHideEffect:null,
            insertDialogWidth:'400',
            editDialogWidth:'400',
            paging: true, //Enable paging
            pageSize: 10, //Set page size (default: 10)
            sorting: true, //Enable sorting
            defaultSorting: 'sort ASC', //Set default sorting
            selecting: false,
            multiselect: false,
            selectingCheckboxes: false,
            selectOnRowClick :false,
            actions: {
                listAction:   build_url('index.php/Jobs_status/list_jobs_status'),
                createAction: build_url('index.php/Jobs_status/create_jobs_status'),
                updateAction: build_url('index.php/Jobs_status/update_jobs_status'),
                deleteAction: build_url('index.php/Jobs_status/delete_jobs_status')
            },
            fields: {
                id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                name:{
                    title: langJS('global_name'),
                    list:true,
                    create:true,
                    edit:true,
                    sorting: true,
                    listClass: 'text-left',
                    inputClass: 'validate[required, minSize[2]]',
                    width: '30%',
                },
                colour: {
                    title: langJS('global_colour'),
                    create: true,
                    edit: true,
                    inputClass: 'colpicker',
                    display: function(data){
                        $ret = '<div class="color_block" style="background-color: '+data.record.colour+'"></div>';
                        return $ret;
                    },
                    sorting: false,
                    containerClass: 'jtabledlg-w100proc',
                },
                sort:{
                    title: langJS('global_sort'),
                    list:true,
                    create:true,
                    edit:true,
                    sorting: true,
                    listClass: 'text-left',
                    inputClass: 'validate[custom[number]]',
                    width: '20%',
                },
                type:{
                    title: langJS('global_type'),
                    sorting: false,
                    list: true,
                    create: true,
                    edit: true,
                    containerClass : 'jtabledlg-w100proc',
                    inputClass: 'sel2-100 select2-done',
                    defaultValue: '0',
                    display:function(data){
                        var ret;
                        switch(data.record.type) {
                            case '0':
                                ret = 'Általános';
                                break;
                            case '1':
                                ret = 'CNC gép';
                                break;
                            case '2':
                                ret = 'QC típus';
                                break;
                        }
                        return ret;
                    }
                },
                show_message:{
                    title: langJS('global_message'),
                    sorting: false,
                    list: true,
                    create: true,
                    edit: true,
                    containerClass : 'jtabledlg-w100proc',
                    inputClass: 'sel2-100 select2-done',
                    defaultValue: '0',
                    display:function(data){
                        var ret;
                        switch(data.record.show_message) {
                            case '0':
                                ret = langJS('global_none');
                                break;
                            case '1':
                                ret = langJS('global_drop');
                                break;
                            case '2':
                                ret = langJS('global_drag');
                                break;
                        }
                        return ret;
                    }
                },
                message: {
                    title: langJS('global_message'),
                    create: true,
                    edit: true,
                    list: true,
                    type: 'textarea',
                    width: '15%',
                    inputClass: 'height-y-70 resize-y-300',
                    containerClass : 'jtabledlg-w100proc',
                },
                ord: {
                    title: langJS('global_sort_change'),
                    edit: false,
                    create:false,
                    sorting:false,
                    listClass: 'jtable-command-order',
                    display: function (data) {
                        //create container for ordering
                        return '<div class="ordering_arrows" rec_id="'+data.record.id+'"></div>';
                    },
                    containerClass: 'jtabledlg-w50proc',
                },
            },
            formCreated: function (event, data) {
                var $type = data.form.find('input[name="type"]');
                var $col_elem = data.form.find('input[name="colour"]');
                var $show_message = data.form.find('input[name="show_message"]');
                $col_elem.colpick(APP.colpick.colpick_options({
                    color:$col_elem.val(),
                    onChange:function(hsb,hex,rgb,el,bySetColor) {
                        $(el).css('border-color','#'+hex).css('background-color','#'+hex);
                        if(!bySetColor){ $(el).val('#'+hex); }
                    }
                }));
                $col_elem.prop('readonly',true);
                $col_elem.css('border-color',$col_elem.val()).css('background-color','#'+$col_elem.val());
                
                $type.select2(APP.select2.select2_options({
                    allowClear: false,
                    data: [{id:'0', value: 'Általános'}, {id:'1', value:'CNC gép'}, {id:'2', value:'QC típus'}]
                }));

                $show_message.select2(APP.select2.select2_options({
                    allowClear: false,
                    data: [{id:'0', value: langJS('global_none')}, {id:'1', value:langJS('global_drop')}, {id:'2', value:langJS('global_drag')}]
                }));

                data.form.validationEngine();
            },
            formSubmitting: function (event, data) {
                return data.form.validationEngine('validate');
            },
            recordAdded: function (event, data) {
                APP.select2.cache_clear('sel2.status');
            },
            recordUpdated: function (event, data){
                APP.select2.cache_clear('sel2.status');
            },
            recordDeleted: function (event, data) {
                APP.select2.cache_clear('sel2.status');
            },
            formClosed: function (event, data) {
                data.form.validationEngine('hide');
                data.form.validationEngine('detach');
            },
            rowInserted: function(event, data){
                if (data.record.id<=0) {
                   data.row.find('.jtable-command-column:not(:first) button').hide();
                }
            },
            recordsLoaded: function(event, data){
                APP.jTable.renderOrderingArrows($(this), data, build_url('index.php/Jobs_status/order_element'));
            },
    });

    $('#jobs_status').jtable('load');

    $('#wage').dspinner({
        suffix: APP.settings.currency+'/'+langJS('global_hour'),
        step: 1,
        places:2,
        increment: 'slow',
        allowNull: false,
        min:0,
        max:999999
    }).off('change.dchange').on('change.dchange', function(){
        crud_jsupdate('Jobs_status/change_wage',{id:1, wage: $('#wage').dspinner('value')},function(){
        });
    });

    $('#treatment').dspinner({
        suffix: APP.settings.currency+'/dm2',
        step: 1,
        places:2,
        increment: 'slow',
        allowNull: false,
        min:0,
        max:999999
    }).off('change.dchange').on('change.dchange', function(){
        crud_jsupdate('Jobs_status/change_wage',{id:1, treatment: $('#treatment').dspinner('value')},function(){
        });
    });

    $('#quoting').dspinner({
        suffix: APP.settings.currency+'/'+langJS('global_hour'),
        step: 1,
        places:2,
        increment: 'slow',
        allowNull: false,
        min:0,
        max:999999
    }).off('change.dchange').on('change.dchange', function(){
        crud_jsupdate('Jobs_status/change_wage',{id:1, quoting: $('#quoting').dspinner('value')},function(){
        });
    });

    $('#invoice_nr').dspinner({
        step: 1,
        places:0,
        increment: 'slow',
        allowNull: false,
        min:0,
        max:999999
    }).off('change.dchange').on('change.dchange', function(){
        crud_jsupdate('Jobs_status/change_wage',{id:1, invoice_nr: $('#invoice_nr').dspinner('value')},function(){
        });
    });

    $('#do_archive').on('click',function () {
        crud_jsupdate('Jobs_status/do_archive',{},function(){
            APP.showMessage("Konfirmálás","Archiválás sikeres!");
        });
    });

    $('#quoting_status').jtable({
        title: langJS('global_quoting_statuses'),
        messages:jtable_lang({}),
        dialogShowEffect:null,
        dialogHideEffect:null,
        insertDialogWidth:'300',
        editDialogWidth:'300',
        paging: true, //Enable paging
        pageSize: 10, //Set page size (default: 10)
        sorting: true, //Enable sorting
        defaultSorting: 'sort ASC', //Set default sorting
        selecting: false,
        multiselect: false,
        selectingCheckboxes: false,
        selectOnRowClick :false,
        actions: {
            listAction:   build_url('index.php/Jobs_status/list_quoting_status'),
            createAction: build_url('index.php/Jobs_status/create_quoting_status'),
            updateAction: build_url('index.php/Jobs_status/update_quoting_status'),
            deleteAction: build_url('index.php/Jobs_status/delete_quoting_status')
        },
        fields: {
            id: {
                key: true,
                create: false,
                edit: false,
                list: false
            },
            name:{
                title: langJS('global_name'),
                list:true,
                create:true,
                edit:true,
                sorting: true,
                listClass: 'text-left',
                inputClass: 'validate[required, minSize[2]]',
                width: '60%',
            },
            colour: {
                title: langJS('global_colour'),
                create: true,
                edit: true,
                inputClass: 'colpicker',
                display: function(data){
                    $ret = '<div class="color_block" style="background-color: '+data.record.colour+'"></div>';
                    return $ret;
                },
                sorting: false,
                containerClass: 'jtabledlg-w100proc',
            },
            sort:{
                title: langJS('global_sort'),
                list:true,
                create:true,
                edit:true,
                sorting: true,
                listClass: 'text-left',
                inputClass: 'validate[custom[number]]',
                width: '20%',
            },
            ord: {
                title: langJS('global_sort_change'),
                edit: false,
                create:false,
                sorting:false,
                listClass: 'jtable-command-order',
                display: function (data) {
                    //create container for ordering
                    return '<div class="ordering_arrows" rec_id="'+data.record.id+'"></div>';
                },
                containerClass: 'jtabledlg-w50proc',
            },
        },
        formCreated: function (event, data) {
            var $type = data.form.find('input[name="type"]');
            var $col_elem = data.form.find('input[name="colour"]');
            $col_elem.colpick(APP.colpick.colpick_options({
                color:$col_elem.val(),
                onChange:function(hsb,hex,rgb,el,bySetColor) {
                    $(el).css('border-color','#'+hex).css('background-color','#'+hex);
                    if(!bySetColor){ $(el).val('#'+hex); }
                }
            }));
            $col_elem.prop('readonly',true);
            $col_elem.css('border-color',$col_elem.val()).css('background-color','#'+$col_elem.val());
            
            $type.select2(APP.select2.select2_options({
                allowClear: false,
                data: [{id:'0', value: 'Általános'}, {id:'1', value:'CNC gép'}, {id:'2', value:'QC típus'}]
            }));

            data.form.validationEngine();
        },
        formSubmitting: function (event, data) {
            return data.form.validationEngine('validate');
        },
        recordAdded: function (event, data) {
            APP.select2.cache_clear('sel2.status');
        },
        recordUpdated: function (event, data){
            APP.select2.cache_clear('sel2.status');
        },
        recordDeleted: function (event, data) {
            APP.select2.cache_clear('sel2.status');
        },
        formClosed: function (event, data) {
            data.form.validationEngine('hide');
            data.form.validationEngine('detach');
        },
        rowInserted: function(event, data){
            if (data.record.id<=0) {
               data.row.find('.jtable-command-column:not(:first) button').hide();
            }
        },
        recordsLoaded: function(event, data){
            APP.jTable.renderOrderingArrows($(this), data, build_url('index.php/Jobs_status/order_quoting_element'));
        },
    });

    $('#quoting_status').jtable('load');

    $('#clients').jtable({
        title: langJS('global_clients'),
        messages:jtable_lang({}),
        dialogShowEffect:null,
        dialogHideEffect:null,
        insertDialogWidth:'450',
        editDialogWidth:'450',
        paging: true, //Enable paging
        pageSize: 10, //Set page size (default: 10)
        sorting: true, //Enable sorting
        defaultSorting: 'name ASC', //Set default sorting
        selecting: false,
        multiselect: false,
        selectingCheckboxes: false,
        selectOnRowClick :false,
        actions: {
            listAction:   build_url('index.php/Jobs_status/list_clients'),
            createAction: build_url('index.php/Jobs_status/create_clients'),
            updateAction: build_url('index.php/Jobs_status/update_clients'),
            deleteAction: build_url('index.php/Jobs_status/delete_clients')
        },
        fields: {
            id:{
                key: true,
                title: langJS('global_name'),
                list:true,
                create:true,
                edit:true,
                sorting: true,
                listClass: 'text-left',
                inputClass: 'validate[required, minSize[2]]',
                width: '30%',
            },
            regcode:{
                title: 'Company registration',
                list:true,
                create:true,
                edit:true,
                sorting: true,
                listClass: 'text-left',
                width: '15%',
            },
            head_office:{
                title: 'Head office',
                list:true,
                create:true,
                edit:true,
                sorting: true,
                listClass: 'text-left',
                width: '15%',
            },
            invoice_info:{
                title: langJS('global_invoice_info'),
                list:true,
                create:true,
                edit:true,
                sorting: true,
                listClass: 'text-left',
                width: '20%',
                type: 'textarea',
                inputClass: 'height-y-45 resize-y-300',
                containerClass : 'jtabledlg-w100proc',
            },
        },
        formCreated: function (event, data) {
            data.form.validationEngine();
        },
        formSubmitting: function (event, data) {
            return data.form.validationEngine('validate');
        },
        recordAdded: function (event, data) {
            APP.select2.cache_clear('sel2.clients');
            APP.select2.cache_clear('sel2.quoting_clients');
        },
        recordUpdated: function (event, data){
            APP.select2.cache_clear('sel2.clients');
            APP.select2.cache_clear('sel2.quoting_clients');
            data.thisTable.jtable('reload');
        },
        recordDeleted: function (event, data) {
            APP.select2.cache_clear('sel2.clients');
            APP.select2.cache_clear('sel2.quoting_clients');
        },
        formClosed: function (event, data) {
            data.form.validationEngine('hide');
            data.form.validationEngine('detach');
        }
    });

    $('#clients').jtable('load');

    $('#handlings').jtable({
        title: langJS('global_handling'),
        messages:jtable_lang({}),
        dialogShowEffect:null,
        dialogHideEffect:null,
        insertDialogWidth:'300',
        editDialogWidth:'300',
        paging: true, //Enable paging
        pageSize: 10, //Set page size (default: 10)
        sorting: true, //Enable sorting
        defaultSorting: 'name ASC', //Set default sorting
        selecting: false,
        multiselect: false,
        selectingCheckboxes: false,
        selectOnRowClick :false,
        actions: {
            listAction:   build_url('index.php/Jobs_status/list_handlings'),
            createAction: build_url('index.php/Jobs_status/create_handlings'),
            updateAction: build_url('index.php/Jobs_status/update_handlings'),
            deleteAction: build_url('index.php/Jobs_status/delete_handlings')
        },
        fields: {
            id:{
                key: true,
                title: langJS('global_name'),
                list:true,
                create:true,
                edit:true,
                sorting: true,
                listClass: 'text-left',
                inputClass: 'validate[required, minSize[2]]',
                width: '30%',
            },
        },
        formCreated: function (event, data) {
            data.form.validationEngine();
        },
        formSubmitting: function (event, data) {
            return data.form.validationEngine('validate');
        },
        recordAdded: function (event, data) {
            APP.select2.cache_clear('sel2.handlings');
        },
        recordUpdated: function (event, data){
            APP.select2.cache_clear('sel2.handlings');
            data.thisTable.jtable('reload');
        },
        recordDeleted: function (event, data) {
            APP.select2.cache_clear('sel2.handlings');
        },
        formClosed: function (event, data) {
            data.form.validationEngine('hide');
            data.form.validationEngine('detach');
        }
    });

    $('#handlings').jtable('load');

};