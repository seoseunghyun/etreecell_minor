<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link rel="stylesheet" type="text/css" charset="UTF-8" href="brand/etreecell/css/spectrum.css" />
<script type="text/javascript" src="brand/etreecell/js/jquery.js"></script>
<script type="text/javascript" src="brand/etreecell/js/spectrum.js"></script>
<script type="text/javascript" src="brand/etreecell/js/raphael.js"></script>
<script type="text/javascript" src="brand/etreecell/js/etreecell.js"></script>

</head>
<body>
	
	<div style="width: 70%; height:500px; border: 1px solid black; float: left; position: relative; overflow: scroll;">
		<div class="etreecell" id="test" style="width: 2000px; height: 2000px; float: left; position: relative;">
			
		</div>
	</div>
	<div id="attrs" style="width: 29%; height:500px; border: 1px solid black; float: left; position: relative;">
		<h1>셀 생성</h1>
		<strong>&nbsp;id : </strong> <input id="create_id" type="text" value="" /><br />
		<strong>&nbsp;Width : </strong> <input id="create_width" type="text" value="100" /><br />
		<strong>&nbsp;Height : </strong> <input id="create_height" type="text" value="50" /><br />
		<strong>&nbsp;Stroke Width : </strong> <input id="create_stroke_width" type="text" value="1" /><br />
		<strong>&nbsp;Stroke Dasharray : </strong> 
		<select id="create_stroke_dasharray" type= value="1" style="width:50px;" >
			<option selected="selected"></option>
			<option >-</option>
			<option >-.</option>
			<option >-..</option>
		</select>
		<br />
		<strong>&nbsp;background : </strong> <input id="create_background" type="text" value="#eeeeee" /><br />
		<strong>&nbsp;Stroke Color : </strong> <input id="create_stroke_color" type="text" value="#555555"/><br />
		<input id="btn_create" type="button" value="생성" />
		<hr />
		<input id="range" type="range" min="10" max="300" value="10" step="10" /><span id="rangeVal"></span><br />
		<input id="btn_modify" type="button" value="적용" />
		
	</div>
	<textarea id="exportConsole" style="width: 200px; height:200px; font-size:10px; border: 1px solid red; float: left; position: relative; overflow: scroll;">
		
	</textarea>
	<input id="btn_export" type="button" value="출력" style="width: 50px; height:100px; font-size: 30px; float: left; position: relative;" />
	<textarea id="loadConsole" style="width: 200px; height:200px; font-size:10px; border: 1px solid red; float: left; position: relative; overflow: scroll;" >
		
	</textarea>
	<input id="btn_import" type="button" value="저장 가져오기" style="width: 100px; height:100px; font-size: 30px; float: left; position: relative;" />
	
</body>
</html>
<script>
		var etclCanvas = new etreecell('.etreecell');
		var etcl = etclCanvas[0];
		var c1, c2;
		var id = new Array();

			c1 = etcl.createCell('ssh',{'width' : 200, 'height' :200, 'x' : 0, 'y' : 0});

			c2 = etcl.createCell('ssh2',{'width' : 200, 'height' :200, 'x' : 50 });
			
			c1.toConnect(c2);
			etcl.snapTo([0, 50, 100], 10, 10); 
		$('#create_background').spectrum({
				preferredFormat: "hex",
			    color: "#eeeeee",
			    showAlpha : true
		});
		$('#create_stroke_color').spectrum({
				preferredFormat: "hex",
			    color: "#555555",
			    showAlpha : true
		});
		$('#btn_create').click(function(){
			var c = etcl.createCell($('#create_id').val(),{'width' : parseInt($('#create_width').val()), 'height' : parseInt($('#create_height').val()), 'x' : 50, 'y' : 50, 'stroke-width' : parseInt($('#create_stroke_width').val()), 'fill' : $('#create_background').val(), 'stroke' : $('#create_stroke_color').val(), 'stroke-dasharray' : $('#create_stroke_dasharray').val() });
			id.push(c);
		})
		$('#btn_export').click(function(){
			$('#exportConsole').html(etcl.exportData());
		})
		
		$('#btn_import').click(function(){
			etcl.loadData($('#loadConsole').val())
		});
		$('#range').mouseup(function(){
			$('#rangeVal').html($(this).val());
			etcl.animate( { 'x' : 0, 'y' : 0, 'zoom' : 0.9 + parseFloat($(this).val())/100}, 500, "<>");
		})
</script>