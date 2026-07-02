<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Tool_out extends MY_Controller {

    var $crud_models = array('tool_stock_model', 'tool_stock_param_model', 'tool_categs_param_model', 'tool_categs_model');

    function __construct(){
        parent::__construct();
    }

    public function index(){
        $data = array();
        $data['admin'] = $this->session->userdata('admin');
        $data['userid'] = $this->session->userdata('userid');
        $data['price_right'] = $this->session->userdata('price_right');
        $this->load->view('tool_out_view', $data);
    }

}

/* End of file tool_stock.php */