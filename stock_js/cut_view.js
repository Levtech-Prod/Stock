var cut_view = function(params){

    function history_load(limit=10, offset=0){
        crud_jsupdate('Cut/getcut_history', {jtPageSize: limit, jtStartIndex: offset}, function(retData){
            $('#cut_history_container').html('');
            let cut = retData.Records;
            $.each(cut, function(i, item) {
                var $item = build_cut_item(item, false);
                $('#cut_history_container').append($item);
            });
            $pp = $('<div id="pp" style="background:#efefef;border:1px solid #ccc;"></div>');
            $('#cut_history_container').append($pp);
            $pp.pagination({
                total:parseInt(retData.TotalRecordCount),
                pageSize:limit,
                pageNumber:parseInt(retData.page),
                pageList: [5,10,20,50,100],
                onSelectPage: function(pageNumber, pageSize){
                    let stindex = (pageNumber==1?0:pageNumber-1)*pageSize;
                    history_load(pageSize, stindex);
                }
            });
        });
    };

    
    function load_cut(){
        crud_jsupdate('Cut/getcut', function(retData){
            $('#cut_waiting_container').html('');
            let cut = retData.cut;
            $.each(cut, function(i, item) {
                var $item = build_cut_item(item);
                $('#cut_waiting_container').append($item);

                $item.find('.button_cut').on('click', function(){
                    crud_jsupdate('Cut/update_materials_cut',{id: item.id, cut: 1}, function(retData){
                        load_cut();
                        history_load();
                    });
                });

                $item.find('.button_delete').on('click', function(){
                    APP.showDlg(langJS('global_confirm'),langJS('global_confirm_text'),langJS('global_yes'),langJS('global_no'), function(){
                        crud_jsupdate('Cut/delete_materials_cut',{id: item.id}, function(retData){
                            load_cut();
                        });
                    });
                });

                $item.find('.button_modify').on('click', function(){
                    cutDialog(item);
                });
            });
            
        });
    };

    load_cut();

    history_load();

    var build_cut_item = function(item, button = true){
        var $cut = $('<div class="cut_item_container">'+
            'Rendelés azonosító: '+(item.order_id?item.order_id:' - ')+'<br/>'+
            'Pozíció név: '+(item.job_name?item.job_name:' - ')+'<br/><br/>'+
            '<input type="text" id="stock_id" name="stock_id" class="px50" value="'+item.stock_id+'" readonly /> - <input type="text" id="mch" class="px60" value="'+parseFloat(item.height)+'" readonly /> X <input type="text" id="mcw" class="px60" value="'+parseFloat(item.width)+'" readonly /> X <input type="text" id="mcl" value="'+parseFloat(item.length)+'" class="px60" readonly /> - <input type="text" id="mc_shelf" class="px50" value="'+item.shelf+'" readonly /><br/>'+
            '<span style="width:110px; display: inline-block;">&nbsp;</span>|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<span style="width:90px; display: inline-block;">&nbsp;</span>|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<span style="width:90px; display: inline-block;">&nbsp;</span>|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br/>'+
            '<input type="text" id="mc_code" class="px50" value="'+item.material_code+'" readonly />&nbsp;&nbsp;<input type="text" id="height_qty" name="height_qty" class="px30" value="'+(item.height_qty?item.height_qty:'')+'" readonly /> X <input type="text" id="cheight" name="cheight" class="px30" value="'+parseFloat(item.cheight)+'" readonly/> &nbsp;&nbsp;&nbsp; <input type="text" id="width_qty" name="width_qty" class="px30" value="'+(item.width_qty?item.width_qty:'')+'" readonly /> X <input type="text" id="cwidth" name="cwidth" class="px30" value="'+parseFloat(item.cwidth)+'" readonly  /> &nbsp;&nbsp;&nbsp; <input type="text" id="length_qty" name="length_qty" class="px30" value="'+(item.length_qty?item.length_qty:'')+'" readonly /> X <input type="text" id="clength" name="clength" class="px30" value="'+parseFloat(item.clength)+'" readonly /><br/><br/>'+
            '<input type="text" id="squantity" name="squantity" class="px50" value="'+item.squantity+'" readonly/> / <input type="text" id="take_qty" name="take_qty" class="px50" value="'+item.take_qty+'" readonly /><br/><br/>'+
            (button?'<button type="button" class="button_cut button-blue">Levágva</button> &nbsp; <button type="button" class="button_modify button-green">Módosítás</button> &nbsp; <button type="button" class="button_delete button-red">Törlés</button>':('Levágás dátuma: <b>'+item.ts+'</b>'))+
      '</div>');
      return $cut;
    };

    var cutDialog = function(data){
        var $cut = $('<div class="cut_container"><form id="cut_form">'+
            'ID: <input type="text" id="stock_id" name="stock_id" class="px50" /> - <input type="text" id="mch" class="px60" readonly /> X <input type="text" id="mcw" class="px60" readonly /> X <input type="text" id="mcl" class="px60" readonly /> <br/>'+
            '<span style="width:145px; display: inline-block;">&nbsp;</span>|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<span style="width:90px; display: inline-block;">&nbsp;</span>|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<span style="width:90px; display: inline-block;">&nbsp;</span>|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br/>'+
            'Kód: <input type="text" id="mc_code" class="px50" readonly />&nbsp;&nbsp;<input type="text" id="height_qty" name="height_qty" class="px30" /> X <input type="text" id="cheight" name="cheight" class="px30"/> &nbsp;&nbsp;&nbsp; <input type="text" id="width_qty" name="width_qty" class="px30"/> X <input type="text" id="cwidth" name="cwidth" class="px30" /> &nbsp;&nbsp;&nbsp; <input type="text" id="length_qty" name="length_qty" class="px30" /> X <input type="text" id="clength" name="clength" class="px30"/><br/><br/>'+
            'Polc: <input type="text" id="mc_shelf" class="px50" readonly /> Db: <input type="text" id="squantity" name="squantity" class="px60" readonly/> / Elvesz: <input type="text" id="take_qty" name="take_qty" class="px60" />'+
            '<input type="hidden" id="id" name="id" class="px60" /></form>'+
        '</div>');
        var $container 	= $("<div></div>").html($cut);
        $('body').append($container);
        var $dialog = $container.dialog({
            title: 'Új vágás',
            resizable: false,
            width:550,
            modal: true,
            autoOpen:true,
            buttons: [{
                text:langJS('global_ok'),
                'class': "button-green",
                click: function() {
                    var serialdata = $cut.find('#cut_form').serializeArray();
                    crud_jsupdate('Orders/create_materials_cut',serialdata,function(data){
                        load_cut();
                        $dialog.dialog("close");
                    },function (data){});
                }
            },{
                text:langJS('global_cancel'),
                'class': "button-orange",
                click: function() {
                    $(this).dialog("close");
                }
            }],
            create: function(ev, ui){
            },
            open: function(ev, ui){
                $cut.find('#stock_id').on('change',function(){
                    crud_jsupdate('Stock/get_stock',{id:$(this).val()}, function(rec){
                        if(rec.stock){
                            let data = rec.stock;
                            $cut.find('#mch').val(data.height);
                            $cut.find('#mcw').val(data.width);
                            $cut.find('#mcl').val(data.length);
                            $cut.find('#mc_code').val(data.material_code);
                            $cut.find('#mc_shelf').val(data.shelf);
                            $cut.find('#squantity').val(data.quantity);
                        }
                    });
                });

                if(data){
                    $cut.find('#stock_id').val(data.stock_id);
                    $cut.find('#take_qty').val(data.take_qty);

                    $cut.find('#mch').val(parseFloat(data.height));
                    $cut.find('#mcw').val(parseFloat(data.width));
                    $cut.find('#mcl').val(parseFloat(data.length));
                    $cut.find('#mc_code').val(data.material_code);
                    $cut.find('#mc_shelf').val(data.shelf);
                    $cut.find('#squantity').val(data.quantity);
                    
                    $cut.find('#height_qty').val(data.height_qty);
                    $cut.find('#width_qty').val(data.width_qty);
                    $cut.find('#length_qty').val(data.length_qty);

                    $cut.find('#cheight').val(parseFloat(data.cheight));
                    $cut.find('#cwidth').val(parseFloat(data.cwidth));
                    $cut.find('#clength').val(parseFloat(data.clength));
                    $cut.find('#id').val(data.id);
                }
            },
            close: function(){
                $(this).dialog("destroy").remove();
            },
        });
    };

    $('.button_add_cut').on('click', function(){
        cutDialog();
    });
    
};