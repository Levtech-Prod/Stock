<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
* CodeIgniter MISC Helpers
*
* @subpackage	Helpers
* @category	Helpers
* @link
*/

// ------------------------------------------------------------------------

/**
* request
*
* for lazy programmers to avoid writing long code
*/

if ( ! function_exists('request'))
{
    function request($index=NULL,$xss_clean=TRUE)
    {
        $CI =& get_instance();
        if ($index===NULL){ // return the whole post and get array
            $post = $CI->input->post(NULL,$xss_clean);
            $get = $CI->input->get(NULL,$xss_clean);
            if (($post)&&($get)){ return $post + $get; }
            else if ($post){ return $post; }
            else { return $get;	}
        } else { //return the index from the request
            return $CI->input->get_post($index,$xss_clean);
        }
    }
}

/**
* database connection functions
*/

if ( ! function_exists('db_cli_connect'))
{
    function db_cli_connect($that)
    {
        $db_cli_config = $that->config->item('db_client');
        return $that->load->database($db_cli_config,TRUE,TRUE);
    }
}

/**
* salt
*/
if ( ! function_exists('salt'))
{
    function salt($value){
        $salt = sha1(md5($value));
        return  md5($value.$salt);
    }
}
/**
* used on the directory encondings
*/
if ( ! function_exists('extra_salt'))
{
    function extra_salt($value){
        return  salt($value).'a'.$value;
    }
}
/**
* guid
*/
if ( ! function_exists('guid'))
{
    function guid(){
        if (function_exists('com_create_guid')){
            return com_create_guid();
        }else{
            mt_srand((double)microtime()*10000);//optional for php 4.2.0 and up.
            $charid = strtoupper(md5(uniqid(rand(), true)));
            $hyphen = chr(45);// "-"
            $uuid = chr(123)// "{"
                    .substr($charid, 0, 8).$hyphen
                    .substr($charid, 8, 4).$hyphen
                    .substr($charid,12, 4).$hyphen
                    .substr($charid,16, 4).$hyphen
                    .substr($charid,20,12)
                    .chr(125);// "}"
            return $uuid;
        }
    }
}

/**
* currency functions
*/


if ( ! function_exists('percent_strip'))
{
    function percent_strip($val){
        return str_ireplace('%','',$val);
    }
}

if ( ! function_exists('percent_format'))
{
    function percent_format( $val ){
        return number_format($val,2,'.','').' %';
    }
}

if ( ! function_exists('get_global_lang'))
{
    function get_global_lang(){
        $CI =& get_instance();
        return $CI->lang->language;
    }
}

if ( ! function_exists('get_type_constants'))
{
    function get_type_constants(){
        $res = get_defined_constants(true);
        return $res['user'];
    }
}

//WILL BE REMOVED IN THE NEXT VERSION
if ( ! function_exists('convert_to_option_list'))// NEED TO REWRITE
{
    function convert_to_option_list($values, $fk_alias = 'id', $txt_alias='value', $nullrec=FALSE, $nullval='' )
    {
        $res = array();
        if ($nullrec!==FALSE){ $res[$nullval]=$nullrec; }
        foreach ($values as $val){
            $res[$val[$fk_alias]] = $val[$txt_alias];
        }
        return $res;
    }
}

if ( ! function_exists('format_datepicker'))
{
    function format_datepicker( $date )
    {
        $format = lang('date_format_php');
        if ($date) return '"'.date($format, strtotime($date)).'"';
        else return 'null';
    }
}

if ( ! function_exists('options_list'))
{
    function options_list( $data , $default='', $val_key='Value', $text_key='DisplayText', $option_name='', $exclude = array(), $nullrec = false)
    {
        if ($option_name==''){
            $option_name = round(microtime()*100000);
        }
        $res='';
        if (empty($data)){
            $res.= '<option id="'.$option_name.$default.'" value="'.$default.'"'. ' selected="selected"></option>';
        }else{
            if (is_string($data)){
                $data = json_decode($data,TRUE);
            }
            if (is_array($data)){
                if ($nullrec) array_unshift($data,array($val_key=>'',$text_key=>''));
                foreach ($data as $val){
                    if(!in_array($val[$val_key], $exclude)){
                    $res.= '<option id="'.$option_name.$val[$val_key].'" value="'.$val[$val_key].'"'. (($val[$val_key] == $default) ? ' selected="selected"' : '') .'>'.$val[$text_key].'</option>';
                }

            }
        }
        }
        return $res;
    }
}

/*
getAge - calculates the age from the birthdate
*/
if ( ! function_exists('getAge'))
{
    function getAge($birthdate){
        $birthday_timestamp = strtotime($birthdate);
        // Calculates age correctly
        // Just need birthday in timestamp
        if ($birthday_timestamp) {
            $age = date('md', $birthday_timestamp) > date('md') ? date('Y') - date('Y', $birthday_timestamp) - 1 : date('Y') - date('Y', $birthday_timestamp);
        } else {
            $age = '';
        }
        return $age;
    }
}

/*main function used for versioning*/
if ( ! function_exists('build_path'))
{
    function build_path($path, $file_only=FALSE){
        //ini_set('error_log','c:\aa\my_file.log');//error_log($path . '----->>>>>'.$ret);//native php logging
        $tspath = (striPos($path,FCPATH)===0)? $path : FCPATH.$path;
        $ts = (file_exists($tspath)) ? '__'.filemtime($tspath) : '';
        if (ENVIRONMENT == "development"){ //allow VS-Code debugging
            if (file_exists('_debug_')){
                $ts = '';
            }
        }
        $path_parts = pathinfo($path);
        $path_parts['extension'] = ($path_parts['extension']=='')? '':'.'.$path_parts['extension'];
        $path_parts['dirname'] = ($path_parts['dirname']=='.')? '': $path_parts['dirname'];
        $path_parts['dirname'] = ($path_parts['dirname']=='')? '': $path_parts['dirname'].'/';
        //$ret = $path_parts['filename'].$ts.$path_parts['extension'];
        $ret = $path_parts['filename'].$path_parts['extension'];

        return ($file_only)? $ret : $path_parts['dirname'].$ret;
    }
}
if ( ! function_exists('base_static_url'))
{
    function base_static_url(){
        $CI =& get_instance();
        $static = $CI->config->item('system.static_url');
        $replace = $CI->config->item('system.static_url_replace');
        $url = str_replace('://','://'.$static, base_url());
        return str_replace($static.$replace, $static, $url);
    }
}
if ( ! function_exists('build_url'))
{
    function build_url($path){
        return base_url().build_path($path);
    }
}
if ( ! function_exists('build_static_url'))
{
    function build_static_url($path){
        return base_static_url().build_path($path);
    }
}

