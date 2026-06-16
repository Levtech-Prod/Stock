<div id="invoices-container">
    <div id="invoices-filter"></div>
    <div id="invoices"></div>
</div>
<!--JS at the end of BODY tag - see best practices-->
<script type="text/javascript">
    $(document).ready(function () {
        var params = {};
        invoices_view(params);
    });
</script>