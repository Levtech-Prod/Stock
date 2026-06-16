<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Late_stat extends MY_Controller {

    var $crud_models = array('orders_model', 'jobs_model', 'settings_model', 'qc_types_model');

    function __construct(){
        parent::__construct();
    }

    public function index(){
        $data = array();
        $data['admin'] = $this->session->userdata('admin');
        $data['price_right'] = $this->session->userdata('price_right');
        $this->load->view('late_stat_view', $data);
    }

    public function list_late_stat(){
        $req = request();
        $params = array();
        $sql = "SELECT l.all_pos, l.late_pos, ROUND(((l.late_pos*100)/l.all_pos), 2) AS late_rate from (SELECT ";
        $sql .= "(SELECT COUNT(*) FROM jobs j
            WHERE j.status = -2 ";
            if ($req['date_from']){
                $sql.=' AND (j.ts>=?)';
                array_push($params,$req['date_from']." 00:00:00");
            }
            if ($req['date_to']){
                $sql.=' AND (j.ts<=?)';
                array_push($params,$req['date_to']." 23:59:59");
            }
            $sql.=") AS all_pos,
            (SELECT COUNT(*) FROM jobs j
            WHERE j.status = -2 and j.late=1 ";
            if ($req['date_from']){
                $sql.=' AND (j.ts>=?)';
                array_push($params,$req['date_from']." 00:00:00");
            }
            if ($req['date_to']){
                $sql.=' AND (j.ts<=?)';
                array_push($params,$req['date_to']." 23:59:59");
            }
            $sql.=") AS late_pos";
            $sql.=" ) as l ";
        echo $this->jobs_model->crud_list_sql($sql, $params);
    }

}

/* End of file late_stat.php */