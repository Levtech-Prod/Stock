<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Board extends MY_Controller {

    var $crud_models = array('jobs_model', 'jobs_status_model', 'jobs_observations_model', 'settings_model', 'jobs_work_log_model');

    function __construct(){
        parent::__construct();
    }

    public function index(){
        $data = array();
        $data['admin'] = $this->session->userdata('admin');
        $data['userid'] = $this->session->userdata('userid');
        $data['settings'] = $this->settings_model->get_rec(1);
        $this->load->view('board_view', $data);
    }

    public function getBoard(){
        $req = request();
        $sparams = array($this->session->userdata('userid'));
        $sqls = "SELECT s.*, s.name as title from jobs_status s
                left join jobs_status_rights r on (s.id = r.statusid and r.userid =?)
                where r.enabled = 1 
                order by sort";
        $statuses = $this->jobs_model->query($sqls, $sparams)->result_array();

        $jparams = array();
        $sqlj = "SELECT j.id, concat(j.id, ' - ', j.name) as title, j.status as `block`, concat('<div class=\"pull-left\">', o.id, if(c.alias!='',CONCAT(' - ', c.alias),''), '</div><div class=\"pull-right\"><i class=\"fas fa-check-square\"></i> ', j.id ,'</div>') as footer, if(j.image is not null, concat('".profile_to_url(UPLOAD_IMG_DIR)."', j.image), '') as image_url, j.five_axis, j.status, j.quantity, j.work_log_id, j.blind_job,
                ((((j.price-material_price)*quantity)/st.wage*60)+j.estimate_time) AS est_time,
                (SELECT MAX(ts) FROM jobs_log l LEFT JOIN jobs_status s ON s.id=l.status_new where job_id=j.id AND s.`type`=2) AS end_date, j.in_work, 
                j.material_received, c.alias
                from jobs j
                left join orders o on (o.id = j.order_id) 
                left join settings st on (st.id=1)
                left join clients c on (c.id = o.client_name)
            where archived=0 and o.deleted=0 ";
        //+calc_qc_time(j.id)
        if ($req['filter_search']){
            $where_like =$this->jobs_model->build_where_like($req['filter_search'], array('j.name', 'o.name', 'j.id'));
            $sqlj.= $where_like;
        }
        if ($req['filter_id']){
            //$sqlj.=' AND (o.id=?)';
            //array_push($jparams,$req['filter_id']);
            $where_like2 =$this->jobs_model->build_where_like($req['filter_id'], array('o.id'));
            $sqlj.= $where_like2;
        }
        if ($req['start_date_from'] || $req['start_date_to']){
            $sqlj.= " having 1=1 ";
        }
        if ($req['start_date_from']){
            $sqlj.=' AND (end_date>=?)';
            array_push($jparams,$req['start_date_from']." 00:00:00");
        }
        if ($req['start_date_to']){
            $sqlj.=' AND (end_date<=?)';
            array_push($jparams,$req['start_date_to']." 23:59:59");
        }
        $sqlj.=" order by j.position";
        $jobs = $this->jobs_model->query($sqlj, $jparams)->result_array();
        echo json_encode(array( 'Result' => 'OK', 'statuses' => $statuses, 'jobs'=>$jobs));
    }

    public function create_jobs_observation(){
        echo $this->jobs_observations_model->crud_create();
    }

    public function delete_jobs_observation(){
        echo $this->jobs_observations_model->crud_update(array('deleted'=>1));
    }

    public function get_observations($encode=TRUE){
        $req = request();
        $params =  array($req['job_id']);
        $sql = 'SELECT o.*, u.username as user_name
                from jobs_observations o
                left join users u on (u.id = o.rec_createdid)
                WHERE o.job_id = ? and o.deleted=0
                order by o.ts desc
                ';
        $limit 	= request('limit'); $offset	= request('offset');
        if ($limit!=null){
            $sql .= ' limit '.intval($limit);
        }
        if ($offset!=null){
            $sql .= ' offset '.intval($offset);
        }
        $result = $this->jobs_observations_model->crud_list_sql($sql,$params, '', $encode);
        if($encode){
            echo $result;
        }else{
            return $result;
        }
    }

    public function start_job(){
        $id = request('id');
        $status = request('status');     
        $options['job_id'] = $id;
        $options['status'] = $status;
        $options['userid'] = $this->session->userdata('userid');
        $rec = $this->jobs_work_log_model->crud_create($options, array(), false, false, false);

        if ($rec['Result'] == 'OK'){
            $sql = "update jobs set in_work=1, work_log_id=? where id = ? ";
            $params = array($rec['Record']['id'], $id);
            $upd = $this->jobs_model->query($sql, $params);
        }
        echo json_encode(array( 'Result' => 'OK', 'log_id'=>$rec['Record']['id']));
    }

    public function stop_job(){
        $req = request();
        $options['id'] = $req['work_log_id'];
        $options['end_time'] = date($this->config->item('log_date_format'));
        $rec = $this->jobs_work_log_model->crud_update($options, array(), false, false, false);

        if ($rec['Result'] == 'OK'){
            $sql = "update jobs set in_work=0, work_log_id=null where id = ? ";
            $params = array($req['id']);
            $upd = $this->jobs_model->query($sql, $params);
        }
        echo json_encode(array( 'Result' => 'OK'));
    }

    public function get_stat_total(){
        $req = request();
        $params = array();
        $sql = "SELECT sum(coalesce(j.working_minutes, 0)) as total_working_minutes
                FROM jobs j
                left join orders o on (o.id = j.order_id) 
                WHERE 1=1 ";
        if ($req['filter_search']){
            $where_like =$this->jobs_model->build_where_like($req['filter_search'], array('j.name', 'o.name', 'j.id'));
            $sql.= $where_like;
        }
        if ($req['filter_id']){
            $where_like2 =$this->jobs_model->build_where_like($req['filter_id'], array('o.id'));
            $sql.= $where_like2;
        }
        if ($req['start_date_from']){
            $sql.=' AND ((SELECT MAX(ts) FROM jobs_log l LEFT JOIN jobs_status s ON s.id=l.status_new where job_id=j.id AND s.`type`=2)>=?)';
            array_push($params,$req['start_date_from']." 00:00:00");
        }
        if ($req['start_date_to']){
            $sql.=' AND ((SELECT MAX(ts) FROM jobs_log l LEFT JOIN jobs_status s ON s.id=l.status_new where job_id=j.id AND s.`type`=2)<=?)';
            array_push($params,$req['start_date_to']." 23:59:59");
        }
        $res = $this->jobs_model->query($sql, $params)->result_array()[0];
        echo json_encode(array( 'Result' => 'OK', 'data' => $res));
    }

}

/* End of file jobs.php */