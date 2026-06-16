<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Plan extends MY_Controller {

    var $crud_models = array('orders_model', 'settings_model');

    function __construct(){
        parent::__construct();
    }

    public function index(){
        $data = array();
        $data['admin'] = $this->session->userdata('admin');
        $data['price_right'] = $this->session->userdata('price_right');
        $data['settings'] = $this->settings_model->get_rec(1);
        $this->load->view('plan_view', $data);
    }

}

/* End of file plan.php */