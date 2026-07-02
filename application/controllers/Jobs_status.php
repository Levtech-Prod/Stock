<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Jobs_status extends MY_Controller {

    var $crud_models = array('jobs_status_model', 'settings_model', 'quoting_status_model', 'clients_model', 'handlings_model', 'jobs_status_rights_model');

    function __construct(){
        parent::__construct();
    }

    public function index(){
        $data = array();
        $data['settings'] = $this->settings_model->get_rec(1);
        $this->load->view('jobs_status_view', $data);
    }

    public function list_jobs_status(){
        echo $this->jobs_status_model->crud_list();
    }

    public function update_jobs_status(){
        echo $this->jobs_status_model->crud_update();
    }

    public function create_jobs_status(){
        echo $this->jobs_status_model->crud_create();
    }

    public function delete_jobs_status(){
        echo $this->jobs_status_model->crud_delete();
    }

    public function sel2_status(){
        echo $this->jobs_status_model->xsel2_jobs_status();
    }

    public function order_element(){
        $id			= request('id');
        $direction  = request('direction');
        $this->jobs_status_model->order_element($id,$direction);
        echo json_encode(array('Result'=>'OK'));
    }

    public function change_wage(){
        echo $this->settings_model->crud_update();
    }

    public function do_archive(){
        $sql = "update jobs SET archived=1 WHERE `STATUS`=-2 AND date(rec_modified)<= DATE_ADD(CURDATE(),INTERVAL -2 WEEK) and archived=0";
        $params = array();
        $res = $this->jobs_status_model->query($sql, $params);
        echo json_encode(array('Result' => 'OK'));
    }


    public function list_quoting_status(){
        echo $this->quoting_status_model->crud_list();
    }

    public function update_quoting_status(){
        echo $this->quoting_status_model->crud_update();
    }

    public function create_quoting_status(){
        echo $this->quoting_status_model->crud_create();
    }

    public function delete_quoting_status(){
        echo $this->quoting_status_model->crud_delete();
    }

    public function sel2_quoting_status(){
        echo $this->quoting_status_model->xsel2_quoting_status();
    }

    public function order_quoting_element(){
        $id			= request('id');
        $direction  = request('direction');
        $this->quoting_status_model->order_element($id,$direction);
        echo json_encode(array('Result'=>'OK'));
    }

    public function list_clients(){
        echo $this->clients_model->crud_list(array('deleted'=>0));
    }

    public function update_clients(){
        echo $this->clients_model->create_clients();
    }

    public function create_clients(){
        echo $this->clients_model->create_clients();
    }

    public function delete_clients(){
        echo $this->clients_model->delete_clients();
    }

    /* handlings */

    public function list_handlings(){
        echo $this->handlings_model->crud_list(array('deleted'=>0));
    }

    public function update_handlings(){
        echo $this->handlings_model->create_handlings();
    }

    public function create_handlings(){
        echo $this->handlings_model->create_handlings();
    }

    public function delete_handlings(){
        echo $this->handlings_model->delete_handlings();
    }

    public function list_status_rights($encode = true){
        $this->jobs_status_rights_model->list_jobs_status_rights();
    }

    public function list_status_rights_enabled($encode = true){
        $this->jobs_status_rights_model->list_jobs_status_rights_enabled();
    }

    public function enable_all_user_status(){
        $set['enabled'] 	= request('enabled');
        $where['userid'] 	= request('id');
        echo $this->jobs_status_rights_model->multi_update($set,$where);
    }
    public function enable_one_user_status(){
        $set['enabled'] = request('enabled');
        $where['id'] 	= request('id');
        echo $this->jobs_status_rights_model->multi_update($set,$where);
    }

}

/* End of file jobs_status.php */