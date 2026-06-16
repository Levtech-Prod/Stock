var quoting_view = function(params){
    var uploader; 
    var uploader_part;
    //console.log(params);
    $('#quoting').jtable({
            title: langJS('global_quoting'),
            messages:jtable_lang({}),
            dialogShowEffect:null,
            dialogHideEffect:null,
            insertDialogWidth:'500',
            insertDialogHeight:'650',
            editDialogWidth:'980',
            editDialogHeight:'780',
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
                listAction:   'Quoting/list_quoting',
                createAction: 'Quoting/create_quoting',
                updateAction: 'Quoting/update_quoting',
                deleteAction: 'Quoting/delete_quoting'
            },
            fields: {
                parts: {
                    title: "",
                    create:false,
                    edit:false,
                    sorting:false,
                    width:'2%',
                    listClass: 'jtable-command-column',
                    display:function(partnerdata){
                        var $btn = APP.jTable.createButton({icon:'fas fa-list-alt',classes:'rbtn-orange open_parts',title:langJS("global_parts")});
                        $btn.click(function () {
                            quoting_parts($btn, partnerdata);
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
                name:{
                    title: langJS('global_client_quoting_num'),
                    list:true,
                    create:true,
                    edit:true,
                    sorting: false,
                    listClass: 'text-left',
                    //inputClass: 'validate[required, minSize[2]]',
                    width: '9%',
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
                    width: '8%',
                },
                part_number: {
                    title: langJS('global_job_number'),
                    create: false,
                    edit: false,
                    list: true,
                    sorting: false,
                    width: '4%',
                    listClass: 'text-right',
                },
                status: {
                    title: langJS('global_status'),
                    create: false,
                    edit: true,
                    list: true,
                    sorting: true,
                    inputClass: 'sel2-100 select2-done validate[required]',
                    containerClass : 'jtabledlg-w100proc',
                    display: function(data){
                        return '<div style="background-color:'+data.record.colour+'; padding: 2px;">'+data.record.status_name+'</div>';
                    }
                },
                start_date: {
                    title: langJS('global_start_date'),
                    width: '6%',
                    inputClass: 'validate[required]',
                    containerClass: 'jtabledlg-w50proc',
                    listClass: 'text-center',
                    sorting: true,
                    defaultValue: moment().format('YYYY-MM-DD'),
                },
                sent_date: {
                    title: langJS('global_sent_date'),
                    width: '6%',
                    //inputClass: 'validate[required]',
                    containerClass: 'jtabledlg-w50proc',
                    listClass: 'text-center',
                    sorting: true,
                },
                price: {
                    title: langJS('global_total_price'),
                    create: false,
                    edit: false,
                    list: true,
                    sorting: false,
                    width: '6%',
                    listClass: 'text-right',
                    inputClass: 'validate[required, min[0]]',
                    display: function(data){
                        return currency_format(parseFloat(data.record.price).toFixed(2));
                    }
                },
                total_material: {
                    title: langJS('global_total_material'),
                    width: '6%',
                    create: false,
                    edit: false,
                    sorting: false,
                    list: true,
                    containerClass : 'jtabledlg-w100proc',
                    display: function(data){
                        return currency_format(parseFloat(data.record.total_material_price).toFixed(2));
                    }
                },
                shipping_type: {
                    title: langJS('global_shipping_type'),
                    width: '6%',
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
                    width: '6%',
                    listClass: 'text-right',
                    inputClass: 'validate[required, min[0]]',
                    containerClass : 'jtabledlg-w50proc',
                    display: function(data){
                        return currency_format(parseFloat(data.record.transport_cost).toFixed(2));
                    }
                },
                wage: {
                    title: langJS('global_wage'),
                    create: true,
                    edit: false,
                    list: true,
                    sorting: false,
                    defaultValue:params.quoting,
                    width: '6%',
                    listClass: 'text-right',
                    inputClass: 'validate[required, min[1]]',
                    containerClass : 'jtabledlg-w50proc',
                    //type: 'hidden',
                    display: function(data){
                        return currency_format(parseFloat(data.record.wage).toFixed(2));
                    }
                },
                increase_percent: {
                    title: langJS('global_increase'),
                    create: false,
                    edit: true,
                    list: false,
                    width: '6%',
                    containerClass : 'jtabledlg-w50proc',
                },
                lead_time: {
                    title: langJS('global_lead_time'),
                    create: true,
                    edit: true,
                    list: false,
                    sorting: false,
                    width: '6%',
                    listClass: 'text-right',
                    inputClass: 'validate[required, min[0]]',
                    containerClass : 'jtabledlg-w50proc',
                    display: function(data){
                        return currency_format(parseFloat(data.record.lead_time).toFixed(2));
                    }
                },
                tot_price: {
                    title: langJS('global_tot_price'),
                    create: false,
                    edit: false,
                    list: true,
                    sorting: false,
                    width: '6%',
                    listClass: 'text-right',
                    display: function(data){
                        return currency_format((parseFloat(data.record.total_material_price)+parseFloat(data.record.price)+parseFloat(data.record.transport_cost)+parseFloat(data.record.total_post_price)).toFixed(2));
                    }
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
                    containerClass : 'jtabledlg-w100proc',
                    display: function(data){
                        return parseFloat(data.record.parcel_weight).toFixed(2);
                    }
                },
                description: {
                    title: langJS('global_observation'),
                    create: true,
                    edit: true,
                    list: true,
                    type: 'textarea',
                    width: '11%',
                    inputClass: 'height-y-45 resize-y-300',
                    containerClass : 'jtabledlg-w100proc',
                },
                po_comment: {
                    title: langJS('global_po_comment'),
                    create: true,
                    edit: true,
                    list: true,
                    type: 'textarea',
                    width: '9%',
                    inputClass: 'height-y-45 resize-y-300',
                    containerClass : 'jtabledlg-w100proc',
                    display: function(data){
                        return data.record.po_comment?APP.utils.text.nl2br(data.record.po_comment):'';
                    } 
                },
                ts:{
                    title: langJS('global_insert_date'),
                    list:true,
                    create:false,
                    edit:false,
                    width: '7%',
                    listClass: 'text-right',
                    display: function(data){
                        return data.record.ts;
                    }
                },
                print_parts:{
                    title: langJS('global_offer_download'),
                    create: false,
                    edit: false,
                    list: true,
                    sorting:false,
                    width:'2%',
                    listClass:'text-center',
                    display: function(data){
                        var $btn = APP.jTable.createButton({icon:'fas fa-file-alt',classes:'rbtn-orange btn-print',title:langJS("global_offer_download")});
                        $btn.off('click').on('click',function(){
                            print_record(data.record);                  
                        });
                        return $btn;
                    }
                },
                quoting_files:{
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
                            show_quoting_files(data);
                        });
                        return $btn;
                    }
                },
                copy_to_orders:{
                    title: langJS('global_copy_to_order'),
                    create: false,
                    edit: false,
                    list: true,
                    sorting:false,
                    width:'2%',
                    listClass:'text-center',
                    display: function(data){
                        if(!data.record.order_id){    
                            var $btn = APP.jTable.createButton({icon:'fas fa-copy',classes:'rbtn-green btn-copy',title:langJS("global_copy_to_order")});
                            $btn.off('click').on('click',function(){
                                crud_jsupdate('Quoting/copy_to_orders',{id: data.record.id}, function(retData){
                                    APP.showMessage("Konfirmálás","Másolás sikeres!");
                                    data.thisTable.jtable('reload');
                                });
                                
                            });
                            return $btn;
                        }else{
                            return '';
                        }
                    }
                },
                clone_quoting:{
                    title: langJS('global_duplicate'),
                    create: false,
                    edit: false,
                    list: true,
                    sorting:false,
                    width:'2%',
                    listClass:'text-center',
                    display: function(data){
                            var $btn = APP.jTable.createButton({icon:'fas fa-clone',classes:'rbtn-blue btn-clobe',title:langJS("global_duplicate")});
                            $btn.off('click').on('click',function(){
                                crud_jsupdate('Quoting/clone_quoting',{id: data.record.id}, function(retData){
                                    APP.showMessage("Konfirmálás","Duplikálás sikeres!");
                                    data.thisTable.jtable('reload');
                                });
                                
                            });
                            return $btn;
                    }
                }
            },
            recordsLoaded: function(event, data) {
                var touchtime = 0;
                $('.jtable-data-row').on('click', '.open_parts', function(ev) {
                    ev.stopPropagation();
                });

                $('.jtable-data-row').on('click', function(ev) {
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
            },
            formCreated: function (event, data) {
                var $dialog = data.form.parent();
                var $client_name = data.form.find('input[name="client_name"]');
                var $start_date	= data.form.find('input[name="start_date"]');
                var $sent_date	= data.form.find('input[name="sent_date"]');
                var $status = data.form.find('input[name="status"]');
                var $shipping_type = data.form.find('input[name="shipping_type"]');
                var $transport_cost = data.form.find('input[name="transport_cost"]');
                var $wage = data.form.find('input[name="wage"]');
                var $lead_time = data.form.find('input[name="lead_time"]');
                var $parcel_weight = data.form.find('input[name="parcel_weight"]');
                var $increase_percent = data.form.find('input[name="increase_percent"]');

                $transport_cost.dspinner({
                    suffix: APP.settings.currency,
                    step: 1,
                    places: 2,
                    increment: 'fast',
                    allowNull: false,
                    min:0,
                    max:999999
                });

                $wage.dspinner({
                    suffix: APP.settings.currency,
                    step: 1,
                    places: 2,
                    increment: 'fast',
                    allowNull: false,
                    min:0,
                    max:999999
                });

                $increase_percent.dspinner({
                    suffix: ' %',
                    step: 1,
                    places: 2,
                    increment: 'fast',
                    allowNull: false,
                    min:0,
                    max:999999
                });

                $lead_time.dspinner({
                    suffix: ' days',
                    step: 1,
                    places: 0,
                    increment: 'fast',
                    allowNull: false,
                    min:0,
                    max:999999
                });

                $start_date.datepicker(datepicker_defaults());
                $sent_date.datepicker(datepicker_defaults({minDate: new Date()}));
                
                $client_name.select2(APP.select2.select2_options_ajax('Quoting/sel2_clients',{
                    allowClear: true,
                    cacheKEY:'sel2.quoting_clients',
                    createSearchChoice:function(term, data) {
                        if ( $(data).filter( function() {
                          return this.name.localeCompare(term)===0;
                        }).length===0) {
                          return {id:term, name:term};
                        }
                      },
                }));
                /*
                if (data.formType=='edit'){
                    console.log($client_name.val());
                    $client_name.select2('val', $client_name.val()).trigger('change');
                }*/
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

                $status.select2(APP.select2.select2_options_ajax('Quoting/sel2_quoting_status',{
                    allowClear: true,
                    cacheKEY:'sel2.quoting_status',
                }));

                $shipping_type.select2(APP.select2.select2_options({
                    allowClear: false,
                    data:[{id:0,text:langJS('global_express')},{id:1,text:langJS('global_economy')}]
                }));

                /* quoting files */
                var $attach = $('<div id="attachment_div" class="dent-input-container w100-proc">'+
                            '<label for="">Csatolmányok</label>'+
                            '<div id="attachments_list"/>'+
                            '<div id="add_attachments_container">'+
                                '<div id="add_attachments_text">Húzza ide a fájlokat</div>'+
                                '<button type="button" id="add_attachments_button" class="button-blue">Fájlok kiválasztása</button>'+
                            '</div>'+
                        '</div>');

                

                if(data.formType=='edit'){
                    var $btgen = $('<div class="material_list_container" style="display: inline-block;">'+
                                    '<button type="button" class="button_recalc button-blue">Újra számol</button>'+
                                '</div>');
                    $increase_percent.parent().after($btgen);

                    $btgen.find('.button_recalc').on('click', function(){
                        crud_jsupdate('Quoting/recalc_parts',{quoting_id: data.record.id, percent: $increase_percent.val()}, function(retData){
                            $('#quoting').find('.jtable-child-table-container:visible').jtable('reload');
                            $increase_percent.dspinner('value', 0);
                        });
                    });

                    crud_jsupdate('Quoting/get_parcel_weight',{id: data.record.id}, function(rec){
                        if(rec){
                            $parcel_weight.dspinner('value', rec.weight);
                        }
                    });

                    var $log = $('<div id="quoting_log"></div>');
                    
                    var $quoting_obs = $('<div id="comments_div" class="dent-input-container w100-proc" style="float: right; width: 48%;">'+
                            '<label for=""><b>Észrevételek / Kommentek</label></b>'+
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
                
                    data.form.find('#quoting_log').remove();
                    data.form.parent().find('#comments_div').remove();
                    data.form.append($log);
                    data.form.parent().append($quoting_obs);
                    data.form.css("width", "50%");
                    data.form.css("float", "left");

                    var get_quoting_obs = function() {
                        crud_jsupdate('Quoting/get_observations', {quoting_id: data.record.id},
                            function(data) {
                                if (data.Records.length>0) {
                                    buildObs(data.Records);
                                }
                            }
                        );
                    };
                    get_quoting_obs();

                    let $field = $quoting_obs.find('#comment_field');
                    $quoting_obs.find('#add_comment_button').click(function() {
                        if($field.val()!=''){
                            crud_jsupdate('Quoting/create_quoting_observation',{quoting_id: data.record.id, observation: $field.val()}, function(retData){
                                $field.val('');
                                get_quoting_obs();
                            });
                        }
                    });

                    $quoting_obs.find('#observation_container').on('click', '.delete_quoting_observations', function(ev){
                        ev.preventDefault();
                        var elem = $(this).parent().parent();
                        var id = elem.data('id');
                        APP.showDlg(langJS('global_confirm'),langJS('global_confirm_text'),langJS('global_yes'),langJS('global_no'), function(){
                            crud_jsupdate('Quoting/delete_quoting_observation', {id:id}, function(ret){
                                elem.remove();
                            });
                        });
                    });

                    quoting_log($log, data.record);
                    
                }
            
                if (data.formType=='create'){
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

                return data.form.validationEngine('validate');
            },
            recordAdded: function (event, data) {
                APP.select2.cache_clear('sel2.quoting_clients');
                data.thisTable.jtable('reload');
            },
            recordUpdated: function (event, data){
                APP.select2.cache_clear('sel2.quoting_clients');
                data.thisTable.jtable('reload');
            },
            recordDeleted: function (event, data) {
                APP.select2.cache_clear('sel2.quoting_clients');
            },
            formClosed: function (event, data) {
                data.form.validationEngine('hide');
                data.form.validationEngine('detach');
            }
    });

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
                        chtml +='<button type="button" class="rbtn rbtn-red delete_quoting_observations"  title="'+langJS('global_delete')+'"><i class="fas fa-trash"></i></button>';
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
                        listAction:   'Quoting/list_quoting_log?quoting_id='+quoting.id,
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

    var ExportPdf = function(elem, filename, nwindow){
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
            template: '<div class="page-template"><div class="pdf_header"><div style="height:'+margin_top+'px; background:white;"></div><img style="width:150px;" src="'+base_url()+'images/logo.png"></div><div class="pdf_footer"><div style="height:'+margin_bottom+'px; background:white;">'+'<table style="width:100%;"><tr><td style="width:35%; text-align:left; font-size:10px;">Headquarter:<br/>'+
                        'Levtech Service & Production SRL<br/>'+
                        'Romania<br/>'+
                        'Harghita County<br/>'+
                        'Lueta 1447/C<br/>'+
                        '537140</td>'+
                    '<td style="width:35%; text-align:center; font-size:10px;">'+
                        'Tel: 00470758576007<br/>'+
                        'E-mail: office@levtech.ro<br/>'+
                        'Web: www.levtech.ro'+
                    '</td>'+
                    '<td style="width:30%; text-align:center; font-size:10px;">'+
                        'Bank: Banca Comerciala Romana<br/>'+
                        'EUR: RO39 RNCB 0152 1503 4944 0003<br/>'+
                        'RON: RO93 RNCB 0152 1503 4944 0001<br/>'+
                        'SWIFT: RNCBROBU'+
                    '</td>'+
                    '</tr></table>'+
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

    var b64toBlob = function(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    };

    var showFile = function(blob, type){
        type = type ? type : "application/pdf";
        // It is necessary to create a new blob object with mime-type explicitly set otherwise only Chrome works like it should
        var newBlob = new Blob([blob], {type: type});
        // Create a link pointing to the ObjectURL containing the blob.
        const data = window.URL.createObjectURL(newBlob);
        var lnk = document.createElement('a');
        lnk.href = data;
        //lnk.download="file.pdf";
        lnk.target = '_blank';
        document.body.appendChild(lnk);
        lnk.click();
        lnk.remove();
        // For Firefox it is necessary to delay revoking the ObjectURL
        setTimeout(function(){ window.URL.revokeObjectURL(data); }, 100);
    };

    var print_record = function(record){
        var row_html = ""; 
        crud_jsupdate('Quoting/list_parts',{quoting_id: record.id}, function(retData){
            //var $container = $('<div id="my_pdf_doc"/>');
            var i=0;
            var total = 0;
            var row_html = '<div style="display: inline-block; text-align: center; padding: 120px 10px 10px 0px; width:100%;">'+
                '<table><tr><td style="width:64%; text-align:left; font-size:12px; font-weight:bold;">Buyer: '+record.client_name+'<br/>Company registration : '+(record.regcode?record.regcode:'')+'<br/>Head-Office : '+(record.head_office?record.head_office:'')+'</td>'+
                    '<td style="width:36%; text-align:center; font-size:12px; font-weight:bolder;">LEVTECH SERVICE & PRODUCTION SRL<br/><span style="font-size:10px;">Tax Code : RO 35733217<br/>Head-office : Lueta, no.1447/C, HR County</span></td></tr></table><div style="height: 40px; clear: both;"></div>'+
                    '<table style="width:100%;"><tr><td style="width:40%; text-align:left; font-size:10px;">&nbsp;</td>'+
                    '<td style="width:30%; text-align:left; font-size:10px;"><b>Offer no. : &nbsp;'+record.id+'<b></td>'+
                    '<td style="width:30%; text-align:left; font-size:10px;"><b>Date:</b> &nbsp;&nbsp;&nbsp;'+record.start_date+'</td>'+
                    '</tr></table><div style="height: 40px; clear: both;"></div>'+
                '<table class="border_table"><tr><th style="width:4%;">Pos.</th><th style="width:46%;">Model/Drawing no.</th><th style="width:10%;">Unit</th><th style="width:10%;">Qty.</th><th style="width:20%;">Unit price (EUR)</th><th style="width:25%;">Net value (EUR)</th></tr>';
            $.each(retData.Records, function(r, rec) {
                i++;
                row_html = row_html + '<tr><td>'+i+'</td><td style="word-wrap: break-word; overflow-wrap: break-word;">'+rec.name+'</td><td>pcs</td><td>'+rec.quantity+'</td><td>'+(rec.total_price/rec.quantity).toFixed(2)+' &euro;</td><td>'+rec.total_price+' &euro;</td></tr>';
                total = total + parseFloat(rec.total_price);
                // row_html = row_html + '<div style="clear: both;"></div>';
            });
            //Shiiping cost
            row_html = row_html + '<tr><td></td><td>Shipping cost</td><td>pcs</td><td>1</td><td>'+record.transport_cost+' &euro;</td><td>'+record.transport_cost+' &euro;</td></tr>';
            total = total + parseFloat(record.transport_cost);
            //
            row_html = row_html + '<tr><td></td><td></td><td colspan="3" style="text-align:left; font-weight:bold;">TOTAL</td><td style="font-weight:bold">'+parseFloat(total).toFixed(2)+' &euro;</td></tr>';
            row_html = row_html + '</table></div>';
            
            row_html = row_html + '<div style="height: 40px; clear: both;"></div><div>Lead time: '+(record.lead_time?record.lead_time:'0')+' business days after purchase order received</div>';
            //row_html = row_html + '<div style="height: 20px; clear: both;"></div><div>'+(record.description?(record.description).replace(/(?:\r\n|\r|\n)/g, '<br>'):'')+'</div>';

            row_html = row_html + '<div style="height: 20px; clear: both;"></div><div>'+(record.po_comment?'Additional comment: '+APP.utils.text.nl2br(record.po_comment):'')+'</div>';
            
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
                ExportPdf($(newWin.document.body), record.client_name+' offer_'+record.id+' _ '+record.start_date.replaceAll("-", '. ')+'.pdf', newWin);
            }, 50);
            
            /*
            let opt = {
                paperSize: "A4",
                margin: { left: "0cm", top: "0.5cm", right: "0cm", bottom: "1cm" }, //left and right margin put to 0 because pdf margin is not the same as chrome print preview (LORI)
                scale: 0.7,
                multiPage: true,
                forcePageBreak: ".pagebreak",
                //avoidLinks:true,
            };

            var margin_top = 37.8; //1cm margin top
            var margin_bottom = 56.7; //1.5 cm margin bottom
            $(page).find('.sterilization_label_table').css('zoom',1);

            draw.exportPDF(group).done(function(data) {
                if(loadCallback){
                    loadCallback(data);
                }else{
                    if(pdf_browser){
                        showFile(b64toBlob(data.split('base64,')[1],'application/pdf'));
                    }else{
                        gpdf.saveAs({
                            dataURI: data,
                            fileName: filename
                        });
                    }
                    $(elem).find('.medfile-header').show();
                    $(elem).find('.header_information').show();
                    $(elem).find('.prn-footer').show();
                }
            });
            */
            //newWin.print();
            //newWin.close();
        });
    }

    $('#quoting-filter').dfilter({
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
                createOptions:APP.select2.select2_options_ajax('Quoting/sel2_clients',{
                    allowClear: true,
                    cacheKEY:'sel2.quoting_clients',
                })
            },
            {
                name:"filter_search",
                label: langJS('global_quoting')+' ('+langJS('global_name')+')',
                type:"text",
                visible:true,
                disabled:false,
                icons:["search","clear"],
                value:'',
            },
            {
                name:"filter_part_search",
                label: langJS('global_part')+' ('+langJS('global_name')+')',
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
                createOptions:APP.select2.select2_options_ajax('Quoting/sel2_quoting_status',{
                    allowClear: true,
                    cacheKEY:'sel2.quoting_status',
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
                name:    "sent_date",
                label:   langJS('global_sent_date'),
                type:    "dateinterval",
                visible: true,
                disabled: false,
                icons:["search","clear","today"],
                width:'320px',
                createOptions:datepicker_defaults(),
            },
            ],
        onChange:function($form){
            var serialized = $form.serializeArray();
            $('#quoting').jtable('load', serialized);
        }
    });

    var quoting_parts = function($img, quotingdata){
        $('#quoting').jtable(
            'toggleChildTable',
            $img.closest('tr'),
            $img.closest('td'),
            {
                title: langJS('global_parts')+' - '+quotingdata.record.name,
                messages:jtable_lang(),
                insertDialogWidth:'900',
                editDialogWidth:'900',
                dialogShowEffect:null,
                dialogHideEffect:null,
                paging: false, //Enable paging
                sorting: true, //Enable sorting
                defaultSorting: 'ts asc', //Set default sorting
                actions: {
                        listAction:   'Quoting/list_parts?quoting_id='+quotingdata.record.id+'&filter_part_search='+$('.dinput[name=filter_part_search]').val(),
                        createAction: 'Quoting/create_parts',
                        updateAction: 'Quoting/update_parts',
                        deleteAction: 'Quoting/delete_parts',
                    },
                fields: {
                        id: {
                            key: true,
                            create: false,
                            edit: false,
                            list: false
                        },
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
                        pdf:{
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
                        quoting_id: {
                            type:'hidden',
                            defaultValue:quotingdata.record.id,
                        },
                        name: {
                            title: langJS('global_name'),
                            width: '10%',
                            inputClass: 'validate[required, minSize[3]]',
                            listClass: 'text-bold',
                            display: function(data){
                                return data.record.id+' - '+data.record.name;
                            }
                        },
                        show_image: {
                            create: false,
                            edit: false,
                            list: true,
                            title: langJS('global_image'),
                            width: '7%',
                            display: function(data){
                                return '<a><img style="width:100%" src="'+base_url()+(data.record.image?'upload/quoting_images/'+data.record.image:'images/image_not_available.png')+'?'+ new Date().getTime()+'"></img>';
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
                        unique_wage: {
                            title: langJS('global_wage'),
                            create: true,
                            edit: true,
                            list: false,
                            sorting: false,
                            width: '7%',
                            listClass: 'text-right',
                            inputClass: 'validate[required, min[1]]',
                            containerClass : 'jtabledlg-w50proc',
                            defaultValue: quotingdata.record.wage,
                            display: function(data){
                                return currency_format(parseFloat((data.record.unique_wage?data.record.unique_wage:quotingdata.record.wage)).toFixed(2));
                            }
                        },
                        surface: {
                            title: langJS('global_surface'),
                            create: true,
                            edit: true,
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
                            create: true,
                            edit: true,
                            list: true,
                            sorting: false,
                            width: '8%',
                            listClass: 'text-right',
                            inputClass: 'validate[required, min[0]]',
                            containerClass : 'jtabledlg-w50proc',
                            display: function(data){
                                return currency_format(data.record.post_price);
                            }
                        },
                        total: {
                            title: langJS('global_total_material_price'),
                            width: '10%',
                            create: true,
                            edit: true,
                            sorting: false,
                            list: true,
                            containerClass : 'jtabledlg-w100proc',
                            display: function(data){
                                return currency_format(parseFloat(data.record.quantity*data.record.material_price).toFixed(2));
                            }
                        },
                        price: {
                            title: langJS('global_work_price'),
                            create: true,
                            edit: true,
                            list: true,
                            sorting: false,
                            width: '8%',
                            listClass: 'text-right',
                            inputClass: 'validate[required, min[0]]',
                            defaultValue: quotingdata.record.wage,
                            display: function(data){
                                return currency_format(data.record.price);
                            }
                        },
                        wage: {
                            title: langJS('global_work_time'),
                            create: true,
                            edit: true,
                            list: true,
                            sorting: false,
                            width: '8%',
                            listClass: 'text-right',
                            inputClass: 'validate[required, min[0]]',
                            defaultValue: '0',
                            display: function(data){
                                return data.record.wage+' '+langJS('global_minute');
                            }
                        },
                        weight: {
                            title: langJS('global_weight_um'),
                            create: true,
                            edit: true,
                            list: false,
                            sorting: false,
                            width: '8%',
                            listClass: 'text-right',
                            inputClass: 'validate[required, min[0]]',
                            defaultValue: '0',
                            display: function(data){
                                return data.record.weight+' '+langJS('global_minute');
                            }
                        },
                        total_price: {
                            title: langJS('global_total_price'),
                            create: false,
                            edit: false,
                            list: true,
                            sorting: false,
                            width: '8%',
                            listClass: 'text-right',
                            inputClass: 'validate[required, min[0]]',
                            display: function(data){
                                return currency_format(parseFloat(data.record.tot_price).toFixed(2));
                            }
                        },
                        tot_price_sum: {
                            title: langJS('global_total_sum'),
                            create: false,
                            edit: false,
                            list: true,
                            sorting: false,
                            width: '8%',
                            listClass: 'text-right',
                            inputClass: 'validate[required, min[0]]',
                            display: function(data){
                                return currency_format(parseFloat(data.record.total_price).toFixed(2));
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
                                return data.record.material_name + (data.record.material_code?' - '+data.record.material_code+'':"");
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
                                return data.record.cylinder==1?(data.record.length+' x '+data.record.diameter+' mm (henger)'):(data.record.height+' x '+data.record.width+' x '+data.record.length+' mm');
                            }
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
                            containerClass: 'jtabledlg-w100proc'
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
                            containerClass : 'jtabledlg-w33proc',
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
                        est_time: {
                            title: langJS('global_est_time'),
                            width: '10%',
                            create: false,
                            edit: false,
                            list: true,
                            sorting: false,
                            containerClass : 'jtabledlg-w100proc',
                            display: function(data){
                                let quantity = parseFloat(data.record.quantity);
                                let totalMinutes = (quantity*parseFloat(data.record.wage)).toFixed(2);
                                let hours = Math.floor(totalMinutes / 60);
                                let minutes = totalMinutes % 60;
                                return isNaN(quantity)?" - ":(hours+" óra "+minutes.toFixed(0)+" perc");
                            }
                        },
                        handling: {
                            title: langJS('global_handling'),
                            create: true,
                            edit: true,
                            list: false,
                            width: '13%',
                            inputClass: 'sel2-100 select2-done resize-y-300 height-y-45',
                            containerClass : 'jtabledlg-w100proc',
                        },
                        description: {
                            title: langJS('global_observation'),
                            create: true,
                            edit: true,
                            list: false,
                            type: 'textarea',
                            width: '13%',
                            containerClass : 'jtabledlg-w100proc',
                            inputClass: 'resize-y-300',
                        },
                        /*ts:{
                            title: langJS('global_insert_date'),
                            list:true,
                            create:false,
                            edit:false,
                            width: '10%',
                            listClass: 'text-right',
                            display: function(data){
                                return data.record.ts;
                            }
                        },*/
                        pdf_show:{
                            title: 'Pdf',
                            create: false,
                            edit: false,
                            list: true,
                            sorting:false,
                            width:'2%',
                            listClass:'text-center',
                            display: function(data){
                                if(data.record.pdf){
                                    var $btn = APP.jTable.createButton({icon:'fas fa-file-pdf',classes:'rbtn-orange btn-view-pdf',title:langJS("global_view")});
                                    $btn.off('click').on('click',function(){
                                        window.open(data.record.pdf_url+'?'+ new Date().getTime(),'_blank');
                                    });
                                    return $btn;
                                }else{
                                    return "";
                                }
                            }
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
                                var $btn = APP.jTable.createButton({icon:'fas fa-cube',classes:'rbtn-red btn-plus',title:'3D fájl'});
                                $btn.off('click').on('click',function(){
                                    fileShowDialog(data.record.stp_url, data.record.stp);
                                });
                                return $btn;
                            }
                        },
                        image_show:{
                            title: langJS('global_image'),
                            create: false,
                            edit: false,
                            list: true,
                            sorting:false,
                            width:'2%',
                            listClass:'text-center',
                            display: function(data){
                                var $btn = APP.jTable.createButton({icon:'fas fa-eye',classes:'rbtn-green btn-view-image',title:langJS("global_view")});
                                $btn.off('click').on('click',function(){
                                    window.open(data.record.image_url+'?'+ new Date().getTime(),'_blank');
                                });
                                return $btn;
                            }
                        },
                        clone_part:{
                            title: langJS('global_duplicate'),
                            create: false,
                            edit: false,
                            list: true,
                            sorting:false,
                            width:'2%',
                            listClass:'text-center',
                            display: function(data){
                                    var $btn = APP.jTable.createButton({icon:'fas fa-clone',classes:'rbtn-blue btn-clobe',title:langJS("global_duplicate")});
                                    $btn.off('click').on('click',function(){
                                        crud_jsupdate('Quoting/clone_part',{id: data.record.id}, function(retData){
                                            APP.showMessage("Konfirmálás","Duplikálás sikeres!");
                                            data.thisTable.jtable('reload');
                                        });
                                        
                                    });
                                    return $btn;
                            }
                        }
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
                    var $wage = data.form.find('input[name="wage"]');
                    var $unique_wage = data.form.find('input[name="unique_wage"]');
                    var $post_price = data.form.find('input[name="post_price"]');
                    var $surface = data.form.find('input[name="surface"]');
                    var $weight = data.form.find('input[name="weight"]');
                    var $matuprice = data.form.find('input[name="material_unit_price"]');
                    var $matprice = data.form.find('input[name="material_price"]');
                    var $total = data.form.find('input[name="total"]');
                    var $handling = data.form.find('input[name="handling"]');
                    var $cylinder = data.form.find('input[name="cylinder"]');
                    var $diameter = data.form.find('input[name="diameter"]');

                    $total.dspinner({
                        suffix: APP.settings.currency+'/poz.',
                        step: 1,
                        places: 2,
                        increment: 'fast',
                        allowNull: false,
                        min:0,
                        max:999999
                    });

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

                    $unique_wage.dspinner({
                        suffix: APP.settings.currency,
                        step: 1,
                        places: 2,
                        increment: 'fast',
                        allowNull: false,
                        min:0,
                        max:999999
                    }).off('change.dchange').on('change.dchange', function(){
                        let wprice = ((parseFloat($wage.val())/60)*parseFloat($unique_wage.val())).toFixed(2);
                        $price.val(parseFloat(wprice).toFixed(2));
                    });

                    $total.prop('readonly', true);
                    $post_price.prop('readonly', true);

                    $matuprice.dspinner({
                        suffix: APP.settings.currency+'/kg',
                        step: 1,
                        places: 2,
                        increment: 'fast',
                        allowNull: false,
                        min:0,
                        max:999999
                    }).off('change.dchange').on('change.dchange', function(){
                        calc_material_prices($materialid, $width, $length, $height, $diameter,$quantity, $matprice, $matuprice, $total, 0, $cylinder);
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
                        calc_material_prices($materialid, $width, $length, $height, $diameter,$quantity, $matprice, $matuprice, $total, 0, $cylinder);
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
                        calc_material_prices($materialid, $width, $length, $height, $diameter,$quantity, $matprice, $matuprice, $total, 0, $cylinder);
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
                        calc_material_prices($materialid, $width, $length, $height, $diameter,$quantity, $matprice, $matuprice, $total, 0, $cylinder);
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
                        calc_material_prices($materialid, $width, $length, $height, $diameter,$quantity, $matprice, $matuprice, $total, 0, $cylinder);
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
                        calc_material_prices($materialid, $width, $length, $height, $diameter,$quantity, $matprice, $matuprice, $total, 0, $cylinder);
                    });
    
                    $materialid.select2(APP.select2.select2_options_ajax('Stock/sel2_materials',{
                        allowClear: true,
                        cacheKEY:'sel2.materials',
                    })).on('change',function(){
                        $matuprice.dspinner('value', $materialid.select2('data').price?$materialid.select2('data').price:0);
                        calc_material_prices($materialid, $width, $length, $height, $diameter,$quantity, $matprice, $matuprice, $total, 0, $cylinder);
                    });

                    $status.select2(APP.select2.select2_options_ajax('parts_status/sel2_status',{
                        allowClear: true,
                        cacheKEY:'sel2.status',
                    }));

                    $handling.select2(APP.select2.select2_options_ajax('Jobs/sel2_handlings',{
                        allowClear: true,
                        multiple: true,
                        data_url_mutiple: "Jobs/sel2_init_handlings",
                        //cacheKEY:'sel2.quoting_handlings',
                        createSearchChoice:function(term, data) {
                            if ( $(data).filter( function() {
                                return this.name.localeCompare(term)===0;
                            }).length===0) {
                                return {id:term, name:term};
                            }
                        },
                    }));

                    $wage.dspinner({
                        suffix: ' '+langJS('global_minute'),
                        step: 1,
                        places: 0,
                        increment: 'fast',
                        allowNull: false,
                        min:0,
                        max:999999,
                    }).off('change.dchange').on('change.dchange', function(){
                        let wprice = ((parseFloat($wage.val())/60)*parseFloat($unique_wage.val())).toFixed(2);
                        $price.val(parseFloat(wprice).toFixed(2));
                        /*let price = parseFloat($price.val());
                        let quantity = parseFloat($quantity.val());
                        $total.dspinner('value', parseFloat(price*quantity).toFixed(2));*/
                    });

                    $price.dspinner({
                        suffix: APP.settings.currency,
                        step: 1,
                        places: 2,
                        increment: 'fast',
                        allowNull: false,
                        min:0,
                        max:999999
                    }).off('change.dchange').on('change.dchange', function(){
                        let wminutes = (parseFloat($price.val())/parseFloat($unique_wage.val())).toFixed(2)*60;
                        $wage.val(parseFloat(wminutes).toFixed(2));
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
                        calc_material_prices($materialid, $width, $length, $height, $diameter,$quantity, $matprice, $matuprice, $total, 0, $cylinder);
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

                    $matprice.prop('readonly', true);

                    var $attach = $('<div id="attachment_div" class="dent-input-container" style="float:right; width: 48%;">'+
                            '<label for="">3D fájl</label>'+
                            '<div id="attachments_list"/>'+
                            '<div id="add_attachments_container">'+
                                '<div id="add_attachments_text">Húzza ide a fájlokat</div>'+
                                '<button type="button" id="add_attachments_button" class="button-blue">Fájlok kiválasztása</button>'+
                            '</div>'+
                        '</div>');
                    
                    var $pdf_attach = $('<div id="pdf_attachment_div" class="dent-input-container" style="float:right; width: 48%;">'+
                        '<label for="">Pdf fájl</label>'+
                        '<div id="pdf_attachments_list"/>'+
                        '<div id="pdf_add_attachments_container">'+
                            '<div id="pdf_add_attachments_text">Húzza ide a fájlt</div>'+
                            '<button type="button" id="pdf_add_attachments_button" class="button-blue">Fájlok kiválasztása</button>'+
                        '</div>'+
                    '</div>');

                    var $img_attach = $('<div id="image_upload_div" style="float:right; width: 48%; margin-top:20px">'+
                            '<label for="">Kép</label>'+
                            '<div class="uploaded_intern_img" style="height:auto;"><img src="'+base_url()+'images/image_not_available.png" style="width: 100%; height: 100%;" id="snapshot_img" /></div>'+
                        '</div>');

                    
                
                    //if (data.formType=='create'){
                        data.form.parent().find('#attachment_div').remove();
                        data.form.parent().find('#pdf_attachment_div').remove();
                        data.form.parent().find('#image_upload_div').remove();
                        data.form.parent().find('.file_warning').remove();
                        data.form.parent().append($attach);
                        data.form.parent().append($pdf_attach);
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
                                            {title : "Document files", extensions : "step,STEP,stp,STP" },
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
                                    var stp_file = data.record.stp;
                                    if(stp_file){
                                        $attach.find('#attachments_list').append('<div class="addedAttachment"><a href="'+base_url()+'upload/quoting_images/'+stp_file+'" target="_blank" download>'+stp_file+'</a>' + '</div>');
                                    }
                                    /*if(options.files){
                                        $.each(options.files, function( key, value ) {
                                            uploader.addFile(options.files[key]);
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
                                            $attach.find('#attachments_list').append('<div class="addedAttachment" id="' + file.id + '">' + file.name +
                                                '<a href="#" id="' + file.id + '" class="removeAttachment"> X</a>' + '</div>');
                                            uploader.start();
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
                        uploader.init();
                        $attach.find('#attachments_list').on('click', '.removeAttachment', function(e) {
                            uploader.removeFile(uploader.getFile(this.id));
                            $('#'+this.id).remove();
                            e.preventDefault();
                        });

                        //pdf upload
                        pdf_uploader =  new plupload.Uploader({
                            browse_button: $pdf_attach.find('#pdf_add_attachments_button')[0], // this can be an id of a DOM element or the DOM element itself
                            url: build_url('index.php/uploadr/Upload/upload_file'),
                            headers:{'app-upload':'true'}, // this will generate HTTP_APP_UPLOAD headear in upload request
                            runtimes : 'html5,html4',
                            container: $pdf_attach.find('#pdf_add_attachments_container')[0], // ... or DOM Element itself
                            drop_element : [$pdf_attach.find('#pdf_add_attachments_container')[0]],
                            chunk_size: '1024kb',
                            multipart:true,
                            multipart_params:{},
                            filters:{
                                        max_file_size : '30Mb',
                                        mime_types:
                                            [
                                            {title : "Document files", extensions : "pdf" },
                                            ]
                                    },
                            init:{
                                PostInit: function(up, params) {
                                    if (pdf_uploader.features.dragdrop) {
                                        $.each(pdf_uploader.settings.drop_element, function(i,target){
                                            target.ondragover = function(event) {
                                                event.dataTransfer.dropEffect = "copy";
                                            };
                                            target.ondragenter = function() {
                                                $pdf_attach.find('#pdf_add_attachments_container').css('background-color','#98CF09 !important');
                                            };
                                            target.ondragleave = function() {
                                                $pdf_attach.find('#pdf_add_attachments_container').css('background-color','');
                                            };
                                            target.ondrop = function() {
                                                $pdf_attach.find('#pdf_add_attachments_container').css('background-color','');
                                            };
                                    });
                                    }
                                    var pdf_file = data.record.pdf;
                                    if(pdf_file){
                                        $pdf_attach.find('#pdf_attachments_list').append('<div class="addedAttachment"><a href="'+base_url()+'upload/quoting_images/'+pdf_file+'" target="_blank">'+pdf_file+'</a>' + '</div>');
                                    }
                                    
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
                                            $pdf_attach.find('#pdf_attachments_list').append('<div class="addedAttachment" id="' + file.id + '">' + file.name +
                                                '<a href="#" id="' + file.id + '" class="removeAttachment"> X</a>' + '</div>');
                                            pdf_uploader.start();
                                        });
                                    }
                                },
                                FileUploaded:function(up, file, object){
                                    var response = JSON.parse(object.response);
                                    if (response.OK) {
                                        //APP.showMessage(langJS('global_success'), 'File imported successfully.');
                                        data.form.find('input[name=pdf]').val(file.name);
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
                        pdf_uploader.init();
                        $pdf_attach.find('#pdf_attachments_list').on('click', '.removeAttachment', function(e) {
                            pdf_uploader.removeFile(pdf_uploader.getFile(this.id));
                            $('#'+this.id).remove();
                            e.preventDefault();
                        });

                    //}

                    if (data.formType=='edit'){
                        calc_material_prices($materialid, $width, $length, $height, $diameter,$quantity, $matprice, $matuprice, $total, data.record.density, $cylinder);
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
                    //APP.select2.cache_clear('sel2.quoting_handlings');
                    data.thisTable.jtable('reload');
                },
                recordUpdated: function (event, data){
                    APP.select2.cache_clear('sel2.stock');
                    //APP.select2.cache_clear('sel2.quoting_handlings');
                    data.thisTable.jtable('reload');
                },
                recordDeleted: function (event, data) {
                    APP.select2.cache_clear('sel2.stock');
                    //APP.select2.cache_clear('sel2.quoting_handlings');
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
                },
                rowInserted: function(event, data){
                    if (parseFloat(data.record.wage)==0){
                        data.row.addClass('qpart_color');
                    }
                },
            },
            function (data){
                try{
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
                        let size = OV.SubCoord3D(boundingBox.max, boundingBox.min);
                        $form.find('input[name="height"]').val(parseFloat(size.x).toFixed(2));
                        $form.find('input[name="width"]').val(parseFloat(size.y).toFixed(2));
                        $form.find('input[name="length"]').val(parseFloat(size.z).toFixed(2));
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

    function calc_material_prices($materialid, $width, $length, $height, $diameter,$quantity, $matprice, $matuprice, $total, mat_density=0, $cylinder=0){
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
        let price = parseFloat($matuprice.val());
        let width = parseFloat($width.val());
        let length = parseFloat($length.val());
        let height = parseFloat($height.val());
        let diameter = parseFloat($diameter.val());
        let quantity = parseFloat($quantity.val());
        let weight = 0;
        if($cylinder.prop('checked')){
            weight = Math.pow((diameter/1000)/2, 2)*Math.PI*(length/1000)*(density);
        }else{
            weight = (length/1000)*(width/1000)*(height/1000)*(density);
        }
        //console.log(weight);
        $matprice.dspinner('value', parseFloat(weight*price).toFixed(2));
        $total.dspinner('value', parseFloat(weight*price*quantity).toFixed(2));
    }

    var show_quoting_files = function(quoting_data){
        $('#quoting_files').jtable({
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
                    listAction:   'Quoting/list_quoting_files?quoting_id='+quoting_data.record.id,
                    deleteAction: 'Quoting/delete_quoting_files',
                },
            toolbar: {
                items: [
                { // upload button
                    cssClass: 'rbtn-green upload_file_quoting',
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
                quoting_id: {
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
                $('#quoting-files-dialog').dialog({
                    title: langJS('global_files')+' - '+quoting_data.record.name,
                    resizable: false,
                    width:820,
                    modal: true,
                    buttons: [{
                            text:langJS('global_ok'),
                            class: "button-blue",
                            click: function() {

                                $('#quoting-files-dialog').dialog( "close" );
                            }
                        }
                    ],
                    create: function(ev, ui) {
                    },
                    open: function(ev, ui){
                        set_upload_button_quoting(quoting_data.record.id);
                    },
                    close: function(){
                        $('#quoting-files-dialog').dialog("destroy");
                    },
                });
            },
            recordDeleted: function(event, data){
            }
        });
        $('#quoting_files').jtable('load');

    };

    var set_upload_button_quoting = function(quoting_id){
        $('.upload_file_quoting').attr('id', 'upload_file_quoting');
        if (uploader){
            uploader.destroy();
        }
        uploader = new plupload.Uploader({
            headers:{'dent-upload':'true'}, // this will generate HTTP_APP_UPLOAD headear in upload request
            runtimes : 'html5,html4',
            chunk_size: '2048kb',//2mb
            multipart:true,
            multipart_params:{/*csrf_token:APP.get_token(),*/idx:$(this).attr('data-id'), space: $(this).attr('data-space'), token: $(this).attr('data-token')},
            browse_button : 'upload_file_quoting',
            url :build_url('index.php/uploadr/Upload/upload_file'),
            filters : {
                max_file_size : '30Mb',
                mime_types: [
                    {title : "Images", extensions : "jpg,png,jpeg,bmp"},
                    {title : "Documents", extensions : "pdf,doc,docx,txt,xls,xlsx,step,STEP,dwg,DWG,igs,IGS"},
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
                        crud_jsupdate('Quoting/create_quoting_file',{quoting_id: quoting_id, name: response.file.name}, function(retData){
                            $('#quoting_files').jtable('reload');
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

};