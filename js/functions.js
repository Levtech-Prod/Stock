// an EMPTY function used for dummy callbacks
function nullFunction(){} //same as $.noop

// MODULE management functions
//**********************************************************************************
// GENERIC functions
//**********************************************************************************
function content_load(page, params = {}){
    if(page=="Board"){
        $("#main").css("display", "inline-block");
    }else{
        $("#main").css("display", "block");
    }
    crud_jsupdate('Check_login',{},function(rd){
        if(rd.loggedin==1){
            $('#workarea-wait').show();
            $('#workarea-middle').load(page, params, function(){
                $('#workarea-wait').hide();
            });
        }else{
            window.location.reload(true);
        }
    });
}

function sprintf(format, etc) {
    var arg=arguments, i=1;
    return format.replace(/%((%)|s)/g, function (m) { return m[2] || arg[i++]; });
}

function jq( myid ) {
    return "#" + myid.replace( /(:|\.|\[|\]|,|!|=|@)/g, "\\$1" );
}

function jqc( myclass ) {
    return myclass.replace( /(:|\.|\[|\]|,|!|=|@)/g, "\\$1" );
}

function selectedtext(val){
    if (val){ return 'selected="selected"';}
    else{ return '';}
}

function checkedtext(val){
    if (val){ return 'checked="checked"';}
    else{ return '';}
}

function array_to_options(array){
    var res = [];
    var item;
    for (var i = 0; i < array.length; i++) { // DO NOT USE .each BECAUSE chrome associative array resorting problem
        item = array[i];
        //margit's new invention, checkboxes with input fields...
        var cut_pos = item.indexOf(';;;');
        if (cut_pos>0){
            item = item.substring(0,item.indexOf(';;;'));
        }
        res.push({'Value':((i==0&&item=='')?'':i),'DisplayText':item});
    }
    return res;
}

function str_to_options(str){
    var res = [];
    str = APP.utils.text.strip_empty_lines(str.trim()).trim();
    if (str!=''){
        res = array_to_options(str.split(/\n/));
    }
    res.unshift({'Value':'','DisplayText':''});
    return res;
}

jQuery.fn.set_options =  function(value,options,exclude_values,callback){
    exclude_values = (exclude_values) ? exclude_values : [];
    var $select = this;
    if (!value){ value='';}
    $select.empty();
    $select.val('');
    var opts = [];
    for (var i = 0; i < options.length; i++) { // DO NOT USE .each BECAUSE chrome associative array resorting problem
        var propName = options[i].DisplayText;
        var propValue = options[i].Value;
        var propId = Math.floor(+new Date() / 1000) + propValue;
        if ($.inArray(propValue, exclude_values) == -1){
            opts.push('<option id="'+ propId +'" value="' + propValue + '"' + (propValue.toString() == value.toString() ? ' selected="selected"' : '') + '>' + propName + '</option>');
        }
    }
    $select.append(opts.join(''));
    $select.trigger('change');
    if (typeof(callback) == 'function'){
        callback($select, options);
    }
    return this;//to preseve chainability
};

jQuery.fn.load_options = function(url, value, exclude_values, callback){
//	it works when one element is selected
/*  for (var i = 0; i < this.length; i++) {
        console.log(this[i].nodeName.toLowerCase()=== 'select');
    }*/
    var $select = this;
    value = (value) ? value : $select.val();
    exclude_values = (exclude_values) ? exclude_values : [];
    if (url){
        // the async form
        download_options(url, function(options){
            $select.set_options(value, options, exclude_values, callback);
        });
    }else{
        $select.set_options('', []);
    }
    return this;//to preseve chainability
};

function date_format_js(){
    return langJS('date_format_js');
}
function date_format_php(){
    return langJS('date_format_php');
}
function date_format_js_db(){
    return langJS('date_format_js_db');
}
function date_format_php_db(){
    return langJS('date_format_php_db');
}
function currency_strip(val){
    val = (typeof(val) == 'undefined' || val===null) ? '' : val;
    return parseFloat(val.toString().replace(new RegExp(APP.settings.currency, "ig"), ""));
}
function currency_format(val, curr){
    curr = (typeof(curr) == 'undefined') ? '' : curr;
    var x = currency_strip(val);
    if (isNaN(x)){ return '';}
    else{ return x.toFixed(2)+(curr ? ' '+curr.trim() : APP.settings.currency);}
}

function percent_format(val, twofixed){
    twofixed = (typeof(twofixed) == 'undefined') ? 2 : 0;
    var x = parseFloat(val);
    if (isNaN(x)){ return '0 %';}
    else{ return x.toFixed(twofixed)+' %';}
}
// CRUD support functions
//**********************************************************************************

