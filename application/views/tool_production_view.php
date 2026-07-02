<div id="production-container" style="margin-top: 20px;">
    <div id="production_list" class="production_cont" style="margin-right: 2%;">
        <div id="production_container" style="width:100%;"></div>
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
        tool_production_view(params);
    });
</script>