/* global jQuery */

(function($) {
	
	var options = {
		/* action='downoad' options */
		filename: 'table.csv',
		
		/* action='output' options */
		appendTo: 'body',
		
		/* general options */
		separator: ',',
		newline: '\n',
		quoteFields: true,
		excludeColumns: '',
		excludeRows: '',
		processText:false,
	};
	
	function firstlevel(obj, sel) {
	    if (obj.selector != sel) {
	        obj = obj.find(sel);
	    }
	    obj = obj.not(obj.find(sel));
	    return obj;
	}		
	
	function quote(text) {
		return '"' + text.replace('"', '""') + '"';
	}

	function get_title(col){
		var text = col.attr('title') || ''; //get text without children text
		if (col.children().length>0){
			col.children().each(function(){
				text += get_title($(this))+' ';
			});
		}	
		text = text.replace(/\s\s+/g, ' ').trim();//replace multiple whitespace and trim;
		return text;
	}
	function get_text(col){
		var text = col.contents().not(col.children()).text() || ''; //get text without children text
		if (col.children().length>0){
			col.children().each(function(){
				text += get_text($(this))+' ';
			});
		}	
		text = text.replace(/\s\s+/g, ' ').trim();//replace multiple whitespace and trim;
		return text;
	}
	
	// taken from http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
	function download(filename, text) {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);
		
		element.style.display = 'none';
		document.body.appendChild(element);
		
		element.click();
		
		document.body.removeChild(element);
	}
	
	function convert(table) {
		var output = "";
			
		//var rows = table.find('tr').not(options.excludeRows);
		var rows = firstlevel(table, 'tr').not(options.excludeRows);//$('> thead > tr, > tbody > tr', table).not(options.excludeRows);
		
		var numCols = rows.first().find("td,th").filter(":visible").not(options.excludeColumns).length;
		//console.log(numCols)
		
		rows.each(function() {
			$(this).find("td,th").filter(":visible").not(options.excludeColumns)
			.each(function(i, col) {
				col = $(col);
				
				var text = get_text(col) || get_title(col) || '';
				text = options.processText ? options.processText(text) : text;
				//output += options.quoteFields ? quote(col.text()) : col.text();
				output += options.quoteFields ? quote(text) : text;
				//console.log(i);
				if(i != numCols-1) {
					output += options.separator;
				} else {
					output += options.newline;
				}
			});
		});
		
		return output;
	}
	
	$.fn.table2csv = function(action, opt) {
		if(typeof action === 'object') {
			opt = action;
			action = 'download';
		} else if(action === undefined) {
			action = 'download';
		}
		
		$.extend(options, opt);
		
		var table = this; // TODO use $.each
		var csv = '';
		switch(action) {
			case 'download':
				csv = convert(table);
				download(options.filename, csv);
				break;
			case 'output':
				csv = convert(table);
				$(options.appendTo).append($('<pre>').text(csv));
				break;
		}
		
		return this;
	};
	
}(jQuery));