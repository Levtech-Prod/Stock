<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
* CodeIgniter CRUD_Model Class
*
*/
class Jobs_status_rights_Model extends MY_CRUDModel{

    var $validate_field_existence = TRUE;

    var $primary_table = 'jobs_status_rights';

    var $fields = array(
        'id',
        'statusid',
        'userid',
        'enabled'
    );

    var $required_fields = array(
        'id',
        'statusid',
        'userid'
    );

    function __construct(){
        parent::__construct();
    }

    function initialize($db_cli=NULL){
        parent::initialize($db_cli);
        //$this->db_active=$this->db_cli; // u can overwrite here the default database - by default it is the db_cli if avaiable
    }

    public function list_jobs_status_rights($encode = true, $userid = 0){
        $userid = request('userid')?request('userid'):$userid;
        $sql = 'select sr.id as id, s.name as statusname, sr.enabled
        from jobs_status_rights sr
        left join jobs_status s on s.id = sr.statusid
        where sr.userid = ?
        order by s.sort';
        $params = array($userid);
        $res = $this->query($sql,$params);
        if($encode){
            echo json_encode(array("Result"=>"OK","Records"=>$res->result_object()));
        }else{
            return $res->result_array();
        }
    }

    public function list_jobs_status_rights_enabled($encode = true, $userid = 0){
        $userid = request('userid')?request('userid'):$userid;
        $sql = 'select sr.id as id, s.name as statusname, sr.enabled
        from jobs_status_rights sr
        left join jobs_status s on s.id = sr.statusid
        where sr.userid = ? and enabled=1
        order by s.sort';
        $params = array($userid);
        $res = $this->query($sql,$params);
        if($encode){
            echo json_encode(array("Result"=>"OK","Records"=>$res->result_object()));
        }else{
            return $res->result_array();
        }
    }

}

// END CRUD_Model Class

/* End of file CRUD_Model.php */
/* Location: ./application/crud/CRUD_Model.php */