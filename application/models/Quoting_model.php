<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
* CodeIgniter CRUD_Model Class
*
*/
class Quoting_Model extends MY_CRUDModel{

    var $validate_field_existence = TRUE;

    var $primary_table = 'quoting';

    var $fields = array(
        'id',
        'name',
        'client_name',
        'status',
        'start_date',
        'sent_date',
        'shipping_type',
        'transport_cost',
        'wage',
        'lead_time',
        'description',
        'po_comment',
        'deleted',
        'order_id',
        'ts',
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
        $sql = "SELECT client_name AS id FROM (
                SELECT DISTINCT client_name FROM quoting 
                UNION 
                SELECT DISTINCT client_name FROM orders 
                ) clients
                WHERE 1=1 $where_like
                ORDER BY `id` ASC";
        $params = array();
        return $this->xsel2_list_provider(request(),$sql,$params,NULL,FALSE,'client_name', array(), true);
    }
    */

    public function xsel2_sel2_quoting(){
        $searchTerm = request('q');
        $where_like = $this->build_where_like($searchTerm, array('client_name'));
        $sql = "SELECT id, concat (id, ' - ' , `name`) as `name` FROM quoting WHERE 1=1 $where_like
                ORDER BY `id` ASC";
        $params = array();
        return $this->xsel2_list_provider(request(),$sql,$params,NULL,FALSE);
    }

    public function copy_to_orders(){
        $req = request();
        $sql = "INSERT INTO orders (
                            name,
                            client_name,
                            start_date,
                            description,
                            shipping_type,
                            transport_cost,
                            rec_createdid,
                            quoting_id,
                            user_count
                            )
                     SELECT name,
                            client_name,
                            start_date,
                            description,
                            shipping_type,
                            transport_cost,
                            ".$this->session->userdata('userid').",
                            ".$req['id'].",
                            (SELECT userid FROM quoting_log WHERE quoting_id = ? AND status_new=2 ORDER BY ts DESC LIMIT 1)
                        FROM quoting
                    WHERE id=?";
        $params = array($req['id'], $req['id']);
        $res 	= $this->query($sql, $params);
        $oid = $this->db_active->insert_id();
        
        $sql = "INSERT INTO orders_observations (
                    order_id,
                    observation,
                    deleted,
                    ts,
                    rec_createdid
                    )
            SELECT  ".$oid.",
                    observation,
                    deleted,
                    ts,
                    rec_createdid
                FROM quoting_observations
            WHERE quoting_id=?";
        $params = array($req['id']);
        $res 	= $this->query($sql, $params);

        $upd = $this->crud_update(array('id'=>$req['id'], 'order_id'=>$oid), array(), TRUE, FALSE, FALSE);
        
        $this->load_model('jobs_files_model');
        $sql = "select id, image, stp, pdf FROM quoting_parts
            WHERE quoting_id=?";
        $params = array($req['id']);
        $images = $this->query($sql, $params)->result_array();
        foreach($images as $rec){
                $sql = "INSERT INTO jobs (
                        order_id,
                        name,
                        quantity,
                        materialid,
                        width,
                        length,
                        height,
                        diameter,
                        arm1,
                        arm2,
                        cylinder,
                        right_angle,
                        price,
                        weight,
                        post_price,
                        surface,
                        material_unit_price,
                        material_price,
                        handling,
                        description,
                        image,
                        stp,
                        rec_createdid
                        )
                SELECT  ".$oid.",
                        name,
                        quantity,
                        materialid,
                        width,
                        length,
                        height,
                        diameter,
                        arm1,
                        arm2,
                        cylinder,
                        right_angle,
                        (price+material_price),
                        weight,
                        post_price,
                        surface,
                        material_unit_price,
                        material_price,
                        handling,
                        description,
                        image,
                        stp,
                        ".$this->session->userdata('userid')."
                    FROM quoting_parts
                WHERE id=?";
            $params = array($rec['id']);
            $res 	= $this->query($sql, $params);
            $job_id = $this->db_active->insert_id();

            $image = $rec['image'];
            $stp = $rec['stp'];
            $pdf = $rec['pdf'];
            if($image){
                copy(UPLOAD_QUOTING_IMG_DIR.$image, UPLOAD_IMG_DIR.$image);
            }
            if($stp){
                copy(UPLOAD_QUOTING_IMG_DIR.$stp, UPLOAD_IMG_DIR.$stp);
            }
            if($pdf){
                $aoptions = array();
                $aoptions['job_id'] = $job_id;
                $aoptions['name'] = $pdf;
                
                if(@copy(UPLOAD_QUOTING_IMG_DIR.$pdf, UPLOAD_FILE_DIR.$pdf)){
                    $resf = $this->jobs_files_model->crud_create($aoptions, array(), FALSE, true, false);
                }
            }
        }
        return json_encode(array("Result" => "OK"));
    }

    public function clone_quoting(){
        $req = request();
        $sql = "INSERT INTO quoting (
                            name,
                            client_name,
                            status,
                            start_date,
                            sent_date,
                            shipping_type,
                            transport_cost,
                            wage,
                            lead_time,
                            description,
                            po_comment,
                            rec_createdid
                            )
                     SELECT name,
                            client_name,
                            status,
                            start_date,
                            sent_date,
                            shipping_type,
                            transport_cost,
                            wage,
                            lead_time,
                            description,
                            po_comment,
                            ".$this->session->userdata('userid')."
                        FROM quoting
                    WHERE id=?";
        $params = array($req['id']);
        $res 	= $this->query($sql, $params);
        $oid = $this->db_active->insert_id();
        $sql = "INSERT INTO quoting_parts (
                    quoting_id,
                    name,
                    quantity,
                    materialid,
                    width,
                    length,
                    height,
                    diameter,
                    arm1,
                    arm2,
                    cylinder,
                    right_angle,
                    price,
                    wage,
                    post_price,
                    material_unit_price,
                    material_price,
                    handling,
                    description,
                    image,
                    stp,
                    pdf,
                    rec_createdid
                    )
            SELECT  ".$oid.",
                    name,
                    quantity,
                    materialid,
                    width,
                    length,
                    height,
                    diameter,
                    arm1,
                    arm2,
                    cylinder,
                    right_angle,
                    price,
                    wage,
                    post_price,
                    material_unit_price,
                    material_price,
                    handling,
                    description,
                    image,
                    stp,
                    pdf,
                    ".$this->session->userdata('userid')."
                FROM quoting_parts
            WHERE quoting_id=?";
        $params = array($req['id']);
        $res 	= $this->query($sql, $params);

        $sql = "select id, image, stp, pdf FROM quoting_parts
            WHERE quoting_id=?";
        $params = array($oid);
        $images = $this->query($sql, $params)->result_array();
        $this->load_model('quoting_parts_model');
        foreach($images as $rec){
            $options['id'] = $rec['id'];
            
            $image = $rec['image'];
            $stp = $rec['stp'];
            $pdf = $rec['pdf'];
            if($image){
                $path_parts = pathinfo($image);
                $new_name = $path_parts['filename']."_copy_".".".$path_parts['extension'];
                $options['image'] = $new_name;
                copy(UPLOAD_QUOTING_IMG_DIR.$image, UPLOAD_QUOTING_IMG_DIR.$new_name);
            }
            if($stp){
                $path_parts = pathinfo($stp);
                $new_name = $path_parts['filename']."_copy_".".".$path_parts['extension'];
                $options['stp'] = $new_name;
                copy(UPLOAD_QUOTING_IMG_DIR.$stp, UPLOAD_QUOTING_IMG_DIR.$new_name);
            }
            if($pdf){
                $path_parts = pathinfo($pdf);
                $new_name = $path_parts['filename']."_copy_".".".$path_parts['extension'];
                $options['pdf'] = $new_name;
                copy(UPLOAD_QUOTING_IMG_DIR.$pdf, UPLOAD_QUOTING_IMG_DIR.$new_name);
            }
            
            $res = $this->quoting_parts_model->crud_update($options, array(), FALSE, false, false);
        }

        return json_encode(array("Result" => "OK"));
    }

    public function clone_part(){
        $req = request();
        $sql = "INSERT INTO quoting_parts (
                    quoting_id,
                    name,
                    quantity,
                    materialid,
                    width,
                    length,
                    height,
                    diameter,
                    arm1,
                    arm2,
                    cylinder,
                    right_angle,
                    price,
                    wage,
                    post_price,
                    material_unit_price,
                    material_price,
                    handling,
                    description,
                    image,
                    stp,
                    pdf,
                    rec_createdid
                    )
            SELECT  quoting_id,
                    name,
                    quantity,
                    materialid,
                    width,
                    length,
                    height,
                    diameter,
                    arm1,
                    arm2,
                    cylinder,
                    right_angle,
                    price,
                    wage,
                    post_price,
                    material_unit_price,
                    material_price,
                    handling,
                    description,
                    image,
                    stp,
                    pdf,
                    ".$this->session->userdata('userid')."
                FROM quoting_parts
            WHERE id=?";
        $params = array($req['id']);
        $res 	= $this->query($sql, $params);
        $pid = $this->db_active->insert_id();

        $sql = "select id, image, stp, pdf FROM quoting_parts
            WHERE id=?";
        $params = array($pid);
        $images = $this->query($sql, $params)->result_array();
        $this->load_model('quoting_parts_model');
        foreach($images as $rec){
            $options['id'] = $rec['id'];
            
            $image = $rec['image'];
            $stp = $rec['stp'];
            $pdf = $rec['pdf'];
            if($image){
                $path_parts = pathinfo($image);
                $new_name = $path_parts['filename']."_copy_".".".$path_parts['extension'];
                $options['image'] = $new_name;
                copy(UPLOAD_QUOTING_IMG_DIR.$image, UPLOAD_QUOTING_IMG_DIR.$new_name);
            }
            if($stp){
                $path_parts = pathinfo($stp);
                $new_name = $path_parts['filename']."_copy_".".".$path_parts['extension'];
                $options['stp'] = $new_name;
                copy(UPLOAD_QUOTING_IMG_DIR.$stp, UPLOAD_QUOTING_IMG_DIR.$new_name);
            }
            if($pdf){
                $path_parts = pathinfo($pdf);
                $new_name = $path_parts['filename']."_copy_".".".$path_parts['extension'];
                $options['pdf'] = $new_name;
                copy(UPLOAD_QUOTING_IMG_DIR.$pdf, UPLOAD_QUOTING_IMG_DIR.$new_name);
            }
            
            $res = $this->quoting_parts_model->crud_update($options, array(), FALSE, false, false);
        }

        return json_encode(array("Result" => "OK"));
    }

}

// END CRUD_Model Class

/* End of file CRUD_Model.php */
/* Location: ./application/crud/CRUD_Model.php */