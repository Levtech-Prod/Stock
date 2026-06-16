<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Quoting extends MY_Controller {

    var $crud_models = array('quoting_model', 'quoting_parts_model','quoting_files_model', 'settings_model', 'quoting_status_model', 'clients_model', 'handlings_model', 'quoting_observations_model', 'quoting_log_model');

    function __construct(){
        parent::__construct();
    }

    public function index(){
        $data = array();
        $data['admin'] = $this->session->userdata('admin');
        $data['userid'] = $this->session->userdata('userid');
        $data['price_right'] = $this->session->userdata('price_right');
        $data['settings'] = $this->settings_model->get_rec(1);
        $this->load->view('quoting_view', $data);
    }

    public function list_quoting(){
        $req = request();
        $params = array();
        //(SELECT sum((price-material_price)*quantity)+o.transport_cost FROM quoting_parts p WHERE p.quoting_id = o.id) as tot_price,
        $sql = "SELECT o.*, s.name as status_name, s.colour, c.regcode, c.head_office,
                    (SELECT sum(price*quantity) FROM quoting_parts p WHERE p.quoting_id = o.id) as price,
                    (SELECT sum(material_price*quantity) FROM quoting_parts p WHERE p.quoting_id = o.id) as total_material_price,
                    (SELECT sum(post_price*quantity) FROM quoting_parts p WHERE p.quoting_id = o.id) as total_post_price,
                    (SELECT count(id) FROM quoting_parts p WHERE p.quoting_id = o.id) as part_number
                FROM quoting o
                left join quoting_status s on (s.id = o.status)
                left join clients c on (c.id = o.client_name)
                WHERE o.deleted = 0 ";
                //(SELECT SUM(p.weight*p.quantity) FROM quoting_parts p WHERE p.quoting_id = o.id) as parcel_weight
        if ($req['filter_search']){
            /*$where_like =$this->quoting_model->build_where_like($req['filter_search'], array('o.name', 'o.description'));
            $sql.= $where_like;*/
            $sql.=" and (o.name LIKE '%".$req['filter_search']."%')";
        }
        if ($req['filter_job_search']){
            $sql.=" and (o.id in (select j.quoting_id from quoting_parts j WHERE j.name LIKE '%".$req['filter_job_search']."%'))";
        }
        if ($req['filter_client']){
            $sql.=' AND (o.client_name=?)';
            array_push($params,$req['filter_client']);
        }
        if ($req['filter_id']){
            $sql.=' AND (o.id=?)';
            array_push($params,$req['filter_id']);
        }
        if ($req['filter_status']){
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
        if ($req['sent_date_from']){
            $sql.=' AND (o.sent_date>=?)';
            array_push($params,$req['sent_date_from']." 00:00:00");
        }
        if ($req['deadline_to']){
            $sql.=' AND (o.sent_date<=?)';
            array_push($params,$req['sent_date_to']." 23:59:59");
        }
        echo $this->quoting_model->crud_list_sql($sql, $params);
    }

    public function update_quoting(){
        echo $this->quoting_model->crud_update();
    }

    public function create_quoting(){
        $req = request();
        $attachments = "";
        $fileAttachments    = $req['fileAttachments'];
        if($fileAttachments!=""){
            $attachments = explode(',', $fileAttachments);
        }
        $rec = $this->quoting_model->crud_create(array(), array(), false);
        if ($rec['Result'] == 'OK'){
            if($attachments!=""){
                $uploadDir = UPLOAD_QUOTING_DIR;
                foreach($attachments as $file){
                    $options = array();
                    $options['quoting_id'] = $rec['Record']['id'];
                    $filename = $file;
                    //$filename = str_replace(" ", "-", $filename);
                    $path_parts = pathinfo($file);
                    $new_name = $path_parts['filename'].".".$path_parts['extension'];
                    $options['name'] = $new_name;
                    
                    if(@rename($file, $uploadDir.$new_name)){
                        $res = $this->quoting_files_model->crud_create($options, array(), FALSE);
                    }
                }
            }
        }
        echo json_encode($rec);
    }

    public function delete_quoting(){
        echo $this->quoting_model->crud_update(array('deleted'=>1));
    }


    public function sel2_clients(){
        echo $this->clients_model->xsel2_clients();
    }

    //quoting_parts
    public function list_parts(){
        $req = request();
        $params = array('quoting_id'=>$req['quoting_id']);
        $sql = "SELECT j.*, concat(m.name, ' - ', m.code) as material_name, m.code as mat_code, m.name as mat_name, m.density, concat('".profile_to_url(UPLOAD_QUOTING_IMG_DIR)."', j.image) as image_url, concat('".profile_to_url(UPLOAD_QUOTING_IMG_DIR)."', j.stp) as stp_url, concat('".profile_to_url(UPLOAD_QUOTING_IMG_DIR)."', j.pdf) as pdf_url,
        (j.price*j.quantity) as tot_price, (((material_price+j.price+j.post_price)*j.quantity)) as total_price
                FROM quoting_parts j
                left join materials m on (m.id = j.materialid)
                left join quoting o on (o.id = j.quoting_id)
                WHERE j.quoting_id = ? ";
        if ($req['filter_job_search']){
            $sql.=" and (j.name LIKE '%".$req['filter_job_search']."%' or o.description LIKE '%".$req['filter_job_search']."%')";
        }
        echo $this->quoting_parts_model->crud_list_sql($sql, $params);
    }

    public function update_parts(){
        $req = request();
        $options['material_ordered'] 		= (request('material_ordered')) ? 1 : 0;
        $options['cylinder'] 		= (request('cylinder')) ? 1 : 0;
        if($req['image_src'] && $req['image']){
            $data = $req['image_src'];
            $data = base64_decode($data);
            if(file_exists(UPLOAD_QUOTING_IMG_DIR.$req['image'])){
                $iname = basename($req['image'], ".png").".png";
                $options['image'] = $iname;
                file_put_contents(UPLOAD_QUOTING_IMG_DIR.$iname, $data);
            }else{
                file_put_contents(UPLOAD_QUOTING_IMG_DIR.$req['image'], $data);
            }
        }
        if($req['stp'] && file_exists(UPLOAD_TEMP.$req['stp'])){
            $uploadDir = UPLOAD_QUOTING_IMG_DIR;
            if(file_exists($uploadDir.$req['stp'])){
                $sext = pathinfo($req['stp'], PATHINFO_EXTENSION);
                $nstp = basename($req['stp'], $sext).".".$sext;
                $options['stp'] = $nstp;
                @rename(UPLOAD_TEMP.$req['stp'], $uploadDir.$nstp);
            }else{
                @rename(UPLOAD_TEMP.$req['stp'], $uploadDir.$req['stp']);
            }
        }
        if($req['pdf'] && file_exists(UPLOAD_TEMP.$req['pdf'])){
            $uploadDir = UPLOAD_QUOTING_IMG_DIR;
            if(file_exists($uploadDir.$req['pdf'])){
                $sext = pathinfo($req['pdf'], PATHINFO_EXTENSION);
                $npdf = basename($req['pdf'], $sext).".".$sext;
                $options['pdf'] = $npdf;
                @rename(UPLOAD_TEMP.$req['pdf'], $uploadDir.$npdf);
            }else{
                @rename(UPLOAD_TEMP.$req['pdf'], $uploadDir.$req['pdf']);
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
        echo $this->quoting_parts_model->crud_update($options);
    }

    public function create_parts(){
        $req = request();
        $rec = $this->quoting_parts_model->crud_create(array(), array(), false);
        if ($rec['Result'] == 'OK'){
            if($req['image_src'] && $req['image']){
                $data = $req['image_src'];
                $data = base64_decode($data);

                file_put_contents(UPLOAD_QUOTING_IMG_DIR.$req['image'], $data);
            }
            if($req['stp'] && file_exists(UPLOAD_TEMP.$req['stp'])){
                $uploadDir = UPLOAD_QUOTING_IMG_DIR;
                @rename(UPLOAD_TEMP.$req['stp'], $uploadDir.$req['stp']);
            }
            if($req['pdf'] && file_exists(UPLOAD_TEMP.$req['pdf'])){
                $uploadDir = UPLOAD_QUOTING_IMG_DIR;
                @rename(UPLOAD_TEMP.$req['pdf'], $uploadDir.$req['pdf']);
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

    public function delete_parts(){
        echo $this->quoting_parts_model->crud_delete();
    }

    //quoting files
    public function list_quoting_files(){
        $req = request();
        $params = array('quoting_id'=>$req['quoting_id']);
        $sql = "SELECT f.*, concat('".profile_to_url(UPLOAD_QUOTING_DIR)."', f.name) as file_url
                FROM quoting_files f
                WHERE f.quoting_id = ? ";
        echo $this->quoting_files_model->crud_list_sql($sql, $params);
    }

    public function delete_quoting_files(){
        $req = request();
        $file = $this->quoting_files_model->get(array('id'=>$req['id']));
        $this->quoting_files_model->del_image_file($file['name'],UPLOAD_QUOTING_DIR);
        echo $this->quoting_files_model->crud_delete();
    }

    public function create_quoting_file(){
        $req = request();
        $isNewImage = true;
        $options = array();
        $uploadDir = UPLOAD_QUOTING_DIR;
        $options['quoting_id'] = $req['quoting_id'];
        $filename = $req['name'];
        $path_parts = pathinfo(UPLOAD_TEMP.$filename);
        $new_name = $path_parts['filename'].".".$path_parts['extension'];
        $options['name'] = $new_name;
        
        if(@rename(UPLOAD_TEMP.$filename, $uploadDir.$new_name)){
            $res = $this->quoting_files_model->crud_create($options, array(), FALSE);
        }else{
            $res['Result']='ERROR';
            $res['Message']='Error uploading file';
        }
        echo json_encode($res);
    }

    public function sel2_quoting_status(){
        echo $this->quoting_status_model->xsel2_quoting_status();
    }

    public function copy_to_orders(){
        echo $this->quoting_model->copy_to_orders();
    }

    public function clone_quoting(){
        echo $this->quoting_model->clone_quoting();
    }

    public function clone_part(){
        echo $this->quoting_model->clone_part();
    }

    public function get_parcel_weight(){
        $id = request('id');
        $sql = "SELECT SUM(p.weight*p.quantity) as parcel_weight FROM quoting_parts p WHERE p.quoting_id = ? ";
        $params = array($id);
        $parcel_weight = $this->quoting_parts_model->query($sql, $params)->result_array();
        echo json_encode(array( 'Result' => 'OK', 'weight'=>$parcel_weight[0]['parcel_weight']));
    }

    public function create_quoting_observation(){
        echo $this->quoting_observations_model->crud_create();
    }

    public function delete_quoting_observation(){
        echo $this->quoting_observations_model->crud_update(array('deleted'=>1));
    }

    public function get_observations($encode=TRUE){
        $req = request();
        $params =  array($req['quoting_id']);
        $sql = 'SELECT o.*, u.username as user_name
                from quoting_observations o
                left join users u on (u.id = o.rec_createdid)
                WHERE o.quoting_id = ? and o.deleted=0
                order by o.ts desc
                ';
        $limit 	= request('limit'); $offset	= request('offset');
        if ($limit!=null){
            $sql .= ' limit '.intval($limit);
        }
        if ($offset!=null){
            $sql .= ' offset '.intval($offset);
        }
        $result = $this->quoting_observations_model->crud_list_sql($sql,$params, '', $encode);
        if($encode){
            echo $result;
        }else{
            return $result;
        }
    }

    public function list_quoting_log(){
        $req = request();
        $params = array('quoting_id'=>$req['quoting_id']);
        $sql = "SELECT l.*, u.username as user_name, js.name as status_name, js.colour, s.name as status_new_name, s.colour as status_new_colour
                FROM quoting_log l
                left join quoting_status js on (js.id = l.status)
                left join quoting_status s on (s.id = l.status_new)
                left join users u on (u.id = l.userid)
                WHERE l.quoting_id = ? ";
        echo $this->quoting_log_model->crud_list_sql($sql, $params);
    }

    public function recalc_parts(){
        $req = request();
        $percent = floatval($req['percent']);
        $sql = "update quoting_parts SET unique_wage=unique_wage*((100+?)/100), price=(wage/60)*unique_wage where quoting_id = ? ";
        $params = array($percent, $req['quoting_id']);
        $res = $this->quoting_parts_model->query($sql, $params);
        echo json_encode(array('Result' => 'OK'));
    }

}

/* End of file quoting.php */