// return true in the error callback to prevent the error message dialog
function crud_jsupdate(update_url, postData, success_callback, error_callback){
    postData = typeof postData !== 'undefined' ? postData : {};

    success_callback = typeof success_callback !== 'undefined' ? success_callback : nullFunction;
    error_callback = typeof error_callback !== 'undefined' ? error_callback : nullFunction;

    $.post(update_url,postData,function(data){
        if (data){
            if (data.Result != 'OK') {
                if (!error_callback(data)) {
                    APP.showMessage(langJS('global_error'),data.Message);
                }
            } else {
                success_callback(data);
            }
        }
    },'json').fail(function(){
        error_callback();
        APP.showMessage(langJS('global_error'), langJS('global_err_connection'), 'OK', function(){
            window.location.reload();
        });
    });
}

//match if two dates are the same
function matchDates(date1, date2){
    var date 	= date1.getDate();
    var month 	= date1.getMonth() + 1; //Months are zero based
    var year 	= date1.getFullYear();
    var date1_str = date + "-" + month + "-" + year;

    date 	= date2.getDate();
    month 	= date2.getMonth() + 1; //Months are zero based
    year 	= date2.getFullYear();
    var date2_str = date + "-" + month + "-" + year;

    if (date1_str == date2_str){
        return true;
    }else{
        return false;
    }
}

/*
* Interval has to be an array of objects made of date_from and date_to
* ex: [object,object] => object.date_from, object.date_to
* returns TRUE if date IS in interval
*/
function checkDateInInterval( date, interval){
    var check = false;
    if (interval){
        for(var i=0;i<interval.length; i++){
            if( date >= interval[i].date_from && date <= interval[i].date_to){
                check = true;
                break;
            }
        }
    }
    return check;
}

function resetForm($form) {
    $form.find('input:text, input:password, input:file, select, textarea').val('');
    $form.find('.forceReset').val('');
    $form.find('input:radio, input:checkbox')
        .prop('checked',false).prop('selected',false);
}

function jtable_load_template($html_container){
    var key = ($html_container.attr('id')) ? $html_container.attr('id') : 'dummy_html';

    if (!$html_container.data(key)){
        $html_container.data(key,$.trim($html_container.html()));
        $html_container.html('');
    }
    return $html_container.data(key);
}

function jTableDateToString(dateString){
    if (dateString.indexOf('Date') >= 0) { //Format: /Date(1320259705710)/
        var date=new Date(parseInt(dateString.substr(6),10));
        return $.datepicker.formatDate(date_format_js(), date);
    }else{
        return dateString;
    }
}

var isMouseOverDiv = function(event, target){
    var ofs = target.offset();
    var x1 = ofs.left;
    var x2 = ofs.left + target.outerWidth(true);
    var y1 = ofs.top;
    var y2 = ofs.top + target.outerHeight(true);
    return (event && (event.pageX >= x1 && event.pageX<= x2 && event.pageY>= y1 && event.pageY <= y2));
};

APP.showMessage = function(title, message, btntext, closeCallback, icon){
    title = ((typeof title !== 'undefined') && title) ? title : '';
    message = ((typeof message !== 'undefined') && message) ? message : '';
    btntext = ((typeof btntext !== 'undefined') && btntext) ? btntext : 'OK';
    closeCallback = (typeof closeCallback !== 'undefined')? closeCallback : $.noop;
    icon = (typeof icon !== 'undefined')? icon : 'fas fa-exclamation-triangle';
    var $container = $("<div></div>").html('<p><i class="'+icon+'" style="margin:0 5px 0 0; font-size:2em; color:#3B81CD; vertical-align:middle;"></i><label style="display:inline;">'+message+'</label></p>');
    var tmp_z = '99';
    $('body').append($container);
    $container.dialog({
        title:title,
        modal: true,
        resizable: false,
        width:function(){ return (message.length<=50) ? 400 : 700; },
        buttons: [{
                    text:btntext,
                    'class': "button-orange",
                    click: function() {
                        $(this).dialog( "close" );
                    }
                }],
        close: function() {
            closeCallback();
            $('.ui-widget-overlay').css('z-index',tmp_z);
            $(this).dialog('destroy').remove();
        },
        open: function (event, ui) {
            $(event.target).closest('.ui-dialog').css("z-index", 9001);
            tmp_z = $('.ui-widget-overlay').css('z-index');
            $('.ui-widget-overlay').css('z-index',9000);
        },
    });
    return $container;
};

