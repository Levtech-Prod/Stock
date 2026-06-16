<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Statistics extends MY_Controller {

    var $crud_models = array('orders_model', 'jobs_model', 'settings_model', 'qc_types_model');

    function __construct(){
        parent::__construct();
    }

    public function index(){
        $data = array();
        $data['admin'] = $this->session->userdata('admin');
        $data['price_right'] = $this->session->userdata('price_right');
        $data['settings'] = $this->settings_model->get_rec(1);
        $this->load->view('statistics_view', $data);
    }

    //jobs
    public function list_statistics(){
        $req = request();
        $params = array();
        $sql = "SELECT j.*, concat(m.name, ' - ', m.code) as material_name, m.density, js.name as status_name, js.colour, concat('".profile_to_url(UPLOAD_IMG_DIR)."', j.image) as image_url, j.working_minutes, (material_price*quantity) as total,
        coalesce(((j.price-j.material_price)*quantity)/(j.working_minutes/60), 0) as total_hour,
        (SELECT MAX(ts) FROM jobs_log l LEFT JOIN jobs_status s ON s.id=l.status_new where job_id=j.id AND s.`type`=2) AS end_date,
        (SELECT GROUP_CONCAT(distinct u.username SEPARATOR ', ') FROM jobs_log l LEFT JOIN users u ON (u.id=l.userid) LEFT JOIN jobs_status s ON s.id=l.status_new LEFT JOIN jobs_status os ON os.id=l.status WHERE l.job_id=j.id and (s.`type` in (1,2) or os.`type` in (1,2))) AS work_names,
        o.client_name, calc_qc_time(j.id) as qc_time 
                FROM jobs j
                left join materials m on (m.id = j.materialid)
                left join jobs_status js on (js.id = j.status)
                left join orders o on (o.id = j.order_id)
                WHERE 1=1 ";
        if ($req['filter_search']){
            $where_like =$this->jobs_model->build_where_like($req['filter_search'], array('j.name', 'j.description'));
            $sql.= $where_like;
        }
        if ($req['filter_order']){
            $sql.=' AND (j.order_id=?)';
            array_push($params,$req['filter_order']);
        }
        if ($req['filter_client']){
            $sql.=' AND (o.client_name=?)';
            array_push($params,$req['filter_client']);
        }
        if ($req['filter_id']){
            $sql.=' AND (j.id=?)';
            array_push($params,$req['filter_id']);
        }
        if ($req['start_date_from'] || $req['start_date_to']){
            $sql.= " having 1=1 ";
        }
        if ($req['start_date_from']){
            $sql.=' AND (end_date>=?)';
            array_push($params,$req['start_date_from']." 00:00:00");
        }
        if ($req['start_date_to']){
            $sql.=' AND (end_date<=?)';
            array_push($params,$req['start_date_to']." 23:59:59");
        }
        echo $this->jobs_model->crud_list_sql($sql, $params);
    }

    public function get_stat_total(){
        $req = request();
        $params = array();
        $sql = "SELECT sum(j.quantity) as total_quantity, 
                     sum(j.price*j.quantity) as total_price,
                    sum(material_price*quantity) as total_mat_price,
                    SUM((((j.price-material_price)*quantity)/st.wage*60)) AS total_est_time,
                    sum(coalesce(j.working_minutes, 0)) as total_working_minutes
                FROM jobs j
                left join materials m on (m.id = j.materialid)
                left join settings st on (st.id=1)
                WHERE 1=1 ";
                //+calc_qc_time(j.id)
        if ($req['filter_search']){
            $where_like =$this->jobs_model->build_where_like($req['filter_search'], array('j.name', 'j.description'));
            $sql.= $where_like;
        }
        if ($req['filter_order']){
            $sql.=' AND (j.order_id=?)';
            array_push($params,$req['filter_order']);
        }
        if ($req['filter_id']){
            $sql.=' AND (j.id=?)';
            array_push($params,$req['filter_id']);
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

    public function sel2_orders(){
        echo $this->orders_model->xsel2_sel2_orders();
    }

    public function get_data(){
        $req = request();
        $params = array();
        $date_from 		= request('start_date_from');
        $date_to 		= request('start_date_to');
        $monday = strtotime('next Monday -1 week');
        $monday = date('w', $monday)==date('w') ? strtotime(date("Y-m-d",$monday)." +7 days") : $monday;
        $sunday = strtotime(date("Y-m-d",$monday)." +6 days");
        if (!$date_from){
            $date_from 	= date("Y-m-d",$monday);
        }
        if (!$date_to){
            $date_to	= date("Y-m-d",$sunday);
        }
        $selectable = " date(j.ts)";
        switch ($req['range']) {
            case 0:
                $selectable = " date(j.ts)";
                break;
            case 1:
                $selectable = " date(j.ts)";
                break;
            case 2:
                $selectable = " DATE_FORMAT(j.ts, '%Y-%m') ";
                break;
        }        
        $sql = "SELECT SUM(COALESCE(j.quantity*j.price, 0)) AS total, ".$selectable." AS date, WEEK(j.ts) as week_number
                    FROM jobs j
                    left join materials m on (m.id = j.materialid)
                    left join jobs_status js on (js.id = j.status)
                    WHERE (js.`type`=2 OR j.`status`=7 OR j.`status`=-2) ";
        $sqlm = "SELECT SUM(COALESCE(j.material_price*quantity, 0)) AS total, ".$selectable." AS date, WEEK(j.ts) as week_number
                    FROM jobs j
                    left join materials m on (m.id = j.materialid)
                    left join jobs_status js on (js.id = j.status)
                    WHERE (js.`type`=2 OR j.`status`=7 OR j.`status`=-2) ";
         if ($req['filter_search']){
            $where_like =$this->jobs_model->build_where_like($req['filter_search'], array('j.name', 'j.description'));
            $sql.= $where_like;
            $sqlm.= $where_like;
        }
        if ($req['filter_order']){
            $sql.=' AND (j.order_id=?)';
            $sqlm.=' AND (j.order_id=?)';
            array_push($params,$req['filter_order']);
        }
        if ($req['filter_id']){
            $sql.=' AND (j.id=?)';
            $sqlm.=' AND (j.id=?)';
            array_push($params,$req['filter_id']);
        }
        if ($date_from){
            $sql.=' AND (j.ts>=?)';
            $sqlm.=' AND (j.ts>=?)';
            array_push($params,$date_from." 00:00:00");
        }
        if ($date_to){
            $sql.=' AND (j.ts<=?)';
            $sqlm.=' AND (j.ts<=?)';
            array_push($params,$date_to." 23:59:59");
        }
        switch ($req['range']) {
            case 0:
                $sql.= " GROUP BY date(j.ts)";
                $sqlm.= " GROUP BY date(j.ts)";
                break;
            case 1:
                $sql.= " GROUP BY WEEK(j.ts)";
                $sqlm.= " GROUP BY WEEK(j.ts)";
                break;
            case 2:
                $sql.= " GROUP BY MONTH(j.ts)";
                $sqlm.= " GROUP BY MONTH(j.ts)";
                break;
        }        
        $data = $this->jobs_model->query($sql, $params)->result_array();
        $datam = $this->jobs_model->query($sqlm, $params)->result_array();
        $loop_date	= $date_from;

        if ($data){
            while (strtotime($loop_date) <= strtotime($date_to)){
                switch ($req['range']) {
                    case 0:
                        $datef = date('Y-m-d', strtotime($loop_date));
                        break;
                    case 1:
                        $datef = (int)date('W', strtotime($loop_date));
                        break;
                    case 2:
                        $datef = date('Y-m', strtotime($loop_date));
                        break;
                }  
                if($req['range']==1){
                    if (!in_array_multidim($datef, $data)){
                        $add_to_array = Array("total" => '0', "date" => date('Y-m-d', strtotime($loop_date)), 'week_number'=>$datef );
                        array_push($data, $add_to_array);
                    }
                }else{
                    if (!in_array_multidim($datef, $data)){
                        $add_to_array = Array("total" => '0', "date" => $datef );
                        array_push($data, $add_to_array);
                    }
                }
                switch ($req['range']) {
                    case 0:
                        $loop_date = date('Y-m-d', strtotime( "$loop_date + 1 day" ));
                        break;
                    case 1:
                        $loop_date = date('Y-m-d', strtotime( "$loop_date + 1 week" ));
                        break;
                    case 2:
                        $loop_date = date('Y-m-d', strtotime( "$loop_date + 1 month" ));
                        break;
                }        
            }
        }
        $loop_date	= $date_from;
        if ($datam){
            while (strtotime($loop_date) <= strtotime($date_to)){
                switch ($req['range']) {
                    case 0:
                        $datef = date('Y-m-d', strtotime($loop_date));
                        break;
                    case 1:
                        $datef = (int)date('W', strtotime($loop_date));
                        break;
                    case 2:
                        $datef = date('Y-m', strtotime($loop_date));
                        break;
                }  
                if($req['range']==1){
                    if (!in_array_multidim($datef, $datam)){
                        $add_to_array = Array("total" => '0', "date" => date('Y-m-d', strtotime($loop_date)), 'week_number'=>$datef );
                        array_push($datam, $add_to_array);
                    }
                }else{
                    if (!in_array_multidim($datef, $datam)){
                        $add_to_array = Array("total" => '0', "date" => $loop_date );
                        array_push($datam, $add_to_array);
                    }
                }
                switch ($req['range']) {
                    case 0:
                        $loop_date = date('Y-m-d', strtotime( "$loop_date + 1 day" ));
                        break;
                    case 1:
                        $loop_date = date('Y-m-d', strtotime( "$loop_date + 1 week" ));
                        break;
                    case 2:
                        $loop_date = date('Y-m-d', strtotime( "$loop_date + 1 month" ));
                        break;
                }        
            }
        }
        $totarr = array_sum(array_column($data, "total"));
        $totmarr = array_sum(array_column($datam, "total"));
        echo json_encode(array( 'Result' => 'OK', 'data'=>$data, 'datam'=>$datam, 'total'=>$totarr, 'total_material'=>$totmarr));
    }


    public function getMachineUsing(){
        $req = request();
        if ( (abs(strtotime($req['date_from'])-strtotime($req['date_to']))/60/60/24)<=(31)){
            $sparams = array();
            $sqls = "SELECT s.* from jobs_status s where `type`=1
                    order by sort";
            $statuses = $this->jobs_model->query($sqls, $sparams)->result_array();

            $begin = new DateTime($req['date_from']);
            $end   = new DateTime($req['date_to']);

            $data = array();

            for($i = $begin; $i <= $end; $i->modify('+1 day')){
                $date = $i->format("Y-m-d");
                $params = array($date);
                $sql = "SELECT calc_machine_using(id, ?) AS minutes FROM jobs_status WHERE `type`=1 ORDER BY sort";
                $datas = $this->jobs_model->query($sql, $params)->result_array();
                $data[$date] = $datas;
            }
            
            echo json_encode(array( 'Result' => 'OK', 'statuses' => $statuses, 'data'=>$data));
        }else{
            $result = array("Result"=>"ERROR","Message"=>sprintf(lang('global_error_max_time_interval'), 1));
            echo json_encode($result);
        }
    }

    public function getQctypes(){
        $req = request();
        $sparams = array();
        $sqls = "SELECT t.* from qc_types t
                order by t.id";
        $types = $this->qc_types_model->query($sqls, $sparams)->result_array();

        $data = array();

        foreach($types as $type){
            $params = array($type['id']);
            $sql = "SELECT count(*) AS total FROM jobs WHERE `qc_type`=? ";
            if ($req['date_from']){
                $sql.=' AND (rec_modified>=?)';
                array_push($params,$req['date_from']." 00:00:00");
            }
            if ($req['date_to']){
                $sql.=' AND (rec_modified<=?)';
                array_push($params,$req['date_to']." 23:59:59");
            }
            $datas = $this->jobs_model->query($sql, $params)->result_array()[0];
            array_push($data, $datas['total']);
        }
        
        echo json_encode(array( 'Result' => 'OK', 'types' => $types, 'data'=>$data));
    }

}

/* End of file statistics.php */