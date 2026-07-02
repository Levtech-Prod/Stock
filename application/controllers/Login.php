<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');


class Login extends CI_Controller {

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
                $this->logout();
            }else{
				$sql = "SELECT id, username, email, `admin`, price_right, manager FROM users WHERE ipaddr = ? AND is_online = 1 and rfid!='' ";
				$params = array($_SERVER['REMOTE_ADDR']);
				$data = $this->users_model->query($sql, $params)->result_array()[0];
				if($this->session->userdata('userid')!=$data['id']){
					$this->logout();
				}else{
					redirect('Main');
				}
            }
        }elseif($this->session->userdata('isLoggedIn')){
			redirect('Main');
		}else{
            $this->load->model('users_model');
            $db_cli = db_cli_connect($this);
            $this->users_model->initialize($db_cli);
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

    public function loginAuth(){
        $this->load->model('users_model');
        $db_cli = db_cli_connect($this);
        $this->users_model->initialize($db_cli);
        $req = request();
        $username = trim($req["uname"]);
        $password = trim($req["pass"]);
        
        if(!empty(trim($username)) && !empty(trim($password))){
            $sql = "SELECT id, username, email, `admin`, price_right, manager FROM users WHERE username = ? AND PASSWORD(?) = password";
            $params = array($username, $password);
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
                    'rfidLogin' => false
                ];
                $this->session->set_userdata($ses_data);
                return redirect('/Main');
            } else{
                $this->session->set_flashdata('login_error', 'Hibás felhasználónév vagy jelszó!');
                return redirect('/Login');
            }
        }else{
            $this->session->set_flashdata('login_error','Kérem adja meg a felhasználónevet és a jelszót!');
        }
    }

    public function logout(){
        $this->load->model('users_model');
        $db_cli = db_cli_connect($this);
        $this->users_model->initialize($db_cli);
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

/* End of file welcome.php */
/* Location: ./application/controllers/login.php */