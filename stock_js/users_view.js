var users_view = function(params){
    $('#users_list').jtable({
            title: langJS('global_users'),
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
            openChildAsAccordion: true,
            actions: {
                listAction:   'Users/list_users',
                createAction: 'Users/create_users',
                updateAction: 'Users/update_users',
                deleteAction: 'Users/delete_users'
            },
            fields: {
                id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                user_rights: { 
                    title: 'Menü jogok',
                    width: '2%',
                    sorting: false,
                    edit: false,
                    create: false,
                    paging: false,
                    listClass: 'jtable-command-column',
                    display: function (userData) {
                        var $btn = APP.jTable.createButton({icon:'fas fa-key',classes:'rbtn-orange',title:'Menü jogok'});
                        $btn.click(function () {
                            jtable_user_rights($btn,userData);
                        });
                        return $btn;
                    }
                },
                status_rights: { 
                    title: 'Státusz jogok',
                    width: '2%',
                    sorting: false,
                    edit: false,
                    create: false,
                    paging: false,
                    listClass: 'jtable-command-column',
                    display: function (userData) {
                        var $btn = APP.jTable.createButton({icon:'fas fa-list-alt',classes:'rbtn-orange',title:'Státusz jogok'});
                        $btn.click(function () {
                            jtable_status_rights($btn,userData);
                        });
                        return $btn;
                    }
                },
                username: {
                    list: true,
                    sorting: true,
                    title: 'Felhasználónév',
                    inputClass: 'validate[required, minSize[5]]',
                },
                email:{
                    list: true,
                    sorting: false,
                    title: 'Email',
                },
                phone: {
                    list: true,
                    sorting: false,
                    title: 'Telefon',
                },
                admin:{
                    title: 'Admin',
                    list: true,
                    edit: true,
                    create: true,
                    sorting: false,
                    type: 'checkbox',
                    values: { '0': '', '1': '' },
                    listClass: 'text-center',
                    display:function(data){
                        return '<input type="checkbox" disabled '+(data.record.admin == 1?"checked":"")+' data-id="'+data.record.id+'" />';
                    }
                },
                price_right:{
                    title: 'Egységár és PO jog',
                    list: true,
                    edit: true,
                    create: true,
                    sorting: false,
                    type: 'checkbox',
                    values: { '0': '', '1': '' },
                    listClass: 'text-center',
                    display:function(data){
                        var $input = $('<input type="checkbox" class="class="toggle_price_right" data-id="'+data.record.id+'" />');
                        $input.prop('checked', (parseInt(data.record.price_right,10) === 1) ? true : false);
                        $input.attr('title', 'Egységár és PO jog');
                        $input.data('id', data.record.id);
                        $input.on('click',function(){
                            crud_jsupdate('Users/update_user_flags',{id: $(this).data("id"),price_right : $(this).prop('checked') ? 1:0});
                            data.record.price_right = $(this).prop('checked') ? 1 : 0;
                        });
                        return $input;
                    }
                },
                manager:{
                    title: 'Gyártás vezető',
                    list: true,
                    edit: true,
                    create: true,
                    sorting: false,
                    type: 'checkbox',
                    values: { '0': '', '1': '' },
                    listClass: 'text-center',
                    display:function(data){
                        var $input = $('<input type="checkbox" class="class="toggle_manager" data-id="'+data.record.id+'" />');
                        $input.prop('checked', (parseInt(data.record.manager,10) === 1) ? true : false);
                        $input.attr('title', 'Gyártás vezető');
                        $input.data('id', data.record.id);
                        $input.on('click',function(){
                            crud_jsupdate('Users/update_user_flags',{id: $(this).data("id"),manager : $(this).prop('checked') ? 1:0});
                            data.record.manager = $(this).prop('checked') ? 1 : 0;
                        });
                        return $input;
                    }
                },
                rfid: {
                    list: true,
                    sorting: false,
                    title: 'RFID',
                },
                is_online:{
                    title: 'RFID Online',
                    list: true,
                    edit: false,
                    create: false,
                    sorting: false,
                    type: 'checkbox',
                    values: { '0': '', '1': '' },
                    listClass: 'text-center',
                    display:function(data){
                        return '<input type="checkbox" disabled '+(data.record.is_online == 1?"checked":"")+' data-id="'+data.record.id+'" />';
                    }
                },
                ipaddr: {
                    list: true,
                    sorting: false,
                    title: 'IP',
                },
                password: {
                    list: false,
                    sorting: false,
                    title: 'Jelszó',
                    inputClass: 'validate[minSize[6]]',
                },
                created_at:{
                    list: true,
                    sorting: true,
                    edit: false,
                    create: false,
                    title: 'Creat la data',
                }
            },
            formCreated: function(event, data){
                var pw = data.form.find('input[name="password"]');
                if (data.formType=='create'){
                    pw.val(generate_random(6));
                }else{
                    pw.val('');
                }

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

    $('#users_list').jtable('load');

    generate_random = function(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };

    var jtable_user_rights = function($img, userData){
        $('#users_list').jtable(
            'toggleChildTable',
            $img.closest('tr'),
            $img.closest('td'),
            {
                insertDialogWidth:'500',
                editDialogWidth:'500',
                title: userData.record.username+' menü jogai',
                messages: jtable_lang({}),
                toolbar: {
                    items: [{
                            icon: 'fas fa-plus',
                            text: 'Gépkezelő jogok',
                            cssClass:'rbtn-green',
                            click: function () {
                                crud_jsupdate('Menu/enable_operator_rights',{id: userData.record.id},function(){
                                    rights_jtable.childTable.jtable('reload');
                                });
                            }
                        },
                        {
                            icon: 'fas fa-plus',
                            text: 'QC jogok',
                            cssClass:'rbtn-green',
                            click: function () {
                                crud_jsupdate('Menu/enable_qc_rights',{id: userData.record.id},function(){
                                    rights_jtable.childTable.jtable('reload');
                                });
                            }
                        },
                    ]
                },
                actions: {
                    listAction: 'Menu/list_menu_rights?userid='+userData.record.id,
                },
                fields: {
                    id: {
                        key: true,
                        create: false,
                        edit: false,
                        list: false
                    },
                    enabled: {
                        title: '<input class="enable_all_user_menus" rec_id="'+userData.record.id+'" type="checkbox" '+checkedtext(userData.record.enabled==1)+' />',
                        width: '5%',
                        display: function (data) {
                            return '<input class="enable_one_user_menu" title="enable/disable" rec_id="'+data.record.id+'" type="checkbox" rec_parentid="'+userData.record.id+'"'+checkedtext(data.record.enabled==1)+' />';
                        },
                        sorting: false,
                        edit: false,
                        create: false,
                        listClass:'enable_one_user_menu_parent',
                    },
                    menuname: {
                        title: 'Menü',
                        create: false,
                        edit: false,
                        list: true,
                        width: '90%',
                        display: function (data) {
                            return '<span class="text-bold">'+data.record.menuname+'</span>';
                        },
                    },
                },
                //Initialize validation logic when a form is created
                formCreated: function (event, data) {
                    data.form.validationEngine();
                },
                //Validate form when it is being submitted
                formSubmitting: function (event, data) {
                    return data.form.validationEngine('validate');
                },
                //Dispose validation logic when form is closed
                formClosed: function (event, data) {
                    data.form.validationEngine('hide');
                    data.form.validationEngine('detach');
                }
            },
            function (data) { //opened handler
                try{
                    rights_jtable = data;
                    data.childTable.jtable('load');
                }catch(e){
                }
        });
    };

    $('#users_list').on("click",'.enable_all_user_menus', function(){
        var attrib = $(this).prop("checked");
        var rec_id = $(this).attr("rec_id");
        var active = 0;
        if( attrib ){ active = 1; }
        $('.enable_one_user_menu[rec_parentid="'+rec_id+'"]').prop("checked", attrib );
        var params = {};
        params['id'] 		= rec_id;
        params['enabled'] 	= active;
        crud_jsupdate('Menu/enable_all_user_menus', params, nullFunction);
    });

    //Activate selected intervention
    $('#users_list').on("click",'.enable_one_user_menu_parent:not(input[type="checkbox"])', function(){
        $(this).find('.enable_one_user_menu').trigger('click');
    });
    $('#users_list').on("click",'.enable_one_user_menu', function(e){
        e.stopPropagation();
        var attrib = $(this).prop("checked");
        var rec_id = $(this).attr("rec_id");
        var rec_parentid = $(this).attr("rec_parentid");
        var active = 0;
        if(attrib){ active = 1;}
        var ck = ($('.enable_one_user_menu[rec_parentid="'+rec_parentid+'"]:checked').length>0);
        $('.enable_all_user_menus[rec_id="'+rec_parentid+'"]').prop("checked", ck);
        var params = {};
        params['id']	 	= rec_id;
        params['enabled'] 	= active;
        crud_jsupdate('Menu/enable_one_user_menu', params, nullFunction);
    });

    /* Job status rights */
    var jtable_status_rights = function($img, userData){
        $('#users_list').jtable(
            'toggleChildTable',
            $img.closest('tr'),
            $img.closest('td'),
            {
                insertDialogWidth:'500',
                editDialogWidth:'500',
                title: userData.record.username+' státusz jogai',
                messages: jtable_lang({}),
                toolbar: {
                    items: [
                    ]
                },
                actions: {
                    listAction: 'Jobs_status/list_status_rights?userid='+userData.record.id,
                },
                fields: {
                    id: {
                        key: true,
                        create: false,
                        edit: false,
                        list: false
                    },
                    enabled: {
                        title: '<input class="enable_all_user_status" rec_id="'+userData.record.id+'" type="checkbox" '+checkedtext(userData.record.enabled==1)+' />',
                        width: '5%',
                        display: function (data) {
                            return '<input class="enable_one_user_status" title="enable/disable" rec_id="'+data.record.id+'" type="checkbox" rec_parentid="'+userData.record.id+'"'+checkedtext(data.record.enabled==1)+' />';
                        },
                        sorting: false,
                        edit: false,
                        create: false,
                        listClass:'enable_one_user_status_parent',
                    },
                    statusname: {
                        title: 'Státusz',
                        create: false,
                        edit: false,
                        list: true,
                        width: '90%',
                        display: function (data) {
                            return '<span class="text-bold">'+data.record.statusname+'</span>';
                        },
                    },
                },
                //Initialize validation logic when a form is created
                formCreated: function (event, data) {
                    data.form.validationEngine();
                },
                //Validate form when it is being submitted
                formSubmitting: function (event, data) {
                    return data.form.validationEngine('validate');
                },
                //Dispose validation logic when form is closed
                formClosed: function (event, data) {
                    data.form.validationEngine('hide');
                    data.form.validationEngine('detach');
                }
            },
            function (data) { //opened handler
                try{
                    rights_jtable = data;
                    data.childTable.jtable('load');
                }catch(e){
                }
        });
    };

    $('#users_list').on("click",'.enable_all_user_status', function(){
        var attrib = $(this).prop("checked");
        var rec_id = $(this).attr("rec_id");
        var active = 0;
        if( attrib ){ active = 1; }
        $('.enable_one_user_status[rec_parentid="'+rec_id+'"]').prop("checked", attrib );
        var params = {};
        params['id'] 		= rec_id;
        params['enabled'] 	= active;
        crud_jsupdate('Jobs_status/enable_all_user_status', params, nullFunction);
    });

    //Activate selected intervention
    $('#users_list').on("click",'.enable_one_user_status_parent:not(input[type="checkbox"])', function(){
        $(this).find('.enable_one_user_status').trigger('click');
    });
    $('#users_list').on("click",'.enable_one_user_status', function(e){
        e.stopPropagation();
        var attrib = $(this).prop("checked");
        var rec_id = $(this).attr("rec_id");
        var rec_parentid = $(this).attr("rec_parentid");
        var active = 0;
        if(attrib){ active = 1;}
        var ck = ($('.enable_one_user_status[rec_parentid="'+rec_parentid+'"]:checked').length>0);
        $('.enable_all_user_status[rec_id="'+rec_parentid+'"]').prop("checked", ck);
        var params = {};
        params['id']	 	= rec_id;
        params['enabled'] 	= active;
        crud_jsupdate('Jobs_status/enable_one_user_status', params, nullFunction);
    });

};