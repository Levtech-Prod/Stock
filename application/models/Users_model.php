<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
* CodeIgniter CRUD_Model Class
*
*/
class Users_Model extends MY_CRUDModel{

    var $validate_field_existence = TRUE;

    var $primary_table = 'users';

    var $fields = array(
        'id',
        'username',
        'email',
        'password',
        'phone',
        'admin',
        'price_right',
        'manager',
        'created_at',  
        'rfid',
        'is_online',
        'last_rfid_login',
        'ipaddr'
    );

    var $required_fields = array(
        'id',
        'username',
    );

    function __construct(){
        parent::__construct();
    }

    function initialize($db_cli=NULL){
        parent::initialize($db_cli);
        //$this->db_active=$this->db_cli; // u can overwrite here the default database - by default it is the db_cli if avaiable
    }

    function xsel2_sel2_users(){
        $searchTerm = request('q');
        $where_like = $this->build_where_like($searchTerm, array('u.username'));
        $sql = "SELECT u.id, u.username as `name`
                FROM users u
                WHERE 1=1 ".$where_like."
                ORDER BY u.username";
        $params = array();
        return $this->xsel2_list_provider(request(),$sql,$params,NULL,FALSE);
    }

}

// END CRUD_Model Class

/* End of file CRUD_Model.php */
/* Location: ./application/crud/CRUD_Model.php */