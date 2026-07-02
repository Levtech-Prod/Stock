<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Machines extends MY_Controller {

    var $crud_models = array('machines_model');

    function __construct(){
        parent::__construct();
    }

    public function index(){
        $data = array();
        $data['admin'] = $this->session->userdata('admin');
        $data['userid'] = $this->session->userdata('userid');
        $data['price_right'] = $this->session->userdata('price_right');
        $this->load->view('machines_view', $data);
    }

}

/* End of file machines.php */