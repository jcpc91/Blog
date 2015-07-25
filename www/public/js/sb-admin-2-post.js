/// <reference path="../../typings/jquery/jquery.d.ts"/>
var editor;
//Configuraciòn de plugins
$(function() {

    var lang = $('#lang').val().split('-')[0];
    console.log(lang);
    //datetime-picker
    $('#tfecha').datepicker({
        format: 'dd/mm/yyyy',
        language: lang
    });
    //editor
    editor = $('#tcont').summernote({
        height: 500
    });
    //tags
    $('#tags').select2({
       
    });
});

$(document).ready(function(){
    
    $('form').my({
        ui:{
            '#ttitulo': 'titulo',
            '#tintro': 'introduccion',
            '#tfecha': {
                bind : function(data, value, $ctr){
                    
                    if(value){
                        data.fecha = value;
                        return value;
                    }
                    else
                        return moment(data.fecha).format('DD/MM/YYYY');
                },
                
            },
            '#tags': 'tags',
            '#thtml': {
                bind: 'html',
                init: function($ctr){
                    editor.code($ctr.val());
                }
            }
        }
    }, post);
    
    $('form').on('submit', function(e){
        
        var c = editor.code();
        $('#thtml').val(c);
        
    });
    
    $('#bDelete').on('click', function(){
        if(confirm('Confirma que desea eliminar el artículo?')){
            $('#cmd').val('delete');
        }else
            return false;
    });
    $('#bpublish').on('click', function () {
        $('#cmd').val('publish');
    });
});