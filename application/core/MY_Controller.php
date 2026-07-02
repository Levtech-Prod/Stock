<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
* CodeIgniter MY_Controller Class
*
*/
class MY_BASEController extends CI_Controller {
    protected $db_cli = NULL;

    protected $crud_models = array();// list of crud models used in the controller

    function __construct(){
        parent::__construct();
    }

    protected function _init(){
        $class = $this->router->fetch_class();
        if($this->session->userdata('isLoggedIn') || $class=='Main'){
			$this->_db_connect();
            $this->load_model($this->crud_models);
            $this->lang->load('global');
		}else{
            echo "Csak a bejelentkezett felhasználónak van joga ehhez az oldalhoz!";
            echo "<script>window.location.reload(true);</script>";
            exit;
        }
    }

    private function _db_connect(){
        //connect to the databases
        if ((!$this->db_cli)){
            $this->db_cli = db_cli_connect($this);
        }
    }


    public function load_model($models, $db_cli=NULL /*, $force_load=FALSE*/){
        $models = is_array($models) ? $models : array($models);
        $db_cli = is_object($db_cli) ? $db_cli : $this->db_cli;
        foreach ($models as $model){
            if ((!$this->load->is_loaded($model))/* || $force_load*/){
                $this->load->model($model);
            }
            $this->$model->initialize($db_cli);
        }
    }


}

/**
* CodeIgniter MY_Controller Class
*
*/
class MY_Controller extends MY_BASEController {

    function __construct(){
        parent::__construct();
        $this->_init();
    }
}
// END MY_Controller Class

/* End of file MY_Controller.php */
/* Location: ./application/core/MY_Controller.php */