if ( ! function_exists('numberToRoman'))
{
    function numberToRoman($num){
        // Make sure that we only use the integer portion of the value
        $n = intval($num);
        $result = '';
        // Declare a lookup array that we will use to traverse the number:
        $lookup = array('M' => 1000, 'CM' => 900, 'D' => 500, 'CD' => 400,
                        'C' => 100, 'XC' => 90, 'L' => 50, 'XL' => 40,
                        'X' => 10, 'IX' => 9, 'V' => 5, 'IV' => 4, 'I' => 1);
        foreach ($lookup as $roman => $value){
            // Determine the number of matches
            $matches = intval($n / $value);
            // Store that many characters
            $result .= str_repeat($roman, $matches);
            // Substract that from the number
            $n = $n % $value;
        }
        // The Roman numeral should be built, return it
        return $result;
    }
}
if ( ! function_exists('numberToLetter'))
{
    function numberToLetter($num, $uppercase = FALSE)
    {
        $num -= 1;
        $letter = 	chr(($num % 26) + 97);
        $letter .= 	(floor($num/26) > 0) ? str_repeat($letter, floor($num/26)) : '';
        return 		($uppercase ? strtoupper($letter) : $letter);
    }
}

if ( ! function_exists('mce_fixHtmlStyle'))
{
    function mce_fixHtmlStyle($str)
    {
        return preg_replace('/stxyle=/','style=',$str);
    }
}

if ( ! function_exists('mce_isEmpty'))
{
    function mce_isEmpty($str)
    {
        $tmp = strip_tags($str);
        $tmp = str_replace("&nbsp;", '', $tmp);
        $tmp = trim($tmp);
        return $tmp=='';
    }
}

//captcha verifying function
if ( ! function_exists('rpHash'))
{
    // rpHash Helper function - Perform a 32bit left shift
    function leftShift32($number, $steps) {
        // convert to binary (string)
        $binary = decbin($number);
        // left-pad with 0's if necessary
        $binary = str_pad($binary, 32, "0", STR_PAD_LEFT);
        // left shift manually
        $binary = $binary.str_repeat("0", $steps);
        // get the last 32 bits
        $binary = substr($binary, strlen($binary) - 32);
        // if it's a positive number return it
        // otherwise return the 2's complement
        return ($binary[0] == "0" ? bindec($binary) : -(pow(2, 31) - bindec(substr($binary, 1))));
    }
    // rpHash Helper function - 64 bit
    function rpHash_64bit($value)
    {
        $hash = 5381;
        $value = strtoupper($value);
        for($i = 0; $i < strlen($value); $i++) {
            $hash = (leftShift32($hash, 5) + $hash) + ord(substr($value, $i));
        }
        return $hash;
    }
    // rpHash Helper function - 32 bit
    function rpHash_32bit($value)
    {
        $hash = 5381;
        $value = strtoupper($value);
        for($i = 0; $i < strlen($value); $i++) {
            $hash = (($hash << 5) + $hash) + ord(substr($value, $i));
        }
        return $hash;
    }

    function rpHash($value)
    {
        //64 bit check methods
        //var_dump(is_int( 9223372036854775807 )); //returns true on x64 false on x86
        //or echo (PHP_INT_MAX == 2147483647)?'32-bit':'64-bit';
        //or echo (PHP_INT_SIZE * 8) . '-bit';
        return (PHP_INT_MAX == 2147483647) ? rpHash_32bit($value) : rpHash_64bit($value);
    }
}

if ( ! function_exists('strtr_utf8'))
{
    function strtr_utf8($str, $from, $to) {
        $keys = array();
        $values = array();
        preg_match_all('/./u', $from, $keys);
        preg_match_all('/./u', $to, $values);
        $mapping = array_combine($keys[0], $values[0]);
        return strtr($str, $mapping);
    }
}

