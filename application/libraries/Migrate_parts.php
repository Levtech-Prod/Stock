<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
* Migrate parts list from csv
*
*
*/

class Migrate_parts{

    protected $version = '1';
    protected $db_active = NULL; // Specify the working database db_cli, it can be overwritten after initialize

    public function __construct(){
        $this->CI = & get_instance();
    }

    public function initialize($db_cli=NULL){
        $this->db_active = $db_cli;
    }

    private function _export_parts($order_id){
        $content = "Pos.,Material type,Quantity,Size in mm\r\n";
        $sql = "SELECT j.*, concat(m.name, ' - ', m.code) as material_name, m.code as mat_code, m.name as mat_name, m.density
                FROM jobs j
                left join materials m on (m.id = j.materialid)
                WHERE j.order_id = ? ";
        $jobs = $this->db_active->query($sql, array($order_id))->result_array();
        $i = 0;
        foreach($jobs as $r){
            $i++;
            $content.=$i.",".$r['mat_code'].",".$r['quantity'].",".($r['height'].' x '.$r['width'].' x '.$r['length'])."\r\n";
        }

        return $content;
    }

    public function export_parts($order_id){
        $content = $this->_export_parts($order_id);
        header("Pragma: public");
        header("Expires: 0");
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Cache-Control: public");
        header("Content-Description: File Transfer");
        header("Content-Type: application/force-download");
        header("Content-Type: application/csv");
        header("Content-Disposition: attachment; filename=\"jobs_".date("Ymdhisa").".csv\"");
        //header("Content-Length: ".mb_strlen($content));
        header('Set-Cookie: fileDownload=true; path=/');// to finish downloading via JS fileDownload
        echo $content;
    }

    private function _import_parts($file,$order_id){
        $row = 0;
        $line = 0;
        if (($handle = fopen($file['path'], "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                $line++;
                $num = count($data);
                if($line>1){
                    $row++;
                    $jobs['order_id'] = $order_id;
                    $jobs['name'] = $data[0];
                    $jobs['quantity'] = intval(str_replace(",",".",$data[1]));
                    $jobs['price'] = floatval(str_replace(",",".",$data[2]));
                    $jobs['rec_createdid'] = $this->CI->session->userdata('userid');
                    //$jobs['opcode'] = 1;
                    $this->db_active->insert('jobs', $jobs);
                }
            }
            fclose($handle);
        }

        return $row;
    }

    public function import_parts($order_id){
        require_once(APPPATH."controllers/uploadr/PluploadHandler.php");
        PluploadHandler::no_cache_headers();
        PluploadHandler::cors_headers();
        $res = PluploadHandler::handle(array(
            'target_dir' => UPLOAD_TEMP,
            'allow_extensions' => 'csv',
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
            if (isset($res['name']) && $res['name']){// if upload finished
                $count = $this->_import_parts($res,$order_id);
                if(file_exists(UPLOAD_TEMP.$res['name'])){
                    unlink(UPLOAD_TEMP.$res['name']);
                }
            }
            die(json_encode(array('OK' => 1, 'file'=>$res, 'out'=>$out, 'count'=>$count)));
        }
    }

}