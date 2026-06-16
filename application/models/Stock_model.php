<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
* CodeIgniter CRUD_Model Class
*
*/
class Stock_Model extends MY_CRUDModel{

    var $validate_field_existence = TRUE;

    var $primary_table = 'stock';

    var $fields = array(
        'id',
        'materialid',
        'quantity',
        'width',
        'length',
        'height',
        'diameter',
        'cylinder',
        'shelf',
        'description',
        'ts',
        'deleted'        
    );

    var $required_fields = array(
        'materialid'
    );

    function __construct(){
        parent::__construct();
    }

    function initialize($db_cli=NULL){
        parent::initialize($db_cli);
        //$this->db_active=$this->db_cli; // u can overwrite here the default database - by default it is the db_cli if avaiable
    }

    function xsel2_sel2_stock(){
        $searchTerm = request('q');
        $where_like = $this->build_where_like($searchTerm, array('m.name', 'm.code'));
        $sql = "SELECT s.id, concat(m.name, ' - ', m.code, ' (', s.height, ' x ', s.width, ' x ', s.length,')', ' - ', s.quantity, ' db') as name
                FROM stock s
                left join materials m on (m.id = s.materialid)
                WHERE s.deleted=0 ".$where_like."
                ORDER BY m.`name`";
        $params = array();
        return $this->xsel2_list_provider(request(),$sql,$params,NULL,FALSE,'s.`id`');
    }

}

// END CRUD_Model Class

/* End of file CRUD_Model.php */
/* Location: ./application/crud/CRUD_Model.php */