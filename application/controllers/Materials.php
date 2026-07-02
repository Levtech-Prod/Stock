<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Materials extends MY_Controller {

    var $crud_models = array('materials_model');

    function __construct(){
        parent::__construct();
    }

    public function index(){
        $this->load->view('materials_view');
    }

    public function list_materials(){
        echo $this->materials_model->crud_list(array('deleted'=>0));
    }

    public function update_materials(){
        echo $this->materials_model->crud_update();
    }

    public function create_materials(){
        echo $this->materials_model->crud_create();
    }

    public function delete_materials(){
        echo $this->materials_model->crud_delete();
    }

}

/* End of file materials.php */