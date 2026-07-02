//declare some GLOBAL VAR & FUNCTIONS
/*var	GLOBAL_LANG = {}; //,JSON_HEX_QUOT | JSON_HEX_TAG*/
var APP = APP || { REVISION: '1.1' };

// eslint-disable-next-line no-console
APP.log = console ? console.log : function(){};//do NOT use for debugging for debugging use console.log instead
APP.AJAX = {};
APP.AJAX._busy = 0;
APP.AJAX.busyStart = function(){APP.AJAX._busy = new Date().getTime();};
APP.AJAX.busyStop = function(){APP.AJAX._busy = 0;};
APP.AJAX.canProceed = function(milisecond){
    if (APP.AJAX._busy===0){
        return true;
    }else{
        var now = new Date().getTime();
        //console.log(now,APP.AJAX._busy,(now - APP.AJAX._busy),milisecond)
        return (now - APP.AJAX._busy) > milisecond;// if lsat ajax call is
    }
};

var langJS = $.noop,
    base_url = $.noop,
    build_url = $.noop,
    get_lang_idx = $.noop,
    get_lang = $.noop;

/*meta manipulation*/
APP.get_meta = function(key){
    return $('meta[name="'+key+'"]').attr("content");
};

APP.toBinary = function(string) {
    const codeUnits = new Uint16Array(string.length);
    for (let i = 0; i < codeUnits.length; i++) {
        codeUnits[i] = string.charCodeAt(i);
    }
    return btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
};

APP.fromBinary = function(encoded) {
    let binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return String.fromCharCode(...new Uint16Array(bytes.buffer));
};

APP.semiS = {};
APP.semiS.k = 'U2FsdGVkX1+LFIo9PEzjE20Emnzu0pveI6DPc3JG3QI=';// will be overwirtten later
APP.semiS.enc = function(msg){
    return CryptoJS.AES.encrypt(msg, APP.semiS.k).toString();
};
APP.semiS.dec = function(enc){
    return CryptoJS.AES.decrypt(enc, APP.semiS.k).toString(CryptoJS.enc.Utf8);
};

APP.localStorage = {};
APP.localStorage.getItem = function(itm, defaultVal, dec){
    dec = (typeof dec !== 'undefined') ? dec : true;
    var res = localStorage.getItem(itm);
    try{
        res = (res!==null) ? (dec ? APP.semiS.dec(res) : res) : defaultVal;
        res = (res) ? res : defaultVal;
    }catch(e){res = defaultVal;}
    return res;
};

APP.localStorage.setItem = function(itm, value, enc){
    enc = (typeof enc !== 'undefined') ? enc : true;
    localStorage.setItem(itm, (enc ? APP.semiS.enc(value.toString()):value));
};

APP.localStorage.removeItem = function(itm){
    localStorage.removeItem(itm);
};

APP.localStorage.cleanUp = function(){// deletes no longer used keys from localstortage
    APP.localStorage.removeItem('3d_width0');
    APP.localStorage.removeItem('3d_width1');
    APP.localStorage.removeItem('3d_width2');
    APP.localStorage.removeItem('rlog');
};
APP.localStorage.cleanUp();

APP.settings = {};
APP.settings.currency = ' EUR';

// NAVIGATE AWAY HANDLING
APP.navAway = {};
APP.navAway.noBackButton = function(){
//https://css-tricks.com/using-the-html5-history-api/
//https://stackoverflow.com/questions/3243684/disable-back-button-in-browser-using-jquery
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function() {
        window.history.pushState(null, "", window.location.href);
    };
    var hash = Math.floor((Math.random()*1000))+'';//0-999
    window.location.hash = hash;
    window.location.hash = hash+'x';//again because google chrome don't insert first hash into history
    window.onhashchange = function(){window.location.hash=hash;};
};
/*APP.navAway.saveMe = function(){// saves the current location, used for naviagation away prevention
    APP.localStorage.setItem('location',window.location,false)
};*/
APP.navAway.onbeforeunload =  function (e) {
//	console.log(e);
    /*var sloc = APP.localStorage.getItem('location','',false);
    var cloc = window.location.toString();
    sloc = sloc.substr(0,sloc.indexOf('#'));
    cloc = cloc.substr(0,cloc.indexOf('#'));
    console.log(sloc+' -----------> '+cloc);
    APP.localStorage.setItem('xxx',sloc+' -----------> '+cloc,false)
    */
    //if (sloc!=cloc){
//	return 'Are u sure you want to leave us ????'
    //};
};
APP.navAway.noBackButton();// call no back button
/*APP.navAway.saveMe();*/
window.onbeforeunload = APP.navAway.onbeforeunload;


