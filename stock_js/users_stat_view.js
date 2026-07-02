var users_stat_view = function(params){
    $('#users_stat').jtable({
            title: langJS('global_users_stat'),
            messages:jtable_lang(),
            insertDialogWidth:'900',
            editDialogWidth:'450',
            dialogShowEffect:null,
            dialogHideEffect:null,
            paging: true, //Enable paging
            pageSize: 15,
            sorting: true, //Enable sorting
            defaultSorting: 'u.id asc', //Set default sorting
            actions: {
                    listAction:  'Users_stat/list_users_stat',
                },
            fields: {
                    id: {
                        key: true,
                        create: false,
                        edit: false,
                        list: false
                    },
                    name: {
                        title: langJS('global_user'),
                        width: '9%',
                        inputClass: 'validate[required, minSize[3]]',
                        listClass: 'text-bold',
                        display: function(data){
                            return data.record.name;
                        }
                    },
                    machine_hours: {
                        title: langJS('global_machine_hours'),
                        width: '7%',
                        create: false,
                        edit: false,
                        list: true,
                        sorting: false,
                        containerClass : 'jtabledlg-w100proc',
                        display: function(data){
                            let totalMinutes = parseFloat(data.record.machine_hours);
                            let hours = Math.floor(totalMinutes / 60);
                            let minutes = totalMinutes % 60;
                            return isNaN(totalMinutes)?" - ":(hours+" óra "+minutes.toFixed(0)+" perc");
                        }
                    },
                    user_prod:{
                        title: langJS('global_user_prod'),
                        width: '7%',
                        create: false,
                        edit: false,
                        list: true
                    },
                    other_prod:{
                        title: langJS('global_other_prod'),
                        width: '7%',
                        create: false,
                        edit: false,
                        list: true
                    },
                    prog_number:{
                        title: langJS('global_prog_number'),
                        width: '7%',
                        create: false,
                        edit: false,
                        list: true
                    },
                    user_prod_err:{
                        title: langJS('global_user_prod_err'),
                        width: '7%',
                        create: false,
                        edit: false,
                        list: true
                    },
                    other_prod_err:{
                        title: langJS('global_other_prod_err'),
                        width: '7%',
                        create: false,
                        edit: false,
                        list: true
                    },
            },
            recordsLoaded: function(event, data){
            },
            rowInserted: function(event, data){
            },
    });

    var startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
    var endOfMonth = moment(startOfMonth).endOf('month').format('YYYY-MM-DD');

    $('#users_stat-filter').dfilter({
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
                icons:["search","clear","today"],
                width:'320px',
                value:[startOfMonth,endOfMonth],
                createOptions:datepicker_defaults(),
            },
            ],
        onChange:function($form){
            var serialized = $form.serializeArray();
            $('#users_stat').jtable('load', serialized);
        }
    });
    
};