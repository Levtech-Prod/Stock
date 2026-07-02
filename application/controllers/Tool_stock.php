<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Tool_stock extends MY_Controller {

    var $crud_models = array('tool_stock_model', 'tool_stock_param_model', 'tool_categs_param_model', 'tool_categs_model');

    function __construct(){
        parent::__construct();
    }

    public function index(){
        $data = array();
        $data['admin'] = $this->session->userdata('admin');
        $data['userid'] = $this->session->userdata('userid');
        $data['price_right'] = $this->session->userdata('price_right');
        $this->load->view('tool_stock_view', $data);
    }

    public function list_tool_stock(){
        $req = request();
        $params = array();
        $sql = "SELECT s.*, c.name as categ_name,
                (SELECT GROUP_CONCAT(CONCAT(cp.`name`, ': ' , p.`value`) SEPARATOR '<br/>') AS param_list FROM tool_stock_param p LEFT JOIN tool_categs_param cp ON (cp.id=p.param_id) WHERE p.stock_id = s.id) as param_list,
                if(s.quantity=0, (SELECT GROUP_CONCAT(distinct u.username SEPARATOR ', ') FROM tool_stock_out_log l LEFT JOIN users u ON (u.id=l.userid) WHERE l.stock_id=s.id), null) AS work_names
                FROM tool_stock s
                left join tool_categs c on (c.id=s.categ_id)
                WHERE 1=1 ";
        if ($req['filter_search']){
            $sql.=" and (s.`code` LIKE '%".$req['filter_search']."%')";
        }
        if ($req['filter_location']){
            $sql.=" and (s.`location` LIKE '%".$req['filter_location']."')";
        }
        if(!$req['jtSorting']){
            $sql.=" order by s.ts desc ";
        }
        echo $this->tool_stock_model->crud_list_sql($sql, $params);
    }

    public function update_tool_stock(){
        $req = request();
        $params =  json_decode($_POST['stock_params'], true);
        $options['standard_part'] 		= (request('standard_part')) ? 1 : 0;
        $rec = $this->tool_stock_model->crud_update($options, array(), false);
        if ($rec['Result'] == 'OK'){
            if(count($params)>0){
                foreach($params as $p){
                    $sparams =  array($req['id'], $p['param_id'], $p['value'],$this->session->userdata('userid'),date($this->config->item('log_date_format')),$this->session->userdata('userid'), $p['value'], date($this->config->item('log_date_format')), $this->session->userdata('userid'));
                    $sql = 'INSERT INTO tool_stock_param (stock_id, param_id, `value`, rec_createdid, rec_modified, rec_modifiedid)
                            VALUES(?,?,?,?,?,?)
                            ON DUPLICATE KEY UPDATE `value` = ?, rec_modified = ?, rec_modifiedid=?;';
                    $this->tool_stock_param_model->query($sql,$sparams);
                }
            }
        }
        echo json_encode($rec);
    }

    public function create_tool_stock(){
        $req = request();
        $params =  json_decode($_POST['stock_params'], true);
        $options['standard_part'] 		= (request('standard_part')) ? 1 : 0;
        $rec = $this->tool_stock_model->crud_create($options, array(), false);
        if ($rec['Result'] == 'OK'){
            if(count($params)>0){
                foreach($params as $p){
                    $sparams =  array($rec['Record']['id'], $p['param_id'], $p['value'],$this->session->userdata('userid'),date($this->config->item('log_date_format')),$this->session->userdata('userid'), $p['value'], date($this->config->item('log_date_format')), $this->session->userdata('userid'));
                    $sql = 'INSERT INTO tool_stock_param (stock_id, param_id, `value`, rec_createdid, rec_modified, rec_modifiedid)
                            VALUES(?,?,?,?,?,?)
                            ON DUPLICATE KEY UPDATE `value` = ?, rec_modified = ?, rec_modifiedid=?;';
                    $this->tool_stock_param_model->query($sql,$sparams);
                }
            }
        }
        echo json_encode($rec);
    }

    public function delete_tool_stock(){
        echo $this->tool_stock_model->crud_delete();
    }

    /* */
    public function list_params(){
        $req = request();
        $params = array('categ_id'=>$req['categ_id']);
        $sql = "SELECT p.*
                FROM tool_stock_param p
                WHERE p.categ_id = ? ";
        if ($req['filter_search']){
            $sql.=" and (p.name LIKE '%".$req['filter_search']."%')";
        }
        echo $this->tool_stock_param_model->crud_list_sql($sql, $params);
    }

    public function update_params(){
        echo $this->tool_stock_param_model->crud_update();
    }

    public function create_params(){
        echo $this->tool_stock_param_model->crud_create();
    }

    public function delete_params(){
        echo $this->tool_stock_param_model->crud_delete();
    }

    public function getCustomData(){
        $req = request();
        $params =  array();
        $sql = 'SELECT p.id, cp.categ_id, p.value, cp.name, cp.type, cp.id as typeid, cp.type_values, cp.unit from tool_stock_param p
                right join tool_categs_param cp on cp.id=p.param_id ';
        if($req['stock_id']){
            $sql.=' and  p.stock_id = ? ';
            array_push($params, $req['stock_id']);
        }else{
            $sql.=' and  p.stock_id is null ';
        }
        $sql.= ' WHERE cp.categ_id = ? ';
        $sql.= 'order by FIELD(cp.type, 1,2,3,4) ';
        array_push($params, $req['categ_id']);
                // p.stock_id=?
        $result = $this->tool_stock_param_model->query($sql,$params)->result_array();
        echo json_encode(array("Result" => "OK", "Records" => $result));
    }

    public function sel2_categs(){
        $this->load_model('tool_categs_model');
        echo $this->tool_categs_model->xsel2_tool_categs();
    }

}

/* End of file tool_stock.php */