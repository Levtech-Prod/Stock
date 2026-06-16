<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
* CodeIgniter CRUD_Model Class
*
*/
class Maintenance_Model extends MY_CRUDModel{

    var $validate_field_existence = TRUE;

    var $primary_table = 'maintenance';

    var $fields = array(
        'id',
        'machineid',
        'year',
        'week',
        'month',
        'semester',
        'name',
        'description',
        'template_id',
        'selected',
        'ts',
        'rec_createdid',
        'rec_modifiedid',
        'rec_modified',
    );

    var $required_fields = array(
        'name',
    );

    function __construct(){
        parent::__construct();
    }

    function initialize($db_cli=NULL){
        parent::initialize($db_cli);
        //$this->db_active=$this->db_cli; // u can overwrite here the default database - by default it is the db_cli if avaiable
    }

    public function xsel2_maintenance(){
        $searchTerm = request('q');
        $where_like = $this->build_where_like($searchTerm, array('name'));
        $sql = "SELECT id, 'name'
                FROM maintenance
                WHERE 1=1 ".$where_like."
                ORDER BY 'name'";
        $params = array();
        return $this->xsel2_list_provider(request(),$sql,$params);
    }

}

// END CRUD_Model Class

/* End of file CRUD_Model.php */
/* Location: ./application/crud/CRUD_Model.php */