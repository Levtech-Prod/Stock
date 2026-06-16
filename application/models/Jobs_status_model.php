<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
* CodeIgniter CRUD_Model Class
*
*/
class Jobs_status_Model extends MY_CRUDModel{

    var $validate_field_existence = TRUE;

    var $primary_table = 'jobs_status';

    var $fields = array(
        'id',
        'name',
        'colour',
        'sort',
        'type',
        'show_message',
        'message'
    );

    var $required_fields = array(
        'name'
    );

    function __construct(){
        parent::__construct();
    }

    function initialize($db_cli=NULL){
        parent::initialize($db_cli);
        //$this->db_active=$this->db_cli; // u can overwrite here the default database - by default it is the db_cli if avaiable
    }

    public function xsel2_jobs_status(){
        $searchTerm = request('q');
        $where_like = $this->build_where_like($searchTerm, array('name'));
        $sql = "SELECT id, `name` as name
                FROM jobs_status
                WHERE 1=1 ".$where_like."
                ORDER BY `sort`";
        $params = array();
        return $this->xsel2_list_provider(request(),$sql,$params);
    }

    public function order_element($id, $direction = 'up'){
        $direction = strtolower($direction);
        if (isset($id) && (in_array($direction, array('up','down')))){
            $sql = "call cli_order_generic('jobs_status',?,?,'sort','','','')";
            $params = array($id,$direction);
            $this->query($sql,$params);
        }
        return array('Result'=>'OK');
    }

}

// END CRUD_Model Class

/* End of file CRUD_Model.php */
/* Location: ./application/crud/CRUD_Model.php */