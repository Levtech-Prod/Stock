<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Users_stat extends MY_Controller {

    var $crud_models = array('orders_model', 'jobs_model', 'settings_model', 'qc_types_model');

    function __construct(){
        parent::__construct();
    }

    public function index(){
        $data = array();
        $data['admin'] = $this->session->userdata('admin');
        $data['price_right'] = $this->session->userdata('price_right');
        $data['settings'] = $this->settings_model->get_rec(1);
        $this->load->view('users_stat_view', $data);
    }

    public function list_users_stat(){
        $req = request();
        $params = array();
        $sql = "SELECT u.username as `name`,
                    (SELECT coalesce(sum(TIMESTAMPDIFF(MINUTE, l.start_time, COALESCE(l.end_time, NOW()))),0) FROM jobs_work_log l WHERE userid = u.id";
        if ($req['date_from']){
            $sql.=' AND (l.start_time>=?)';
            array_push($params,$req['date_from']." 00:00:00");
        }
        if ($req['date_to']){
            $sql.=' AND (COALESCE(l.end_time, NOW())<=?)';
            array_push($params,$req['date_to']." 23:59:59");
        }
        $sql.=") as machine_hours,
        (SELECT COUNT(DISTINCT l.job_id) FROM jobs_log l 
            LEFT JOIN jobs_status s ON s.id=l.status_new 
            LEFT JOIN jobs_status os ON os.id=l.status 
            WHERE l.userid=u.id and (s.`type` in (1,2) or os.`type` in (1,2))
            AND l.job_id NOT IN (SELECT l.job_id FROM jobs_log l 
            LEFT JOIN jobs_status s ON s.id=l.status_new 
            LEFT JOIN jobs_status os ON os.id=l.status 
            WHERE l.userid!=u.id and (s.`type` in (1,2) or os.`type` in (1,2)))";
            if ($req['date_from']){
                $sql.=' AND (l.ts>=?)';
                array_push($params,$req['date_from']." 00:00:00");
            }
            if ($req['date_to']){
                $sql.=' AND (l.ts<=?)';
                array_push($params,$req['date_to']." 23:59:59");
            }
            $sql.=") AS user_prod,
        (SELECT COUNT(DISTINCT l.job_id) FROM jobs_log l 
            LEFT JOIN jobs_status s ON s.id=l.status_new 
            LEFT JOIN jobs_status os ON os.id=l.status 
            WHERE l.userid=u.id and (s.`type` in (1,2) or os.`type` in (1,2))
            AND l.job_id IN (SELECT l.job_id FROM jobs_log l 
            LEFT JOIN jobs_status s ON s.id=l.status_new 
            LEFT JOIN jobs_status os ON os.id=l.status 
            WHERE l.userid!=u.id and (s.`type` in (1,2) or os.`type` in (1,2)))";
            if ($req['date_from']){
                $sql.=' AND (l.ts>=?)';
                array_push($params,$req['date_from']." 00:00:00");
            }
            if ($req['date_to']){
                $sql.=' AND (l.ts<=?)';
                array_push($params,$req['date_to']." 23:59:59");
            }
            $sql.=") AS other_prod,
            (SELECT COUNT(DISTINCT l.job_id) FROM jobs_log l 
            WHERE l.userid=u.id AND (l.`status`=30 OR l.status_new=30)";
            if ($req['date_from']){
                $sql.=' AND (l.ts>=?)';
                array_push($params,$req['date_from']." 00:00:00");
            }
            if ($req['date_to']){
                $sql.=' AND (l.ts<=?)';
                array_push($params,$req['date_to']." 23:59:59");
            }
            $sql.=") AS prog_number,
            (SELECT COUNT(DISTINCT l.job_id) FROM jobs_log l 
            LEFT JOIN jobs j ON (j.id=l.job_id)
            LEFT JOIN jobs_status s ON s.id=l.status_new 
            LEFT JOIN jobs_status os ON os.id=l.status 
            WHERE j.qc_type>1 and l.userid=u.id and (s.`type` in (1,2) or os.`type` in (1,2))
            AND l.job_id NOT IN (SELECT l.job_id FROM jobs_log l 
            LEFT JOIN jobs_status s ON s.id=l.status_new 
            LEFT JOIN jobs_status os ON os.id=l.status 
            WHERE l.userid!=u.id and (s.`type` in (1,2) or os.`type` in (1,2)))";
            if ($req['date_from']){
                $sql.=' AND (l.ts>=?)';
                array_push($params,$req['date_from']." 00:00:00");
            }
            if ($req['date_to']){
                $sql.=' AND (l.ts<=?)';
                array_push($params,$req['date_to']." 23:59:59");
            }
            $sql.=") AS user_prod_err,
        (SELECT COUNT(DISTINCT l.job_id) FROM jobs_log l 
            LEFT JOIN jobs j ON (j.id=l.job_id)
            LEFT JOIN jobs_status s ON s.id=l.status_new 
            LEFT JOIN jobs_status os ON os.id=l.status 
            WHERE j.qc_type>1 and l.userid=u.id and (s.`type` in (1,2) or os.`type` in (1,2))
            AND l.job_id IN (SELECT l.job_id FROM jobs_log l 
            LEFT JOIN jobs_status s ON s.id=l.status_new 
            LEFT JOIN jobs_status os ON os.id=l.status 
            WHERE l.userid!=u.id and (s.`type` in (1,2) or os.`type` in (1,2)))";
            if ($req['date_from']){
                $sql.=' AND (l.ts>=?)';
                array_push($params,$req['date_from']." 00:00:00");
            }
            if ($req['date_to']){
                $sql.=' AND (l.ts<=?)';
                array_push($params,$req['date_to']." 23:59:59");
            }
            $sql.=") AS other_prod_err";
            $sql.=" FROM users u";
        echo $this->jobs_model->crud_list_sql($sql, $params);
    }

}

/* End of file users_stat.php */