<div id="stock-container">
    <div id="stock-filter"></div>
    <div id="stock-summary" class="dsummary">
        <div class="dsheader"></div>
        <div class="dscontainer">
            <div class="dsbox" name="total_weight">
                <label class="dslabel">Súly összesen:</label><label class="dsvalue" id="total_weight"></label>
            </div>
        </div>
    </div>
    <div id="stock"></div>
</div>
<!--JS at the end of BODY tag - see best practices-->
<script type="text/javascript">
    $(document).ready(function () {
        var params = {};
        stock_view(params);
    });
</script>