APP.showMessageBtn = function(title, message, btntext, closeCallback, icon, style, c_style){
    title = ((typeof title !== 'undefined') && title) ? title : '';
    message = ((typeof message !== 'undefined') && message) ? message : '';
    btntext = ((typeof btntext !== 'undefined') && btntext) ? btntext : 'OK';
    closeCallback = (typeof closeCallback !== 'undefined')? closeCallback : $.noop;
    icon = (typeof icon !== 'undefined')? icon : 'fas fa-exclamation-triangle';
    var $container = $("<div style=\""+c_style+"\"></div>").html('<p><i class="'+icon+'" style="margin:0 5px 0 0; font-size:2em; color:#3B81CD; vertical-align:middle;"></i><label style="display:inline; '+style+'">'+message+'</label></p>');
    var tmp_z = '99';
    $('body').append($container);
    $container.dialog({
        title:title,
        modal: true,
        resizable: false,
        width:function(){ return (message.length<=50) ? 400 : 700; },
        buttons: [{
                    text:btntext,
                    'class': "button-orange",
                    click: function() {
                        closeCallback();
                        $(this).dialog( "close" );
                    }
                }],
        close: function() {
            $('.ui-widget-overlay').css('z-index',tmp_z);
            $(this).dialog('destroy').remove();
        },
        open: function (event, ui) {
            $(event.target).closest('.ui-dialog').css("z-index", 9001);
            tmp_z = $('.ui-widget-overlay').css('z-index');
            $('.ui-widget-overlay').css('z-index',9000);
        },
    });
    return $container;
};

APP.showDlg = function(title, message, yepp_btntext, nope_btntext, yeppCallback, nopeCallback, icon, style, c_style){
    title = ((typeof title !== 'undefined') && title) ? title : '';
    message = ((typeof message !== 'undefined') && message) ? message : '';
    yepp_btntext = ((typeof yepp_btntext !== 'undefined') && yepp_btntext) ? yepp_btntext : 'Yes';
    nope_btntext = ((typeof nope_btntext !== 'undefined') && nope_btntext) ? nope_btntext : 'No';
    yeppCallback = (typeof yeppCallback !== 'undefined')? yeppCallback : $.noop;
    nopeCallback = (typeof nopeCallback !== 'undefined')? nopeCallback : $.noop;
    icon = (typeof icon !== 'undefined')? icon : 'fa fa-question-circle';
    var $container = $("<div style=\""+c_style+"\"></div>").html('<p><i class="'+icon+'" style="color:#3B81CD;font-size:2em;position:absolute;"></i><label style="padding-left:2.5em;line-height:2em; '+style+'">'+message+'</label></p>');
    var tmp_z = '99';
    $('body').append($container);
    $container.dialog({
        title:title,
        modal: true,
        resizable: false,
        width:function(){ return (message.length<=50) ? 400 : 700; },
        buttons: [{
                    'text':yepp_btntext,
                    'class': "button-blue",
                    'click': function() {
                        yeppCallback();
                        $(this).dialog( "close" );
                    }
                },{
                    'text':nope_btntext,
                    'class': "button-orange",
                    'click': function() {
                        nopeCallback();
                        $(this).dialog( "close" );
                    }
                }],
        close: function() {
            $('.ui-widget-overlay').css('z-index',tmp_z);
            $(this).dialog('destroy').remove();
        },
        create: function(){
            $container.find('select.select2').each(function(){
                $(this).select2(APP.select2.select2_options());
            });
        },
        open: function (event, ui) {
            $(event.target).closest('.ui-dialog').css("z-index", 9001);
            tmp_z = $('.ui-widget-overlay').css('z-index');
            $('.ui-widget-overlay').css('z-index',9000);
        },
    });
};

APP.showDlgChoose = function(title, message, yepp_btntext, maybe_btntext, nope_btntext, yeppCallback, maybeCallback, nopeCallback, icon){
    title = ((typeof title !== 'undefined') && title) ? title : '';
    message = ((typeof message !== 'undefined') && message) ? message : '';
    yepp_btntext = ((typeof yepp_btntext !== 'undefined') && yepp_btntext) ? yepp_btntext : 'Yes';
    maybe_btntext = ((typeof maybe_btntext !== 'undefined') && maybe_btntext) ? maybe_btntext : 'Maybe';
    nope_btntext = ((typeof nope_btntext !== 'undefined') && nope_btntext) ? nope_btntext : 'No';
    yeppCallback = (typeof yeppCallback !== 'undefined')? yeppCallback : $.noop;
    maybeCallback = (typeof maybeCallback !== 'undefined')? maybeCallback : $.noop;
    nopeCallback = (typeof nopeCallback !== 'undefined')? nopeCallback : $.noop;
    icon = (typeof icon !== 'undefined')? icon : 'fa fa-question-circle';
    var $container = $("<div></div>").html('<p><i class="'+icon+'" style="margin:0 5px 0 0; color:#3B81CD; font-size:2em; vertical-align:middle;"></i><label>'+message+'</label></p>');
    var tmp_z = '99';
    $('body').append($container);
    $container.dialog({
        title:title,
        modal: true,
        resizable: false,
        width:function(){ return (message.length<=50) ? 400 : 700; },
        buttons: [{
                    'text':yepp_btntext,
                    'class': "button-blue",
                    'click': function() {
                        if (!(yeppCallback()===false)){
                            $(this).dialog( "close" );
                        }
                    }
                },{
                    'text':maybe_btntext,
                    'class': "button-green",
                    'click': function() {
                        if (!(maybeCallback()===false)){
                            $(this).dialog( "close" );
                        }
                    }
                },{
                    'text':nope_btntext,
                    'class': "button-orange",
                    'click': function() {
                        if (!(nopeCallback()===false)){
                            $(this).dialog( "close" );
                        }
                    }
                }],
        close: function() {
            $('.ui-widget-overlay').css('z-index',tmp_z);
            $(this).dialog('destroy').remove();
        },
        open: function (event, ui) {
            $(event.target).closest('.ui-dialog').css("z-index", 9001);
            tmp_z = $('.ui-widget-overlay').css('z-index');
            $('.ui-widget-overlay').css('z-index',9000);
        },
    });
};


