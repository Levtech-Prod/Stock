var orders_view = function(params){
    var uploader; 
    var uploader_job;
    var uploader_po;
    var uploader_w_po;
    var G_uploader;
    var jobs_jtable = {};
    //console.log(params);
    $('#orders').jtable({
            title: langJS('global_orders'),
            messages:jtable_lang({}),
            dialogShowEffect:null,
            dialogHideEffect:null,
            insertDialogWidth:'500',
            insertDialogHeight:'700',
            editDialogWidth:'980',
            editDialogHeight:'830',
            paging: true, //Enable paging
            pageSize: 25, //Set page size (default: 10)
            sorting: true, //Enable sorting
            defaultSorting: 'ts DESC', //Set default sorting
            selecting: false,
            multiselect: false,
            multiSorting: true,
            selectingCheckboxes: false,
            selectOnRowClick :false,
            actions: {
                listAction:   'Orders/list_orders',
                createAction: 'Orders/create_orders',
                updateAction:  (params.manager==0?'Orders/update_orders':null),
                deleteAction:  (params.manager==0?'Orders/delete_orders':null)
            },
            fields: {
                plan: {
                    title: langJS('global_add_to_plan'),
                    width: '2%',
                    display: function (data) {
                        return '<input class="enable_one_plan" title="enable/disable" rec_id="'+data.record.id+'" type="checkbox" '+checkedtext(data.record.plan==1)+' />';
                    },
                    sorting: false,
                    edit: false,
                    create: false,
                    listClass:'enable_one_plan_parent',
                },
                jobs: {
                    title: "",
                    create:false,
                    edit:false,
                    sorting:false,
                    width:'2%',
                    listClass: 'jtable-command-column',
                    display:function(partnerdata){
                        var $btn = APP.jTable.createButton({icon:'fas fa-list-alt',classes:'rbtn-orange open_jobs',title:langJS("global_jobs")});
                        $btn.click(function () {
                            orders_jobs($btn, partnerdata);
                        });
                        return $btn;
                    }
                },
                id: {
                    title: langJS('global_id'),
                    key: true,
                    create: false,
                    edit: false,
                    list: true,
                    width: '3%',
                },
                fileAttachments:{
                    create: true,
                    edit: false,
                    list: false,
                    type: 'hidden',
                },
                poAttachments:{
                    create: true,
                    edit: false,
                    list: false,
                    type: 'hidden',
                },
                name:{
                    title: langJS('global_order_number'),
                    list:true,
                    create:true,
                    edit:true,
                    sorting: false,
                    listClass: 'text-left id_series',
                    inputClass: 'validate[required, minSize[2]]',
                    width: '8%',
                    display: function(data){
                        return data.record.id+' - '+data.record.name;
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
                    width: '7%',
                },
                job_number: {
                    title: langJS('global_job_number'),
                    create: false,
                    edit: false,
                    list: true,
                    sorting: false,
                    width: '4%',
                    listClass: 'text-right',
                },
                status_name: {
                    title: langJS('global_status'),
                    create: false,
                    edit: false,
                    list: true,
                    sorting: true,
                    sortField: 'status',
                    width: '6%',
                    containerClass: 'jtabledlg-w25proc',
                    display:function(data){
                        var ret;
                        let bg_color = 'red';
                        switch(data.record.status) {
                            case '0':
                                ret = langJS('global_init');
                                bg_color = 'red';
                                break;
                            case '1':
                                ret = langJS('global_progress');
                                bg_color = 'blue';
                                break;
                            case '2':
                                ret = langJS('global_ready');
                                bg_color = 'green';
                                break;
                            case '3':
                                ret = langJS('global_can_invoice');
                                bg_color = '#90ff36';
                                break;
                            case '4':
                                ret = langJS('global_closed');
                                bg_color = '#9e989e';
                                break;
                        }
                        return '<div style="background-color:'+bg_color+'; padding: 2px; color: white;">'+ret+' ('+parseFloat(data.record.procent).toFixed(0)+'%)</div>';
                    }
                },
                handling: {
                    title: langJS('global_handling'),
                    create: false,
                    edit: false,
                    list: true,
                    width: '4%',
                    display: function(data){
                        return (data.record.handling==1?langJS('global_yes'):langJS('global_no'));
                    }
                },
                start_date: {
                    title: langJS('global_insert_date'),
                    width: '7%',
                    list: false,
                    inputClass: 'validate[required]',
                    containerClass: 'jtabledlg-w50proc',
                    listClass: 'text-center',
                    sorting: true,
                    defaultValue: moment().format('YYYY-MM-DD'),
                },
                delivery_date: {
                    title: langJS('global_delivery_date'),
                    width: '6%',
                    inputClass: '',
                    containerClass: 'jtabledlg-w50proc',
                    listClass: 'text-center',
                    sorting: true,
                },
                deadline: {
                    create: false,
                    edit: false,
                    list: false,
                    title: langJS('global_prod_deadline'),
                    width: '7%',
                    inputClass: 'validate[required]',
                    containerClass: 'jtabledlg-w50proc',
                    listClass: 'text-center',
                    sorting: true,
                },
                shipping_type: {
                    title: langJS('global_shipping_type'),
                    width: '7%',
                    containerClass : 'jtabledlg-w50proc',
                    inputClass: 'select2-done sel2-100',
                    list:false,
                    create:true,
                    edit:true,
                    display: function(data){
                        return data.record.shipping_type;
                    },
                    listClass:'text-right',
                },
                transport_cost: {
                    title: langJS('global_transport_cost'),
                    create: true,
                    edit: true,
                    list: true,
                    sorting: false,
                    width: '5%',
                    listClass: 'text-right',
                    inputClass: 'validate[required, min[0]]',
                    containerClass : 'jtabledlg-w50proc',
                    display: function(data){
                        return currency_format(parseFloat(data.record.transport_cost).toFixed(2));
                    }
                },
                init_date: {
                    title: langJS('global_init_date'),
                    width: '6%',
                    list: false,
                    //inputClass: 'validate[required]',
                    containerClass: 'jtabledlg-w50proc',
                    listClass: 'text-center',
                    sorting: true,
                    //defaultValue: moment().format('YYYY-MM-DD'),
                },
                intake_date: {
                    title: langJS('global_intake_date'),
                    width: '6%',
                    list: false,
                    //inputClass: 'validate[required]',
                    containerClass: 'jtabledlg-w50proc',
                    listClass: 'text-center',
                    sorting: true,
                    //defaultValue: moment().format('YYYY-MM-DD'),
                },
                invoice_sent:  {
                    title: langJS('global_invoice_sent'),
                    width: '10%',
                    type: 'checkbox',
                    create: false,
                    list: false,
                    edit:true,
                    values: { '0': '', '1': '' },
                    containerClass: 'jtabledlg-w50proc'
                },
                parcel_weight: {
                    title: langJS('global_parcel_weight'),
                    create: false,
                    edit: true,
                    list: false,
                    sorting: false,
                    width: '6%',
                    listClass: 'text-right',
                    inputClass: 'validate[required, min[0]]',
                    containerClass : 'jtabledlg-w50proc',
                    display: function(data){
                        return parseFloat(data.record.parcel_weight).toFixed(2);
                    }
                },
                total_price: {
                    title: langJS('global_total_order_price'),
                    create: false,
                    edit: false,
                    list: ((params.price_right==1 && params.manager==0)?true:false),
                    sorting: false,
                    width: '6%',
                    listClass: 'text-right',
                    inputClass: 'validate[required, min[0]]',
                    display: function(data){
                        return currency_format((parseFloat(data.record.total_price)-(parseFloat(data.record.total_material_price))).toFixed(2));
                    }
                },
                tot_price: {
                    title: langJS('global_tot_price'),
                    create: false,
                    edit: false,
                    list: ((params.price_right==1 && params.manager==0)?true:false),
                    sorting: false,
                    width: '6%',
                    listClass: 'text-right',
                    display: function(data){
                        return currency_format(parseFloat(data.record.total_price).toFixed(2));
                    }
                },
                invoice_file: {
                    title: langJS('global_invoice_name'),
                    create: false,
                    edit: false,
                    list: true,
                    width: '7%',
                    display: function(data){
                        return data.record.invoice_file?data.record.invoice_file:'';
                    }
                    //'<a href="'+build_url('upload/invoices/')+data.record.invoice_file+'">'+data.record.invoice_file+'</a>'
                },
                description: {
                    title: langJS('global_description'),
                    create: true,
                    edit: true,
                    list: true,
                    type: 'textarea',
                    width: '9%',
                    inputClass: 'height-y-45 resize-y-300',
                    containerClass : 'jtabledlg-w100proc',
                    display: function(data){
                        return (data.record.description?APP.utils.text.nl2br(data.record.description):'');
                    }
                },
                status: {
                    title: langJS('global_status'),
                    create: false,
                    edit: true,
                    list: false,
                    sorting: true,
                    inputClass: 'select2 sel2-100 select2-done',
                    containerClass : 'jtabledlg-w100proc',
                    options: [{'DisplayText':'','Value':''}, {'DisplayText':langJS('global_can_invoice'),'Value':3},{'DisplayText':langJS('global_closed'),'Value':4},],
                },
                est_time: {
                    title: langJS('global_est_time'),
                    width: '7%',
                    create: false,
                    edit: false,
                    list: true,
                    sorting: false,
                    containerClass : 'jtabledlg-w100proc',
                    display: function(data){
                        let tot_price = parseFloat(data.record.tot_price);
                        let totalMinutes = (tot_price/parseFloat(params.wage)).toFixed(2)*60;
                        let hours = Math.floor(totalMinutes / 60);
                        let minutes = totalMinutes % 60;
                        return isNaN(tot_price)?" - ":(hours+" óra "+minutes.toFixed(0)+" perc");
                    }
                },
                working_minutes:{
                    title: 'Valós gyártási idő',
                    width: '6%',
                    create: false,
                    edit: false,
                    list: true,
                    listClass: 'wrong_job',
                    containerClass : 'jtabledlg-w100proc',
                    display: function(data){
                        let totalMinutes = parseFloat(data.record.working_minutes);
                        let hours = Math.floor(totalMinutes / 60);
                        let minutes = totalMinutes % 60;
                        return isNaN(totalMinutes)?" - ":(hours+" óra "+minutes.toFixed(0)+" perc");
                    }
                },
                ts:{
                    title: langJS('global_insert_date'),
                    list:true,
                    create:false,
                    edit:false,
                    width: '6%',
                    listClass: 'text-right',
                    display: function(data){
                        return data.record.ts;
                    }
                },
                invoice_sent_state:  {
                    title: langJS('global_invoice_sent'),
                    width: '2%',
                    type: 'checkbox',
                    create: false,
                    list: true,
                    edit:false,
                    display: function(data){
                        return data.record.invoice_sent==1?'<span style="cursor: auto; border: none; color:green"><i class="far fa-check-circle fa-2x" title="'+langJS('global_invoice_sent')+'"></i></span>':'<div style="width:22px;">&nbsp;</div>';
                    }
                },
                user_count: {
                    title: langJS('global_user_count'),
                    create: false,
                    edit: true,
                    list: true,
                    sorting: true,
                    inputClass: 'select2 sel2-100 select2-done',
                    containerClass : 'jtabledlg-w100proc',
                    display: function(data){
                        return data.record.username;
                    }
                },
                print_jobs:{
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
                print_jobs_label:{
                    title: langJS('global_print_label'),
                    create: false,
                    edit: false,
                    list: true,
                    sorting:false,
                    width:'2%',
                    listClass:'text-center',
                    display: function(data){
                        var $btn = APP.jTable.createButton({icon:'fas fa-tag',classes:'rbtn-green btn-print',title:langJS("global_print_label")});
                        $btn.off('click').on('click',function(){
                            print_record_label(data.record);                  
                        });
                        return $btn;
                    }
                },
                orders_files:{
                    title: langJS('global_files'),
                    create: false,
                    edit: false,
                    list: true,
                    sorting:false,
                    width:'2%',
                    listClass:'text-center',
                    display: function(data){
                        var $btn = APP.jTable.createButton({icon:'fas fa-file-upload',classes:'rbtn-blue btn-plus',title:langJS("global_files")});
                        $btn.off('click').on('click',function(){
                            show_order_files(data);
                        });
                        return $btn;
                    }
                },
                orders_po:{
                    title: langJS('global_po_upload'),
                    create: false,
                    edit: false,
                    list: ((params.price_right==1 && params.manager==0)?true:false),
                    sorting:false,
                    width:'2%',
                    listClass:'text-center',
                    display: function(data){
                        $btn = '';
                        if(params.price_right==1 && params.manager==0){
                            var $btn = APP.jTable.createButton({icon:'far fa-folder-open',classes:'rbtn-blue btn-plus',title:langJS("global_po_upload")});
                            $btn.off('click').on('click',function(){
                                show_order_po(data);
                            });
                        }
                        return $btn;
                    }
                },
                import_parts: {
                    title: langJS('global_import'),
                    create: false,
                    edit: false,
                    list: true,
                    sorting: false,
                    width: '1%',
                    listClass: "jtable-command-column",
                    display: function (data) {
                        var $btn = APP.jTable.createButton({icon:'fas fa-upload',classes:'rbtn-green',title:langJS("global_import")});
                        $btn.on('click',function () {
                            $('#import-file-hack').data('import_id', data.record.id);
                            $('#import-file-hack').trigger('click');
                        });
                        return $btn;
                    },
                },
                generate_sheet:{
                    title: langJS('global_export'),
                    create: false,
                    edit: false,
                    list: true,
                    sorting:false,
                    width:'2%',
                    listClass:'text-center',
                    display: function(data){
                        var $btn = APP.jTable.createButton({icon:'fas fa-download',classes:'rbtn-orange btn-down-csv',title:langJS("global_export")});
                        $btn.off('click').on('click',function(){
                            APP.fileDownload(build_url('index.php/Orders/export_parts')+'?id='+data.record.id);
                        });
                        return $btn;
                    }
                },
                download_zip:{
                    title: langJS('global_download_zip'),
                    create: false,
                    edit: false,
                    list: (params.manager==0?true:false),
                    sorting:false,
                    width:'2%',
                    listClass:'text-center',
                    display: function(data){
                        var $btn = APP.jTable.createButton({icon:'far fa-file-archive',classes:'rbtn-blue btn-down-zip',title:langJS("global_download_zip")});
                        $btn.off('click').on('click',function(){
                            APP.fileDownload(build_url('index.php/Orders/export_zip')+'?id='+data.record.id);
                        });
                        return $btn;
                    }
                },
            },
            formCreated: function (event, data) {
                var $dialog = data.form.parent();
                var $quantity = data.form.find('input[name="quantity"]');
                var $client_name = data.form.find('input[name="client_name"]');
                var $start_date	= data.form.find('input[name="start_date"]');
                var $delivery_date	= data.form.find('input[name="delivery_date"]');
                var $init_date	= data.form.find('input[name="init_date"]');
                var $intake_date	= data.form.find('input[name="intake_date"]');
                var $deadline	= data.form.find('input[name="deadline"]');
                var $parcel_weight = data.form.find('input[name="parcel_weight"]');
                var $shipping_type = data.form.find('input[name="shipping_type"]');
                var $transport_cost = data.form.find('input[name="transport_cost"]');
                var $status = data.form.find('select[name="status"]');
                var $user_count = data.form.find('input[name="user_count"]');

                $status.select2(APP.select2.select2_options({allowClear: true}));

                $user_count.select2(APP.select2.select2_options_ajax('Users/sel2_users',{
                    allowClear: true,
                    cacheKEY:'sel2.users',
                }));

                $start_date.datepicker(datepicker_defaults());
                $delivery_date.datepicker(datepicker_defaults({minDate: new Date()}));
                $deadline.datepicker(datepicker_defaults({minDate: new Date()}));
                $init_date.datepicker(datepicker_defaults());
                $intake_date.datepicker(datepicker_defaults());


                $parcel_weight.dspinner({
                    suffix: ' kg',
                    step: 1,
                    places: 2,
                    increment: 'fast',
                    allowNull: false,
                    min:0,
                    max:999999999
                });

                $parcel_weight.prop('readonly', true);
                
                $quantity.dspinner({
                    suffix: '',
                    step: 1,
                    places:0,
                    increment: 'fast',
                    allowNull: false,
                    min:0,
                    max:999999
                });

                $client_name.select2(APP.select2.select2_options_ajax('Orders/sel2_clients',{
                    allowClear: true,
                    cacheKEY:'sel2.clients',
                    createSearchChoice:function(term, data) {
                        if ( $(data).filter( function() {
                          return this.name.localeCompare(term)===0;
                        }).length===0) {
                          return {id:term, name:term};
                        }
                      },
                }));

                $shipping_type.select2(APP.select2.select2_options({
                    allowClear: false,
                    data:[{id:0,text:langJS('global_express')},{id:1,text:langJS('global_economy')}]
                }));

                $transport_cost.dspinner({
                    suffix: APP.settings.currency,
                    step: 1,
                    places: 2,
                    increment: 'fast',
                    allowNull: false,
                    min:0,
                    max:999999
                });

                var $invoice_sent = data.form.find('input[name="invoice_sent"]').parent().parent();
                    //material_cont.css('width', '100%');
                    var $btgen = $('<div class="material_list_container" style="display: inline-block;">'+
                                    '<button type="button" class="button_generate button-blue">Anyaglista generálása</button>'+
                                '</div>');
                    $parcel_weight.parent().after($btgen);

                    $btgen.find('.button_generate').on('click', function(){
                        crud_jsupdate('Orders/get_material_list',{order_id: data.record.id}, function(retData){
                            print_materials(data.record, retData);
                        });
                    });

                /* order files */
                var $attach = $('<div id="attachment_div" class="dent-input-container w100-proc">'+
                            '<label for="">Csatolmányok</label>'+
                            '<div id="attachments_list"/>'+
                            '<div id="add_attachments_container">'+
                                '<div id="add_attachments_text">Húzza ide a fájlokat</div>'+
                                '<button type="button" id="add_attachments_button" class="button-blue">Fájlok kiválasztása</button>'+
                            '</div>'+
                        '</div>');
                  
                /* order po */
                var $attach_po = $('<div id="po_attachment_div" class="dent-input-container w100-proc">'+
                        '<label for="">'+langJS('global_po_upload')+'</label>'+
                        '<div id="po_attachments_list"/>'+
                        '<div id="add_po_attachments_container">'+
                            '<div id="add_po_attachments_text">Húzza ide a fájlokat</div>'+
                            '<button type="button" id="add_po_attachments_button" class="button-blue">Fájlok kiválasztása</button>'+
                        '</div>'+
                    '</div>');

                if(data.formType=='edit'){
                    crud_jsupdate('Orders/get_parcel_weight',{id: data.record.id}, function(rec){
                        if(rec){
                            $parcel_weight.dspinner('value', rec.weight);
                        }
                    });

                    var $log = $('<div id="quoting_log"></div>');
                    
                    var $orders_obs = $('<div id="comments_div" class="dent-input-container w100-proc" style="float: right; width: 48%;">'+
                            '<label for=""><b>Észrevételek / Kommentek</b></label>'+
                            '<div class="dent-input-container w100-proc">'+
                                '<label for="comment_field">Észrevétel:</label>'+
                                '<div class="dent-input">'+
                                    '<textarea id="comment_field"></textarea>'+
                                    '<br/><button type="button" id="add_comment_button" class="button-blue">Észrevétel hozzáadása</button>'+
                                '</div>'+
                            '</div>'+
                            '<div id="observation_container">'+
                            '</div>'+
                        '</div>');

                    var $invoice_cont = $('<div id="invoice_div" class="dent-input-container w100-proc" style="float: right; width: 48%;">'+
                        '<label for=""><b>Számla:</b></label>'+
                            '<div class="dent-input-container w50-proc">'+
                                '<label for="invoice_date">'+langJS('global_date')+':</label>'+
                                '<div class="dent-input">'+
                                    '<input type="text" id="invoice_date" name="invoice_date" class="" />'+
                                '</div>'+
                            '</div>'+
                            '<div class="dent-input-container w50-proc">'+
                                '<label>&nbsp;</label>'+
                                '<div class="dent-input">'+
                                    '<button type="button" id="donwload_invoice" class="button-blue" data-file="'+(data.record.invoice_file?data.record.invoice_file:'')+'" '+(data.record.invoice_file?'':'disabled')+'>Számla letöltése</button>'+
                                '</div>'+
                            '</div>'+
                            '<div class="dent-input-container w50-proc">'+
                                '<label for="invoice_nr">'+langJS('global_invoice_nr')+':</label>'+
                                '<div class="dent-input">'+
                                    '<input type="text" id="invoice_nr" name="invoice_nr" class="" value="'+params.invoice_nr+'" />'+
                                '</div>'+
                            '</div>'+
                            '<div class="clear"></div>'+
                            '<div class="dent-input-container w50-proc">'+
                                '<div class="dent-input">'+
                                    '<button type="button" id="generate_invoice" class="button-blue" >Számla generálása</button>'+
                                '</div>'+
                            '</div>'+
                        '</div>');
                        //'+(data.record.invoice_file?'disabled':'')+'
                
                    data.form.find('#quoting_log').remove();
                    data.form.parent().find('#comments_div').remove();
                    data.form.parent().find('#invoice_div').remove();
                    data.form.append($log);
                    data.form.parent().append($orders_obs);
                    data.form.parent().append($invoice_cont);
                    data.form.css("width", "50%");
                    data.form.css("float", "left");

                    var get_orders_obs = function() {
                        crud_jsupdate('Orders/get_observations', {order_id: data.record.id},
                            function(data) {
                                if (data.Records.length>0) {
                                    buildObs(data.Records);
                                }
                            }
                        );
                    };
                    get_orders_obs();

                    let $field = $orders_obs.find('#comment_field');
                    $orders_obs.find('#add_comment_button').click(function() {
                        if($field.val()!=''){
                            crud_jsupdate('Orders/create_orders_observation',{order_id: data.record.id, observation: $field.val()}, function(retData){
                                $field.val('');
                                get_orders_obs();
                            });
                        }
                    });

                    $orders_obs.find('#observation_container').on('click', '.delete_orders_observations', function(ev){
                        ev.preventDefault();
                        var elem = $(this).parent().parent();
                        var id = elem.data('id');
                        APP.showDlg(langJS('global_confirm'),langJS('global_confirm_text'),langJS('global_yes'),langJS('global_no'), function(){
                            crud_jsupdate('Orders/delete_orders_observation', {id:id}, function(ret){
                                elem.remove();
                            });
                        });
                    });
                    if(data.record.quoting_id){
                        quoting_log($log, data.record);
                    }
                    /* invoice */
                    $invoice_cont.find('#invoice_nr').dspinner({
                        step: 1,
                        places: 0,
                        increment: 'fast',
                        allowNull: false,
                        min:1,
                        max:999999999
                    });

                    $invoice_cont.find('#invoice_date').datepicker(datepicker_defaults());
                    $invoice_cont.find('#invoice_date').datepicker('setDate',new Date());

                    $invoice_cont.find('#generate_invoice').click(function() {
                        let $nr_field = $invoice_cont.find('#invoice_nr');
                        let $date_field = $invoice_cont.find('#invoice_date');
                        if($nr_field.val()!='' && $date_field.val()!=''){
                            print_invoice(data.record, $nr_field.val(), $date_field.val());
                            /*crud_jsupdate('Orders/create_orders_observation',{invoice_nr: $nr_field.val(), invoice_date: $date_field.val()}, function(retData){
                                
                            });*/
                        }
                    });

                    $invoice_cont.find('#donwload_invoice').click(function() {
                        let file = $(this).attr('data-file');
                        downloadURI(build_url('upload/invoices/')+file, file);
                    });
                }

                if (data.formType=='create'){
                    if (params.price_right==1){
                        /* po */
                        data.form.append($attach_po);
                        uploader_w_po =  new plupload.Uploader({
                            browse_button: $attach_po.find('#add_po_attachments_button')[0], // this can be an id of a DOM element or the DOM element itself
                            url: build_url('index.php/uploadr/Upload/upload_file'),
                            headers:{'app-upload':'true'}, // this will generate HTTP_APP_UPLOAD headear in upload request
                            runtimes : 'html5,html4',
                            container: $attach_po.find('#add_po_attachments_container')[0], // ... or DOM Element itself
                            drop_element : [$attach_po.find('#add_po_attachments_container')[0]],
                            chunk_size: '1024kb',
                            multipart:true,
                            multipart_params:{},
                            filters:{
                                        max_file_size : '30Mb',
                                        mime_types:
                                            [
                                            {title : "Image files", extensions : "jpg,jpeg,gif,png"},
                                            {title : "Document files", extensions : "pdf,doc,docx,txt,xls,xlsx,step,STEP,dwg,DWG" },
                                            {title : "Compressed files", extensions : "zip,rar" }
                                            ]
                                    },
                            init:{
                                PostInit: function(up, params) {
                                    if (uploader_w_po.features.dragdrop) {
                                        $.each(uploader_w_po.settings.drop_element, function(i,target){
                                            target.ondragover = function(event) {
                                                event.dataTransfer.dropEffect = "copy";
                                            };
                                            target.ondragenter = function() {
                                                $attach_po.find('#add_po_attachments_container').css('background-color','#98CF09 !important');
                                            };
                                            target.ondragleave = function() {
                                                $attach_po.find('#add_po_attachments_container').css('background-color','');
                                            };
                                            target.ondrop = function() {
                                                $attach_po.find('#add_po_attachments_container').css('background-color','');
                                            };
                                    });
                                    }
                                    /*if(options.files){
                                        $.each(options.files, function( key, value ) {
                                            uploader_w_po.addFile(options.files[key]);
                                        });
                                    }*/
                                },
                                //Populating file list
                                FilesAdded: function(up, files) {
                                    $dialog.parent().find('button').each(function(){$(this).prop('disabled',true);});

                                    $.each(files, function(i, file) {
                                        $attach_po.find('#po_attachments_list').append('<div class="addedAttachment" id="' + file.id + '">' + file.name +
                                        '<a href="#" id="' + file.id + '" class="removeAttachment"> X</a>' + '</div>');
                                        uploader_w_po.start();
                                    });
                                },
                                //Creating unique file name
                                BeforeUpload: function(up, file) {
                                    var params = up.settings.multipart_params;
                                    params.fileName = file.id + '.' + file.name.split('.').pop();
                                },
                                UploadComplete: function(up, files) {
                                    $dialog.parent().find('button').each(function(){$(this).prop('disabled',false);});
                                },
                                //Deleting based on unique file name
                                FilesRemoved: function(up, files){
                                    $.each(files, function(i, file){
                                        //console.log(file);
                                        //var fileName = file.id + '.' + file.name.split('.').pop();
                                        crud_jsupdate('uploadr/Upload/delete_file',{fileName: file.name},function(retData){
                                        });
                                    });
                                },
                                //UploadError message
                                Error: function(up, err) {
                                    APP.showMessage(langJS('global_error'), err.message, langJS('global_ok'));
                                }
                            }
                        });
                        uploader_w_po.init();
                        $attach_po.find('#po_attachments_list').on('click', '.removeAttachment', function(e) {
                            uploader_w_po.removeFile(uploader_w_po.getFile(this.id));
                            $('#'+this.id).remove();
                            e.preventDefault();
                        });
                    }
                    /* files */
                    data.form.append($attach);
                    uploader =  new plupload.Uploader({
                        browse_button: $attach.find('#add_attachments_button')[0], // this can be an id of a DOM element or the DOM element itself
                        url: build_url('index.php/uploadr/Upload/upload_file'),
                        headers:{'app-upload':'true'}, // this will generate HTTP_APP_UPLOAD headear in upload request
                        runtimes : 'html5,html4',
                        container: $attach.find('#add_attachments_container')[0], // ... or DOM Element itself
                        drop_element : [$attach.find('#add_attachments_container')[0]],
                        chunk_size: '1024kb',
                        multipart:true,
                        multipart_params:{},
                        filters:{
                                    max_file_size : '30Mb',
                                    mime_types:
                                        [
                                        {title : "Image files", extensions : "jpg,jpeg,gif,png"},
                                        {title : "Document files", extensions : "pdf,doc,docx,txt,xls,xlsx,step,STEP,dwg,DWG" },
                                        {title : "Compressed files", extensions : "zip,rar" }
                                        ]
                                },
                        init:{
                            PostInit: function(up, params) {
                                if (uploader.features.dragdrop) {
                                    $.each(uploader.settings.drop_element, function(i,target){
                                        target.ondragover = function(event) {
                                            event.dataTransfer.dropEffect = "copy";
                                        };
                                        target.ondragenter = function() {
                                            $attach.find('#add_attachments_container').css('background-color','#98CF09 !important');
                                        };
                                        target.ondragleave = function() {
                                            $attach.find('#add_attachments_container').css('background-color','');
                                        };
                                        target.ondrop = function() {
                                            $attach.find('#add_attachments_container').css('background-color','');
                                        };
                                });
                                }
                                /*if(options.files){
                                    $.each(options.files, function( key, value ) {
                                        uploader.addFile(options.files[key]);
                                    });
                                }*/
                            },
                            //Populating file list
                            FilesAdded: function(up, files) {
                                $dialog.parent().find('button').each(function(){$(this).prop('disabled',true);});

                                $.each(files, function(i, file) {
                                    $attach.find('#attachments_list').append('<div class="addedAttachment" id="' + file.id + '">' + file.name +
                                    '<a href="#" id="' + file.id + '" class="removeAttachment"> X</a>' + '</div>');
                                    uploader.start();
                                });
                            },
                            //Creating unique file name
                            BeforeUpload: function(up, file) {
                                var params = up.settings.multipart_params;
                                params.fileName = file.id + '.' + file.name.split('.').pop();
                            },
                            UploadComplete: function(up, files) {
                                $dialog.parent().find('button').each(function(){$(this).prop('disabled',false);});
                            },
                            //Deleting based on unique file name
                            FilesRemoved: function(up, files){
                                $.each(files, function(i, file){
                                    //console.log(file);
                                    //var fileName = file.id + '.' + file.name.split('.').pop();
                                    crud_jsupdate('uploadr/Upload/delete_file',{fileName: file.name},function(retData){
                                    });
                                });
                            },
                            //UploadError message
                            Error: function(up, err) {
                                APP.showMessage(langJS('global_error'), err.message, langJS('global_ok'));
                            }
                        }
                    });
                    uploader.init();
                    $attach.find('#attachments_list').on('click', '.removeAttachment', function(e) {
                        uploader.removeFile(uploader.getFile(this.id));
                        $('#'+this.id).remove();
                        e.preventDefault();
                    });
                }

                data.form.validationEngine();
            },
            formSubmitting: function (event, data) {
                var fileAttachments = [];
                if(uploader && uploader.files){
                    $.each(uploader.files, function(i, file){
                        var temp = constJS("UPLOAD_TEMP");
                        var fileName = temp+ file.name;
                        fileAttachments.push(fileName);
                    });
                }
                data.form.find('input[name=fileAttachments]').val(fileAttachments);

                var poAttachments = [];
                if(uploader_w_po && uploader_w_po.files){
                    $.each(uploader_w_po.files, function(i, file){
                        var temp = constJS("UPLOAD_TEMP");
                        var fileName = temp+ file.name;
                        poAttachments.push(fileName);
                    });
                }
                data.form.find('input[name=poAttachments]').val(poAttachments);

                return data.form.validationEngine('validate');
            },
            recordAdded: function (event, data) {
                APP.select2.cache_clear('sel2.clients');
                data.thisTable.jtable('reload');
            },
            recordUpdated: function (event, data){
                APP.select2.cache_clear('sel2.clients');
                data.thisTable.jtable('reload');
            },
            recordDeleted: function (event, data) {
                APP.select2.cache_clear('sel2.clients');
            },
            formClosed: function (event, data) {
                data.form.validationEngine('hide');
                data.form.validationEngine('detach');
            },
            rowInserted: function(event, data){
                if (parseInt(data.record.zero_position)==1){
                    data.row.addClass('qpart_color');
                }
                if(data.record.series==1){
                    data.row.find('td.id_series').addClass('series_color');
                }
                if(data.record.wrong==1){
                    data.row.find('td.wrong_job').addClass('wrong_color');
                }
            },
            recordsLoaded: function(event, data){
                var touchtime = 0;
                $('.jtable-data-row').on('click', '.open_jobs', function(ev) {
                    ev.stopPropagation();
                });

                $('.jtable-data-row').on('click', function(ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    $('.jtable-data-row').removeClass('click_color');
                    $(this).addClass('click_color');

                    var row_id = $(this).attr('data-record-key');
                    if (touchtime == 0) {
                        // set first click
                        touchtime = new Date().getTime();
                    } else {
                        // compare first click to this click and see if they occurred within double click threshold
                        if (((new Date().getTime()) - touchtime) < 800) {
                            // double click occurred
                            data.thisTable.jtable('showEditForm', row_id);
                            touchtime = 0;
                        } else {
                            // not a double click so set as a new first click
                            touchtime = new Date().getTime();
                        }
                    }
                });

                //Activate
                $('.jtable-data-row').on("click",'.enable_one_plan_parent:not(input[type="checkbox"])', function(){
                    $(this).find('.enable_one_plan').trigger('click');
                });
                $('.jtable-data-row').on("click",'.enable_one_plan', function(e){
                    e.stopPropagation();
                    var attrib = $(this).prop("checked");
                    var rec_id = $(this).attr("rec_id");
                    var active = 0;
                    if(attrib){ active = 1;}
                    var params = {};
                    params['id']	 	= rec_id;
                    params['plan'] 	= active;
                    crud_jsupdate('Orders/enable_one_plan', params, nullFunction);
                });
            },
    });

    if (G_uploader){
        G_uploader.destroy();
    }
    G_uploader = new plupload.Uploader({
        headers:{'dent-upload':'true'}, // this will generate HTTP_DENT_UPLOAD headear in upload request
        runtimes : 'html5,html4',
        chunk_size: '1024kb',//1mb
        multipart:true,
        browse_button : 'import-file-hack', // you can pass in id...
        url : build_url('index.php/Orders/import_parts'),
        filters : {
            max_file_size: '30Mb',
            mime_types: [
                {title : "csv file", extensions : "csv"},
            ]
        },
        init: {
            Init: function(up) {
                $('#uploader_price').find('input[type="file"]').attr("accept", ".csv");
            },
            FilesAdded: function(up, files) {
                G_uploader.start();
            },
            FileUploaded:function(up, file, object){
                var response = JSON.parse(object.response);
                if (response.OK) {
                    APP.showMessage(langJS('global_success'), response.count+' row imported successfully.');
                    //$('#orders').jtable().find('.jtable-child-table-container:visible').jtable('reload');
                    $('tr[data-record-key='+$('#import-file-hack').data('import_id')+']').children('td:eq(1)').children('button').trigger('click');
                }else{
                    APP.showMessage(langJS('global_error'), 'Error: '+response.Message);
                }
            },
            BeforeUpload: function(up,file) {
                G_uploader.settings.multipart_params = { id: $('#import-file-hack').data('import_id')};
            },
            Error: function(up, err) {
                APP.showMessage(langJS('global_error'), 'Error: '+err.message);
                //console.log("Error #" + err.code + ": " + err.message);
            }
        }
    });
    if (G_uploader){
        G_uploader.init();
    }

    var print_record = function(record){
        var row_html = ""; 
        crud_jsupdate('Orders/list_jobs',{order_id: record.id}, function(retData){
            var $container = $('<div />');
            var i=0;
            $.each(retData.Records, function(i, rec) {
                i++;
                row_html = row_html + '<div style="display: inline-block; text-align: center; padding: 20px 10px 10px 0px; width:48%;"><table class="border_table">'+
                        '<tr><td class="bold">Projekt</td><td><b>'+rec.order_id+(rec.alias?' - '+rec.alias:'')+'</b></td></tr>'+
                        //'<tr><td class="bold">Rendelési szám</td><td>'+record.id+' - <b>'+record.name+'</b></td></tr>'+
                        //'<tr><td class="bold">Határidő</td><td><b>'+rec.deadline+'</b></td></tr>'+
                        '<tr><td class="bold">Név</td><td>'+rec.id+' - '+rec.name+'</td></tr>'+
                        '<tr><td class="bold">Nyersanyag</td><td>'+(rec.calibration==1?'(K) ':'')+(rec.height==0 && rec.width==0 && rec.length==0?'':(rec.right_angle==1?('V'+rec.arm1 +' x '+rec.arm2 +' x '+ rec.height+' x '+rec.length+' mm'):(rec.cylinder==1?('D'+rec.diameter +' x '+rec.length+' mm'):(rec.height+' x '+rec.width+' x '+rec.length+' mm'))))+'</td></tr>'+
                        '<tr><td class="bold">Anyagtip.</td><td><b>'+rec.mat_name+'</b></td></tr>'+
                        '<tr><td class="bold">Darabszám</td><td>'+rec.quantity+'</td></tr>'+
                        '<tr><td class="bold">Kezelés</td><td>'+(rec.handling?rec.handling.replaceAll(',', ', '):' - ')+'</td></tr>'+
                        //'<tr><td class="bold">Anyag rendelve</td><td>'+(rec.material_ordered==1?'igen':'')+'</td></tr>'+
                '</table></div>';
                if(i%8==0){
                    row_html = row_html + '<div style="clear: both;"></div>';
                }
            });
            $container.append(row_html);
            var style = '<style>body{background:#fff;margin:0;padding:10px;line-height: 1.5;font-family:Verdana,Arial,sans-serif;font-size:12px;}'+
            '.bold{ font-weight: bold;}'+
            'table.border_table { border-top: 1px solid #000000; border-right: 1px solid #000000; border-spacing: 0px; font-size: 14px; width:100%; }'+
            'table.border_table td{'+
                'text-align: center;'+
                'border-left: 1px solid #000000;'+
                'border-bottom: 1px solid #000000;'+
                'padding:3px;'+
            '}'+
            '</style>';
            var html = '<html><title>Printing</title><head>'+style+'</head><body>'+$container.html()+'</body></html>';
            var newWin= window.open("");
            newWin.document.write(html);
            newWin.print();
            newWin.close();
        });
    }

    var print_record_label = function(record){
        var row_html = ""; 
        crud_jsupdate('Orders/list_jobs',{order_id: record.id}, function(retData){
            var $container = $('<div />');
            var i=0;
            $.each(retData.Records, function(i, rec) {
                i++;
                row_html = row_html + '<div class="container_div" style="display: inline-block; text-align: center;"><table class="border_table">'+
                        '<tr><td>ORDER</td><td>'+record.id+' '+record.name+'</td></tr>'+
                        '<tr><td>Part Name</td><td>'+rec.name+'</td></tr>'+
                        '<tr><td>Quantity</td><td></td></tr>'+
                        '<tr><td>Order Qty</td><td>'+rec.quantity+'</td></tr>'+
                '</table></div>';
                if(i%24==0){
                    row_html = row_html + '<div style="clear: both; height: 20px;"></div>';
                }
            });
            $container.append(row_html);
            var style = '<style>body{background:#fff;margin:0;padding:10px;line-height: 1.5;font-family:Verdana,Arial,sans-serif;font-size:12px;}'+
            '.bold{ font-weight: bold;}'+
            'table.border_table { width:100%; height:11.5%; table-layout:fixed; border-top: 1px solid #000000; border-right: 1px solid #000000; border-spacing: 0px; font-size: 14px; }'+
            'table.border_table td{'+
                'text-align: center;'+
                'border-left: 1px solid #000000;'+
                'border-bottom: 1px solid #000000;'+
                'padding:3px;'+
            '}'+
            'div.container_div { padding: 5px 5px 5px 5px; width:31.5%; }'+
            '</style>';
            // container_div - width: 68mm; //height: border_table 36.5mm;
            var html = '<html><title>Printing</title><head>'+style+'</head><body>'+$container.html()+'</body></html>';
            var newWin= window.open("");
            newWin.document.write(html);
            newWin.print();
            newWin.close();
        });
    }

    var print_materials = function(record, retData){
        var row_html = "";
        var i=0;
        var row_html = '<div style="display: inline-block; text-align: center; padding: 100px 10px 10px 0px; width:100%;">'+
            '<table class="border_table">'+
            '<tr><th colspan="2" style="width:14%;">Projekt száma</th><th colspan="7" style="width:86%;">'+record.id+' - '+record.name+'</th></tr>'+
            '<tr><th style="width:8%;">Poz.</th><th style="width:8%;">Darab ID</th><th style="width:10%;">Darab Neve</th><th style="width:10%;">Anyagtíp.</th><th style="width:15%;">Méret</th><th style="width:9%;">Kezelés</th><th style="width:9%;">Mennyiség</th><th style="width:21%;">Komment</th><th style="width:10%;">Rendelés dátuma</th></tr>';
        $.each(retData.Records, function(r, rec) {
            i++;
            row_html = row_html + '<tr><td style="width:6%;">'+i+'</td><td style="width:8%;">'+rec.id+'</td><td style="width:10%;">'+rec.name+'</td><td style="width:10%;">'+rec.material_name+'</td><td style="width:15%;">'+(rec.right_angle==1?('V'+rec.arm1 +' x '+rec.arm2 +' x '+ rec.height+' x '+rec.length+' mm'):(rec.cylinder==1?('D'+rec.diameter +' x '+rec.length+' mm'):(rec.height+' x '+rec.width+' x '+rec.length+' mm')))+' '+(rec.calibration==1?'(K) ':'')+'</td><td style="width:9%;">'+(rec.handling?rec.handling.replaceAll(',', ', '):'')+'</td><td style="width:9%;">'+rec.quantity+'</td><td style="width:21%;">'+(rec.order_comments?rec.order_comments:'')+'</td><td style="width:10%;"><div style="border-bottom: 2px solid black; width: 100%;">&nbsp;</div><div><input type="checkbox" /> <span style="vertical-align: top; display: inline-block; padding-top: 3px;">Kuka</span></div></td></tr>'+
            '<tr><td style="height:33px;">&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
        });
        
        //$container.append(row_html);
        var style = '<style>body{background:#fff;margin:0;padding:10px;line-height: 1.5;font-family:"DejaVu Sans", "Arial", sans-serif; font-size:12px;}'+
        '.bold{ font-weight: bold;}'+
        'table.border_table { border-top: 1px solid #000000; border-right: 1px solid #000000; border-spacing: 0px; font-size: 12px; width:100%; }'+
        'table.border_table td, table.border_table th{'+
            'text-align: center;'+
            'border-left: 1px solid #000000;'+
            'border-bottom: 1px solid #000000;'+
            'padding:3px;'+
        '}</style>';
        var html = '<html>'+
            '<title>Printing</title><head>'+
            '<meta charset="UTF-8">'+
            '<meta http-equiv="content-type" content="text/html;charset=UTF-8" />'+
            '<meta http-equiv="cache-control" content="no-cache, must-revalidate" />'+
            '<meta http-equiv="pragma" content="no-cache" />'+
            '<meta http-equiv="expires" content="0" />'+
            '<meta http-equiv="X-UA-Compatible" content="IE=edge"/>'+
            '</head><body>'+
            '<link href="'+base_url()+'css/print_pdf.css" rel="stylesheet" type="text/css" />'+
            '<link href="'+base_url()+'css/js.gpdf/gpdf.fonts.css" rel="stylesheet" type="text/css" />'+style+row_html+'</body></html>';
        var newWin= window.open();
        //console.log(html);
        $(newWin.document.body).html(html);
        //console.log($(newWin.document.body).html());
        setTimeout(function(){
            ExportPdf($(newWin.document.body), record.client_name+' material_list_'+record.id+' _ '+record.start_date.replaceAll("-", '. ')+'.pdf', newWin);
        }, 50);
    };

    var ExportPdf = function(elem, filename, nwindow){
        var margin_top = 10; //1cm margin top
        var margin_bottom = 10; //1.5 cm margin bottom
        var tm =  parseFloat(3/4*(margin_top-30)).toFixed(2); //convert px to pt
        var bm =  parseFloat(3/4*(margin_bottom-40)).toFixed(2); //convert px to pt
        var opt = {
            paperSize: "A4",
            //margin: { left: "1cm", top: "1cm", right: , bottom: "1.5cm" },
            margin: { left: "1cm", top: tm+"pt", right: "1cm", bottom: bm+"pt" },
            scale: 0.7,
            //height: 500,
            author:'',
            template: '<div class="page-template"><div class="pdf_header"><div style="height:'+margin_top+'px; background:white;"></div></div><div class="pdf_footer"><div style="height:'+margin_bottom+'px; background:white;">'+
            '</div></div></div>',
        };
        //console.log(elem.html());
        gpdf.drawing.drawDOM(elem, opt).then(function(pdfdata){
            gpdf.drawing.pdf.saveAs(pdfdata, filename);//toBlob, toDataURL
            nwindow.close();
            /*gpdf.drawing.exportPDF(pdfdata).done(function(data) {
                nwindow.close();
                showFile(b64toBlob(data.split('base64,')[1],'application/pdf'));
            });*/
        });
    };

    //$('#orders').jtable('load');

    $('#orders-filter').dfilter({
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
                label: langJS('global_order')+' ('+langJS('global_name')+')',
                type:"text",
                visible:true,
                disabled:false,
                icons:["search","clear"],
                value:'',
            },
            {
                name:"filter_job_search",
                label: langJS('global_job')+' ('+langJS('global_name')+', ID)',
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
                name:'filter_status',
                label:langJS('global_status'),
                type:'select2',
                sel2DisplayData:'text',
                width:350,
                value: "0,1",
                createOptions:APP.select2.select2_options({
                    allowClear: true,
                    multiple: true,
                    cacheKEY:'sel2.order_status',
                    data: [{id:0,text:langJS('global_init')},{id:1,text:langJS('global_progress')}, {id:2,text:langJS('global_ready')}, {id:3,text:langJS('global_can_invoice')}, {id:4,text:langJS('global_closed')}],
                })
            },
            {
                name:    "start_date",
                label:   langJS('global_interval'),
                type:    "dateinterval",
                visible: true,
                disabled: false,
                icons:["search","clear","today"],
                width:'320px',
                createOptions:datepicker_defaults(),
            },
            {
                name:    "deadline",
                label:   langJS('global_interval_dadline'),
                type:    "dateinterval",
                visible: true,
                disabled: false,
                icons:["search","clear","today"],
                width:'320px',
                createOptions:datepicker_defaults(),
            },
            {
                name:    "filter_percent",
                label:   'Valós és becsült gyártasi idő eltérés % (min - max)',
                type:    "numberinterval",
                visible: true,
                disabled: false,
                width:'290px'
            },
            ],
        onChange:function($form){
            var serialized = $form.serializeArray();
            $('#orders').jtable('load', serialized);
        }
    });

    var orders_jobs = function($img, orderdata){
        $('#orders').jtable(
            'toggleChildTable',
            $img.closest('tr'),
            $img.closest('td'),
            {
                title: langJS('global_jobs')+' - '+orderdata.record.name,
                messages:jtable_lang(),
                insertDialogWidth:'990',
                editDialogWidth:'990',
                dialogShowEffect:null,
                dialogHideEffect:null,
                paging: false, //Enable paging
                sorting: true, //Enable sorting
                defaultSorting: 'ts asc', //Set default sorting
                actions: {
                        listAction:   'Orders/list_jobs?order_id='+orderdata.record.id+'&filter_job_search='+$('.dinput[name=filter_job_search]').val(),
                        createAction: 'Orders/create_jobs',
                        updateAction: 'Orders/update_jobs',
                        deleteAction: (params.manager==0?'Orders/delete_jobs':null),
                    },
                toolbar: {
                    items: [
                        {
                            icon: 'fas fa-plus',
                            text: langJS('global_blind_job'),
                            tooltip: langJS('global_blind_job'),
                            cssClass: 'rbtn-orange b_blind_job',
                            click: function () {
                                createBlindDialog(orderdata);
                            }
                        }
                    ]
                },
                fields: {
                        id: {
                            key: true,
                            create: false,
                            edit: false,
                            list: false
                        },
                        fileAttachments:{
                            create: true,
                            edit: true,
                            list: false,
                            type: 'hidden',
                        },
                        /*image_name:{
                            create: true,
                            edit: false,
                            list: false,
                            type: 'hidden',
                        },
                        image_new_name:{
                            create: true,
                            edit: false,
                            list: false,
                            type: 'hidden',
                        },*/
                        image:{
                            create: true,
                            edit: true,
                            list: false,
                            type: 'hidden',
                        },
                        image_src:{
                            create: true,
                            edit: true,
                            list: false,
                            type: 'hidden',
                        },
                        stp:{
                            create: true,
                            edit: true,
                            list: false,
                            type: 'hidden',
                        },
                        order_id: {
                            type:'hidden',
                            defaultValue:orderdata.record.id,
                        },
                        blind_job: {
                            type:'hidden',
                            defaultValue:0,
                        },
                        name: {
                            title: langJS('global_name'),
                            width: '10%',
                            inputClass: 'validate[required, minSize[3]]',
                            listClass: 'text-bold name_series',
                            display: function(data){
                                return data.record.id+' - '+data.record.name;
                            }
                        },
                        status: {
                            title: langJS('global_status'),
                            create: true,
                            edit: true,
                            list: true,
                            sorting: true,
                            inputClass: 'sel2-100 select2-done validate[required]',
                            containerClass : 'jtabledlg-w50proc',
                            defaultValue: '0',
                            display: function(data){
                                return '<div style="background-color:'+data.record.colour+'; padding: 2px; color: white;">'+data.record.status_name+'</div>';
                            }
                        },
                        quantity:{
                            title: langJS('global_quantity'),
                            create: true,
                            edit: true,
                            list: true,
                            sorting: true,
                            sortField:'j.quantity',
                            width: '5%',
                            listClass: 'text-center',
                            inputClass: 'validate[required]',
                            containerClass : 'jtabledlg-w50proc',
                            defaultValue: '1',
                            display: function(data){
                                return '<b>'+data.record.quantity+'<b>';
                            }
                        },
                        surface: {
                            title: langJS('global_surface'),
                            create: (params.price_right==1?true:false),
                            edit: (params.price_right==1?true:false),
                            list: false,
                            sorting: false,
                            width: '8%',
                            listClass: 'text-right',
                            inputClass: 'validate[required, min[0]]',
                            containerClass : 'jtabledlg-w50proc',
                            display: function(data){
                                return currency_format(data.record.surface);
                            }
                        },
                        post_price: {
                            title: langJS('global_post_price'),
                            create: (params.price_right==1?true:false),
                            edit: (params.price_right==1?true:false),
                            list: (params.price_right==1?true:false),
                            sorting: false,
                            width: '8%',
                            listClass: 'text-right',
                            inputClass: 'validate[required, min[0]]',
                            containerClass : 'jtabledlg-w50proc',
                            display: function(data){
                                return currency_format(data.record.post_price);
                            }
                        },
                        price: {
                            title: langJS('global_price'),
                            create: ((params.price_right==1 && params.manager==0)?true:false),
                            edit: ((params.price_right==1 && params.manager==0)?true:false),
                            list: ((params.price_right==1 && params.manager==0)?true:false),
                            sorting: false,
                            width: '8%',
                            listClass: 'text-right',
                            inputClass: 'validate[required, min[0]]',
                            containerClass : 'jtabledlg-w50proc',
                            display: function(data){
                                return currency_format(data.record.price);
                            }
                        },
                        total_price: {
                            title: langJS('global_total_order_price'),
                            create: false,
                            edit: false,
                            list: ((params.price_right==1 && params.manager==0)?true:false),
                            sorting: false,
                            width: '8%',
                            listClass: 'text-right',
                            inputClass: 'validate[required, min[0]]',
                            display: function(data){
                                return currency_format(((parseFloat(data.record.price)*parseFloat(data.record.quantity)) - parseFloat((data.record.material_type==1?data.record.material_qty:data.record.quantity)*data.record.material_price)).toFixed(2));
                            }
                        },
                        weight: {
                            title: langJS('global_weight_um'),
                            create: (params.price_right==1?true:false),
                            edit: (params.price_right==1?true:false),
                            list: false,
                            sorting: false,
                            width: '8%',
                            listClass: 'text-right',
                            inputClass: 'validate[required, min[0]]',
                            containerClass : 'jtabledlg-w50proc',
                            defaultValue: '0',
                            display: function(data){
                                return data.record.weight+' '+langJS('global_minute');
                            }
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
                                return (data.record.material_name?data.record.material_name + (data.record.material_code?' - '+data.record.material_code+'':""):' - ');
                            }
                        },
                        size: {
                            title: langJS('global_size'),
                            width: '10%',
                            create: false,
                            edit: false,
                            list: true,
                            sorting: false,
                            display: function(data){
                                return (data.record.right_angle==1?(data.record.arm1 +' x '+data.record.arm2 +' x '+ data.record.height+' x '+data.record.length+' mm (vinkli)'):data.record.cylinder==1?(data.record.length+' x '+data.record.diameter+' mm (henger)'):(data.record.height+' x '+data.record.width+' x '+data.record.length+' mm'));
                            }
                        },
                        material_type: {
                            title: langJS('global_material_source'),
                            width: '7%',
                            containerClass : 'jtabledlg-w40proc',
                            inputClass: 'select2-done sel2-100',
                            list:false,
                            create:true,
                            edit:true,
                            defaultValue: -1,
                            display: function(data){
                                return data.record.material_type;
                            },
                            listClass:'text-right',
                        },
                        material_ordered:  {
                            title: langJS('global_material_ordered'),
                            width: '10%',
                            type: 'checkbox',
                            create: true,
                            list: false,
                            edit:true,
                            values: { '0': '', '1': '' },
                            containerClass: 'jtabledlg-w15proc'
                        },
                        cylinder:{
                            title: langJS('global_cylinder'),
                            list: false,
                            edit: true,
                            create: true,
                            sorting: false,
                            type: 'checkbox',
                            values: { '0': '', '1': '' },
                            listClass: 'text-center',
                            containerClass: 'jtabledlg-w15proc'
                        },
                        right_angle:{
                            title: langJS('global_right_angle'),
                            list: false,
                            edit: true,
                            create: true,
                            sorting: false,
                            type: 'checkbox',
                            values: { '0': '', '1': '' },
                            listClass: 'text-center',
                            containerClass: 'jtabledlg-w15proc'
                        },
                        calibration:{
                            title: langJS('global_calibration'),
                            list: false,
                            edit: true,
                            create: true,
                            sorting: false,
                            type: 'checkbox',
                            values: { '0': '', '1': '' },
                            listClass: 'text-center',
                            containerClass: 'jtabledlg-w15proc'
                        },
                        order_date: {
                            title: langJS('global_order_date'),
                            width: '7%',
                            list: false,
                            //inputClass: 'validate[required]',
                            containerClass: 'jtabledlg-w100proc',
                            listClass: 'text-center',
                            sorting: true,
                        },
                        arm1:{
                            title: langJS('global_arm1'),
                            create: true,
                            edit: true,
                            list: false,
                            sorting: true,
                            sortField:'s.height',
                            width: '10%',
                            listClass: 'text-right',
                            inputClass: 'validate[required]',
                            containerClass : 'jtabledlg-w20proc',
                            display: function(data){
                                return data.record.arm1+' '+constJS('UNIT');
                            }
                        },
                        arm2:{
                            title: langJS('global_arm2'),
                            create: true,
                            edit: true,
                            list: false,
                            sorting: true,
                            sortField:'s.height',
                            width: '10%',
                            listClass: 'text-right',
                            inputClass: 'validate[required]',
                            containerClass : 'jtabledlg-w20proc',
                            display: function(data){
                                return data.record.arm2+' '+constJS('UNIT');
                            }
                        },
                        height:{
                            title: langJS('global_height'),
                            create: true,
                            edit: true,
                            list: false,
                            sorting: true,
                            sortField:'s.height',
                            width: '10%',
                            listClass: 'text-right',
                            inputClass: 'validate[required]',
                            containerClass : 'jtabledlg-w25proc',
                            display: function(data){
                                return data.record.height+' '+constJS('UNIT');
                            }
                        },
                        width:{
                            title: langJS('global_width'),
                            create: true,
                            edit: true,
                            list: false,
                            sorting: true,
                            sortField:'s.width',
                            width: '10%',
                            listClass: 'text-right',
                            inputClass: 'validate[required]',
                            containerClass : 'jtabledlg-w33proc',
                            display: function(data){
                                return data.record.width+' '+constJS('UNIT');
                            }
                        },
                        length:{
                            title: langJS('global_length'),
                            create: true,
                            edit: true,
                            list: false,
                            sorting: false,
                            sortField:'s.length',
                            width: '10%',
                            listClass: 'text-right',
                            inputClass: 'validate[required]',
                            containerClass : 'jtabledlg-w33proc',
                            display: function(data){
                                return data.record.length+' '+constJS('UNIT');
                            }
                        },
                        diameter:{
                            title: langJS('global_diameter'),
                            create: true,
                            edit: true,
                            list: false,
                            sorting: false,
                            width: '10%',
                            listClass: 'text-right',
                            inputClass: 'validate[required]',
                            containerClass : 'jtabledlg-w33proc',
                            display: function(data){
                                return data.record.diameter+' '+constJS('UNIT');
                            }
                        },
                        material_unit_price: {
                            title: langJS('global_material_unit_price'),
                            create: true,
                            edit: true,
                            list: false,
                            sorting: false,
                            width: '8%',
                            listClass: 'text-right',
                            inputClass: 'validate[required, min[0]]',
                            containerClass : 'jtabledlg-w50proc',
                            display: function(data){
                                return currency_format(data.record.material_unit_price);
                            }
                        },
                        material_price: {
                            title: langJS('global_material_price'),
                            create: true,
                            edit: true,
                            list: false,
                            sorting: false,
                            width: '8%',
                            listClass: 'text-right',
                            inputClass: 'validate[required, min[0]]',
                            containerClass : 'jtabledlg-w50proc',
                            display: function(data){
                                return currency_format(data.record.material_price);
                            }
                        },
                        total: {
                            title: langJS('global_total_material_price'),
                            width: '10%',
                            create: true,
                            edit: true,
                            sorting: false,
                            list: (params.price_right==1?true:false),
                            containerClass : 'jtabledlg-w100proc',
                            display: function(data){
                                return currency_format(parseFloat(data.record.quantity*data.record.material_price).toFixed(2));
                            }
                        },
                        est_time: {
                            title: langJS('global_est_time'),
                            width: '10%',
                            create: false,
                            edit: false,
                            list: true,
                            sorting: false,
                            containerClass : 'jtabledlg-w100proc',
                            display: function(data){
                                let tot_price = (data.record.price-data.record.material_price)*parseFloat(data.record.quantity);
                                let totalMinutes = (tot_price/parseFloat(params.wage)).toFixed(2)*60;
                                let hours = Math.floor(totalMinutes / 60);
                                let minutes = totalMinutes % 60;
                                return isNaN(tot_price)?" - ":(hours+" óra "+minutes.toFixed(0)+" perc");
                            }
                        },
                        working_minutes:{
                            title: 'Valós gyártási idő',
                            width: '10%',
                            create: false,
                            edit: false,
                            list: true,
                            listClass: 'wrong_j',
                            containerClass : 'jtabledlg-w100proc',
                            display: function(data){
                                let totalMinutes = parseFloat(data.record.working_minutes);
                                let hours = Math.floor(totalMinutes / 60);
                                let minutes = totalMinutes % 60;
                                return isNaN(totalMinutes)?" - ":(hours+" óra "+minutes.toFixed(0)+" perc");
                            }
                        },
                        handling: {
                            title: langJS('global_handling'),
                            create: true,
                            edit: true,
                            list: true,
                            width: '13%',
                            inputClass: 'sel2-100 select2-done resize-y-300 height-y-45',
                            containerClass : 'jtabledlg-w100proc',
                            display: function(data){
                                return (data.record.handling?data.record.handling.replaceAll(',', ', '):' - ');
                            }
                        },
                        description: {
                            title: langJS('global_description'),
                            create: true,
                            edit: true,
                            list: false,
                            type: 'textarea',
                            width: '13%',
                            containerClass : 'jtabledlg-w100proc',
                            inputClass: 'resize-y-300',
                        },
                        order_comments: {
                            title: langJS('global_comments'),
                            create: true,
                            edit: true,
                            list: false,
                            type: 'textarea',
                            width: '11%',
                            inputClass: 'height-y-45 resize-y-300',
                            containerClass : 'jtabledlg-w100proc',
                        },
                        ts:{
                            title: langJS('global_insert_date'),
                            list:false,
                            create:false,
                            edit:false,
                            width: '10%',
                            listClass: 'text-right',
                            display: function(data){
                                return data.record.ts;
                            }
                        },
                        archived: {
                            title: langJS('global_archived'),
                            width: '3%',
                            display: function (data) {
                                return '<input class="enable_one_archived" title="enable/disable" rec_id="'+data.record.id+'" type="checkbox" '+checkedtext(data.record.archived==1)+' />';
                            },
                            sorting: false,
                            edit: false,
                            create: false,
                            listClass:'enable_one_archived_parent',
                        },
                        stp_view:{
                            title: langJS('global_view'),
                            create: false,
                            edit: false,
                            list: true,
                            sorting:false,
                            width:'2%',
                            listClass:'text-center',
                            display: function(data){
                                if(data.record.stp){
                                    var $btn = APP.jTable.createButton({icon:'fas fa-cube',classes:'rbtn-red btn-plus',title:'3D fájl'});
                                    $btn.off('click').on('click',function(){
                                        fileShowDialog(data.record.stp_url, data.record.stp);
                                    });
                                    return $btn;
                                }else{
                                    return '';
                                }
                            }
                        },
                        image_upload:{
                            title: langJS('global_image_upload'),
                            create: false,
                            edit: false,
                            list: true,
                            sorting:false,
                            width:'2%',
                            listClass:'text-center',
                            display: function(data){
                                var $btn = APP.jTable.createButton({icon:'fas fa-image',classes:'rbtn-green btn-plus',title:langJS("global_image_upload")});
                                $btn.off('click').on('click',function(){
                                    var id = data.record.id;
                                    var img = data.record.image_url;
                                    APP.images.upload_image(id, img, true, function(idata){
                                        //console.log(idata);
                                        data.thisTable.jtable('reload');
                                    });
                                });
                                return $btn;
                            }
                        },
                        image_del:{
                            title: langJS('global_image_del'),
                            create: false,
                            edit: false,
                            list: true,
                            sorting:false,
                            width:'2%',
                            listClass:'text-center',
                            display: function(data){
                                var $btn = APP.jTable.createButton({icon:'fas fa-unlink',classes:'rbtn-red btn-plus',title:langJS("global_image_del")});
                                $btn.off('click').on('click',function(){
                                    APP.showDlg(langJS('global_confirm'),langJS('global_confirm_text'),langJS('global_yes'),langJS('global_no'), function(){
                                        crud_jsupdate('Jobs/delete_image',{id: data.record.id, image: data.record.image}, function(retData){
                                            data.thisTable.jtable('reload');
                                        });
                                    });
                                });
                                return $btn;
                            }
                        },
                        job_files:{
                            title: langJS('global_files'),
                            create: false,
                            edit: false,
                            list: true,
                            sorting:false,
                            width:'2%',
                            listClass:'text-center',
                            display: function(data){
                                var $btn = APP.jTable.createButton({icon:'fas fa-file-upload',classes:'rbtn-blue btn-plus',title:langJS("global_files")});
                                $btn.off('click').on('click',function(){
                                    show_files(data);
                                });
                                return $btn;
                            }
                        },
                },
                //Initialize validation logic when a form is created
                formCreated: function (event, data) {
                    var $dialog = data.form.parent();
                    var $quantity = data.form.find('input[name="quantity"]');
                    var $status = data.form.find('input[name="status"]');
                    var $width = data.form.find('input[name="width"]');
                    var $length = data.form.find('input[name="length"]');
                    var $height = data.form.find('input[name="height"]');
                    var $materialid = data.form.find('input[name="materialid"]');
                    var $price = data.form.find('input[name="price"]');
                    var $matuprice = data.form.find('input[name="material_unit_price"]');
                    var $matprice = data.form.find('input[name="material_price"]');
                    var $total = data.form.find('input[name="total"]');
                    var $handling = data.form.find('input[name="handling"]');
                    var $cylinder = data.form.find('input[name="cylinder"]');
                    var $right_angle = data.form.find('input[name="right_angle"]');
                    var $diameter = data.form.find('input[name="diameter"]');
                    var $post_price = data.form.find('input[name="post_price"]');
                    var $surface = data.form.find('input[name="surface"]');
                    var $weight = data.form.find('input[name="weight"]');
                    var $order_date = data.form.find('input[name="order_date"]');

                    var $arm1 = data.form.find('input[name="arm1"]');
                    var $arm2 = data.form.find('input[name="arm2"]');

                    $order_date.datepicker(datepicker_defaults());

                    var $material_type = data.form.find('input[name="material_type"]');

                    if($material_type.val()==0){
                        $order_date.parent().parent().show();
                    }else{
                        $order_date.parent().parent().hide();
                    }
                    
                    $post_price.dspinner({
                        suffix: APP.settings.currency,
                        step: 1,
                        places: 2,
                        increment: 'fast',
                        allowNull: false,
                        min:0,
                        max:999999999
                    });

                    $surface.dspinner({
                        suffix: ' dm2',
                        step: 1,
                        places: 2,
                        increment: 'fast',
                        allowNull: false,
                        min:0,
                        max:999999999
                    }).off('change.dchange').on('change.dchange', function(){
                        $post_price.dspinner('value', parseFloat(params.treatment)*parseFloat($surface.val()));
                    });

                    $weight.dspinner({
                        suffix: ' kg',
                        step: 1,
                        places: 2,
                        increment: 'fast',
                        allowNull: false,
                        min:0,
                        max:999999999
                    });

                    $post_price.prop('readonly', true);

                    var material_cont = data.form.find('input[name="calibration"]').parent().parent();
                    //material_cont.css('width', '100%');
                    /*var $cut = $('<div class="cut_container hidden">'+
                                    'ID: <input type="text" id="stock_id" name="stock_id" class="px50 validate[required]" /> - <input type="text" id="mch" class="px60" readonly /> X <input type="text" id="mcw" class="px60" readonly /> X <input type="text" id="mcl" class="px60" readonly /> <br/>'+
                                    '<span style="width:145px; display: inline-block;">&nbsp;</span>|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<span style="width:90px; display: inline-block;">&nbsp;</span>|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<span style="width:90px; display: inline-block;">&nbsp;</span>|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br/>'+
                                    'Kód: <input type="text" id="mc_code" class="px50" readonly />&nbsp;&nbsp;<input type="text" id="height_qty" name="height_qty" class="px30" /> X <input type="text" id="cheight" name="cheight" class="px30"/> &nbsp;&nbsp;&nbsp; <input type="text" id="width_qty" name="width_qty" class="px30"/> X <input type="text" id="cwidth" name="cwidth" class="px30" /> &nbsp;&nbsp;&nbsp; <input type="text" id="length_qty" name="length_qty" class="px30" /> X <input type="text" id="clength" name="clength" class="px30"/><br/><br/>'+
                                    'Polc: <input type="text" id="mc_shelf" class="px50" readonly /> Db: <input type="text" id="squantity" name="squantity" class="px60" readonly/> / Elvesz: <input type="text" id="take_qty" name="take_qty" class="px60 validate[required]" />'+
                                    '<input type="hidden" id="cut_id" name="cut_id" class="px60" />'+
                              '</div>');
                    material_cont.after($cut);

                    $cut.find('#stock_id').on('change',function(){
                        crud_jsupdate('Stock/get_stock',{id:$(this).val()}, function(rec){
                            if(rec.stock){
                                let data = rec.stock;
                                $cut.find('#mch').val(data.height);
                                $cut.find('#mcw').val(data.width);
                                $cut.find('#mcl').val(data.length);
                                $cut.find('#mc_code').val(data.material_code);
                                $cut.find('#mc_shelf').val(data.shelf);
                                $cut.find('#squantity').val(data.quantity);
                            }
                        });
                    });

                    $cut.find('#stock_id').on('change',function(){
                        calc_material_prices($materialid, $width, $length, $height, $diameter,$quantity, $matprice, $matuprice, $total, 0, $cylinder, $material_type, $cut);
                    });

                    $cut.find('#take_qty').on('change',function(){
                        calc_material_prices($materialid, $width, $length, $height, $diameter,$quantity, $matprice, $matuprice, $total, 0, $cylinder, $material_type, $cut);
                    });

                    $cut.find('#cheight').on('change',function(){
                        calc_material_prices($materialid, $width, $length, $height, $diameter,$quantity, $matprice, $matuprice, $total, 0, $cylinder, $material_type, $cut);
                    });

                    $cut.find('#cwidth').on('change',function(){
                        calc_material_prices($materialid, $width, $length, $height, $diameter,$quantity, $matprice, $matuprice, $total, 0, $cylinder, $material_type, $cut);
                    });

                    $cut.find('#clength').on('change',function(){
                        calc_material_prices($materialid, $width, $length, $height, $diameter,$quantity, $matprice, $matuprice, $total, 0, $cylinder, $material_type, $cut);
                    });
                    */

                    $total.dspinner({
                        suffix: APP.settings.currency+'/poz.',
                        step: 1,
                        places: 2,
                        increment: 'fast',
                        allowNull: false,
                        min:0,
                        max:999999
                    });

                    $total.prop('readonly', true);

                    $matuprice.dspinner({
                        suffix: APP.settings.currency+'/kg',
                        step: 1,
                        places: 2,
                        increment: 'fast',
                        allowNull: false,
                        min:0,
                        max:999999
                    }).off('change.dchange').on('change.dchange', function(){
                        calc_material_prices($materialid, $width, $length, $height, $diameter,$quantity, $matprice, $matuprice, $total, 0, $cylinder, $material_type, $right_angle, $arm1, $arm2);
                    });
                    
                    $quantity.dspinner({
                        suffix: '',
                        step: 1,
                        places:0,
                        increment: 'fast',
                        allowNull: false,
                        min:0,
                        max:999999
                    }).off('change.dchange').on('change.dchange', function(){
                        calc_material_prices($materialid, $width, $length, $height, $diameter,$quantity, $matprice, $matuprice, $total, 0, $cylinder, $material_type, $right_angle, $arm1, $arm2);
                    });

                    $width.dspinner({
                        suffix: ' '+constJS('UNIT'),
                        step: 1,
                        places: 1,
                        increment: 'fast',
                        allowNull: false,
                        min:0,
                        max:999999
                    }).off('change.dchange').on('change.dchange', function(){
                        calc_material_prices($materialid, $width, $length, $height, $diameter,$quantity, $matprice, $matuprice, $total, 0, $cylinder, $material_type, $right_angle, $arm1, $arm2);
                    });
    
                    $length.dspinner({
                        suffix: ' '+constJS('UNIT'),
                        step: 1,
                        places: 1,
                        increment: 'fast',
                        allowNull: false,
                        min:0,
                        max:999999
                    }).off('change.dchange').on('change.dchange', function(){
                        calc_material_prices($materialid, $width, $length, $height, $diameter,$quantity, $matprice, $matuprice, $total, 0, $cylinder, $material_type, $right_angle, $arm1, $arm2);
                    });
    
                    $height.dspinner({
                        suffix: ' '+constJS('UNIT'),
                        step: 1,
                        places: 1,
                        increment: 'fast',
                        allowNull: false,
                        min:0,
                        max:999999
                    }).off('change.dchange').on('change.dchange', function(){
                        calc_material_prices($materialid, $width, $length, $height, $diameter,$quantity, $matprice, $matuprice, $total, 0, $cylinder, $material_type, $right_angle, $arm1, $arm2);
                    });

                    $arm1.dspinner({
                        suffix: ' '+constJS('UNIT'),
                        step: 1,
                        places: 1,
                        increment: 'fast',
                        allowNull: false,
                        min:0,
                        max:999999
                    }).off('change.dchange').on('change.dchange', function(){
                        calc_material_prices($materialid, $width, $length, $height, $diameter,$quantity, $matprice, $matuprice, $total, 0, $cylinder, $material_type, $right_angle, $arm1, $arm2);
                    });

                    $arm2.dspinner({
                        suffix: ' '+constJS('UNIT'),
                        step: 1,
                        places: 1,
                        increment: 'fast',
                        allowNull: false,
                        min:0,
                        max:999999
                    }).off('change.dchange').on('change.dchange', function(){
                        calc_material_prices($materialid, $width, $length, $height, $diameter,$quantity, $matprice, $matuprice, $total, 0, $cylinder, $material_type, $right_angle, $arm1, $arm2);
                    });

                    $diameter.dspinner({
                        suffix: ' '+constJS('UNIT'),
                        step: 1,
                        places: 1,
                        increment: 'fast',
                        allowNull: false,
                        min:0,
                        max:999999
                    }).off('change.dchange').on('change.dchange', function(){
                        calc_material_prices($materialid, $width, $length, $height, $diameter,$quantity, $matprice, $matuprice, $total, 0, $cylinder, $material_type, $right_angle, $arm1, $arm2);
                    });
    
                    $materialid.select2(APP.select2.select2_options_ajax('Stock/sel2_materials',{
                        allowClear: true,
                        cacheKEY:'sel2.materials',
                    })).on('change',function(){
                        $matuprice.dspinner('value', $materialid.select2('data').price?$materialid.select2('data').price:0);
                        calc_material_prices($materialid, $width, $length, $height, $diameter,$quantity, $matprice, $matuprice, $total, 0, $cylinder, $material_type, $right_angle, $arm1, $arm2);
                    });

                    $status.select2(APP.select2.select2_options_ajax('Jobs_status/sel2_status',{
                        allowClear: true,
                        cacheKEY:'sel2.status',
                    })).on('change', function(ev){
                        var status = $(this).val();
                        function do_update(){
                            if(ev.added){
                                crud_jsupdate('Jobs/update_jobs',{id: data.record.id, status: status}, function(retData){
                                    if(ev.added.show_message==1){
                                        APP.showMessage(langJS('global_message'),ev.added.message,langJS('global_ok'));
                                    }
                                    
                                    //jobs_jtable.childTable.jtable('reload');

                                    stdata = ev.added;
                                    tsm = stdata.show_message;
                                    tm = stdata.message;

                                });
                            }
                        };
                        if(ev.added){
                            if(status==-2 && stdata.id==7){
                                APP.lateDialog(data.record.id, do_update);
                            }else if(stdata.type==2){
                                APP.qcDialog(data.record.id, do_update);
                            }else if(tsm==2){
                                APP.showDlg(langJS('global_message'),tm,langJS('global_yes'),langJS('global_no'), 
                                    function(){
                                        do_update();
                                    },
                                    function(){
                                        $status.select2('val',stdata.id);
                                    },
                                );
                            }else{
                                do_update();
                            
                            }
                            
                        }
                    }).on('select2-opening', function(){
                        stdata = $status.select2('data');
                        tsm = stdata.show_message;
                        tm = stdata.message;
                    });

                    $handling.select2(APP.select2.select2_options_ajax('Jobs/sel2_handlings',{
                        allowClear: true,
                        multiple: true,
                        data_url_mutiple: "Jobs/sel2_init_handlings",
                        //cacheKEY:'sel2.order_handlings',
                        createSearchChoice:function(term, data) {
                            if ( $(data).filter( function() {
                                return this.name.localeCompare(term)===0;
                            }).length===0) {
                                return {id:term, name:term};
                            }
                        },
                    }));

                    data.form.find('input[name=price]').dspinner({
                        suffix: APP.settings.currency,
                        step: 1,
                        places: 2,
                        increment: 'fast',
                        allowNull: false,
                        min:0,
                        max:999999
                    }).off('change.dchange').on('change.dchange', function(){
                        /*let price = parseFloat($price.val());
                        let quantity = parseFloat($quantity.val());
                        $total.dspinner('value', parseFloat(price*quantity).toFixed(2));*/
                    });

                    data.form.find('input[name=material_price]').dspinner({
                        suffix: APP.settings.currency+'/db',
                        step: 1,
                        places: 2,
                        increment: 'fast',
                        allowNull: false,
                        min:0,
                        max:999999
                    });

                    $material_type.select2(APP.select2.select2_options({
                        allowClear: false,
                        data:[{id:-1,text:langJS('global_undefined')}, {id:0,text:langJS('global_need_order')},{id:1,text:langJS('global_own_stock')}]
                    })).on('change', function(ev){
                        if($(this).val()==0){
                            $order_date.parent().parent().show();
                        }else{
                            $order_date.parent().parent().hide();
                        }
                        /*if($(this).val()==1){
                            $('.cut_container').removeClass('hidden');
                        }else{
                            $('.cut_container').addClass('hidden');
                        }*/
                    });

                    $cylinder.on('click',function(){
                        if($(this).prop('checked')){
                            $width.dspinner( "value", 0 );
                            $width.parent().parent().hide();
                            $height.dspinner( "value", 0 );
                            $height.parent().parent().hide();
                            $diameter.parent().parent().show();
                            $right_angle.prop('checked', false);
                            $arm1.parent().parent().hide();
                            $arm2.parent().parent().hide();
                        }else{
                            $width.parent().parent().show();
                            $height.parent().parent().show();
                            $diameter.dspinner( "value", 0 );
                            $diameter.parent().parent().hide();
                            $right_angle.prop('checked', false);
                            $arm1.dspinner( "value", 0 );
                            $arm1.parent().parent().hide();
                            $arm2.dspinner( "value", 0 );
                            $arm2.parent().parent().hide();
                        }
                        calc_material_prices($materialid, $width, $length, $height, $diameter,$quantity, $matprice, $matuprice, $total, 0, $cylinder, $material_type, $right_angle, $arm1, $arm2);
                    });

                    $right_angle.on('click',function(){
                        if($(this).prop('checked')){
                            $width.dspinner( "value", 0 );
                            $width.parent().parent().hide();
                            $diameter.dspinner( "value", 0 );
                            $diameter.parent().parent().hide();
                            $cylinder.prop('checked', false);
                            $height.parent().parent().show();
                            $arm1.parent().parent().show();
                            $arm2.parent().parent().show();
                        }else{
                            $width.parent().parent().show();
                            $height.parent().parent().show();
                            $diameter.dspinner( "value", 0 );
                            $diameter.parent().parent().hide();
                            $cylinder.prop('checked', false);
                            $arm1.dspinner( "value", 0 );
                            $arm1.parent().parent().hide();
                            $arm2.dspinner( "value", 0 );
                            $arm2.parent().parent().hide();
                        }
                        calc_material_prices($materialid, $width, $length, $height, $diameter,$quantity, $matprice, $matuprice, $total, 0, $cylinder, $material_type, $right_angle, $arm1, $arm2);
                    });
    
                    if (data.formType=='edit'){
                        if($right_angle.prop('checked')){
                            $width.parent().parent().hide();
                            $diameter.parent().parent().hide();
                        }else if($cylinder.prop('checked')){
                            $width.parent().parent().hide();
                            $height.parent().parent().hide();
                            $arm1.parent().parent().hide();
                            $arm2.parent().parent().hide();
                        }else{
                            $diameter.parent().parent().hide();
                            $arm1.parent().parent().hide();
                            $arm2.parent().parent().hide();
                        }

                        /*if($material_type.val()==1){
                            $('.cut_container').removeClass('hidden');
                            crud_jsupdate('Cut/getcut', {id: data.record.material_cut_id}, function(retData){
                                let data = retData.cut[0];
                                if(data){
                                    $cut.find('#stock_id').val(data.stock_id);
                                    $cut.find('#take_qty').val(data.take_qty);

                                    $cut.find('#mch').val(parseFloat(data.height));
                                    $cut.find('#mcw').val(parseFloat(data.width));
                                    $cut.find('#mcl').val(parseFloat(data.length));
                                    $cut.find('#mc_code').val(data.material_code);
                                    $cut.find('#mc_shelf').val(data.shelf);
                                    $cut.find('#squantity').val(data.quantity);
                                    
                                    $cut.find('#height_qty').val(data.height_qty);
                                    $cut.find('#width_qty').val(data.width_qty);
                                    $cut.find('#length_qty').val(data.length_qty);

                                    $cut.find('#cheight').val(parseFloat(data.cheight));
                                    $cut.find('#cwidth').val(parseFloat(data.cwidth));
                                    $cut.find('#clength').val(parseFloat(data.clength));
                                    $cut.find('#cut_id').val(data.id);
                                }
                            });
                        }else{
                            $('.cut_container').addClass('hidden');
                        }*/
                    }
    
                    if (data.formType=='create'){
                        $diameter.dspinner( "value", 0 );
                        $diameter.parent().parent().hide();
                        $arm1.dspinner( "value", 0 );
                        $arm1.parent().parent().hide();
                        $arm2.dspinner( "value", 0 );
                        $arm2.parent().parent().hide();
                    }

                    $matprice.prop('readonly', true);

                    var $attach = $('<div id="attachment_div" class="dent-input-container" style="float:right; width: 48%;">'+
                            '<label for="">Csatolmányok</label>'+
                            '<div id="attachments_list"/>'+
                            '<div id="add_attachments_container">'+
                                '<div id="add_attachments_text">Húzza ide a fájlokat</div>'+
                                '<button type="button" id="add_attachments_button" class="button-blue">Fájlok kiválasztása</button>'+
                            '</div>'+
                        '</div>');

                    var $d_attach = $('<div id="d_attachment_div" class="dent-input-container" style="float:right; width: 48%;">'+
                        '<label for="">3D fájl</label>'+
                        '<div id="d_attachments_list"/>'+
                        '<div id="d_add_attachments_container">'+
                            '<div id="d_add_attachments_text">Húzza ide a fájlt</div>'+
                            '<button type="button" id="d_add_attachments_button" class="button-blue">Fájlok kiválasztása</button>'+
                        '</div>'+
                    '</div>');

                    var $img_attach = $('<div id="image_upload_div" style="float:right; width: 48%; margin-top:20px">'+
                        '<label for="">Kép</label>'+
                        '<div class="uploaded_intern_img" style="height:auto;"><img src="'+base_url()+'images/image_not_available.png" style="width: 100%; height: 100%;" id="snapshot_img" /></div>'+
                    '</div>');

                    /*var $img_attach = $('<div id="image_upload_div" style="float:right; width: 48%; margin-top:20px">'+
                            '<label for="">Fő kép feltöltése</label>'+
                            '<div class="uploaded_intern_img"></div>'+
                        '</div>'); */
                
                //if (data.formType=='create'){
                    data.form.parent().find('#attachment_div').remove();
                    data.form.parent().find('#d_attachment_div').remove();
                    data.form.parent().find('#image_upload_div').remove();
                    data.form.parent().find('.file_warning').remove();
                    data.form.parent().append($attach);
                    data.form.parent().append($d_attach);
                    data.form.parent().append($img_attach);
                    data.form.css("width", "50%");
                    data.form.css("float", "left");

                    if (data.formType=='edit'){
                        var $warn = '<div class="dialog-warning hidden file_warning" style="display: block; float: right;"><i class="fas fa-exclamation-triangle fa-fw"></i><span>Ha vannak meglévő fájlok és újakat tölt fel a régiek felülíródnak!</span></div>';
                        data.form.parent().append($warn);
                    }

                    uploader =  new plupload.Uploader({
                        browse_button: $attach.find('#add_attachments_button')[0], // this can be an id of a DOM element or the DOM element itself
                        url: build_url('index.php/uploadr/Upload/upload_file'),
                        headers:{'app-upload':'true'}, // this will generate HTTP_APP_UPLOAD headear in upload request
                        runtimes : 'html5,html4',
                        container: $attach.find('#add_attachments_container')[0], // ... or DOM Element itself
                        drop_element : [$attach.find('#add_attachments_container')[0]],
                        chunk_size: '1024kb',
                        multipart:true,
                        multipart_params:{},
                        filters:{
                                    max_file_size : '30Mb',
                                    mime_types:
                                        [
                                        {title : "Image files", extensions : "jpg,jpeg,gif,png"},
                                        {title : "Document files", extensions : "pdf,doc,docx,txt,xls,xlsx,step,STEP,dwg,DWG" },
                                        {title : "Compressed files", extensions : "zip,rar" }
                                        ]
                                },
                        init:{
                            PostInit: function(up, params) {
                                if (uploader.features.dragdrop) {
                                    $.each(uploader.settings.drop_element, function(i,target){
                                        target.ondragover = function(event) {
                                            event.dataTransfer.dropEffect = "copy";
                                        };
                                        target.ondragenter = function() {
                                            $attach.find('#add_attachments_container').css('background-color','#98CF09 !important');
                                        };
                                        target.ondragleave = function() {
                                            $attach.find('#add_attachments_container').css('background-color','');
                                        };
                                        target.ondrop = function() {
                                            $attach.find('#add_attachments_container').css('background-color','');
                                        };
                                });
                                }
                                var files = data.record.files.split(',');
                                $.each(files, function(i, file) {
                                    $attach.find('#attachments_list').append('<div class="addedAttachment"><a href="'+base_url()+'upload/files/'+file+'" target="_blank">'+file+'</a>' + '</div>');
                                });
                            },
                            //Populating file list
                            FilesAdded: function(up, files) {
                                $dialog.parent().find('button').each(function(){$(this).prop('disabled',true);});

                                $.each(files, function(i, file) {
                                    $attach.find('#attachments_list').append('<div class="addedAttachment" id="' + file.id + '">' + file.name +
                                    '<a href="#" id="' + file.id + '" class="removeAttachment"> X</a>' + '</div>');
                                    uploader.start();
                                });
                            },
                            //Creating unique file name
                            BeforeUpload: function(up, file) {
                                var params = up.settings.multipart_params;
                                params.fileName = file.id + '.' + file.name.split('.').pop();
                            },
                            UploadComplete: function(up, files) {
                                $dialog.parent().find('button').each(function(){$(this).prop('disabled',false);});
                            },
                            //Deleting based on unique file name
                            FilesRemoved: function(up, files){
                                $.each(files, function(i, file){
                                    //console.log(file);
                                    //var fileName = file.id + '.' + file.name.split('.').pop();
                                    crud_jsupdate('uploadr/Upload/delete_file',{fileName: file.name},function(retData){
                                    });
                                });
                            },
                            //UploadError message
                            Error: function(up, err) {
                                APP.showMessage(langJS('global_error'), err.message, langJS('global_ok'));
                            }
                        }
                    });
                    uploader.init();
                    $attach.find('#attachments_list').on('click', '.removeAttachment', function(e) {
                        uploader.removeFile(uploader.getFile(this.id));
                        $('#'+this.id).remove();
                        e.preventDefault();
                    });

                    d_uploader =  new plupload.Uploader({
                        browse_button: $d_attach.find('#d_add_attachments_button')[0], // this can be an id of a DOM element or the DOM element itself
                        url: build_url('index.php/uploadr/Upload/upload_file'),
                        headers:{'app-upload':'true'}, // this will generate HTTP_APP_UPLOAD headear in upload request
                        runtimes : 'html5,html4',
                        container: $d_attach.find('#d_add_attachments_container')[0], // ... or DOM Element itself
                        drop_element : [$d_attach.find('#d_add_attachments_container')[0]],
                        chunk_size: '1024kb',
                        multipart:true,
                        multipart_params:{},
                        filters:{
                                    max_file_size : '30Mb',
                                    mime_types:
                                        [
                                        {title : "Document files", extensions : "step,STEP,stp,STP" },
                                        ]
                                },
                        init:{
                            PostInit: function(up, params) {
                                if (d_uploader.features.dragdrop) {
                                    $.each(d_uploader.settings.drop_element, function(i,target){
                                        target.ondragover = function(event) {
                                            event.dataTransfer.dropEffect = "copy";
                                        };
                                        target.ondragenter = function() {
                                            $d_attach.find('#d_add_attachments_container').css('background-color','#98CF09 !important');
                                        };
                                        target.ondragleave = function() {
                                            $d_attach.find('#d_add_attachments_container').css('background-color','');
                                        };
                                        target.ondrop = function() {
                                            $d_attach.find('#d_add_attachments_container').css('background-color','');
                                        };
                                });
                                }
                                var stp_file = data.record.stp;
                                if(stp_file){
                                    $d_attach.find('#d_attachments_list').append('<div class="addedAttachment"><a href="'+base_url()+'upload/images/'+stp_file+'" target="_blank" download>'+stp_file+'</a>' + '</div>');
                                }
                                /*if(options.files){
                                    $.each(options.files, function( key, value ) {
                                        d_uploader.addFile(options.files[key]);
                                    });
                                }*/
                            },
                            //Populating file list
                            FilesAdded: function(up, files) {
                                //$dialog.parent().find('button').each(function(){$(this).prop('disabled',true);});

                                var maxfiles = 1;
                                if(up.files.length > maxfiles )
                                {
                                    up.splice(maxfiles);
                                    $.each(files, function(i, file) {
                                        up.removeFile(file);
                                    });
                                    APP.showMessage(langJS('global_error'), 'Több van mint '+maxfiles+' fájl!');
                                }else{
                                    $.each(files, function(i, file) {
                                        $d_attach.find('#d_attachments_list').append('<div class="addedAttachment" id="' + file.id + '">' + file.name +
                                            '<a href="#" id="' + file.id + '" class="removeAttachment"> X</a>' + '</div>');
                                        d_uploader.start();
                                    });
                                }
                            },
                            FileUploaded:function(up, file, object){
                                var response = JSON.parse(object.response);
                                if (response.OK) {
                                    //APP.showMessage(langJS('global_success'), 'File imported successfully.');
                                    data.form.find('input[name=stp]').val(file.name);
                                    fileDialog(file, data.form);
                                }else{
                                    APP.showMessage(langJS('global_error'), 'Error: '+response.error.message);
                                }
                            },
                            //Creating unique file name
                            BeforeUpload: function(up, file) {
                                var params = up.settings.multipart_params;
                                params.fileName = file.id + '.' + file.name.split('.').pop();
                            },
                            UploadComplete: function(up, files) {
                                $dialog.parent().find('button').each(function(){$(this).prop('disabled',false);});
                            },
                            //Deleting based on unique file name
                            FilesRemoved: function(up, files){
                                $.each(files, function(i, file){
                                    //console.log(file);
                                    //var fileName = file.id + '.' + file.name.split('.').pop();
                                    crud_jsupdate('uploadr/upload/delete_file',{fileName: file.name},function(retData){
                                    });
                                });
                            },
                            //UploadError message
                            Error: function(up, err) {
                                APP.showMessage(langJS('global_error'), err.message, langJS('global_ok'));
                            }
                        }
                    });
                    d_uploader.init();
                    $d_attach.find('#d_attachments_list').on('click', '.removeAttachment', function(e) {
                        d_uploader.removeFile(d_uploader.getFile(this.id));
                        $('#'+this.id).remove();
                        e.preventDefault();
                    });

                        /*
                        APP.images.init_dimg_intern_upload($img_attach.find('.uploaded_intern_img'), '', false, function(file){
                            data.form.find('input[name=image_name]').val(file.name);
                            data.form.find('input[name=image_new_name]').val(file.origName);
                        });
                        */
                    //}

                    if (data.formType=='edit'){
                        /*if($material_type.val()==1){
                            $total.dspinner('value', (parseFloat(data.record.material_price)*parseFloat(data.record.material_qty)).toFixed(2));
                        }else{*/
                            calc_material_prices($materialid, $width, $length, $height, $diameter,$quantity, $matprice, $matuprice, $total, data.record.density, $cylinder, $material_type, $right_angle, $arm1, $arm2);
                        //}
                    }
                    
                    data.form.validationEngine(validation_defaults());
                },
                //Validate form when it is being submitted
                formSubmitting: function (event, data) {
                    var fileAttachments = [];
                    if(uploader && uploader.files){
                        $.each(uploader.files, function(i, file){
                            var temp = constJS("UPLOAD_TEMP");
                            var fileName = temp+ file.name;
                            fileAttachments.push(fileName);
                        });
                    }
                    data.form.find('input[name=fileAttachments]').val(fileAttachments);
                    //serialdata.push({"name":"fileAttachments", "value":fileAttachments});
                    return data.form.validationEngine('validate');
                },
                //Dispose validation logic when form is closed
                formClosed: function (event, data) {
                        data.form.validationEngine('hide');
                        data.form.validationEngine('detach');
                },
                recordAdded: function (event, data) {
                    APP.select2.cache_clear('sel2.stock');
                    //APP.select2.cache_clear('sel2.order_handlings');
                    data.thisTable.jtable('reload');
                },
                recordUpdated: function (event, data){
                    APP.select2.cache_clear('sel2.stock');
                    //APP.select2.cache_clear('sel2.order_handlings');
                    data.thisTable.jtable('reload');
                },
                recordDeleted: function (event, data) {
                    APP.select2.cache_clear('sel2.stock');
                    //APP.select2.cache_clear('sel2.order_handlings');
                },
                recordsLoaded: function(event, data) {
                    /*$('.jtable-child-row .jtable-data-row').on('dblclick', function() {
                        var row_id = $(this).attr('data-record-key');
                        console.log(row_id);
                        data.thisTable.jtable('showEditForm', row_id);
                    });*/
                    var touchtime = 0;
                    $('.jtable-child-row .jtable-data-row').on('click', function(ev) {
                        ev.preventDefault();
                        ev.stopPropagation();
                        var row_id = $(this).attr('data-record-key');
                        if (touchtime == 0) {
                            // set first click
                            touchtime = new Date().getTime();
                        } else {
                            // compare first click to this click and see if they occurred within double click threshold
                            if (((new Date().getTime()) - touchtime) < 800) {
                                // double click occurred
                                data.thisTable.jtable('showEditForm', row_id);
                                touchtime = 0;
                            } else {
                                // not a double click so set as a new first click
                                touchtime = new Date().getTime();
                            }
                        }
                    });

                    $('.jtable-child-row .jtable-data-row').on("click",'.enable_one_archived', function(e){
                        e.stopPropagation();
                        var attrib = $(this).prop("checked");
                        var rec_id = $(this).attr("rec_id");
                        var active = 0;
                        if(attrib){ active = 1;}
                        var params = {};
                        params['id']	 	= rec_id;
                        params['archived'] 	= active;
                        crud_jsupdate('Orders/enable_one_archived', params, nullFunction);
                    });
                },
                rowInserted: function(event, data){
                    if ((parseInt(data.record.cylinder)==0  && parseInt(data.record.right_angle)==0 && (parseFloat(data.record.width)==0 || parseFloat(data.record.length)==0 || parseFloat(data.record.height)==0)) || (parseInt(data.record.cylinder)==1 && (parseFloat(data.record.diameter)==0 || parseFloat(data.record.length)==0)) ||  (parseInt(data.record.right_angle)==1 && (parseFloat(data.record.arm1)==0 || parseFloat(data.record.arm2)==0 || parseFloat(data.record.height)==0 || parseFloat(data.record.length)==0))){
                        data.row.addClass('qpart_color');
                    }
                    if(parseFloat(data.record.quantity)>=5){
                        data.row.find('td.name_series').addClass('series_color');
                    }
                    if(data.record.wrong==1){
                        data.row.find('td.wrong_j').addClass('wrong_color');
                    }
                },

            },
            function (data){
                try{
                    jobs_jtable = data;
                    data.childTable.jtable('load');
                }catch(e){
                    //console.log("APP: ERROR Uncaught Error: cannot call methods on jtable prior to initialization; attempted to call method 'load' ");
                }
            }
        );
    };

    var fileDialog = function(file, $form){
        var elements;
		var my_elem;
        //var icontent = '<script type="text/javascript" src="'+base_url()+'js/o3dv/o3dv.min.js"></script>';
        $idiv = $('<div class="online_3d_viewer" id="online_3d_viewer" style="width: 800px; height: 600px;" model="'+base_url()+'upload/upload_tmp/'+file.name+'"></div>')
        var $container 	= $("<div></div>");
        $('body').append($container);
        var $dialog_3d = $container.dialog({
            title: '3d model',
            resizable: false,
            width:850,
            minHeight: 550,
            modal: true,
            autoOpen:true,
            buttons: [
                    {
                    text:langJS('global_save_img'),class: "button-blue",click: function(){
                        let name = file.name.split('.').slice(0, -1).join('.');
                        $form.find('input[name="name"]').val(name);
                        let url = my_elem.viewer.GetImageAsDataUrl(800, 600, 0);
                        let boundingBox = OV.GetBoundingBox(my_elem.model);
                        //console.log($form.parent().find('#snapshot_img'));
                        //console.log(url);
                        $form.parent().find('#snapshot_img').attr('src', url);
                        $form.find('input[name=image_src]').val(url.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''));
                        $form.find('input[name=image]').val(name+'.png');
                        /*let size = OV.SubCoord3D(boundingBox.max, boundingBox.min);
                        $form.find('input[name="height"]').val(parseFloat(size.x).toFixed(2));
                        $form.find('input[name="width"]').val(parseFloat(size.y).toFixed(2));
                        $form.find('input[name="length"]').val(parseFloat(size.z).toFixed(2));
                        */
                        /*for (let materialIndex = 0; materialIndex < my_elem.model.MaterialCount(); materialIndex++) {
                            let material = my_elem.model.GetMaterial(materialIndex);
                            console.log(material.name);
                         }*/
                        $(this).dialog("close");
                    }
                },
            ],
            create: function(ev, ui){
                
            },
            open: function(ev, ui){
                $container.html($idiv);
                OV.SetExternalLibLocation ('libs');
                elements = OV.Init3DViewerElements ();
                my_elem = elements[0];
            },
            close: function(){
                $(this).dialog("destroy").remove();
            },
        });     
    };

    function downloadURI(uri, name) {
        var link = document.createElement("a");
    
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();   
        link.remove();
        //after creating link you should delete dynamic link
        //clearDynamicLink(link); 
    }

    var fileShowDialog = function(file_name, name){
        var elements;
		var my_elem;
        $idiv = $('<div class="online_3d_viewer" id="online_3d_viewer" style="width: 800px; height: 600px;" model="'+file_name+'"></div>')
        var $container 	= $("<div></div>");
        $('body').append($container);
        var $dialog_3d_show = $container.dialog({
            title: '3d model',
            resizable: false,
            width:850,
            minHeight: 550,
            modal: true,
            autoOpen:true,
            buttons: [
                { text:langJS('global_download'),class: "button-green",click: function(){
                        downloadURI(file_name, name);
                        //window.open(file_name+'?'+ new Date().getTime(),'_blank');
                        $ (this).dialog("close");
                    }
                },
                {
                    text:langJS('global_ok'),class: "button-blue",click: function(){
                        $(this).dialog("close");
                    }
                },                
            ],
            create: function(ev, ui){
                
            },
            open: function(ev, ui){
                $container.html($idiv);
                OV.SetExternalLibLocation ('libs');
                elements = OV.Init3DViewerElements ();
                my_elem = elements[0];
            },
            close: function(){
                $(this).dialog("destroy").remove();
            },
        });     
    };

    function calc_material_prices($materialid, $width, $length, $height, $diameter,$quantity, $matprice, $matuprice, $total, mat_density=0, $cylinder=0, $material_type = 0, $right_angle = 0, $arm1 = 0, $arm2 = 0){
        //console.log($cylinder.prop('checked'));
        let data = $materialid.select2('data');
        let density = 0;
        if(mat_density>0){
            density = mat_density;
        }else{
            if(data){
                density = parseFloat(data.density);
            }
        }

        /*if($material_type.val()==1){
            var price = parseFloat($matuprice.val());
            var width = parseFloat($cut.find('#cwidth').val());
            var length = parseFloat($cut.find('#clength').val());
            var height = parseFloat($cut.find('#cheight').val());
            var diameter = parseFloat($diameter.val());
            var quantity = parseFloat($cut.find('#take_qty').val());
            var weight = 0;
            if($cylinder.prop('checked')){
                weight = Math.pow((diameter/1000)/2, 2)*Math.PI*(length/1000)*(density);
            }else{
                weight = (length/1000)*(width/1000)*(height/1000)*(density);
            }
        }else{*/
            var price = parseFloat($matuprice.val());
            var width = parseFloat($width.val());
            var length = parseFloat($length.val());
            var height = parseFloat($height.val());
            var diameter = parseFloat($diameter.val());
            var quantity = parseFloat($quantity.val());
            var arm1 = parseFloat($arm1.val());
            var arm2 = parseFloat($arm2.val());
            weight = 0;
            if($right_angle.prop('checked')){
                let a = (height/1000)*((arm1/1000)+(arm2/1000)-(height/1000));
                weight = a*(length/1000)*density;
                //console.log(weight);
            }else if($cylinder.prop('checked')){
                weight = Math.pow((diameter/1000)/2, 2)*Math.PI*(length/1000)*(density);
            }else{
                weight = (length/1000)*(width/1000)*(height/1000)*(density);
            }
        //}
        //console.log(weight);
        $matprice.dspinner('value', parseFloat(weight*price).toFixed(2));
        $total.dspinner('value', parseFloat(weight*price*quantity).toFixed(2));
    }

    var show_files = function(job_data){
        $('#jobs_files').jtable({
            title: langJS('global_files'),
            messages:jtable_lang(),
            insertDialogWidth:'500',
            editDialogWidth:'500',
            dialogShowEffect:null,
            dialogHideEffect:null,
            paging: true,
            pageSize: 10,
            sorting: true,
            defaultSorting: 'ts desc',
            visibleDeleteRecordButton: false,
            actions: {
                    listAction:   'Orders/list_jobs_files?job_id='+job_data.record.id,
                    deleteAction: 'Orders/delete_jobs_files',
                },
            toolbar: {
                items: [
                { // upload button
                    cssClass: 'rbtn-green upload_file',
                    icon: 'fas fa-file-upload',
                    text: langJS('global_upload'),
                    tooltip: langJS('global_upload')
                },
            ]
            },
            fields: {
                id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                job_id: {
                    type: 'hidden',
                    create: true,
                    edit: true,
                    list: false,
                },
                name: {
                    width:'50%',
                    title: langJS('global_name'),
                    create: false,
                    edit: false,
                    list: true,
                    sorting: true
                },
                ts: {
                    title: langJS('global_insert_date'),
                    list: true,
                    sorting: true,
                    display: function (data) {
                        return data.record.ts;
                    },
                    listClass:'text-right',
                },
                show_file:{
                    title: langJS('global_view'),
                    create: false,
                    edit: false,
                    list: true,
                    sorting:false,
                    width:'5%',
                    listClass:'text-center',
                    display: function(data){
                        var $btn = APP.jTable.createButton({icon:'fas fa-eye',classes:'rbtn-blue btn-view-file',title:langJS("global_view")});
                        $btn.off('click').on('click',function(){
                            window.open(data.record.file_url,'_blank');
                        });
                        return $btn;
                    }
                },
                deleteAppointment: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    listClass: "jtable-command-column",
                    display: function (data) {
                        var $btn = APP.jTable.createButton({icon:'fas fa-trash',classes: 'rbtn-red',title: langJS("global_delete")});
                            $btn.on('click',function () {
                                data.thisTable.jtable('showDeleteForm', data.record.id);
                            });
                        return $btn;
                    },
                }
            },
            recordsLoaded: function(event, data){
                $('#files-dialog').dialog({
                    title: langJS('global_files')+' - '+job_data.record.name,
                    resizable: false,
                    width:820,
                    modal: true,
                    buttons: [{
                            text:langJS('global_ok'),
                            class: "button-blue",
                            click: function() {

                                $('#files-dialog').dialog( "close" );
                            }
                        }
                    ],
                    create: function(ev, ui) {
                    },
                    open: function(ev, ui){
                        set_upload_button(job_data.record.id);
                    },
                    close: function(){
                        $('#files-dialog').dialog("destroy");
                    },
                });
            },
            recordDeleted: function(event, data){
            }
        });
        $('#jobs_files').jtable('load');

    };

    var set_upload_button = function(job_id){
        $('.upload_file').attr('id', 'upload_file');
        if (uploader_job){
            uploader_job.destroy();
        }
        uploader_job = new plupload.Uploader({
            headers:{'dent-upload':'true'}, // this will generate HTTP_APP_UPLOAD headear in upload request
            runtimes : 'html5,html4',
            chunk_size: '2048kb',//2mb
            multipart:true,
            multipart_params:{/*csrf_token:APP.get_token(),*/idx:$(this).attr('data-id'), space: $(this).attr('data-space'), token: $(this).attr('data-token')},
            browse_button : 'upload_file',
            url :build_url('index.php/uploadr/Upload/upload_file'),
            filters : {
                max_file_size : '30Mb',
                mime_types: [
                    {title : "Images", extensions : "jpg,png,jpeg,bmp"},
                    {title : "Documents", extensions : "pdf,doc,docx,txt,xls,xlsx,step,STEP,dwg,DWG"},
                    {title : "Archives", extensions : "zip,rar"},
                ]
            },
            init: {
                FilesAdded: function(up, files) {
                    uploader_job.start();
                },
                FileUploaded:function(up, file, object){
                    var response = JSON.parse(object.response);
                    if (response.OK) {
                        crud_jsupdate('Orders/create_jobs_file',{job_id: job_id, name: response.file.name}, function(retData){
                            $('#jobs_files').jtable('reload');
                        });
                    } else {
                        APP.showMessage(langJS('global_error'), 'Upload Server Error: '+response.error.message);
                    }
                },
                Error: function(up, err) {
                    APP.showMessage(langJS('global_error'), langJS('global_server_available'));
                    //hide_loading();
                }
            }
        });
        uploader_job.init();
    };

    var createBlindDialog = function(order, job_data){
        $('#blind_dialog').dialog({
            title: langJS('global_blind_job'),
            resizable: false,
            width:500,
            modal: true,
            buttons: [{
                    text:langJS('global_save'),
                    class: "button-blue",
                    click: function() {
                        if ($("#blind_form").validationEngine('validate')){
                            var serialdata = $('#blind_form').serializeArray();
                            crud_jsupdate('Orders/create_jobs',serialdata,function(data){
                                jobs_jtable.childTable.jtable('reload');
                                $('#blind_dialog').dialog( "close" );
                            },function (data){});
                        }
                    }
                },
                {
                    text:langJS('global_cancel'),
                    class: "button-orange",
                    click: function() {
                        $(this).dialog( "close" );
                    }
                },
            ],
            create: function(ev, ui) {
                $("#blind_form").validationEngine(validation_defaults());
            },
            open: function(ev, ui){
                if(job_data){

                }else{
                    $('#job_name').val('');
                    $('#job_status').val(0);
                    $('#job_quantity').val(1);
                    $('#job_estimate_time').val(0);                    
                }
                $('#job_order_id').val(order.record.id);
                $('#job_status').select2(APP.select2.select2_options_ajax('Jobs_status/sel2_status',{
                    allowClear: true,
                    cacheKEY:'sel2.status',
                }));

                $('#job_quantity').dspinner({
                    suffix: '',
                    step: 1,
                    places:0,
                    increment: 'fast',
                    allowNull: false,
                    min:1,
                    max:999999
                });

                $('#job_estimate_time').dspinner({
                    suffix: ' perc',
                    step: 1,
                    places:0,
                    increment: 'fast',
                    allowNull: false,
                    min:0,
                    max:999999
                });
            },
            close: function(){
                $('#blind_dialog').dialog("destroy");
            },
        });
    };

    var show_order_files = function(order_data){
        $('#orders_files').jtable({
            title: langJS('global_files'),
            messages:jtable_lang(),
            insertDialogWidth:'500',
            editDialogWidth:'500',
            dialogShowEffect:null,
            dialogHideEffect:null,
            paging: true,
            pageSize: 10,
            sorting: true,
            defaultSorting: 'ts desc',
            visibleDeleteRecordButton: false,
            actions: {
                    listAction:   'Orders/list_orders_files?order_id='+order_data.record.id,
                    deleteAction: 'Orders/delete_orders_files',
                },
            toolbar: {
                items: [
                { // upload button
                    cssClass: 'rbtn-green upload_file_order',
                    icon: 'fas fa-file-upload',
                    text: langJS('global_upload'),
                    tooltip: langJS('global_upload')
                },
            ]
            },
            fields: {
                id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                order_id: {
                    type: 'hidden',
                    create: true,
                    edit: true,
                    list: false,
                },
                name: {
                    width:'50%',
                    title: langJS('global_name'),
                    create: false,
                    edit: false,
                    list: true,
                    sorting: true
                },
                private:{
                    title: 'Privát fájl',
                    list: (params.price_right==1?true:false),
                    edit: true,
                    create: true,
                    sorting: false,
                    type: 'checkbox',
                    values: { '0': '', '1': '' },
                    listClass: 'text-center',
                    display:function(data){
                        return '<input type="checkbox" class="change_private" '+(data.record.private == 1?"checked":"")+' data-id="'+data.record.id+'" />';
                    }
                },
                ts: {
                    title: langJS('global_insert_date'),
                    list: true,
                    sorting: true,
                    display: function (data) {
                        return data.record.ts;
                    },
                    listClass:'text-right',
                },
                show_file:{
                    title: langJS('global_view'),
                    create: false,
                    edit: false,
                    list: true,
                    sorting:false,
                    width:'5%',
                    listClass:'text-center',
                    display: function(data){
                        var $btn = APP.jTable.createButton({icon:'fas fa-eye',classes:'rbtn-blue btn-view-file',title:langJS("global_view")});
                        $btn.off('click').on('click',function(){
                            window.open(data.record.file_url,'_blank');
                        });
                        return $btn;
                    }
                },
                deleteAppointment: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    listClass: "jtable-command-column",
                    display: function (data) {
                        var $btn = APP.jTable.createButton({icon:'fas fa-trash',classes: 'rbtn-red',title: langJS("global_delete")});
                            $btn.on('click',function () {
                                data.thisTable.jtable('showDeleteForm', data.record.id);
                            });
                        return $btn;
                    },
                }
            },
            recordsLoaded: function(event, data){
                $('#order-files-dialog').dialog({
                    title: langJS('global_files')+' - '+order_data.record.name,
                    resizable: false,
                    width:820,
                    modal: true,
                    buttons: [{
                            text:langJS('global_ok'),
                            class: "button-blue",
                            click: function() {

                                $('#order-files-dialog').dialog( "close" );
                            }
                        }
                    ],
                    create: function(ev, ui) {
                    },
                    open: function(ev, ui){
                        set_upload_button_order(order_data.record.id);
                    },
                    close: function(){
                        $('#order-files-dialog').dialog("destroy");
                    },
                });
            },
            recordDeleted: function(event, data){
            },
        });
        $('#orders_files').jtable('load');

    };

    var set_upload_button_order = function(order_id){
        $('.upload_file_order').attr('id', 'upload_file_order');
        if (uploader){
            uploader.destroy();
        }
        uploader = new plupload.Uploader({
            headers:{'dent-upload':'true'}, // this will generate HTTP_APP_UPLOAD headear in upload request
            runtimes : 'html5,html4',
            chunk_size: '2048kb',//2mb
            multipart:true,
            multipart_params:{/*csrf_token:APP.get_token(),*/idx:$(this).attr('data-id'), space: $(this).attr('data-space'), token: $(this).attr('data-token')},
            browse_button : 'upload_file_order',
            url :build_url('index.php/uploadr/Upload/upload_file'),
            filters : {
                max_file_size : '30Mb',
                mime_types: [
                    {title : "Images", extensions : "jpg,png,jpeg,bmp"},
                    {title : "Documents", extensions : "pdf,doc,docx,txt,xls,xlsx,step,STEP,dwg,DWG"},
                    {title : "Archives", extensions : "zip,rar"},
                ]
            },
            init: {
                FilesAdded: function(up, files) {
                    uploader.start();
                },
                FileUploaded:function(up, file, object){
                    var response = JSON.parse(object.response);
                    if (response.OK) {
                        crud_jsupdate('Orders/create_orders_file',{order_id: order_id, name: response.file.name}, function(retData){
                            $('#orders_files').jtable('reload');
                        });
                    } else {
                        APP.showMessage(langJS('global_error'), 'Upload Server Error: '+response.error.message);
                    }
                },
                Error: function(up, err) {
                    APP.showMessage(langJS('global_error'), langJS('global_server_available'));
                    //hide_loading();
                }
            }
        });
        uploader.init();
    };

    $('#orders_files').on("click",'.change_private', function(e){
        e.stopPropagation();
        var attrib = $(this).prop("checked");
        var rec_id = $(this).attr("data-id");
        var active = 0;
        if(attrib){ active = 1;}
        var params = {};
        params['id']	 	= rec_id;
        params['private'] 	= active;
        crud_jsupdate('Orders/change_order_file_private', params, nullFunction);
    });

    var show_order_po = function(order_data){
        $('#orders_po').jtable({
            title: langJS('global_po_upload'),
            messages:jtable_lang(),
            insertDialogWidth:'500',
            editDialogWidth:'500',
            dialogShowEffect:null,
            dialogHideEffect:null,
            paging: true,
            pageSize: 10,
            sorting: true,
            defaultSorting: 'ts desc',
            visibleDeleteRecordButton: false,
            actions: {
                    listAction:   'Orders/list_orders_po?order_id='+order_data.record.id,
                    deleteAction: 'Orders/delete_orders_po',
                },
            toolbar: {
                items: [
                { // upload button
                    cssClass: 'rbtn-green upload_po_order',
                    icon: 'fas fa-file-upload',
                    text: langJS('global_upload'),
                    tooltip: langJS('global_upload')
                },
            ]
            },
            fields: {
                id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                order_id: {
                    type: 'hidden',
                    create: true,
                    edit: true,
                    list: false,
                },
                name: {
                    width:'40%',
                    title: langJS('global_name'),
                    create: false,
                    edit: false,
                    list: true,
                    sorting: true
                },
                ts: {
                    title: langJS('global_insert_date'),
                    list: true,
                    sorting: true,
                    display: function (data) {
                        return data.record.ts;
                    },
                    listClass:'text-right',
                },
                down_file:{
                    title: langJS('global_download'),
                    create: false,
                    edit: false,
                    list: true,
                    sorting:false,
                    width:'5%',
                    listClass:'text-center',
                    display: function(data){
                        var $btn = APP.jTable.createButton({icon:'fas fa-download',classes:'rbtn-green btn-down-file',title:langJS("global_download")});
                        $btn.off('click').on('click',function(){
                            downloadFile(data.record.file_url, data.record.name);
                        });
                        return $btn;
                    }
                },
                show_file:{
                    title: langJS('global_view'),
                    create: false,
                    edit: false,
                    list: true,
                    sorting:false,
                    width:'5%',
                    listClass:'text-center',
                    display: function(data){
                        var $btn = APP.jTable.createButton({icon:'fas fa-eye',classes:'rbtn-blue btn-view-file',title:langJS("global_view")});
                        $btn.off('click').on('click',function(){
                            window.open(data.record.file_url,'_blank');
                        });
                        return $btn;
                    }
                },
                deleteAppointment: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    listClass: "jtable-command-column",
                    display: function (data) {
                        var $btn = APP.jTable.createButton({icon:'fas fa-trash',classes: 'rbtn-red',title: langJS("global_delete")});
                            $btn.on('click',function () {
                                data.thisTable.jtable('showDeleteForm', data.record.id);
                            });
                        return $btn;
                    },
                }
            },
            recordsLoaded: function(event, data){
                $('#order-po-dialog').dialog({
                    title: langJS('global_po')+' - '+order_data.record.name,
                    resizable: false,
                    width:820,
                    modal: true,
                    buttons: [{
                            text:langJS('global_ok'),
                            class: "button-blue",
                            click: function() {

                                $('#order-po-dialog').dialog( "close" );
                            }
                        }
                    ],
                    create: function(ev, ui) {
                    },
                    open: function(ev, ui){
                        set_upload_button_po_order(order_data.record.id, $(this));
                    },
                    close: function(){
                        $('#order-po-dialog').dialog("destroy");
                    },
                });
            },
            recordDeleted: function(event, data){
            }
        });
        $('#orders_po').jtable('load');

    };

    function downloadFile(file, name) {
        let element = document.createElement('a');
        element.setAttribute('href', file);
        element.setAttribute('download', name);
        document.body.appendChild(element);
        element.click();

        document.body.removeChild(element);
    }

    var set_upload_button_po_order = function(order_id, $dialog){
        $('.upload_po_order').attr('id', 'upload_po_order');
        if (uploader_po){
            uploader_po.destroy();
        }
        uploader_po = new plupload.Uploader({
            headers:{'dent-upload':'true'}, // this will generate HTTP_APP_UPLOAD headear in upload request
            runtimes : 'html5,html4',
            chunk_size: '2048kb',//2mb
            multipart:true,
            multipart_params:{/*csrf_token:APP.get_token(),*/idx:$(this).attr('data-id'), space: $(this).attr('data-space'), token: $(this).attr('data-token')},
            browse_button : 'upload_po_order',
            url :build_url('index.php/uploadr/Upload/upload_file'),
            filters : {
                max_file_size : '30Mb',
                mime_types: [
                    {title : "Images", extensions : "jpg,png,jpeg,bmp"},
                    {title : "Documents", extensions : "pdf,doc,docx,txt,xls,xlsx,step,STEP,dwg,DWG"},
                    {title : "Archives", extensions : "zip,rar"},
                ]
            },
            init: {
                FilesAdded: function(up, files) {
                    uploader_po.start();
                },
                FileUploaded:function(up, file, object){
                    var response = JSON.parse(object.response);
                    if (response.OK) {
                        crud_jsupdate('Orders/create_orders_po',{order_id: order_id, name: response.file.name}, function(retData){
                            $('#orders_po').jtable('reload');
                        });
                    } else {
                        APP.showMessage(langJS('global_error'), 'Upload Server Error: '+response.error.message);
                    }
                },
                Error: function(up, err) {
                    APP.showMessage(langJS('global_error'), langJS('global_server_available'));
                    //hide_loading();
                }
            }
        });
        uploader_po.init();
        if (uploader_w_po){
            uploader_w_po.destroy();
        }
        uploader_w_po =  new plupload.Uploader({
            browse_button: $dialog.find('#add_po_attachments_button')[0], // this can be an id of a DOM element or the DOM element itself
            url: build_url('index.php/uploadr/Upload/upload_file'),
            headers:{'app-upload':'true'}, // this will generate HTTP_APP_UPLOAD headear in upload request
            runtimes : 'html5,html4',
            container: $dialog.find('#add_po_attachments_container')[0], // ... or DOM Element itself
            drop_element : [$dialog.find('#add_po_attachments_container')[0]],
            chunk_size: '1024kb',
            multipart:true,
            //multipart_params:{},
            filters:{
                        max_file_size : '30Mb',
                        mime_types:
                            [
                            {title : "Image files", extensions : "jpg,jpeg,gif,png"},
                            {title : "Document files", extensions : "pdf,doc,docx,txt,xls,xlsx,step,STEP,dwg,DWG" },
                            {title : "Compressed files", extensions : "zip,rar" }
                            ]
                    },
            init:{
                PostInit: function(up, params) {
                    if (uploader_w_po.features.dragdrop) {
                        $.each(uploader_w_po.settings.drop_element, function(i,target){
                            target.ondragover = function(event) {
                                event.dataTransfer.dropEffect = "copy";
                            };
                            target.ondragenter = function() {
                                $dialog.find('#add_po_attachments_container').css('background-color','#98CF09 !important');
                            };
                            target.ondragleave = function() {
                                $dialog.find('#add_po_attachments_container').css('background-color','');
                            };
                            target.ondrop = function() {
                                $dialog.find('#add_po_attachments_container').css('background-color','');
                            };
                    });
                    }
                    /*if(options.files){
                        $.each(options.files, function( key, value ) {
                            uploader_w_po.addFile(options.files[key]);
                        });
                    }*/
                },
                //Populating file list
                FilesAdded: function(up, files) {
                    //$dialog.parent().find('button').each(function(){$(this).prop('disabled',true);});

                    $.each(files, function(i, file) {
                        $dialog.find('#po_attachments_list').append('<div class="addedAttachment" id="' + file.id + '">' + file.name +
                        '<a href="#" id="' + file.id + '" class="removeAttachment"> X</a>' + '</div>');
                        uploader_w_po.start();
                    });
                },
                //Creating unique file name
                /*BeforeUpload: function(up, file) {
                    var params = up.settings.multipart_params;
                    params.fileName = file.id + '.' + file.name.split('.').pop();
                },
                UploadComplete: function(up, files) {
                    $dialog.parent().find('button').each(function(){$(this).prop('disabled',false);});
                },
                //Deleting based on unique file name
                /*FilesRemoved: function(up, files){
                    $.each(files, function(i, file){
                        //console.log(file);
                        //var fileName = file.id + '.' + file.name.split('.').pop();
                        crud_jsupdate('uploadr/Upload/delete_file',{fileName: file.name},function(retData){
                        });
                    });
                },*/
                FileUploaded:function(up, file, object){
                    var response = JSON.parse(object.response);
                    if (response.OK) {
                        crud_jsupdate('Orders/create_orders_po',{order_id: order_id, name: response.file.name}, function(retData){
                            $('#'+file.id).remove();
                            $('#orders_po').jtable('reload');
                        });
                    } else {
                        APP.showMessage(langJS('global_error'), 'Upload Server Error: '+response.error.message);
                    }
                },
                //UploadError message
                Error: function(up, err) {
                    APP.showMessage(langJS('global_error'), err.message, langJS('global_ok'));
                }
            }
        });
        uploader_w_po.init();
        /*$dialog.find('#po_attachments_list').on('click', '.removeAttachment', function(e) {
            uploader_w_po.removeFile(uploader_w_po.getFile(this.id));
            $('#'+this.id).remove();
            e.preventDefault();
        });*/
    };

    var buildObs = function(data, prepend=false, elem) {
        $('#observation_container').html('');
        $.each(data, function(index, value) {
            if(elem){
                var $elem = elem;
                $elem.html('');
            }else{
                $elem = $('<div class="jumbotron" data_id="'+value.id+'"></div>');
            }
            var $iframe = $("<iframe style='width:100%;'></iframe>");
            $elem.data('id', value.id);
            var chtml = '<div class="left"><span class="quoting_obs_title">'+value.user_name+'</span> - <span class="quoting_obs_date">'+value.ts+'</span></div>'+
                '<div class="right">';
                    if(params.userid==value.rec_createdid || parseInt(params.admin,10)>=1){
                        chtml +='<button type="button" class="rbtn rbtn-red delete_orders_observations"  title="'+langJS('global_delete')+'"><i class="fas fa-trash"></i></button>';
                    }
                chtml +='</div>'+
                '<div class="clear"></div>'+
                '<div class="quoting_obs_content"></div>';
            var obs = value.observation;
            $elem.append(chtml);
            $iframe.appendTo($elem.find('.quoting_obs_content')).on('load',function(){
                $(this).contents().find('body').html(APP.utils.text.nl2br(obs));
                $(this).contents().find("body").css('height', 'fit-content');
                $(this).height( $(this).contents().find("body").height()+20 );
            });
            if(!elem){
                if(prepend){
                    $('#observation_container').prepend($elem);
                }else{
                    $('#observation_container').append($elem);
                }
            }
        });
    };

    var quoting_log = function($container, quoting){
        $container.jtable({
                title: langJS('global_log'),
                messages:jtable_lang(),
                insertDialogWidth:'500',
                editDialogWidth:'500',
                dialogShowEffect:null,
                dialogHideEffect:null,
                paging: true,
                pageSize: 10,
                sorting: true,
                defaultSorting: 'ts desc',
                visibleDeleteRecordButton: false,
                actions: {
                        listAction:   'Quoting/list_quoting_log?quoting_id='+quoting.quoting_id,
                    },
                fields: {
                        id: {
                            key: true,
                            create: false,
                            edit: false,
                            list: false
                        },
                        name: {
                            title: 'Felhasználó módosította',
                            width: '10%',
                            inputClass: 'validate[required, minSize[3]]',
                            listClass: 'text-bold',
                            display: function(data){
                                return data.record.user_name;
                            }
                        },
                        status: {
                            title: langJS('global_status_old'),
                            create: false,
                            edit: true,
                            list: true,
                            sorting: true,
                            inputClass: 'sel2-100 select2-done validate[required]',
                            containerClass : 'jtabledlg-w100proc',
                            display: function(data){
                                return '<div style="background-color:'+data.record.colour+'; padding: 2px;">'+(data.record.status?data.record.status_name:'')+'</div>';
                            }
                        },
                        status_new: {
                            title: langJS('global_status_new'),
                            create: false,
                            edit: true,
                            list: true,
                            sorting: true,
                            inputClass: 'sel2-100 select2-done validate[required]',
                            containerClass : 'jtabledlg-w100proc',
                            display: function(data){
                                return '<div style="background-color:'+data.record.status_new_colour+'; padding: 2px;">'+data.record.status_new_name+'</div>';
                            }
                        },
                        ts: {
                            title: 'Módosítás dátuma',
                            list: true,
                            sorting: true,
                            display: function (data) {
                                return data.record.ts;
                            },
                            listClass:'text-right',
                        },
                },
        });

        $container.jtable('load');
    };

    var ExportPdfInv = function(elem, filename, nwindow, record, nr, date){
        var margin_top = 37.8; //1cm margin top
        var margin_bottom = 100; //1.5 cm margin bottom
        var tm =  parseFloat(3/4*(margin_top-30)).toFixed(2); //convert px to pt
        var bm =  parseFloat(3/4*(margin_bottom-40)).toFixed(2); //convert px to pt
        var opt = {
            paperSize: "A4",
            //margin: { left: "1cm", top: "1cm", right: , bottom: "1.5cm" },
            margin: { left: "1cm", top: tm+"pt", right: "1cm", bottom: bm+"pt" },
            scale: 0.7,
            //height: 500,
            author:'',
            //template: '',
        };
        //console.log(elem.html());
        gpdf.drawing.drawDOM(elem, opt).then(function(pdfdata){
            return gpdf.drawing.exportPDF(pdfdata);
            //gpdf.drawing.pdf.saveAs(pdfdata, filename);//toBlob, toDataURL
            /*gpdf.drawing.exportPDF(pdfdata).done(function(data) {
                nwindow.close();
                showFile(b64toBlob(data.split('base64,')[1],'application/pdf'));
            });*/
        }).done(function(rdata) {
            //console.log(rdata);
            nwindow.close();
            crud_jsupdate('Orders/create_invoice',{id: record.id, filename: filename, data: rdata, record: record, nr, date}, function(retData){
                //$('#generate_invoice').prop('disabled', true);
                $('#donwload_invoice').attr('data-file', filename);
                $('#donwload_invoice').prop('disabled', false);
                $('#invoice_nr').val(parseFloat($('#invoice_nr').val())+1);
                params.invoice_nr = $('#invoice_nr').val();
                $('#orders').jtable('reload');
            });
            // 2. Send via AJAX
            /*$.ajax({
                type: "POST",
                url: "/Export/SavePdfToServer", // Your backend endpoint
                data: JSON.stringify({
                    docData: data,
                    fileName: "custom-path/file.pdf"
                }),
                contentType: "application/json; charset=utf-8",
                success: function(response) {
                    alert("File saved on server!");
                }
            });
            */
        });
    };

    var print_invoice = function(record, nr, date){
        var row_html = ""; 
        crud_jsupdate('Orders/list_jobs',{order_id: record.id}, function(retData){
            //var $container = $('<div id="my_pdf_doc"/>');
            var i=0;
            var total = 0;
            var row_html = '<div style="margin-top: 20px; display: inline-block; text-align: left; padding: 15px 5px 30px 5px; width:99.6%; border: 2px solid black;">'+
                '<table><tr><td style="width:39%; text-align:left; font-size:12px;">Supplier : LEVTECH SERVICE &<br/>'+
'PRODUCTIONSRL<br/>'+
'Tax Code : RO 35733217<br/>'+
'Reference number of the Trade Register : J19<br/>'+
'/134/2016<br/>'+
'Head-Office : STR. PRINCIPALA 1447/C , Lueta<br/>'+
'District : HARGHITA<br/>'+
'Account : RO39 RNCB 0152 1503 4944 0003<br/>'+
'(EUR) SWIFT CODE:RNCBROBUXXX<br/>'+
'Bank : BANCA COMERCIALA ROMANA<br/>'+
'Address: BUSINESS GARDEN BUCHAREST,<br/>'+
'BUILDINGA FLOOR 6, CALEA PLEVNEI 159,<br/>'+
'6THDISTRICT<br/>'+
'Share Capital : 200 RON<br/>'+
'Tel:0040758576007<br/>'+
'e-mail: office@levtech.ro<br/>'+
'www.levtech.ro</td>'+
                    '<td style="width:22%;"><div style="height:37.8px; background:white;"></div><img style="width:150px; margin-top: 10px;" src="'+base_url()+'images/logo.png"></td>'+
                    '<td style="width:39%; text-align:left; font-size:12px; vertical-align:top;">'+
'Buyer : '+(record.client_name?record.client_name:'')+'<br/>'+
'Tax Code : '+(record.regcode?record.regcode:'')+'<br/>'+
'Reference number of the Trade Register :'+'<br/>'+
'Head-Office : '+(record.head_office?record.head_office:'')+'<br/>'+
'District :<br/>'+
'Account :<br/>'+
'Bank : <br/>'+
(record.invoice_info?record.invoice_info:'')+
                    '</td></tr></table><div style="height: 10px; clear: both;"></div>'+
                    '<table style="width:100%;"><tr><td style="width:36%; text-align:left; font-size:10px;">&nbsp;</td>'+
                    '<td><table>'+
                    '<tr><td style="width:100%; text-align:center;" colspan="2"><b>Invoice<b></td></tr>'+
                    '<tr><td style="width:50%; text-align:left; font-size:10px;">SERIES :</td><td style="width:50%; text-align:right; font-size:10px;"><b>CNC</b></td></tr>'+
                    '<tr><td style="width:50%; text-align:left; font-size:10px;">INVOICE NO. :</td><td style="width:50%; text-align:right; font-size:10px;"><b>'+nr.toString().padStart(4, '0')+'</b></td></tr>'+
                    '<tr><td style="width:50%; text-align:left; font-size:10px;">DATE(dd/mm/yyyy) :</td><td style="width:50%; text-align:right; font-size:10px;"><b>'+moment(date).format('DD/MM/YYYY')+'</b></td></tr>'+
                    '</table></td>'+
                    '</table><div style="height: 20px; clear: both;"></div>'+
                    '<div><b>VAT Quote: 0%</b></div>'+
                '<table class="border_table"><tr><th style="width:8%;">Position</th><th colspan="2" style="width:39%;">Product or service name</th><th style="width:8%;">M.U.</th><th style="width:8%;">QTY</th><th style="width:15%;">Unit price<br/>-EUR-</th><th style="width:15%;">Value<br/>-EUR-</th><th style="width:15%;">VAT Value<br/>-EUR-</th></tr>'+
                '<tr class="no_visible"><th style="width:8%;"></th><th style="width:15%;"></th><th style="width:24%;"></th><th style="width:8%;"></th><th style="width:8%;"></th><th style="width:15%;"></th><th style="width:15%;"></th><th style="width:15%;"></th></tr>';
            $.each(retData.Records, function(r, rec) {
                i++;
                row_html = row_html + '<tr><td>'+i+'</td><td colspan="2" style="word-wrap: break-word; overflow-wrap: break-word;">Production of part '+rec.name+' according to PO '+record.name+'</td><td>PCS</td><td>'+rec.quantity+'</td><td>'+rec.unit_price+'</td><td>'+rec.total_value+'</td><td>0.00</td></tr>';
                total = total + parseFloat(rec.total_value);
                // row_html = row_html + '<div style="clear: both;"></div>';
            });
            i++;
            //Shiiping cost
            if(record.transport_cost>0){
                row_html = row_html + '<tr><td>'+i+'</td><td colspan="2">Transport</td><td>PCS</td><td>1</td><td>'+record.transport_cost+'</td><td>'+record.transport_cost+'</td><td>0.00</td></tr>';
                total = total + parseFloat(record.transport_cost);
                i++;
            }
            var lheight = 100;
            if(i<20){
                lheight = (20-i)*20;
            }
            //
            row_html = row_html + '<tr><td></td><td colspan="2" style="font-size:8px; height: '+lheight+'px; vertical-align: bottom; text-align: left;">Conform art. 319 alin. (29) din Legea nr. 227/2015 privind Codul Fiscal, factura este valabila fara semnatura si stampila<br/>Pana la plata integrala marfa ramane propria Levtech Service & Production SRL</td><td></td><td></td><td></td><td></td><td></td></tr>';

            row_html = row_html + '<tr><td colspan="2" rowspan="2" style="text-align:left;">Signature and seal of<br/> the supplier :</td><td style="text-align:left;" colspan="2" rowspan="2">Name of the Delegate :<br/><br/>ID of the Delegate :<br/>Signature :</td><td colspan="2" style="text-align:left; font-weight:bold;">TOTAL</td><td>'+parseFloat(total).toFixed(2)+'</td><td>0.00</td></tr>';
            row_html = row_html + '<tr><td colspan="2" style="text-align:left; font-weight:bold;">TOTAL AMOUNT</td><td colspan="2" style="font-weight:bold">'+parseFloat(total).toFixed(2)+' EUR</td></tr>';
            row_html = row_html + '</table></div>';
            
            row_html = row_html + '<div style="height: 10px; clear: both; text-align:right;">Term of the bill : '+moment(date).add(30, 'days').format('DD/MM/YYYY')+' </div>';
            //row_html = row_html + '<div style="height: 20px; clear: both;"></div><div>'+(record.description?(record.description).replace(/(?:\r\n|\r|\n)/g, '<br>'):'')+'</div>';

            //row_html = row_html + '<div style="height: 20px; clear: both;"></div><div>'+(record.po_comment?'Additional comment: '+APP.utils.text.nl2br(record.po_comment):'')+'</div>';
            
            //$container.append(row_html);
            var style = '<style>body{background:#fff;margin:0;padding:10px;line-height: 1.5;font-family:"DejaVu Sans", "Arial", sans-serif; font-size:12px;}'+
            '.bold{ font-weight: bold;}'+
            'table.border_table { border-top: 1px solid #000000; border-right: 1px solid #000000; border-spacing: 0px; font-size: 12px; width:100%; }'+
            'table.border_table td, table.border_table th{'+
                'text-align: center;'+
                'border-left: 1px solid #000000;'+
                'border-bottom: 1px solid #000000;'+
                'padding:3px;'+
            '}'+
            'table.border_table tr.no_visible th { padding:0px; border:none; }'+
            '</style>';
            var html = '<html>'+
                '<title>Printing</title><head>'+
                '<meta charset="UTF-8">'+
                '<meta http-equiv="content-type" content="text/html;charset=UTF-8" />'+
                '<meta http-equiv="cache-control" content="no-cache, must-revalidate" />'+
                '<meta http-equiv="pragma" content="no-cache" />'+
                '<meta http-equiv="expires" content="0" />'+
                '<meta http-equiv="X-UA-Compatible" content="IE=edge"/>'+
                '</head><body>'+
                '<link href="'+base_url()+'css/print_pdf.css" rel="stylesheet" type="text/css" />'+
                '<link href="'+base_url()+'css/js.gpdf/gpdf.fonts.css" rel="stylesheet" type="text/css" />'+style+row_html+'</body></html>';
            var newWin= window.open();
            //console.log(html);
            $(newWin.document.body).html(html);
            //console.log($(newWin.document.body).html());
            setTimeout(function(){
                ExportPdfInv($(newWin.document.body), 'F_CNC_'+nr.toString().padStart(4, '0')+'_'+record.client_name+'.pdf', newWin, record, nr, date);
            }, 50);
        });
    }
};