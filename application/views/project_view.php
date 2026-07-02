<div id="project-container">
    <div id="project-filter"></div>
    <!--<div id="project-summary" class="dsummary" style="position: sticky; width: 400px; display: inline-block; left: 0;">
        <div class="dsheader"></div>
        <div class="dscontainer" style="text-align:left">
            <div class="dsbox" name="total_est">
                <label class="dslabel">Becsült idő összesen:</label><label class="dsvalue" id="total_est"></label>
            </div>
        </div>
    </div>-->
    <div class="btn_container" style="display: inline-block; float: left; margin: 8px 5px;"><button type="button" class="new_project button-blue"><?= lang('global_new_project') ?></button></div>
    <div id="project_kanban"></div>
</div>
<!--JS at the end of BODY tag - see best practices-->
<script type="text/javascript">
    $(document).ready(function () {
        var params = {
            'admin': <?= $admin ?>,
            'userid': <?= $userid ?>
        };
        project_view(params);
    });
</script>