/*************************************************************
predifined text support
**************************************************************/
APP.predefinedtext = {};

APP.predefinedtext.$savedObject=null;

APP.predefinedtext.getSavedText = function(){
    return APP.predefinedtext.$savedObject ? APP.predefinedtext.$savedObject.val():'';
};


/*************************************************************
colPick

**************************************************************/
APP.colpick = {};
APP.colpick.colpick_options = function(overwrite){
    var res = {
        layout:'hex',
        submit:false,
        colorScheme:'light',
    };
    $.extend(true,res,overwrite);
    return res;
};
APP.colpick.set_elem_color = function($el){
    if ($el.val()){
        var color = '#'+$el.val().replace('#','');
        var contrast = APP.utils.color.getColorContrastYIQ(color);
        $el.css('border-color','#aaa').css('background-color',color).css('color',contrast);
    }
};

/*************************************************************
SELECT2
**************************************************************/
APP.select2 = {};
// select2 formatResult formatSelection functions
APP.select2.formatResult = function(record) {
    if (record.length!='undefined' && record.length===0){
        return '';
    }else{
    return record.name || record.title || record.text || record.value || record.Value || record.id || 'define formatResult';
    }

};
APP.select2.formatSelection = function(record) {
    if (record.length!='undefined' &&  record.length===0){
        return '';// it is possibe the selected value is no longer avaiable
    }else{
        return record.name || record.title || record.text || record.value || record.Value || record.id || 'define formatSelection';
    }
};

APP.select2.formatResult_Default = function(record) {
    return record.name;
};
APP.select2.formatSelection_Default = function(record) {
    return record.name;
};
APP.select2.formatResult_DefaultVal = function(record) {
    return record.value;
};
APP.select2.formatSelection_DefaultVal = function(record) {
    return record.value;
};
//default select 2 options
APP.select2.select2_options = function(overwrite){
    var match = function(term, text) {
        return APP.utils.text.normalize(text).toUpperCase().indexOf(APP.utils.text.normalize(term).toUpperCase()) >= 0;
    };
    // the default escapeMarkup is too restrictive so relax a little
    var escapeMarkup = function (markup) {
            if (markup && typeof(markup) === "string") {
                return markup.replace(/&/g, "&amp;");
            }
            return markup;
    };
    var res_lng, res = {
        matcher: match,
        escapeMarkup: escapeMarkup,
        formatSelection:APP.select2.formatSelection,
        formatResult:APP.select2.formatResult,
    };
    switch (get_lang_idx()) {
        case 1 :res_lng = {
                    formatNoMatches:function(term){	return sprintf(langJS('global_nosearchresult'),term); },
                    formatInputTooShort: function (input, min) { var n = min - input.length; return "Introduceți incă " + n + " caracter" + (n == 1 ? "" : "e"); },
                    formatInputTooLong: function (input, max) { var n = input.length - max; return "Introduceți mai puțin de " + n + " caracter" + (n == 1? "" : "e"); },
                    formatSelectionTooBig: function (limit) { return "Aveți voie să selectați cel mult " + limit + " element" + (limit == 1 ? "" : "e"); },
                    formatLoadMore: function (pageNumber) { return "Încărcare date..."; },
                    formatSearching:function(){	return 'Căutare date...'; },
                    placeholder: "Selectează...",
                };
                break;
        case 2 :res_lng = {
                    formatNoMatches:function(term){	return sprintf(langJS('global_nosearchresult'),term); },
                    formatInputTooShort: function (input, min) { var n = min - input.length; return "Túl rövid. Még " + n + " karakter hiányzik."; },
                    formatInputTooLong: function (input, max) { var n = input.length - max; return "Túl hosszú. " + n + " kerekterrel több mint kellene."; },
                    formatSelectionTooBig: function (limit) { return "Csak " + limit + " elemet lehet kiválasztani."; },
                    formatLoadMore: function (pageNumber) { return "Az adatok töltődnek..."; },
                    formatSearching:function(){	return 'Keresés folyamatban ...'; },
                    placeholder: "Keress...",
                };
                break;
        default:res_lng = {
                    formatNoMatches:function(term){	return sprintf(langJS('global_nosearchresult'),term); },
                    formatInputTooShort: function (input, min) { var n = min - input.length; return "Please enter " + n + " more character" + (n == 1 ? "" : "s"); },
                    formatInputTooLong: function (input, max) { var n = input.length - max; return "Please enter " + n + " less character" + (n == 1? "" : "s"); },
                    formatSelectionTooBig: function (limit) { return "You can only select " + limit + " item" + (limit == 1 ? "" : "s"); },
                    formatLoadMore: function (pageNumber) { return "Loading more results..."; },
                    formatSearching: function () { return "Searching..."; },
                    placeholder: "Search...",
                };
    }
    $.extend(res,res_lng);
    $.extend(res,overwrite);
    return res;
};

