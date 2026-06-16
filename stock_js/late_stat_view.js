var late_stat_view = function(params){
    $('#late_stat').jtable({
            title: langJS('global_late_stat'),
            messages:jtable_lang(),
            insertDialogWidth:'900',
            editDialogWidth:'450',
            dialogShowEffect:null,
            dialogHideEffect:null,
            paging: true, //Enable paging
            pageSize: 15,
            sorting: true, //Enable sorting
            defaultSorting: '', //Set default sorting
            actions: {
                    listAction:  'Late_stat/list_late_stat',
                },
            fields: {
                    id: {
                        key: true,
                        create: false,
                        edit: false,
                        list: false
                    },
                    all_pos:{
                        title: langJS('global_all_pos'),
                        width: '30%',
                        create: false,
                        edit: false,
                        list: true
                    },
                    late_pos:{
                        title: langJS('global_late_pos'),
                        width: '30%',
                        create: false,
                        edit: false,
                        list: true
                    },
                    late_rate:{
                        title: langJS('global_late_rate'),
                        width: '30%',
                        create: false,
                        edit: false,
                        list: true,
                        display: function(data){
                            return percent_format(data.record.late_rate);
                        }
                    },
            },
            recordsLoaded: function(event, data){
            },
            rowInserted: function(event, data){
            },
    });

    var startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
    var endOfMonth = moment(startOfMonth).endOf('month').format('YYYY-MM-DD');

    $('#late_stat-filter').dfilter({
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
                //value:[startOfMonth,endOfMonth],
                createOptions:datepicker_defaults(),
            },
            ],
        onChange:function($form){
            var serialized = $form.serializeArray();
            $('#late_stat').jtable('load', serialized);
        }
    });
    
};