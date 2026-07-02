<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
* CodeIgniter CRUD_Model Class
*
*/
class Quoting_parts_Model extends MY_CRUDModel{

    var $validate_field_existence = TRUE;

    var $primary_table = 'quoting_parts';

    var $fields = array(
        'id',
        'quoting_id',
        'name',
        'quantity',
        'materialid',
        'width',
        'length',
        'height',
        'diameter',
        'arm1',
        'arm2',
        'cylinder',
        'right_angle',
        'price',
        'wage',
        'unique_wage',
        'weight',
        'post_price',
        'surface',
        'material_unit_price',
        'material_price',
        'handling',
        'description',
        'image',
        'stp',
        'pdf',
        'ts',
        'rec_createdid',
	    'rec_modifiedid',
	    'rec_modified',
        'archived'
    );

    var $required_fields = array(
        'quoting_id',
        'name',
    );

    function __construct(){
        parent::__construct();
    }

    function initialize($db_cli=NULL){
        parent::initialize($db_cli);
        //$this->db_active=$this->db_cli; // u can overwrite here the default database - by default it is the db_cli if avaiable
    }


    public function xsel2_sel2_handlings(){
        $searchTerm = request('q');
        $id = request('id');
        $sql = "SELECT group_concat(handling) as id FROM quoting_parts WHERE 1=1 HAVING id IS NOT null";
        $params = array();
        $result = $this->query( $sql, $params, FALSE)->result_array();
        $results = array();
        if($result){
            $result = array_unique(explode(",", $result[0]['id']));
            if($searchTerm){
                $result = array_search($searchTerm, $result);
            }
            if($id){
                $result = explode(",", $id);
            }
            foreach($result as $key=>$val){
                array_push($results, array('id' => $val, 'text' => $val));
            }
        }
        $cnt = count($results);
        $more = false;
        $page = 1;
        $total = $cnt-1;
        return json_encode(array('page'=>$page,'total'=>$total,'more'=>$more,'rows'=>$results));
    }

}

// END CRUD_Model Class

/* End of file CRUD_Model.php */
/* Location: ./application/crud/CRUD_Model.php */