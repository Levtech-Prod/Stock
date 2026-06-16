var tool_settings_view = function(params){
    $('#tool_categs').jtable({
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
            actions: {
                listAction:   build_url('index.php/Tool_settings/list_tool_categs'),
                createAction: build_url('index.php/Tool_settings/create_tool_categs'),
                updateAction: build_url('index.php/Tool_settings/update_tool_categs'),
                deleteAction: build_url('index.php/Tool_settings/delete_tool_categs')
            },
            fields: {
                params: {
                    title: "",
                    create:false,
                    edit:false,
                    sorting:false,
                    width:'2%',
                    listClass: 'jtable-command-column',
                    display:function(cdata){
                        var $btn = APP.jTable.createButton({icon:'fas fa-list-alt',classes:'rbtn-orange',title:langJS("global_params")});
                        $btn.click(function () {
                            categ_params($btn, cdata);
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
                    width: '60%',
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
                                crud_jsupdate('Tool_settings/delete_image',{id: data.record.id, image: data.record.image}, function(retData){
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
                    multipart_params:{},
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

    $('#tool_categs').jtable('load');

    var categ_params = function($img, categdata){
        $('#tool_categs').jtable(
            'toggleChildTable',
            $img.closest('tr'),
            $img.closest('td'),
            {
                title: langJS('global_params')+' - '+categdata.record.name,
                messages:jtable_lang(),
                insertDialogWidth:'400',
                editDialogWidth:'400',
                insertDialogHeight:'410',
                editDialogHeight:'410',
                dialogShowEffect:null,
                dialogHideEffect:null,
                paging: false, //Enable paging
                sorting: true, //Enable sorting
                defaultSorting: 'ts asc', //Set default sorting
                actions: {
                        listAction:   'Tool_settings/list_params?categ_id='+categdata.record.id,
                        createAction: 'Tool_settings/create_params',
                        updateAction: 'Tool_settings/update_params',
                        deleteAction: 'Tool_settings/delete_params',
                    },
                fields: {
                        id: {
                            key: true,
                            create: false,
                            edit: false,
                            list: false
                        },
                        categ_id: {
                            type:'hidden',
                            defaultValue:categdata.record.id,
                        },
                        name: {
                            title: langJS('global_name'),
                            width: '10%',
                            inputClass: 'validate[required, minSize[3]]',
                            listClass: 'text-bold',
                        },
                        type:{
                            title: langJS('global_type'),
                            sorting: false,
                            list: true,
                            create: true,
                            edit: true,
                            containerClass : 'jtabledlg-w100proc',
                            inputClass: 'sel2-100 select2-done validate[required]',
                            defaultValue: '1',
                            display:function(data){
                                var ret;
                                switch(data.record.type) {
                                    case '1':
                                        ret = 'Kód';
                                        break;
                                    case '2':
                                        ret = 'Típus';
                                        break;
                                    case '3':
                                        ret = 'Szöveg';
                                        break;
                                    case '4':
                                        ret = 'Szám';
                                        break;
                                }
                                return ret;
                            }
                        },
                        type_values: {
                            title: langJS('global_type_values'),
                            create: true,
                            edit: true,
                            list: true,
                            type: 'textarea',
                            width: '15%',
                            inputClass: 'height-y-70 resize-y-300',
                            containerClass : 'jtabledlg-w100proc',
                        },
                        unit: {
                            title: langJS('global_um'),
                            width: '10%',
                            inputClass: 'validate[minSize[1]]',
                        }
                },
                //Initialize validation logic when a form is created
                formCreated: function (event, data) {
                    data.form.parent().find('.file_warning').remove();
                    var $type = data.form.find('input[name="type"]');
                    var $type_values = data.form.find('textarea[name="type_values"]');
    
                    $type.select2(APP.select2.select2_options({
                        allowClear: false,
                        data: [{id:'1', value: 'Kód'}, {id:'2', value:'Típus'}, {id:'3', value:'Szöveg'}, {id:'4', value:'Szám'}]
                    })).on('change',function(){
                        if($(this).val()==2){
                            $type_values.prop('disabled', false);
                        }else{
                            $type_values.val('');
                            $type_values.prop('disabled', true);
                        }
                    });

                    if($type.val()==2){
                        $type_values.prop('disabled', false);
                    }else{
                        $type_values.val('');
                        $type_values.prop('disabled', true);
                    }

                    var $warn = '<div class="dialog-warning hidden file_warning" style="display: block; float: right;"><i class="fas fa-exclamation-triangle fa-fw"></i><span>Típus esetén egymás alá kell megadni (ENTER-el) a mezőbe a választható értékeket!</span></div>';
                    data.form.parent().append($warn);

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
                    APP.select2.cache_clear('sel2.process');
                },
                recordUpdated: function (event, data){
                    APP.select2.cache_clear('sel2.process');
                },
                recordDeleted: function (event, data) {
                    APP.select2.cache_clear('sel2.process');
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