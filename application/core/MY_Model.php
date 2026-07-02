<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
* CodeIgniter MY_Model Class
*
*/
class MY_Model extends CI_Model{
    protected $db_cli = NULL;
    protected $db_active = NULL;

    protected $crud_models = array();// list of crud models used in the controller

    function __construct(){
        parent::__construct();
    }

    public function initialize($db_cli=NULL){
        // take the values from the controller
        $this->db_cli = $db_cli;
        if (!$this->db_active){ // set the active db connection
            $this->db_active = $this->db_cli;
        }
        //log_message('error','MY_Model create '.print_r($this->db_cli->conn_id->thread_id,TRUE).' :'.$this->router->fetch_method());
        $this->load_model($this->crud_models);
    }

    public function load_model($models, $db_cli=NULL /*, $force_load=FALSE*/){
        $models = is_array($models) ? $models : array($models);
        if (is_string($db_cli)){
            $db_cli = db_cli_connect($this, $db_cli);
            $db_cli = $db_cli ? $db_cli : $this->db_cli;
        }else{
            $db_cli = is_object($db_cli) ? $db_cli : $this->db_cli;
        }
        foreach ($models as $model){
            if ((!$this->load->is_loaded($model))/* || $force_load*/){
                $this->load->model($model);
            }
            $this->$model->initialize($db_cli);
        }
    }





    /*
    *  NEW CALC FIELDS - UNDER TESTING
    *  - for same table fields returns values without additional db request
    *  USAGE
    *  simple ex (old): $this->calc_fields($rec,array('name', 'email'),'process');
    *  sametable ex (new): return $this->calc_fields($rec,array('customer_details' => array('name', 'email')),'process');
    */
    public function calc_fields($rows, $calc_fields, $func_calculate, $unset_fields=NULL, $params=NULL)
    {
        if ((!empty($rows))&&(is_callable(array($this,$func_calculate)))){
            if (count($rows) !== count($rows, COUNT_RECURSIVE)){// this is a multi array so iterate it
                foreach ($rows as $i=>$row) {
                    foreach($calc_fields as $fieldname){
                        if (!is_array($fieldname)){
                        $rows[$i][$fieldname] = call_user_func(array($this,$func_calculate),$row,$fieldname,$params);
                        }else{
                            $sametable_fields_arr 	= $fieldname;
                            $returned 				= call_user_func(array($this,$func_calculate),$row,key($sametable_fields_arr),$params);
                            $sametable_fields = $sametable_fields_arr[key($sametable_fields_arr)];
                            foreach( $sametable_fields as $sametable_field){
                                $rows[$i][$sametable_field] = $returned[$sametable_field];
                            }
                        }
                    }
                    if ($unset_fields){
                        foreach($unset_fields as $fieldname){
                            unset($rows[$i][$fieldname]);
                        }
                    }
                }
            }else{// simple array only one record so execute
                    foreach($calc_fields as $fieldname){
                    if (!is_array($fieldname)){
                        $rows[$fieldname] = call_user_func(array($this,$func_calculate),$rows,$fieldname,$params);
                    }else{
                            $sametable_fields_arr 	= $fieldname;
                            $returned 				= call_user_func(array($this,$func_calculate),$rows,key($sametable_fields_arr),$params);
                            $sametable_fields 		= $sametable_fields_arr[key($sametable_fields_arr)];
                        foreach( $sametable_fields as $sametable_field){
                                $rows[$sametable_field] = $returned[$sametable_field];
                        }
                    }
                    }
                    if ($unset_fields){
                        foreach($unset_fields as $fieldname){
                            unset($rows[$fieldname]);
                        }
                    }
            }
        }
        return $rows;
    }

    private function isMysqlFunctionCall($str,$funct){
        $str=trim($str);$funct=$funct.'(';
        return ((substr($str, 0, strlen($funct))===$funct) && substr($str, strlen($str)-1, 1)===')') ? TRUE : FALSE;
    }

    public function build_where_like($searchTerm, $searchFields=array(), $opMain='AND', $opBetween='OR', $expression=FALSE){
        $res = '';// empty condition
        if (($searchTerm)&&(count($searchFields)>0)){
            $res = '';
            $arr = array();
            $searchTerm = preg_replace('/\s+/', ' ',trim($searchTerm));
            $searchTerm = str_ireplace('?','',$searchTerm); // replace ? because CI compile_binds get's confused by the ? in string and replaces with actual params
            $searchTerm = $this->db_active->escape_like_str($searchTerm);
            $searchTermAlt = explode(' ',$searchTerm, 3);
            $searchTermAlt = (count($searchTermAlt)>=2) ? $searchTermAlt[1].' '.$searchTermAlt[0] : '';

            $searchTerm = $expression ? $searchTerm : str_replace(' ','%',$searchTerm);
            $searchTermAlt = $expression ? $searchTermAlt : str_replace(' ','%',$searchTermAlt);
            foreach( $searchFields as $idx=>$search_field ){
                $search_field = trim($search_field);
                if ($search_field!=''){
                    $search_field = str_replace('.', '`.`', $search_field); //allow to use alias fields like table.field -> `table`.`field`
                    //escape only if like is not a function call -> solves http://stackoverflow.com/questions/18629094/illegal-mix-of-collations-for-operation-like-while-searching-with-ignited-data
                    //if u search date type with like it FAILS with accented characters so use DATE_FORMAT -> solves http://stackoverflow.com/questions/18629094/illegal-mix-of-collations-for-operation-like-while-searching-with-ignited-data
                    $search_field = ($this->isMysqlFunctionCall($search_field,'DATE_FORMAT')) ? $search_field : '`'.$search_field.'`';
                    array_push($arr, $search_field." LIKE '%".$searchTerm."%'");
                    if (in_array($idx,array(0,1)) && $searchTermAlt){//alternate search on the first 2 fields
                        array_push($arr, $search_field." LIKE '%".$searchTermAlt."%'");
                    }
                }
            }
            $res .= implode(' '.$opBetween.' ', $arr);
            $res = ' '.$opMain.' ('.$res.') ';
        }
        return $res;
    }
    //work only with fulltext indexed fields
    //ALTER TABLE `cli_customers` ADD FULLTEXT INDEX `name_fulltext_idx` (`name`);
    //select MATCH(name) AGAINST ('' IN BOOLEAN MODE) as xxx, cli_customers.* from `cli_customers` where MATCH(name) AGAINST ("Árpád" IN BOOLEAN MODE)
    /*public function build_where_match($searchTerm, $searchFields=array(), $opMain='AND', $opBetween='OR', $expression=FALSE){
        $res = '';// empty condition
        if (($searchTerm)&&(count($searchFields)>0)){
            $res = '';
            $arr = array();
            $searchTerm = preg_replace('/\s+/', ' ',trim($searchTerm));
            $searchTerm = str_ireplace('*','',$searchTerm); // replace ? because CI compile_binds get's confused by the ? in string and replaces with actual params
            $searchTerm = $this->db_active->escape_like_str($searchTerm);
            if (!$expression){ $searchTerm = '*'.str_replace(' ','*',$searchTerm).'*'; }
            $res .= implode(',', $searchFields);
            $res = 'MATCH(`'.$res.'`) AGAINST ("'.$searchTerm.'" IN BOOLEAN MODE)';
            $res = ' '.$opMain.' ('.$res.') ';
        }
        return $res;
    }*/
    // if id-is integer then return one record with that id for initSelection
    // if id=='init' then return the first searched record for select2 initializarion with the sefault value
    // if id is NOT SET then return the list according to search

