<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
* CodeIgniter CRUD_Model Class
*
*/
class Menu_rights_Model extends MY_CRUDModel{

    var $validate_field_existence = TRUE;

    var $primary_table = 'menu_rights';

    var $fields = array(
        'id',
        'menuid',
        'userid',
        'enabled'
    );

    var $required_fields = array(
        'id',
        'menuid',
        'userid'
    );

    function __construct(){
        parent::__construct();
    }

    function initialize($db_cli=NULL){
        parent::initialize($db_cli);
        //$this->db_active=$this->db_cli; // u can overwrite here the default database - by default it is the db_cli if avaiable
    }

    public function list_menu_rights($encode = true, $userid = 0){
        $userid = request('userid')?request('userid'):$userid;
        $sql = 'select mr.id as id, m.name as menuname, m.link, mr.enabled
        from menu_rights mr
        left join menu m on m.id = mr.menuid
        where m.disabled = 0 and mr.userid = ?
        order by m.id';
        $params = array($userid);
        $res = $this->query($sql,$params);
        if($encode){
            echo json_encode(array("Result"=>"OK","Records"=>$res->result_object()));
        }else{
            return $res->result_array();
        }
    }

    public function list_menu_rights_enabled($encode = true, $userid = 0){
        $userid = request('userid')?request('userid'):$userid;
        $sql = 'select mr.id as id, m.id as menuid, m.name as menuname, m.link, mr.enabled
        from menu_rights mr
        left join menu m on m.id = mr.menuid
        where m.disabled = 0 and mr.userid = ? and enabled=1 and parent is null and level = 0
        order by m.id';
        $params = array($userid);
        $res = $this->query($sql,$params)->result_array();

        $sql_sub = 'select mr.id as id, m.id as menuid, m.name as menuname, m.link, mr.enabled
        from menu_rights mr
        left join menu m on m.id = mr.menuid
        where m.disabled = 0 and mr.userid = ? and enabled=1 and parent=? and level = 1
        order by m.id';
        foreach($res as $key=>$val){
            if($val['link']==null){
                $sparams = array($userid, $val['menuid']);
                $res_sub = $this->query($sql_sub, $sparams)->result_array();
                if(count($res_sub)>0){
                    $res[$key]['sub_menu'] = $res_sub;
                }
            }
        }
        if($encode){
            echo json_encode(array("Result"=>"OK","Records"=>$res));
        }else{
            return $res;
        }
    }

}

// END CRUD_Model Class

/* End of file CRUD_Model.php */
/* Location: ./application/crud/CRUD_Model.php */