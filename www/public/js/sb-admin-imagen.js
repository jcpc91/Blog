/// <reference path="../../../typings/jquery/jquery.d.ts"/>
$(document).ready(function(){
	console.log('ready¡');
	$('#cmdsave').on('click', function(){
		$('#cmd').val('upload');
	});
	
	$('#cdmeliminar').on('click', function(){
		$('#cmd').val('delete');
	});
	
	$('form').on('submit', function(){
		console.log($('#cmd').val());
	});
});