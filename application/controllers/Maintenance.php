<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Maintenance extends MY_Controller {

    var $crud_models = array('maintenance_model', 'maintenance_templates_model');

    function __construct(){
        parent::__construct();
    }

    public function index(){
        $data = array();
        $data['admin'] = $this->session->userdata('admin');
        $data['userid'] = $this->session->userdata('userid');
        $data['price_right'] = $this->session->userdata('price_right');
        $data['machineid'] = request('machineid');
        $this->load->view('maintenance_view', $data);
    }

    public function list_maintenance(){
        $req = request();
        $params = array($req['year']);
        $sql = "SELECT t.*, m.id as mid, m.selected
                FROM maintenance_templates t
                left join maintenance m on (t.id = m.template_id and m.year = ? ";
        if ($req['week']){
            $sql.=" and (m.week = ?)";
            array_push($params,$req['week']);
        }
        if ($req['month']){
            $sql.=" and (m.month = ?)";
            array_push($params,$req['month']);
        }
        if ($req['semester']){
            $sql.=" and (m.semester = ?)";
            array_push($params,$req['semester']);
        }
        $sql .= ") WHERE t.machineid=? and t.type = ? "; 
        array_push($params, $req['machineid'], $req['type']);
        if ($req['filter_search']){
            $sql.=" and (t.name LIKE '%".$req['filter_search']."%')";
        }
        echo $this->maintenance_model->crud_list_sql($sql, $params);
    }

    public function update_maintenance(){
        echo $this->maintenance_model->crud_update();
    }

    public function create_maintenance(){
        echo $this->maintenance_model->crud_create();
    }

    public function delete_maintenance(){
        echo $this->maintenance_model->crud_delete();
    }

    public function list_add_maintenance(){
        $req = request();
        $params = array($req['machineid'], $req['type']);
        $sql = "SELECT t.*
                FROM maintenance_templates t
                WHERE t.machineid=? and t.type=? ";
        echo $this->maintenance_templates_model->crud_list_sql($sql, $params);
    }

    public function add_multiple_maintenance(){
        $ids = request('ids');
        $req = request();
        $maint = explode(',',$ids);
        if($maint){
            $sql = "INSERT INTO maintenance(
                            machineid,
                            year,
                            week,
                            month,
                            semester,
                            name,
                            description,
                            template_id,
                            rec_createdid
                            )
                     SELECT ".$req['machineid'].",
                            ".$req['year'].",
                            ".($req['week']?$req['week']:'null').",
                            ".($req['month']?$req['month']:'null').",
                            ".($req['semester']?$req['semester']:'null').",
                            name,
                            description,
                            id,
                            ".$this->session->userdata('userid')."
                        FROM maintenance_templates
                    WHERE id in (".$ids.")";
                    $params = array();
                    $res 	= $this->maintenance_templates_model->query($sql, $params);
        }
        echo json_encode(array( 'Result' => 'OK'));
    }

    public function add_maintenance(){
        $id = request('template_id');
        $req = request();
        if($id){
            $sql = "INSERT INTO maintenance(
                            machineid,
                            year,
                            week,
                            month,
                            semester,
                            name,
                            description,
                            selected,
                            template_id,
                            rec_createdid
                            )
                     values (".$req['machineid'].",
                            ".$req['year'].",
                            ".($req['week']?$req['week']:'null').",
                            ".($req['month']?$req['month']:'null').",
                            ".($req['semester']?$req['semester']:'null').",
                            '".$req['name']."',
                            ".($req['description']?"'".$req['description']."'":'null').",
                            ".$req['selected'].",
                            ".$req['template_id'].",
                            ".$this->session->userdata('userid')."
                    )
                    ON DUPLICATE KEY UPDATE selected=?, rec_modified = ?, rec_modifiedid=?;";
                    $params = array($req['selected'], date($this->config->item('log_date_format')), $this->session->userdata('userid'));
                    $res 	= $this->maintenance_model->query($sql, $params);
        }
        echo json_encode(array( 'Result' => 'OK'));
    }

    public function get_ready_maintenance(){
        $req = request();
        $params = array($req['year']);
        $sql = "select count(t.id) AS num, count(m.id) AS ready
                FROM maintenance_templates t
                left join maintenance m on (t.id = m.template_id and m.year = ? and m.selected=1 ";
        if ($req['week']){
            $sql.=" and (m.week = ?)";
            array_push($params,$req['week']);
        }
        if ($req['month']){
            $sql.=" and (m.month = ?)";
            array_push($params,$req['month']);
        }
        if ($req['semester']){
            $sql.=" and (m.semester = ?)";
            array_push($params,$req['semester']);
        }
        $sql .= ") WHERE t.machineid=? and t.type = ? "; 
        array_push($params, $req['machineid'], $req['type']);
        if ($req['filter_search']){
            $sql.=" and (t.name LIKE '%".$req['filter_search']."%')";
        }
        $res = $this->maintenance_model->query($sql, $params)->result_array()[0];
        echo json_encode(array( 'Result' => 'OK', 'data' => $res));
    }

}

/* End of file maintenance.php */