APP.dimg = {};
APP.dimg.messages = function(overwrite){
    var res;
    switch (get_lang_idx()) {
        case 1:res = {
                    camera:    'Cameră',
                    scanner:   'Scanner',
                    loadfile:  'Încărcare imagine...',
                    takephoto: 'Fotografiază',
                    doscan:    'Scanează...',
                    docrop:    'Decupare imagine',
                    measure:   'Măsurare',
                    measure_ref:'Referință',
                    measure_dist:'Distanță',
                    upload:    'Încărcare',
                    clear:	   'Ștergere',
                    cancel:    'Anulează',
                    back:      'Înapoi',
                    drag_here: 'Faceți clic sau trageți aici un fișier de imagine pentru a încărca',
                    scan_with_ui: 'Scanează prin interfața scannerului',
                    scan_without_ui: 'Scanează rapid fără interfața scannerului',
                    GUI_folder_resize:'Decupare redimensionare și rotire',
                    GUI_crop:   'Decupare',
                    GUI_resize: 'Dimensionare',
                    GUI_rotate: 'Rotire',
                    GUI_folder_tools:'Instrumente de imagine',
                    GUI_brightness:	'Strălucire',
                    GUI_contrast:	'Contrast',
                    GUI_saturation:	'Saturație',
                    GUI_vibrance:	'Vibrance',
                    GUI_exposure:	'Expunere',
                    GUI_hue:		'Nuanță',
                    GUI_sepia:		'Sepia',
                    GUI_invert:		'Imagine invertit',
                    GUI_greyscale:	'Nuanțe de gri ',
                    GUI_reset:  	'Restabilire',
                    GUI_open:		'Închide',
                    GUI_close:		'Deschide',
                    MSG_access_camera: 'Vă rugăm să permiteți accesul la camera foto prin a răspunde la mesajul din partea de sus a ferestrei browser-ul!',
                    MSG_no_camera: 'Nu a fost detectat nici o camera sau utilizatorul a interzis accesul la camera! ',
                    MSG_crop_small: 'Selecția este prea mică! ',
                    MSG_crop_large: 'Selecția este prea mare!',
                    MSG_no_scanner: 'Nu a fost detectat nici un scanner sau plugin-ul APP nu este instalat și pornit!',
                    MSG_access_scanner: 'Detectare scannere...',
                    MSG_scanner_error: 'Eroare de scanare a imaginii!',
                    MSG_scanning: 'Scanare in curs de desfăsurare... Dacă ați ales scanare prin interfața scannerului, schimbați la interfața pornită și procedați la scanarea imaginii!',
                    MSG_max_upload_count_reached: 'Ați atins limita maximă a imaginilor care pot fi încărcate deodată. Vă rugăm ca întâi să salvați imaginile curente, apoi deschideți o nouă fereastră de încărcare.',
                    MSG_measure_alert: 'Măsurarea este pur orientativă, și poate fi influențată de calitatea imaginii și de referința aleasă!',
                };
                break;
        case 2:res = {
                    camera:    'Kamera',
                    scanner:   'Szkenner',
                    loadfile:  'Kép betöltés...',
                    takephoto: 'Fényképezés',
                    doscan:    'Szkennelés...',
                    docrop:    'Kép vágás',
                    measure:   'Mérés',
                    measure_ref:'Referencia',
                    measure_dist:'Távolság',
                    upload:    'Feltöltés',
                    clear:	   'Kép törlés',
                    cancel:    'Mégsem',
                    back:      'Vissza',
                    drag_here: 'Kattintson vagy húzza ide a képfájlt a feltöltéshez',
                    scan_with_ui: 'Szkennelés a felhasználói felületből',
                    scan_without_ui: 'Gyors szkennelés',
                    GUI_folder_resize:'Vágás átméretezés és forgatás',
                    GUI_crop:   'Vágás',
                    GUI_resize: 'Átméretezés',
                    GUI_rotate: 'Forgatás',
                    GUI_folder_tools:'Kép eszközök',
                    GUI_brightness:	'Fényesség',
                    GUI_contrast:	'Kontraszt',
                    GUI_saturation:	'Telítettség',
                    GUI_vibrance:	'Vibrance',
                    GUI_exposure:	'Exponálás',
                    GUI_hue:		'Színárnyalat ',
                    GUI_sepia:		'Szépia',
                    GUI_invert:		'Inverz kép',
                    GUI_greyscale:	'Szürkeárnyalat',
                    GUI_reset:  	'Visszaállítás',
                    GUI_open:		'Megnyitás',
                    GUI_close:		'Bezárás',
                    MSG_access_camera: 'Kérjük, hogy adjon hozzáférést a fényképezőgépnek ehhez az oldalhoz, válaszolva a böngésző ablak tetején megjelenő üzenetre!',
                    MSG_no_camera: 'Nincs megfelelő kamera, vagy a felhasználó nem férhet hozzá a kamerahoz!',
                    MSG_crop_small: 'A kiválasztás túl kicsi!',
                    MSG_crop_large: 'A kiválasztás túl nagy!',
                    MSG_no_scanner: 'Nincs telepített szkenner vagy a APP kiegeszítő nincs telepítve és elindítva!',
                    MSG_access_scanner: 'Szkenner ellenőrzés folyamatban...',
                    MSG_scanner_error: 'Hiba törtent a kép szkennelésnel!',
                    MSG_scanning: 'Szkennelés folyamatban ... Ha "szkennelés a felhasználói felületből" -t választotta, váltson ablakot a szkenner felületre és indítsa el a folyamatot!',
                    MSG_max_upload_count_reached: 'Mivel elérte az egyszerre feltölthető képek maximális számát, kérjük töltse fel az eddig kiválasztott képeket majd az új képekhez nyissa meg újra a képfeltöltést.',
                    MSG_measure_alert: 'A mérés csupán tájékoztató jellegű, és befolyásolhatja a feltoltott kép minosege, és a referencia!',
                };
                break;
        default:res = {
                    camera:    'Camera',
                    scanner:   'Scanner',
                    loadfile:  'Load image...',
                    takephoto: 'Take picture',
                    doscan:    'Scan...',
                    docrop:    'Crop image',
                    measure:   'Measure',
                    measure_ref:'Reference',
                    measure_dist:'Distance',
                    upload:    'Upload',
                    clear:	   'Clear image',
                    cancel:    'Cancel',
                    back:      'Back',
                    drag_here: 'Click or drag image file here to upload',
                    scan_with_ui: 'Scan with scanner UI',
                    scan_without_ui: 'Quick scan without scanner UI',
                    GUI_folder_resize:'Crop resize and rotate',
                    GUI_crop:   'Crop',
                    GUI_resize: 'Resize',
                    GUI_rotate: 'Rotate',
                    GUI_folder_tools:'Image Tools',
                    GUI_brightness:	'Brightness',
                    GUI_contrast:	'Contrast',
                    GUI_saturation:	'Saturation',
                    GUI_vibrance:	'Vibrance',
                    GUI_exposure:	'Exposure',
                    GUI_hue:		'Hue',
                    GUI_sepia:		'Sepia',
                    GUI_invert:		'Invert image',
                    GUI_greyscale:	'Greyscale',
                    GUI_reset:  	'Reset',
                    GUI_open:		'Open',
                    GUI_close:		'Close',
                    MSG_access_camera: 'Please allow access to your camera for this web page by answering to the message on the top of your browser window!',
                    MSG_no_camera: 'No camera detected or the user denied access to the camera!',
                    MSG_crop_small: 'The selection is too small!',
                    MSG_crop_large: 'The selection is too big!',
                    MSG_no_scanner: 'No scanners detected or the APP plugin is not installed or started!',
                    MSG_access_scanner: 'Checking for scanners...',
                    MSG_scanner_error: 'Error scanning image!',
                    MSG_scanning: 'Scanning in progress ... If you selected UI mode please switch to the scanner interface and make a scan!',					MSG_max_upload_count_reached: 'You have reached the maximum number of files for this upload. Save the current files first than start another multi-upload.',
                    MSG_measure_alert: 'Mesuring is purely indicative, and may be influenced by the image and the reference!',
                };
    }
    $.extend(res,overwrite);
    return res;
};

