<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Project extends MY_Controller {

    var $crud_models = array('project_model', 'project_status_model', 'project_files_model');

    function __construct(){
        parent::__construct();
    }

    public function index(){
        $data = array();
        $data['admin'] = $this->session->userdata('admin');
        $data['userid'] = $this->session->userdata('userid');
        $this->load->view('project_view', $data);
    }

    public function getProject(){
        $req = request();
        $sparams = array();
        $sqls = "SELECT s.*, s.name as title from project_status s
                order by sort";
        $statuses = $this->project_model->query($sqls, $sparams)->result_array();

        $jparams = array();
        $sqlj = "SELECT p.*, p.status as `block`, concat(p.id, ' - ', p.name) as title, concat('<div class=\"pull-left\">', 'Felelős: ', u.username, ' <br/> ', 'Határidő: ', p.deadline,'<br/>', 'Típus: ', p.`type` ,'</div><div class=\"pull-right\"><i class=\"fas fa-check-square\"></i> ', p.id ,'</div>') as footer
                from project p
                left join users u on (u.id = p.user) where 1=1
             "; //where archived=0
        if ($req['filter_search']){
            $where_like =$this->project_model->build_where_like($req['filter_search'], array('p.name'));
            $sqlj.= $where_like;
        }
        if ($req['filter_id']){
            //$sqlj.=' AND (o.id=?)';
            //array_push($jparams,$req['filter_id']);
            $where_like2 =$this->project_model->build_where_like($req['filter_id'], array('p.id'));
            $sqlj.= $where_like2;
        }
        $sqlj.=" order by p.ts";
        $projects = $this->project_model->query($sqlj, $jparams)->result_array();
        echo json_encode(array( 'Result' => 'OK', 'statuses' => $statuses, 'projects'=>$projects));
    }

    public function get_project(){
        $id = request('id');
        $sql = "SELECT p.*
                from project p
                left join project_status s on (s.id = p.status)
                where p.id = ? ";
        $params = array($id);
        $project = $this->project_model->query($sql, $params)->result_array();
        echo json_encode(array( 'Result' => 'OK', 'project'=>$project[0]));
    }

    public function sel2_status(){
        echo $this->project_status_model->xsel2_project_status();
    }

    public function sel2_types(){
        echo $this->project_model->xsel2_sel2_types();
    }

    public function update_project(){
        $req = request();
        $attachments = "";
        $fileAttachments    = $req['fileAttachments'];
        if($fileAttachments!=""){
            $attachments = explode(',', $fileAttachments);
        }
        if($attachments!=""){
            $uploadDir = UPLOAD_FILE_DIR;
            foreach($attachments as $file){
                $aoptions = array();
                $aoptions['project_id'] = $req['id'];
                $filename = $file;
                $path_parts = pathinfo($file);
                $new_name = $path_parts['filename'].".".$path_parts['extension'];
                $aoptions['name'] = $new_name;
                
                if(@rename($file, $uploadDir.$new_name)){
                    $res = $this->project_files_model->crud_create($aoptions, array(), FALSE, true, false);
                }
            }
        }
        echo $this->project_model->crud_update();
    }

    public function create_project(){
        $req = request();
        $attachments = "";
        $fileAttachments    = $req['fileAttachments'];
        if($fileAttachments!=""){
            $attachments = explode(',', $fileAttachments);
        }
        $rec = $this->project_model->crud_create(array(), array(), false);
        if ($rec['Result'] == 'OK'){
            if($attachments!=""){
                $uploadDir = UPLOAD_FILE_DIR;
                foreach($attachments as $file){
                    $options = array();
                    $options['project_id'] = $rec['Record']['id'];
                    $filename = $file;
                    //$filename = str_replace(" ", "-", $filename);
                    $path_parts = pathinfo($file);
                    $new_name = $path_parts['filename'].".".$path_parts['extension'];
                    $options['name'] = $new_name;
                    
                    if(@rename($file, $uploadDir.$new_name)){
                        $res = $this->project_files_model->crud_create($options, array(), FALSE);
                    }
                }
            }
        }
        echo json_encode($rec);
    }

    public function delete_project(){
        echo $this->project_model->crud_update(array('deleted'=>1));
    }

    public function list_project_files(){
        $req = request();
        $params = array('project_id'=>$req['project_id']);
        $sql = "SELECT f.*, concat('".profile_to_url(UPLOAD_FILE_DIR)."', f.name) as file_url
                FROM project_files f
                WHERE f.project_id = ? ";
        echo $this->project_files_model->crud_list_sql($sql, $params);
    }

    public function delete_project_files(){
        $req = request();
        $file = $this->project_files_model->get(array('id'=>$req['id']));
        $this->project_files_model->del_image_file($file['name'],UPLOAD_FILE_DIR);
        echo $this->project_files_model->crud_delete();
    }

}

/* End of file project.php */