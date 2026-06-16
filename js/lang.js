/*exported validation_defaults */
/*exported datepicker_defaults */
/*exported jtable_lang */

function validation_defaults(overwrite){
    var res ={
                scroll:false,
                autoHidePrompt: true,
                autoHideDelay: 5000,
                promptPosition : "topRight",
                customFunctions:{
                    'validateCNP':function(field, rules, i, options){
                        if (field.val() !== ""){
                            var valid = APP.validate.validCNP(field.val());
                            if (valid.Result == "ERROR") {
                                return '* '+langJS('global_validate_cnp');
                            }
                        }
                    },
                    'validatePASSW':function(field, rules, i, options){
                        if (field.val()!==""){
                            if (!APP.validate.validPASS(field.val())){
                                return '* '+langJS('global_validate_passw');
                            }
                        }
                    },
                },
            };
    $.extend(res,overwrite);
    return res;
}
function datepicker_defaults(overwrite){
    var res = {
            defaultDate: 0,
            showOtherMonths: true,
            selectOtherMonths: true,
            changeYear: true,
            changeMonth: true,
            yearRange: 'c-5:c+5',
            showOn: "focus",
            showAnim: 'fadeIn',
            dateFormat: date_format_js(),//important to include this
            onChangeMonthYear: function(year, month, inst){
                /* by changing month or year sets the date */
                var curDate = $(this).datepicker("getDate");
                if (curDate === null){
                    return;
                }
                if (curDate.getFullYear() != year || curDate.getMonth() != month - 1) {
                    curDate.setYear(year);
                    curDate.setMonth(month - 1);
                    $(this).datepicker("setDate", curDate);
                }
            },
            onClose: function(dateText, inst){
                //$(this).trigger('change');   //this line will BREAK dfilter by calling onChange TWICE !!!!!!!!!!!!!!!!!!!!
            }
    };

    $.extend(res,overwrite);
    return res;
}
function jtable_lang(overwrite){
    var res;
    switch (get_lang_idx()) {
        case 1:res = {
                    serverCommunicationError: 'Eroare de comunicare cu serverul.',
                    loadingMessage: 'Încărcare înregistrări...',
                    noDataAvailable: 'Nu există înregistrări!',
                    addNewRecord: 'Înregistrare nouă',
                    editRecord: 'Modificare',
                    areYouSure: 'Sunteți sigur?',
                    deleteConfirmation: 'Înregistrarea va fi ștearsă. Sunteți sigur?',
                    save: 'Salvare',
                    saving: 'Se salveaza',
                    cancel: 'Anulează',
                    deleteText: 'Șterge',
                    deleting: 'Se șterge',
                    error: 'Eroare',
                    close: 'Închide',
                    cannotLoadOptionsFor: 'Nu pot fi încarcate opțiunile pentru înregistrarea {0}',
                    pagingInfo: 'Afișate de la {0} la {1} din {2} înregistrări',
                    canNotDeletedRecords: 'Nu pot fi șterse {0} din {1} înregistrări!',
                    deleteProggress: 'Se șterge {0} din {1} înregistrări ...',
                    pageSizeChangeLabel: 'Linii', //New. Must be localized.
                    gotoPageLabel: 'Pagina', //New. Must be localized.
                    toolsBtnPrint: 'Listare tabela', //New. Must be localized.
                    toolsBtnExportExcel: 'Exportare tabela în fișier .xls', //New. Must be localized.
                    toolsBtnExportXlsx: 'Exportare tabela în fișier .xlsx', //New. Must be localized.
                    toolsBtnExportOds: 'Exportare tabela în fișier .ods', //New. Must be localized.
                    toolsBtnExportCSV: 'Exportare tabela în fișier .csv', //New. Must be localized.
                };
                break;
        case 2:res = {
                    serverCommunicationError: 'Hiba történt a szerverrel való kommunikációban.',
                    loadingMessage: 'Az adatok tőltödnek...',
                    noDataAvailable: 'Nincsenek adatok!',
                    addNewRecord: 'Új bejegyzés',
                    editRecord: 'Bejegyzés modositása',
                    areYouSure: 'Biztos benne?',
                    deleteConfirmation: 'A bejegyzés törlödik! Biztos benne?',
                    save: 'Mentés',
                    saving: 'Mentődik',
                    cancel: 'Mégsem',
                    deleteText: 'Törlés',
                    deleting: 'Törlödik',
                    error: 'Hiba',
                    close: 'Bezárás',
                    cannotLoadOptionsFor: 'A lehetőségek nem lehet betölteni a {0} bejegyzésnek',
                    pagingInfo: 'Találatok: {0} - {1} Összesen: {2}',
                    canNotDeletedRecords: 'Nem lehet töröni {0} bejegyzést a {1}-böl!',
                    deleteProggress: 'Törödik {0} bejegyzés a {1}-böl ...',
                    pageSizeChangeLabel: 'Bejegyzés', //New. Must be localized.
                    gotoPageLabel: 'Oldal', //New. Must be localized.
                    toolsBtnPrint: 'Táblázat nyomtatás', //New. Must be localized.
                    toolsBtnExportExcel: 'Táblázat export .xls állományba', //New. Must be localized.
                    toolsBtnExportXlsx: 'Táblázat export .xlsx állományba', //New. Must be localized.
                    toolsBtnExportOds: 'Táblázat export .ods állományba', //New. Must be localized.
                    toolsBtnExportCSV: 'Táblázat export .csv állományba', //New. Must be localized.
                };
                break;
        default:res = {
                    serverCommunicationError: 'An error occured while communicating to the server.',
                    loadingMessage: 'Loading records...',
                    noDataAvailable: 'No data available!',
                    addNewRecord: 'Add new record',
                    editRecord: 'Edit Record',
                    areYouSure: 'Are you sure?',
                    deleteConfirmation: 'This record will be deleted. Are you sure?',
                    save: 'Save',
                    saving: 'Saving',
                    cancel: 'Cancel',
                    deleteText: 'Delete',
                    deleting: 'Deleting',
                    error: 'Error',
                    close: 'Close',
                    cannotLoadOptionsFor: 'Can not load options for field {0}',
                    pagingInfo: 'Showing {0} to {1} of {2} records',
                    canNotDeletedRecords: 'Can not deleted {0} of {1} records!',
                    deleteProggress: 'Deleted {0} of {1} records, processing...',
                    pageSizeChangeLabel: 'Rows', //New. Must be localized.
                    gotoPageLabel: 'Page', //New. Must be localized.
                    toolsBtnPrint: 'Print table', //New. Must be localized.
                    toolsBtnExportExcel: 'Export table in .xls file', //New. Must be localized.
                    toolsBtnExportXlsx: 'Export table in .xlsx file', //New. Must be localized.
                    toolsBtnExportOds: 'Export table in .ods file', //New. Must be localized.
                    toolsBtnExportCSV: 'Export table in .csv file', //New. Must be localized.
                };
    }
    $.extend(res,overwrite);
    return res;
}