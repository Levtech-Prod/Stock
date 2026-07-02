<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
* CodeIgniter CRUD_Model Class
*
*/
class Clients_Model extends MY_CRUDModel{

    var $validate_field_existence = TRUE;

    var $primary_table = 'clients';

    var $fields = array(
        'id',
        'alias',
        'regcode',
        'head_office',
        'invoice_info',
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

    public function xsel2_clients(){
        $searchTerm = request('q');
        $where_like = $this->build_where_like($searchTerm, array('id'));
        $sql = "SELECT id, regcode, head_office, id as name
                FROM clients
                WHERE deleted=0 ".$where_like."
                ORDER BY `id`";
        $params = array();
        return $this->xsel2_list_provider(request(),$sql,$params, NULL,FALSE,'id', array(), true);
    }

    public function create_clients(){
        //DELETE jtRecordKey
        $req = request();
        $sql = "REPLACE INTO clients(id, alias, regcode, head_office, invoice_info) VALUES(?, ?, ?, ?, ?);";
        //ON DUPLICATE KEY UPDATE id = ?, regcode=?, head_office=?
        $params = array($req["id"], $req['alias'],  $req["regcode"], $req["head_office"], $req["invoice_info"]);
        $new = $this->query($sql, $params);

        if($req['jtRecordKey'] && $req['jtRecordKey']!=$req['id']){
            $sqld = "delete from clients WHERE id=?";
            $paramsd = array($req['jtRecordKey']);
            $this->query($sqld, $paramsd);
        }

        $result = $this->query("SELECT * FROM clients WHERE id = ?;", array($req['id']));
		$row = $result->result_array();
        echo json_encode(array( 'Result' => 'OK', 'Record'=>$row[0]));
    }

    public function delete_clients(){
        $id = request('id');
        $sql = "delete from clients WHERE id=?";
        $params = array($id);
        $this->query($sql, $params);
        return json_encode(array('Result'=>'OK'));
    }

}

// END CRUD_Model Class

/* End of file CRUD_Model.php */
/* Location: ./application/crud/CRUD_Model.php */