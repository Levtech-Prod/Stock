var materials_view = function(params){
    $('#materials').jtable({
            title: langJS('global_materials'),
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
                listAction:   'Materials/list_materials',
                createAction: 'Materials/create_materials',
                updateAction: 'Materials/update_materials',
                deleteAction: 'Materials/delete_materials'
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
                    width: '50%',
                },
                code:{
                    title: langJS('global_code'),
                    list:true,
                    create:true,
                    edit:true,
                    sorting: true,
                    listClass: 'text-left',
                    width: '20%',
                },
                density:{
                    title: langJS('global_density')+' (kg/&#13221;)',
                    list:true,
                    create:true,
                    edit:true,
                    sorting: true,
                    listClass: 'text-left',
                    inputClass: 'validate[required, custom[number]]',
                    width: '20%',
                },
                price: {
                    title: langJS('global_price'),
                    create: true,
                    edit: true,
                    list: true,
                    sorting: false,
                    width: '10%',
                    listClass: 'text-right',
                    inputClass: 'validate[required, min[0]]',
                    display: function(data){
                        return data.record.price+' EUR/kg';
                    }
                },
            },
            formCreated: function (event, data) {
                data.form.find('input[name=price]').dspinner({
                    suffix: ' EUR/kg',
                    step: 1,
                    places: 2,
                    increment: 'fast',
                    allowNull: false,
                    min:0,
                    max:999999
                });

                data.form.validationEngine();
            },
            formSubmitting: function (event, data) {
                return data.form.validationEngine('validate');
            },
            recordAdded: function (event, data) {
                APP.select2.cache_clear('sel2.materials');
            },
            recordUpdated: function (event, data){
                APP.select2.cache_clear('sel2.materials');
                data.thisTable.jtable('reload');
            },
            recordDeleted: function (event, data) {
                APP.select2.cache_clear('sel2.materials');
            },
            formClosed: function (event, data) {
                data.form.validationEngine('hide');
                data.form.validationEngine('detach');
            }
    });

    $('#materials').jtable('load');

};