APP.select2._cacheDATA = {};
APP.select2._cacheAGE = {};

APP.select2.cache = function(key,idx,data){
    var res = false;
    idx = CryptoJS.MD5(idx);
    if (typeof data === 'undefined'){//read data from cache
        //res = (APP.select2._cacheDATA[key] ? (APP.select2._cacheDATA[key][idx] ? APP.select2._cacheDATA[key][idx] : false) : false);
        if (APP.select2._cacheDATA[key] && APP.select2._cacheDATA[key][idx]){
            //APP.select2._cacheAGE[key][idx]['timestamp'] = new Date().getTime(); //cache hit updates ts <- frequently used data never gets updatetd
            res = APP.select2._cacheDATA[key][idx];
        }
        //console.log(res);
    }else{//write data to cache
        //create cache age data
        APP.select2._cacheAGE[key] = APP.select2._cacheAGE[key] || {};
        APP.select2._cacheAGE[key][idx] = APP.select2._cacheAGE[key][idx] || {};
        APP.select2._cacheAGE[key][idx]['timestamp'] = new Date().getTime();
        APP.select2._cacheAGE[key][idx]['ttl'] = 30*60*1000;//30 min cache <----------NEEDS TO BE IMPLEMENTED
        //put data in cache
        APP.select2._cacheDATA[key] = APP.select2._cacheDATA[key] || {};
        APP.select2._cacheDATA[key][idx] = data;
        res = data;
        //console.log(APP.select2._cacheDATA);
    }
    return res;
};
APP.select2.cache_clear = function(key){
    if (key){
        if (key.indexOf('*')==-1){
            delete APP.select2._cacheDATA[key];
            delete APP.select2._cacheAGE[key];
        }else{//wildchar clear
            var needle = key.replace('*','');
            $.each(APP.select2._cacheDATA,function(key,value){
                if (key.indexOf(needle)===0){
                    delete APP.select2._cacheDATA[key];
                    delete APP.select2._cacheAGE[key];
                }
            });
        }
    }else{
        APP.select2._cacheDATA = {};
        APP.select2._cacheAGE = {};
    }
};
APP.select2._cache_clear_idx = function(key,idx){
    if (key && idx){
        delete APP.select2._cacheDATA[key][idx];
        delete APP.select2._cacheAGE[key][idx];
    }
};
APP.select2.cacheGarbageCollection = function(){
    try {
        //console.log('garbage collection started');
        $.each(APP.select2._cacheDATA,function(key,value){
            $.each(value,function(idx,svalue){
                var age = new Date().getTime() - APP.select2._cacheAGE[key][idx]['timestamp'];
                if (age>APP.select2._cacheAGE[key][idx]['ttl']){
                    //console.log(key+':'+idx+'->deleted with age:'+age);
                    APP.select2._cache_clear_idx(key,idx);
                }//else{
                    //console.log(key+':'+idx+'->checked with age:'+age);
                //}
            });
        });
        //console.log('garbage collection finished');
    }catch(err) {
        // if garbage collection fails STOP collecting it and log to server
        clearInterval(APP.select2.cacheGarbageCollector);
        APP.remoteLOG.log('select2.cacheGarbageCollector ERROR', 1001, err.message, 0, 0);
    }
};
APP.select2.cacheGarbageCollector = setInterval(APP.select2.cacheGarbageCollection,30*1000);//collect garbage at every 30 sec


