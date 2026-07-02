var plan_view = function(params){
    
    var jtable_options = {};
    
    var jtable_common_options = {
        messages:jtable_lang({}),
        dialogShowEffect:null,
        dialogHideEffect:null,
        paging: false,
        sorting: false, //Enable sorting
        defaultSorting: 'o.plan_order ASC', //Set default sorting
        selecting: false,
        multiselect: false,
        selectingCheckboxes: false,
        selectOnRowClick :false,
        visibleEditRecordButton: false,
        visibleDeleteRecordButton: false,
        openChildAsAccordion: true,
        footer: true,
        actions: {
            listAction:   'Orders/list_plans',
        },
        fields: {
            jobs: {
                title: "",
                create:false,
                edit:false,
                sorting:false,
                width:'2%',
                listClass: 'jtable-command-column',
                display:function(partnerdata){
                    var $btn = APP.jTable.createButton({icon:'fas fa-list-alt',classes:'rbtn-orange',title:langJS("global_jobs")});
                    $btn.click(function () {
                        orders_jobs($btn, partnerdata);
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
                listClass: 'cancel_td',
                width: '5%',
            },
            name:{
                title: langJS('global_order_number'),
                list:true,
                create:true,
                edit:true,
                sorting: false,
                listClass: 'text-left cancel_td',
                inputClass: 'validate[required, minSize[2]]',
                width: '10%',
                display: function(data){
                    return data.record.id; // +' - '+data.record.name;
                }
            },
            /*client_name:{
                title: langJS('global_client'),
                create: true,
                edit: true,
                list: true,
                sorting: true,
                sortField:'client_name',
                inputClass: 'sel2-100 select2-done validate[required]',
                containerClass : 'jtabledlg-w100proc',
                width: '10%',
            },*/
            status_name: {
                title: langJS('global_status'),
                create: false,
                edit: false,
                list: true,
                sorting: true,
                sortField: 'status',
                width: '10%',
                containerClass: 'jtabledlg-w25proc',
                display:function(data){
                    var ret;
                    let bg_color = 'red';
                    switch(data.record.status) {
                        case '0':
                            ret = langJS('global_init');
                            bg_color = 'red';
                            break;
                        case '1':
                            ret = langJS('global_progress');
                            bg_color = 'blue';
                            break;
                        case '2':
                            ret = langJS('global_ready');
                            bg_color = 'green';
                            break;
                    }
                    if(data.record.job_number!=data.record.prog_number){
                        bg_color = 'red';
                    }
                    return '<div style="background-color:'+bg_color+'; padding: 2px; color: white;">'+ret+' ('+parseFloat(data.record.procent).toFixed(0)+'%)</div>';
                }
            },
            /*deadline: {
                title: langJS('global_prod_deadline'),
                width: '10%',
                inputClass: 'validate[required]',
                containerClass: 'jtabledlg-w50proc',
                listClass: 'text-center',
                sorting: true,
            },*/
            init_date: {
                title: langJS('global_init_date'),
                width: '10%',
                inputClass: 'validate[required]',
                containerClass: 'jtabledlg-w50proc',
                listClass: 'text-center',
                sorting: true,
                display: function(data){
                    let bg_color = '#ffffff';
                    if(data.record.date_diff<-2){
                        bg_color = '#FFFF00';
                    }
                    if(data.record.date_diff<-4){
                        bg_color = '#FF0000';
                    }
                    return '<div style="background-color:'+bg_color+'; padding: 2px;">'+(data.record.init_date?data.record.init_date:"&nbsp;<br/>")+(data.record.date_diff?('<br/><b>'+(data.record.date_diff>0?'+'+data.record.date_diff:data.record.date_diff)+' nap</b>'):'&nbsp;')+'</div>';
                }
            },
            intake_date: {
                title: langJS('global_intake_date'),
                width: '10%',
                inputClass: 'validate[required]',
                containerClass: 'jtabledlg-w50proc',
                listClass: 'text-center',
                sorting: true,
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
                    let tot_price = parseFloat(data.record.tot_price);
                    let totalMinutes = (tot_price/parseFloat(params.wage)).toFixed(2)*60;
                    let hours = Math.floor(totalMinutes / 60);
                    let minutes = totalMinutes % 60;
                    return '<span class="est_time" data-price="'+(isNaN(tot_price)?0:tot_price)+'">'+(isNaN(tot_price)?" - ":(hours+" óra "+minutes.toFixed(0)+" perc"))+'</span>';
                },
                footer: function(data){
                    var text = '<div class="text-bold" style="font-size:13px;">'+langJS('global_tot_est_time')+': <span class="est_time_total"><span></div>';
                    return text;
                }
            },
            remaining_time: {
                title: langJS('global_remaining_time'),
                width: '10%',
                create: false,
                edit: false,
                list: true,
                sorting: false,
                containerClass : 'jtabledlg-w100proc',
                display: function(data){
                    let remaining_price = parseFloat(data.record.remaining_price);
                    let totalMinutes = (remaining_price/parseFloat(params.wage)).toFixed(2)*60;
                    let hours = Math.floor(totalMinutes / 60);
                    let minutes = totalMinutes % 60;
                    return '<span class="r_time" data-price="'+(isNaN(remaining_price)?0:remaining_price)+'">'+(isNaN(remaining_price)?" - ":(hours+" óra "+minutes.toFixed(0)+" perc"))+'</span>';
                },
            },
            comments:{
                title: langJS('global_comments'),
                width: '30%',
                edit: false,
                create: false,
                display: function (data) {
                    return '<textarea class="comment_edit" style="width: 100%;" rec_id="'+data.record.id+'">'+(data.record.comments?data.record.comments:'')+'</textarea>';
                },
            },
            finished: {
                title: langJS('global_finished'),
                width: '3%',
                display: function (data) {
                    return '<input class="enable_one_finish" title="enable/disable" rec_id="'+data.record.id+'" type="checkbox" '+checkedtext(data.record.finished==1)+' />';
                },
                sorting: false,
                edit: false,
                create: false,
                listClass:'enable_one_finish_parent',
                footer: function(data){
                    var text = '<div class="text-bold" style="font-size:13px;">'+langJS('global_tot_remaining_time')+': <span class="remaining_time_total"><span></div>';
                    return text;
                }
            },
        },
        recordsLoaded: function(event, data){
            let total_price = 0;
            $.each(data.records, function(index, val) {
                if(val.tot_price){
                    total_price = total_price+parseFloat(val.tot_price);
                }
            });
            let totalMinutes = (total_price/parseFloat(params.wage)).toFixed(2)*60;
            let hours = Math.floor(totalMinutes / 60);
            let minutes = totalMinutes % 60;
            $celem = $(event.target).find('.est_time_total');
            $celem.html(isNaN(total_price)?" - ":(hours+" óra "+minutes.toFixed(0)+" perc"));

            let r_price = 0;
            $.each(data.records, function(index, val) {
                if(val.remaining_price){
                    r_price = r_price+parseFloat(val.remaining_price);
                }
            });
            let rtotalMinutes = (r_price/parseFloat(params.wage)).toFixed(2)*60;
            let rhours = Math.floor(rtotalMinutes / 60);
            let rminutes = rtotalMinutes % 60;
            $rcelem = $(event.target).find('.remaining_time_total');
            $rcelem.html(isNaN(r_price)?" - ":(rhours+" óra "+rminutes.toFixed(0)+" perc"));

            let stotal_price = 0;
            $.each($('.est_time'), function() {
                let stot_price = $(this).attr('data-price');
                if(stot_price){
                    stotal_price = stotal_price+parseFloat(isNaN(stot_price)?0:stot_price);
                }
            });
            if(data.thisTable.attr('id')=='plan_5'){
                let stotalMinutes = (stotal_price/parseFloat(params.wage)).toFixed(2)*60;
                let shours = Math.floor(stotalMinutes / 60);
                let sminutes = stotalMinutes % 60;
                $('.plan_tot').html(isNaN(stotal_price)?" - ":(shours+" óra "+sminutes.toFixed(0)+" perc"));
            }
        },
        rowInserted: function(event, data){
            if (data.record.finished==1){
                data.row.addClass('green');
            }
        },
    };

    /* 1 day */
    jtable_options = {};
    $.extend(jtable_options, jtable_common_options, { title: ' (Aktuális hét) - 1. hét' });
    $('#plan_1').jtable(jtable_options);

    jtable_options = {};
    $.extend(jtable_options, jtable_common_options, { title: '(Jövő hét) - 2. hét' });
    $('#plan_2').jtable(jtable_options);

    jtable_options = {};
    $.extend(jtable_options, jtable_common_options, { title: '3. hét' });
    $('#plan_3').jtable(jtable_options);
    
    jtable_options = {};
    $.extend(jtable_options, jtable_common_options, { title: '4. hét' });
    $('#plan_4').jtable(jtable_options);

    jtable_options = {};
    $.extend(jtable_options, jtable_common_options, { title: '5. Hét' });
    $('#plan_5').jtable(jtable_options);

    var loadJtables = function(){
        $(".jtable tbody").addClass('connectedSortable');
        $("tr.jtable-no-data-row").remove();
        $('#plan_1').jtable("load",{'day': 1}, function(data){
            $('#plan_2').jtable("load",{'day': 2}, function(data){
                $('#plan_3').jtable("load",{'day': 3}, function(data){
                    $('#plan_4').jtable("load",{'day': 4}, function(data){
                        $('#plan_5').jtable("load",{'day': 5});
                    });
                });
            });
        });

        $("tbody" ).sortable({
            connectWith: ".connectedSortable",
            scroll: false,
            cursor: "move",
            //cancel: ".jtable-child-row", // nem jo mert nem lehet kattintani az input-ba
            items: "> tr.jtable-data-row",
            handle: "td:not(.cancel_td)",
            change: function(e,ui){
            },
            receive: function(e,ui){
                var status = $(e.target).parents('.plan_sort').attr('data-day');
                var id = $(ui.item).attr('data-record-key');
                crud_jsupdate('Orders/update_orders',{id:id, plan_day:status}, function(rd){
                    $(e.target).parents('.plan_sort').jtable('reload');
                });
                let total_price = 0;
                $.each($(e.target).parents('.plan_sort').find('.est_time'), function() {
                    let tot_price = $(this).attr('data-price');
                    if(tot_price){
                        total_price = total_price+parseFloat(isNaN(tot_price)?0:tot_price);
                    }
                });
                let totalMinutes = (total_price/parseFloat(params.wage)).toFixed(2)*60;
                let hours = Math.floor(totalMinutes / 60);
                let minutes = totalMinutes % 60;
                $celem = $(e.target).parents('.plan_sort').find('.est_time_total');
                $celem.html(isNaN(total_price)?" - ":(hours+" óra "+minutes.toFixed(0)+" perc"));

                let r_price = 0;
                $.each($(e.target).parents('.plan_sort').find('.r_time'), function() {
                    let tr_price = $(this).attr('data-price');
                    if(tr_price){
                        r_price = r_price+parseFloat(isNaN(tr_price)?0:tr_price);
                    }
                });
                let rtotalMinutes = (r_price/parseFloat(params.wage)).toFixed(2)*60;
                let rhours = Math.floor(rtotalMinutes / 60);
                let rminutes = rtotalMinutes % 60;
                $rcelem = $(e.target).find('.remaining_time_total');
                $rcelem.html(isNaN(r_price)?" - ":(rhours+" óra "+rminutes.toFixed(0)+" perc"));

                var oparams = [];
                var i=0;
                $.each($(e.target).parents('.plan_sort').find('.connectedSortable tr'), function() {
                    let id = $(this).attr('data-record-key');
                    oparams.push({'id':id, 'plan_order':i});
                    i++;
                });
                crud_jsupdate('Orders/order_element', {ids: oparams}, function(rd){
                    $(e.target).parents('.plan_sort').jtable('reload');
                });
            },
            remove: function(e,ui){
                let total_price = 0;
                $.each($(e.target).parents('.plan_sort').find('.est_time'), function() {
                    let tot_price = $(this).attr('data-price');
                    if(tot_price){
                        total_price = total_price+parseFloat(isNaN(tot_price)?0:tot_price);
                    }
                });
                let totalMinutes = (total_price/parseFloat(params.wage)).toFixed(2)*60;
                let hours = Math.floor(totalMinutes / 60);
                let minutes = totalMinutes % 60;
                $celem = $(e.target).parents('.plan_sort').find('.est_time_total');
                $celem.html(isNaN(total_price)?" - ":(hours+" óra "+minutes.toFixed(0)+" perc"));

                let r_price = 0;
                $.each($(e.target).parents('.plan_sort').find('.r_time'), function() {
                    let tr_price = $(this).attr('data-price');
                    if(tr_price){
                        r_price = r_price+parseFloat(isNaN(tr_price)?0:tr_price);
                    }
                });
                let rtotalMinutes = (r_price/parseFloat(params.wage)).toFixed(2)*60;
                let rhours = Math.floor(rtotalMinutes / 60);
                let rminutes = rtotalMinutes % 60;
                $rcelem = $(e.target).find('.remaining_time_total');
                $rcelem.html(isNaN(r_price)?" - ":(rhours+" óra "+rminutes.toFixed(0)+" perc"));
            },
            sort: function(event, ui) {               
            },
            stop: function( event, ui ) {
                var oparams = [];
                var i=0;
                $.each($(event.target).parents('.plan_sort').find('.connectedSortable tr'), function() {
                    let id = $(this).attr('data-record-key');
                    oparams.push({'id':id, 'plan_order':i});
                    i++;
                });
                crud_jsupdate('Orders/order_element', {ids: oparams}, function(rd){
                    $(event.target).parents('.plan_sort').jtable('reload');
                });
            },
            start: function( event, ui ) {
                $(event.target).parents('.plan_sort').jtable('closeChildTable', $(ui.item));
            }
        }); //.disableSelection();

    };

    //Activate
    $('.plan_sort').on("click",'.enable_one_finish_parent:not(input[type="checkbox"])', function(){
        $(this).find('.enable_one_finish').trigger('click');
    });
    $('.plan_sort').on("click",'.enable_one_finish', function(e){
        e.stopPropagation();
        var attrib = $(this).prop("checked");
        var rec_id = $(this).attr("rec_id");
        var active = 0;
        if(attrib){ active = 1;}
        var params = {};
        params['id']	 	= rec_id;
        params['finished'] 	= active;
        let $tr = $(this).parent().parent();
        crud_jsupdate('Orders/enable_one_finish', params, function(rd){
            if(active==1){
                $tr.addClass('green');
            }else{
                $tr.removeClass('green');
            }
        });
    });

    $('.plan_sort').on("change",'.comment_edit', function(e){
        e.stopPropagation();
        var rec_id = $(this).attr("rec_id");
        var params = {};
        params['id']	 	= rec_id;
        params['comments'] 	= $(this).val();
        crud_jsupdate('Orders/save_comment', params, function(rd){
        });
    });

    loadJtables();

    var orders_jobs = function($img, orderdata){
        orderdata.thisTable.jtable(
            'toggleChildTable',
            $img.closest('tr'),
            $img.closest('td'),
            {
                title: langJS('global_jobs')+' - '+orderdata.record.name,
                messages:jtable_lang(),
                insertDialogWidth:'900',
                editDialogWidth:'450',
                dialogShowEffect:null,
                dialogHideEffect:null,
                paging: false, //Enable paging
                sorting: false, //Enable sorting
                defaultSorting: 'ts asc', //Set default sorting
                actions: {
                        listAction:   'Orders/list_jobs_plan?order_id='+orderdata.record.id,
                },
                fields: {
                        id: {
                            key: true,
                            create: false,
                            edit: false,
                            list: false
                        },
                        order_id: {
                            type:'hidden',
                            defaultValue:orderdata.record.id,
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
                        status: {
                            title: langJS('global_status'),
                            create: false,
                            edit: true,
                            list: true,
                            sorting: true,
                            inputClass: 'sel2-100 select2-done validate[required]',
                            containerClass : 'jtabledlg-w100proc',
                            display: function(data){
                                return '<div style="background-color:'+data.record.colour+'; padding: 2px; color: white;">'+data.record.status_name+'</div>';
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
                            containerClass : 'jtabledlg-w100proc',
                            defaultValue: '1',
                            display: function(data){
                                return '<b>'+data.record.quantity+'<b>';
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
                        est_time: {
                            title: langJS('global_est_time'),
                            width: '10%',
                            create: false,
                            edit: false,
                            list: true,
                            sorting: false,
                            containerClass : 'jtabledlg-w100proc',
                            display: function(data){
                                let tot_price = (data.record.price-data.record.material_price)*parseFloat(data.record.quantity);
                                let totalMinutes = (tot_price/parseFloat(params.wage)).toFixed(2)*60;
                                let hours = Math.floor(totalMinutes / 60);
                                let minutes = totalMinutes % 60;
                                return isNaN(tot_price)?" - ":(hours+" óra "+minutes.toFixed(0)+" perc");
                            }
                        },
                        working_minutes:{
                            title: 'Valós gyártási idő',
                            width: '10%',
                            create: false,
                            edit: false,
                            list: true,
                            containerClass : 'jtabledlg-w100proc',
                            display: function(data){
                                let totalMinutes = parseFloat(data.record.working_minutes);
                                let hours = Math.floor(totalMinutes / 60);
                                let minutes = totalMinutes % 60;
                                return '<span '+(data.record.same_time==1?'style="color:red;"':'')+'>'+(isNaN(totalMinutes)?" - ":(hours+" óra "+minutes.toFixed(0)+" perc"))+'</span>';
                            }
                        },
                    },
                    rowInserted: function(event, data){
                        if (data.record.five_axis==1){
                            data.row.addClass('faxis_color');
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
};