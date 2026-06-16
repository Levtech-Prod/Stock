<div id="late_stat-container">
    <div id="late_stat-filter"></div>
    <div id="late_stat"></div>
</div>
<!--JS at the end of BODY tag - see best practices-->
<script type="text/javascript">
    $(document).ready(function () {
        var params = {
            'admin': <?= $admin ?>,
            'price_right': <?= $price_right ?>,
        };
        late_stat_view(params);
    });
</script>