APP.select2.select2_options_ajax = function(data_url, overwrite, pg_page){
    pg_page = pg_page ? pg_page : 15;
    var getReqData = overwrite.requestData ? overwrite.requestData : function(){return {};};
    delete overwrite.requestData;
    var cacheKEY = overwrite.cacheKEY || false;
    delete overwrite.cacheKEY;

    var res = APP.select2.select2_options({
        initSelection : function (element, callback) {
            var theid = element.val().trim();
            if (theid!==''){
                var reqData = {
                    'id':theid,
                };
                $.extend(true,reqData,getReqData());
                if (cacheKEY && APP.select2.cache(cacheKEY,data_url+JSON.stringify(reqData))){
                        callback(APP.select2.cache(cacheKEY,data_url+JSON.stringify(reqData))); //get data from cache
                }else{
                    $.ajax({
                        'url':	(overwrite.multiple && overwrite.data_url_mutiple) ? overwrite.data_url_mutiple : data_url,
                        'data': reqData,
                        'dataType': 'json',
                    }).done(function(data){
                        if (cacheKEY){ APP.select2.cache(cacheKEY,data_url+JSON.stringify(reqData),data.rows[0]); } //save data to cache
                        if (overwrite.multiple && overwrite.data_url_mutiple){
                            callback(data);
                        }else{
                        callback(data.rows[0]?data.rows[0]:[]);
                        }

                    });
                }
            }else{ callback([]); }
        },
        ajax:{
            url:data_url,
            dataType: 'json',
            quietMillis: 500,
            data: function (term, page) { //page is the one-based page number tracked by Select2
                var reqData = {
                    'q': term, //search term
                    'page': page, //page number
                    'page_limit': pg_page, //page size
                };
                $.extend(true,reqData,getReqData());
                return reqData;
            },
            results: function (data, page) {
                return {results: data.rows, more: data.more};// notice we return the value of more so Select2 knows if more results can be loaded
            },
        },
        formatSelection:APP.select2.formatSelection,
        formatResult:APP.select2.formatResult,
    });
    $.extend(true,res,overwrite);

    if (cacheKEY){// if caching is set up
        var res_cache = {
            ajax:{
                quietMillis_ajax:function(quietMillis, url, data){// select 2 source need to be modified in order to this to work
                    if (cacheKEY){
                        var cacheIDX = url+JSON.stringify(data);
                        return (APP.select2.cache(cacheKEY,cacheIDX)) ? 1 : quietMillis;
                    }else{
                        return quietMillis;
                    }
                },
                transport:function(params){
                    var cacheIDX = params.url+JSON.stringify(params.data);
                    if (cacheKEY && APP.select2.cache(cacheKEY,cacheIDX)){
                        params.success(APP.select2.cache(cacheKEY,cacheIDX));//get data from cache
                    }else{
                        var success_orig = params.success;
                        params.success = function(data){
                            if (cacheKEY) { APP.select2.cache(cacheKEY,cacheIDX,data); }//write data to cache
                            success_orig(data);
                        };
                        $.ajax(params);
                    }
                },
            },
        };
        $.extend(true,res,res_cache);
    }

    return res;
};

