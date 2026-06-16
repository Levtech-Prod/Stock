<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Tool_settings extends MY_Controller {

    var $crud_models = array('tool_categs_model', 'tool_categs_param_model');

    function __construct(){
        parent::__construct();
    }

    public function index(){
        $data = array();
        $data['admin'] = $this->session->userdata('admin');
        $data['userid'] = $this->session->userdata('userid');
        $data['price_right'] = $this->session->userdata('price_right');
        $this->load->view('tool_settings_view', $data);
    }

    public function list_tool_categs(){
        $req = request();
        $params = array();
        $sql = "SELECT c.*, concat('".profile_to_url(UPLOAD_IMG_DIR)."', c.image) as image_url
                FROM tool_categs c
                WHERE 1=1 ";
        echo $this->tool_categs_model->crud_list_sql($sql, $params);
    }

    public function update_tool_categs(){
        $req = request();
        if($req['image'] && file_exists(UPLOAD_TEMP.$req['image'])){
            $uploadDir = UPLOAD_IMG_DIR;
            if(file_exists($uploadDir.$req['image'])){
                $sext = pathinfo($req['image'], PATHINFO_EXTENSION);
                $nimage = basename($req['image'], $sext)."_".time().".".$sext;
                $options['image'] = $nimage;
                @rename(UPLOAD_TEMP.$req['image'], $uploadDir.$nimage);
            }else{
                @rename(UPLOAD_TEMP.$req['image'], $uploadDir.$req['image']);
            }
        }
        echo $this->tool_categs_model->crud_update();
    }

    public function create_tool_categs(){
        $req = request();
        $rec = $this->tool_categs_model->crud_create(array(), array(), false);
        if ($rec['Result'] == 'OK'){
            if($req['image'] && file_exists(UPLOAD_TEMP.$req['image'])){
                $uploadDir = UPLOAD_IMG_DIR;
                @rename(UPLOAD_TEMP.$req['image'], $uploadDir.$req['image']);
            }
        }
        echo json_encode($rec);
    }

    public function delete_tool_categs(){
        echo $this->tool_categs_model->crud_delete();
    }

    public function delete_image(){
        $req = request();
        $this->tool_categs_model->del_image_file(request('image'),UPLOAD_IMG_DIR);
        echo $this->tool_categs_model->crud_update(array('id'=>$req['id'], 'image'=>''));
    }

    public function clean_uploaded_image(){
        $this->tool_categs_model->del_image_file(request('imagefile'),UPLOAD_TEMP);
        echo json_encode(array("Result"=>'OK'));
    }

    public function get_image(){
        $image = $this->tool_categs_model->crud_list(array(),'', array(), false);
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
            $img = $this->tool_categs_model->get(array('id'=>$id));
            $options['image'] = $img['image'];
            $oldfile 	= $img['image'];
        }
        $update = $this->tool_categs_model->crud_update($options, array(), FALSE);
        $res = $update;
        if ($update['Result'] == 'OK'){
            if (request('newupload')){
                $img_upd = $this->tool_categs_model->set_image($id, 'image', request('newupload'), $uploadDir, $oldfile);
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

    /* */
    public function list_params(){
        $req = request();
        $params = array('categ_id'=>$req['categ_id']);
        $sql = "SELECT p.*
                FROM tool_categs_param p
                WHERE p.categ_id = ? ";
        if ($req['filter_search']){
            $sql.=" and (p.name LIKE '%".$req['filter_search']."%')";
        }
        echo $this->tool_categs_param_model->crud_list_sql($sql, $params);
    }

    public function update_params(){
        echo $this->tool_categs_param_model->crud_update();
    }

    public function create_params(){
        echo $this->tool_categs_param_model->crud_create();
    }

    public function delete_params(){
        echo $this->tool_categs_param_model->crud_delete();
    }

}

/* End of file tool_categs.php */