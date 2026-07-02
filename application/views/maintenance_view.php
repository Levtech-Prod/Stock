<div id="maintenance-container" style="margin-top: 20px;">
    <div id="main_year_filter" class="dfilter" style="margin-top: 30px; margin-bottom: 10px; padding: 5px; font-weight: bold;"></div>
    <div id="maintenance_list" class="maintenance_cont" style="margin-right: 2%;">
        <div id="maintenance_container" style="width:100%;">
            <div class="main_item_container">
                <div class="main_header_cont"><span class="main_number" id="number_item"></span><span class="main_header"><?=lang('global_maintenance_week')?></span></div>
                <div id="main_week"></div>
            </div>
        </div>
        <div id="maintenance_container" style="width:100%;">
            <div class="main_item_container">
                <div class="main_header_cont"><span class="main_number" id="number_item"></span><span class="main_header"><?=lang('global_maintenance_month')?></span></div>
                <div id="main_month"></div>
            </div>
        </div>
        <div id="maintenance_container" style="width:100%;">
            <div class="main_item_container">
                <div class="main_header_cont"><span class="main_number" id="number_item"></span><span class="main_header"><?=lang('global_maintenance_semester')?></span></div>
                <div id="main_semester"></div>
            </div>
        </div>
    </div>
    <div class="clear"></div>
</div>
<!--JS at the end of BODY tag - see best practices-->
<script type="text/javascript">
    $(document).ready(function () {
        var params = {
            'admin': <?= $admin ?>,
            'userid': <?= $userid ?>,
            'machineid': <?= $machineid ?>,
        };
        maintenance_view(params);
    });
</script>