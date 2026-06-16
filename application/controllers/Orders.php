<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Orders extends MY_Controller {

    var $crud_models = array('orders_model', 'jobs_model', 'jobs_files_model', 'orders_files_model', 'orders_po_model', 'settings_model', 'clients_model', 'materials_cut_model', 'handlings_model', 'orders_observations_model', 'invoices_model');

    function __construct(){
        parent::__construct();
    }

    public function index(){
        $data = array();
        $data['admin'] = $this->session->userdata('admin');
        $data['userid'] = $this->session->userdata('userid');
        $data['price_right'] = $this->session->userdata('price_right');
        $data['manager'] = $this->session->userdata('manager');
        $data['settings'] = $this->settings_model->get_rec(1);
        $this->load->view('orders_view', $data);
    }

    public function list_orders(){
        $req = request();
        $params = array();
        $sql = "SELECT o.*, (SELECT IFNULL(SUM(if(j.STATUS=-2,1,if(s.type=2 or j.status=7,0.9,0)))*100/COUNT(j.id),0) FROM jobs j
                                left join jobs_status s on (s.id=j.status)
                                WHERE j.order_id = o.id) as procent,
                            (SELECT sum((price-material_price)*quantity) FROM jobs j WHERE j.order_id = o.id) as tot_price,
                            (SELECT sum((j.price+j.post_price)*quantity)+o.transport_cost FROM jobs j WHERE j.order_id = o.id) as total_price,
                            (select sum(j.working_minutes) FROM jobs j WHERE j.order_id = o.id) as working_minutes,
                            (SELECT count(id) FROM jobs j WHERE j.order_id = o.id) as job_number,
                            IF(EXISTS(SELECT handling from jobs j WHERE j.order_id = o.id and handling is not null), 1, 0) as handling,
                            IF(EXISTS(SELECT if((j.cylinder=0 AND (j.width=0 OR j.height=0 OR j.`length`=0)) OR (j.cylinder=1 AND (j.diameter=0 or j.`length`=0)), 1, 0) AS zero_position from jobs j WHERE j.order_id = o.id having zero_position=1), 1, 0) as zero_position,
                            IF(EXISTS(SELECT j.quantity from jobs j WHERE j.order_id = o.id and j.quantity>=5), 1, 0) as series,
                            IF(EXISTS(SELECT l.status from jobs_log l left join jobs j on (j.id=l.job_id) WHERE j.order_id = o.id and (l.status=15 or l.status_new=15)), 1, 0) as wrong,
                            st.wage,
                            (SELECT sum(material_price*quantity) FROM jobs j WHERE j.order_id = o.id) as total_material_price,
                            u.username,
                            c.regcode, c.head_office, c.invoice_info
                FROM orders o
                left join settings st on (st.id=1)
                left join users u on (u.id = o.user_count)
                left join clients c on (c.id = o.client_name)
                WHERE o.deleted = 0 ";
                //(SELECT SUM(j.weight*j.quantity) FROM jobs j WHERE j.order_id = o.id) as parcel_weight,
        if ($req['filter_search']){
            /*$where_like =$this->orders_model->build_where_like($req['filter_search'], array('o.name', 'o.description'));
            $sql.= $where_like;*/
            $sql.=" and (o.name LIKE '%".$req['filter_search']."%')";
        }
        if ($req['filter_job_search']){
            $sql.=" and (o.id in (select j.order_id from jobs j WHERE j.name LIKE '%".$req['filter_job_search']."%' or j.id LIKE '%".$req['filter_job_search']."%'))";
        }
        if ($req['filter_client']){
            $sql.=' AND (o.client_name=?)';
            array_push($params,$req['filter_client']);
        }
        if ($req['filter_id']){
            $sql.=' AND (o.id=?)';
            array_push($params,$req['filter_id']);
        }
        if (isset($req['filter_status']) && $req['filter_status']!=''){
            $sql .= " AND o.status in (".$req['filter_status'].") ";
        }
        if ($req['start_date_from']){
            $sql.=' AND (o.start_date>=?)';
            array_push($params,$req['start_date_from']." 00:00:00");
        }
        if ($req['start_date_to']){
            $sql.=' AND (o.start_date<=?)';
            array_push($params,$req['start_date_to']." 23:59:59");
        }
        if ($req['deadline_from']){
            $sql.=' AND (o.deadline>=?)';
            array_push($params,$req['deadline_from']." 00:00:00");
        }
        if ($req['deadline_to']){
            $sql.=' AND (o.deadline<=?)';
            array_push($params,$req['deadline_to']." 23:59:59");
        }
        /* percent */
        if ((isset($req['filter_percent_from']) && is_numeric($req['filter_percent_from'])) || (isset($req['filter_percent_to']) && is_numeric($req['filter_percent_to']))){
            $sql.= ' having 1=1 ';
        }
        if (isset($req['filter_percent_from']) && is_numeric($req['filter_percent_from'])){
            $sql .= ' AND ceil(((tot_price/wage*60) - working_minutes) / working_minutes * 100)>=? ';
            array_push($params,$req['filter_percent_from']);
        }
        if (isset($req['filter_percent_to']) && is_numeric($req['filter_percent_to'])){
            $sql .= ' AND ceil(((tot_price/wage*60) - working_minutes) / working_minutes * 100)<=? ';
            array_push($params,$req['filter_percent_to']);
        }
        echo $this->orders_model->crud_list_sql($sql, $params);
    }

    public function update_orders(){
        $req = request();
        $data['invoice_sent'] 		= (request('invoice_sent')) ? 1 : 0;
        $unset = ($req['status']==''?array('status'):array());
        echo $this->orders_model->crud_update($data, $unset);
    }

    public function create_orders(){
        $req = request();
        $attachments = "";
        $fileAttachments    = $req['fileAttachments'];
        if($fileAttachments!=""){
            $attachments = explode(',', $fileAttachments);
        }
        $po_attachments = "";
        $poAttachments    = $req['poAttachments'];
        if($poAttachments!=""){
            $po_attachments = explode(',', $poAttachments);
        }
        $rec = $this->orders_model->crud_create(array(), array(), false);
        if ($rec['Result'] == 'OK'){
            if($attachments!=""){
                $uploadDir = UPLOAD_FILE_DIR;
                foreach($attachments as $file){
                    $options = array();
                    $options['order_id'] = $rec['Record']['id'];
                    $filename = $file;
                    //$filename = str_replace(" ", "-", $filename);
                    $path_parts = pathinfo($file);
                    $new_name = $path_parts['filename'].".".$path_parts['extension'];
                    $options['name'] = $new_name;
                    
                    if(@rename($file, $uploadDir.$new_name)){
                        $res = $this->orders_files_model->crud_create($options, array(), FALSE);
                    }
                }
            }
            if($po_attachments!=""){
                $uploadDir = UPLOAD_FILE_DIR;
                foreach($po_attachments as $file){
                    $options = array();
                    $options['order_id'] = $rec['Record']['id'];
                    $filename = $file;
                    //$filename = str_replace(" ", "-", $filename);
                    $path_parts = pathinfo($file);
                    $new_name = $path_parts['filename'].".".$path_parts['extension'];
                    $options['name'] = $new_name;
                    
                    if(@rename($file, $uploadDir.str_replace(" ", "-", $new_name))){
                        $res = $this->orders_po_model->crud_create($options, array(), FALSE);
                    }
                }
            }
        }
        echo json_encode($rec);
    }

    public function delete_orders(){
        echo $this->orders_model->crud_update(array('deleted'=>1));
    }


    public function sel2_clients(){
        echo $this->clients_model->xsel2_clients();
    }

    //jobs
    public function list_jobs(){
        $req = request();
        $params = array('order_id'=>$req['order_id']);
        $sql = "SELECT j.*, concat(m.name, ' - ', m.code) as material_name, m.code as mat_code, m.name as mat_name, m.density, js.name as status_name, js.colour, concat('".profile_to_url(UPLOAD_IMG_DIR)."', j.image) as image_url, o.deadline, j.working_minutes,
        IF(EXISTS(SELECT l.status from jobs_log l WHERE l.job_id=j.id and (l.status=15 or l.status_new=15)), 1, 0) as wrong,
        concat('".profile_to_url(UPLOAD_IMG_DIR)."', j.stp) as stp_url,
        (SELECT GROUP_CONCAT(`name`) FROM jobs_files WHERE job_id=j.id) as files,
                (j.price+j.post_price) as unit_price,
                ((j.price+j.post_price)*j.quantity) as total_value
                FROM jobs j
                left join materials m on (m.id = j.materialid)
                left join jobs_status js on (js.id = j.status)
                left join orders o on (o.id = j.order_id)
                left join materials_cut mc on (mc.id=j.material_cut_id)
                WHERE j.order_id = ? ";
        //if(j.material_cut_id is not null, mc.cwidth, j.width) as width, if(j.material_cut_id is not null, mc.cheight, j.height) as height, if(j.material_cut_id is not null, mc.clength, j.length) as length
        if ($req['filter_job_search']){
            $sql.=" and (j.name LIKE '%".$req['filter_job_search']."%' or j.id LIKE '%".$req['filter_job_search']."%' or o.description LIKE '%".$req['filter_job_search']."%')";
        }
        echo $this->jobs_model->crud_list_sql($sql, $params);
    }

    public function list_jobs_plan(){
        $req = request();
        $params = array('order_id'=>$req['order_id']);
        $sql = "SELECT j.*, concat(m.name, ' - ', m.code) as material_name, m.code as mat_code, m.name as mat_name, m.density, js.name as status_name, js.colour, concat('".profile_to_url(UPLOAD_IMG_DIR)."', j.image) as image_url, o.deadline, j.working_minutes,
        concat('".profile_to_url(UPLOAD_IMG_DIR)."', j.stp) as stp_url,
        if(exists(SELECT jl.*, l.* FROM jobs_log jl
                    LEFT JOIN jobs_status js ON (js.id=jl.status_new)
                    JOIN jobs_log l ON (l.status_new = jl.status_new AND l.job_id!=jl.job_id AND l.ts BETWEEN DATE_ADD(jl.ts, INTERVAL -10 MINUTE) AND DATE_ADD(jl.ts, INTERVAL 10 MINUTE))
                    WHERE jl.job_id = j.id AND js.`type` = 1), 1, 0) as same_time  
                FROM jobs j
                left join materials m on (m.id = j.materialid)
                left join jobs_status js on (js.id = j.status)
                left join orders o on (o.id = j.order_id)
                left join materials_cut mc on (mc.id=j.material_cut_id)
                WHERE j.order_id = ? ";
        //if(j.material_cut_id is not null, mc.cwidth, j.width) as width, if(j.material_cut_id is not null, mc.cheight, j.height) as height, if(j.material_cut_id is not null, mc.clength, j.length) as length
        if ($req['filter_job_search']){
            $sql.=" and (j.name LIKE '%".$req['filter_job_search']."%' or j.id LIKE '%".$req['filter_job_search']."%' or o.description LIKE '%".$req['filter_job_search']."%')";
        }
        echo $this->jobs_model->crud_list_sql($sql, $params);
    }

    public function update_jobs(){
        $req = request();
        $attachments = "";
        $fileAttachments    = $req['fileAttachments'];
        if($fileAttachments!=""){
            $attachments = explode(',', $fileAttachments);
        }

        $options['material_ordered'] 		= (request('material_ordered')) ? 1 : 0;
        $options['cylinder'] 		= (request('cylinder')) ? 1 : 0;
        $options['calibration'] 	= (request('calibration')) ? 1 : 0;

        if($attachments!=""){
            $uploadDir = UPLOAD_FILE_DIR;
            foreach($attachments as $file){
                $aoptions = array();
                $aoptions['job_id'] = $req['id'];
                $filename = $file;
                $path_parts = pathinfo($file);
                $new_name = $path_parts['filename'].".".$path_parts['extension'];
                $aoptions['name'] = $new_name;
                
                if(@rename($file, $uploadDir.$new_name)){
                    $res = $this->jobs_files_model->crud_create($aoptions, array(), FALSE, true, false);
                }
            }
        }

        if($req['image_src'] && $req['image']){
            $data = $req['image_src'];
            $data = base64_decode($data);
            if(file_exists(UPLOAD_IMG_DIR.$req['image'])){
                $iname = basename($req['image'], ".png").".png";
                $options['image'] = $iname;
                file_put_contents(UPLOAD_IMG_DIR.$iname, $data);
            }else{
                file_put_contents(UPLOAD_IMG_DIR.$req['image'], $data);
            }
        }

        if($req['stp'] && file_exists(UPLOAD_TEMP.$req['stp'])){
            $uploadDir = UPLOAD_IMG_DIR;
            if(file_exists($uploadDir.$req['stp'])){
                $sext = pathinfo($req['stp'], PATHINFO_EXTENSION);
                $nstp = basename($req['stp'], $sext).".".$sext;
                $options['stp'] = $nstp;
                @rename(UPLOAD_TEMP.$req['stp'], $uploadDir.$nstp);
            }else{
                @rename(UPLOAD_TEMP.$req['stp'], $uploadDir.$req['stp']);
            }
        }

        $handlings = $req['handling'];
        if($handlings){
            $hvals = explode(",", $handlings);
            foreach($hvals as $key=>$val){
                $sql = "INSERT INTO handlings(id) VALUES(?) ON DUPLICATE KEY UPDATE id = ?;";
                $params = array($val, $val);
                $new = $this->handlings_model->query($sql, $params);
            }
        }

        /*if($req['material_type']==1){
            if($req['cut_id']){
                $mc = $this->materials_cut_model->crud_update(array('id'=>$req['cut_id']), array(), false);
            }else{
                $mc = $this->materials_cut_model->crud_create(array(), array(), false);
            }
            if ($mc['Result'] == 'OK'){
                $options['material_cut_id'] = $mc['Record']['id'];
                $options['material_qty'] = $mc['Record']['take_qty'];
            }
        }*/
        
        echo $this->jobs_model->crud_update($options);
    }

    public function create_jobs(){
        $req = request();
        $attachments = "";
        $fileAttachments    = $req['fileAttachments'];
        if($fileAttachments!=""){
            $attachments = explode(',', $fileAttachments);
        }
        $joptions = array();
        if($req['material_type']==1){
            $mc = $this->materials_cut_model->crud_create(array(), array(), false);
            if ($mc['Result'] == 'OK'){
                $joptions = array('material_cut_id'=>$mc['Record']['id'], 'material_qty'=>$mc['Record']['take_qty']);
            }
        }
        $rec = $this->jobs_model->crud_create($joptions, array(), false);
        if ($rec['Result'] == 'OK'){
            if($attachments!=""){
                $uploadDir = UPLOAD_FILE_DIR;
                foreach($attachments as $file){
                    $options = array();
                    $options['job_id'] = $rec['Record']['id'];
                    $filename = $file;
                    $path_parts = pathinfo($file);
                    $new_name = $path_parts['filename'].".".$path_parts['extension'];
                    $options['name'] = $new_name;
                    
                    if(@rename($file, $uploadDir.str_replace(" ", "-", $new_name))){
                        $res = $this->jobs_files_model->crud_create($options, array(), FALSE);
                    }
                }
            }
            if($req['stp'] && file_exists(UPLOAD_TEMP.$req['stp'])){
                $uploadDir = UPLOAD_IMG_DIR;
                @rename(UPLOAD_TEMP.$req['stp'], $uploadDir.$req['stp']);
            }
            /*if($req['image_name'] && $req['image_new_name']){
                $uploadDir = UPLOAD_IMG_DIR;
                if(@rename(UPLOAD_TEMP.$req['image_name'], $uploadDir.$req['image_new_name'])){
                    $options = array();
                    $options['id'] = $rec['Record']['id'];
                    $options['image'] = $req['image_new_name'];
                    $res = $this->jobs_model->crud_update($options, array(), FALSE);
                }
            }*/
            if($req['image_src'] && $req['image']){
                $data = $req['image_src'];
                $data = base64_decode($data);

                file_put_contents(UPLOAD_IMG_DIR.$req['image'], $data);
            }

            $handlings = $req['handling'];
            if($handlings){
                $hvals = explode(",", $handlings);
                foreach($hvals as $key=>$val){
                    $sql = "INSERT INTO handlings(id) VALUES(?) ON DUPLICATE KEY UPDATE id = ?;";
                    $params = array($val, $val);
                    $new = $this->handlings_model->query($sql, $params);
                }
            }
        }
        echo json_encode($rec);
    }

    public function delete_jobs(){
        echo $this->jobs_model->crud_delete();
    }

    //jobs files
    public function list_jobs_files(){
        $req = request();
        $params = array('job_id'=>$req['job_id']);
        $sql = "SELECT f.*, concat('".profile_to_url(UPLOAD_FILE_DIR)."', f.name) as file_url
                FROM jobs_files f
                WHERE f.job_id = ? ";
        echo $this->jobs_files_model->crud_list_sql($sql, $params);
    }

    public function delete_jobs_files(){
        $req = request();
        $file = $this->jobs_files_model->get(array('id'=>$req['id']));
        $this->jobs_files_model->del_image_file($file['name'],UPLOAD_FILE_DIR);
        echo $this->jobs_files_model->crud_delete();
    }

    public function create_jobs_file(){
        $req = request();
        $isNewImage = true;
        $options = array();
        $uploadDir = UPLOAD_FILE_DIR;
        $options['job_id'] = $req['job_id'];
        $filename = $req['name'];
        $path_parts = pathinfo(UPLOAD_TEMP.$filename);
        $new_name = $path_parts['filename'].".".$path_parts['extension'];
        $options['name'] = $new_name;
        
        if(@rename(UPLOAD_TEMP.$filename, $uploadDir.$new_name)){
            $res = $this->jobs_files_model->crud_create($options, array(), FALSE);
        }else{
            $res['Result']='ERROR';
            $res['Message']='Error uploading file';
        }
        echo json_encode($res);
    }


    //orders files
    public function list_orders_files(){
        $req = request();
        $params = array('order_id'=>$req['order_id'], 0, $this->session->userdata('admin'));
        $sql = "SELECT f.*, concat('".profile_to_url(UPLOAD_FILE_DIR)."', f.name) as file_url
                FROM orders_files f
                WHERE f.order_id = ? and (private =? OR private = ?) ";
        echo $this->orders_files_model->crud_list_sql($sql, $params);
    }

    public function delete_orders_files(){
        $req = request();
        $file = $this->orders_files_model->get(array('id'=>$req['id']));
        $this->orders_files_model->del_image_file($file['name'],UPLOAD_FILE_DIR);
        echo $this->orders_files_model->crud_delete();
    }

    public function create_orders_file(){
        $req = request();
        $isNewImage = true;
        $options = array();
        $uploadDir = UPLOAD_FILE_DIR;
        $options['order_id'] = $req['order_id'];
        $filename = $req['name'];
        $path_parts = pathinfo(UPLOAD_TEMP.$filename);
        $new_name = $path_parts['filename'].".".$path_parts['extension'];
        $options['name'] = $new_name;
        
        if(@rename(UPLOAD_TEMP.$filename, $uploadDir.$new_name)){
            $res = $this->orders_files_model->crud_create($options, array(), FALSE);
        }else{
            $res['Result']='ERROR';
            $res['Message']='Error uploading file';
        }
        echo json_encode($res);
    }

    public function change_order_file_private(){
        $set['private'] = request('private');
        $where['id'] 	= request('id');
        echo $this->orders_files_model->multi_update($set,$where);
    }

    //orders po
    public function list_orders_po(){
        $req = request();
        $params = array('order_id'=>$req['order_id']);
        $sql = "SELECT f.*, concat('".profile_to_url(UPLOAD_FILE_DIR)."', f.name) as file_url
                FROM orders_po f
                WHERE f.order_id = ? ";
        echo $this->orders_po_model->crud_list_sql($sql, $params);
    }

    public function delete_orders_po(){
        $req = request();
        $file = $this->orders_po_model->get(array('id'=>$req['id']));
        $this->orders_po_model->del_image_file($file['name'],UPLOAD_FILE_DIR);
        echo $this->orders_po_model->crud_delete();
    }

    public function create_orders_po(){
        $req = request();
        $isNewImage = true;
        $options = array();
        $uploadDir = UPLOAD_FILE_DIR;
        $options['order_id'] = $req['order_id'];
        $filename = $req['name'];
        $path_parts = pathinfo(UPLOAD_TEMP.$filename);
        $new_name = $path_parts['filename'].".".$path_parts['extension'];
        $options['name'] = $new_name;
        
        if(@rename(UPLOAD_TEMP.$filename, $uploadDir.$new_name)){
            $res = $this->orders_po_model->crud_create($options, array(), FALSE);
        }else{
            $res['Result']='ERROR';
            $res['Message']='Error uploading file';
        }
        echo json_encode($res);
    }

    public function enable_one_plan(){
        $set['plan'] = request('plan');
        $where['id'] 	= request('id');
        echo $this->orders_model->multi_update($set,$where);
    }

    public function enable_one_finish(){
        $set['finished'] = request('finished');
        $where['id'] 	= request('id');
        echo $this->orders_model->multi_update($set,$where);
    }

    public function list_plans(){
        $req = request();
        $params = array();
        $sql = "SELECT o.*, (SELECT IFNULL(SUM(if(j.STATUS=-2,1,if(s.type=2 or j.status=7,0.9,0)))*100/COUNT(j.id),0) FROM jobs j
                                left join jobs_status s on (s.id=j.status)
                                WHERE j.order_id = o.id) as procent,
                            (SELECT sum((price-material_price)*quantity) FROM jobs j WHERE j.order_id = o.id) as tot_price,
                            (SELECT sum((price-material_price)*quantity) FROM jobs j WHERE j.order_id = o.id and j.`status` not in (2, 13, 23, -2, 7, 14)) as remaining_price,
                            (SELECT count(id) FROM jobs j WHERE j.order_id = o.id) as job_number,
                            (SELECT count(id) FROM jobs j WHERE j.order_id = o.id and j.status!=0) as prog_number,
                            if(o.init_date IS NOT NULL, DATEDIFF(o.init_date, current_date)-calc_workingdays(o.init_date, current_date), '') as date_diff
                FROM orders o
                WHERE o.plan = 1 and o.deleted=0 ";
        if ($req['day']){
            $sql.=' AND (o.plan_day=?)';
            array_push($params,$req['day']);
        }
        $sql.=' order by o.plan_order ASC';
        echo $this->orders_model->crud_list_sql($sql, $params);
    }

    public function save_comment(){
        echo $this->orders_model->crud_update();
    }

    public function order_element(){
        $ids			= request('ids');
        foreach($ids as $rec){
            $update = $this->orders_model->crud_update($rec, array(), false, false, false);
        }
        echo json_encode(array('Result'=>'OK'));
    }

    public function enable_one_archived(){
        $set['archived'] = request('archived');
        $where['id'] 	= request('id');
        echo $this->jobs_model->multi_update($set,$where);
    }

    public function import_parts(){
        $order_id = request('id');
        if ($order_id){
            $this->load->library('Migrate_parts');
            $this->migrate_parts->initialize($this->db_cli);
            $this->migrate_parts->import_parts($order_id);
        }else{
            echo json_encode(array('Result'=>'ERROR','Message'=>'Order not selected! Please select a user and try again!'));
        }
    }

    public function export_parts(){
        $order_id = request('id');
        $this->load->library('Migrate_parts');
        $this->migrate_parts->initialize($this->db_cli);
        $this->migrate_parts->export_parts($order_id);
    }

    public function export_zip(){
        $order_id = request('id');

        $params = array('order_id'=>$order_id);
        $sql = "SELECT * from orders o
                WHERE o.id = ? ";
        $order =  $this->orders_model->query($sql, $params)->result_array()[0];
        
        //$dirname =  $order['id'].' Projekt - '.$order['name'].' - '.$order['client_name'].' - '.date('d.m.Y', strtotime($order['start_date']));
        $dirname =  $order['id'].' Projekt - '.date('d.m.Y', strtotime($order['start_date']));
        $zip_filename = $dirname.'.zip';

        /**/
        $zip_file = UPLOAD_TEMP.$zip_filename;
        
        $zip = new ZipArchive();
        if ($zip->open($zip_file,ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE){
            $zip->addEmptyDir($dirname); 

            $params = array($order_id);
            $sql = "SELECT f.*
                FROM orders_po f
                WHERE f.order_id = ? ";
            $pos =  $this->orders_model->query($sql, $params)->result_array();
            foreach($pos as $pf){
                $zip->addFile(UPLOAD_FILE_DIR.$pf['name'], $dirname.'/'.$pf['name']); 
            }

            $params = array($order_id);
            $sql = "SELECT f.*
                FROM orders_files f
                WHERE f.order_id = ? ";
            $files =  $this->orders_model->query($sql, $params)->result_array();
            foreach($files as $f){
                $zip->addFile(UPLOAD_FILE_DIR.$f['name'], $dirname.'/'.$f['name']); 
            }

            $params = array($order_id);
            $sql = "SELECT * from jobs j
                    WHERE j.order_id = ? ";
            $jobs =  $this->jobs_model->query($sql, $params)->result_array();

            foreach($jobs as $job){
                $jdir = $dirname.'/'.$job['id'].' - '.$job['name'];
                $zip->addEmptyDir($jdir); 
                if($job['stp']){
                    $zip->addFile(UPLOAD_IMG_DIR.$job['stp'], $jdir.'/'.$job['stp']);
                } 
                if($job['image']){
                    $zip->addFile(UPLOAD_IMG_DIR.$job['image'], $jdir.'/'.$job['image']); 
                }

                $params = array($job['id']);
                $sql = "SELECT f.*
                        FROM jobs_files f
                        WHERE f.job_id = ? ";
                $jfiles =  $this->jobs_model->query($sql, $params)->result_array();
                foreach($jfiles as $f){
                    $zip->addFile(UPLOAD_FILE_DIR.$f['name'], $jdir.'/'.$f['name']); 
                }
            }

            $zip->close(); 
        }else{
            die('archive failed');
        }
        if (ob_get_level()){ ob_end_clean(); } //turn off output buffering - if not will fail with out of memory fpassthru or readfile on big files
        header("Pragma: public");
        header("Expires: 0");
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Cache-Control: public");
        header("Content-Description: File Transfer");
        header("Content-Type: application/force-download");
        header("Content-Type: application/json");
        header("Content-Disposition: attachment; filename=\"".$zip_filename."\"");
        header("Content-Length: ".filesize($zip_file));
        header('Set-Cookie: fileDownload=true; path=/');
        readfile($zip_file);
        @unlink($zip_file);
    }

    public function create_materials_cut(){
        $req = request();
        if($req['id']){
            echo $this->materials_cut_model->crud_update();
        }else{
            echo $this->materials_cut_model->crud_create();
        }
    }

    public function get_parcel_weight(){
        $id = request('id');
        $sql = "SELECT SUM(j.weight*j.quantity) as parcel_weight FROM jobs j WHERE j.order_id = ? ";
        $params = array($id);
        $parcel_weight = $this->jobs_model->query($sql, $params)->result_array();
        echo json_encode(array( 'Result' => 'OK', 'weight'=>$parcel_weight[0]['parcel_weight']));
    }

    public function get_material_list(){
        $req = request();
        $params = array('order_id'=>$req['order_id']);
        $sql = "SELECT j.*, concat(m.name, ' - ', m.code) as material_name, m.code as mat_code, m.name as mat_name, m.density, js.name as status_name, js.colour, o.deadline
                FROM jobs j
                left join materials m on (m.id = j.materialid)
                left join jobs_status js on (js.id = j.status)
                left join orders o on (o.id = j.order_id)
                left join materials_cut mc on (mc.id=j.material_cut_id)
                WHERE j.order_id = ? ";
        echo $this->jobs_model->crud_list_sql($sql, $params);
    }

    public function create_orders_observation(){
        echo $this->orders_observations_model->crud_create();
    }

    public function delete_orders_observation(){
        echo $this->orders_observations_model->crud_update(array('deleted'=>1));
    }

    public function get_observations($encode=TRUE){
        $req = request();
        $params =  array($req['order_id']);
        $sql = 'SELECT o.*, u.username as user_name
                from orders_observations o
                left join users u on (u.id = o.rec_createdid)
                WHERE o.order_id = ? and o.deleted=0
                order by o.ts desc
                ';
        $limit 	= request('limit'); $offset	= request('offset');
        if ($limit!=null){
            $sql .= ' limit '.intval($limit);
        }
        if ($offset!=null){
            $sql .= ' offset '.intval($offset);
        }
        $result = $this->orders_observations_model->crud_list_sql($sql,$params, '', $encode);
        if($encode){
            echo $result;
        }else{
            return $result;
        }
    }

    public function create_invoice(){
        $req = request();
        $pdf_data = request('data', false);
        if (strpos($pdf_data, 'base64,') !== false) {
            $pdf_data = explode('base64,', $pdf_data)[1];
        }

        $pdf_decoded = base64_decode($pdf_data);
        file_put_contents(UPLOAD_INVOICE_DIR.$req['filename'], $pdf_decoded);
        
        $options['id'] = $req['id'];
        $options['invoice_file'] = $req['filename'];
        $rec = $this->orders_model->crud_update($options, array(), false, false, false);
        if ($rec['Result'] == 'OK'){
            $sql = "update settings set invoice_nr=invoice_nr+1 where id = 1";
            $params = array();
            $upd = $this->settings_model->query($sql, $params);

            $ioptions['serial'] = 'CNC';
            $ioptions['nr'] = $req['nr'];
            $ioptions['date'] = $req['date'];
            $ioptions['amount'] = $req['record']['total_price'];
            $ioptions['client_name'] = $req['record']['client_name'];
            $ioptions['invoice_file'] = $req['filename'];
            $inv = $this->invoices_model->crud_create($ioptions, array(), false, false, false);
        }
        echo json_encode(array( 'Result' => 'OK'));
    }

}

/* End of file orders.php */