APP.select2.toggle_field_disabled = function($input, disabled){
    $input.select2("val", "");
    $input.trigger('change');
    $input.prop('disabled', disabled);
};

APP.dfilter = {};
APP.dfilter.messages = function(overwrite){
    var res;
    switch (get_lang_idx()) {
        case 1:res = {
                    noClear:'Acest filtru este obligatoriu',
                    clearFilter:'Îndepărtează filtru',
                    clearAllFilters:'Îndepărtează toate filtrele',
                    toggleFilter:'Închide/Deschide filtre',
                    title_date_from: langJS('global_date_from'),
                    title_date_to: langJS('global_date_to'),
                    title_age_from: langJS('global_age_from'),
                    title_age_to: langJS('global_age_to'),
                    refresh: langJS('global_refresh'),
                    save_filter: 'Salvare/Ștergere datele filtrare'
                };
                break;
        case 2:res = {
                    noClear:'Ez a szűrő kötelező',
                    clearFilter:'Szűrő törlése',
                    clearAllFilters:'Összes szűrő törlése',
                    toggleFilter:'Szűrők kinyit/bezár',
                    title_date_from: langJS('global_date_from'),
                    title_date_to: langJS('global_date_to'),
                    title_age_from: langJS('global_age_from'),
                    title_age_to: langJS('global_age_to'),
                    refresh: langJS('global_refresh'),
                    save_filter: 'Szűrő adatainak mentése/törlése'
                };
                break;
        default:res = {
                    noClear:'This filter is required',
                    clearFilter:'Remove filter',
                    clearAllFilters:'Clear all filters',
                    toggleFilter:'Open/Close',
                    title_date_from: langJS('global_date_from'),
                    title_date_to: langJS('global_date_to'),
                    title_age_from: langJS('global_age_from'),
                    title_age_to: langJS('global_age_to'),
                    refresh: langJS('global_refresh'),
                    save_filter: 'Save/Delete filter data'
                };
    }
    $.extend(res,overwrite);
    return res;
};

APP.dselector = {};
APP.dselector.messages = function(overwrite){
    var res;
    switch (get_lang_idx()) {
        case 1:res = {
                    noClear:'Acest filtru este obligatoriu',
                    clearFilter:'Îndepărtează filtru',
                    checkAll: 'Selectează toate filtrele',
                    clearAllFilters:'Îndepărtează toate filtrele',
                    toggleFilter:'Închide/Deschide filtre',
                    refresh: langJS('global_refresh'),
                    tooMuchSelected: langJS('global_too_many_doctors_opened'),
                    openFilter: 'Deschide fereastra de filtrare'
                };
                break;
        case 2:res = {
                    noClear:'Ez a szűrő kötelező',
                    clearFilter:'Szűrő törlése',
                    clearAllFilters:'Összes szűrő törlése',
                    checkAll: 'Összes szűrő kijelölése',
                    toggleFilter:'Szűrők kinyit/bezár',
                    refresh: langJS('global_refresh'),
                    tooMuchSelected: langJS('global_too_many_doctors_opened'),
                    openFilter: 'Szűrő ablak megnyítása'
                };
                break;
        default:res = {
                    noClear:'This filter is required',
                    clearFilter:'Remove filter',
                    checkAll: 'Select all filters',
                    clearAllFilters:'Clear all filters',
                    toggleFilter:'Open/Close',
                    refresh: langJS('global_refresh'),
                    tooMuchSelected: langJS('global_too_many_doctors_opened'),
                    openFilter: 'Open filter window'
                };
    }
    $.extend(res,overwrite);
    return res;
};