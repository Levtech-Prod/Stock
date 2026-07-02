<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Menu extends MY_Controller {

    var $crud_models = array('menu_model', 'menu_rights_model');

    function __construct(){
        parent::__construct();
    }

    public function index(){
        $this->load->view('menu_view');
    }

    public function list_menu(){
        echo $this->menu_model->crud_list();
    }

    public function update_menu(){
        echo $this->menu_model->crud_update();
    }

    public function create_menu(){
        echo $this->menu_model->crud_create();
    }

    public function delete_menu(){
        echo $this->menu_model->crud_delete();
    }

    public function list_menu_rights($encode = true){
        $this->menu_rights_model->list_menu_rights();
    }

    public function list_menu_rights_enabled($encode = true){
        $this->menu_rights_model->list_menu_rights_enabled();
    }

    public function enable_all_user_menus(){
        $set['enabled'] 	= request('enabled');
        $where['userid'] 	= request('id');
        echo $this->menu_rights_model->multi_update($set,$where);
    }
    public function enable_one_user_menu(){
        $set['enabled'] = request('enabled');
        $where['id'] 	= request('id');
        echo $this->menu_rights_model->multi_update($set,$where);
    }

    public function enable_operator_rights(){
        $rights = [1, 4];
        $set['enabled'] 	= 0;
        $where['userid'] 	= request('id');
        $res_remove = $this->menu_rights_model->multi_update($set,$where);
        foreach ($rights as $right) {
            $sql = "UPDATE `menu_rights` SET `enabled`=1 WHERE userid=? AND menuid=?";
            $params = array(request('id'), $right);
            $res_add = $this->menu_rights_model->query($sql, $params);
        }
        echo json_encode(array('Result' => 'OK'));
    }

    public function enable_qc_rights(){
        $rights = [1, 2, 3, 4, 5];
        $set['enabled'] 	= 0;
        $where['userid'] 	= request('id');
        $res_remove = $this->menu_rights_model->multi_update($set,$where);
        foreach ($rights as $right) {
            $sql = "UPDATE `menu_rights` SET `enabled`=1 WHERE userid=? AND menuid=?";
            $params = array(request('id'), $right);
            $res_add = $this->menu_rights_model->query($sql, $params);
        }
        echo json_encode(array('Result' => 'OK'));
    }

}

/* End of file menu.php */