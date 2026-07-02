<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
* CodeIgniter CRUD_Model Class
*
*/
class Settings_Model extends MY_CRUDModel{

    var $validate_field_existence = TRUE;

    var $primary_table = 'settings';

    var $fields = array(
        'id',
        'wage',
        'treatment',
        'quoting',
        'invoice_nr'
    );

    var $required_fields = array(
        'id',
        'wage',
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