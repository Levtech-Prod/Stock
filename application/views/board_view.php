<div id="board-container">
    <div id="board-filter"></div>
    <div id="board-summary" class="dsummary" style="position: sticky; width: 900px; display: inline-block; left: 0;">
        <div class="dsheader"></div>
        <div class="dscontainer" style="text-align:left">
            <div class="dsbox" name="total_est">
                <label class="dslabel">Becsült idő összesen:</label><label class="dsvalue" id="total_est"></label>
            </div>
            <div class="dsbox" name="stotal_working_hour">
                <label class="dslabel">Valós gyártási idő összesen:</label><label class="dsvalue" id="stotal_working_hour"></label>
            </div>
        </div>
    </div>
    <div id="kanban"></div>
</div>
<!--JS at the end of BODY tag - see best practices-->
<script type="text/javascript">
    $(document).ready(function () {
        var params = {
            'admin': <?= $admin ?>,
            'userid': <?= $userid ?>,
            'wage' 	: <?= $settings['wage'] ?>,
        };
        board_view(params);
    });
</script>