if ( ! function_exists('cleanStr'))
{
    function cleanStr($string, $toreplace = '-', $lettersonly = false){
        $string = trim($string);
        $string = strtr_utf8($string,
                "ÀÁÂÃÄÅĂàáâãäåăÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñȘșȚț",
                "aaaaaaaaaaaaaaooooooooooooeeeeeeeecciiiiiiiiuuuuuuuuynnSsTt");
        $string = strtr_utf8($string,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz");
        if (!$lettersonly){
        $string = preg_replace('#([^.a-z0-9]+)#i', $toreplace, $string);
        $string = preg_replace('#-{2,}#','-',$string);
        $string = preg_replace('#-$#','',$string);
        $string = preg_replace('#^-#','',$string);
        }
        return $string;
    }
}

if (! function_exists('validate_uploaded_image')){
    function validate_uploaded_image($extension){
        $supported_image_extensions = array('jpg','jpeg','png');

        return (in_array(strtolower(trim($extension)),$supported_image_extensions));
    }
}

if (! function_exists('in_array_multidim')){
    //IN_ARRAY FOR MULTIDIMESIONAL ARRAYS ISTI
    function in_array_multidim($needle, $haystack, $strict = false) {
        foreach ($haystack as $item) {
            if (($strict ? $item === $needle : $item == $needle) || (is_array($item) && in_array_multidim($needle, $item, $strict))) {
                return true;
            }
        }
        return false;
    }
}

if (! function_exists('cleanPhoneNumber')){
    function cleanPhoneNumber( $phone_number ){
        $phone_number = trim($phone_number);
        $phone_number = str_replace(' ','',$phone_number);
        $phone_number = str_replace('-','',$phone_number);
        $phone_number = str_replace(':','',$phone_number);
        $phone_number = str_replace('/','',$phone_number);
        $phone_number = str_replace('\\','',$phone_number);
        $phone_number = str_replace('_','',$phone_number);
        if ((mb_strlen($phone_number)==13) && (substr($phone_number , 0, 4 )=='0040')){ $phone_number = substr($phone_number , 3); }
        if ((mb_strlen($phone_number)==12) && (substr($phone_number , 0, 3 )=='+40')){ $phone_number = substr($phone_number , 2); }
        $phone_number = str_replace('+','',$phone_number);
        return $phone_number;
    }
}
if (! function_exists('smsReadyPhoneNumber')){
    function smsReadyPhoneNumber( $phone_number ){ //analog function to js smsReadyPhoneNumber
        $phone_number = cleanPhoneNumber($phone_number);
        $check =(preg_match('/^\+?\d+$/', $phone_number) &&
                (in_array(substr($phone_number , 0, 3 ), array("071","072","073","074","075","076","077","078","079"))) &&
                (mb_strlen($phone_number)==10));
        return $check ? $phone_number : '';
    }
}
if (! function_exists('transliterateString')){
    function transliterateString($txt) {
        $transliterationTable = array('á' => 'a', 'Á' => 'A', 'à' => 'a', 'À' => 'A', 'ă' => 'a', 'Ă' => 'A', 'â' => 'a', 'Â' => 'A', 'å' => 'a', 'Å' => 'A', 'ã' => 'a', 'Ã' => 'A', 'ą' => 'a', 'Ą' => 'A', 'ā' => 'a', 'Ā' => 'A', 'ä' => 'ae', 'Ä' => 'AE', 'æ' => 'ae', 'Æ' => 'AE', 'ḃ' => 'b', 'Ḃ' => 'B', 'ć' => 'c', 'Ć' => 'C', 'ĉ' => 'c', 'Ĉ' => 'C', 'č' => 'c', 'Č' => 'C', 'ċ' => 'c', 'Ċ' => 'C', 'ç' => 'c', 'Ç' => 'C', 'ď' => 'd', 'Ď' => 'D', 'ḋ' => 'd', 'Ḋ' => 'D', 'đ' => 'd', 'Đ' => 'D', 'ð' => 'o', 'Ð' => 'Dh', 'é' => 'e', 'É' => 'E', 'è' => 'e', 'È' => 'E', 'ĕ' => 'e', 'Ĕ' => 'E', 'ê' => 'e', 'Ê' => 'E', 'ě' => 'e', 'Ě' => 'E', 'ë' => 'e', 'Ë' => 'E', 'ė' => 'e', 'Ė' => 'E', 'ę' => 'e', 'Ę' => 'E', 'ē' => 'e', 'Ē' => 'E', 'ḟ' => 'f', 'Ḟ' => 'F', 'ƒ' => 'f', 'Ƒ' => 'F', 'ğ' => 'g', 'Ğ' => 'G', 'ĝ' => 'g', 'Ĝ' => 'G', 'ġ' => 'g', 'Ġ' => 'G', 'ģ' => 'g', 'Ģ' => 'G', 'ĥ' => 'h', 'Ĥ' => 'H', 'ħ' => 'h', 'Ħ' => 'H', 'í' => 'i', 'Í' => 'I', 'ì' => 'i', 'Ì' => 'I', 'î' => 'i', 'Î' => 'I', 'ï' => 'i', 'Ï' => 'I', 'ĩ' => 'i', 'Ĩ' => 'I', 'į' => 'i', 'Į' => 'I', 'ī' => 'i', 'Ī' => 'I', 'ĵ' => 'j', 'Ĵ' => 'J', 'ķ' => 'k', 'Ķ' => 'K', 'ĺ' => 'l', 'Ĺ' => 'L', 'ľ' => 'l', 'Ľ' => 'L', 'ļ' => 'l', 'Ļ' => 'L', 'ł' => 'l', 'Ł' => 'L', 'ṁ' => 'm', 'Ṁ' => 'M', 'ń' => 'n', 'Ń' => 'N', 'ň' => 'n', 'Ň' => 'N', 'ñ' => 'n', 'Ñ' => 'N', 'ņ' => 'n', 'Ņ' => 'N', 'ó' => 'o', 'Ó' => 'O', 'ò' => 'o', 'Ò' => 'O', 'ô' => 'o', 'Ô' => 'O', 'ő' => 'o', 'Ő' => 'O', 'õ' => 'o', 'Õ' => 'O', 'ø' => 'oe', 'Ø' => 'OE', 'ō' => 'o', 'Ō' => 'O', 'ơ' => 'o', 'Ơ' => 'O', 'ö' => 'o', 'Ö' => 'O', 'ṗ' => 'p', 'Ṗ' => 'P', 'ŕ' => 'r', 'Ŕ' => 'R', 'ř' => 'r', 'Ř' => 'R', 'ŗ' => 'r', 'Ŗ' => 'R', 'ś' => 's', 'Ś' => 'S', 'ŝ' => 's', 'Ŝ' => 'S', 'š' => 's', 'Š' => 'S', 'ṡ' => 's', 'Ṡ' => 'S', 'ş' => 's', 'Ş' => 'S', 'ș' => 's', 'Ș' => 'S', 'ß' => 'SS', 'ť' => 't', 'Ť' => 'T', 'ṫ' => 't', 'Ṫ' => 'T', 'ţ' => 't', 'Ţ' => 'T', 'ț' => 't', 'Ț' => 'T', 'ŧ' => 't', 'Ŧ' => 'T', 'ú' => 'u', 'Ú' => 'U', 'ù' => 'u', 'Ù' => 'U', 'ŭ' => 'u', 'Ŭ' => 'U', 'û' => 'u', 'Û' => 'U', 'ů' => 'u', 'Ů' => 'U', 'ű' => 'u', 'Ű' => 'U', 'ũ' => 'u', 'Ũ' => 'U', 'ų' => 'u', 'Ų' => 'U', 'ū' => 'u', 'Ū' => 'U', 'ư' => 'u', 'Ư' => 'U', 'ü' => 'u', 'Ü' => 'U', 'ẃ' => 'w', 'Ẃ' => 'W', 'ẁ' => 'w', 'Ẁ' => 'W', 'ŵ' => 'w', 'Ŵ' => 'W', 'ẅ' => 'w', 'Ẅ' => 'W', 'ý' => 'y', 'Ý' => 'Y', 'ỳ' => 'y', 'Ỳ' => 'Y', 'ŷ' => 'y', 'Ŷ' => 'Y', 'ÿ' => 'y', 'Ÿ' => 'Y', 'ź' => 'z', 'Ź' => 'Z', 'ž' => 'z', 'Ž' => 'Z', 'ż' => 'z', 'Ż' => 'Z', 'þ' => 'th', 'Þ' => 'Th', 'µ' => 'u', 'а' => 'a', 'А' => 'a', 'б' => 'b', 'Б' => 'b', 'в' => 'v', 'В' => 'v', 'г' => 'g', 'Г' => 'g', 'д' => 'd', 'Д' => 'd', 'е' => 'e', 'Е' => 'e', 'ё' => 'e', 'Ё' => 'e', 'ж' => 'zh', 'Ж' => 'zh', 'з' => 'z', 'З' => 'z', 'и' => 'i', 'И' => 'i', 'й' => 'j', 'Й' => 'j', 'к' => 'k', 'К' => 'k', 'л' => 'l', 'Л' => 'l', 'м' => 'm', 'М' => 'm', 'н' => 'n', 'Н' => 'n', 'о' => 'o', 'О' => 'o', 'п' => 'p', 'П' => 'p', 'р' => 'r', 'Р' => 'r', 'с' => 's', 'С' => 's', 'т' => 't', 'Т' => 't', 'у' => 'u', 'У' => 'u', 'ф' => 'f', 'Ф' => 'f', 'х' => 'h', 'Х' => 'h', 'ц' => 'c', 'Ц' => 'c', 'ч' => 'ch', 'Ч' => 'ch', 'ш' => 'sh', 'Ш' => 'sh', 'щ' => 'sch', 'Щ' => 'sch', 'ъ' => '', 'Ъ' => '', 'ы' => 'y', 'Ы' => 'y', 'ь' => '', 'Ь' => '', 'э' => 'e', 'Э' => 'e', 'ю' => 'ju', 'Ю' => 'ju', 'я' => 'ja', 'Я' => 'ja');
        $txt = str_replace(array_keys($transliterationTable), array_values($transliterationTable), $txt);
        return $txt;
    }
}

if (! function_exists('utf8_to_gsm0338')){
    //http://stackoverflow.com/questions/27599/reliable-sms-unicode-gsm-encoding-in-php
    function utf8_to_gsm0338( $utf8_string ) {
        $gsm0338 = array(
            '@','Δ',' ','0','¡','P','¿','p',
            '£','_','!','1','A','Q','a','q',
            '$','Φ','"','2','B','R','b','r',
            '¥','Γ','#','3','C','S','c','s',
            'è','Λ','¤','4','D','T','d','t',
            'é','Ω','%','5','E','U','e','u',
            'ù','Π','&','6','F','V','f','v',
            'ì','Ψ','\'','7','G','W','g','w',
            'ò','Σ','(','8','H','X','h','x',
            'Ç','Θ',')','9','I','Y','i','y',
            "\n",'Ξ','*',':','J','Z','j','z',
            'Ø',"\x1B",'+',';','K','Ä','k','ä',
            'ø','Æ',',','<','L','Ö','l','ö',
            "\r",'æ','-','=','M','Ñ','m','ñ',
            'Å','ß','.','>','N','Ü','n','ü',
            'å','É','/','?','O','§','o','à'
        );
        $len = mb_strlen( $utf8_string, 'UTF-8');
        $res = '';
        for( $i=0; $i < $len; $i++){
            $chr = mb_substr($utf8_string,$i,1,'UTF-8');
            if (in_array($chr, $gsm0338)){
                $res=$res.$chr;
            }
        }
        return $res;
    }
}

if (! function_exists('sms_character_counter')){
    //https://www.punchkick.com/blog/2012/08/29/sms-character-counter
    function sms_character_counter( $utf8_string ) {
        $specialchars = array("`",";",":","@","&","=","+","$",",","/","?","%","#","[","]");
        $length = 0;
        $len = mb_strlen( $utf8_string, 'UTF-8');
        for( $i=0; $i < $len; $i++){
            $chr = mb_substr($utf8_string,$i,1,'UTF-8');
            $length += in_array($chr,$specialchars) ? 3:1;
        }
        return $length;
    }
}

if (! function_exists('delTree')){
    function delTree($dir) {
        $files = array_diff(scandir($dir), array('.','..'));
        foreach ($files as $file) {
            (is_dir("$dir/$file")) ? delTree("$dir/$file") : @unlink("$dir/$file");
        }
        return @rmdir($dir);
    }
}

if (! function_exists('getDateMonth')){
    /*
    * $format : 1 = abbr, 2 = full text, 3 = number
    */
    function getDateMonth($date = false, $lang = 1, $format = 1){
        if(!$date){
            $date = strtotime(date('Y-m-d'));
        }

        $month 		= date('m',$date);
        $month_name = '';
        switch((int)$lang){
            case 0:{
                $month_name = date('F',$date);
                $day_name = date('l',$date);
            }break;
            case 1:{
                switch($month){
                    case 1 : $month_name = 'Ianuarie';break;
                    case 2 : $month_name = 'Februarie';break;
                    case 3 : $month_name = 'Martie';break;
                    case 4 : $month_name = 'Aprilie';break;
                    case 5 : $month_name = 'Mai';break;
                    case 6 : $month_name = 'Iunie';break;
                    case 7 : $month_name = 'Iulie';break;
                    case 8 : $month_name = 'August';break;
                    case 9 : $month_name = 'Septembrie';break;
                    case 10 : $month_name = 'Octombrie';break;
                    case 11 : $month_name = 'Noiembrie';break;
                    case 12 : $month_name = 'Decembrie';break;
                }
            } break;
            case 2:{
                switch($month){
                    case 1 : $month_name = 'Január';break;
                    case 2 : $month_name = 'Február';break;
                    case 3 : $month_name = 'Március';break;
                    case 4 : $month_name = 'Április';break;
                    case 5 : $month_name = 'Május';break;
                    case 6 : $month_name = 'Június';break;
                    case 7 : $month_name = 'Július';break;
                    case 8 : $month_name = 'Augusztus';break;
                    case 9 : $month_name = 'Szeptember';break;
                    case 10 : $month_name = 'Október';break;
                    case 11 : $month_name = 'November';break;
                    case 12 : $month_name = 'December';break;
                }
            }break;
            default:{
                switch($month){
                    case 1 : $month_name = 'Ianuarie';break;
                    case 2 : $month_name = 'Februarie';break;
                    case 3 : $month_name = 'Martie';break;
                    case 4 : $month_name = 'Aprilie';break;
                    case 5 : $month_name = 'Mai';break;
                    case 6 : $month_name = 'Iunie';break;
                    case 7 : $month_name = 'Iulie';break;
                    case 8 : $month_name = 'August';break;
                    case 9 : $month_name = 'Septembrie';break;
                    case 10 : $month_name = 'Octombrie';break;
                    case 11 : $month_name = 'Noiembrie';break;
                    case 12 : $month_name = 'Decembrie';break;
                }
            } break;
        }

        $month_formatted = date('m',$date);

        switch($format){
            case 1: $month_formatted = mb_substr($month_name, 0, 3);break;
            case 2: $month_formatted = $month_name;break;
            case 3: $month_formatted = date('m',$date);break;
        }

        return $month_formatted;
    }
}

if (! function_exists('getDateDay')){
    function getDateDay($date = false, $lang = 1, $format = 1){
        if(!$date){
            $date = strtotime(date('Y-m-d'));
        }

        $day		= date('N',$date);
        $day_name	= '';
        switch((int)$lang){
            case 0:{
                $day_name = date('l',$date);
            }break;
            case 1:{
                switch($day){
                    case 1 : $day_name = 'Luni';break;
                    case 2 : $day_name = 'Marți';break;
                    case 3 : $day_name = 'Miercuri';break;
                    case 4 : $day_name = 'Joi';break;
                    case 5 : $day_name = 'Vineri';break;
                    case 6 : $day_name = 'Sâmbătă';break;
                    case 7 : $day_name = 'Duminică';break;
                }
            } break;
            case 2:{
                switch($day){
                    case 1 : $day_name = 'Hétfő';break;
                    case 2 : $day_name = 'Kedd';break;
                    case 3 : $day_name = 'Szerda';break;
                    case 4 : $day_name = 'Csütörtök';break;
                    case 5 : $day_name = 'Péntek';break;
                    case 6 : $day_name = 'Szombat';break;
                    case 7 : $day_name = 'Vasárnap';break;
                }
            }break;
            default:{
                switch($day){
                    case 1 : $day_name = 'Luni';break;
                    case 2 : $day_name = 'Marți';break;
                    case 3 : $day_name = 'Miercuri';break;
                    case 4 : $day_name = 'Joi';break;
                    case 5 : $day_name = 'Vineri';break;
                    case 6 : $day_name = 'Sâmbătă';break;
                    case 7 : $day_name = 'Duminică';break;
                }
            } break;
        }

        $day_formatted = date('l',$date);

        switch($format){
            case 1: $day_formatted = mb_substr($day_name, 0, 3);break;
            case 2: $day_formatted = $day_name;break;
            case 3: $day_formatted = date('l',$date);break;
        }

        return $day_formatted;
    }
}

if (! function_exists('getDateFormat')){
    function getDateFormat( $date = false, $lang = 1, $format = 1, $day = false, $separator = ' '){

        $date = (!$date || strtolower($date) == "now") ? strtotime(date('Y-m-d')) : strtotime($date);

        $month		 	= getDateMonth($date, $lang, $format);
        $day_formatted 	= getDateDay($date, $lang, 2); // always get the full day name
        $date_formatted = date('Y-m-d', $date);

        switch((int)$lang){
            case 0: {
                $date_formatted = ($day) ? $day_formatted.', '.$month.$separator.date('d',$date).$separator.date('Y',$date) : $month.$separator.date('d',$date).$separator.date('Y',$date);
            }break;
            case 1: {
                $date_formatted = ($day) ? $day_formatted.', '.date('j',$date).$separator.$month.$separator.date('Y',$date) : date('j',$date).$separator.$month.$separator.date('Y',$date);
            }break;
            case 2: {
                $date_formatted = ($day) ? date('Y',$date).$separator.$month.$separator.date('j',$date).', '.$day_formatted : date('Y',$date).$separator.$month.$separator.date('j',$date);
            }break;
            default:{
                $date_formatted = ($day) ? $day_formatted.', '.date('j',$date).$separator.$month.$separator.date('Y',$date) : date('j',$date).$separator.$month.$separator.date('Y',$date);
            }break;
        }

        return $date_formatted;
    }
}
/**
* Validate CNP ( valid for 1800-2099 )
*
* @param string $p_cnp
* @return boolean
*/
/*
if (! function_exists('validCNP')){
    function validCNP( $p_cnp ) {
        var i=0 , year=0 , hashResult=0 , cnp=[] , hashTable=[2,7,9,1,4,6,3,5,8,2,7,9];
        var $return 	= true;
        var $toreturn 	= {};
        var gender 		= 1;
        if( p_cnp.length !== 13 ) { $return = false; }
        for( i=0 ; i<13 ; i++ ) {
            cnp[i] = parseInt( p_cnp.charAt(i) , 10 );
            if( isNaN( cnp[i] ) ) { $return = false; }
            if( i < 12 ) { hashResult = hashResult + ( cnp[i] * hashTable[i] ); }
        }
        hashResult = hashResult % 11;
        if( hashResult === 10 ) { hashResult = 1; }
        year = (cnp[1]*10)+cnp[2];
        switch( cnp[0] ) {
            case 1  : case 2 : { year += 1900; } break;
            case 3  : case 4 : { year += 1800; } break;
            case 5  : case 6 : { year += 2000; } break;
            case 7  : case 8 : case 9 : { year += 2000; if( year > ( parseInt( new Date().getYear() , 10 ) - 14 ) ) { year -= 100; } } break;
            default : { $return = false; }
        }
        switch( cnp[0] ) {
            case 1 : case 3 : case 5 : case 7 : { gender = 1; } break;
            case 2 : case 4 : case 6 : case 8 : { gender = 2; } break;
        }
        if( year < 1800 || year > 2099 ) { $return = false; }

        if ($return){
            $return = ( cnp[12] === hashResult );
        }

        if ($return){
            $toreturn.Result 	= "OK";
            $toreturn.Year 		= year + '';
            $toreturn.Month 	= cnp[3] + ''+ cnp[4];
            $toreturn.Day 		= cnp[5] + '' + cnp[6];
            $toreturn.Birthdate = $toreturn.Year + '-' + $toreturn.Month + '-' + $toreturn.Day;
            $toreturn.Gender 	= gender;
        }else{
            $toreturn.Result 	= "ERROR";
        }

        return $toreturn;
    }
}*/


if (! function_exists('replaceFinancialTags')){
    function replaceFinancialTags($text = "", $template = array(), $line_limit=0){
        $text = str_replace("{{PROVIDER}}",lang('tpl_provider', $template), $text);
        $text = str_replace("{{REGCOM}}",lang('tpl_regcom', $template), $text);
        $text = str_replace("{{SOCIAL_CAPITAL}}",lang('tpl_social_capital', $template), $text);
        $text = str_replace("{{CIF}}",lang('tpl_cif', $template), $text);
        $text = str_replace("{{TEL}}",lang('tpl_tel', $template), $text);
        $text = str_replace("{{FAX}}",lang('tpl_fax', $template), $text);
        $text = str_replace("{{EMAIL}}",'email: ', $text);

        $text = str_replace("{{CUSTOMER}}",lang('tpl_client', $template).': ', $text);
        $text = str_replace("{{CNP}}",lang('tpl_cnp', $template).': ', $text);

        //lang('tpl_address');
        if ($line_limit){// get only the first $line_limit lines
            $text = implode(PHP_EOL, array_slice(preg_split("/\\r\\n|\\r|\\n/",$text),0,$line_limit));
        }

        return trim($text);
    }
}

/*create image thumbnail*/
if (! function_exists('generate_thumbnail')){
    function generate_thumbnail($source_image_path, $thumbnail_image_path, $resize='THUMB_SIZE'){
        $resize = $resize ? $resize : 'THUMB_SIZE';
        $source_gd_image = false;
        list($source_image_width, $source_image_height, $source_image_type) = @getimagesize($source_image_path);
        switch ($source_image_type) {
            case IMAGETYPE_GIF:
                $source_gd_image = @imagecreatefromgif($source_image_path);
                break;
            case IMAGETYPE_JPEG:
                $source_gd_image = @imagecreatefromjpeg($source_image_path);
                break;
            case IMAGETYPE_PNG:
                $source_gd_image = @imagecreatefrompng($source_image_path);
                break;
        }
        if (!$source_gd_image){
            return false;
        }
        $width 				= imagesx($source_gd_image);
        $height 			= imagesy($source_gd_image);

        if (is_array($resize)){
            $resize_width  = (isset($resize[0])) ? $resize[0] : THUMBNAIL_IMAGE_MAX_WIDTH;
            $resize_height = (isset($resize[1])) ? $resize[1] : THUMBNAIL_IMAGE_MAX_HEIGHT;
        }else{
            switch ($resize) {
                case 'THUMB_ASPECTRATIO':
                    $resize_width  = THUMBNAIL_IMAGE_MAX_WIDTH;
                    $resize_height = $height*(THUMBNAIL_IMAGE_MAX_WIDTH*100/$width)/100;
                    break;
                case 'THUMB_SIZE':
                    $resize_width  = THUMBNAIL_IMAGE_MAX_WIDTH;
                    $resize_height = THUMBNAIL_IMAGE_MAX_HEIGHT;
                    break;
                default:
                    $resize_width  = THUMBNAIL_IMAGE_MAX_WIDTH;
                    $resize_height = THUMBNAIL_IMAGE_MAX_HEIGHT;
            }
        }
        $original_aspect 	= $width / $height;
        $resize_aspect 		= $resize_width / $resize_height;
        if ( $original_aspect >= $resize_aspect ){
        // If image is wider than thumbnail (in aspect ratio sense)
        $new_height 	= $resize_height;
        $new_width 	= $width / ($height / $resize_height);
        }else{
        // If the thumbnail is wider than the image
        $new_width 	= $resize_width;
        $new_height 	= $height / ($width / $resize_width);
        }
        $thumb = imagecreatetruecolor( $resize_width, $resize_height );
        // Resize and crop
        imagecopyresampled($thumb,
                        $source_gd_image,
                        0 - ($new_width - $resize_width) / 2, // Center the image horizontally
                            0 - ($new_height - $resize_height) / 2, // Center the image vertically
                        0, 0,
                        $new_width, $new_height,
                        $width, $height);
        switch ($source_image_type) {
            case IMAGETYPE_GIF:
                imagegif($thumb, $thumbnail_image_path, 75);
                break;
            case IMAGETYPE_JPEG:
                imagejpeg($thumb, $thumbnail_image_path, 75);
                break;
            case IMAGETYPE_PNG:
                imagepng($thumb, $thumbnail_image_path, 9);
                break;
        }
        return $thumbnail_image_path;
    }
}


/* single point to get image URL*/
if (! function_exists('get_image')){
    function get_image($base_path, $img, $noimg=''){
        $query = 'thumb_';
        if (substr($img, 0, strlen($query))===$query){// if asking for thumbnail
            if (!file_exists($base_path.$img)){//and thumbnail not exists
                $orig_img = str_replace($query,'',$img);
                if ($orig_img && file_exists($base_path.$orig_img)){
                    $resize = ((strpos($base_path,'customer')!==FALSE) && (strpos($base_path,'images')===FALSE)) ? 'THUMB_ASPECTRATIO':'THUMB_SIZE';
                    if (!generate_thumbnail($base_path.$orig_img, $base_path.$img, $resize)){
                        $img = $orig_img;// if cannot generate thumbnail return orig img
                    }
                }
            }
        }
        //return the image
        if (($img) && (file_exists($base_path.$img)) && (!is_dir($base_path.$img)) && getimagesize($base_path.$img)){
            return profile_to_url($base_path).$img;
        } else {
            return (($noimg) ? profile_to_url(FCPATH.$noimg) : '');
        }
    }
}
/*if (! function_exists('get_public_image')){
    function get_public_image($img_url){
        str_replace(base_url(), FCPATH, $img_url);
    }
}*/

/*convert URL to PATH if pdf printing is required*/
if (! function_exists('profile_to_print')){
    function profile_to_print($img_url, $pdf=FALSE){
        //return ($pdf)? str_replace(base_static_url(), FCPATH, $img_url) : $img_url; //CORS PROBLEM
        return ($pdf===true)? str_replace(base_url(), FCPATH, $img_url) : $img_url;
    }
}
/*convert PATH to URL if pdf printing is required*/
if (! function_exists('profile_to_url')){
    function profile_to_url($dir){
        //return str_replace(FCPATH, base_static_url(), $dir); //CORS PROBLEM
        return str_replace(FCPATH, base_url(), $dir);
    }
}

if (! function_exists('fileutils_foldersize')){
    function fileutils_foldersize($path) {
        if (file_exists($path)){
            $total_size = 0;
            $files = scandir($path);
            $cleanPath = rtrim($path, '/').'/';
            foreach($files as $t) {
                if ($t<>"." && $t<>"..") {
                    $currentFile = $cleanPath . $t;
                    if (is_dir($currentFile)) {
                        $size = fileutils_foldersize($currentFile);
                        $total_size += $size;
                    } else {
                        $size = filesize($currentFile);
                        $total_size += $size;
                    }
                }
            }
            return $total_size;
        } else {
            return 0;
        }
    }
}

if (! function_exists('fileutils_formatsize')){
    function fileutils_formatsize($size) {
        $units = explode(' ', 'Byte KB MB GB TB PB');
        $mod = 1024;
        for ($i = 0; $size > $mod; $i++) {
            $size /= $mod;
        }
        if ($size>921){
            $size /= $mod; $i++;
        }

        $endIndex = strpos($size, ".")+3;
        return substr($size, 0, $endIndex).' '.$units[$i];
    }
}

if (! function_exists('str_replace_first')){
    function str_replace_first($search, $replace, $subject) {
        $pos = strpos($subject, $search);
        if ($pos !== false) {
            $subject = substr_replace($subject, $replace, $pos, strlen($search));
        }
        return $subject;
    }
}

if (! function_exists('get_receipt_amount_description')){
    function get_receipt_amount_description($amount = 0, $currency = ' ', $language = 'ro'){
        $CI =& get_instance();
        $number = (int)$amount;
        $CI->load->library('nconv');
        $letters = $CI->nconv->converToText($number,'ro','');
        $whole = (int)floor($amount);      // 1
        $fraction = round(($amount - $whole),5)*100; // .25
        $fraction = (int)$fraction;
        $extra_fraction = ($fraction) ? ' '.$fraction.'/100' : '';
        $number_letter = $letters.$currency.$extra_fraction;
        return $number_letter;
    }
}

if (! function_exists('mb_ucfirst')){
    function mb_ucfirst($string, $encoding){
        $strlen = mb_strlen($string, $encoding);
        $firstChar = mb_substr($string, 0, 1, $encoding);
        $then = mb_substr($string, 1, $strlen - 1, $encoding);
        return mb_strtoupper($firstChar, $encoding) . $then;
    }
}

if (! function_exists('calc_discount')){
    function calc_discount($price, $quantity = 1, $discount = 0, $rround = FALSE){
        $rround = is_numeric($rround) ? intval($rround) : $rround;
        $value = ($price * $quantity) * $discount/100;
        $roundprecision = $rround ? 0 : 2;
        return round($value,$roundprecision,PHP_ROUND_HALF_DOWN);
    }
}

if (! function_exists('calc_price')){
    function calc_price($price, $quantity = 1, $discount = 0, $rround = FALSE){
        $rround = is_numeric($rround) ? intval($rround) : $rround;
        $value = $price * $quantity;
        $value = $value - calc_discount($price, $quantity, $discount, $rround);
        $roundprecision = $rround ? 0 : 2;
        return round($value,$roundprecision);
    }
}

if (! function_exists('calc_vat')){
    function calc_vat_helper($price, $vat=0){
        $res=array();
        $res['value_VAT']   = $price;					 	 //final price
        $res['value_noVAT'] = ($price*100)/(100+$vat); 	 	 //initial value without vat
        $res['vat_value']	= ($price - $res['value_noVAT']);//vat value
        $res['vat_proc']  	= $vat;					 		 //vat procent
        return $res;
    }

    function calc_vat($price, $quantity, $discount=0, $vat=0, $rround=FALSE){
        $res = array();
        $res['unit'] 	 = calc_vat_helper(calc_price($price,1,$discount,$rround), $vat);
        $res['full']	 = calc_vat_helper(calc_price($price,$quantity,$discount,$rround), $vat);
        $res['discount'] = calc_vat_helper(calc_discount($price,$quantity,$discount,$rround), $vat);
        $res['unit_discount'] = calc_vat_helper(calc_discount($price,1,$discount,$rround), $vat);
        return $res;
    }
}

if (! function_exists('get_exchange')){
    function get_exchange($template){
        return (isset($template) && isset($template['exchange']) && $template['exchange']) ? (double)$template['exchange'] : 1;
    }
}
if (! function_exists('apply_exchange')){
    function apply_exchange($price, $template){
        return $price / get_exchange($template);
    }
}

if (! function_exists('trim_seconds')){
    function trim_seconds($str){
        $pos = strrpos( $str, ':');
        return ($pos !== false) ? substr($str, 0, $pos ) : $str;
    }
}

if (! function_exists('build_sorter')){
    function build_sorter($key, $dir) {
        return function ($a, $b) use ($key, $dir) {
            return (strtolower($dir)=='asc' ? 1 : -1) * strnatcmp($a[$key], $b[$key]);
        };
    }
}

if (! function_exists('serializeArray_to_assoc')){
    function serializeArray_to_assoc($array){
        $returnArray = array();
        for ($i=0;$i<sizeof($array);$i++){
            $array_pos = strpos($array[$i]['name'],'[]');
            if ($array_pos){
                $array_assoc_name = substr($array[$i]['name'],0,$array_pos);
                if (!is_array($returnArray[$array_assoc_name])){
                    $returnArray[$array_assoc_name] = array();
                }
                array_push($returnArray[$array_assoc_name],$array[$i]['value']);
            }else{
                $returnArray[$array[$i]['name']] = $array[$i]['value'];
            }
        }
        return $returnArray;
    }
}

if (! function_exists('get_ids_from_assoc')){
    function get_ids_from_assoc($array,$returnImploded=false){
        $returnArray = array();
        foreach($array as $item){
            array_push($returnArray,$item['id']);
        }
        return ($returnImploded)? implode(',',$returnArray) : $returnArray;
    }
}

if (! function_exists('is_in_array')){
    function is_in_array($array, $key, $key_value){
    $within_array = false;
    foreach( $array as $k=>$v ){
        if( is_array($v) ){
            $within_array = is_in_array($v, $key, $key_value);
            if( $within_array == true ){
                break;
            }
        } else {
            if( $v == $key_value && $k == $key ){
                $within_array = true;
                break;
            }
        }
    }
    return $within_array;
    }
}

if (! function_exists('build_billmix_users_or_like')){
    function build_billmix_users_or_like($permitted_users,$field){
        $returnArray = array();
        foreach($permitted_users as $item){
            array_push($returnArray,$field." LIKE '%,".$item['id'].",%'");
        }
        return "(".implode(' OR ',$returnArray).")";
    }
}

if (! function_exists('regexsearch_encode_cookie')){
    function regexsearch_encode_cookie($regexsearch,$llen){
//        $llen = 4;
//        $regexsearch = array('92ad','9f37'); // /^(?=.*92ad)(?=.*9f37).*$/
        //$regexsearch = array('mmmm','nnnn'); // /^(?=.*92ad)(?=.*9f37).*$/
        $firstpart = substr(hash('sha256',hash('sha256',uniqid(rand(),TRUE).microtime(true).rand())),0,64);
        $middle = rand($llen,strlen($firstpart)-$llen);
        $firstpart0 = substr($firstpart, 0, $middle);
        $firstpart1 = substr($firstpart, $middle);
        $toreplace0 = substr($firstpart0,rand(0,strlen($firstpart0)-$llen),$llen);
        $toreplace1 = substr($firstpart1,rand(0,strlen($firstpart1)-$llen),$llen);
        $firstpart0 = str_replace($toreplace0,$regexsearch[0], $firstpart0);
        $firstpart1 = str_replace($toreplace1,$regexsearch[1], $firstpart1);
        return $firstpart0.$firstpart1;
    }
}

if (! function_exists('recursive_keep')){
    function recursive_keep(&$array, $wanted_keys){
        foreach ($array as $key=>&$value) {
            if (is_array($value) && !in_array($key,$wanted_keys,TRUE)) {
                recursive_keep($value, $wanted_keys);
                if (empty($value)){ unset($array[$key]); }
            }else{
                if (!in_array($key,$wanted_keys,TRUE)){
                unset($array[$key]);
                }
            }
        }
    }
}

if (! function_exists('mime2ext')){
    function mime2ext($mime) {
        $mime_map = [
            'video/3gpp2'                                                               => '3g2',
            'video/3gp'                                                                 => '3gp',
            'video/3gpp'                                                                => '3gp',
            'application/x-compressed'                                                  => '7zip',
            'audio/x-acc'                                                               => 'aac',
            'audio/ac3'                                                                 => 'ac3',
            'application/postscript'                                                    => 'ai',
            'audio/x-aiff'                                                              => 'aif',
            'audio/aiff'                                                                => 'aif',
            'audio/x-au'                                                                => 'au',
            'video/x-msvideo'                                                           => 'avi',
            'video/msvideo'                                                             => 'avi',
            'video/avi'                                                                 => 'avi',
            'application/x-troff-msvideo'                                               => 'avi',
            'application/macbinary'                                                     => 'bin',
            'application/mac-binary'                                                    => 'bin',
            'application/x-binary'                                                      => 'bin',
            'application/x-macbinary'                                                   => 'bin',
            'image/bmp'                                                                 => 'bmp',
            'image/x-bmp'                                                               => 'bmp',
            'image/x-bitmap'                                                            => 'bmp',
            'image/x-xbitmap'                                                           => 'bmp',
            'image/x-win-bitmap'                                                        => 'bmp',
            'image/x-windows-bmp'                                                       => 'bmp',
            'image/ms-bmp'                                                              => 'bmp',
            'image/x-ms-bmp'                                                            => 'bmp',
            'application/bmp'                                                           => 'bmp',
            'application/x-bmp'                                                         => 'bmp',
            'application/x-win-bitmap'                                                  => 'bmp',
            'application/cdr'                                                           => 'cdr',
            'application/coreldraw'                                                     => 'cdr',
            'application/x-cdr'                                                         => 'cdr',
            'application/x-coreldraw'                                                   => 'cdr',
            'image/cdr'                                                                 => 'cdr',
            'image/x-cdr'                                                               => 'cdr',
            'zz-application/zz-winassoc-cdr'                                            => 'cdr',
            'application/mac-compactpro'                                                => 'cpt',
            'application/pkix-crl'                                                      => 'crl',
            'application/pkcs-crl'                                                      => 'crl',
            'application/x-x509-ca-cert'                                                => 'crt',
            'application/pkix-cert'                                                     => 'crt',
            'text/css'                                                                  => 'css',
            'text/x-comma-separated-values'                                             => 'csv',
            'text/comma-separated-values'                                               => 'csv',
            'application/vnd.msexcel'                                                   => 'csv',
            'application/x-director'                                                    => 'dcr',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'   => 'docx',
            'application/x-dvi'                                                         => 'dvi',
            'message/rfc822'                                                            => 'eml',
            'application/x-msdownload'                                                  => 'exe',
            'video/x-f4v'                                                               => 'f4v',
            'audio/x-flac'                                                              => 'flac',
            'video/x-flv'                                                               => 'flv',
            'image/gif'                                                                 => 'gif',
            'application/gpg-keys'                                                      => 'gpg',
            'application/x-gtar'                                                        => 'gtar',
            'application/x-gzip'                                                        => 'gzip',
            'application/mac-binhex40'                                                  => 'hqx',
            'application/mac-binhex'                                                    => 'hqx',
            'application/x-binhex40'                                                    => 'hqx',
            'application/x-mac-binhex40'                                                => 'hqx',
            'text/html'                                                                 => 'html',
            'image/x-icon'                                                              => 'ico',
            'image/x-ico'                                                               => 'ico',
            'image/vnd.microsoft.icon'                                                  => 'ico',
            'text/calendar'                                                             => 'ics',
            'application/java-archive'                                                  => 'jar',
            'application/x-java-application'                                            => 'jar',
            'application/x-jar'                                                         => 'jar',
            'image/jp2'                                                                 => 'jp2',
            'video/mj2'                                                                 => 'jp2',
            'image/jpx'                                                                 => 'jp2',
            'image/jpm'                                                                 => 'jp2',
            'image/jpeg'                                                                => 'jpeg',
            'image/pjpeg'                                                               => 'jpeg',
            'application/x-javascript'                                                  => 'js',
            'application/json'                                                          => 'json',
            'text/json'                                                                 => 'json',
            'application/vnd.google-earth.kml+xml'                                      => 'kml',
            'application/vnd.google-earth.kmz'                                          => 'kmz',
            'text/x-log'                                                                => 'log',
            'audio/x-m4a'                                                               => 'm4a',
            'audio/mp4'                                                                 => 'm4a',
            'application/vnd.mpegurl'                                                   => 'm4u',
            'audio/midi'                                                                => 'mid',
            'application/vnd.mif'                                                       => 'mif',
            'video/quicktime'                                                           => 'mov',
            'video/x-sgi-movie'                                                         => 'movie',
            'audio/mpeg'                                                                => 'mp3',
            'audio/mpg'                                                                 => 'mp3',
            'audio/mpeg3'                                                               => 'mp3',
            'audio/mp3'                                                                 => 'mp3',
            'video/mp4'                                                                 => 'mp4',
            'video/mpeg'                                                                => 'mpeg',
            'application/oda'                                                           => 'oda',
            'audio/ogg'                                                                 => 'ogg',
            'video/ogg'                                                                 => 'ogg',
            'application/ogg'                                                           => 'ogg',
            'font/otf'                                                                  => 'otf',
            'application/x-pkcs10'                                                      => 'p10',
            'application/pkcs10'                                                        => 'p10',
            'application/x-pkcs12'                                                      => 'p12',
            'application/x-pkcs7-signature'                                             => 'p7a',
            'application/pkcs7-mime'                                                    => 'p7c',
            'application/x-pkcs7-mime'                                                  => 'p7c',
            'application/x-pkcs7-certreqresp'                                           => 'p7r',
            'application/pkcs7-signature'                                               => 'p7s',
            'application/pdf'                                                           => 'pdf',
            'application/octet-stream'                                                  => 'pdf',
            'application/x-x509-user-cert'                                              => 'pem',
            'application/x-pem-file'                                                    => 'pem',
            'application/pgp'                                                           => 'pgp',
            'application/x-httpd-php'                                                   => 'php',
            'application/php'                                                           => 'php',
            'application/x-php'                                                         => 'php',
            'text/php'                                                                  => 'php',
            'text/x-php'                                                                => 'php',
            'application/x-httpd-php-source'                                            => 'php',
            'image/png'                                                                 => 'png',
            'image/x-png'                                                               => 'png',
            'application/powerpoint'                                                    => 'ppt',
            'application/vnd.ms-powerpoint'                                             => 'ppt',
            'application/vnd.ms-office'                                                 => 'ppt',
            'application/msword'                                                        => 'ppt',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation' => 'pptx',
            'application/x-photoshop'                                                   => 'psd',
            'image/vnd.adobe.photoshop'                                                 => 'psd',
            'audio/x-realaudio'                                                         => 'ra',
            'audio/x-pn-realaudio'                                                      => 'ram',
            'application/x-rar'                                                         => 'rar',
            'application/rar'                                                           => 'rar',
            'application/x-rar-compressed'                                              => 'rar',
            'audio/x-pn-realaudio-plugin'                                               => 'rpm',
            'application/x-pkcs7'                                                       => 'rsa',
            'text/rtf'                                                                  => 'rtf',
            'text/richtext'                                                             => 'rtx',
            'video/vnd.rn-realvideo'                                                    => 'rv',
            'application/x-stuffit'                                                     => 'sit',
            'application/smil'                                                          => 'smil',
            'text/srt'                                                                  => 'srt',
            'image/svg+xml'                                                             => 'svg',
            'application/x-shockwave-flash'                                             => 'swf',
            'application/x-tar'                                                         => 'tar',
            'application/x-gzip-compressed'                                             => 'tgz',
            'image/tiff'                                                                => 'tiff',
            'font/ttf'                                                                  => 'ttf',
            'text/plain'                                                                => 'txt',
            'text/x-vcard'                                                              => 'vcf',
            'application/videolan'                                                      => 'vlc',
            'text/vtt'                                                                  => 'vtt',
            'audio/x-wav'                                                               => 'wav',
            'audio/wave'                                                                => 'wav',
            'audio/wav'                                                                 => 'wav',
            'application/wbxml'                                                         => 'wbxml',
            'video/webm'                                                                => 'webm',
            'image/webp'                                                                => 'webp',
            'audio/x-ms-wma'                                                            => 'wma',
            'application/wmlc'                                                          => 'wmlc',
            'video/x-ms-wmv'                                                            => 'wmv',
            'video/x-ms-asf'                                                            => 'wmv',
            'font/woff'                                                                 => 'woff',
            'font/woff2'                                                                => 'woff2',
            'application/xhtml+xml'                                                     => 'xhtml',
            'application/excel'                                                         => 'xl',
            'application/msexcel'                                                       => 'xls',
            'application/x-msexcel'                                                     => 'xls',
            'application/x-ms-excel'                                                    => 'xls',
            'application/x-excel'                                                       => 'xls',
            'application/x-dos_ms_excel'                                                => 'xls',
            'application/xls'                                                           => 'xls',
            'application/x-xls'                                                         => 'xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'         => 'xlsx',
            'application/vnd.ms-excel'                                                  => 'xlsx',
            'application/xml'                                                           => 'xml',
            'text/xml'                                                                  => 'xml',
            'text/xsl'                                                                  => 'xsl',
            'application/xspf+xml'                                                      => 'xspf',
            'application/x-compress'                                                    => 'z',
            'application/x-zip'                                                         => 'zip',
            'application/zip'                                                           => 'zip',
            'application/x-zip-compressed'                                              => 'zip',
            'application/s-compressed'                                                  => 'zip',
            'multipart/x-zip'                                                           => 'zip',
            'text/x-scriptzsh'                                                          => 'zsh',
        ];
        return isset($mime_map[$mime]) ? $mime_map[$mime] : false;
    }
}

/* End of file misc_helper.php */
/* Location: ./application/helpers/misc_helper.php */