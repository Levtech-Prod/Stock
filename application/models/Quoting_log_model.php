<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
* CodeIgniter CRUD_Model Class
*
*/
class Quoting_log_Model extends MY_CRUDModel{

    var $validate_field_existence = TRUE;

    var $primary_table = 'quoting_log';

    var $fields = array(
        'id',
        'quoting_id',
        'userid',
        'status',
        'status_new',
        'ts'
    );

    var $required_fields = array(
        'quoting_id'
    );

    function __construct(){
        parent::__construct();
    }

    function initialize($db_cli=NULL){
        parent::initialize($db_cli);
        //$this->db_active=$this->db_cli; // u can overwrite here the default database - by default it is the db_cli if avaiable
    }

}

// END CRUD_Model Class

/* End of file CRUD_Model.php */
/* Location: ./application/crud/CRUD_Model.php */