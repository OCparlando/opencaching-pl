<?php
/***************************************************************************
	*                                         				                                
	*   This program is free software; you can redistribute it and/or modify  	
	*   it under the terms of the GNU General Public License as published by  
	*   the Free Software Foundation; either version 2 of the License, or	    	
	*   (at your option) any later version.
	*
	***************************************************************************/

/****************************************************************************
	  
   Unicode Reminder ??
                                       				                                
	 view all logs of a cache

 ****************************************************************************/
?>
<script type="text/javascript">
<!--
var rot13tables;
function createROT13tables() {
var A = 0, C = [], D = "abcdefghijklmnopqrstuvwxyz", B = D.length;
for (A = 0; A < B; A++) {C[D.charAt(A)] = D.charAt((A + 13) % 26)}
for (A = 0; A < B; A++) {C[D.charAt(A).toUpperCase()] = D.charAt((A + 13) % 26).toUpperCase()}return C}
function convertROT13String(C) {
var A = 0, B = C.length, D = "";if (!rot13tables) {rot13tables = createROT13tables()}for (A = 0; A < B; A++) {
D += convertROT13Char(C.charAt(A))}return D}
function convertROT13Char(A) {return (A >= "A" && A <= "Z" || A >= "a" && A <= "z" ? rot13tables[A] : A)}
function convertROTStringWithBrackets(C) {var F = "", D = "", E = true, A = 0, B = C.length;if (!rot13tables) {
rot13tables = createROT13tables()}
for (A = 0; A < B; A++) {F = C.charAt(A);if (A < (B - 4)) {if (C.toLowerCase().substr(A, 4) == "<br/>") {D += "<br>";
A += 3;continue}}if (F == "[" || F == "<") {E = false} else {if (F == "]" || F == ">") {E = true} else {
if ((F == " ") || (F == "&dhbg;")) {} else {if (E) {F = convertROT13Char(F)}}}}D += F}return D};
-->
</script>
			<div class="content2-container bg-blue02">
				<p class="content-title-noshade-size1">
				<img src="tpl/stdstyle/images/blue/logs.png" class="icon32" alt=""/>
			&nbsp;Wpisy do logów dla skrzynki <a href="viewcache.php?cacheid={cacheid}">{cachename}</a>&nbsp;&nbsp;
			&nbsp;&nbsp;
			{found_icon} {founds}x 
			{notfound_icon} {notfounds}x 
			{note_icon} {notes}x
				</p>
			</div>
<div class="content2-container" id="viewcache-logs">
		{logs}
</div>
<div id="viewlogs-end">[<a href="viewcache.php?cacheid={cacheid}">Powrót do skrzynki</a>]</div>
