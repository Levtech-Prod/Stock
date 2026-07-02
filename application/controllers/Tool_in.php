<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Tool_in extends MY_Controller {

    var $crud_models = array('tool_stock_model', 'tool_stock_param_model', 'tool_categs_param_model', 'tool_categs_model', 'tool_stock_out_log_model');

    function __construct(){
        parent::__construct();
    }

    public function index(){
        $data = array();
        $data['admin'] = $this->session->userdata('admin');
        $data['userid'] = $this->session->userdata('userid');
        $data['price_right'] = $this->session->userdata('price_right');
        $this->load->view('tool_in_view', $data);
    }

    public function list_tool_stock_in(){
        $req = request();
        $params = array();
        $sql = "SELECT l.id, l.stock_id, l.ts, s.categ_id, s.name, s.code, s.broken_quantity, s.location, s.standard_part, s.description, c.name as categ_name, l.quantity, u.`username` as user_name, l.`comment`,
                (SELECT GROUP_CONCAT(CONCAT(cp.`name`, ': ' , p.`value`) SEPARATOR '<br/>') AS param_list FROM tool_stock_param p LEFT JOIN tool_categs_param cp ON (cp.id=p.param_id) WHERE p.stock_id = s.id) as param_list
                from tool_stock_out_log l
                left join tool_stock s on (s.id=l.stock_id)
                left join tool_categs c on (c.id=s.categ_id)
                left join users u on (u.id=l.userid)
                WHERE l.returned=0 ";
        if ($req['userid']){
            $sql.=" and l.userid = ? ";
            array_push($params, $req['userid']);
        }
        if ($req['filter_search']){
            $sql.=" and (s.`code` LIKE '%".$req['filter_search']."%')";
        }
        if(!$req['jtSorting']){
            $sql.=" order by l.ts desc ";
        }
        echo $this->tool_stock_model->crud_list_sql($sql, $params);
    }

}

/* End of file tool_stock.php */