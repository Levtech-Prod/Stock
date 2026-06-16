<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Main extends MY_Controller {

    var $crud_models = array('users_model','menu_rights_model');

    function __construct(){
        parent::__construct();// Call the constructor
        //$this->lang->load('global');
    }

    public function index(){
        $data = array();
		$this->load->model('users_model');
		$db_cli = db_cli_connect($this);
		$this->users_model->initialize($db_cli);            
        if($this->session->userdata('rfidLogin')){
            $sql = "SELECT id, username, email, `admin`, price_right, manager FROM users WHERE ipaddr = ? AND ((is_online = 0 and rfid!='') OR (is_online = 1 and rfid!='' and TIMESTAMPDIFF(MINUTE,last_rfid_login,NOW())>=2)) ";
            $params = array($_SERVER['REMOTE_ADDR']);
            $data = $this->users_model->query($sql, $params)->result_array()[0];
            if($data){
                $sql = "UPDATE users set is_online = 0, ipaddr=? where id = ?";
                $params = array("", $this->session->userdata('userid'));
                $res = $this->users_model->query($sql, $params);
                $this->session->unset_userdata('userid');
                $this->session->unset_userdata('username');
                $this->session->unset_userdata('email');
                $this->session->unset_userdata('admin');
                $this->session->unset_userdata('price_right');
                $this->session->unset_userdata('isLoggedIn');
                $this->session->sess_destroy();
                redirect('/Login');
            }
        }
        if($this->session->userdata('isLoggedIn')){
			$sql = "SELECT id, username, email, `admin`, price_right, manager FROM users WHERE ipaddr = ? AND is_online = 1 and rfid!='' ";
			$params = array($_SERVER['REMOTE_ADDR']);
			$data = $this->users_model->query($sql, $params)->result_array()[0];
			if($this->session->userdata('userid')!=$data['id'] && $this->session->userdata('rfidLogin')==true){
				$this->session->unset_userdata('userid');
                $this->session->unset_userdata('username');
                $this->session->unset_userdata('email');
                $this->session->unset_userdata('admin');
                $this->session->unset_userdata('price_right');
                $this->session->unset_userdata('isLoggedIn');
                $this->session->sess_destroy();
				redirect('/Login');
			}else{
				$data['menus']	= $this->menu_rights_model->list_menu_rights_enabled(false, $this->session->userdata('userid'));
				$data['username']	= $this->session->userdata('username');
				$this->load->view('main_view', $data);
			}
            //echo 'loggedin';
		}else{
            /*$this->load->model('users_model');
            $db_cli = db_cli_connect($this);
            $this->users_model->initialize($db_cli);*/
            $sql = "SELECT id, username, email, `admin`, price_right, manager FROM users WHERE ipaddr = ? AND is_online = 1 and rfid!='' ";
            $params = array($_SERVER['REMOTE_ADDR']);
            $data = $this->users_model->query($sql, $params)->result_array()[0];
            if($data){
                $ses_data = [
                    'userid' => $data['id'],
                    'username' => $data['username'],
                    'email' => $data['email'],
                    'admin' => $data['admin'],
                    'price_right' => $data['price_right'],
                    'manager' => $data['manager'],
                    'isLoggedIn' => TRUE,
                    'rfidLogin' => true
                ];
                $this->session->set_userdata($ses_data);
                return redirect('/Main');
            }else{
                $this->load->view('login_view',$data);
            }
        }
    }

    public function change_user_password(){
        $userid = $this->session->userdata('userid');
        $options 		= array();
        $options['id'] 	= $userid;
        $userdata 		= $this->users_model->get($options);

        $old_pass = request('old_password');
        $sql = "SELECT PASSWORD(?) AS pass";
        $params = array($old_pass);
        $res = $this->users_model->query($sql, $params)->result_array()[0];
        if ($userdata['password'] == $res['pass']){
            $new_pass = request('user_password');
            $sql = "UPDATE users SET `password` = PASSWORD(?) WHERE id = ?;";
            $params = array($new_pass, $userid);
            $upd = $this->users_model->query($sql, $params);
            echo json_encode(array( 'Result' => 'OK'));
        }else{
            echo json_encode(array("Result"=>"ERROR","Message"=>'A régi jelszó helytelen!'));
        }
    }

}

/* End of file main.php */
/* Location: ./application/controllers/main.php */