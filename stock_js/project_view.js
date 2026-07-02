var project_view = function(params){
    $('#project-filter').dfilter({
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
            ],
        onChange:function($form){
            var serialized = $form.serializeArray();
            load_kanban(serialized);
        }
    });

    var loaded = 0;
    $('.dinput[name=filter_search]').on('keyup',function(){
        if (loaded == 0) {
            var serialized = $('#project-filter').dfilter('serializeArray');
            load_kanban(serialized);
        }
    });
    
    function load_kanban(serialized){
        loaded = 1;
        crud_jsupdate('Project/getProject',serialized, function(retData){
            $('#project_kanban').html('');
            let statuses = retData.statuses;
            let projects = retData.projects;

            $('#project_kanban').kanban({
                titles: statuses,
                items: projects,
                onChange: function(e,ui){
                },
                onReceive: function(e,ui){
                    var status = $(e.target).attr('data-block');
                    var id = $(ui.item).attr('data-id');
                    crud_jsupdate('Project/update_project',{id:id, status:status}, function(rd){
                        load_numbers();
                        //load_est_time();
                    });
                },
                onBeforeStop: function(e, ui) {
                },
            });
            loaded = 0;
            load_numbers();
            //load_est_time();
            $('.est_time_block').html('&nbsp;');
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
            $.each($(this).find('.cd_kanban_board_block_item'), function() {
                let est_time = parseFloat($(this).attr('data-est'));
                tot = tot + est_time;
            });
            let id = $(this).attr('data-block');
            let hours = Math.floor(tot / 60);
            let minutes = (tot % 60).toFixed(0).toString();
            $('#est_'+id).html(hours+':'+(minutes.length==1?'0'+minutes:minutes));
            total=total+tot;
        });
        let hours = Math.floor(total / 60);
        let minutes = (total % 60).toFixed(0).toString();
        $('#total_est').html(hours+':'+(minutes.length==1?'0'+minutes:minutes));
    }

    /*$('#project_kanban').on('click', '.cd_kanban_board_block_item', function(){
        //console.log($(this).attr('data-id'));
        let id = $(this).attr('data-id');
        projectDialog(id);
    });
    */

    var touchtime = 0;
    $('#project_kanban').on('click', '.cd_kanban_board_block_item', function(){
        if (touchtime == 0) {
            // set first click
            touchtime = new Date().getTime();
        } else {
            // compare first click to this click and see if they occurred within double click threshold
            if (((new Date().getTime()) - touchtime) < 800) {
                // double click occurred
                let id = $(this).attr('data-id');
                projectDialog(id);
                touchtime = 0;
            } else {
                // not a double click so set as a new first click
                touchtime = new Date().getTime();
            }
        }
    });

    var uploader; 
        
    var projectDialog = function(id){
        var $html = $('<div id="project_dialog"><form id="project_form"><div id="main_data" style="float: left; width: 49%;">'+
            '<div class="dent-input-container w100-proc">'+
                '<label for="name">'+langJS('global_project_name')+':</label>'+
                '<div class="dent-input">'+
                    '<input type="text" id="name" name="name" class="validate[required, minSize[2]]" />'+
                '</div>'+
            '</div>'+
            '<div class="dent-input-container w100-proc">'+
                '<label for="type">'+langJS('global_type')+'</label>'+
                '<div class="dent-input">'+
                    '<input type="text" id="type" name="type" class="select2 w100-proc" />'+
                '</div>'+
            '</div>'+
            '<div class="dent-input-container w100-proc">'+
                '<label for="target">'+langJS('global_target')+':</label>'+
                '<div class="dent-input">'+
                    '<textarea id="target" name="target" class="height-y-45 resize-y-300"></textarea>'+
                '</div>'+
            '</div>'+
            '<div class="dent-input-container w100-proc">'+
                '<label for="user">'+langJS('global_responsible')+'</label>'+
                '<div class="dent-input">'+
                    '<input type="text" id="user" name="user" class="select2 w100-proc validate[required]" value="'+params.userid+'" />'+
                '</div>'+
            '</div>'+
            '<div class="dent-input-container w100-proc">'+
                '<label for="deadline">'+langJS('global_deadline')+':</label>'+
                '<div class="dent-input">'+
                    '<input type="text" id="deadline" name="deadline" class="validate[required, minSize[2]]" />'+
                '</div>'+
            '</div>'+
            '<div class="dent-input-container w100-proc">'+
                '<label for="status">'+langJS('global_status')+'</label>'+
                '<div class="dent-input">'+
                    '<input type="text" id="status" name="status" class="select2 w100-proc" value="1" />'+
                '</div>'+
            '</div>'+
            '<div id="project_files" class="w100-proc" style="display: inline-block;"></div>'+
        '</div>'+
        '<div id="comments_div" class="dent-input-container w100-proc" style="float: right; width: 49%;">'+
            '<div class="dent-input-container w100-proc">'+
                '<label for="description">'+langJS('global_description')+':</label>'+
                '<div class="dent-input">'+
                    '<textarea id="description" name="description" class="height-150 resize-y-300"></textarea>'+
                '</div>'+
            '</div>'+
            '<div class="dent-input-container w100-proc">'+
                '<label for="comments">Kommentek / Észrevételek:</label>'+
                '<div class="dent-input">'+
                    '<textarea id="comments" name="comments" class="height-y-45 resize-y-300"></textarea>'+
                '</div>'+
            '</div>'+
            '<div class="dent-input-container w100-proc">'+
                '<label for="results">Eredmények összegzése:</label>'+
                '<div class="dent-input">'+
                    '<textarea id="results" name="results" class="resize-y-300"></textarea>'+
                '</div>'+
            '</div>'+
            '<div id="attachment_div" class="dent-input-container w100-proc">'+
                '<label for="">Csatolmányok</label>'+
                '<div id="attachments_list"/>'+
                '<div id="add_attachments_container">'+
                    '<div id="add_attachments_text">Húzza ide a fájlokat</div>'+
                    '<button type="button" id="add_attachments_button" class="button-blue">Fájlok kiválasztása</button>'+
                    '<input type="hidden" id="fileAttachments" name="fileAttachments" />'+
                '</div>'+
            '</div>'+
        '</div>'+
        '<input type="hidden" id="id" name="id" />'+
        '</form></div>');
        var $container 	= $("<div></div>").html($html);
        $('body').append($container);
        var $dialog = $container.dialog({
            title: (id?langJS('global_project_data'):langJS('global_new_project')),
            resizable: false,
            width:950,
            minHeight: 550,
            modal: true,
            autoOpen:true,
            buttons: [{
                text:langJS('global_ok'),
                'class': "button-green",
                click: function() {
                    if ($container.find('#project_form').validationEngine('validate')){
                        var fileAttachments = [];
                        if(uploader && uploader.files){
                            $.each(uploader.files, function(i, file){
                                var temp = constJS("UPLOAD_TEMP");
                                var fileName = temp+ file.name;
                                fileAttachments.push(fileName);
                            });
                        }
                        $container.find('input[name=fileAttachments]').val(fileAttachments);
                        var serialdata = $html.find('#project_form').serializeArray();
                        let lnk = (id?'Project/update_project':'Project/create_project');
                        crud_jsupdate(lnk,serialdata,function(data){
                            var serialized = $('#project-filter').dfilter('serializeArray');
                            load_kanban(serialized);
                            $dialog.dialog("close");
                        },function (data){});
                    }
                }
            },{
                text:langJS('global_cancel'),
                'class': "button-orange",
                click: function() {
                    $(this).dialog("close");
                }
            }],
            create: function(ev, ui){
                $container.find('#status').select2(APP.select2.select2_options_ajax('Project/sel2_status',{
                    allowClear: false,
                    cacheKEY:'sel2.project_status',
                }));

                $container.find('#type').select2(APP.select2.select2_options_ajax('Project/sel2_types',{
                    allowClear: true,
                    cacheKEY:'sel2.types',
                    createSearchChoice:function(term, data) {
                        if ( $(data).filter( function() {
                          return this.name.localeCompare(term)===0;
                        }).length===0) {
                          return {id:term, name:term};
                        }
                      },
                }));

                $container.find('#user').select2(APP.select2.select2_options_ajax('Users/sel2_users',{
                    allowClear: true,
                    cacheKEY:'sel2.users',
                }));

                $container.find('#deadline').datepicker(datepicker_defaults());
                $container.find('#deadline').datepicker('setDate',new Date());

                $container.find('#project_form').validationEngine(validation_defaults({
                    promptPosition : "topLeft",
                }));

                uploader =  new plupload.Uploader({
                    browse_button: $container.find('#add_attachments_button')[0], // this can be an id of a DOM element or the DOM element itself
                    url: build_url('index.php/uploadr/Upload/upload_file'),
                    headers:{'app-upload':'true'}, // this will generate HTTP_APP_UPLOAD headear in upload request
                    runtimes : 'html5,html4',
                    container: $container.find('#add_attachments_container')[0], // ... or DOM Element itself
                    drop_element : [$container.find('#add_attachments_container')[0]],
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
                                        $container.find('#add_attachments_container').css('background-color','#98CF09 !important');
                                    };
                                    target.ondragleave = function() {
                                        $container.find('#add_attachments_container').css('background-color','');
                                    };
                                    target.ondrop = function() {
                                        $container.find('#add_attachments_container').css('background-color','');
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
                                $container.find('#attachments_list').append('<div class="addedAttachment" id="' + file.id + '">' + file.name +
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
                $container.find('#attachments_list').on('click', '.removeAttachment', function(e) {
                    uploader.removeFile(uploader.getFile(this.id));
                    $('#'+this.id).remove();
                    e.preventDefault();
                });
            },
            open: function(ev, ui){
                if(id){
                    show_files($container, id);
                }
                if(id){
                    crud_jsupdate('Project/get_project',{id:id}, function(rec){
                        let data = rec.project;
                        $html.find('#id').val(data.id);
                        $html.find('#name').val(data.name);

                        $html.find('#type').select2('val', data.type);
                        $html.find('#target').val(data.target);
                        $html.find('#description').val(data.description);
                        $html.find('#user').select2('val', data.user);
                        $html.find('#deadline').val(data.deadline);
                        $html.find('#comments').val(data.comments);
                        
                        $html.find('#results').val(data.results);
                        $html.find('#status').select2('val', data.status);
                    });

                    if(params.admin==1){
                        $html.find('input').prop('readonly', false);
                    }else{
                        $html.find('input:text, input:password, input:file, select, textarea').prop('readonly', true);
                    }
                }
            },
            close: function(){
                $(this).dialog("destroy").remove();
            },
        }); 
    };

    $('.new_project').on('click', function(){
        projectDialog();
    });

    var show_files = function($dialog, project){
        $dialog.find('#project_files').jtable({
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
                    listAction:   'Project/list_project_files?project_id='+project,
                    deleteAction: 'Project/delete_project_files',
                },
            fields: {
                id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                project_id: {
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
        $dialog.find('#project_files').jtable('load');

    };

};