<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
    <? $this->load->view('head_meta'); ?>
    <? $this->load->view('head_css'); ?>
    <title></title>
</head>
<body class="text-unselectable text-center">
    <div class="container" style="max-width: 400px;">
        <form class="form-signin" action="<?= build_url('index.php/Login/loginAuth'); ?>" method="post">
            <img class="mb-4" src="<?= build_url('images/logo_30x30.png');?>" alt="" width="30" height="30">
            <h1 class="h4 mb-3 font-weight-normal">Bejelentkezés</h1>
            <?php
            if($this->session->flashdata('login_error'))
            {
            ?>
                    <div class="card">
                        <div class="card-header bg-danger">Hiba</div>
                        <div class="card-body"><?= $this->session->flashdata('login_error'); ?></div>
                    </div>
                    <br/>
            <?php
            }
            ?>
            <label for="inputEmail" class="sr-only">Felhasználónév</label>
            <input type="text" name="uname" class="form-control" placeholder="Felhasználónév" required autofocus autocomplete=off>
            <br/>
            <label for="inputPassword" class="sr-only">Jelszó</label>
            <input type="password" name="pass" class="form-control" placeholder="Jelszó" required>
            <br/>
            <button class="btn btn-lg btn-primary btn-block bg-dark" type="submit">Belépés</button>
            <p class="mt-5 mb-3 text-muted">&copy; <?= date('Y') ?></p>
        </form>
    </div>
<!--JS at the end of BODY tag - see best practices-->
<? $this->load->view('head_js_login') ?>
</body>
</html>