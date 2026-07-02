<div id="statistics-container">
    <div id="statistics-filter"></div>
    <div id="statistics-summary" class="dsummary">
        <div class="dsheader"></div>
        <div class="dscontainer">
            <div class="dsbox" name="stotal_quantity">
                <label class="dslabel">Mennyiség összesen:</label><label class="dsvalue" id="stotal_quantity"></label>
            </div>
            <div class="dsbox" name="stotal_price">
                <label class="dslabel">Ár összesen:</label><label class="dsvalue" id="stotal_price"></label>
            </div>
            <div class="dsbox" name="stotal_mat_price">
                <label class="dslabel">Nyersanyag ár összesen:</label><label class="dsvalue" id="stotal_mat_price"></label>
            </div>
            <div class="dsbox" name="stotal_est_time">
                <label class="dslabel">Becsült idő összesen:</label><label class="dsvalue" id="stotal_est_time"></label>
            </div>
            <div class="dsbox" name="stotal_working_hour">
                <label class="dslabel">Valós gyártási idő összesen:</label><label class="dsvalue" id="stotal_working_hour"></label>
            </div>
        </div>
    </div>
    <div id="statistics"></div>
</div>
<div class="separator_line"></div>
<h3 class="chart_title" style="float: left; margin-right: 20px;">Összesítés</h3>
<div class="dent-input-container w15-proc">
    <label for="currency">Felbontás:</label>
    <div class="dent-input">
        <input type="text" id="range" name="range" value="0" class="select2 sel2-100" />
    </div>
</div>
<div class="clear"></div>
<div id="flot-placeholder" class="left w98-proc plot_holder" style="height:300px; margin-top:10px; margin-bottom:10px;"></div>
<div id="plot_holder_hover1" class="flot-time-chart-hover plot_holder_hover"></div>
<div class="clear"></div>
<div id="flot-placeholder2" class="w98-proc plot_holder" style="height:300px; margin-top:10px; margin-bottom:10px;"></div>
<div id="plot_holder_hover2" class="flot-time-chart-hover plot_holder_hover2"></div>
<div class="clear"></div>
<div class="separator_line"></div>
<h4><?= lang('global_machine_using'); ?></h4>
<div id="machine_using_filter"></div>
<div id="machine_using"></div>
<div class="separator_line"></div>
<h4><?= lang('global_qc'); ?></h4>
<div id="qc_filter"></div>
<div id="qc_using"></div>
<!--JS at the end of BODY tag - see best practices-->
<script type="text/javascript">
    $(document).ready(function () {
        var params = {
            'admin': <?= $admin ?>,
            'price_right': <?= $price_right ?>,
            'wage' 	: <?= $settings['wage'] ?>,
        };
        statistics_view(params);
    });
</script>