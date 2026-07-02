var board_view = function(params){
    var startOfWeek 		= moment().startOf('isoWeek').format('YYYY-MM-DD');
    var endOfWeek 			= moment(startOfWeek).endOf('isoWeek').format('YYYY-MM-DD');
    $('#board-filter').dfilter({
        messages:APP.dfilter.messages(),
        title:langJS('global_filter'),
        opened:true,
        triggerChangeOnLoad:true,
        boxes:[
            {
                name:"filter_search",
                label:langJS('global_name')+' (Projekt, Darab), Darab ID',
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
                /*value:[startOfWeek,endOfWeek],*/
                createOptions:datepicker_defaults(),
            },
            ],
        onChange:function($form){
            var serialized = $form.serializeArray();
            load_kanban(serialized);
            crud_jsupdate('Board/get_stat_total',serialized, function(retData){
                let stotalMinutes = parseFloat(retData.data.total_working_minutes);
                let shours = Math.floor(stotalMinutes / 60);
                let sminutes = stotalMinutes % 60;
                $('#stotal_working_hour').html(isNaN(stotalMinutes)?" - ":(shours+" óra "+sminutes.toFixed(0)+" perc"));
            });
        }
    });

    var loaded = 0;
    $('.dinput[name=filter_search]').on('keyup',function(){
        if (loaded == 0) {
            var serialized = $('#board-filter').dfilter('serializeArray');
            load_kanban(serialized);
        }
    });
    
    function load_kanban(serialized){
        loaded = 1;
        crud_jsupdate('Board/getBoard',serialized, function(retData){
            $('#kanban').html('');
            let statuses = retData.statuses;
            let jobs = retData.jobs;

            $('#kanban').kanban({
                titles: statuses,
                items: jobs,
                onChange: function(e,ui){
                },
                onReceive: function(e,ui){
                    var $sender = $(ui.sender);
                    var sm = $sender.attr('data-sm');
                    var m = $sender.attr('data-m');
                    var type = $sender.attr('data-type');

                    var tsm = $(e.target).attr('data-sm');
                    var tm = $(e.target).attr('data-m');
                    var that = $(this);
                    var id = $(ui.item).attr('data-id');
                        
                    function do_update(){
                        var status = $(e.target).attr('data-block');
                        var work_log_id = $(ui.item).attr('log-id');
                        var orders = $.map(that.find('div.cd_kanban_board_block_item'), function(el) {
                            return {id: $(el).attr('data-id'), position:  $(el).index()};
                        });
                        if(tsm==1){
                            APP.showMessage(langJS('global_message'),tm,langJS('global_ok'));
                        }
                        crud_jsupdate('Jobs/update_jobs_work',{id:id, status:status, work_log_id: work_log_id}, function(rd){
                            $(ui.item).attr('log-id', '');
                            $(ui.item).attr('data-status', status);
                            crud_jsupdate('Jobs/update_jobs_reorder', {'data':orders}, function(rd){
                                load_numbers();
                                load_est_time();
                            });
                        });
                    }
                    
                    let rstatus = $(e.target).attr('data-block');
                    let cs = $(ui.item).attr('data-status');
                    if(rstatus==-2 && cs==7){
                        APP.lateDialog(id, do_update);
                    }else if(type==2){
                        APP.qcDialog(id, do_update);
                    }else if(sm==2){
                        APP.showDlg(langJS('global_message'),m,langJS('global_yes'),langJS('global_no'), 
                            function(){
                                do_update();
                            },
                            function(){
                                $(".cd_kanban_board_block" ).sortable( "cancel" );
                            },
                        );
                    }else{
                        do_update();
                    }
                },
                onBeforeStop: function(e, ui) {
                    var status = $(e.target).attr('data-block');
                    var five_axis = $(ui.item).attr('data-five');
                    if(status==0 && five_axis==''){
                        e.preventDefault();
                        APP.showMessage(langJS('global_error'), langJS('global_five_warn'), langJS('global_ok'));
                    }
                },
                onStop: function(e, ui) {
                    var ts = $(e.target).attr('data-block');
                    var cs = $(ui.item).attr('data-status');
                    if(ts==cs){
                        var orders = $.map($(this).find('div.cd_kanban_board_block_item'), function(el) {
                            return {id: $(el).attr('data-id'), position:  $(el).index()};
                        });
                        crud_jsupdate('Jobs/update_jobs_reorder', {'data':orders}, function(rd){
                            load_numbers();
                            load_est_time();
                        });
                    }
                }
            });
            loaded = 0;
            load_numbers();
            load_est_time();
        });
    }

    function load_numbers(){
        $.each($('.cd_kanban_board_block'), function() {
            let id = $(this).attr('data-block');
            $('#block_'+id).html($(this).find('.cd_kanban_board_block_item').length);
            //console.log($(this).find('.cd_kanban_board_block_item').length);
        });
    }

    function load_est_time(){
        let total = 0;
        $.each($('.cd_kanban_board_block'), function() {
            let tot = 0;
            let cnt = 0;
            let type = $(this).attr('data-type');
            $.each($(this).find('.cd_kanban_board_block_item'), function() {
                let est_time = parseFloat($(this).attr('data-est'));
                tot = tot + est_time;
                cnt++;
                /*if(type==1 && cnt==1){
                    return false;
                }*/
            });
            let id = $(this).attr('data-block');
            let hours = Math.floor(tot / 60);
            let minutes = (tot % 60).toFixed(0).toString();
            $('#est_'+id).html(hours+':'+(minutes.length==1?'0'+minutes:minutes));
            total=total+tot;
        });
        let hours = Math.floor(total / 60);
        let minutes = (total % 60).toFixed(0).toString();
        $('#total_est').html(hours+' óra '+(minutes.length==1?'0'+minutes:minutes+' perc'));
    }

    /*$('#kanban').on('click', '.cd_kanban_board_block_item', function(){
        //console.log($(this).attr('data-id'));
        let id = $(this).attr('data-id');
        jobDialog(id);
    });
    */

    var touchtime = 0;
    $('#kanban').on('click', '.cd_kanban_board_block_item', function(){
        if (touchtime == 0) {
            // set first click
            touchtime = new Date().getTime();
        } else {
            // compare first click to this click and see if they occurred within double click threshold
            if (((new Date().getTime()) - touchtime) < 800) {
                // double click occurred
                let id = $(this).attr('data-id');
                jobDialog(id);
                touchtime = 0;
            } else {
                // not a double click so set as a new first click
                touchtime = new Date().getTime();
            }
        }
    });

    var uploader; 
        
    var jobDialog = function(id){
        crud_jsupdate('Jobs/get_job',{id:id}, function(rec){
            var get_job_obs = function() {
                crud_jsupdate('Board/get_observations', {job_id: id},
                    function(data) {
                        if (data.Records.length>0) {
                            buildObs(data.Records);
                        }
                    }
                );
            };
            var job = rec.job;
            let tot_price = (parseFloat(job.price)-parseFloat(job.material_price))*parseFloat(job.quantity);
            let totalMinutes = (tot_price/parseFloat(params.wage)).toFixed(2)*60;
            let hours = Math.floor(totalMinutes / 60);
            let minutes = totalMinutes % 60;
            let est_time = isNaN(tot_price)?" - ":(hours+" óra "+minutes.toFixed(0)+" perc");

            let totalMinutesw = parseFloat(job.working_minutes);
            hours = Math.floor(totalMinutesw / 60);
            minutes = totalMinutesw % 60;
            let work_time = isNaN(totalMinutesw)?" - ":(hours+" óra "+minutes.toFixed(0)+" perc");
            let ctime = Math.floor(totalMinutesw-totalMinutes);
            let order_txt = '';
            switch(job.material_type) {
                case '-1':
                    order_txt = langJS('global_undefined');
                    break;
                case '0':
                    order_txt = job.order_date?job.order_date:'';
                    break;
                case '1':
                    order_txt = 'Kuka';
                    break;
            }

            var html =  '<div id="job_dialog"><div id="main_data" style="float: left; width: 59%;">'+
            ((job.in_work==0 && job.type==1 && job.blind_job==0)?'<button type="button" class="button_start rbtn rbtn-sizevariable rbtn-green rbtn-highlight" style="height:35px; font-size:25px;">START</button>':'')+
            ((job.in_work==1 && job.type==1 && job.blind_job==0)?'<button type="button" class="button_stop rbtn rbtn-sizevariable rbtn-red rbtn-highlight" style="height:35px; font-size:25px;">STOP</button>':'')+
            '<div class="dent-input-container w50-proc">'+
                '<div>Megrendelés: <span class="order_name"> '+job.order_id+(job.alias?' - '+job.alias:'')+'</span></div>'+
                '<div>Darab: <span class="job_name">'+job.name+'</span></div>'+
                '<div class="dent-input-container w90-proc" style="margin-top:10px;">'+
                '<label for="five_axis">'+langJS('global_five_axis')+':</label>'+
                '<div class="dent-input">'+
                    '<input type="text" id="five_axis" name="five_axis" class="select2 w100-proc" value="'+(job.five_axis?job.five_axis:'')+'" />'+
                '</div>'+
            '</div>'+
            '</div>'+
            '<div class="dent-input-container w50-proc">'+
                '<label for="change_status">'+langJS('global_status')+'</label>'+
                '<div class="dent-input">'+
                    '<input type="text" id="change_status" name="change_status" class="select2 w100-proc" value="'+job.status+'" />'+
                '</div>'+
            '</div>'+
            '<table class="ctable">'+
            '<tr>'+
                '<td class="dent-input-container w40-proc"><label>Mennyiség:</label></td>'+
                '<td class="dent-input-container w60-proc"><b>'+job.quantity+'</b></td>'+
            '</tr>'+
            '<tr>'+
                '<td class="dent-input-container w40-proc"><label>Anyag típus:</label></td>'+
                '<td class="dent-input-container w40-proc"><b>'+job.material_name+'</b></td>'+
            '</tr>'+
            '<tr>'+
                '<td class="dent-input-container w40-proc"><label>Anyag méret:&nbsp;</label></td>'+
                '<td class="dent-input-container w60-proc"><b>'+(job.cylinder==1?(job.length+' x '+job.diameter+' mm (henger)'):(job.height+' x ' + job.width + ' x ' + job.length))+'</b></td>'+
            '</tr>'+
            '<tr>'+
                '<td class="dent-input-container w40-proc"><label>Anyag rendelve:&nbsp;</label></td>'+
                '<td class="dent-input-container w60-proc"><b>'+order_txt+'</b></td>'+
            '</tr>'+
            '<tr>'+
                '<td class="dent-input-container w100-proc" colspan="2"><label>Leírás:</label></td>'+
            '</tr>'+
            '<tr>'+
                '<td class="dent-input-container w100-proc" style="padding-left: 10px;" colspan="2">'+(job.description?job.description:'')+'</td>'+
            '</tr>'+
            '</table>'+
            '<div id="jobs_files" class="w100-proc"></div>'+
             '<div id="log-tab" class="dent-ui-tabs dent-noborder" style="margin-top:10px;">'+
                '<ul>'+
                    '<li><a href="#tab0">'+langJS('global_log')+'</a></li>'+
                    '<li><a href="#tab1">'+langJS('global_work_log')+'</a></li>'+
                '</ul>'+
                '<div id="tab0">'+
                    '<div id="jobs_log"></div>'+
                '</div>'+
                '<div id="tab1">'+
                    '<div id="jobs_work_log"></div>'+
                '</div>'+
            '</div>'+
            '</div>'+
            '<div id="comments_div" class="dent-input-container w100-proc" style="float: right; width: 40%;">'+
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
                '<div id="data_container" style="font-size:15px;">'+
                    '<div>Darab ID: <span class="data_name">'+job.id+'</span></div>'+
                    '<div>Becsült idő: <span class="data_name">'+est_time+'</span></div>'+
                    '<div>Valós gyártási idő: <span class="data_name">'+work_time+'</span></div>'+
                    '<div>Különbség: <span class="data_name">'+(isNaN(ctime)?" - ":ctime+" perc")+'</span></div>'+
                    '<div style="margin-top: 15px;"><b>'+langJS('global_material_received')+'</b>: <input type="checkbox" id="material_received" '+(job.material_received==1?'checked':'')+'/></div>'+
                '</div>'+
            '</div>';
            var $container 	= $("<div></div>").html(html);
            $('body').append($container);
            var tempScrollTop = $(window).scrollTop();
            var tempScrollLeft = $(window).scrollLeft();
            //console.log(tempScrollTop);       
            //console.log(tempScrollLeft);        
            var $dialog = $container.dialog({
                title: 'Darab részletek',
                resizable: false,
                width:980,
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
                    var stdata = {};
                    var tsm = 0;
                    var tm = '';
                        
                    $container.find('#change_status').select2(APP.select2.select2_options_ajax('Jobs_status/sel2_status',{
                        allowClear: true,
                        cacheKEY:'sel2.status',
                    })).on('change', function(ev){
                        var status = $(this).val();
                        function do_update(){
                            if(ev.added){
                                crud_jsupdate('Jobs/update_jobs',{id: job.id, status: status}, function(retData){
                                    if(ev.added.show_message==1){
                                        APP.showMessage(langJS('global_message'),ev.added.message,langJS('global_ok'));
                                    }
                                    
                                    var serialized = $('#board-filter').dfilter('serializeArray');
                                    load_kanban(serialized);
                                    $dialog.find('#jobs_log').jtable('reload');

                                    stdata = ev.added;
                                    tsm = stdata.show_message;
                                    tm = stdata.message;

                                });
                            }
                        };
                        if(ev.added){
                            if(status==-2 && stdata.id==7){
                                APP.lateDialog(id, do_update);
                            }else if(stdata.type==2){
                                APP.qcDialog(id, do_update);
                            }else if(tsm==2){
                                APP.showDlg(langJS('global_message'),tm,langJS('global_yes'),langJS('global_no'), 
                                    function(){
                                        do_update();
                                    },
                                    function(){
                                        $container.find('#change_status').select2('val',stdata.id);
                                    },
                                );
                            }else{
                                do_update();
                            
                            }
                            
                        }
                    }).on('select2-opening', function(){
                        stdata = $container.find('#change_status').select2('data');
                        tsm = stdata.show_message;
                        tm = stdata.message;
                    });

                    $container.find('#five_axis').select2(APP.select2.select2_options({
                        placeholder: langJS('global_not_selected'),
                        allowClear: true,
                        data: [{id:'1', value: langJS('global_yes')}, {id:'0', value:langJS('global_no')}]
                    })).on('change', function(ev){
                        crud_jsupdate('Jobs/update_jobs',{id: job.id, five_axis: $(this).val()}, function(retData){
                            var serialized = $('#board-filter').dfilter('serializeArray');
                            load_kanban(serialized);
                        });
                    });
                },
                open: function(ev, ui){
                    show_files($container, job);
                    set_upload_button($container, job.id);
                    jobs_log($container, job);
                    get_job_obs();
                    let $field = $(this).find('#comment_field');
                    $(this).find('#add_comment_button').click(function() {
                        if($field.val()!=''){
                            crud_jsupdate('Board/create_jobs_observation',{job_id: job.id, observation: $field.val()}, function(retData){
                                $field.val('');
                                get_job_obs();
                            });
                        }
                    });

                    $container.find("#log-tab" ).tabs({
                        create: function(event, ui){
                        },
                        activate: function(event, ui){
                            var tab = ui.newTab.index();
                            switch (parseInt(tab,10)){
                                case 0:
                                    jobs_log($container, job);
                                    break;
                                case 1:
                                    jobs_work_log($container, job);
                                    break;
                            }
                        },
                    });

                    $(this).find('#material_received').on('click', function() {
                        let material_received = $(this).prop('checked')?1:0;
                        crud_jsupdate('Jobs/update_jobs',{id: job.id, material_received: material_received}, function(retData){
                            var serialized = $('#board-filter').dfilter('serializeArray');
                            load_kanban(serialized);
                        });
                    });
                },
                close: function(){
                    $(this).dialog("destroy").remove();
                    $(window).scrollTop(tempScrollTop);
                    $(window).scrollLeft(tempScrollLeft);
                },
            });

            $dialog.find('#observation_container').on('click', '.delete_job_observations', function(ev){
                ev.preventDefault();
                var elem = $(this).parent().parent();
                var id = elem.data('id');
                APP.showDlg(langJS('global_confirm'),langJS('global_confirm_text'),langJS('global_yes'),langJS('global_no'), function(){
                    crud_jsupdate('Board/delete_jobs_observation', {id:id}, function(ret){
                        elem.remove();
                    });
                });
            });

            $dialog.find('.button_start').on('click', function(ev){
                crud_jsupdate('Board/start_job', {id:job.id, status: job.status}, function(ret){
                    $el = $(".cd_kanban_board_block_item[data-id='" + job.id +"']");
                    $el.attr('log-id', ret.log_id);
                    $el.find('.cd_kanban_board_block_item_footer').css('background-color', '#a6ffa6;');
                    $dialog.dialog("close");
                });
            });

            $dialog.find('.button_stop').on('click', function(ev){
                crud_jsupdate('Board/stop_job', {id:job.id, work_log_id: job.work_log_id}, function(ret){
                    $el = $(".cd_kanban_board_block_item[data-id='" + job.id +"']");
                    $el.attr('log-id', '');
                    $el.find('.cd_kanban_board_block_item_footer').css('background-color', 'unset');
                    $dialog.dialog("close");
                });
            });

            var buildObs = function(data, prepend=false, elem) {
                $dialog.find('#observation_container').html('');
                $.each(data, function(index, value) {
                    if(elem){
                        var $elem = elem;
                        $elem.html('');
                    }else{
                        $elem = $('<div class="jumbotron" data_id="'+value.id+'"></div>');
                    }
                    var $iframe = $("<iframe style='width:100%;'></iframe>");
                    $elem.data('id', value.id);
                    var chtml = '<div class="left"><span class="job_obs_title">'+value.user_name+'</span> - <span class="job_obs_date">'+value.ts+'</span></div>'+
                        '<div class="right">';
                            if(params.userid==value.rec_createdid || parseInt(params.admin,10)>=1){
                                chtml +='<button type="button" class="rbtn rbtn-red delete_job_observations"  title="'+langJS('global_delete')+'"><i class="fas fa-trash"></i></button>';
                            }
                        chtml +='</div>'+
                        '<div class="clear"></div>'+
                        '<div class="job_obs_content"></div>';
                    var obs = value.observation;
                    $elem.append(chtml);
                    $iframe.appendTo($elem.find('.job_obs_content')).on('load',function(){
                        $(this).contents().find('body').html(obs);
                        $(this).contents().find("body").css('height', 'fit-content');
                        $(this).height( $(this).contents().find("body").height()+20 );
                    });
                    if(!elem){
                        if(prepend){
                            $dialog.find('#observation_container').prepend($elem);
                        }else{
                            $dialog.find('#observation_container').append($elem);
                        }
                    }
                });
            };
            
        });        
    };

    var show_files = function($dialog, job){
        $dialog.find('#jobs_files').jtable({
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
                recordsLoaded: function(event, data){
                    $dialog.dialog("option", "position", {my: "center", at: "center", of: window});    
                },
        });

        $dialog.find('#jobs_log').jtable('load');
    };

    var jobs_work_log = function($dialog, job){
        $dialog.find('#jobs_work_log').jtable({
                title: langJS('global_work_log'),
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
                        listAction:   'Jobs/list_jobs_work_log?job_id='+job.id,
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
                            title: langJS('global_status'),
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
                        start_time: {
                            title: langJS('global_start_date'),
                            list: true,
                            sorting: true,
                            display: function (data) {
                                return data.record.start_time;
                            },
                            listClass:'text-right',
                        },
                        end_time: {
                            title: langJS('global_end_date'),
                            list: true,
                            sorting: true,
                            display: function (data) {
                                return data.record.end_time;
                            },
                            listClass:'text-right',
                        },
                        working_minutes:{
                            title:  langJS('global_time'),
                            width: '10%',
                            list: true,
                            containerClass : 'jtabledlg-w100proc',
                            display: function(data){
                                let totalMinutes = parseFloat(data.record.working_minutes);
                                let hours = Math.floor(totalMinutes / 60);
                                let minutes = totalMinutes % 60;
                                return isNaN(totalMinutes)?" - ":(hours+" óra "+minutes.toFixed(0)+" perc");
                            }
                        },
                },
        });

        $dialog.find('#jobs_work_log').jtable('load');
    };
};