    public function xsel2_list_provider($sel2_params, $sql, $params=array(), $cb_process_result=NULL, $forceDefaults=TRUE, $whatisID = 'id', $generic_item=array(), $text_id=false){
        //$searchTerm	= $sel2_params['q']? $sel2_params['q']:'';//the searched term - request('q')
        $id	= (isset($sel2_params['id'])/* && $sel2_params['id']*/) ? trim($sel2_params['id']):'';//helper to implement the init
        $id = ($id=='init') ? 'init' : (($id=='') ? '':($text_id?$id: intval($id)));
        if (is_int($id)||($id=='init')){ $sel2_params['page_limit']=1; }

        $page 		= isset($sel2_params['page']) && $sel2_params['page']? $sel2_params['page']:1;//the page number - request('page')
        $rows 		= isset($sel2_params['page_limit']) && $sel2_params['page_limit']? $sel2_params['page_limit']:1;//rows per page - request('page_limit')
        $limit 		= $rows + 1;//set limit +1 so we know if there are more items or not

        $pos = stripos($sql,'WHERE');
        if ($pos){
            if ($forceDefaults && !empty($this->force_defaults)){
                $inject_pos = substr_count($sql,'?',0,$pos);// find params until the where block
                $defaults_sql = '';
                foreach ($this->force_defaults as $key=>$default){
                    $defaults_sql .= ' AND `'.$key.'`=?';
                    array_splice($params,$inject_pos,0,$default);
                    $inject_pos++;
                }
                $defaults_sql = substr($defaults_sql, 5);
                $sql = str_ireplace("WHERE","WHERE (".$defaults_sql.") AND ",$sql);
            }
            if (is_int($id) || ($id!='' && $text_id)){
                $whatisID = str_replace('`', '', $whatisID);
                $whatisID = str_replace('.', '`.`', $whatisID);
                $sql = str_ireplace("WHERE","WHERE (`".$whatisID."`='".$id."') AND ",$sql);
            }
        } else {
            die('Your SQL MUST have WHERE clause for this to work!');
        }
        $sql = $sql.' LIMIT ? OFFSET ?';
        $params = array_merge($params, array($limit,($page-1)*$rows));

        //print_r($params); die($sql); //for debug only

        $result = $this->query( $sql, $params, FALSE)->result_array();
        $cnt = count($result);
        $more = ($cnt == $limit) ? true : false;
        //get rid of the last element that was used for to determine $more
        if ($more) { array_pop($result); }

/*        if ($page==1 && $generic_item){ // prepend generic item to list
            if ($cnt>1){ array_unshift($result, $generic_item); }
            if (is_int($id) && $generic_item[$whatisID]==$id) { $result = $generic_item; }
        }*/
        foreach ($result as $key=>&$row){
            if ($cb_process_result && !empty($cb_process_result)){ call_user_func_array($cb_process_result, array(&$row)); }
        }
        $total = $cnt-1;
        return json_encode(array('page'=>$page,'total'=>$total,'more'=>$more,'rows'=>$result));
    }