// REMOTE LOG FUNCTIONALITY
APP.remoteLOG = {key:'rlog_new', url:'system/remotelog', _timer:false, _oldwindowonerror : window.onerror, };
APP.remoteLOG._clear = function(){
    APP.localStorage.setItem(APP.remoteLOG.key,JSON.stringify([]),true);
};
APP.remoteLOG._doConfirm = function(){
    setTimeout(function() { // make the confirm NON blocking
        // eslint-disable-next-line no-alert
        if (confirm(langJS('global_JSERROR').replace(/<br>/g, "\n"))){
            $('body').html('');
            window.onbeforeunload = null;//prevent navigation away message
            window.location.reload(true);// force to get from the server
        }
    }, 1);
};
APP.remoteLOG._windowonerror_log = function(message, url, line, col, error){// save error to localStorage
    try{
        var skiperror = (message.toLowerCase().indexOf('script error')!=-1) || (message.toLowerCase().indexOf('resizeobserver loop limit exceeded')!=-1);
        if (! skiperror){
            APP.remoteLOG._doConfirm();
        } else {
            message = 'APP_CATCHED_ERROR: '+message;
        }
        APP.remoteLOG.log(message, 1001, url, line, col, JSON.stringify(error));
    }catch(err){
    }
    return false;// keep orig onerror functionality
};
APP.remoteLOG._windowonerror_alert = function(message, url, line, col, error){// save error to localStorage
    APP.remoteLOG._doConfirm();
    return false;// keep orig onerror functionality
};
APP.remoteLOG._strip = function(str){
    str = $('<p></p>').html(str).text();	  // strip all html crap
    str = str.replace(/[^A-Za-z0-9 ._://]/g, ' ');//remove all special chars except letters numbers and spaces
    str = str.replace(/\s\s+/g, ' ');		 //remove multiple whitespaces
    str = str.trim().substring(0,199);		 //get only max 200 char
    return str;
};
APP.remoteLOG.log = function(message, type, url, line, col, err){// save error to localStorage
    message = (typeof message !== 'undefined') ? message : '';
    type = (typeof type !== 'undefined') ? type : -1;
    url  = (typeof url !== 'undefined') ? url : '';
    line = (typeof line !== 'undefined') ? line : '';
    col  = (typeof col !== 'undefined') ? col : '';
    err  = (typeof err !== 'undefined') ? err : '';

    message = APP.remoteLOG._strip(message);
    type    = APP.remoteLOG._strip(type);
    url     = APP.remoteLOG._strip(url);
    line    = APP.remoteLOG._strip(line);
    col     = APP.remoteLOG._strip(col);
    err     = APP.remoteLOG._strip(err);

    var llog = $.parseJSON(APP.localStorage.getItem(APP.remoteLOG.key,'[]',true));
    llog.push({message:message,type:type,url:url,line:line,col:col,err:err,ttime:new Date().getTime()});
    APP.localStorage.setItem(APP.remoteLOG.key,JSON.stringify(llog),true);
};

APP.remoteLOG.send = function(){// sends data to the server
    try{
        var llog = $.parseJSON(APP.localStorage.getItem(APP.remoteLOG.key,'[]',true));
        if (llog.length>0){//sent error if any and clear local storage
            var postData = {};
            var sendlog = llog.slice(0,9);// send only the first 10 error every 10 sec
            postData['data'] = JSON.stringify(sendlog);
            $.ajax({
                'url': base_url()+APP.remoteLOG.url,
                'data': postData,
                'type': 'post',
                'dataType': 'json',
                'global':false,// important so it won't trigger global ajax error
                'success': function(){ APP.remoteLOG._clear();	}
            });
        }
        if (llog.length>10){//clear local storage more than 10 error has been generated and none sent
            APP.remoteLOG._clear();
        }
    }catch (e){
        APP.log('Remote log error!!!');//console log to prevent recursive error generation
    }
};
APP.remoteLOG.start_logging = function(interval){
    APP.remoteLOG.send();//try sending any remaining log
    window.onerror = APP.remoteLOG._windowonerror_log;
    APP.remoteLOG._timer = setInterval(APP.remoteLOG.send,interval);
};
APP.remoteLOG.start_alerting = function(){
    window.onerror = APP.remoteLOG._windowonerror_alert;
};
APP.remoteLOG.stop = function(){
    if (APP.remoteLOG._timer){
        window.clearInterval(APP.remoteLOG._timer);
        APP.remoteLOG._timer=false;
        window.onerror = APP.remoteLOG._oldwindowonerror;
        APP.remoteLOG._clear();
    }
};

APP.utils = {};

APP.utils.form = {};
APP.utils.form.objectifyForm = function(formArray){
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++){
        if (formArray[i]['value']){
            returnArray[formArray[i]['name']] = formArray[i]['value'];
        }
    }
    return returnArray;
};

APP.utils.icons = {};
APP.utils.icons.getAppointmentStatusIcon = function(status){
    var icon;
    switch(parseInt(status,10)){
        case 1: icon = 'far fa-clock'; //waiting
        break;
        case 2: icon = 'far fa-calendar-check';//ended
        break;
        case 3: icon = 'fas fa-times';// missed schedule
        break;
        case 4: icon = 'fas fa-check';//confirmed
        break;
        case 5: icon = 'far fa-calendar-times';//cancelled
        break;
        case 6: icon = 'fas fa-sync';// rescheduled
        break;
        case 7: icon = 'far fa-eye';// in consultation
        break;
        default: icon = 'far fa-calendar';//scheduled
    }
    return icon;
};

APP.utils.icons.getFileIcon = function(filename){
    filename = filename?filename:'';
    let icon = 'far fa-file';
    switch (filename.split('.').pop()) {
        case 'docx':
        case 'doc':
            icon = 'far fa-file-word';
            break;
        case 'pdf':
            icon = 'far fa-file-pdf';
            break;
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            icon = 'far fa-file-image';
            break;
        default: icon = 'far fa-file';
    }
    return icon;
};

APP.utils.text = {};
APP.utils.text.htmlToTxt = function(html, maxlen){
    var $deHtml = $('<div></div>');
    var txt = $deHtml.html(html).text();
    txt = txt ? txt:'';
    txt = txt.replace(/(\r\n|\n|\r)/gm," ").replace(/\s+/g," ");
    txt = (maxlen && (txt.length>maxlen)) ? txt.substring(0,maxlen)+' ...' : txt;
    return txt;
};

//strips the empty lines from a textarea
APP.utils.text.strip_empty_lines = function(str){
    str = str ? str:'';
    return str.replace(/((\r\n|\r|\n)\s*)\2/g, "$2");
};

APP.utils.text.normalize = function(term){
    if ((term) && (term.replace)){
        var val = term.replace(/[ăâáàãäåæ]/gi, "a");
        val = val.replace(/[óöőôò]/gi, "o");
        val = val.replace(/[úüűûù]/gi, "u");
        val = val.replace(/[éêëè]/gi, "e");
        val = val.replace(/[íîìï]/gi, "i");
        val = val.replace(/[şș]/gi, "s");
        val = val.replace(/[ţț]/gi, "t");
        return val;
    } else { return term; }
};

APP.utils.text.generate_random = function(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

APP.utils.text.matchRule = function (str, rule) {
    return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
};

APP.utils.text.buildRule = function (rule) {
    rule = rule.replace(' ','*');
    rule = '*'+rule+'*';
    return APP.utils.text.normalize(rule);
};

APP.utils.text.removeBracketsContent = function(inputtxt) {
    return inputtxt.replace(/{+.*?}+/g, "")
                .replace(/\[+.*?\]+/g, "")
                .replace(/<+.*?>+/g, "")
                .replace(/\(+.*?\)+/g, "")
                .trim();
};
APP.utils.text.nl2br = function(text){
    return text.replace(/(?:\r\n|\r|\n)/g, '<br />');
};

APP.utils.array = {};
APP.utils.array.getArrayKeyValueIndex = function(array,key,value){
    for(var i=0;i<array.length;i++){
        if (array[i][key]==value){
            return i;
        }
    }
    return -1;
};

APP.utils.iframe = {};
APP.utils.iframe.get_iframe_content = function($iframe){
    return $iframe.contents();
};

APP.browser={};
APP.browser._browserDetect = function(){// get browser information - use for only display purposes
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browserName  = navigator.appName;
    var fullVersion  = ''+parseFloat(navigator.appVersion);

    var nameOffset,verOffset,ix;
    // In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
    browserName = "Opera";
    fullVersion = nAgt.substring(verOffset+6);
    if ((verOffset=nAgt.indexOf("Version"))!=-1){
        fullVersion = nAgt.substring(verOffset+8);
    }
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
    browserName = "Microsoft Internet Explorer";
    fullVersion = nAgt.substring(verOffset+5);
    }
    // In Chrome, the true version is after "Chrome"
    else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
    browserName = "Chrome";
    fullVersion = nAgt.substring(verOffset+7);
    }
    // In Safari, the true version is after "Safari" or after "Version"
    else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
    browserName = "Safari";
    fullVersion = nAgt.substring(verOffset+7);
    if ((verOffset=nAgt.indexOf("Version"))!=-1){
    fullVersion = nAgt.substring(verOffset+8);
    }
    }
    // In Firefox, the true version is after "Firefox"
    else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
    browserName = "Firefox";
    fullVersion = nAgt.substring(verOffset+8);
    }
    // In most other browsers, "name/version" is at the end of userAgent
    else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
            (verOffset=nAgt.lastIndexOf('/')) )
    {
    browserName = nAgt.substring(nameOffset,verOffset);
    fullVersion = nAgt.substring(verOffset+1);
    if (browserName.toLowerCase()==browserName.toUpperCase()) {
    browserName = navigator.appName;
    }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix=fullVersion.indexOf(";"))!=-1){
    fullVersion=fullVersion.substring(0,ix);
    }
    if ((ix=fullVersion.indexOf(" "))!=-1){
    fullVersion=fullVersion.substring(0,ix);
    }

    // prepare result
    var res = {};
    res.nVer = nVer;
    res.nAgt = nAgt;
    res.browserName  = browserName;
    res.fullVersion  = fullVersion;
    return res;
};
APP.browser._acrobatReaderDetect = function(){// detects the installed acrobat reader
    // http://thecodeabode.blogspot.com
    // @author: Ben Kitzelman 2013
    //the returned object is:
    var browser_info = {
        name: null,
        acrobat : null,
        acrobat_ver : null
    };
    if(navigator && (navigator.userAgent.toLowerCase()).indexOf("chrome") > -1){ browser_info.name = "chrome";}
    else if(navigator && (navigator.userAgent.toLowerCase()).indexOf("msie") > -1){ browser_info.name = "ie";}
    else if(navigator && (navigator.userAgent.toLowerCase()).indexOf("firefox") > -1){ browser_info.name = "firefox";}
    else { browser_info.name = "other";}
    //console.log(PDFJS)
    //console.log(navigator.mimeTypes["application/pdf"].enabledPlugin);
    try {
        // IE
        if(browser_info.name == "ie") {
            var control = null;
            // load the activeX control
            try {
                // AcroPDF.PDF is used by version 7 and later
                control = new ActiveXObject('AcroPDF.PDF');
            } catch (e){}
            if (!control){
                try {
                    // PDF.PdfCtrl is used by version 6 and earlier
                    control = new ActiveXObject('PDF.PdfCtrl');
                }catch (e) {}
            }
            if(!control) {
                browser_info.acrobat = null;
                return browser_info;
            }
            var version = control.GetVersions().split(',');
            version = version[0].split('=');
            browser_info.acrobat = "installed";
            browser_info.acrobat_ver = parseFloat(version[1]);

        // Chrome
        } else if(browser_info.name == "chrome") {
            for(var key in navigator.plugins) {
                if(navigator.plugins[key].name == "Chrome PDF Viewer" || navigator.plugins[key].name == "Adobe Acrobat") {
                    browser_info.acrobat = "installed";
                    browser_info.acrobat_ver = parseInt(navigator.plugins[key].version,10) || "Chome PDF Viewer";
                }
            }
        }
        // NS3+, Opera3+, IE5+ Mac, Safari (support plugin array):  check for Acrobat plugin in plugin array
        else if(navigator.plugins !== null) {
            var acrobat = navigator.plugins['Adobe Acrobat'];
            if(acrobat === null) {
                browser_info.acrobat = null;
                return browser_info;
            }
            browser_info.acrobat = "installed";
            browser_info.acrobat_ver = parseInt(acrobat.version[0],10);
        }
    }catch(e){
        browser_info.acrobat_ver = null;
    }
    return browser_info;
};

