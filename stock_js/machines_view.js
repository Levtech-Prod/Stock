var machines_view = function(params){
    function load_categ(){
        crud_jsupdate('Machine_settings/list_machines', function(retData){
            $('#machines').html('');
            let categs = retData.Records;
            $.each(categs, function(i, item) {
                var $item = build_item(item);
                $('#machines').append($item);
            });
            
        });
    };


    var build_item = function(item, button = true){
        var $categ = $('<div class="categ_item_container"><a href="javascript:content_load(\'Maintenance\', {machineid: '+item.id+', machine_name: \''+item.name+'\'});" style="display: block; height: 150px; cursor:pointer;"><img style="width:100%; height: 100%;" src="'+base_url()+(item.image?'upload/images/'+item.image:'images/image_not_available.png')+'?'+ new Date().getTime()+'"></img></a><span class="name_cont">'+item.name+'</span></div>');
      return $categ;
    };

    load_categ();

};