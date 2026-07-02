var invoices_view = function(params){
    $('#invoices').jtable({
            title: langJS('global_invoices'),
            messages:jtable_lang({}),
            dialogShowEffect:null,
            dialogHideEffect:null,
            insertDialogWidth:'300',
            editDialogWidth:'300',
            paging: true, //Enable paging
            pageSize: 25, //Set page size (default: 10)
            sorting: true, //Enable sorting
            defaultSorting: 'date DESC', //Set default sorting
            selecting: false,
            multiselect: false,
            selectingCheckboxes: false,
            selectOnRowClick :false,
            actions: {
                listAction:   'Invoices/list_invoices',
                //createAction: 'Invoices/create_invoices',
                //updateAction: 'Invoices/update_invoices',
                deleteAction: 'Invoices/delete_invoices'
            },
            fields: {
                id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                serial:{
                    title: langJS('global_serial'),
                    list:true,
                    create:true,
                    edit:true,
                    sorting: true,
                    listClass: 'text-left',
                    inputClass: 'validate[required, minSize[2]]',
                    width: '7%',
                },
                nr:{
                    title: 'Nr.',
                    list:true,
                    create:true,
                    edit:true,
                    sorting: true,
                    listClass: 'text-left',
                    width: '10%',
                },
                date:{
                    title: langJS('global_date'),
                    list:true,
                    create:true,
                    edit:true,
                    sorting: true,
                    listClass: 'text-left',
                    inputClass: 'validate[required, custom[number]]',
                    width: '10%',
                },
                amount: {
                    title: langJS('global_total')+' (EUR)',
                    create: true,
                    edit: true,
                    list: true,
                    sorting: true,
                    width: '10%',
                    listClass: 'text-right',
                    inputClass: 'validate[required, min[0]]',
                    display: function(data){
                        //return currency_format(data.record.amount);
                        return data.record.amount;
                    }
                },
                client_name:{
                    title: langJS('global_client'),
                    create: true,
                    edit: true,
                    list: true,
                    sorting: true,
                    sortField:'client_name',
                    inputClass: 'sel2-100 select2-done validate[required]',
                    containerClass : 'jtabledlg-w100proc',
                    width: '10%',
                },
                invoice_file: {
                    title: langJS('global_invoice'),
                    create: true,
                    edit: true,
                    list: true,
                    sorting: true,
                    width: '10%',
                    listClass: 'text-right',
                    inputClass: 'validate[required, min[0]]',
                    display: function(data){
                        return '<a href="'+build_url('upload/invoices/')+data.record.invoice_file+'" target="_blank" download>'+data.record.invoice_file.replace('.pdf','')+' ('+currency_format(data.record.amount)+')'+'</a>';
                    }
                },
            },
            formCreated: function (event, data) {
                data.form.validationEngine();
            },
            formSubmitting: function (event, data) {
                return data.form.validationEngine('validate');
            },
            recordAdded: function (event, data) {
            },
            recordUpdated: function (event, data){
            },
            recordDeleted: function (event, data) {
            },
            formClosed: function (event, data) {
                data.form.validationEngine('hide');
                data.form.validationEngine('detach');
            }
    });

    $('#invoices-filter').dfilter({
        messages:APP.dfilter.messages(),
        title:langJS('global_filter'),
        opened:true,
        triggerChangeOnLoad:true,
        boxes:[
            {
                name:'filter_client',
                label:langJS('global_client'),
                type:'select2',
                sel2DisplayData:'text',
                createOptions:APP.select2.select2_options_ajax('Orders/sel2_clients',{
                    allowClear: true,
                    cacheKEY:'sel2.clients',
                })
            },
            {
                name:"filter_search",
                label: 'Nr.',
                type:"text",
                visible:true,
                disabled:false,
                icons:["search","clear"],
                value:'',
            },
            {
                name:    "date",
                label:   langJS('global_interval'),
                type:    "dateinterval",
                visible: true,
                disabled: false,
                icons:["search","clear","today"],
                width:'320px',
                createOptions:datepicker_defaults(),
            },
            {
                name:    "filter_amount",
                label:  langJS('global_total'),
                type:    "numberinterval",
                visible: true,
                disabled: false,
                width:'290px'
            },
            ],
        onChange:function($form){
            var serialized = $form.serializeArray();
            $('#invoices').jtable('load', serialized);
        }
    });

    //$('#invoices').jtable('load');

};