    public function xsel2_list_provider_simple($sel2_params, $returnFields=array(), $searchFields=array(), $filterFields=array(), $orderFields=array(), $cb_process_result=NULL, $forceDefaults=TRUE){
        $id	= isset($sel2_params['id'])/* && $sel2_params['id']*/ ? trim($sel2_params['id']):'';//helper to implement the init
        $id = ($id=='init') ? 'init' : (($id=='') ? '':intval($id));
        if (is_int($id)||($id=='init')){ $sel2_params['page_limit']=1; }

        $returnFields = array_unique($returnFields);
        $sql  = 'SELECT '.(empty($returnFields)? '*':implode(',',$returnFields)).' FROM `'.$this->primary_table.'` WHERE 1 ';
        $params = array();

        if (is_int($id)){// id id is provided then return only one record of that id and disregard the search term
            $sql .=	" AND `id`='".$id."' ";
            unset($sel2_params['id']);// id already in sql so unset id
        }
        foreach ($filterFields as $key=>$filter){
            $not_operator = strpos($key,'!=');
            if (is_array($filter)){
                $filter_sql = ($filter['escape']) ? '`'.$filter['sql'].'`' : $filter['sql'];
                $sql .=	' AND `'.$key.'` '.$filter_sql;
            }else{
                $sql .=	($not_operator)?' AND `'.str_replace('!=','',$key).'`!=?' : ' AND `'.$key.'`=?';
                array_push($params,$filter);
            }
        }
        if (!is_int($id)){// if id is provided then disregard the search term
            $searchTerm	= $sel2_params['q'] ? $sel2_params['q']:'';//the searched term - request('q')
            $where_like = $this->build_where_like($searchTerm, $searchFields);
            $sql .= $where_like;
        }
        $ord = (empty($searchFields)) ? '' : ' ORDER BY '.$searchFields[0];
        $ord = (empty($orderFields)) ? $ord : ' ORDER BY '.implode(',',$orderFields);
        $sql .= $ord;
        return $this->xsel2_list_provider($sel2_params,$sql,$params,$cb_process_result,$forceDefaults);
    }

    public function xsel2_multiple_init_selection($where_in, $returnFields=array()){
        $returnFields = array_unique($returnFields);
        $sql = 'SELECT '.(empty($returnFields)? 'id as id, name as text':implode(',',$returnFields)).' FROM `'.$this->primary_table.'` WHERE id IN ('.$where_in.')';
        return $this->query($sql, array(), FALSE)->result_array();
    }
}
// END MY_Model Class



//see documentation at
//http://chris-schmitz.com/codeigniter-base-model/

//TODOO - validation on fields !!!!

class MY_CRUDModel extends MY_Model{
    // Specify the primary working table to execute queries on
    protected $primary_table = '';
    // Fields that are allowed to be inserted or updated
    protected $fields = array();
    // Fields that are required to insert or update a record
    protected $required_fields = array();
    // Set the primary key for the table
    protected $primary_key = 'id';
    // Boolean to toggle field existence checks
    protected $validate_field_existence = FALSE;
    // Defult fileds to be forced on CRUD operations, IT HAS NO EFFECT ON query method
    //create - fileds will be initialized with these values
    //get, delete, update - these fields will be used as plus where statements
    protected $force_defaults = array();

    // the constructor
    function __construct()
    {
        parent::__construct();
        // after loading u must call the initialze method with db connections
    }

    /* this is the crud model initialization module
    * MUST BE CALLED AFTER THE LOAD WITH DB CONNECTION
    * params: @db_cli - the cli database connection
    * returns: NOTHING
    */
    function initialize($db_cli=NULL){
        // call the parent initialize
        parent::initialize($db_cli);
        //log_message('debug','CRUD module initialization');
    }

    function del_image_file($filename, $uploadDir){
        if (file_exists($uploadDir.$filename) && !is_dir($uploadDir.$filename)){
            @unlink($uploadDir.$filename);
        }
    }

    function set_image($id, $img_field, $filename, $uploadDir, $oldfile){
        $uploadUrl = profile_to_url($uploadDir);
        $thumb = '';
        $rec = $this->get(array('id'=>$id),false);
        //$oldfile = $rec[$img_field];
        $options = array();
        $options['id'] = $id;
        $options[$img_field] = $filename ? $filename : '';
        if ($rec){
            if ($filename) {
                if (@rename(UPLOAD_TEMP.$filename, $uploadDir.$filename)){
                    $this->del_image_file($oldfile,UPLOAD_IMG_DIR);
                    $res = array("Result"=>'OK', "src"=>$uploadUrl.$filename, "filename" => $filename);
                }else {
                    $this->del_image_file($filename,UPLOAD_TEMP);
                    $res = array("Result"=>"ERROR", "Message"=> lang("global_cannot_move_file"));
                }
            } else {
                if ($this->update($options)){
                    $this->del_image_file($oldfile,$uploadDir);
                    $res = array("Result"=>'OK');
                } else {
                    $res = array("Result"=>"ERROR", "Message"=>lang("global_cannot_update"));
                }
            }
        } else {
            $this->del_image_file($filename,UPLOAD_TEMP);
            $res = array("Result"=>"ERROR", "Message"=>lang("global_cannot_find_record"));
        }
        return $res;
    }

    /* crud functions */

    //check permissions to modify
    function crud_list( $options=array(), $func_process='',$unset=array(), $encode = TRUE, $force_defaults = TRUE, $debug = FALSE){
        return $this->_crud_list( $options, $func_process, $unset, $encode, $force_defaults, $debug);
    }

    function crud_create( $options=array(), $unset=array(), $encode = TRUE, $force_defaults = TRUE, $get_request = TRUE ){
        return $this->_crud_create( $options, $unset, $encode, $force_defaults, $get_request);
    }

    function crud_update( $options=array(), $unset=array(), $encode = TRUE, $get_request = TRUE, $force_defaults = TRUE){
        return $this->_crud_update( $options, $unset, $encode, $get_request, $force_defaults);
    }

    function crud_delete( $encode = TRUE, $options=array(), $get_request = TRUE, $force_defaults = TRUE){
        return $this->_crud_delete( $encode, $options, $get_request, $force_defaults);
    }

    function multi_update( $fields, $where, $encode = TRUE, $escape = TRUE){
        return $this->_multi_update( $fields, $where, $encode, $escape);
    }
    //end check permissions to modify

