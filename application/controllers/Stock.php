<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Stock extends MY_Controller {

    var $crud_models = array('stock_model');

    function __construct(){
        parent::__construct();
    }

    public function index(){
        $this->load->view('stock_view');
    }

    public function list_stock(){
        $req = request();
        $params = array();
        $sql = "SELECT s.*, m.name as material_name, m.code as material_code, if(s.cylinder=1, power((s.diameter/1000)/2, 2)*PI()*(s.length/1000)*(m.density)*(s.quantity), ((s.length/1000)*(s.width/1000)*(s.height/1000)*(m.density)*(s.quantity))) AS weight
                FROM stock s
                left join materials m on m.id = s.materialid
                WHERE s.deleted = 0 ";
        if ($req['filter_search']){
            $where_like =$this->stock_model->build_where_like($req['filter_search'], array('s.shelf', 's.description'));
            $sql.= $where_like;
        }
        /* width */
        if (isset($req['filter_width_from']) && is_numeric($req['filter_width_from'])){
            $sql .= ' AND s.width>=? ';
            array_push($params,$req['filter_width_from']);
        }
        if (isset($req['filter_width_to']) && is_numeric($req['filter_width_to'])){
            $sql .= ' AND s.width<=? ';
            array_push($params,$req['filter_width_to']);
        }
        /* length */
        if (isset($req['filter_length_from']) && is_numeric($req['filter_length_from'])){
            $sql .= ' AND s.length>=? ';
            array_push($params,$req['filter_length_from']);
        }
        if (isset($req['filter_length_to']) && is_numeric($req['filter_length_to'])){
            $sql .= ' AND s.length<=? ';
            array_push($params,$req['filter_length_to']);
        }
        /* height */
        if (isset($req['filter_height_from']) && is_numeric($req['filter_height_from'])){
            $sql .= ' AND s.height>=? ';
            array_push($params,$req['filter_height_from']);
        }
        if (isset($req['filter_height_to']) && is_numeric($req['filter_height_to'])){
            $sql .= ' AND s.height<=? ';
            array_push($params,$req['filter_height_to']);
        }
        /* diameter */
        if (isset($req['filter_diameter_from']) && is_numeric($req['filter_diameter_from'])){
            $sql .= ' AND s.diameter>=? ';
            array_push($params,$req['filter_diameter_from']);
        }
        if (isset($req['filter_diameter_to']) && is_numeric($req['filter_diameter_to'])){
            $sql .= ' AND s.diameter<=? ';
            array_push($params,$req['filter_diameter_to']);
        }
        /* quantity */
        if (isset($req['filter_quantity_from']) && is_numeric($req['filter_quantity_from'])){
            $sql .= ' AND s.quantity>=? ';
            array_push($params,$req['filter_quantity_from']);
        }
        if (isset($req['filter_quantity_to']) && is_numeric($req['filter_quantity_to'])){
            $sql .= ' AND s.quantity<=? ';
            array_push($params,$req['filter_quantity_to']);
        }

        if ($req['filter_material']){
            $sql.=' AND (s.materialid=?)';
            array_push($params,$req['filter_material']);
        }
        if ($req['filter_id']){
            $sql.=' AND (s.id=?)';
            array_push($params,$req['filter_id']);
        }
        if (is_numeric($req['filter_cylinder'])){
            $sql.=' AND (s.cylinder=?)';
            array_push($params,$req['filter_cylinder']);
        }
        echo $this->stock_model->crud_list_sql($sql, $params);
    }

    public function update_stock(){
        $data['cylinder'] 		= (request('cylinder')) ? 1 : 0;
        echo $this->stock_model->crud_update($data);
    }

    public function create_stock(){
        echo $this->stock_model->crud_create();
    }

    public function delete_stock(){
        echo $this->stock_model->crud_update(array('deleted'=>1));
    }

    public function sel2_materials(){
        $this->load_model('materials_model');
        echo $this->materials_model->xsel2_materials();
    }

    public function get_material_data(){
        $this->load_model('materials_model');
        $result = $this->materials_model->get(array('id'=>request('materialid')));
        echo json_encode(array( 'Result' => 'OK', 'Record' => $result));
    }

    public function get_stock_total(){
        $req = request();
        $params = array();
    $sql = "SELECT sum(if(s.cylinder=1, power((s.diameter/1000)/2, 2)*PI()*(s.length/1000)*(m.density)*(s.quantity), ((s.length/1000)*(s.width/1000)*(s.height/1000)*(m.density)*(s.quantity)))) AS total_weight
                FROM stock s
                left join materials m on m.id = s.materialid
                WHERE s.deleted = 0 ";
        if ($req['filter_search']){
            $where_like =$this->stock_model->build_where_like($req['filter_search'], array('s.shelf', 's.description'));
            $sql.= $where_like;
        }
        /* width */
        if (isset($req['filter_width_from']) && is_numeric($req['filter_width_from'])){
            $sql .= ' AND s.width>=? ';
            array_push($params,$req['filter_width_from']);
        }
        if (isset($req['filter_width_to']) && is_numeric($req['filter_width_to'])){
            $sql .= ' AND s.width<=? ';
            array_push($params,$req['filter_width_to']);
        }
        /* length */
        if (isset($req['filter_length_from']) && is_numeric($req['filter_length_from'])){
            $sql .= ' AND s.length>=? ';
            array_push($params,$req['filter_length_from']);
        }
        if (isset($req['filter_length_to']) && is_numeric($req['filter_length_to'])){
            $sql .= ' AND s.length<=? ';
            array_push($params,$req['filter_length_to']);
        }
        /* height */
        if (isset($req['filter_height_from']) && is_numeric($req['filter_height_from'])){
            $sql .= ' AND s.height>=? ';
            array_push($params,$req['filter_height_from']);
        }
        if (isset($req['filter_height_to']) && is_numeric($req['filter_height_to'])){
            $sql .= ' AND s.height<=? ';
            array_push($params,$req['filter_height_to']);
        }
        /* quantity */
        if (isset($req['filter_quantity_from']) && is_numeric($req['filter_quantity_from'])){
            $sql .= ' AND s.quantity>=? ';
            array_push($params,$req['filter_quantity_from']);
        }
        if (isset($req['filter_quantity_to']) && is_numeric($req['filter_quantity_to'])){
            $sql .= ' AND s.quantity<=? ';
            array_push($params,$req['filter_quantity_to']);
        }

        if ($req['filter_material']){
            $sql.=' AND (s.materialid=?)';
            array_push($params,$req['filter_material']);
        }
        if ($req['filter_id']){
            $sql.=' AND (s.id=?)';
            array_push($params,$req['filter_id']);
        }
        $res = $this->stock_model->query($sql, $params)->result_array()[0];
        echo json_encode(array( 'Result' => 'OK', 'total' => number_format((float)$res['total_weight'], 4, '.', '')));
    }

    public function sel2_stock(){
        echo $this->stock_model->xsel2_sel2_stock();
    }

    public function get_stock(){
        $id = request('id');
        $sql = "SELECT s.*, m.code as material_code
                from stock s
                left join materials m on m.id = s.materialid
                WHERE s.deleted = 0 and s.id = ? ";
        $params = array($id);
        $stock = $this->stock_model->query($sql, $params)->result_array();
        echo json_encode(array( 'Result' => 'OK', 'stock'=>$stock[0]));
    }

}

/* End of file stock.php */