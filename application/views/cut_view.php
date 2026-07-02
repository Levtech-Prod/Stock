<div id="cut-container" style="margin-top: 20px;">
    <div id="cut_waiting_list" class="cut_cont" style="margin-right: 2%;">
        <div><h4 style="text-align: center;"><?= lang('global_wait_cut'); ?></h4><button type="button" class="button_add_cut button-blue" style="position: absolute; top: 5px; left: 15px;" disabled>Új vágás</button></div>
        <div id="cut_waiting_container" style="width:100%;"></div>
    </div>
    <div id="cut_history_list" class="cut_cont">
    <h4 style="text-align: center;"><?= lang('global_wait_history'); ?></h4>
    <div id="cut_history_container" style="width:100%;"></div>
    </div>
    <div class="clear"></div>
</div>
<!--JS at the end of BODY tag - see best practices-->
<script type="text/javascript">
    $(document).ready(function () {
        var params = {
            'admin': <?= $admin ?>,
            'userid': <?= $userid ?>
        };
        cut_view(params);
    });
</script>