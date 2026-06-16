<div id="jobs_status-container">
    <div id="jobs_status"></div>
</div>
<div class="separator_line"></div>
<div class="dent-input-container w15-proc">
    <label for="currency">Órabér:</label>
    <div class="dent-input">
        <input type="text" id="wage" name="wage" class='editable' maxlength="3" value="<?=$settings['wage']?>"/>
    </div>
</div>
<div class="dent-input-container w15-proc">
    <label for="currency"><?=lang('global_treatment')?>:</label>
    <div class="dent-input">
        <input type="text" id="treatment" name="treatment" class='editable' maxlength="3" value="<?=$settings['treatment']?>"/>
    </div>
</div>
<div class="dent-input-container w15-proc">
    <label for="currency">Ajánlatok órabére:</label>
    <div class="dent-input">
        <input type="text" id="quoting" name="quoting" class='editable' maxlength="3" value="<?=$settings['quoting']?>"/>
    </div>
</div>
<div class="dent-input-container w15-proc">
    <label for="currency"><?=lang('global_invoice_nr')?>:</label>
    <div class="dent-input">
        <input type="text" id="invoice_nr" name="invoice_nr" class='editable' maxlength="3" value="<?=$settings['invoice_nr']?>"/>
    </div>
</div>
<div class="clear"></div>
<div class="separator_line"></div>
<button type="button" name="do_archive" id="do_archive" class="button-blue">Darabok archíválása</button>
<div class="clear"></div>
<div class="separator_line"></div>
<div id="quoting_status"></div>
<div class="separator_line"></div>
<div id="clients"></div>
<div class="separator_line"></div>
<div id="handlings"></div>
<!--JS at the end of BODY tag - see best practices-->
<script type="text/javascript">
    $(document).ready(function () {
        var params = {};
        jobs_status_view(params);
    });
</script>