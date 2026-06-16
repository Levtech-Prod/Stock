// general preventig of form submission ALL FORM SUBMISSIONS are done by AJAX
$(document).on("submit",'form', function(event){
    //return false from within a jQuery event handler is effectively the same as calling both e.preventDefault and e.stopPropagation
    APP.log('ERROR: The form "'+$(this).attr('id')+'" is trying to submit!');
    event.preventDefault();
});

// trigger for predefinedtext functionality
$(document).on('blur','input, textarea',function(){
    if ((!$(this).hasClass('select2-offscreen')) && (!$(this).hasClass('select2-input'))){
        APP.predefinedtext.$savedObject=$(this);
        $(APP.predefinedtext).trigger('savedObjectChanged');
    }
});

// solves JQueryUI dialog and select2 focus problem - has same effect as { dropdownCssClass: 'ui-dialog' } in select2 option
//https://github.com/ivaynberg/select2/issues/1246  or  http://bugs.jqueryui.com/ticket/9087
//alternate solution
/*$.ui.dialog.prototype._allowInteraction = function(event) {
    return !!$( event.target ).closest( '.ui-dialog, .ui-datepicker, .select2-drop' ).length;
};*/
$.widget( "ui.dialog", $.ui.dialog, {
    _allowInteraction: function( event ) {
        return !!$( event.target ).closest( ".select2-drop" ).length ||
            !!$( event.target ).closest( ".colpick" ).length ||
            this._super( event );
    }
});

//allow html in ui dialog title
$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
    _title: function(title) {
        if (!this.options.title ) {
            title.html("&#160;");
        } else {
            title.html(this.options.title);
        }
    }
}));

Array.prototype.remove = function(v) { this.splice(this.indexOf(v) == -1 ? this.length : this.indexOf(v), 1); };

//adds getWeek to the Date which calculates the current number of week of the year(use just like getMonth() )
/*Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(),0,1);
    var today = new Date(this.getFullYear(),this.getMonth(),this.getDate());
    var dayOfYear = ((today - onejan +1)/86400000);
    return Math.ceil(dayOfYear/7);
};*/

String.prototype.ucwords = function() {
var str = this.toLowerCase();
return (str + '')
    //.replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1) {
    .replace(/^([a-z\u0020-\u024F])|\s+([a-z\u0020-\u024F])/g, function($1) {
    return $1.toUpperCase();
    });
};

$.fn.insertIntoTextarea = function (myValue) {
    return this.each(function(){
        //MOZILLA / NETSCAPE support
        if (this.selectionStart || this.selectionStart == '0') {
            var startPos = this.selectionStart;
            var endPos = this.selectionEnd;
            var scrollTop = this.scrollTop;
            this.value = this.value.substring(0, startPos)+ myValue+ this.value.substring(endPos,this.value.length);
            this.focus();
            this.selectionStart = startPos + myValue.length;
            this.selectionEnd = startPos + myValue.length;
            this.scrollTop = scrollTop;
        } else {
            this.value += myValue;
            this.focus();
        }
    });
};

//binds an event as the first event that will be called
$.fn.bindFirst = function(name, fn) {
    // bind as you normally would
    // don't want to miss out on any jQuery magic
    this.on(name, fn);

    // Thanks to a comment by @Martin, adding support for
    // namespaced events too.
    this.each(function() {
        var handlers = $._data(this, 'events')[name.split('.')[0]];
        //console.log(handlers);
        // take out the handler we just inserted from the end
        var handler = handlers.pop();
        // move it at the beginning
        handlers.splice(0, 0, handler);
    });
};

//extend ui tabs with hideTab/showTab functionality
jQuery.widget( 'ui.tabs', $.ui.tabs, {
    hideTab: function ( idx ) {
        if (idx===false || idx===''){ return; }
        //$(this).tabs( "disable", 1 ).find("ul li:eq("+1+")").hide();
        this.disable( idx );
        idx = $.isArray( idx ) ? idx.sort() : [ idx ];
        //console.log(idx);
        for ( var i = 0, li; ( li = this.tabs[ i ] ); i++ ) {
            if ( $.inArray( i, idx ) !== -1 ) {
                $(li).hide();
            }
        }
    },
    showTab: function ( idx ) {
        if (idx===false || idx===''){ return; }
        //$(this).tabs( "disable", 1 ).find("ul li:eq("+1+")").hide();
        this.enable( idx );
        idx = $.isArray( idx ) ? idx.sort() : [ idx ];
        for ( var i = 0, li; ( li = this.tabs[ i ] ); i++ ) {
            if ( $.inArray( i, idx ) !== -1 ) {
                $(li).show();
            }
        }
    },
    toggleTab: function ( idx , toggle) {
        if (toggle) {
            this.showTab(idx);
        }else{
            this.hideTab(idx);
        }
    }
});