    function crud_list_sql($sql,$params=array(),$func_process='',$encode = TRUE, $subselect_order = FALSE){
        try {
            $data = request();

            /* REPLACED BY SQL_CALC_FOUND_ROWS
            $pos = strpos(strtolower($sql),'from');
            if ($pos===FALSE){
                $cnt = 999;
            }else{
                $cntsql = 'select count(*) as cnt '.substr($sql,$pos);
                $arr = $this->query($cntsql, $params)->result_array();
                $cnt = $arr[0]['cnt'];
            }	*/

            $SortedBy = (isset($data['jtSorting']) && $data['jtSorting']) ? $data['jtSorting'] : '';
            if (strpos($SortedBy,'__SOFTSORT')===FALSE){
                if (strpos(strtolower($sql),'order by')===FALSE || $subselect_order===TRUE){
                    if ($SortedBy){
                        $sql .= ' order by '.$this->db_active->escape_str($SortedBy);
                    }
                }else{
                    if ($SortedBy){
                        $sql .= ' ,'.$this->db_active->escape_str($SortedBy);
                    }
                }
            }
            if (isset($data['jtPageSize'])&&$data['jtPageSize']){ $sql .= ' limit '.$this->db_active->escape_str($data['jtPageSize']); }
            if (isset($data['jtStartIndex'])&&$data['jtStartIndex']){ $sql .= ' offset '.$this->db_active->escape_str($data['jtStartIndex']); }


            $pos = strpos(strtolower($sql),'SQL_CALC_FOUND_ROWS');
            if ($pos===FALSE){
                $sql = str_replace_first('select', 'select SQL_CALC_FOUND_ROWS', strtolower($sql));
            }

            $records = $this->query($sql, $params)->result_array();

            //if (isset($debug) && $debug){
                //$debug = $this->db_active->last_query();
                //file_put_contents('d:\test.sql',$debug);
            //}

            $cnt = $this->query('SELECT FOUND_ROWS() as crud_found_rows', $params)->result_array();
            $cnt = $cnt[0]['crud_found_rows'];

            if (is_string($func_process) && method_exists($this,$func_process)) {
                $records = call_user_func(array($this,$func_process), $records);
                //$cnt = count($records);//$cnt is wrong if $func_process deletes records - see paginate on module 101 with sms filter
            }else if (is_array($func_process) && is_callable($func_process[0])){
                $records = $func_process[0]($records,$func_process[1]);
                //$cnt = count($records);//$cnt is wrong if $func_process deletes records - see paginate on module 101 with sms filter
            }

            if (strpos($SortedBy,'__SOFTSORT')!==FALSE){
                $sort = substr($SortedBy, 0, strpos($SortedBy, '__SOFTSORT'));
                $dir = strpos($SortedBy,' DESC')===FALSE ? 'asc' : 'desc';
                usort($records, build_sorter($sort, $dir));
            }

            $offset 	= (isset($data['jtStartIndex'])) ? $data['jtStartIndex'] : 0;
            $limit 		= (isset($data['jtPageSize'])) ? $data['jtPageSize'] : 0;
            $page 		= ($offset && $limit) ? 1 + ($offset/$limit) : 1;
            $last_page 	= ($offset+$limit >= $cnt) ? 1 : 0;

            $ret = array("Result"=>"OK", "Records"=>$records, "TotalRecordCount"=>$cnt, "SortedBy" => $SortedBy ,"page" => $page, 'last_page' => $last_page);
        } catch (Exception $e) {
            $ret = array("Result"=>"ERROR","Message"=>$e->getMessage());
        }
        return ($encode)? json_encode($ret) : $ret;

    }
    //order by must be at the end of sql

    private function _crud_list( $options=array(), $func_process='',$unset=array(), $encode = TRUE, $force_defaults = true, $debug = false){
        try {
            $data = request();
            if (!empty($options)){
                $data = array_merge($data,$options);
            }
            if(is_bool($unset)){
                if ($unset===TRUE) $data = array();
            }else{
                if (!empty($unset)){
                    foreach ( $unset as $key){
                        if(array_key_exists($key,$data)){
                            unset($data[$key]);
                        }
                    }
                }
            }
            if (isset($data['jtPageSize'])&&$data['jtPageSize']){ $data['limit'] = $data['jtPageSize']; unset($data['jtPageSize']);}
            if (isset($data['jtStartIndex'])&&$data['jtStartIndex']){ $data['offset'] = $data['jtStartIndex']; unset($data['jtStartIndex']);}
            if ((isset($data['jtSorting'])&&$data['jtSorting']) && !(isset($data['sort_by'])&&$data['sort_by'])){ $data['sort_by'] = $data['jtSorting'];  unset($data['jtSorting']); }

            $records = $this->get($data, $force_defaults);

            if ($debug){
                $debug = $this->db_active->last_query();
            }
            if (method_exists($this,$func_process)) {
                $records = call_user_func(array($this,$func_process), $records);
            }
            $cnt = $this->countall($data, $force_defaults);

            $offset 	= (isset($data['offset'])) ? $data['offset'] : 0;
            $limit 		= (isset($data['limit'])) ? $data['limit'] : 0;
            $page 		= ($offset && $limit) ? 1 + ($offset/$limit) : 1;
            $last_page 	= ($offset+$limit >= $cnt) ? 1 : 0;

            $SortedBy 	= (isset($data['sort_by'])) ? $data['sort_by'] : "";

            $return = array("Result"=>"OK", "Records"=>$records, "TotalRecordCount"=>$cnt, "SortedBy" => $SortedBy ,"page" => $page, 'last_page' => $last_page);
            if ($debug){
                $return['sql'] = $this->db_active->last_query();
            }
            $ret = $return;
        } catch (Exception $e) {
            $ret = array("Result"=>"ERROR","Message"=>$e->getMessage());
        }
        return ($encode)? json_encode($ret) : $ret;
    }

