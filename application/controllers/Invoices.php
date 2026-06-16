<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Invoices extends MY_Controller {

    var $crud_models = array('invoices_model');

    function __construct(){
        parent::__construct();
    }

    public function index(){
        $this->load->view('invoices_view');
    }

    public function list_invoices(){
        $req = request();
        $params = array();
        $sql = "SELECT i.*
                FROM invoices i
                WHERE 0 = 0 ";
        if ($req['filter_search']){
            $sql.=" and (i.nr LIKE '%".$req['filter_search']."%')";
        }
        if ($req['filter_client']){
            $sql.=' AND (i.client_name=?)';
            array_push($params,$req['filter_client']);
        }
        if ($req['date_from']){
            $sql.=' AND (i.date>=?)';
            array_push($params,$req['date_from']);
        }
        if ($req['date_to']){
            $sql.=' AND (i.date<=?)';
            array_push($params,$req['date_to']);
        }
        if (isset($req['filter_amount_from']) && is_numeric($req['filter_amount_from'])){
            $sql .= ' AND i.amount>=? ';
            array_push($params,$req['filter_amount_from']);
        }
        if (isset($req['filter_amount_to']) && is_numeric($req['filter_amount_to'])){
            $sql .= ' AND i.amount<=? ';
            array_push($params,$req['filter_amount_to']);
        }
        echo $this->invoices_model->crud_list_sql($sql, $params);
    }

    public function update_invoices(){
        echo $this->invoices_model->crud_update();
    }

    public function create_invoices(){
        echo $this->invoices_model->crud_create();
    }

    public function delete_invoices(){
        echo $this->invoices_model->crud_delete();
    }

}

/* End of file invoices.php */