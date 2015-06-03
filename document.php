<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<script type="text/javascript" src="js/highlight.js"></script>
<link rel="stylesheet" href="css/highlight_zenburn.css" />
<style>
@import url(http://fonts.googleapis.com/earlyaccess/nanumgothic.css);
a:link { color:black; text-decoration: none;}
a:visited { color:black; text-decoration: none;}
a:active { color:black; text-decoration: none;}
body {
    font-family: "Nanum Gothic", sans-serif;
    height:100%;
    margin: 0 auto;
}
html {
	height: 100%;
}
.styleGroup {
	padding-left: 10px;
	padding-right: 10px;
	color: white;
	border-radius: 5px;
	margin-left: 20px;
}

.object		{ background: #d4900a; }	
.array		{ background: #8cb412; }	
.string		{ background: #2495b6; }
.function		{ background: #b63a5d; }
.int		{ background: #d6961b; }
.bool		{ background: #883cab; }
.hex		{ background: #9a2c5b; }
h2 {
	color: #323232;
}

h3 {
	color: #585858;
}

li {
	color: #767676;
	margin-bottom: 5px;
}

code{
	border-radius: 10px;
	width: 95%;
/*  	font-size: 15px;  */
}
</style>
<script type="text/javascript">
hljs.initHighlightingOnLoad();

</script>
</head>
<body style="height:100%">

	
	<?php

$entireArr = array();

function res($name, $description, $parameters, $returns, $usage, $type = 'function')
{
    global $entireArr;
    $entireArr[$name] = '<a name="' . $name . '" href="#' . $name . '"><h2 name="' . $name . '">' . $name . '</a>';
    $tmpCount         = 0;
    if ($type == 'function') {
        $type_operator_a = '(';
        $type_operator_b = ')';
        $type_parameters = 'Parameter';
        $entireArr[$name] .= ' ' . $type_operator_a . '<i>';
        
        foreach ($parameters as $k2 => $v2) {
            $tmpCount++;
            if (substr($k2, 0, 1) == '*') {
                $k2 = substr($k2, 1);
            } else {
                $k3 = explode('||', $k2);
                $k2 = '<font color="#898989">' . trim($k3[0]) . '</font>';
            }
            
            if (count($parameters) == $tmpCount) {
                $entireArr[$name] .= '&nbsp;' . $k2 . '&nbsp;';
            } else {
                $entireArr[$name] .= '&nbsp;' . $k2 . ',';
            }
        }
        $entireArr[$name] .= '</i>' . $type_operator_b . ';</h2>';
    } else if ($type == 'array') {
        $type_operator_a = '[';
        $type_operator_b = ']';
        $type_parameters = ucwords($type);
        $entireArr[$name] .= ' ' . $type_operator_a . '<i>';
        $entireArr[$name] .= 'array ';
        $entireArr[$name] .= '</i>' . $type_operator_b . ';</h2>';
    } else if ($type == 'object') {
        $type_operator_a = '{';
        $type_operator_b = '}';
        $type_parameters = 'Attributes List';
        $entireArr[$name] .= ' ' . $type_operator_a . '<i>';
        $entireArr[$name] .= ' object ';
        $entireArr[$name] .= '</i>' . $type_operator_b . ';</h2>';
    }
    
    
    $entireArr[$name] .= '	<ul style="background:#ebebeb; padding-top:5px; padding-bottom:15px;">
		
		<li><h3>Description</h3></li>
		<ul>
		<li>' . $description . '</li>
		</ul>
		
		<li><h3>' . $type_parameters . '</h3></li>
		<ol>
		';
    
    foreach ($parameters as $k2 => $v2) {
        $tmpOpen = '<b>';
        if (substr($k2, 0, 1) == '*') {
            $k2      = substr($k2, 1);
            $tmpOpen = '<b><font color="#d85684">*&nbsp;</font>';
        }
        $tmp = explode('/', $v2);
        if ($tmp[1] == '') {
            $entireArr[$name] .= '<li>' . $tmpOpen . $k2 . '</b> <span class="' . $tmp[0] . ' styleGroup">' . $tmp[0] . '</span></li>';
        } else {
            $k3 = explode('||', $k2);
            array_push($k3, '');
            if ($k3[1] != '') {
                $k3[1] = '||&nbsp;' . $k3[1];
            }
            $entireArr[$name] .= '<li>' . $tmpOpen . $k3[0] . '<font color="#c23c65" size="2">&nbsp&nbsp' . $k3[1] . '</font></b> <span class="' . $tmp[0] . ' styleGroup">' . $tmp[0] . '</span> : ' . $tmp[1] . '</li>';
        }
    }
    
    $entireArr[$name] .= '
		</ol>
		
		<li><h3>Usage</h3></li>
		<li><pre><code>' . $usage . '</code></pre></li>
		
		<li><h3>Returns</h3></li>
		';
    
    if ($returns != null) {
        $entireArr[$name] .= '<ul><li><b>' . $returns[0] . '</b> <span class="' . $returns[1] . ' styleGroup">' . $returns[1] . '</span> : ' . $returns[2] . '</li></ul>';
    } else {
        $entireArr[$name] .= '<ul><li>null</li></ul>';
    }
    
    $entireArr[$name] .= '
	</ul><br /><br /><br />';
    
}

?>
	
	
	
	
	<?php

res('etreecell', 'Creates a Etreecell canvas object on which to draw. <Br />You must do this first', array(
    '*DOM element' => 'object/',
    'style' => 'array/Style of etreecell canvas.'
), null, '	var e = document.getElementById("canvas");
	var etcl = new etreecell(e);');

res('Style', 'Style Array', array(
    'stroke' => 'hex/Color of stroke',
    'strokeWidth' => 'int/Thickness of line',
    'x' => 'int/X position of cell.',
    'y' => 'int/Y position of cell.',
    'width' => 'int/Width of cell.',
    'height' => 'int/Height of cell.',
    'fill' => 'hex/Background Color of cell.',
    'style' => 'array/Style of create link.'
), array(
    'link',
    'object',
    'Return created link.'
), '// This is Style Object;
', 'object');



res('Event', 'Event Array', array(
    'click' => 'function/Click event',
    'dblclick' => 'function/Double click event',
    'dragstart' => 'function/DragStart event',
    'dragmove' => 'function/DragMove event',
    'dragend' => 'function/Dragend event',
    'mouseover' => 'function/MouseOver event',
    'mouseout' => 'function/MouseOut event',
    'mouseup' => 'function/MouseUp event',
    'select' => 'function/Select event',
    'deselect' => 'function/Deselect event',
    'resize' => 'function/Resize event',
    'activate' => 'function/Activate event',
    'deactivate' => 'function/Deactivate event',
    'refreshData' => 'function/Refresh the data event'
), array(
    'link',
    'object',
    'Return created link.'
), '// This is Event Array', 'object');


res('etreecell.resize', 'Resize a etreecell Canvas.', array(
    'width || document.width' => 'int/Resize the width of etrecell canvas.',
    'height || document.height' => 'int/Resize the height of etrecell canvas.'
), null, 'var e = document.getElementById("canvas");
var etcl = new etreecell(e);
	
// Resize to document size.
etcl.resize();
	
//Resize to width : 100px , height: 500px.
etcl.resize(100,500);');

res('etreecell.createCell', 'Creates a Cell in etreecell Canvas.', array(
    '*id' => 'string/Id of create cell.',
    'style' => 'array/Style and attribution of create cell.'
), array(
    'cell',
    'object',
    'Return created cell.'
), 'var cell1 = etcl.createCell("cell1");
	
// Create cell include style.
var cell2 = etcl.createCell("cell2", { stroke : "#eeeee", stroke-width : 3 });');

res('etreecell.createLink', 'Creates a Link in etreecell Canvas.', array(
    '*outCell' => 'object/A Cell of link A to B.',
    '*inCell' => 'object/B Cell of link A to B.',
    'style' => 'array/Style of create link.',
    'fixIndex' => 'array/Fix the line along top : 0 ~ right : 3 (clockwise) & "auto" &nbsp;&nbsp;ex)&nbsp;[ 0 , "auto" ]'
), array(
    'link',
    'object',
    'Return created link.'
), '// Create Cell for link.
var cell1 = etcl.createCell("cell1");
var cell2 = etcl.createCell("cell2", { stroke : "#eeeee", stroke-width : 3 });

// Create Link cell1 to cell2. Fixed line top(cell1) to auto(cell2) fix.
var link = etcl.createLink(cell1, cell2, null, [0 , "auto"] );
');


res('etreecell.removeCell', 'Remove a Cell in etreecell Canvas.', array(
    '*cell' => 'object/Cell object for remove.'
), null, 'var cell1 = etcl.createCell("cell1");
	
// Remove cell1.
etcl.removeCell(cell1);');



res('etreecell.removeLink', 'Remove a Link in etreecell Canvas.', array(
    '*link' => 'object/Link object for remove.'
), null, 'var link1 = etcl.createLink("cell1", "cell2");
	
// Remove link1.
etcl.removeLink(link1);');


res('etreecell.selectCell', 'Select cell(s) object in etreecell Canvas.', array(
    '*cells' => 'object/cell object(s) for select.',
    'resetBool' => 'bool/If you input the true, other cells is unselect.'
), null, 'var cell1 = etcl.createCell("cell1");
var cell2 = etcl.createCell("cell2");
var cell3 = etcl.createCell("cell3");

// Selet cell1 and cell2 at the same time.
etcl.selectCell(cell1);
etcl.selectCell(cell2, false);	

// Or
etcl.selectCell( [cell1, cell2] );

// Select only cell3. -> now select cell is cell3.
etcl.selectCell(cell3, true);');


res('etreecell.deselectCell', 'Deselect cell(s) object in etreecell Canvas.', array(
    '*cells' => 'object/cell object(s) for deselect.'
), null, 'var cell1 = etcl.createCell("cell1");
var cell2 = etcl.createCell("cell2");
var cell3 = etcl.createCell("cell3");

// Select cell1, cell2 and cell3 at the same time.
etcl.selectCell(cell1);
etcl.selectCell(cell2);
etcl.selectCell(cell3);

// Deselect cell2, cell3.
etcl.deselectCell( [cell2, cell3] );');


res('etreecell.deselectAllCell', 'Deselect all cells in etreecell Canvas.', array(), null, 'var cell1 = etcl.createCell("cell1");
var cell2 = etcl.createCell("cell2");
var cell3 = etcl.createCell("cell3");

// Select cell1, cell2 and cell3 at the same time.
etcl.selectCell(cell1);
etcl.selectCell(cell2);
etcl.selectCell(cell3);

// Deselect all cells.
etcl.deselectAllCell();');





res('etreecell.selectLink', 'Select link(s) object in etreecell Canvas.', array(
    '*links' => 'object/link object(s) for select.',
    'resetBool' => 'bool/If you input the true, other links is unselect.'
), null, 'var cell1 = etcl.createCell("cell1");
var cell2 = etcl.createCell("cell2");
var cell3 = etcl.createCell("cell3");

var link1_2 = cell1.link(cell2);
var link2_3 = cell2.link(cell3);

// Selet link1_2 and link2_3 at the same time.
etcl.selectLink(link1_2);
etcl.selectLink(link2_3, false);	

// Or
etcl.selectLink( [link1_2, link2_3] );

// Select only link1_2. -> now select link is link1_2.
etcl.selectLink(link1_2, true);');


res('etreecell.deselectLink', 'Deselect link(s) object in etreecell Canvas.', array(
    '*links' => 'object/link object(s) for deselect.'
), null, 'var cell1 = etcl.createCell("cell1");
var cell2 = etcl.createCell("cell2");
var cell3 = etcl.createCell("cell3");

var link1_2 = cell1.link(cell2);
var link2_3 = cell2.link(cell3);
var link1_3 = cell1.link(cell3);

// Select link1_2, link2_3 and link1_3 at the same time.
etcl.selectLink( [link1_2, link2_3, link1_3] );

// Deselect link1_2, link2_3.
etcl.deselectCell( [link1_2, link2_3] );');


res('etreecell.deselectAllLink', 'Deselect all links in etreecell Canvas.', array(), null, 'var cell1 = etcl.createCell("cell1");
var cell2 = etcl.createCell("cell2");
var cell3 = etcl.createCell("cell3");

var link1_2 = cell1.link(cell2);
var link2_3 = cell2.link(cell3);

// Select link1_2 and link2_3 at the same time.
etcl.selectLink( [link1_2, link2_3] );

// Deselect all links.
etcl.deselectAllLink();');


res('etreecell.deselectAll', 'Deselect all cells and links in etreecell Canvas.', array(), null, 'var cell1 = etcl.createCell("cell1");
var cell2 = etcl.createCell("cell2");
var cell3 = etcl.createCell("cell3");

var link1_2 = cell1.link(cell2);
var link2_3 = cell2.link(cell3);

// Select cell1.
etcl.selectCell(cell1);

// Select link1_2 and link2_3 at the same time.
etcl.selectLink( [link1_2, link2_3] );

// Deselect all cells and links.
etcl.deselectAll();');


res('etreecell.changeAttrCell', 'Change the style of cell in etreecell Canvas.', array(
    '*cell' => 'object/Cell Object for change the style.',
    '*style' => 'array/Style(attr) for change the style.'
), null, 'var cell1 = etcl.createCell("cell1");

// Change the style of cell1.
etcl.changeAttrCell(cell1, { fill : "red", opaciy : .5 });');


res('etreecell.changeAnimateCell', 'Change the style of cell in etreecell Canvas.', array(
    '*cell' => 'object/Cell Object for change the style.',
    '*style' => 'array/Style(attr) for change the style.',
    'duration || 500' => 'int/Millisecond during animate.',
    'easing || "linear"' => 'string/animation easing <>,>,<,linear,bounce... following raphael.js.',
    'callback' => 'function/Excute the function when completed animation'
), null, 'var cell1 = etcl.createCell("cell1");

// Animation the style of cell1.
etcl.changeAnimateCell(cell1, { 
	fill : "red",
	opaciy : .5,
	width : 100 
	},
	800 , "<>",
	function(){
		console.log("Completed animation.");
	}
);');



res('etreecell.bindStyleCell', 'Binding Style of cell in etreecell Canvas.(for CELL SDK)', array(
    '*cell' => 'object/Binder(parent) cell.',
    '*object' => 'object/Binded object.',
    'bindingStyle || ["x", "y", "width", "height"]' => 'array/Input array for bind position (x or y) or size (width or height).'
), null, 'var cell1 = etcl.createCell("cell1");

// Create Text of Raphael Object ( canvas is "etcl.paper" ).
var text1 = etcl.paper.text(0, 0, "hello");

// Cell1 is bind the text for fix position "x" and resizing size "width".
etcl.bindStyleCell(cell1, text1, ["x", "width"]);');




res('etreecell.unbindStyleCell', 'Ring off binding Style of cell in etreecell Canvas.(for CELL SDK)', array(
    '*cell' => 'object/Binded(parent) cell.',
    '*object' => 'object/Object for unbind.',
    'unbindingStyle || ["x", "y", "width", "height"]' => 'array/Input array for unbind position (x or y) or size (width or height).'
), null, 'var cell1 = etcl.createCell("cell1");

// Create Text of Raphael Object ( canvas is "etcl.paper" ).
var text1 = etcl.paper.text(0, 0, "hello");

// Cell1 is bind the text for fix position "x" and resizing size "width".
etcl.bindStyleCell(cell1, text1, ["x", "width"]);

// Cell1 is unbind all style of text.
etcl.bindStyleCell(cell1, text1);');



res('etreecell.setDataCell', 'Set the data of cell in etreecell Canvas.', array(
    '*cell' => 'object/Cell object for set the data.',
    '*key' => 'int/Key for setting. (you able to using String.)',
    '*data' => 'string/Data for setting. (This argument type is able to custom type.)'
), null, 'var cell1 = etcl.createCell("cell1");
	
// Set the "hello" data in 0 key.
etcl.setDataCell(cell1, 0, "hello");

// Set the 35035 data in 1 key. (Data type is free.)
etcl.setDataCell(cell1, 1, 35035);');



res('etreecell.onLinked', 'Excute function when linked in etreecell Canvas.', array(
    '*function' => 'function/Object of link.'
), array(
    'function',
    'function',
    'Return to value of parameter\'s function.'
), '// Create Cell for link.
var cell1 = etcl.createCell("cell1");
var cell2 = etcl.createCell("cell2", { stroke : "#eeeee", stroke-width : 3 });

// Create Link cell1 to cell2.
var link = etcl.createLink(cell1, cell2);
');


res('Cell.link', 'Link cell of parameter.', array(
    '*cell' => 'object/Object of cell.'
), array(
    'link',
    'object',
    'Return Link or Boolean false when link is fail.'
), '// Create Cell for link.
var cell1 = etcl.createCell("cell1");
var cell2 = etcl.createCell("cell2");

// Create Link cell1 to cell2.
var link = cell1.link(cell2);
');


res('Cell.remove', 'Remove cell of parameter.', array(
    '*cell' => 'object/Object of cell.'
), array(
    'Success remove',
    'bool',
    'If remove of cell, return true boolean value. (not false)'
), '// Create Cell for link.
var cell1 = etcl.createCell("cell1");

// Remove the cell1.
// = "etreecell.createLink( cell )" function.
cell1.remove();
');


res('Cell.pushEvent', 'Push the event(listener).', array(
    '*function' => 'function/Function for push the event.',
    '*string' => 'string/Event of push Event.'
), array(
    'Success remove',
    'bool',
    'If remove of cell, return true boolean value. (not false)'
), '// Create Cell for link.
var cell1 = etcl.createCell("cell1");

// Remove the cell1.
// = "etreecell.createLink( cell )" function.
cell1.remove();
');

res('Cell.overrideEvent', 'Push the event(listener).', array(
    '*cell' => 'object/Object of cell.'
), array(
    'Success remove',
    'bool',
    'If remove of cell, return true boolean value. (not false)'
), '// Create Cell for link.
var cell1 = etcl.createCell("cell1");

// Remove the cell1.
// = "etreecell.createLink( cell )" function.
cell1.remove();
');

$listArr = array();
foreach ($entireArr as $k => $v) {
    if (strpos($k, '.')) {
        $tmp                       = explode('.', $k);
        $listArr[$tmp[0]][$tmp[1]] = "*";
    }
}

?>
<div style="position:fixed;float: left; width:250px; height: 100%; background:#222c33; color:#e0e0e0; overflow-y: scroll; z-index: 15;">
	<br />
	<br />
<?php


foreach ($listArr as $k => $v) {
    
    echo '<ul ><b style="font-size : 23px">' . $k . '</b><br/><ul>';
    foreach ($v as $k2 => $v2) {
        echo '<li><a href="#' . $k . '.' . $k2 . '" style="color:#939393">' . $k2 . '()</a></li>';
    }
    echo '</ul></ul><br />';
}

?>
</div>

<div style="position:relative;float: left; margin-left: 280px;">
	<h1>etreecell Documentation</h1>
	<ul>
		<li style="color: #323232 !important">Version : 0.0.1</li>
		<li style="color: #323232 !important">Author : SeoSeungHyun (me@seunghyun.net)</li>
		<li style="color: #323232 !important">License : CC</li>
		<li style="color: #323232 !important">Usage - Insert in &lt;head&gt; tag</li>
		<li><pre><code>// Must have Raphael JS!
&lt;script type="text/javascript" src="js/raphael.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="js/etreecell.js"&gt;&lt;/script&gt;</code></pre></li>
	</ul>

	<br />
	<br />
	<br />
	<?php


foreach ($entireArr as $k => $v) {
    echo $v;
}
?>
</div>
</body>