    function _crud_create( $options=array(), $unset=array(), $encode = TRUE, $force_defaults = TRUE, $get_request = TRUE){
        try{
            $data = ($get_request) ? request() : array();
            $data = array_merge($data,$options);

            if(is_bool($unset)){
                if ($unset===TRUE) $data = array();
            }else{
                if (!empty($unset)){
                    foreach ( $unset as $key){
                        if(array_key_exists($key,$data)) {
                            unset($data[$key]);
                        }
                    }
                }
            }
            $data['id'] = $this->create($data,$force_defaults);
            if ($data['id']){
                $ret = array("Result"=>"OK","Record"=>$data);
            }else {
                $ret = array("Result"=>"ERROR","Message"=>lang('err_create'),"Record"=>$data);
            }
        } catch (Exception $e) {
            $ret = array("Result"=>"ERROR","Message"=>$e->getMessage());
        }
        return ($encode)? json_encode($ret) : $ret;
    }

    function _crud_update( $options=array(), $unset=array(), $encode = TRUE, $get_request = TRUE, $force_defaults = TRUE){
        try{
            $data = ($get_request) ? request() : array();

            $data = array_merge($data,$options);

            if(is_bool($unset)){
                if ($unset===TRUE) $data = array();
            }else{
                if (!empty($unset)){
                    foreach ($unset as $key){
                        if(array_key_exists($key,$data)) {
                            unset($data[$key]);
                        }
                    }
                }
            }
            if ($this->update($data, $force_defaults)){
                $ret = array("Result"=>"OK");
            }else {
                $ret = array("Result"=>"ERROR","Message"=>lang('err_update'));
            }
        }catch (Exception $e) {
            $ret = array("Result"=>"ERROR","Message"=>$e->getMessage());
        }
        return ($encode)? json_encode($ret) : $ret;
    }

    function _crud_delete( $encode = TRUE, $options=array(), $get_request = TRUE, $force_defaults = TRUE){
        try{
            $data = ($get_request) ? request() : array();
            $data = array_merge($data,$options);
            if ($this->delete($data, $force_defaults)){
                $ret = array("Result"=>"OK");
            }else {
                $ret = array("Result"=>"ERROR","Message"=>lang('err_delete'));
            }
        }catch (Exception $e) {
            $ret = array("Result"=>"ERROR","Message"=>$e->getMessage());
        }
        return ($encode)? json_encode($ret) : $ret;
    }

    function _multi_update( $fields, $where, $encode = TRUE, $escape = TRUE){
        try{
            if ($this->update_where($fields, $where, $escape)){
                $ret = array("Result"=>"OK");
            }else {
                $ret = array("Result"=>"ERROR","Message"=>lang('err_update'));
            }
        }catch (Exception $e) {
            $ret = array("Result"=>"ERROR","Message"=>$e->getMessage());
        }
        return ($encode)? json_encode($ret) : $ret;
    }

    /* end crud functions */
    function get_rec($id){
        $rec = $this->db_active->query('select * from '.$this->primary_table.' where id=?',array($id))->result_array();
        if ($rec)
            return $rec[0];
        else
            return array();
    }

    function get_rec_field($id, $field = 'id'){
        $rec = $this->db_active->query('select * from '.$this->primary_table.' where id=?',array($id))->result_array();
        if ($rec){
        if ($this->_is_field($field)){
            return $rec[0][$field];
        }else return false;
        }else
            return array();
    }

    /* a powerfull generic query method used for data retreival,
    * IT WORKS ON THE WHOLE DB NOT JUST ON THE MODELLED TABLE
    * params:  @sql - the sql to execute
    * 			@params - the parameter array
    * 			@$check_rights - CAREFULL! set this parameter to FALSE only if you are sure of what you are doing. Usually this can be se FALSE if the SQL is only for SELECTING data!
    * returns:	@return array result()
    */
    function query($sql, $params, $check_rights = TRUE){
        //Using query binds the values are automatically escaped, producing safer queries. You don't have to manually escape data;
        return $this->db_active->query($sql, $params);
    }

    /**
    * create method creates a record in the table.
    *
    * Options: array of fields available
    *
    * @param array $options
    * @return int ID on success, bool false on fail
    */
    function create($options = array(),$force_defaults = true)
    {
        if ($force_defaults){
            $options = $this->_force_default($options, $this->force_defaults);
        }
        if ( ! $this->_required($this->required_fields, $options)){
            return FALSE;
        }
        $this->_set_editable_fields($this->primary_table);

        //sanitize the $options array
        foreach ($options as $key=>&$option){
            if (!in_array($key,$this->fields)){
                unset($options[$key]);
            }
        }

        $this->_validate_options_exist($options);

        $sys_default = array(
            'rec_createdid' => $this->session->userdata('userid'),
            'rec_modified' => date($this->config->item('log_date_format')),
            'rec_modifiedid' => $this->session->userdata('userid'),
        );
        $options = $this->_default($sys_default, $options);

        // qualification (make sure that we're not allowing the site to insert data that it shouldn't)
        foreach ($this->fields as $field){
            if (isset($options[$field])){
                //$this->db_active->set($field, $options[$field]);
                if ($options[$field]===''){
                    //$this->db_active->set($field, NULL);
                }else{
                    $this->db_active->set($field, $options[$field]);
                }
            }
        }

        $query = $this->db_active->insert($this->primary_table);

        if ($query)	{
            return $this->db_active->insert_id();
        }else{
            return FALSE;
        }
    }

