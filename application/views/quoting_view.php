<div id="quoting-container">
    <div id="quoting-filter"></div>
    <div id="quoting"></div>
</div>

<div id="quoting-files-dialog" class='hidden'>
    <div id="quoting_files" class="w100-proc"></div>
</div>

<!--JS at the end of BODY tag - see best practices-->
<script type="text/javascript">
    $(document).ready(function () {
        var params = {
            'admin': <?= $admin ?>,
            'userid': <?= $userid ?>,
            'price_right': <?= $price_right?$price_right:0 ?>,
            'wage' 	: <?= $settings['wage'] ?>,
            'treatment' : <?= $settings['treatment'] ?>,
            'quoting' : <?= $settings['quoting'] ?>
        };
        quoting_view(params);
    });
</script>