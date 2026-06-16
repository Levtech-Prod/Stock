<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Upload extends CI_Controller {

    function __construct(){
        parent::__construct();// Call the constructor
    }

    function upload_img(){
        require_once("PluploadHandler.php");

        PluploadHandler::no_cache_headers();
        PluploadHandler::cors_headers();
        $res = PluploadHandler::handle(array(
                    'target_dir' => UPLOAD_TEMP,
                    'allow_extensions' => 'jpg,jpeg,png',
            ));
        if (!$res){
            $out = ob_get_contents();
            ob_end_clean();
            die(json_encode(array(
                'OK' => 0,
                'error' => array(
                    'code' => PluploadHandler::get_error_code(),
                    'message' => PluploadHandler::get_error_message()
                ),
                'out'=>$out,
            )));
        } else {
            $out = ob_get_contents();
            ob_end_clean();
            die(json_encode(array('OK' => 1, 'file'=>$res, 'out'=>$out)));
        }
    }

    function upload_file(){
        require_once("PluploadHandler.php");

        PluploadHandler::no_cache_headers();
        PluploadHandler::cors_headers();
        $res = PluploadHandler::handle(array(
                    'target_dir' => UPLOAD_TEMP,
                    'allow_extensions' => 'jpg,png,jpeg,bmp,pdf,doc,docx,xls,xlsx,ppt,pptx,txt,zip,rar,dwg,DWG,step,STEP,stp,STP,igs,IGS',
                    'cb_sanitize_file_name' => false
            ));
        if (!$res){
            $out = ob_get_contents();
            ob_end_clean();
            die(json_encode(array(
                'OK' => 0,
                'error' => array(
                    'code' => PluploadHandler::get_error_code(),
                    'message' => PluploadHandler::get_error_message()
                ),
                'out'=>$out,
            )));
        } else {
            $out = ob_get_contents();
            ob_end_clean();
            die(json_encode(array('OK' => 1, 'file'=>$res, 'out'=>$out)));
        }
    }

    public function delete_file(){
        $fileName = $_POST['fileName'];
        $path = UPLOAD_TEMP.$fileName;
        if(file_exists($path)){
            unlink(UPLOAD_TEMP.$fileName);
        }
        echo json_encode(array('Result'=>'OK'));
    }
}

/* End of file upload.php */
/* Location: ./application/controllers/uploadr/Upload.php */