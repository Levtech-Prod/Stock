var machine_settings_view = function(params){
    $('#machines').jtable({
            title: langJS('global_categories'),
            messages:jtable_lang({}),
            dialogShowEffect:null,
            dialogHideEffect:null,
            insertDialogWidth:'400',
            editDialogWidth:'400',
            insertDialogHeight:'370',
            editDialogHeight:'370',
            paging: true, //Enable paging
            pageSize: 10, //Set page size (default: 10)
            sorting: true, //Enable sorting
            defaultSorting: 'sort ASC', //Set default sorting
            selecting: false,
            multiselect: false,
            selectingCheckboxes: false,
            selectOnRowClick :false,
            openChildAsAccordion: true,
            actions: {
                listAction:   build_url('index.php/Machine_settings/list_machines'),
                createAction: build_url('index.php/Machine_settings/create_machines'),
                updateAction: build_url('index.php/Machine_settings/update_machines'),
                deleteAction: build_url('index.php/Machine_settings/delete_machines')
            },
            fields: {
                week_templates: {
                    title: langJS('global_maintenance_week'),
                    create:false,
                    edit:false,
                    sorting:false,
                    width:'5%',
                    listClass: 'jtable-command-column',
                    display:function(cdata){
                        var $btn = APP.jTable.createButton({icon:'fas fa-calendar-week',classes:'rbtn-orange',title:langJS("global_maintenance_week")});
                        $btn.click(function () {
                            maintenance_templates($btn, cdata, 1);
                        });
                        return $btn;
                    }
                },
                month_templates: {
                    title: langJS('global_maintenance_month'),
                    create:false,
                    edit:false,
                    sorting:false,
                    width:'5%',
                    listClass: 'jtable-command-column',
                    display:function(cdata){
                        var $btn = APP.jTable.createButton({icon:'fas fa-calendar-alt',classes:'rbtn-orange',title:langJS("global_maintenance_month")});
                        $btn.click(function () {
                            maintenance_templates($btn, cdata, 2);
                        });
                        return $btn;
                    }
                },
                semester_templates: {
                    title: langJS('global_maintenance_semester'),
                    create:false,
                    edit:false,
                    sorting:false,
                    width:'5%',
                    listClass: 'jtable-command-column',
                    display:function(cdata){
                        var $btn = APP.jTable.createButton({icon:'fas fa-calendar',classes:'rbtn-orange',title:langJS("global_maintenance_semester")});
                        $btn.click(function () {
                            maintenance_templates($btn, cdata, 3);
                        });
                        return $btn;
                    }
                },
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
                name:{
                    title: langJS('global_name'),
                    list:true,
                    create:true,
                    edit:true,
                    sorting: true,
                    listClass: 'text-left',
                    inputClass: 'validate[required, minSize[2]]',
                    width: '40%',
                },  
                show_image: {
                    create: false,
                    edit: false,
                    list: true,
                    title: langJS('global_image'),
                    width: '7%',
                    display: function(data){
                        return '<a><img style="width:100%" src="'+base_url()+(data.record.image?'upload/images/'+data.record.image:'images/image_not_available.png')+'?'+ new Date().getTime()+'"></img></a>';
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
                            APP.images.upload_tool_image(id, img, true, function(idata){
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
                                crud_jsupdate('Machine_settings/delete_image',{id: data.record.id, image: data.record.image}, function(retData){
                                    data.thisTable.jtable('reload');
                                });
                            });
                        });
                        return $btn;
                    }
                },  
            },
            formCreated: function (event, data) {
                var $dialog = data.form.parent();

                var $attach = $('<div id="attachment_div" class="dent-input-container" style="width: 100%;">'+
                    '<label for="">Kép</label>'+
                    '<div id="attachments_list"/>'+
                    '<div id="add_attachments_container">'+
                        '<div id="add_attachments_text">Húzza ide a fájlokat</div>'+
                        '<button type="button" id="add_attachments_button" class="button-blue">Fájlok kiválasztása</button>'+
                    '</div>'+
                '</div>');

                data.form.parent().find('#attachment_div').remove();
                data.form.parent().find('.file_warning').remove();
                data.form.parent().append($attach);
                
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
                    multipart_templates:{},
                    filters:{
                                max_file_size : '30Mb',
                                mime_types:
                                    [
                                        {title : "Image files", extensions : "jpg,jpeg,gif,png"},
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
                        },
                        //Populating file list
                        FilesAdded: function(up, files) {
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
                                data.form.find('input[name=image]').val(file.name);
                            }else{
                                APP.showMessage(langJS('global_error'), 'Error: '+response.error.message);
                            }
                        },
                        //Creating unique file name
                        BeforeUpload: function(up, file) {
                            var params = up.settings.multipart_templates;
                            params.fileName = file.id + '.' + file.name.split('.').pop();
                        },
                        UploadComplete: function(up, files) {
                            $dialog.parent().find('button').each(function(){$(this).prop('disabled',false);});
                        },
                        //Deleting based on unique file name
                        FilesRemoved: function(up, files){
                            $.each(files, function(i, file){
                                //console.log(file);
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
            },
            rowInserted: function(event, data){
            },
            recordsLoaded: function(event, data){
            },
    });

    $('#machines').jtable('load');

    var maintenance_templates = function($img, mdata, type){
        var title = "";
        switch(type) {
            case 1:
                title = langJS('global_maintenance_week');
                break;
            case 2:
                title = langJS('global_maintenance_month');
                break;
            case 3:
                title = langJS('global_maintenance_semester');
                break;
        }
        $('#machines').jtable(
            'toggleChildTable',
            $img.closest('tr'),
            $img.closest('td'),
            {
                title: title+' - '+mdata.record.name,
                messages:jtable_lang(),
                insertDialogWidth:'400',
                editDialogWidth:'400',
                insertDialogHeight:'410',
                editDialogHeight:'410',
                dialogShowEffect:null,
                dialogHideEffect:null,
                paging: false, //Enable paging
                sorting: true, //Enable sorting
                defaultSorting: 'id', //Set default sorting
                actions: {
                        listAction:   'Machine_settings/list_templates?machineid='+mdata.record.id+'&type='+type,
                        createAction: 'Machine_settings/create_templates',
                        updateAction: 'Machine_settings/update_templates',
                        deleteAction: 'Machine_settings/delete_templates',
                    },
                fields: {
                        id: {
                            key: true,
                            create: false,
                            edit: false,
                            list: false
                        },
                        machineid: {
                            type:'hidden',
                            defaultValue:mdata.record.id,
                        },
                        type: {
                            type:'hidden',
                            defaultValue:type,
                        },
                        name: {
                            title: langJS('global_name'),
                            width: '10%',
                            inputClass: 'validate[required, minSize[3]]',
                            listClass: 'text-bold',
                        },
                        description: {
                            title: langJS('global_description'),
                            create: true,
                            edit: true,
                            list: true,
                            type: 'textarea',
                            width: '9%',
                            inputClass: 'height-150 resize-y-300',
                            containerClass : 'jtabledlg-w100proc',
                        },
                },
                //Initialize validation logic when a form is created
                formCreated: function (event, data) {
                    data.form.validationEngine(validation_defaults());
                },
                //Validate form when it is being submitted
                formSubmitting: function (event, data) {
                    return data.form.validationEngine('validate');
                },
                //Dispose validation logic when form is closed
                formClosed: function (event, data) {
                        data.form.validationEngine('hide');
                        data.form.validationEngine('detach');
                },
                recordsLoaded: function(event, data) {
                },
                recordAdded: function (event, data) {
                },
                recordUpdated: function (event, data){
                },
                recordDeleted: function (event, data) {
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

};