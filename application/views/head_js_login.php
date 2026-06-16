    <!--<script type="text/javascript" src="<?=build_static_url('js/console.js')?>"></script>-->
    <script type="text/javascript" src="<?=build_static_url('js/jquery/jquery-2.2.4.min.js')?>"></script>
    <script type="text/javascript" src="<?=build_static_url('js/jquery.ui/jquery-ui.1.11.4.min.js')?>"></script>
    <!--jQuery UI-->
    <script type="text/javascript" src="<?=build_static_url('js/jquery.ui/jquery-ui.1.11.4.js')?>"></script>
    <!--jQuery UI-->
    <script type="text/javascript" src="<?=build_static_url('js/jquery.ui/i18n/jquery-ui-i18n.js')?>"></script>

    <!-- bootstrap bundle includes poper but not jquery-->
    <script src="<?=build_static_url('js/bootstrap/bootstrap.bundle.min.js')?>"></script>
    <script src="<?=build_static_url('js/bootstrap/bootstrap-treeview.js')?>"></script>

    <script type="text/javascript" src="<?=build_static_url('stock_js/head.js')."?ts=".time()?>"></script>

    <script type="text/javascript" src="<?=build_static_url('js/functions.js')."?ts=".time()?>"></script>
    <script type="text/javascript" src="<?=build_static_url('js/lang.js')?>"></script>


<script type="text/javascript" >
    (function(){
        var params = [];
        params['GLOBAL_LANG'] = <?=json_encode(get_global_lang());?>;
        params['GLOBAL_CONST'] = <?=json_encode(get_type_constants());?>;
        params['base_url'] = "<?=base_url();?>";
        
        $(document).ready(function () {
            head_init(params);
        });
    })();
</script>
