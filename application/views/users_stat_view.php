<div id="users_stat-container">
    <div id="users_stat-filter"></div>
    <div id="users_stat"></div>
</div>
<!--JS at the end of BODY tag - see best practices-->
<script type="text/javascript">
    $(document).ready(function () {
        var params = {
            'admin': <?= $admin ?>,
            'price_right': <?= $price_right ?>,
            'wage' 	: <?= $settings['wage'] ?>,
        };
        users_stat_view(params);
    });
</script>