    /**
    * get method returns an array of qualified record objects
    *
    * Option: Values
    *
    * Returns (array of objects)
    *
    * @param array $options
    * @return array result()
    */
    function get($options = array(), $force_defaults = true)
    {
        if (!isset($options['limit'])){ $options['limit']=NULL; }
        if (!isset($options['offset'])){ $options['offset']=NULL; }
        //isset($options['offset'])? : $options['limit']='';

        if($force_defaults)
            $options = $this->_force_default($options, $this->force_defaults);

        $this->_set_editable_fields($this->primary_table);

        foreach ($options as $key=>$value){
            if ($this->_is_field($key)){
                $field = $this->_sanitize($key,$options);
                $this->db_active->where($field, $value);
            }
        }

        //FOREIGN where for joined tables, because is_field cannot check fields from other models // not needed since op_join
        /*if (isset($options['op_where_fg']) && $options['op_where_fg']){
            foreach ($options['op_where_fg'] as $table=>$fg_fields){
                foreach($fg_fields as $fg_field=>$value){
                    $field = $this->_sanitize($fg_field,$options,$table);
                    $this->db_active->where($table.'.'.$fg_field, $value);
                }
            }
        }*/

        if (isset($options['op_where_in']) && $options['op_where_in']){
            foreach ($options['op_where_in'] as $key=>$value){
                if ($this->_is_field($key)){
                    $field = $this->_sanitize($key,$options);
                    $this->db_active->where_in($field, $value);
                }
            }
        }

        if (isset($options['op_where'])){
            if( is_array($options['op_where']) && array_key_exists('where',$options['op_where']) && array_key_exists('escape',$options['op_where'])){
                $this->db_active->where($options['op_where']['where'],NULL,$options['op_where']['escape']);
            }else{
                $this->db_active->where($options['op_where'],NULL);
            }
            unset($options['op_where']);
        }

        if (isset($options['op_select'])){
            if( is_array($options['op_select']) && array_key_exists('select',$options['op_select']) && array_key_exists('escape',$options['op_select'])){
                $this->db_active->select($options['op_select']['select'],$options['op_select']['escape']);
            }else{
            $this->db_active->select($options['op_select']);
            }
            unset($options['op_select']);
        }

        if (isset($options['op_like'])){
            foreach ($options['op_like'] as $field=>$value){
                $this->db_active->like($field, $value);
            unset($options['op_like']);
            }
        }

        if (isset($options['op_or_like'])){
            $str_arr = array();
            foreach ($options['op_or_like'] as $field=>$value){
                $value = $this->db_active->escape_like_str($value);
                $str_arr[] = "`".$field."` LIKE '%".$value."%'";
            }
            $str = implode(' OR ', $str_arr);
            $this->db_active->where("($str)", FALSE, FALSE);
            unset($options['op_or_like']);
        }

        /*if (isset($options['op_join'])){
            foreach($options['op_join'] as $table=>$ops){
                if (is_array($ops)){
                    if(isset($ops[1]) && isset($ops[0]))
                        $this->db_active->join($table, $ops[0], $ops[1]);
                    elseif(isset($ops[0]))
                        $this->db_active->join($table, $ops[0]);
                }else{
                    $this->db_active->join($table, $ops);
                }
            }
        }*/
        /*END CSONGI*/

        if (isset($options['sort_by'])){
            $this->db_active->order_by($options['sort_by']);
        }
        if (isset($options['group_by'])){
            $this->db_active->group_by($options['group_by']);
        }

        $query = $this->db_active->get($this->primary_table, $options['limit'], $options['offset']);

        //$debug = $this->db_active->last_query();
        //$debug = $this->db_active->_compile_select();

        if ((isset($options['op_get_first']) && $options['op_get_first'] == true) ||
            (isset($options[$this->primary_key]) && $options['limit'] == NULL && (!isset($options['op_get_first']) || $options['op_get_first'] === TRUE))){
            return $query->row_array();
        }else{
            return $query->result_array();
        }
    }

    /**
    * count method returns the nr of records found it will ignore all limit and offset settings
    *
    * Option: Values
    *
    * Returns (array of objects)
    *
    * @param array $options
    * @return array result()
    */
    function countall($options = array(), $force_defaults = true){
        if($force_defaults){
            $options = $this->_force_default($options, $this->force_defaults);
        }

        $this->_set_editable_fields($this->primary_table);

        foreach ($options as $key=>$value){
            if ($this->_is_field($key)){
                $field = $this->_sanitize($key,$options);
                $this->db_active->where($field, $value);
            }
        }

        //FOREIGN where for joined tables, because is_field cannot check fields from other models  // NOT NEEDED SINCE op_join
        /*if (isset($options['op_where_fg']) && $options['op_where_fg']){
            foreach ($options['op_where_fg'] as $table=>$fg_fields){
                foreach($fg_fields as $fg_field=>$value){
                    $field = $this->_sanitize($fg_field,$options,$table);
                    $this->db_active->where($table.'.'.$fg_field, $value);
                }
            }
        }*/
        if (isset($options['op_where_in']) && $options['op_where_in']){
            foreach ($options['op_where_in'] as $key=>$value){
                if ($this->_is_field($key)){
                    $field = $this->_sanitize($key,$options);
                    $this->db_active->where_in($field, $value);
                }
            }
        }

        if (isset($options['op_where'])){
            if( is_array($options['op_where']) && array_key_exists('where',$options['op_where']) && array_key_exists('escape',$options['op_where'])){
                $this->db_active->where($options['op_where']['where'],NULL,$options['op_where']['escape']);
            }else{
                $this->db_active->where($options['op_where'],NULL);
            }
            unset($options['op_where']);
        }

        if (isset($options['op_select'])){
            if( is_array($options['op_select']) && array_key_exists('select',$options['op_select']) && array_key_exists('escape',$options['op_select'])){
                $this->db_active->select($options['op_select']['select'],$options['op_select']['escape']);
            }else{
            $this->db_active->select($options['op_select']);
            }
            unset($options['op_select']);
        }

        if (isset($options['op_like'])){
            foreach ($options['op_like'] as $field=>$value){
                $this->db_active->like($field, $value);
                unset($options['op_like']);
            }
        }

        /* OLD NOT GOOD BECAUSE OF BRACKETS */

        /*
        if (isset($options['op_or_like'])){
            foreach ($options['op_or_like'] as $field=>$value){
                $this->db_active->or_like($field, $value);
            unset($options['op_or_like']);
            }
        }
        */

        if (isset($options['op_or_like'])){
            $str_arr = array();
            foreach ($options['op_or_like'] as $field=>$value){
                $value = $this->db_active->escape_like_str($value);
                $str_arr[] = "`".$field."` LIKE '%".$value."%'";
            }
            $str = implode(' OR ', $str_arr);
            $this->db_active->where("($str)", FALSE, FALSE);
            unset($options['op_or_like']);
        }


        /*if (isset($options['op_join'])){
            foreach($options['op_join'] as $table=>$ops){
                if (is_array($ops)){
                    if(isset($ops[1]) && isset($ops[0]))
                        $this->db_active->join($table, $ops[0], $ops[1]);
                    elseif(isset($ops[0]))
                        $this->db_active->join($table, $ops[0]);
                }else{
                    $this->db_active->join($table, $ops);
                }
            }
        }*/

        if (isset($options['group_by'])){
            $this->db_active->group_by($options['group_by']);
        }

        //$this->db_active->from($this->primary_table);

        //!!!!!!!DOESNT WORK WITH GROUP BY
        //return $this->db_active->count_all_results();

        $query = $this->db_active->get($this->primary_table);

        return $query->num_rows();
    }



