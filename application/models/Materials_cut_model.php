<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
* CodeIgniter CRUD_Model Class
*
*/
class Materials_cut_Model extends MY_CRUDModel{

    var $validate_field_existence = TRUE;

    var $primary_table = 'materials_cut';

    var $fields = array(
        'id',
        'stock_id',
        'squantity',
        'take_qty',
        'width_qty',
        'cwidth',
        'length_qty',
        'clength',
        'height_qty',
        'cheight',
        'cut',
        'ts',
        'rec_createdid',
	    'rec_modifiedid',
	    'rec_modified'
    );

    var $required_fields = array(
        'stock_id',
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