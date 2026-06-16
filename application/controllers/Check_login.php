<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');


class Check_login extends CI_Controller {

    function __construct(){
        parent::__construct();// Call the constructor
        $this->lang->load('global');
    }

    public function index(){
        if($this->session->userdata('rfidLogin')){
            $this->load->model('users_model');
            $db_cli = db_cli_connect($this);
            $this->users_model->initialize($db_cli);
            $sql = "SELECT id, username, email, `admin`, price_right, manager FROM users WHERE ipaddr = ? AND ((is_online = 0 and rfid!='') OR (is_online = 1 and rfid!='' and TIMESTAMPDIFF(MINUTE,last_rfid_login,NOW())>=2)) ";
            $params = array($_SERVER['REMOTE_ADDR']);
            $data = $this->users_model->query($sql, $params)->result_array()[0];
            if($data){
                $this->session->unset_userdata('userid');
                $this->session->unset_userdata('username');
                $this->session->unset_userdata('email');
                $this->session->unset_userdata('admin');
                $this->session->unset_userdata('price_right');
                $this->session->unset_userdata('isLoggedIn');
                $this->session->sess_destroy();
                echo json_encode(array( 'Result'=>'OK', 'loggedin'=>0));
            }else{
				$sql = "SELECT id, username, email, `admin`, price_right, manager FROM users WHERE ipaddr = ? AND is_online = 1 and rfid!='' ";
				$params = array($_SERVER['REMOTE_ADDR']);
				$data = $this->users_model->query($sql, $params)->result_array()[0];
				if($this->session->userdata('userid')!=$data['id'] && $this->session->userdata('rfidLogin')==true){
					echo json_encode(array( 'Result'=>'OK', 'loggedin'=>0));
				}else{
					echo json_encode(array( 'Result'=>'OK', 'loggedin'=>1));
				}
            }
        }else{
            echo json_encode(array( 'Result'=>'OK', 'loggedin'=>1));
        }
    }

}

/* End of file welcome.php */
/* Location: ./application/controllers/login.php */