APP.browser.browserInfo = APP.browser._browserDetect();// make the browser detection and store info
APP.browser.acrobatReaderInfo = APP.browser._acrobatReaderDetect();// make the acrobat detection and store info

APP.browser.uagentToIcon = function (uagent){
    uagent = uagent.toLowerCase();
    var ret;
    if (uagent.indexOf('msie')>-1 || uagent.indexOf('trident')>-1) { ret = 'fab fa-internet-explorer'; }
    else if (uagent.indexOf('edge')>-1) { ret = 'fab fa-edge'; }
    else if (uagent.indexOf('chrome')>-1) { ret = 'fab fa-chrome'; }
    else if (uagent.indexOf('opera')>-1 || uagent.indexOf('opera mini')>-1) { ret = 'fab fa-opera'; }
    else if (uagent.indexOf('safari')>-1) { ret = 'fab fa-safari'; }
    else if (uagent.indexOf('firefox')>-1) { ret = 'fab fa-firefox'; }
    else { ret = 'fas fa-question-circle'; }
    return ret;
};


APP.jTable = {};

APP.jTable.createButton = function(params){
    params = params || {};
    params.icon = params.icon || '';
    params.classes = params.classes || '';
    params.attr = params.attr || [];
    params.text = params.text ? '<span>'+params.text+'</span>' : "";
    var $btn = $('<button type="button" class="rbtn '+params.classes+'"><i class="'+params.icon+'" />'+params.text+'</button>');
    if (params.id){ $btn.attr('id',params.id); }
    if (params.title){ $btn.attr('title',params.title); }
    if (typeof(params.attr)=='object'){
        for(var i=0;i<params.attr.length;i++){
            $btn.attr(params.attr[i].name,params.attr[i].value);
        }
    }
    /*if (params.alticon){
        $btn.on('click.toggle', function(){
            var $fa = $('.fa',$btn);
            if ($fa.hasClass(params.icon)){
                $fa.removeClass(params.icon);
                $fa.addClass(params.alticon);
            }else{
                $fa.removeClass(params.alticon);
                $fa.addClass(params.icon);
            }
        });
    }*/
    return $btn;
};

