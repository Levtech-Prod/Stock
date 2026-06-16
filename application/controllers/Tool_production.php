<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Tool_production extends MY_Controller {

    var $crud_models = array('tool_stock_model', 'tool_stock_param_model', 'tool_categs_param_model', 'tool_categs_model', 'tool_stock_out_log_model', 'users_model');

    function __construct(){
        parent::__construct();
    }

    public function index(){
        $data = array();
        $data['admin'] = $this->session->userdata('admin');
        $data['userid'] = $this->session->userdata('userid');
        $data['price_right'] = $this->session->userdata('price_right');
        $this->load->view('tool_production_view', $data);
    }

    public function getUsers(){
        $req = request();
        $params = array($this->session->userdata('userid'));
        $sql = "SELECT u.*
                from users u
            where id IN (SELECT userid FROM menu_rights WHERE userid=u.id AND menuid =14 AND enabled=1)
            AND id IN (SELECT userid FROM menu_rights WHERE userid=u.id AND menuid =15 AND enabled=1)";
        $sql.=" ORDER BY FIELD(u.id,?) desc";
        $users = $this->users_model->query($sql, $params)->result_array();
        echo json_encode(array( 'Result' => 'OK', 'users'=>$users));
    }

}

/* End of file tool_stock.php */