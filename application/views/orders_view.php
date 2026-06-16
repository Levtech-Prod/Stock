<div id="orders-container">
    <div id="orders-filter"></div>
    <div id="orders"></div>
    <div id="uploader_price" style="display:none;">
        <button type="button" id="import-file-hack"><?=lang('global_ok');?></button>
    </div>
</div>

<div id="files-dialog" class='hidden'>
    <div id="jobs_files" class="w100-proc"></div>
</div>

<div id="order-files-dialog" class='hidden'>
    <div id="orders_files" class="w100-proc"></div>
</div>

<div id="order-po-dialog" class='hidden'>
    <div id="po_attachment_div" class="w100-proc">
        <label for=""><?= lang('global_po');?></label>
        <div id="po_attachments_list"></div>
        <div id="add_po_attachments_container">
            <div id="add_po_attachments_text">Húzza ide a fájlokat</div>
            <button type="button" id="add_po_attachments_button" class="button-blue">Fájlok kiválasztása</button>
        </div>
    </div>
    <div id="orders_po" class="w100-proc"></div>
</div>

<div id="blind_dialog" class="hidden">
    <form id="blind_form">
        <div class="dent-input-container w100-proc">
            <label for="job_name"><?=lang('global_name')?></label>
            <div class="dent-input">
                <input type="text" id="job_name" name="name" class="w100-proc validate[required]" value="" />
            </div>
        </div>
        <div class="dent-input-container w50-proc">
            <label for="job_status"><?=lang('global_status')?></label>
            <div class="dent-input">
                <input type="text" id="job_status" name="status" class="sel2-100 select2-done validate[required]" value="0" />
            </div>
        </div>
        <div class="dent-input-container w50-proc">
            <label for="job_quantity"><?=lang('global_quantity')?></label>
            <div class="dent-input">
                <input type="text" id="job_quantity" name="quantity" class="w100-proc validate[required]" value="1" />
            </div>
        </div>
        <div class="dent-input-container w100-proc">
            <label for="job_estimate_time"><?=lang('global_work_time')?></label>
            <div class="dent-input">
                <input type="text" id="job_estimate_time" name="estimate_time" class="w100-proc validate[required]" value="" />
            </div>
        </div>
        <input type="hidden" id="job_blind_job" name="blind_job" value="1" />
        <input type="hidden" id="job_order_id" name="order_id" />
    </form>
</div>

<!--JS at the end of BODY tag - see best practices-->
<script type="text/javascript">
    $(document).ready(function () {
        var params = {
            'admin': <?= $admin ?>,
            'userid': <?= $userid ?>,
            'price_right': <?= $price_right?$price_right:0 ?>,
            'manager': <?= $manager?$manager:0 ?>,
            'wage' 	: <?= $settings['wage'] ?>,
            'treatment' : <?= $settings['treatment'] ?>,
            'invoice_nr' 	: <?= $settings['invoice_nr']?$settings['invoice_nr']:1; ?>,
        };
        orders_view(params);
    });
</script>