APP.jTable.renderOrderingArrows = function(theTable, data, ordLink){
    // Render arrows
    var btnClick = function(){
        crud_jsupdate(ordLink, {id : $(this).data('id'), direction : $(this).data('direction')},function(retData){
            theTable.jtable('reload');
        });
    };
    var data_length = data.records.length;
    var last_page 	= data.serverResponse.last_page;
    var page 		= data.serverResponse.page;
    if (data_length > 1 || (data_length == 1 && page > 1)){
        for(var i=0;i<data_length;i++){
            var rec_id = data.records[i].id;
            var $btn_container = $('.ordering_arrows[rec_id="'+rec_id+'"]', theTable);
            if ($btn_container.length==1){
                var $uparrow   = APP.jTable.createButton({icon:'fas fa-arrow-up',classes:'rbtn-blue order'});
                $uparrow.data('direction','up').data('id',rec_id);
                $uparrow.on('click', btnClick);
                var $downarrow = APP.jTable.createButton({icon:'fas fa-arrow-down',classes:'rbtn-blue order'});
                $downarrow.data('direction','down').data('id',rec_id);
                $downarrow.on('click', btnClick);
                if (page == 1 && i === 0){ $btn_container.append($downarrow); }	else{
                if (last_page == 1 && i == data_length - 1){
                    $btn_container.append($uparrow);
                } else {
                    $btn_container.append($uparrow).append($downarrow);
                }}
            }else{console.warn('APP: ordering_arrows container NOT FOUND!');}
        }
    }
    //END Rendering arrows
};

APP.jTable.dlgFieldsToggle = function(visible, fields_array){
    for (var i = 0, l=fields_array.length; i < l; i++) {
        fields_array[i].toggle(visible);
        if (fields_array[i].parent().parent().hasClass('jtable-input-field-container')){
            fields_array[i].parent().parent().toggle(visible);
        }
    }
};
APP.jTable.dlgFieldsEnabled = function(enabled, fields_array){
    for (var i = 0, l=fields_array.length; i < l; i++) {
        if (fields_array[i].hasClass('select2-offscreen')){//if it's select2'
            fields_array[i].select2('enable',enabled);
        }else{
            fields_array[i].prop('disabled',!enabled);
        }
    }
};

APP.toRefractor = {};

APP.emailSyntaxCheckRegex = function(email) {
    var regex = /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
};

APP.validate = {};

APP.validate.validPASS = function(pass){
    var forbidden = ['121212','123123','12345','123456','1234567','12345678','123456789','1234567890','131313','1qaz2wsx',
    '654321','696969','987654','987654321','abc123','abcd1234','access','admin','adobe123','affair',
    'akarmi','amanda','andrew','anthony','asdfasdf','asdfg','asdfgh','asdfghjkl','ashley','ashleymadison',
    'asshole','asszony','azerty','baseball','batman','bigdick','bine ai venit','buster','charlie','cheater',
    'cica','computer','corvette','cowboys','dallas','default','dragon','engedj be','engedjbe','football',
    'freedom','fuckme','fuckoff','fuckyou','george','harley','hello','hockey','horny','hosts','hunter',
    'iloveyou','jackson','jelszo','jennifer','jessica','jordan','jordan23','kazuga','killer','letmein',
    'liverpool','lofasz','login','looking','madison','maggie','master','matthew','michael','money','monkey','mustang',
    'nevem','par0la','parola','passw0rd','password','password1','pepper','photoshop','princess','printesa',
    'pussy','qazwsx','qazwsx','qazxsw','qwert','qwerty','qwerty123','qwerty1234','qwerty12345','qwerty123456',
    'qwertyuiop','qwertz','qwertz123','qwertz1234','qwertz12345','qwertz123456','qwertzuiop','ranger','robert',
    'secret','shadow','soccer','starwars','steelers','summer','sunshine','superman','thomas','tigger','trustno1','valami',
    'welkome','welcome','wellcome','whatever','william','yankees','zaqwsx','zaqxsw','zxcvb','zxcvbn','zxcvbnm'];
    pass = pass.toLowerCase();
    return ((forbidden.indexOf(pass)==-1) && (!((/^(.)\1+$/).test(pass)))); // check if passw is forbidden or all same char
};

