<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Tool_stock_categ extends MY_Controller {

    var $crud_models = array('tool_stock_model', 'tool_stock_param_model', 'tool_categs_param_model', 'tool_categs_model', 'tool_stock_out_log_model');

    function __construct(){
        parent::__construct();
    }

    public function index(){
        $data = array();
        $data['admin'] = $this->session->userdata('admin');
        $data['userid'] = $this->session->userdata('userid');
        $data['price_right'] = $this->session->userdata('price_right');
        $data['categ_id'] = request('categ_id');
        $data['categ_name'] = request('categ_name');
        $data['edit'] = request('edit');
        $data['title'] = request('title');
        $data['in'] = request('in');
        $this->load->view('tool_stock_categ_view', $data);
    }

    public function list_tool_stock(){
        $req = request();
        if ($req['categ_id']){
            $sparams = array('categ_id'=>$req['categ_id']);
            $sqls = "SELECT p.*
                    FROM tool_categs_param p
                    WHERE p.categ_id = ? ";
            $parr = $this->tool_categs_param_model->query($sqls, $sparams)->result_array();
        }

        $params = array();
        $sql = "SELECT s.*, c.name as categ_name,
                (SELECT GROUP_CONCAT(CONCAT(cp.`name`, ': ' , p.`value`) SEPARATOR '<br/>') AS param_list FROM tool_stock_param p LEFT JOIN tool_categs_param cp ON (cp.id=p.param_id) WHERE p.stock_id = s.id) as param_list
                FROM tool_stock s
                left join tool_categs c on (c.id=s.categ_id)
                WHERE 1=1 ";
        if ($req['categ_id']){
            $sql.=" and s.categ_id = ? ";
            array_push($params, $req['categ_id']);
        }
        if($parr){
            foreach($parr as $pval){
                switch($pval['type']){
                    case 1:
                    case 3:
                        if($req['filter_'.$pval['id']]){
                            $sql.=" and s.id in (SELECT p.stock_id from tool_stock_param p WHERE p.param_id = ? and p.value LIKE '%".$req['filter_'.$pval['id']]."%')";
                            array_push($params, $pval['id']);
                        }
                        break;
                    case 2:
                        if($req['filter_'.$pval['id']]){
                            $sql.=" and s.id in (SELECT p.stock_id from tool_stock_param p WHERE p.param_id = ? and p.value = ?)";
                            array_push($params, $pval['id'], $req['filter_'.$pval['id']]);
                        }
                        break;
                    case 4:
                        if($req['filter_'.$pval['id'].'_from']){
                            $sql.=" and s.id in (SELECT p.stock_id from tool_stock_param p WHERE p.param_id = ? and p.value >= ?)";
                            array_push($params, $pval['id'], (float)$req['filter_'.$pval['id'].'_from']);
                        }
                        if($req['filter_'.$pval['id'].'_to']){
                            $sql.=" and s.id in (SELECT p.stock_id from tool_stock_param p WHERE p.param_id = ? and p.value <= ?)";
                            array_push($params, $pval['id'], (float)$req['filter_'.$pval['id'].'_to']);
                        }
                        break;
                }
            }
        }
        $sql.=" order by s.ts desc ";
        echo $this->tool_stock_model->crud_list_sql($sql, $params);
    }

    public function list_tool_stock_in(){
        $req = request();
        if ($req['categ_id']){
            $sparams = array('categ_id'=>$req['categ_id']);
            $sqls = "SELECT p.*
                    FROM tool_categs_param p
                    WHERE p.categ_id = ? ";
            $parr = $this->tool_categs_param_model->query($sqls, $sparams)->result_array();
        }

        $params = array();
        $sql = "SELECT l.id, l.stock_id, l.ts, s.categ_id, s.name, s.code, s.broken_quantity, s.location, s.standard_part, s.description, c.name as categ_name, l.quantity, u.`username` as user_name, 
                (SELECT GROUP_CONCAT(CONCAT(cp.`name`, ': ' , p.`value`) SEPARATOR '<br/>') AS param_list FROM tool_stock_param p LEFT JOIN tool_categs_param cp ON (cp.id=p.param_id) WHERE p.stock_id = s.id) as param_list
                from tool_stock_out_log l
                left join tool_stock s on (s.id=l.stock_id)
                left join tool_categs c on (c.id=s.categ_id)
                left join users u on (u.id=l.userid)
                WHERE l.returned=0 ";
        if ($req['categ_id']){
            $sql.=" and s.categ_id = ? ";
            array_push($params, $req['categ_id']);
        }
        if($parr){
            foreach($parr as $pval){
                switch($pval['type']){
                    case 1:
                    case 3:
                        if($req['filter_'.$pval['id']]){
                            $sql.=" and s.id in (SELECT p.stock_id from tool_stock_param p WHERE p.param_id = ? and p.value LIKE '%".$req['filter_'.$pval['id']]."%')";
                            array_push($params, $pval['id']);
                        }
                        break;
                    case 2:
                        if($req['filter_'.$pval['id']]){
                            $sql.=" and s.id in (SELECT p.stock_id from tool_stock_param p WHERE p.param_id = ? and p.value = ?)";
                            array_push($params, $pval['id'], $req['filter_'.$pval['id']]);
                        }
                        break;
                    case 4:
                        if($req['filter_'.$pval['id'].'_from']){
                            $sql.=" and s.id in (SELECT p.stock_id from tool_stock_param p WHERE p.param_id = ? and p.value >= ?)";
                            array_push($params, $pval['id'], (float)$req['filter_'.$pval['id'].'_from']);
                        }
                        if($req['filter_'.$pval['id'].'_to']){
                            $sql.=" and s.id in (SELECT p.stock_id from tool_stock_param p WHERE p.param_id = ? and p.value <= ?)";
                            array_push($params, $pval['id'], (float)$req['filter_'.$pval['id'].'_to']);
                        }
                        break;
                }
            }
        }
        if(!$req['jtSorting']){
            $sql.=" order by s.ts desc ";
        }
        echo $this->tool_stock_model->crud_list_sql($sql, $params);
    }

    public function update_tool_stock(){
        $req = request();
        $params =  json_decode($_POST['stock_params'], true);
        $rec = $this->tool_stock_model->crud_update(array(), array(), false);
        if ($rec['Result'] == 'OK'){
            if(count($params)>0){
                foreach($params as $p){
                    $params =  array($req['id'], $p['param_id'], $p['value'],$this->session->userdata('userid'),date($this->config->item('log_date_format')),$this->session->userdata('userid'), $p['value'], date($this->config->item('log_date_format')), $this->session->userdata('userid'));
                    $sql = 'INSERT INTO tool_stock_param (stock_id, param_id, `value`, rec_createdid, rec_modified, rec_modifiedid)
                            VALUES(?,?,?,?,?,?)
                            ON DUPLICATE KEY UPDATE `value` = ?, rec_modified = ?, rec_modifiedid=?;';
                    $this->tool_stock_param_model->query($sql,$params);
                }
            }
        }
        echo json_encode($rec);
    }

    public function create_tool_stock(){
        $req = request();
        $params =  json_decode($_POST['stock_params'], true);
        $rec = $this->tool_stock_model->crud_create(array(), array(), false);
        if ($rec['Result'] == 'OK'){
            if(count($params)>0){
                foreach($params as $p){
                    $params =  array($rec['Record']['id'], $p['param_id'], $p['value'],$this->session->userdata('userid'),date($this->config->item('log_date_format')),$this->session->userdata('userid'), $p['value'], date($this->config->item('log_date_format')), $this->session->userdata('userid'));
                    $sql = 'INSERT INTO tool_stock_param (stock_id, param_id, `value`, rec_createdid, rec_modified, rec_modifiedid)
                            VALUES(?,?,?,?,?,?)
                            ON DUPLICATE KEY UPDATE `value` = ?, rec_modified = ?, rec_modifiedid=?;';
                    $this->tool_stock_param_model->query($sql,$params);
                }
            }
        }
        echo json_encode($rec);
    }

    public function delete_tool_stock(){
        echo $this->tool_stock_model->crud_delete();
    }

    public function update_tool_stock_quantity(){
        $req = request();
        $sql = "update tool_stock SET quantity=quantity-? WHERE id = ?";
        $params = array($req['quantity'], $req['id']);
        $res = $this->tool_stock_model->query($sql, $params);
        if($res){
            $options = array();
            $options['stock_id'] = $req['id'];
            $options['quantity'] = $req['quantity'];
            $options['comment'] = $req['comment'];
            $options['userid'] = $this->session->userdata('userid');
            $ret = $this->tool_stock_out_log_model->crud_create($options, array(), FALSE, true, false);
        }
        echo json_encode(array("Result" => "OK"));
    }

    public function update_tool_stock_broken(){
        $req = request();
        $sql = "update tool_stock SET quantity=quantity-1, broken_quantity=broken_quantity+1 WHERE id = ?";
        $params = array($req['id']);
        $res = $this->tool_stock_model->query($sql, $params);
        echo json_encode(array("Result" => "OK"));
    }

    public function update_tool_stock_quantity_in(){
        $req = request();
        $sql = "update tool_stock SET quantity=quantity+? WHERE id = ?";
        $params = array($req['quantity'], $req['id']);
        $res = $this->tool_stock_model->query($sql, $params);
        $sql2 = "update tool_stock_out_log SET quantity=quantity-? WHERE id = ?";
        $params2 = array($req['quantity'], $req['log_id']);
        $res2 = $this->tool_stock_model->query($sql2, $params2);
        echo json_encode(array("Result" => "OK"));
    }

    public function update_tool_stock_broken_in(){
        $req = request();
        $sql = "update tool_stock SET broken_quantity=broken_quantity+? WHERE id = ?";
        $params = array($req['quantity'], $req['id']);
        $res = $this->tool_stock_model->query($sql, $params);
        $sql2 = "update tool_stock_out_log SET quantity=quantity-? WHERE id = ?";
        $params2 = array($req['quantity'], $req['log_id']);
        $res2 = $this->tool_stock_model->query($sql2, $params2);
        echo json_encode(array("Result" => "OK"));
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
        $params =  array($req['categ_id']);
        $sql = 'SELECT p.id, cp.categ_id, p.value, cp.name, cp.type, cp.id as typeid, cp.type_values, cp.unit from tool_stock_param p
                right join tool_categs_param cp on cp.id=p.param_id
                WHERE cp.categ_id = ? ';
        if($req['stock_id']){
            $sql.=' and  p.stock_id = ? ';
            array_push($params, $req['stock_id']);
        }
        $sql.= 'order by FIELD(cp.type, 1,2,3,4) ';
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