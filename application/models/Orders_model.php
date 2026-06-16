<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
* CodeIgniter CRUD_Model Class
*
*/
class Orders_Model extends MY_CRUDModel{

    var $validate_field_existence = TRUE;

    var $primary_table = 'orders';

    var $fields = array(
        'id',
        'name',
        'start_date',
        'delivery_date',
        'deadline',
        'init_date',
        'intake_date',
        'client_name',
        'description',
        'status',
        'ts',
        'deleted',  
        'quoting_id',  
        'plan',
        'plan_day',
        'plan_order',
        'finished',
        'comments',
        'invoice_sent',
        'shipping_type',
        'transport_cost',
        'user_count',
        'invoice_file',
        'rec_createdid',
	    'rec_modifiedid',
	    'rec_modified',
    );

    var $required_fields = array(
        //'name'
    );

    function __construct(){
        parent::__construct();
    }

    function initialize($db_cli=NULL){
        parent::initialize($db_cli);
        //$this->db_active=$this->db_cli; // u can overwrite here the default database - by default it is the db_cli if avaiable
    }

    /*
    public function xsel2_sel2_clients(){
        $searchTerm = request('q');
        $where_like = $this->build_where_like($searchTerm, array('client_name'));
        $sql = "SELECT DISTINCT client_name as id FROM orders WHERE 1=1 $where_like
                ORDER BY `client_name` ASC";
        $params = array();
        return $this->xsel2_list_provider(request(),$sql,$params,NULL,FALSE,'client_name', array(), true);
    }
    */

    public function xsel2_sel2_orders(){
        $searchTerm = request('q');
        $where_like = $this->build_where_like($searchTerm, array('client_name'));
        $sql = "SELECT id, concat (id, ' - ' , `name`) as `name` FROM orders WHERE 1=1 $where_like
                ORDER BY `id` ASC";
        $params = array();
        return $this->xsel2_list_provider(request(),$sql,$params,NULL,FALSE);
    }

}

// END CRUD_Model Class

/* End of file CRUD_Model.php */
/* Location: ./application/crud/CRUD_Model.php */