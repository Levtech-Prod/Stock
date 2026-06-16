<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Jobs extends MY_Controller {

    var $crud_models = array('jobs_model', 'jobs_log_model', 'handlings_model', 'jobs_work_log_model', 'qc_types_model');

    function __construct(){
        parent::__construct();
    }

    public function index(){
        $this->load->view('jobs_view');
    }

    public function list_jobs(){
        echo $this->jobs_model->crud_list();
    }

    public function update_jobs(){
        echo $this->jobs_model->crud_update();
    }

    public function create_jobs(){
        echo $this->jobs_model->crud_create();
    }

    public function delete_jobs(){
        echo $this->jobs_model->crud_update(array('deleted'=>1));
    }

    public function update_jobs_work(){
        $req = request();
        if($req['work_log_id']){
            $options['id'] = $req['work_log_id'];
            $options['end_time'] = date($this->config->item('log_date_format'));
            $rec = $this->jobs_work_log_model->crud_update($options, array(), false, false, false);
        }
        $sql = "update jobs set in_work=0, work_log_id=null, status=?, rec_modifiedid=? where id = ? ";
        $params = array($req['status'], $this->session->userdata('userid'), $req['id']);
        $upd = $this->jobs_model->query($sql, $params);
        echo json_encode(array( 'Result' => 'OK'));
    }

    public function delete_image(){
        $req = request();
        $this->jobs_model->del_image_file(request('image'),UPLOAD_IMG_DIR);
        echo $this->jobs_model->crud_update(array('id'=>$req['id'], 'image'=>''));
    }

    public function clean_uploaded_image(){
        $this->jobs_model->del_image_file(request('imagefile'),UPLOAD_TEMP);
        echo json_encode(array("Result"=>'OK'));
    }

    public function get_image(){
        $image = $this->jobs_model->crud_list(array(),'', array(), false);
        if ($image['Result'] == 'OK'){
            $image['Records']['url'] 		=  UPLOAD_IMG_DIR.$image['Records']['image'];
        }
        echo json_encode($image);
    }

    public function save_uploaded_image(){
        $id = request('id');
        $isNewImage = (request('id')) ? false : true;
        $options = array();
        $uploadDir = UPLOAD_IMG_DIR;
        $options['id'] = $id;
        if (request('newupload')){
            $options['image'] = request('newupload');
        }else{
            $img = $this->jobs_model->get(array('id'=>$id));
            $options['image'] = $img['image'];
            $oldfile 	= $img['image'];
        }
        $update = $this->jobs_model->crud_update($options, array(), FALSE);
        $res = $update;
        if ($update['Result'] == 'OK'){
            if (request('newupload')){
                $img_upd = $this->jobs_model->set_image($id, 'image', request('newupload'), $uploadDir, $oldfile);
                if ($img_upd['Result'] == 'OK'){
                    $res['src']			= $img_upd['src'];
                    $filename 			= $img_upd['filename'];
                }else{
                    $res = $img_upd;
                    $filename 			= '';
                }
            }
            $res['isnew'] = $isNewImage;
        }
        echo json_encode($res);
    }

    public function get_job(){
        $id = request('id');
        //$rec = $this->jobs_model->get(array('id'=>$id));
        $sql = "SELECT j.*, o.id as order_id, o.name as order_name, concat(m.name, ' - ', m.code) as material_name, js.name as status_name, js.colour, js.`type`, concat('".profile_to_url(UPLOAD_IMG_DIR)."', j.image) as image_url, j.working_minutes
                from jobs j
                left join materials m on (m.id = j.materialid)
                left join jobs_status js on (js.id = j.status)
                left join orders o on (o.id = j.order_id) 
                where j.id = ? ";
        $params = array($id);
        $job = $this->jobs_model->query($sql, $params)->result_array();
        /*
        $req = request();
        $params = array('job_id'=>$req['job_id']);
        $sql = "SELECT f.*, concat('".profile_to_url(UPLOAD_FILE_DIR)."', f.name) as file_url
                FROM jobs_files f
                WHERE f.job_id = ? ";
        $params = array($id);
        $files = $this->jobs_model->query($sql, $params)->result_array();*/
        echo json_encode(array( 'Result' => 'OK', 'job'=>$job[0], 'files'=>$files));
    }

    //jobs files
    public function list_jobs_log(){
        $req = request();
        $params = array('job_id'=>$req['job_id']);
        $sql = "SELECT l.*, u.username as user_name, js.name as status_name, js.colour, s.name as status_new_name, s.colour as status_new_colour, (l.position+1) as position, (l.position_new+1) as position_new
                FROM jobs_log l
                left join jobs_status js on (js.id = l.status)
                left join jobs_status s on (s.id = l.status_new)
                left join users u on (u.id = l.userid)
                WHERE l.job_id = ? and (l.`type`=0 or (l.`type`=1 and l.position!=l.position_new)) ";
        echo $this->jobs_log_model->crud_list_sql($sql, $params);
    }

    public function sel2_handlings(){
        echo $this->handlings_model->xsel2_handlings();
    }

    public function sel2_init_handlings(){
        $id = request('id');
        $results = array();
        if($id){
            $result = explode(",", $id);
        }
        foreach($result as $key=>$val){
            array_push($results, array('id' => $val, 'text' => $val));
        }
        echo json_encode($results);
    }

    public function save_comment(){
        echo $this->jobs_model->crud_update();
    }

    public function update_jobs_reorder(){
        $req = request();
        if($req['data']){
            foreach ($req['data'] as $val) {
                $sql = "UPDATE jobs SET position=? WHERE id=?";
                $params = array($val['position'], $val['id']);
                $res_up = $this->jobs_model->query($sql, $params);
            }
        }
        echo json_encode(array('Result' => 'OK'));
    }

    public function list_jobs_work_log(){
        $req = request();
        $params = array('job_id'=>$req['job_id']);
        $sql = "SELECT l.*, u.username as user_name, js.name as status_name, js.colour, if(l.end_time IS null, 0, TIMESTAMPDIFF(MINUTE, l.start_time, l.end_time)) as working_minutes
                FROM jobs_work_log l
                left join jobs_status js on (js.id = l.status)
                left join users u on (u.id = l.userid)
                WHERE l.job_id = ? ";
        echo $this->jobs_log_model->crud_list_sql($sql, $params);
    }

    public function sel2_qc_types(){
        echo $this->qc_types_model->xsel2_qc_types();
    }

}

/* End of file jobs.php */