<div id="tool_stock-container">
    <div id="tool_stock_categ-filter"></div>
    <div id="tool_stock_categ"></div>
</div>
<!--JS at the end of BODY tag - see best practices-->
<script type="text/javascript">
    $(document).ready(function () {
        var params = {
            'admin': <?= $admin ?>,
            'price_right': <?= $price_right ?>,
            'userid': <?= $userid ?>,
            'categ_id': <?= $categ_id ?>,
            'categ_name': '<?= $categ_name ?>',
            'edit': '<?= $edit ?>',
            'title': '<?= $title ?>',
            'in': '<?= $in ?>',
        };
        tool_stock_categ_view(params);
    });
</script>