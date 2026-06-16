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
/*jQuery.fn.firstlevel = function(sel) {
    var obj = $(this);
    if (obj.selector != sel) {
        obj = obj.find(sel);
    }
    obj = obj.not(obj.find(sel));
    return obj;
}*/	
	
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
		var output = "<table>";
			
		//var rows = table.find('tr').not(options.excludeRows);
		var rows = firstlevel(table, 'tr').not(options.excludeRows);//$('> thead > tr, > tbody > tr', table).not(options.excludeRows);
		
		var numCols = rows.first().find("td,th").filter(":visible").not(options.excludeColumns).length;
		
		rows.each(function(ii, row) {
			row = $(row);
			//console.log(row);
			output += "<tr>";
			if (row.hasClass('jtable-child-row')){
				var nestedtable = firstlevel(row,'table');
				output += '<td colspan="'+numCols+'">'+convert(nestedtable)+'</td>';
			}else{
				$(this).find("td,th").filter(":visible").not(options.excludeColumns)
				.each(function(i, col) {
					col = $(col);
					let text = get_text(col,true) || get_title(col) || '';
					text = options.processText ? options.processText(text) : text;
					let attr = '';
					let attr_v = col.attr('v');  //copy raw value attr - see http://sheetjs.com cell object documentation - v	raw value (see Data Types section for more info)
					let attr_t = col.attr('t');
					attr += attr_v ? ' v="'+attr_v+'"':''; 
					attr += attr_t ? ' t="'+attr_t+'"':''; 
					output += col.is('th')?"<th>":"<td"+attr+">";
					output += text;
					output += col.is('th')?"</th>":"</td>";
				});
			}
			output += "</tr>";
		});
		output += "</table>";
		return output;
	}
	
	$.fn.jtable2table = function(action, opt) {
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
				//$(options.appendTo).append($('<pre>').text(csv));
				$(options.appendTo).append(csv);
				break;
		}
		
		return this;
	};
	
}(jQuery));