<div id="tool_stock-container">
    <div id="tool_stock-filter"></div>
    <div id="tool_stock" class="tool_out_table"></div>
    <div class="clear"></div>
    <div id="categ_container" style="width:100%;"></div>
</div>
<!--JS at the end of BODY tag - see best practices-->
<script type="text/javascript">
    $(document).ready(function () {
        var params = {
            'admin': <?= $admin ?>,
            'price_right': <?= $price_right ?>,
            'userid': <?= $userid ?>
        };
        tool_out_view(params);
    });
</script>