    function get_where($fields = array('*'), $where = '', $params = array()){
        /*$sel='';
        foreach($fields as $field){

            $sel.=$field.',';
        }
        $sel=substr($sel,0,-1);//delete the last comma*/


        if ($where!=='') $where = ' where '.$where;

        $sel = join(',',$fields);

        $sql = 'select '.$sel.' from '.$this->primary_table.$where;

        $res = $this->query($sql, $params)->result_array();

        $debug = $this->db_active->last_query();
        //$debug = $this->db_active->_compile_select();

        return $res;
    }

    /**
    * update method alters a SINGLE record in the table. //used for CRUD operations
    *
    * Option: Values
    *
    * @param array $options
    * @return int affected_rows() - not any more
    */
    function update($options = array(), $force_defaults = true)
    {
        $required = array($this->primary_key);
        if ( ! $this->_required($required, $options)){
            return FALSE;
        }

        if ( ! $this->_upd_required($this->required_fields, $options)){
            return FALSE;
        }

        $this->_set_editable_fields($this->primary_table);

        //sanitize the $options array
        foreach ($options as $key=>$option){
            if (!in_array($key,$this->fields)){
                unset($options[$key]);
            }
        }

        $this->_validate_options_exist($options);

        $sys_default = array(
            'rec_modified' => date($this->config->item('log_date_format')),
            'rec_modifiedid' => $this->session->userdata('userid'),
        );
        $options = $this->_default($sys_default, $options);

        // qualification (make sure that we're not allowing the site to insert data that it shouldn't)
        foreach ($this->fields as $field){
            if (isset($options[$field])){
                if ($options[$field]==='')
                    $this->db_active->set($field, NULL);
                else
                    $this->db_active->set($field, $options[$field]);
            }
        }

        $this->db_active->where($this->primary_key, $options[$this->primary_key]);

        // this to ensure extra safety
        foreach ($this->fields as $field){
            if ($force_defaults && isset($this->force_defaults[$field])){
                $this->db_active->where($field, $this->force_defaults[$field]);
            }
        }

        return $this->db_active->update($this->primary_table);

        //return $this->db_active->affected_rows();
        //not working -> if u execute "update name='test' where id=1" and the name is allready 'test' then rows_affected is 0 !!!!
    }


    /**
    * update method alters MULTIPLE records in the table.
    *
    * Option: Values
    *
    * @param array $options
    * @param array $where
    * @return int affected_rows() - not any more
    */

    function update_where($set = array(), $where = array(), $escape = true, $force_defaults = true)
    {
        if ( ! $this->_upd_required($this->required_fields, $set)){
            return FALSE;
        }

        $this->_set_editable_fields($this->primary_table);

        //sanitize the $set array
        foreach ($set as $key=>$s){
            if (!in_array($key,$this->fields)){
                unset($set[$key]);
            }
        }

        //sanitize the $where array		// do not sanitize where let it fail in order to avoid wrong updates
        /*foreach ($where as $key=>$whe){
            if (!in_array($key,$this->fields)){
                unset($where[$key]);
            }
        }*/

        $this->_validate_options_exist($set);

        $set = $this->_default(array(), $set);

        // qualification (make sure that we're not allowing the site to update data that it shouldn't)
        foreach ($this->fields as $field){
            if (isset($set[$field])){
                if ($set[$field]==='')
                    $this->db_active->set($field, NULL);
                else
                    $this->db_active->set($field, $set[$field]);
            }
        }
        foreach ($where as $key=>$value){
            if ($this->_is_field($key)){
                $this->db_active->where($this->_sanitize($key), $value, $escape);
            }
        }
/*ISTVAN*/
        if (isset($where['op_where'])){
            if(is_array($where['op_where']) && array_key_exists('where',$where['op_where']) && array_key_exists('escape',$where['op_where'])){
                $this->db_active->where($where['op_where']['where'],NULL,$where['op_where']['escape']);
            }else{
                $this->db_active->where($where['op_where'],NULL);
            }
            unset($where['op_where']);
        }
/*ISTVAN*/
        // this to ensure extra safety
        foreach ($this->fields as $field){
            if ($force_defaults && isset($this->force_defaults[$field])){
                $this->db_active->where($field, $this->force_defaults[$field]);
            }
        }

        return $this->db_active->update($this->primary_table);

        //return $this->db_active->affected_rows();
        //not working -> if u execute "update name='test' where id=1" and the name is alleady 'test' then rows_affected is 0 !!!!
    }

