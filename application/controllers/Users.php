<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Users extends MY_Controller {

    var $crud_models = array('users_model');

    function __construct(){
        parent::__construct();
    }

    public function index(){
        $this->load->view('users_view');
    }

    public function list_users(){
        echo $this->users_model->crud_list();
    }

    public function update_users(){
        //echo $this->users_model->crud_update();
        $req = request();
        $price_right = $req['price_right']==1?1:0;
        $admin = $req['admin']==1?1:0;
        if($req["password"]){
            $sql = "UPDATE users SET username = ?, email = ?, `password` = PASSWORD(?), phone = ?, `admin`=?, price_right = ?, rfid = ? WHERE id = ?;";
            $params = array($req["username"], $req["email"], $req["password"], $req["phone"], $admin, $price_right, $req['rfid'], $req['id']);
        }else{
            $sql = "UPDATE users SET username = ?, email = ?, phone = ?, `admin`=?, price_right = ?, rfid = ? WHERE id = ?;";
            $params = array($req["username"], $req["email"], $req["phone"], $admin, $price_right, $req['rfid'], $req['id']);
        }
        $upd = $this->users_model->query($sql, $params);
        echo json_encode(array( 'Result' => 'OK'));
    }

    public function create_users(){
        //echo $this->users_model->crud_create();
        $req = request();
        $sql = "INSERT INTO users(username, email, `password`, phone, `admin`, created_at, rfid) VALUES(?, ?, PASSWORD(?), ?, 0, now(), ?);";
        $params = array($req["username"], $req["email"], $req["password"], $req["phone"], $req['rfid']);
        $new = $this->users_model->query($sql, $params);

        $result = $this->users_model->query("SELECT * FROM users WHERE id = LAST_INSERT_ID();", array());
		$row = $result->result_array();
        echo json_encode(array( 'Result' => 'OK', 'Record'=>$row[0]));
    }

    public function delete_users(){
        echo $this->users_model->crud_delete();
    }

    public function update_user_flags(){
        $req = request();
        $options = array();
        $options['id'] 				= request('id');
        $ses_data = $this->session->userdata();
        if($ses_data['userid'] == $options['id']){
            $this->session->set_userdata('price_right', $req['price_right']);
            $this->session->set_userdata('manager', $req['manager']);
        }
        echo $this->users_model->crud_update($options);
    }

    public function sel2_users(){
        echo $this->users_model->xsel2_sel2_users();
    }
}

/* End of file users.php */