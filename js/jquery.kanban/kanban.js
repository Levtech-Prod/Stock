(function($) {

    $.fn.kanban = function(options) {

       // defaults

        var $this = $(this);

        var settings = $.extend({
            titles: ['Block 1', 'Block 2', 'Block 3', 'Block 4'],
            colours: [],
            items: [],
            onChange: function(e,ui){},
            onReceive: function(e,ui){},
            onBeforeStop: function(e,ui){}
        }, options)

        var classes = {
            kanban_board_class: "cd_kanban_board",
            kanban_board_titles_class: "cd_kanban_board_titles",
            kanban_board_title_class: "cd_kanban_board_title",
            kanban_board_blocks_class: "cd_kanban_board_blocks",
            kanban_board_block_class: "cd_kanban_board_block",
            kanban_board_item_class: "cd_kanban_board_block_item",
            kanban_board_item_placeholder_class: "cd_kanban_board_block_item_placeholder",
            kanban_board_item_title_class: "cd_kanban_board_block_item_title",
            kanban_board_item_footer_class: "cd_kanban_board_block_item_footer",
            kanban_board_item_img_class: "cd_kanban_board_block_item_img",
            kanban_board_item_received_class: "cd_kanban_board_block_item_received"
        };

        function build_kanban(){

            $this.addClass(classes.kanban_board_class);
            $this.append('<div class="'+classes.kanban_board_titles_class+'"></div>');
            $this.append('<div class="'+classes.kanban_board_blocks_class+'"></div>');

            build_titles();
            build_blocks();
            build_items();

        }

        function build_titles() {

            settings.titles.forEach(function (item, index, array) {
                var titem = '<div style="background: '+(item.colour?item.colour:'#7C7C7C')+'" class="' + classes.kanban_board_title_class + '">' + '<p>'+item.title+'</p>' + '<span class="est_time_block" id="est_'+item.id+'">0</span><span class="element_number" id="block_'+item.id+'"></span></div>';
                $this.find('.'+classes.kanban_board_titles_class).append(titem);
            });

        }

        function build_blocks() {
            settings.titles.forEach(function (item, index, array) {
                var bitem = '<div class="' + classes.kanban_board_block_class + '" data-block="'+item.id+'" data-type="'+item.type+'" data-sm="'+item.show_message+'" data-m="'+item.message+'"></div>';
                $this.find('.'+classes.kanban_board_blocks_class).append(bitem);
            });

            var currentlyScrolling = false;
            var SCROLL_AREA_WIDTH = 40; // Distance from window's top and bottom edge.
            $( "."+classes.kanban_board_block_class ).sortable({
                connectWith: "."+classes.kanban_board_block_class,
                containment: "."+classes.kanban_board_blocks_class,
                placeholder: classes.kanban_board_item_placeholder_class,
                scroll: false,
                cursor: "move",
                change: settings.onChange,
                receive: settings.onReceive,
                beforeStop: settings.onBeforeStop,
                sort: function(event, ui) {
                    if (currentlyScrolling) {
                        return;
                    }
            
                    var windowWidth   = $(window).width();
                    var mouseXPosition = event.clientX;
            
                    if (mouseXPosition < SCROLL_AREA_WIDTH) {
                        currentlyScrolling = true;
                
                        $('html, body').animate({
                            scrollLeft: "-=" + windowWidth / 2 + "px" // Scroll up half of window height.
                        }, 
                        200, // 400ms animation.
                        function() {
                            currentlyScrolling = false;
                        });
            
                    } else if (mouseXPosition > (windowWidth - SCROLL_AREA_WIDTH)) {
            
                        currentlyScrolling = true;
                
                        $('html, body').animate({
                            scrollLeft: "+=" + windowWidth / 2 + "px" // Scroll down half of window height.
                        }, 
                        200, // 400ms animation.
                        function() {
                            currentlyScrolling = false;
                        });
            
                    }                
                },
                update: settings.onStop
            }).disableSelection();

        }

        function build_items(){
            settings.items.forEach(function (item , index , array) {
                var block = $this.find('.'+classes.kanban_board_block_class+'[data-block="'+item.block+'"]');
                var append =  '<div class="'+classes.kanban_board_item_class+'" data-est="'+item.est_time+'" log-id="'+(item.work_log_id?item.work_log_id:'')+'" data-id="'+item.id+'" data-five="'+(item.five_axis?item.five_axis:'')+'" data-status="'+item.status+'" >';
                        append += '<div class="'+classes.kanban_board_item_title_class+'" style="'+(item.five_axis==1?'background-color:#f8f151;':'')+'">'+item.title+'<div class="series_div" style="'+(parseFloat(item.quantity)>=5?"background-color:#5198f9":"")+'"></div></div>';

                        if(item.link){
                            append += '<a href="'+item.link+'">'+item.link_text+'</a>';
                        }

                        if(item.footer){
                            append += '<div class="'+classes.kanban_board_item_footer_class+'" '+(item.in_work==1?'style="background-color:#a6ffa6;"':'')+'>'+item.footer+'</div>';
                        }
                        if(item.image_url){
                            append += '<div class="'+classes.kanban_board_item_img_class+'"><img style="width: 100%;" src="'+item.image_url+'" ></div>';
                        }
                        append += '<div class="'+classes.kanban_board_item_received_class+'" '+(item.material_received==1?'style="background-color:#017c21;"':'')+'></div>';

                    append += '</div>';



                block.append(append);
            });
        }

        build_kanban();

    }

}(jQuery));
