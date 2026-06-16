var statistics_view = function(params){
    $('#statistics').jtable({
            title: langJS('global_statistics'),
            messages:jtable_lang(),
            insertDialogWidth:'900',
            editDialogWidth:'450',
            dialogShowEffect:null,
            dialogHideEffect:null,
            paging: true, //Enable paging
            pageSize: 15,
            sorting: true, //Enable sorting
            defaultSorting: 'end_date asc', //Set default sorting
            actions: {
                    listAction:  'Statistics/list_statistics',
                },
            fields: {
                    id: {
                        key: true,
                        create: false,
                        edit: false,
                        list: false
                    },
                    name: {
                        title: langJS('global_name'),
                        width: '9%',
                        inputClass: 'validate[required, minSize[3]]',
                        listClass: 'text-bold',
                        display: function(data){
                            return data.record.id+' - '+data.record.name;
                        }
                    },
                    status: {
                        title: langJS('global_status'),
                        create: false,
                        edit: true,
                        list: true,
                        sorting: true,
                        width: '7%',
                        inputClass: 'sel2-100 select2-done validate[required]',
                        containerClass : 'jtabledlg-w100proc',
                        display: function(data){
                            return '<div style="background-color:'+data.record.colour+'; padding: 2px; color: white;">'+data.record.status_name+'</div>';
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
                    quantity:{
                        title: langJS('global_quantity'),
                        create: true,
                        edit: true,
                        list: true,
                        sorting: true,
                        sortField:'j.quantity',
                        width: '4%',
                        listClass: 'text-center',
                        inputClass: 'validate[required]',
                        containerClass : 'jtabledlg-w100proc',
                        defaultValue: '1',
                        display: function(data){
                            return '<b>'+data.record.quantity+'<b>';
                        }
                    },
                    work_names:{
                        title: langJS('global_work_name'),
                        list: true,
                        width: '8%',
                        display: function(data){
                            return (data.record.work_names?data.record.work_names:'');
                        }
                    },
                    price: {
                        title: langJS('global_price'),
                        create: (params.price_right==1?true:false),
                        edit: (params.price_right==1?true:false),
                        list: (params.price_right==1?true:false),
                        sorting: false,
                        width: '6%',
                        listClass: 'text-right',
                        inputClass: 'validate[required, min[0]]',
                        display: function(data){
                            return currency_format(data.record.price);
                        }
                    },
                    total_price: {
                        title: langJS('global_total_price'),
                        create: false,
                        edit: false,
                        list: (params.price_right==1?true:false),
                        sorting: false,
                        width: '7%',
                        listClass: 'text-right',
                        inputClass: 'validate[required, min[0]]',
                        display: function(data){
                            return currency_format((parseFloat(data.record.price)*parseFloat(data.record.quantity)).toFixed(2));
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
                        width: '8%',
                        display: function(data){
                            return data.record.material_name + (data.record.material_code?' - '+data.record.material_code+'':"");
                        }
                    },
                    size: {
                        title: langJS('global_size'),
                        width: '8%',
                        create: false,
                        edit: false,
                        list: true,
                        sortField:'j.height',
                        display: function(data){
                            return data.record.cylinder==1?(data.record.length+' x '+data.record.diameter+' mm (henger)'):(data.record.height+' x '+data.record.width+' x '+data.record.length+' mm');
                        }
                    },
                    material_ordered:  {
                        title: langJS('global_material_ordered'),
                        width: '9%',
                        type: 'checkbox',
                        create: true,
                        list: false,
                        edit:true,
                        values: { '0': '', '1': '' },
                        containerClass: 'jtabledlg-w100proc'
                    },
                    height:{
                        title: langJS('global_height'),
                        create: true,
                        edit: true,
                        list: false,
                        sorting: true,
                        sortField:'j.height',
                        width: '9%',
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
                        sortField:'j.width',
                        width: '9%',
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
                        sorting: true,
                        sortField:'j.length',
                        width: '9%',
                        listClass: 'text-right',
                        inputClass: 'validate[required]',
                        containerClass : 'jtabledlg-w33proc',
                        display: function(data){
                            return data.record.length+' '+constJS('UNIT');
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
                        width: '7%',
                        create: true,
                        edit: true,
                        list: (params.price_right==1?true:false),
                        containerClass : 'jtabledlg-w100proc',
                        display: function(data){
                            return currency_format(parseFloat(data.record.total).toFixed(2));
                        }
                    },
                    /*working_minutes:{
                        title: 'Idő',
                        width: '8%',
                        create: true,
                        edit: true,
                        list: (params.price_right==1?true:false),
                        containerClass : 'jtabledlg-w100proc',
                        display: function(data){
                            return data.record.working_minutes+' perc';
                        }
                    },*/
                    total_hour: {
                        title: langJS('global_total_hour'),
                        width: '7%',
                        create: true,
                        edit: true,
                        list: (params.price_right==1?true:false),
                        containerClass : 'jtabledlg-w100proc',
                        display: function(data){
                            //let tot_price = (data.record.price-data.record.material_price)*parseFloat(data.record.quantity);
                            //return (parseInt(data.record.working_minutes)>0?currency_format(parseFloat(tot_price/(data.record.working_minutes/60)).toFixed(2)):currency_format(0))+"/óra";
                            return (parseInt(data.record.total_hour)>0?currency_format(parseFloat(data.record.total_hour).toFixed(2)):currency_format(0))+"/óra";
                        }
                    },
                    description: {
                        title: langJS('global_description'),
                        create: true,
                        edit: true,
                        list: false,
                        type: 'textarea',
                        width: '9%',
                        containerClass : 'jtabledlg-w100proc',
                        inputClass: 'resize-y-300',
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
                            let tot_price = (data.record.price-data.record.material_price)*parseFloat(data.record.quantity);
                            let totalMinutes = ((tot_price/parseFloat(params.wage)).toFixed(2)*60);
                            let hours = Math.floor(totalMinutes / 60);
                            let minutes = totalMinutes % 60;
                            return isNaN(tot_price)?" - ":(hours+" óra "+minutes.toFixed(0)+" perc");
                            //+parseFloat(data.record.qc_time)
                        }
                    },
                    working_minutes_hour:{
                        title: 'Valós gyártási idő',
                        width: '7%',
                        create: false,
                        edit: false,
                        list: true,
                        containerClass : 'jtabledlg-w100proc',
                        display: function(data){
                            let totalMinutes = parseFloat(data.record.working_minutes);
                            let hours = Math.floor(totalMinutes / 60);
                            let minutes = totalMinutes % 60;
                            return isNaN(totalMinutes)?" - ":(hours+" óra "+minutes.toFixed(0)+" perc");
                        }
                    },
                    comments:{
                        title: langJS('global_comments'),
                        width: '9%',
                        edit: false,
                        create: false,
                        display: function (data) {
                            return '<textarea class="comment_edit" style="width: 100%;" rec_id="'+data.record.id+'">'+(data.record.comments?data.record.comments:'')+'</textarea>';
                        },
                    },
                    end_date:{
                        title: langJS('global_end_date'),
                        list:true,
                        create:false,
                        edit:false,
                        width: '8%',
                        listClass: 'text-right',
                        display: function(data){
                            return data.record.end_date;
                        }
                    }
            },
            recordsLoaded: function(event, data){
                var touchtime = 0;
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
                            //data.thisTable.jtable('showEditForm', row_id);
                            jobDialog(row_id);
                            touchtime = 0;
                        } else {
                            // not a double click so set as a new first click
                            touchtime = new Date().getTime();
                        }
                    }
                });
            },
            rowInserted: function(event, data){
                if (parseFloat(data.record.working_minutes)>1320){
                    data.row.addClass('night_color');
                }
            },
    });

    $('#statistics').on("change",'.comment_edit', function(e){
        var rec_id = $(this).attr("rec_id");
        var params = {};
        params['id']	 	= rec_id;
        params['comments'] 	= $(this).val();
        crud_jsupdate('Jobs/save_comment', params, function(rd){
        });
    });

    var startOfWeek 		= moment().startOf('isoWeek').format('YYYY-MM-DD');
    var endOfWeek 			= moment(startOfWeek).endOf('isoWeek').format('YYYY-MM-DD');

    $('#range').select2(APP.select2.select2_options({
        allowClear: false,
        data: [{id:'0', value: 'Nap'}, {id:'1', value:'Hét'}, {id:'2', value:'Hónap'}]
    })).on('change',function(){
        var serialized = $('#statistics-filter').dfilter('serializeArray');
        serialized.push({'name':'range', 'value':$('#range').select2('val')});
        show_statistics(serialized);
    });

    $('#statistics-filter').dfilter({
        messages:APP.dfilter.messages(),
        title:langJS('global_filter'),
        opened:true,
        triggerChangeOnLoad:true,
        boxes:[
            {
                name:'filter_order',
                label:langJS('global_order'),
                type:'select2',
                sel2DisplayData:'text',
                createOptions:APP.select2.select2_options_ajax('Statistics/sel2_orders',{
                    allowClear: true,
                    cacheKEY:'sel2.orders',
                })
            },
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
                label:langJS('global_name')+', '+langJS('global_description'),
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
                name:    "start_date",
                label:   langJS('global_end_date'),
                type:    "dateinterval",
                visible: true,
                disabled: false,
                icons:["search","clear","today"],
                width:'320px',
                value:[startOfWeek,endOfWeek],
                createOptions:datepicker_defaults(),
            },
            ],
        onChange:function($form){
            var serialized = $form.serializeArray();
            $('#statistics').jtable('load', serialized);
            serialized.push({'name':'range', 'value':$('#range').select2('val')});
            show_statistics(serialized);
            crud_jsupdate('Statistics/get_stat_total',serialized, function(retData){
                $('#stotal_quantity').html(parseFloat(retData.data.total_quantity).toFixed(2));
                $('#stotal_price').html(parseFloat(retData.data.total_price).toFixed(2));
                $('#stotal_mat_price').html(parseFloat(retData.data.total_mat_price).toFixed(2));

                let totalMinutes = parseFloat(retData.data.total_est_time);
                let hours = Math.floor(totalMinutes / 60);
                let minutes = totalMinutes % 60;
                $('#stotal_est_time').html(isNaN(totalMinutes)?" - ":(hours+" óra "+minutes.toFixed(0)+" perc"));
                
                let stotalMinutes = parseFloat(retData.data.total_working_minutes);
                let shours = Math.floor(stotalMinutes / 60);
                let sminutes = stotalMinutes % 60;
                $('#stotal_working_hour').html(isNaN(stotalMinutes)?" - ":(shours+" óra "+sminutes.toFixed(0)+" perc"));
            });
        }
    });

    var uploader; 
        
    var jobDialog = function(id){
        crud_jsupdate('Jobs/get_job',{id:id}, function(rec){
            var job = rec.job;
            var html =  '<div id="job_dialog">'+
            '<div class="dent-input-container w50-proc">'+
                '<div>Megrendelés: <span class="order_name"> '+job.order_id+'</span></div>'+
                '<div>Darab: <span class="job_name">'+job.name+'</span></div>'+
            '</div>'+
            '<div class="dent-input-container w50-proc">'+
                '<label for="change_status">'+langJS('global_status')+'</label>'+
                '<div class="dent-input">'+
                    '<input type="text" id="change_status" name="change_status" class="select2 w100-proc" value="'+job.status+'" />'+
                '</div>'+
            '</div>'+
            '<table class="ctable">'+
            '<tr>'+
                '<td class="dent-input-container w25-proc"><label>Mennyiség:</label></td>'+
                '<td class="dent-input-container w75-proc"><b>'+job.quantity+'</b></td>'+
            '</tr>'+
            '<tr>'+
                '<td class="dent-input-container w25-proc"><label>Anyag típus:</label></td>'+
                '<td class="dent-input-container w75-proc"><b>'+job.material_name+'</b></td>'+
            '</tr>'+
            '<tr>'+
                '<td class="dent-input-container w25-proc"><label>Anyag méret:&nbsp;</label></td>'+
                '<td class="dent-input-container w75-proc"><b>'+(job.cylinder==1?(job.length+' x '+job.diameter+' mm (henger)'):(job.height+' x ' + job.width + ' x ' + job.length))+'</b></td>'+
            '</tr>'+
            '<tr>'+
                '<td class="dent-input-container w100-proc" colspan="2"><label>Leírás:</label></td>'+
            '</tr>'+
            '<tr>'+
                '<td class="dent-input-container w100-proc" style="padding-left: 10px;" colspan="2">'+(job.description?job.description:'')+'</td>'+
            '</tr>'+
            '</table>'+
            '<div id="jobs_files" class="w100-proc"></div>'+
            '<div id="jobs_log" class="w100-proc"></div>';
            var $container 	= $("<div></div>").html(html);
            $('body').append($container);
            var $dialog = $container.dialog({
                title: 'Darab részletek',
                resizable: false,
                width:600,
                minHeight: 550,
                modal: true,
                autoOpen:true,
                buttons: [
                    {
                        text:langJS('global_ok'),class: "button-blue",click: function(){
                            $(this).dialog("close");
                        }
                    },
                ],
                create: function(ev, ui){
                    $container.find('#change_status').select2(APP.select2.select2_options_ajax('Jobs_status/sel2_status',{
                        allowClear: true,
                        cacheKEY:'sel2.status',
                    })).on('change', function(ev){
                        crud_jsupdate('Jobs/update_jobs',{id: job.id, status: $(this).val()}, function(retData){
                            var serialized = $('#board-filter').dfilter('serializeArray');
                            $('#statistics').jtable('reload');
                            $dialog.find('#jobs_log').jtable('reload');
                        });
                    });
                },
                open: function(ev, ui){
                    show_files($container, job);
                    set_upload_button($container, job.id);
                    jobs_log($container, job);
                },
                close: function(){
                    $(this).dialog("destroy").remove();
                },
            });
        });        
    };

    var show_files = function($dialog, job){
        $dialog.find('#jobs_files').jtable({
            title: langJS('global_files'),
            messages:jtable_lang(),
            insertDialogWidth:'700',
            editDialogWidth:'500',
            dialogShowEffect:null,
            dialogHideEffect:null,
            paging: true,
            pageSize: 10,
            sorting: true,
            defaultSorting: 'ts desc',
            visibleDeleteRecordButton: false,
            actions: {
                    listAction:   'Orders/list_jobs_files?job_id='+job.id,
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
            },
            recordDeleted: function(event, data){
            }
        });
        $dialog.find('#jobs_files').jtable('load');

    };

    var set_upload_button = function($dialog, job_id){
        //console.log(job_id);
        $('.upload_file').attr('id', 'upload_file');
        if (uploader){
            uploader.destroy();
        }
        uploader = new plupload.Uploader({
            headers:{'dent-upload':'true'}, // this will generate HTTP_DENT_UPLOAD headear in upload request
            runtimes : 'html5,html4',
            chunk_size: '2048kb',//2mb
            multipart:true,
            multipart_params:{/*csrf_token:APP.get_token(),*/idx:$(this).attr('data-id'), space: $(this).attr('data-space'), token: $(this).attr('data-token')},
            browse_button : 'upload_file',
            url : build_url('index.php/uploadr/Upload/upload_file'),
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
                        crud_jsupdate('Orders/create_jobs_file',{job_id: job_id, name: response.file.name}, function(retData){
                            $dialog.find('#jobs_files').jtable('reload');
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

    var jobs_log = function($dialog, job){
        $dialog.find('#jobs_log').jtable({
                title: 'Log',
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
                        listAction:   'Jobs/list_jobs_log?job_id='+job.id,
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
                                return '<div style="background-color:'+data.record.colour+'; padding: 2px; color: white;">'+(data.record.status?data.record.status_name:'')+'</div>';
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
                                return '<div style="background-color:'+data.record.status_new_colour+'; padding: 2px; color: white;">'+data.record.status_new_name+'</div>';
                            }
                        },
                        position: {
                            title: langJS('global_position_old'),
                            create: false,
                            edit: true,
                            list: true,
                            sorting: true,
                        },
                        position_new: {
                            title: langJS('global_position_new'),
                            create: false,
                            edit: true,
                            list: true,
                            sorting: true,
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

        $dialog.find('#jobs_log').jtable('load');
    };

    function show_statistics(serialized){
        /* charts */
        var data_for_chart = [];
        var data_for_chartm = [];
        var data_for_chartd = [];
        var range =$('#range').select2('val');
        var tickb = 'day';
        var mod = 'time';
        function formatter(val, axis) {
            return val.toFixed(0);
        }
        crud_jsupdate('Statistics/get_data', serialized, function(retData){
            var i;
            data_for_chart.length 		= 0;
            data_for_chartm.length      = 0;
            data_for_chartd.length = 0;
            let weekt = [];
            let weekd = [];
            let maxp = 1;
            for (i=0;i<retData.data.length;i++){
                //console.log(moment(retData.data[i].date));
                if(range==1){
                    data_for_chart.push([parseInt(retData.data[i].week_number), parseFloat(retData.data[i].total)]);
                    weekt.push(parseInt(retData.data[i].week_number));
                    data_for_chartd.push([parseInt(retData.data[i].week_number), parseFloat(retData.data[i].total-retData.datam[i].total)]);
                    weekd.push(parseInt(retData.data[i].week_number));
                }else{
                    data_for_chart.push([moment(retData.data[i].date).valueOf() + 7200000, parseFloat(retData.data[i].total)]);
                    data_for_chartd.push([moment(retData.data[i].date).valueOf() + 7200000, parseFloat(retData.data[i].total-retData.datam[i].total)]);
                }
                if(parseFloat(retData.data[i].total)>maxp){
                    maxp = parseFloat(retData.data[i].total);
                }
            }
            if(range!=1){
                data_for_chart.sort();
            }else{
                data_for_chart.sort(function(a, b) {
                    return a[0]-b[0];
                });
            }
            //weekt.sort();
            for (i=0;i<retData.datam.length;i++){
                if(range==1){
                    data_for_chartm.push([parseInt(retData.datam[i].week_number), parseFloat(retData.datam[i].total)]);
                    weekt.push(parseInt(retData.datam[i].week_number));
                }else{
                    data_for_chartm.push([moment(retData.datam[i].date).valueOf() + 7200000, parseFloat(retData.datam[i].total)]);
                }
            }
            if(range!=1){
                data_for_chartm.sort();
            }else{
                data_for_chartm.sort(function(a, b) {
                    return a[0]-b[0];
                });
            }
            if(range!=1){
                data_for_chartd.sort();
            }else{
                data_for_chartd.sort(function(a, b) {
                    return a[0]-b[0];
                });
            } 
            // console.log(maxp);
            //console.log(data_for_chart);
            var dataset = [
                { label: "Összeg", data: data_for_chart },
                { label: "Nyersanyag összeg", data: data_for_chartm}
            ];
            var dataset2 = [
                { label: "Nettó összeg", data: data_for_chartd },
            ];
            switch (range) {
                case '0':
                    tickb = 'day';
                    break;
                case '1':
                    mod = null;
                    tickb = weekt;
                    break;
                case '2':
                    tickb = 'month';
                  break;
            }     
            
            var plot_options = {
                series: {
                        points: {
                            show: true
                        },
                        lines: {
                            show: true,
                            fill: true
                        },
                    },
                xaxis: {
                    mode: mod,
                    tickLength: 5,
                    TickSize: [1, tickb],
                    minTickSize: [1, tickb],
                    ticks: (weekt.length==0?null:weekt),
                    tickFormatter: (weekt.length==0?null:formatter),
                },
                yaxis: {
                    tickDecimals: 0,
                    max:maxp
                },
                selection: {
                    mode: "x"
                },
                grid: {
                        hoverable: true,
                        //markings: weekendAreas,
                        borderWidth: 2,
                        borderColor : '#ddd',
                        backgroundColor: { colors: ["#ffffff", "#EDF5FF"] }
                    },
                legend: {
                    position: 'nw',
                    show: true,
                },
                colors: ["#59BDFF", "#007E33"]
            };

            var plot = $.plot($("#flot-placeholder"), dataset, plot_options);
            $("#flot-placeholder").unbind("plothover");
            $('#flot-placeholder').bind("plothover", function(event, pos, obj) {
                if (obj) {
                    $('#plot_holder_hover1').css({
                        position: 'absolute',
                        top: pos.pageY-90,
                        left: pos.pageX-50
                    });
                    var html = "<div style='font-weight:bold; background-color: #fff; color:" + obj.series.color + "'>" + currency_format(obj.datapoint[1]) +"</div>";
                    $("#plot_holder_hover1").html(html);
                    $('#plot_holder_hover1').removeClass('hidden');
                }else{
                    $('#plot_holder_hover1').addClass('hidden');
                }
            });

            let plot_options2 = $.extend(true, plot_options,{ colors: ["#FF7F7F"]})

            var plot2 = $.plot($("#flot-placeholder2"), dataset2, plot_options2);
            $("#flot-placeholder2").unbind("plothover");
            $('#flot-placeholder2').bind("plothover", function(event, pos, obj) {
                if (obj) {
                    $('#plot_holder_hover2').css({
                        position: 'absolute',
                        top: pos.pageY-90,
                        left: pos.pageX-50
                    });
                    var html = "<div style='font-weight:bold; background-color: #fff; color:" + obj.series.color + "'>" + currency_format(obj.datapoint[1]) +"</div>";
                    $("#plot_holder_hover2").html(html);
                    $('#plot_holder_hover2').removeClass('hidden');
                }else{
                    $('#plot_holder_hover2').addClass('hidden');
                }
            });

            
        });
    };

    $('#machine_using_filter').dfilter({
        messages:APP.dfilter.messages(),
        title:langJS('global_filter'),
        opened:true,
        triggerChangeOnLoad:true,
        boxes:[
            {
                name:    "date",
                label:   langJS('global_interval'),
                type:    "dateinterval",
                visible: true,
                disabled: false,
                icons:["search","today"],
                width:'320px',
                value:[startOfWeek,endOfWeek],
                createOptions:datepicker_defaults(),
            },
            ],
        onChange:function($form){
            var serialized = $form.serializeArray();
            load_using(serialized);
        }
    });

    function load_using(serialized){
        $('#machine_using').html('');
        crud_jsupdate('Statistics/getMachineUsing',serialized, function(retData){
            let statuses = retData.statuses;
            let data = retData.data;
            $('#machine_using').html(buildHTML(statuses, data));
        });
    }

    var buildHTML = function(statuses, data){
        var html = '';
        html = html +
        '<table id="machine_using_table" class="custom_table">'+
            '<thead>'+
                '<tr class="tr_header">'+
                    '<th style="background-color: gray;">'+langJS('global_date')+'</th>';
                    $.each(statuses,function(i,v){
                        html = html +
                            '<th align="center" style="max-width: 10%;">'+v.name+'</th>';
                    });
                    html = html + '<th align="center" style="background-color: gray;">'+langJS('global_total_using')+'</th>'+
                         '<th align="center" style="background-color: gray;">'+langJS('global_total_unusing')+'</th>'+
                  '</tr>'+
            '</thead>';
            $.each(data,function(i,v){
                let tot_min = 0;
                let tot_use_min = 0;
                html = html +
                '<tr>'+
                    '<td align="center" style="max-width: 10%;">'+i+'</td>';
                $.each(v,function(j,d){
                    let totalMinutes = 1440 - parseFloat(d.minutes);
                    tot_use_min = tot_use_min + parseFloat(d.minutes);
                    tot_min = tot_min + totalMinutes;
                    let hours = Math.floor(totalMinutes / 60);
                    let minutes = totalMinutes % 60;
                    html = html +
                        '<td align="center" style="max-width: 10%;">'+(hours+" óra "+minutes.toFixed(0)+" perc")+'</td>';
                });
                let uhours = Math.floor(tot_use_min / 60);
                let uminutes = tot_use_min % 60;

                let thours = Math.floor(tot_min / 60);
                let tminutes = tot_min % 60;
                html = html + '<td align="center">'+(uhours+" óra "+uminutes.toFixed(0)+" perc")+'</td><td align="center">'+(thours+" óra "+tminutes.toFixed(0)+" perc")+'</td>';
                    '</tr>';
            });
        html = html + '</table>';
        return html;
    };

    $('#qc_filter').dfilter({
        messages:APP.dfilter.messages(),
        title:langJS('global_filter'),
        opened:true,
        triggerChangeOnLoad:true,
        boxes:[
            {
                name:    "date",
                label:   langJS('global_interval'),
                type:    "dateinterval",
                visible: true,
                disabled: false,
                icons:["search","today"],
                width:'320px',
                value:[startOfWeek,endOfWeek],
                createOptions:datepicker_defaults(),
            },
            ],
        onChange:function($form){
            var serialized = $form.serializeArray();
            load_qc(serialized);
        }
    });

    function load_qc(serialized){
        $('#qc_using').html('');
        crud_jsupdate('Statistics/getQctypes',serialized, function(retData){
            let types = retData.types;
            let data = retData.data;
            $('#qc_using').html(buildQcHTML(types, data));
        });
    }

    var buildQcHTML = function(types, data){
        var html = '';
        html = html +
        '<table id="qc_using_table" class="custom_table">'+
            '<thead>'+
                '<tr class="tr_header">';
                    $.each(types,function(i,v){
                        html = html +
                            '<th align="center" style="max-width: 10%;">'+v.name+'</th>';
                    });
                  html = html +'</tr>'+
            '</thead>';
            html = html +
                '<tr>';
                    $.each(data,function(i,v){
                        html = html +
                            '<td align="center" style="max-width: 10%;">'+v+'</td>';
                    });
                 html = html +'</tr>';
        html = html + '</table>';
        return html;
    };

    
};