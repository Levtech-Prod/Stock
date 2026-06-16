<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
* CodeIgniter CRUD_Model Class
*
*/
class Handlings_Model extends MY_CRUDModel{

    var $validate_field_existence = TRUE;

    var $primary_table = 'handlings';

    var $fields = array(
        'id',
        'deleted'
    );

    var $required_fields = array(
        'id'
    );

    function __construct(){
        parent::__construct();
    }

    function initialize($db_cli=NULL){
        parent::initialize($db_cli);
        //$this->db_active=$this->db_cli; // u can overwrite here the default database - by default it is the db_cli if avaiable
    }

    public function xsel2_handlings(){
        $searchTerm = request('q');
        $where_like = $this->build_where_like($searchTerm, array('id'));
        $sql = "SELECT id, id as name
                FROM handlings
                WHERE deleted=0 ".$where_like."
                ORDER BY `id`";
        $params = array();
        return $this->xsel2_list_provider(request(),$sql,$params, NULL,FALSE,'id', array(), true);
    }

    public function create_handlings(){
        $req = request();
        $sql = "INSERT INTO handlings(id) VALUES(?) ON DUPLICATE KEY UPDATE id = ?;";
        $params = array($req["id"], $req["id"]);
        $new = $this->query($sql, $params);

        $result = $this->query("SELECT * FROM handlings WHERE id = ?;", array($req['id']));
		$row = $result->result_array();
        echo json_encode(array( 'Result' => 'OK', 'Record'=>$row[0]));
    }

    public function delete_handlings(){
        $id = request('id');
        $sql = "delete from handlings WHERE id=?";
        $params = array($id);
        $this->query($sql, $params);
        return json_encode(array('Result'=>'OK'));
    }

}

// END CRUD_Model Class

/* End of file CRUD_Model.php */
/* Location: ./application/crud/CRUD_Model.php */