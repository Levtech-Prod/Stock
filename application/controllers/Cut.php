<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Cut extends MY_Controller {

    var $crud_models = array('materials_cut_model');

    function __construct(){
        parent::__construct();
    }

    public function index(){
        $data = array();
        $data['admin'] = $this->session->userdata('admin');
        $data['userid'] = $this->session->userdata('userid');
        $this->load->view('cut_view', $data);
    }

    public function getcut(){
        $req = request();
        $params = array();
        $sql = "SELECT mc.*, m.code as material_code, s.quantity, s.width, s.height, s.length, s.shelf, j.order_id, j.name as job_name
                from materials_cut mc
                left join stock s on (s.id = mc.stock_id) 
                left join materials m on (m.id = s.materialid) 
                left join jobs j on (j.material_cut_id = mc.id)
            where ";
        if($req['id']){
            $sql.=" mc.id=? ";
            array_push($params, $req['id']);
        }else{
            $sql.=" cut=0 ";
        }
        $sql.=" order by mc.ts desc";
        $cut = $this->materials_cut_model->query($sql, $params)->result_array();
        echo json_encode(array( 'Result' => 'OK', 'cut'=>$cut));
    }

    public function getcut_history($encode =true){
        $req = request();
        $params = array();
        $sql = "SELECT mc.*, m.code as material_code, s.quantity, s.width, s.height, s.length, s.shelf, j.order_id, j.name as job_name
                from materials_cut mc
                left join stock s on (s.id = mc.stock_id) 
                left join materials m on (m.id = s.materialid) 
                left join jobs j on (j.material_cut_id = mc.id)
            where cut=1 ";
        $sql.=" order by j.ts desc";
        /*$limit 	= request('limit'); $offset	= request('offset');
        if ($limit!=null){
            $sql .= ' limit '.intval($limit);
        }
        if ($offset!=null){
            $offset = $offset==0?0:$offset-1;
            $sql .= ' offset '.intval($offset*$limit);
        }*/
        $result = $this->materials_cut_model->crud_list_sql($sql,$params, '', $encode);
        if($encode){
            echo $result;
        }else{
            return $result;
        }
    }

    public function update_materials_cut(){
        echo $this->materials_cut_model->crud_update();
    }

    public function delete_materials_cut(){
        echo $this->materials_cut_model->crud_delete();
    }

}

/* End of file jobs.php */