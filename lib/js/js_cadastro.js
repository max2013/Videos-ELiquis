// JavaScript Document

//Var's
var ip = '192.168.0.146:8888';//'10.0.0.6:8888';
var campos,values;
var arrDadosCampos = new Array();
var arrDadosValues = new Array();
var arrEmails = new Array();


//Array

var ExternalURL = 'http://posevento.com.br/server-app/eliquis/';
//var ExternalURL = 'http://www.abrafarmafuturetrends.com.br/beta/';
$(window).load(function()
{   
    
    ///SEND FORM
    $('#send-form').click(function(e){

        if($('#participantesNome').val() !== '')
                    {
                        db.transaction(handleInsertParticipantesSuccess, handleInsertParticipantesError);
                    
                   
                        function  handleInsertParticipantesSuccess(tx, result)
                        {
                             arrDadosCampos = [];
                             arrDadosValues = [];
                             campos = '';
                             values = '';

                             var postData = $('#form-cadastro').serializeArray();


                             $.each(postData, function(i, index)
                             {
                                arrDadosCampos.push(index.name);
                                arrDadosValues.push('"'+html_entity_decode(index.value)+'"');
                             });

                             campos = implode(", ", arrDadosCampos);
                             values = implode(", ", arrDadosValues);


                             antsDb.handleInsert({tabela:'tb_participantes', txDb:tx, field:campos, value:values});


                             alert('Dados cadastrados com sucesso.');
                             $('#participantesNome').val('');
                             $('#participantesEmail').val('');
                             $('#participantesTelefone').val('');
                             $('#participantesCrm').val('');
                             $('#participantesCidade').val('');
                             $('#participantesObservacao').val('');
                             //window.location.reload();
                             //db.transaction(handleGetDataParticipantesSuccess, handleGetDataParticipantesError);

                        }
                   
                        function  handleInsertParticipantesError(tx, result)
                        {
                            alert('Houve um erro ao cadastrar o participante.');
                        }
                    }
                    else
                    {
                        alert('Por favor preencher o campo nome');
                        $('#participantesNome').focus();
                    }
    });
    
    $('#viewParticipantes').click(function(e)
    {
        $('#tblParticipantes').empty();
        $('#viewEmail').empty();
        
        db.transaction(function(tx)
        {
            
            tx.executeSql('select participantesNome, participantesId from tb_participantes', [], 
            function (tx, result)
            {
                var len = result.rows.length;
                
                if(len < 1){
                    $('#tblParticipantes').append('<tr> <th colspan="3">Nenhum participante cadastrado</th> </tr>');
                 }
                
                else
                 {
                     
                                
                     $('#tblParticipantes').append('<tr> <th colspan="3">Participantes cadastrados</th> </tr>');
                     
                     $('#viewEmail').append('<div class="formSubmitButtonErrorsWrap">'+
                                                '<input type="button" class="buttonWrap button button-orange contactSubmitButton" id="btSendMail" value="Enviar por e-mail"/>'+
                                            '</div>');
                     
                    ///SEND TO MAIL
                    $('#btSendMail').click(function(){
                       $('#viewEmail').empty();
                       $('#viewEmail').append('<div class="formFieldWrap">'+
                                                '<label class="field-title contactEmailField" for="participantesEmail">Representante, informe seu e-mail</label>'+
                                                '<input type="email" name="repEmail" value="" class="contactField" id="repEmail" placeholder="Representante, informe seu e-mail"/>'+
                                              '</div>'+
                                              
                                            '<div class="formSubmitButtonErrorsWrap">'+
                                                '<input type="button" class="buttonWrap button button-turqoise contactSubmitButton" id="btSendMail2" value="Enviar..."/>'+
                                            '</div><br><br>');
                                    
                        $('#btSendMail2').click(function(){
                            
                          
                            db.transaction(function(tx)
                             {
                                 
                                arrEmails = [];
                                 
                                tx.executeSql('select * from tb_participantes', [], 
                                function (tx, result)
                                {
                                    
                                    
                                    for(var i=0; i< len; i++)
                                    {
                                        var dados = result.rows.item(i);
                                        
                                        arrEmails.push(Array(
                                                     {
                                                         id:dados.participantesId, 
                                                         nome:dados.participantesNome, 
                                                         email:dados.participantesEmail,
                                                         telefone:dados.participantesTelefone,
                                                         crm:dados.participantesCrm,
                                                         cidade:dados.participantesCidade,
                                                         observacao:dados.participantesObservacao
                                                     }));
                                                   
                                        
                                    }
                                    
                                    if(i=== len)
                                    {
                                        handleSendDataToMail(arrEmails)
                                    }
                                        
                                    //
                                },
                                function()
                                {
                                    
                                });
                             });
                            
                        });           
                             
                        
                    });
    
    
                     for(var i=0; i< len; i++)
                     {
                         var dados = result.rows.item(i);
                         
                         $('#tblParticipantes').append('<tr id="tr_'+dados.participantesId+'">'+
                                        '<td colspan="2" class="table-sub-title">'+dados.participantesNome+'</td>'+
                                        '<td style="width: 20px" >'+
                                            '<ul class="icon-list">'+
                                                '<li class="delete-list" id="'+dados.participantesId+'">delete</li>'+
                                            '</ul>'+
                                        '</td>'+
                                      '</tr>');
                              
                              
                         $('#'+dados.participantesId).click(function()
                         {
                                var id = $(this).attr('id')
                           
                                if(confirm('Tem certeza que deseja remover este usuário?'))
                                {
                                    db.transaction(function(tx)
                                     {

                                         tx.executeSql('DELETE from tb_participantes WHERE participantesId='+id, [], 
                                         function (tx, result)
                                         {
                                             $('#tr_'+id).remove();
                                             len--;
                                             
                                             if(len === 0)
                                             {
                                                 $('#tblParticipantes').empty();
                                                 $('#viewEmail').empty();
                                                 $('#tblParticipantes').append('<tr> <th colspan="3">Nenhum participante cadastrado</th> </tr>');
                                                 
                                             }
                                         },
                                         function(){
                                             alert('Houve um erro, tente novamente!')
                                         });
                                     });
                                }
                            
                            
                         });
                     }
                     
                 }
            },
            function()
            {
                alert('Houve um erro, por favor feche abra o aplicativo novamente!')
            });
                            
        });
    })
    
    
    
    
    
    
    
    function handleSendDataToMail(arrDados)
    {
        
       var emailRep = $('#repEmail').val();
        $.post(ExternalURL+'Send_Mail_Controll.php',{dados:arrDados, email:emailRep},
        function(data)
        {
           
            if(data.mensagem === 'success')
            {
                alert('Dados enviados com sucesso!');
            }
            else
            {
                alert('Houve um erro ao enviar os dados.')
            }

        },'json');
    }
        
        
});