APP.validate.validCNP = function(p_cnp){
    var hashResult=0 , cnp=[] , hashTable=[2,7,9,1,4,6,3,5,8,2,7,9];
    var $return = true, $toreturn = {}; var gender = 1;
    if( p_cnp.length !== 13 ) { $return = false; }
    for( var i=0 ; i<13 ; i++ ) {
        cnp[i] = parseInt( p_cnp.charAt(i) , 10 );
        if( isNaN( cnp[i] ) ) { $return = false; }
        if( i < 12 ) { hashResult = hashResult + ( cnp[i] * hashTable[i] ); }
    }
    hashResult = hashResult % 11;
    if( hashResult === 10 ) { hashResult = 1; }
    var year = (cnp[1]*10)+cnp[2];
    switch( cnp[0] ) {
        case 1  : case 2 :  year += 1900; break;
        case 3  : case 4 :  year += 1800; break;
        case 5  : case 6 :  year += 2000; break;
        //case 7  : case 8 : case 9 : year += 2000; if( year > ( parseInt( new Date().getFullYear() , 10 ) - 14 ) ) { year -= 100; } break;
        case 7  : case 8 : case 9 : year += 2000; if( year > ( parseInt( new Date().getFullYear() , 10 ) - 0 ) ) { year -= 100; } break;
        default : { $return = false; }
    }
    switch( cnp[0] ) {
        case 1 : case 3 : case 5 : case 7 : gender = 1; break;
        case 2 : case 4 : case 6 : case 8 : gender = 2; break;
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
};

APP.validate.smsReadyPhoneNumber = function(phone_number){  //analog function to php smsReadyPhoneNumber
    phone_number = phone_number || '';
    phone_number = phone_number.trim()
                .split(' ').join('')
                .split('-').join('')
                .split(':').join('')
                .split('/').join('')
                .split('\\').join('')
                .split('_').join('');
    if ((phone_number.length==13) && (phone_number.substring( 0, 4 )=='0040')){ phone_number = phone_number.substring(3); }
    if ((phone_number.length==12) && (phone_number.substring( 0, 3 )=='+40')){ phone_number = phone_number.substring(2); }
    phone_number = phone_number.split('+').join('');
    var check = (phone_number.match(/^\+?\d+$/) &&
            (["071","072","073","074","075","076","077","078","079"].indexOf(phone_number.substring( 0, 3 ))!=-1) &&
            (phone_number.length==10));
    return check ? phone_number : '';
};

APP.validate.validateEmail = function(email){
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

APP.images = {};

APP.images.upload_dialog_html = function(){
    return '<div id="image_upload_dialog" class="hidden">'+
        '<div class="uploaded_img"></div>'+
        '<form id="upload_image_form" method="post">'+
        '</form>'+
    '</div>';
};

APP.images.upload_image = function(imageid, img, enable_measuring, okCallback, cancelCallback){
    if (typeof okCallback != 'function'){okCallback = function(i){};}
    if (typeof cancelCallback != 'function'){cancelCallback = function(i){};}
    if (imageid == 'undefined' || !imageid){imageid=null;}
    if (img == 'undefined' || !img){img='';}
    if (enable_measuring == 'undefined'){enable_measuring=true;}
    var $container 	= $("<div></div>").html(APP.images.upload_dialog_html());
    $('body').append($container);
    var $upload_dialog = $('#image_upload_dialog');
    var $form = $container.find('form');
    APP.images.init_dimg_upload($('.uploaded_img'), img, enable_measuring, function(file){
    });
    $upload_dialog.data("id", imageid);
    $upload_dialog.dialog({
        autoOpen: false,
        modal: true,
        minHeight: 650,
        width: 650,
        resizable:false,
        title:langJS('global_upload'),
        buttons: {
            "ok":{
                text: langJS('global_ok'),
                'class': "button-blue save-image-button",
                click: function() {
                    var newupload 	= $('.uploaded_img').data('newupload');
                    if (!(newupload || $('.uploaded_img').data('oldimage'))){
                        $form.validationEngine('showPrompt', langJS('global_user_image_change_no_image'), 'error', 'topLeft', true);
                        return;
                    }
                    if ($form.validationEngine('validate')){
                        var serialdata = $form.serializeArray();
                        serialdata.push({name:'newupload', value:newupload});
                        serialdata.push({name:'id', value:$upload_dialog.data("id")});
                        
                        crud_jsupdate('Jobs/save_uploaded_image',serialdata,function(data){
                            okCallback(data);
                            $upload_dialog.dialog("close");
                        },function (data){});
                    }
                }
            },
            "cancel":{
                text: langJS('global_cancel'),
                class: "button-orange",
                click: function() {
                    cancelCallback({});
                    $upload_dialog.dialog("close");
                }
            }
        },
        create: function(){
            $form.validationEngine(validation_defaults());
        },
        open: function(){
            resetForm($form);
            $('.save-image-button').prop('disabled', ($upload_dialog.data("id")) ? true : false);
            //this setTimeout fixes the tmce error
            setTimeout(function(){
                if ($upload_dialog.data("id")){
                    crud_jsupdate('Jobs/get_image', {id: $upload_dialog.data("id")}, function(data){
                        $('.save-image-button').prop('disabled', false);
                    });
                }
            },100);
        },
        close: function(){
            $('.uploaded_img').data('oldimage','');
            $('.uploaded_img').data('newupload','');
            $upload_dialog.data("id",'');
            $form.validationEngine("hideAll");
            $form.validationEngine("detach");
            if ($('.uploaded_img').data('newupload')){
                crud_jsupdate('Jobs/clean_uploaded_image',{imagefile:$('.uploaded_img').data('newupload')});
            }
            resetForm($form);
            $(this).dialog("destroy").remove();
        }
    });
    $upload_dialog.dialog('open');
};

APP.images.upload_tool_image = function(imageid, img, enable_measuring, okCallback, cancelCallback){
    if (typeof okCallback != 'function'){okCallback = function(i){};}
    if (typeof cancelCallback != 'function'){cancelCallback = function(i){};}
    if (imageid == 'undefined' || !imageid){imageid=null;}
    if (img == 'undefined' || !img){img='';}
    if (enable_measuring == 'undefined'){enable_measuring=true;}
    var $container 	= $("<div></div>").html(APP.images.upload_dialog_html());
    $('body').append($container);
    var $upload_dialog = $('#image_upload_dialog');
    var $form = $container.find('form');
    APP.images.init_dimg_upload($('.uploaded_img'), img, enable_measuring, function(file){
    });
    $upload_dialog.data("id", imageid);
    $upload_dialog.dialog({
        autoOpen: false,
        modal: true,
        minHeight: 650,
        width: 650,
        resizable:false,
        title:langJS('global_upload'),
        buttons: {
            "ok":{
                text: langJS('global_ok'),
                'class': "button-blue save-image-button",
                click: function() {
                    var newupload 	= $('.uploaded_img').data('newupload');
                    if (!(newupload || $('.uploaded_img').data('oldimage'))){
                        $form.validationEngine('showPrompt', langJS('global_user_image_change_no_image'), 'error', 'topLeft', true);
                        return;
                    }
                    if ($form.validationEngine('validate')){
                        var serialdata = $form.serializeArray();
                        serialdata.push({name:'newupload', value:newupload});
                        serialdata.push({name:'id', value:$upload_dialog.data("id")});
                        
                        crud_jsupdate('Tool_settings/save_uploaded_image',serialdata,function(data){
                            okCallback(data);
                            $upload_dialog.dialog("close");
                        },function (data){});
                    }
                }
            },
            "cancel":{
                text: langJS('global_cancel'),
                class: "button-orange",
                click: function() {
                    cancelCallback({});
                    $upload_dialog.dialog("close");
                }
            }
        },
        create: function(){
            $form.validationEngine(validation_defaults());
        },
        open: function(){
            resetForm($form);
            $('.save-image-button').prop('disabled', ($upload_dialog.data("id")) ? true : false);
            //this setTimeout fixes the tmce error
            setTimeout(function(){
                if ($upload_dialog.data("id")){
                    crud_jsupdate('Tool_settings/get_image', {id: $upload_dialog.data("id")}, function(data){
                        $('.save-image-button').prop('disabled', false);
                    });
                }
            },100);
        },
        close: function(){
            $('.uploaded_img').data('oldimage','');
            $('.uploaded_img').data('newupload','');
            $upload_dialog.data("id",'');
            $form.validationEngine("hideAll");
            $form.validationEngine("detach");
            if ($('.uploaded_img').data('newupload')){
                crud_jsupdate('Tool_settings/clean_uploaded_image',{imagefile:$('.uploaded_img').data('newupload')});
            }
            resetForm($form);
            $(this).dialog("destroy").remove();
        }
    });
    $upload_dialog.dialog('open');
};

APP.images.init_dimg_upload = function($container, img, enable_measuring, callback){
    if (typeof callback != 'function'){callback = function(f){};}
    if (typeof img == 'undefined' || !img){img = '';}
    if (typeof enable_measuring == 'undefined'){enable_measuring = true;}
    $container.dimg({
        uploader_url:build_url('index.php/uploadr/Upload/upload_img'),
        postData: { },
        width: 600,
        height: 600,
        messages: APP.dimg.messages(),
        enable_measure:enable_measuring,
        enable_camera: false,
        enable_scanner: false,
        enable_upload: true,
        enable_crop:true,
        enable_clear:true,
        enable_doupload:true,
        onUpload: function(uploadedFile, uploader, file, object, succeeded){
            // the save will be done at dialog close
            if ($container.data('newupload')){
                crud_jsupdate('Jobs/clean_uploaded_image',{imagefile:$container.data('newupload')});
            }
            $container.data('newupload',uploadedFile.name);
            succeeded(true);
            callback(file);
        },
        onClear:function(succeeded){
            $container.data('newupload','');
            succeeded(true);
        },
    });
    if (img){//editing image
        $container.dimg('loadImage',img);
        $container.data('oldimage', img);
        $container.data('newupload','');
    }else{//new image
        $container.data('oldimage', '');
        $container.data('newupload', '');
    }
};

APP.images.init_dimg_intern_upload = function($container, img, enable_measuring, callback){
    if (typeof callback != 'function'){callback = function(f){};}
    if (typeof img == 'undefined' || !img){img = '';}
    if (typeof enable_measuring == 'undefined'){enable_measuring = true;}
    $container.dimg({
        uploader_url:build_url('index.php/uploadr/Upload/upload_img'),
        postData: { },
        messages: APP.dimg.messages(),
        enable_measure:enable_measuring,
        enable_camera: false,
        enable_scanner: false,
        enable_upload: true,
        enable_crop:true,
        enable_clear:true,
        enable_doupload:true,
        onUpload: function(uploadedFile, uploader, file, object, succeeded){
            // the save will be done at dialog close
            if ($container.data('newupload')){
                crud_jsupdate('Jobs/clean_uploaded_image',{imagefile:$container.data('newupload')});
            }
            $container.data('newupload',uploadedFile.name);
            succeeded(true);
            callback(file);
        },
        onClear:function(succeeded){
            $container.data('newupload','');
            succeeded(true);
        },
    });
    if (img){//editing image
        $container.dimg('loadImage',img);
        $container.data('oldimage', img);
        $container.data('newupload','');
    }else{//new image
        $container.data('oldimage', '');
        $container.data('newupload', '');
    }
};

APP.fileDownload = function(uri,data,preparingMessage,failMessage, successCallback, errorCallback){
    data = (typeof data !== 'undefined') ? data : {};
    successCallback = successCallback?successCallback:$.noop;
    errorCallback = errorCallback?errorCallback:$.noop;
    preparingMessage = (typeof preparingMessage !== 'undefined') ? preparingMessage : langJS('global_down_prepare');
    failMessage = (typeof failMessage !== 'undefined') ? failMessage : langJS('global_down_fail');
    $.fileDownload(uri, {
        httpMethod:'GET',//android works only on GET - modified fileDownload to use allways POST for browser to avoid FALSE chrome iframe sandboxing !!!!!
        data:$.extend(true, {}, data, {'HTTP_DENT_DOWNLOAD':''}),
        preparingMessageHtml: preparingMessage,
        failMessageHtml: failMessage,
        successCallback: successCallback,
        failCallback: errorCallback,
        dialogOptions: {
            modal: true,
            title:langJS('global_download'),
            resizable: false,
            width: 400 ,
            //height: 500,
            close: function( event, ui ) {
                $(this).dialog('destroy').remove();//destroy and remove created dialogs
            }
        }
    });
};

APP.paramDialog = function(id, cjtable, record){
        if(record.quantity<=0){
            APP.showMessage(langJS('global_warning'), langJS('global_stock_out'), langJS('global_ok'));
        }else{
            var html =  '<div id="param_dialog"><form id="out_form">'+
                '<div class="dent-input-container w100-proc" style="text-align: center;">'+
                    '<div class="dent-input" style="display:inline-block; width:40%;">'+
                        '<button type="button" class="button_plus rbtn rbtn-sizevariable rbtn-blue" style="height:35px; width:35px; font-size:25px;">+</button>&nbsp;<input type="text" id="quantity" name="quantity" value="1" readonly style="display:inlin-block; width:40%; text-align:center; font-size: 25px; height: 35px; vertical-align: top;" />&nbsp;<button type="button" class="button_minus rbtn rbtn-sizevariable rbtn-blue" style="height:35px; width:35px; font-size:25px;">-</button><br/><br/>'+
                        '<button type="button" class="button_out rbtn rbtn-sizevariable rbtn-red rbtn-highlight" style="height:35px; font-size:25px;">'+langJS('global_out')+'</button>'+
                    '</div>'+
                    '<div class="dent-input-container w100-proc">'+
                        '<label for="comment" style="text-align:left;">Komment (Projekt - Darab ID):</label>'+
                        '<div class="dent-input">'+
                            '<textarea id="comment" name="comment" class="validate[required] height-y-45 resize-y-300"></textarea>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
                '</form>'+
            '</div>';
            var $container 	= $("<div></div>").html(html);
            $('body').append($container);
            var $dialog = $container.dialog({
                title: langJS('global_params'),
                resizable: false,
                width:420,
                minHeight: 450,
                modal: true,
                autoOpen:false,
                buttons: [
                    {
                        text:langJS('global_close'),class: "button-blue",click: function(){
                            $dialog.dialog("close");
                        }
                    },
                ],
                create: function(ev, ui){
                    let $quantity = $container.find('#quantity');
                    APP.get_custom_data($container, record.categ_id, id, record, true);
                    $container.find('.button_plus').on('click',function(){
                        let val = parseInt($quantity.val());
                        if((record.standard_part?(val+1):val)<parseInt(record.quantity)){
                            $quantity.val(val+1);
                        }
                    });
                    $container.find('.button_minus').on('click',function(){
                        let val = parseInt($quantity.val());
                        if(val>1){
                            $quantity.val(val-1);
                        }
                    });
                    $container.find('.button_out').on('click',function(){
                        if ($container.find('#out_form').validationEngine('validate')){
                            crud_jsupdate('Tool_stock_categ/update_tool_stock_quantity',{id: id, quantity:$container.find('#quantity').val(), comment: $container.find('#comment').val()}, function(retData){
                                cjtable.jtable('reload');
                                $dialog.dialog("close");
                                APP.showMessageBtn(langJS('global_success'), sprintf(langJS('global_tool_out_message'), record.location), langJS('global_took_out'), $.noop, undefined, 'font-size: 18px;');
                            });
                        }
                    });
                    $container.find('#out_form').validationEngine(validation_defaults({}));
                },
                open: function(ev, ui){
                    /*$container.find('#quantity').dspinner({
                        suffix: '',
                        step: 1,
                        places:0,
                        increment: 'fast',
                        allowNull: false,
                        min:1,
                        max:10000
                    });
                    */
                },
                close: function(){
                    $(this).dialog("destroy").remove();
                },
            });

            if(record.standard_part==1){
                /*APP.showMessageBtn(langJS('global_warning'), sprintf(langJS('global_put_message'), record.location), langJS('global_put_back'), function(){
                    crud_jsupdate('Tool_stock_categ/update_tool_stock_broken',{id: id}, function(retData){
                        $dialog.dialog('open');
                    });
                }, undefined, 'font-size: 18px;', 'background: #ffcb6c;');
                */
                APP.showDlg(langJS('global_warning'), sprintf(langJS('global_put_message'), record.location), langJS('global_put_back'), langJS('global_not_broken'), 
                    function(){
                        crud_jsupdate('Tool_stock_categ/update_tool_stock_broken',{id: id}, function(retData){
                            $dialog.dialog('open');
                        });
                    },
                    function(){
                        $dialog.dialog('open');
                    },
                    undefined, 'font-size: 18px;', 'background: #ffcb6c;'
                );
            }else{
                $dialog.dialog('open');
            }
        }
};

APP.paramDialogIn = function(id, cjtable, record){
        var html =  '<div id="param_dialog">'+
            '<div class="dent-input-container w100-proc" style="text-align: center;">'+
                '<div class="dent-input" style="display:inline-block; width:100%;">'+
                    '<button type="button" class="button_plus rbtn rbtn-sizevariable rbtn-blue" style="height:35px; width:35px; font-size:25px;">+</button>&nbsp;<input type="text" id="quantity" name="quantity" value="1" readonly style="display:inlin-block; width:20%; text-align:center; font-size: 25px; height: 35px; vertical-align: top;" />&nbsp;<button type="button" class="button_minus rbtn rbtn-sizevariable rbtn-blue" style="height:35px; width:35px; font-size:25px;">-</button><br/><br/>'+
                    '<button type="button" class="button_in rbtn rbtn-sizevariable rbtn-green rbtn-highlight" style="height:75px; font-size:25px; white-space: normal; width:40%">'+langJS('global_tool_in')+'</button>&nbsp;&nbsp;'+
                    '<button type="button" class="button_in_broken rbtn rbtn-sizevariable rbtn-red rbtn-highlight" style="height:75px; font-size:25px; white-space: normal; width:57%">'+langJS('global_broken_tool_in')+'</button>'+
                '</div>'+
            '</div>'+
        '</div>';
        var $container 	= $("<div></div>").html(html);
        $('body').append($container);
        var $dialog = $container.dialog({
            title: langJS('global_params'),
            resizable: false,
            width:420,
            minHeight: 520,
            modal: true,
            autoOpen:true,
            buttons: [
                {
                    text:langJS('global_close'),class: "button-blue",click: function(){
                        $dialog.dialog("close");
                    }
                },
            ],
            create: function(ev, ui){
                let $quantity = $container.find('#quantity');
                APP.get_custom_data($container, record.categ_id, record.stock_id, record, true);
                $container.find('.button_plus').on('click',function(){
                    let val = parseInt($quantity.val());
                    if(val<parseInt(record.quantity)){
                        $quantity.val(val+1);
                    }
                });
                $container.find('.button_minus').on('click',function(){
                    let val = parseInt($quantity.val());
                    if(val>1){
                        $quantity.val(val-1);
                    }
                });
                $container.find('.button_in').on('click',function(){
                    APP.showMessageBtn(langJS('global_warning'), sprintf(langJS('global_put_message_in'), record.location), langJS('global_put_back'), function(){
                        crud_jsupdate('Tool_stock_categ/update_tool_stock_quantity_in',{id: record.stock_id, quantity:$container.find('#quantity').val(), log_id: id}, function(retData){
                            cjtable.jtable('reload');
                            $dialog.dialog("close");
                        });
                    }, undefined, 'font-size: 18px;');
                });
                $container.find('.button_in_broken').on('click',function(){
                    APP.showMessageBtn(langJS('global_warning'), sprintf(langJS('global_put_message'), record.location), langJS('global_put_back'), function(){
                        crud_jsupdate('Tool_stock_categ/update_tool_stock_broken_in',{id: record.stock_id, quantity:$container.find('#quantity').val(), log_id: id}, function(retData){
                            cjtable.jtable('reload');
                            $dialog.dialog("close");
                        });
                    }, undefined, 'font-size: 18px;', 'background: #ffcb6c;');
                });
            },
            open: function(ev, ui){
                /*$container.find('#quantity').dspinner({
                    suffix: '',
                    step: 1,
                    places:0,
                    increment: 'fast',
                    allowNull: false,
                    min:1,
                    max:10000
                });
                */
            },
            close: function(){
                $(this).dialog("destroy").remove();
            },
        });
};

APP.qcDialog = function(id, callback){
            var html =  '<div id="qc_dialog"><form id="qc_form">'+
                    '<div class="dent-input-container w100-proc">'+
                        '<div class="dent-input">'+
                            '<label for="qc_type"></label>'+
                            '<input name="qc_type" id="qc_type" class="select2-done w100-proc validate[required]" value="1" />'+
                        '</div>'+
                    '</div>'+
                    '<div class="dent-input-container w100-proc hidden">'+
                        '<label for="qc_comment" style="text-align:left;">'+langJS('global_comment')+':</label>'+
                        '<div class="dent-input">'+
                            '<textarea id="qc_comment" name="qc_comment" class="validate[required] height-y-45 resize-y-300"></textarea>'+
                        '</div>'+
                    '</div>'+
                '</form>'+
            '</div>';
            var $container 	= $("<div></div>").html(html);
            $('body').append($container);
            var $dialog = $container.dialog({
                title: langJS('global_has_errors'),
                resizable: false,
                width:420,
                minHeight: 450,
                modal: true,
                autoOpen:false,
                buttons: [
                    {
                        text:langJS('global_ok'),class: "button-blue",click: function(){
                            if ($container.find('#qc_form').validationEngine('validate')){
                                crud_jsupdate('Jobs/update_jobs',{id: id, qc_type:$container.find('#qc_type').val(), qc_comment: $container.find('#qc_comment').val()}, function(retData){
                                    callback();
                                    $dialog.dialog("close");
                                });
                            }
                        }
                    },
                ],
                create: function(ev, ui){
                    $container.find('#qc_type').select2(APP.select2.select2_options_ajax('Jobs/sel2_qc_types',{
                        allowClear: true,
                        cacheKEY:'sel2.qc_types',
                    })).on('change', function(ev){
                        if($(this).val()==1){
                            $('#qc_comment').parent().parent().hide();
                        }else{
                            $('#qc_comment').parent().parent().show();
                        }
                    });
                    $container.find('#qc_form').validationEngine(validation_defaults({}));
                },
                open: function(ev, ui){
                },
                close: function(){
                    $(this).dialog("destroy").remove();
                },
            });

            $dialog.dialog('open');
};

APP.lateDialog = function(id, callback){
            var html =  '<div id="late_dialog"><form id="late_form">'+
                    '<div class="dent-input-container w100-proc">'+
                        '<label for="late_comment" style="text-align:left;">'+langJS('global_comment')+':</label>'+
                        '<div class="dent-input">'+
                            '<textarea id="late_comment" name="late_comment" class="validate[required] height-y-70 resize-y-300"></textarea>'+
                        '</div>'+
                    '</div>'+
                '</form>'+
            '</div>';
            var $container 	= $("<div></div>").html(html);
            $('body').append($container);
            var $dialog = $container.dialog({
                title: langJS('global_is_late'),
                resizable: false,
                width:420,
                modal: true,
                autoOpen:false,
                buttons: [
                    {
                        text:langJS('global_yes'),class: "button-blue",click: function(){
                            if ($container.find('#late_form').validationEngine('validate')){
                                crud_jsupdate('Jobs/update_jobs',{id: id, late:1, late_comment: $container.find('#late_comment').val()}, function(retData){
                                    callback();
                                    $dialog.dialog("close");
                                });
                            }
                        }
                    },
                    {
                        text:langJS('global_no'),
                        'class': "button-orange",
                        click: function() {
                            callback();
                            $dialog.dialog("close");
                        }
                    }
                ],
                create: function(ev, ui){
                    $container.find('#late_form').validationEngine(validation_defaults({}));
                },
                open: function(ev, ui){
                },
                close: function(){
                    $(this).dialog("destroy").remove();
                },
            });

            $dialog.dialog('open');
};

APP.get_custom_data = function($container, categ_id, stock_id='', record=null, readonly=false) {
    if(!readonly){
        $container.html('');
    }
    var main_p = '<div class="dent-input-container w100-proc main_param_div">'+
                    '<label for="main_param">'+langJS('global_main_param')+':</label>'+
                    '<div class="dent-input">'+
                        '<input type="text" id="main_param" name="main_param" class="" '+(readonly?'readonly':'')+' value="'+(record?(record.main_param?record.main_param:''):'')+'"/>'+
                    '</div>'+
                '</div>';
    /*if(stock_id==''){
        var $title_div = $('<h2 class="title_param" style="color: #3B81CD;font-size: 15px;">'+langJS('global_params')+'</h2>');
        $container.append($title_div);
    }*/
    $container.append(main_p);
    params = {'categ_id': categ_id, 'stock_id': stock_id};            
    crud_jsupdate('Tool_stock/getCustomData', params,
        function(data) {
            if (data.Records.length>0) {
                $.each(data.Records, function(index, value) {
                    var $cust_elem = null;
                    var c_class = '';
                    var i_class = '';
                    switch (value.type) {
                        case '1':
                        case '3':
                            c_class = 'w100-proc';
                            i_class = 'text custom_field validate[required]';
                            break;
                        case '2':
                            c_class = 'w100-proc';
                            i_class = 'select sel2-100 select2-done custom_field validate[required]';
                            break;
                        case '4':
                            c_class = 'w100-proc';
                            i_class = 'number custom_field validate[required]';
                            break;
                        
                    }
                    if(!value.value){
                        value.value = '';
                    }
                    $cust_elem = $('<div class="dent-input-container '+c_class+'">'+
                        '<div class="jtable-input-label">'+value.name+'</div>'+
                        '<div class="dent-input">'+
                            '<input type="text" id="cust_'+value.typeid+'" name="cust_'+value.typeid+'" class="editable '+i_class+'" maxlength="250" value="'+value.value+'" style="'+((value.unit && value.type!=4)?"width:85%;":"")+'" '+(readonly?'readonly':'')+' /> '+((value.unit && value.type!=4)?value.unit:"")+
                        '</div>'+
                    '</div>');
                    $cust_elem.find('input.editable').data('data',value);
                    $container.append($cust_elem);
                    if(value.type==2){
                        var op_arr = value.type_values.split(/\r\n|\n\r|\n|\r/);
                        var data = $.map(op_arr, function (obj) {
                            return {id: obj, name: obj};
                        });
                        $('#cust_'+value.typeid).select2(APP.select2.select2_options({
                            allowClear: true,
                            data: data,
                        }));
                    }
                    if(value.type==4){
                        $cust_elem.find('input.editable').dspinner({
                            suffix: (value.unit?' '+value.unit:''),
                            step: 1,
                            places:2,
                            increment: 'fast',
                            allowNull: false,
                            min:0,
                            max:10000
                        });
                    }
                });
            }
        }
    );
};

/*exported head_init */
var head_init = function(params){

    var GLOBAL_LANG = params.GLOBAL_LANG;
    var GLOBAL_CONST = params.GLOBAL_CONST;
    langJS = function(key){
        if (GLOBAL_LANG[key]){ return GLOBAL_LANG[key];}
        else{ return "Can't translate "+key;}
    };
    constJS = function(key){
        if (typeof GLOBAL_CONST[key] !== 'undefined'){
            return GLOBAL_CONST[key];
        }else{
            APP.log('APP - Constant "'+key+'" is not defined!');
            return '';
        }
    };

    base_url = function(){
        return params.base_url;//"<?= base_url();?>";  !!!!!!!!!!!!!!!!!!!!!!!
    };
    build_url = function(path){
        return base_url()+path;
    };
    get_lang_idx = function(){
        var res = parseInt(constJS('LANG_IDX'),10);// "<?= $this->multilang->get_lang_idx();?>");
        return isNaN(res)? 0 : res;
    };
    get_lang = function(){
        return params.lang_abr;//"<?=$this->multilang->get_abr()?>";
    };

    //date and time localization
    if ($.datepicker){
        $.datepicker.setDefaults($.datepicker.regional[get_lang()]);
    }
    if ($.timepicker){
        $.timepicker.setDefaults($.timepicker.regional[get_lang()]);
    }
    
};