    /**
    * delete method removes a record from the table
    *
    * Option: Values
    * --------------
    * id (required)
    *
    * @param array $options
    */
    function delete($options = array(), $force_defaults = true){
        $required = array($this->primary_key);
        if ( ! $this->_required($required, $options)){
            return FALSE;
        }

        $this->db_active->where($this->primary_key, $options[$this->primary_key]);

        if ($force_defaults){
        // this to ensure extra safety
        foreach ($this->fields as $field){
            if (isset($this->force_defaults[$field])){
                $this->db_active->where($field, $this->force_defaults[$field]);
            }
        }
        }

        try{
            $dbg = $this->db_active->db_debug; $this->db_active->db_debug = FALSE;// to prevent codeigniter db_debug settings
            $res = $this->db_active->delete($this->primary_table);
            $this->db_active->db_debug = $dbg;// restore db_debug settings
        } catch (Exception $e) {
            $this->db_active->db_debug = $dbg;// restore db_debug settings
            //echo 'Caught exception: ',  $e->getMessage(), "\n";
            $res = FALSE;
        }
        return $res;
    }

    /**
    * update method alters MULTIPLE records in the table.
    *
    * Option: Values
    *
    * @param array $options
    * @param array $where
    * @return int affected_rows() - not any more
    */

    function delete_where($where = array(), $force_defaults = true)
    {
        $this->_set_editable_fields($this->primary_table);

        //sanitize the $where array		// do not sanitize where let it fail in order to avoid wrong updates
        /*foreach ($where as $key=>$whe){
            if (!in_array($key,$this->fields)){
                unset($where[$key]);
            }
        }*/

        // qualification
        /* we don't need both, see below for $this->_is_field($key)
        * foreach ($this->fields as $field){
            if (isset($where[$field])){
                if ($where[$field]!='')
                    $this->db_active->where($field, $where[$field]);
            }
        }*/

        foreach ($where as $key=>$value){
            if ($this->_is_field($key)){
                $this->db_active->where($this->_sanitize($key), $value);
            }//else return false; TODOOO
        }

        if ($force_defaults){
        // this to ensure extra safety
        foreach ($this->fields as $field){
            if (isset($this->force_defaults[$field])){
                $this->db_active->where($field, $this->force_defaults[$field]);
            }
        }
        }

        return $this->db_active->delete($this->primary_table);

    }

    /**
    * Validates that the fields you are trying to modify actually exist in the database
    *
    * Only use this method for debugging, not fit for production code because of the number of queries it has to run
    *
    * @param string $options
    * @return void
    */
    function _validate_options_exist($options)
    {
        if ($this->validate_field_existence == TRUE){
            foreach ($options as $key => $value){
                if ( ! $this->db_active->field_exists($key, $this->primary_table)){
                    show_error('You are trying to insert data into a field that does not exist. The field "'. $key .'" does not exist in the "'. $this->primary_table .'" table.');
                }
            }
        }
    }

    /**
    * set editable fields in the table, if no fields are specified in the model, fields will be pulled dynamically from the table
    *
    * @return void
    */
    protected function _set_editable_fields()
    {
        if (empty($this->fields)){
            // pull the fields dynamically from the database
            $this->db_active->cache_on();
            $this->fields = $this->db_active->list_fields($this->primary_table);
            $this->db_active->cache_off();
        }
    }

    /**
    * _required method returns false if the $data array does not contain all of the keys assigned by the $required array.
    *
    * @param array $required
    * @param array $data
    * @return bool
    */
    protected function _required($required, $data)
    {
        $res = TRUE;
        foreach ($required as $field){
            if ((!isset($data[$field])) || ($data[$field]==='')){
                $res = FALSE;
            }
        }
        return $res;
    }

    /**
    * _required method returns false if the $data array does contain an empty key assigned by the $required array.
    *
    * @param array $required
    * @param array $data
    * @return bool
    */
    protected function _upd_required($required, $data)
    {
        foreach ($required as $field){
            if ( isset($data[$field]) && ($data[$field]==='')){
                return FALSE;
            }
        }
        return TRUE;
    }

    /**
    * _default method combines the options array with a set of defaults giving the values in the options array priority.
    *
    * @param array $defaults
    * @param array $options
    * @return array
    */
    protected function _default($defaults, $options)
    {
        return array_merge($defaults, $options);
    }

    /**
    * _force_default method combines the options array with a set of defaults giving the values in the force_defaults array priority.
    *
    * @param array $defaults
    * @param array $options
    * @return array
    */
    protected function _force_default($options, $force_defaults)
    {
        return array_merge($options, $force_defaults);
    }

    /**
    * _is_field checks if a key is a database field // checks for the first word to allow sintax like 'id >' 'id <=' 'id is NULL'
    *
    * @param array $defaults
    * @param array $options
    * @return array
    */
    protected function _is_field($key){
        $keys = explode(' ',$key);
        foreach ($this->fields as $field){
            if ($field === $keys[0]){
                return TRUE;
            }
        }
        return FALSE;
    }

    protected function _sanitize($key, $options = array()){//, $foreign_table = ''){
        $keys = explode(' ',$key);
        $res = '';
        //$table_prefix = ($foreign_table) ? $foreign_table : $this->primary_table;
        foreach ($keys as $i=>$val){
            if ($i==0){
                //$field = (isset($options['op_join'])) ? $table_prefix.'.'.$keys[$i] : $keys[$i];
                //$res = $field;
                $res =  $keys[$i];
            } else {
                if (in_array($val, array('>','>=','<','<=','!=','=','is','not','NULL','IN'))){
                    $res .= ' '.$keys[$i].' ';
                }
            }
        }
        return $res;
    }

}

// END MY_ModuleModel Class

/* End of file MY_Model.php */
/* Location: ./application/core/MY_Model.php */