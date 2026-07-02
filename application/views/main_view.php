<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
    <? $this->load->view('head_meta'); ?>
    <? $this->load->view('head_css'); ?>
    <title></title>
</head>
<body class="text-selectable">

<div id="main">
    <div id="toolbar">
        <div id="main-logo-holder"  class="panel">
            <a href="" target="_blank" title="<?=STOCK_TITLE?>">
                <img id="main_logo" alt="" src="<?= build_url('images/logo_30x30.png');?>" />
            </a>
        </div>
        <div id="main-toolbar" class="panel">
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                <!-- Navbar content -->
                <div class="collapse navbar-collapse">
                    <ul class="navbar-nav">
                        <?php foreach($menus as $menu){
                            if($menu['link']==null && is_countable($menu['sub_menu'])){
                         ?>
                         <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle selected" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <?= $menu['menuname']; ?>
                            </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <?php 
                                    foreach($menu['sub_menu'] as $sub_menu){
                                        echo '<a class="dropdown-item" href="javascript:content_load(\''.$sub_menu['link'].'\');">'.$sub_menu['menuname'].'</a>';
                                    }
                                ?>
                            </div>
                         </li>
                        <?php 
                            }else{
                        ?>
                            <li class="nav-item active">
                                <a class="nav-link" href="javascript:content_load('<?= $menu['link'] ?>');"><?= $menu['menuname']; ?></a>
                            </li>
                        <?php } 
                        } ?>
                    </ul>
                </div>
                <div>
                    <a href="#" role="button" id="user_popup" class="user_link" title="Jelszó változtatás&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"><?= $username; ?></a>
                </div>
                <div>
                    <a href="<?= 'Login/logout'; ?>" class="btn btn-danger ml-3">Kilépés</a>
                </div>
            </nav>
        </div>
    </div><!--toolbar-->

<div id="system_msg" class="hidden"></div>

    <div id="workarea">
        <div id="workarea-wait" class="wait-sprite"><i class="fas fa-circle-notch fa-spin fa-3x"></i></div>

        <div id="workarea-middle" class="">
        </div>

        <div id="workarea-bottom" class=""></div>
    </div><!--workarea-->

    <div id="main-footer" class="main-footer panel">
        © <?=lang('global_stock_program');?> <?= date('Y') ?>
    </div><!--footer-->

</div><!--main-->

<div id="user-profile-dialog" class="hidden">
    <form id="user_profile_pw">
        <div class="dent-input-container w50-proc">
            <label for="old_password">Régi jelszó</label>
            <div class="dent-input">
                <input id="old_password" class="validate[minSize[5],required]" type="password" name="old_password" autocomplete="new-password" placeholder="Régi jelszó" />
            </div>
        </div>
        <div class="clear"></div>
        <div class="dent-input-container w50-proc left">
            <label for="user_password">Jelszó</label>
            <div class="dent-input">
                <input id="user_password" class="validate[minSize[5],required]" type="password" name="user_password" autocomplete="new-password" placeholder="Jelszó" />
            </div>
        </div>
        <div class="dent-input-container w50-proc left">
            <label for="confirm_user_password">Jelszó megerősítés</label>
            <div class="dent-input">
                <input id="confirm_user_password" class="validate[minSize[5], equals[user_password],required]" name="confirm_user_password" type="password" autocomplete="new-password" placeholder="Jelszó megerősítés" />
            </div>
        </div>
        <div class="clear"></div>
    </form>
</div>

<!--JS at the end of BODY tag - see best practices-->
<? $this->load->view('head_js') ?>
<script type="text/javascript">
    $(document).ready(function () {
        if($('.nav-link:first').attr('href')){
            window.location.href = $('.nav-link:first').attr('href');
        }else{
            $('#workarea-middle').html('Nincs joga a felhasználónak!');
            $('#workarea-wait').hide();
        }
        //content_load('Stock');
        $('.nav-link').on('click', function(){
            $('.nav-link').removeClass('selected');
            $(this).addClass('selected');
        });
        
        $('#user_popup').popover({
            html: true,
            template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
        }).on('shown.bs.popover	', function () {
            $button = $('<button id="password-change" type="button" class="button-red">Jelszó megváltoztatása</button>');
            $('.popover-body').html($button);
            $button.on('click',function () {
                show_pwdialog();
            });
        });

        var $user_profile = $( "#user-profile-dialog" ).dialog({
            autoOpen: false,
            modal: true,
            width: 500,
            resizable:false,
            title:'Jelszó változtatás',
            buttons: {
                "ok": {
                        text: langJS('global_ok'),
                        class: "button-blue",
                        click: function() {
                                if ($("#user_profile_pw").validationEngine('validate')){
                                    var postData = $('#user_profile_pw').serializeArray();
                                    crud_jsupdate('Main/change_user_password',postData,function(data){
                                            APP.showMessage('Jelszó', 'Jelszó változtatása sikeres.', 'Bezárás');
                                            $user_profile.dialog( "close" );
                                        },
                                        function(data){
                                        }
                                    );
                                }
                        }
                },
                "close": {
                    text: 'Bezárás',
                    class: "button-orange",
                    click: function() {
                        $user_profile.dialog( "close" );
                    }
                }
            },
            open: function() {
                //$("#user_password").passwordValidate();
            },
            close: function() {
                //$('#user-profile-dialog form')[0].reset();
                $("#user_profile_pw")[0].reset();
                $('#user_profile_pw .passwordStrengthBar1').remove();//remove passwordValidate
                $("#user_profile_pw").validationEngine('hideAll');
            }
        });

        // init the validation engine
        $("#user_profile_pw").validationEngine(validation_defaults({
            promptPosition : "topLeft",
        }));

        function show_pwdialog(){
            $user_profile.dialog( "open" );
            $('#user_popup').popover('hide')
        };

        setTimeout(function(){
            crud_jsupdate('Check_login',{},function(rd){
                if(rd.loggedin==0){
                    window.location.reload(true);
                }
            });
        },120000);
    });// end document ready
</script>
</body>
</html>