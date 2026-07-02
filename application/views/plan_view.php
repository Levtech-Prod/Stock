<div id="plan-container">
    <div style="font-weight:bold; font-size: 17px;"><?= lang('global_total_hour') ?>: <span class="plan_tot"></span></div>
    <div id="plan_1" class="plan_sort" data-day="1"></div>
    <div id="plan_2" class="plan_sort" data-day="2"></div>
    <div id="plan_3" class="plan_sort" data-day="3"></div>
    <div id="plan_4" class="plan_sort" data-day="4"></div>
    <div id="plan_5" class="plan_sort" data-day="5"></div>
</div>
<!--JS at the end of BODY tag - see best practices-->
<script type="text/javascript">
    $(document).ready(function () {
        var params = {
            'admin': <?= $admin ?>,
            'price_right': <?= $price_right ?>,
            'wage' 	: <?= $settings['wage'] ?>,
        };
        plan_view(params);
    });
</script>