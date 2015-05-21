// JavaScript Document

//Var's
var ip = '192.168.0.124:81';//'10.0.0.6:8888';
var db;
var campos,values;
var arrDadosCampos = new Array();
var arrDadosValues = new Array();
        
//var ExternalURL = 'http://'+ip+'/googledrive/Server/Projetos/MaxExperience/Desenvolvimento/Clientes/Abrafarma/Site/';
var ExternalURL = 'http://www.abrafarmafuturetrends.com.br/beta/';
var antsDb = new AntsDB();    


function onDeviceReady()
{
    sessionStorage.firstname = 'Rafael';
    antsDb.handleConnect();
    antsDb.handleCreateDb();
}

///PLUGIN DB-Data Base
function AntsDB(){
    
    //HandleConnect
    this.handleConnect = function()
    {
        db = openDatabase('App_Abrafarma', '1.0', '@ralves_sql', 50 * 1024 * 1024);
    },
    
    //HandleCreateDb
    this.handleCreateDb = function (){
       
       db.transaction(handleCreateSuccess, handleCreateError);
        
        function handleCreateSuccess(tx, result) {
            
             tx.executeSql('DROP TABLE IF EXISTS tb_participantes');
             
            //Tb Participantes
            var sql = 
		"CREATE TABLE IF NOT EXISTS tb_participantes( "+
		"participantesId INTEGER PRIMARY KEY AUTOINCREMENT, " +//INTEGER PRIMARY KEY AUTOINCREMENT
		"participantesNome VARCHAR(200), " +
		"participantesEmail VARCHAR(250), " +
		"participantesCrm VARCHAR(40), " +
		"participantesTelefone VARCHAR(40), " +
                "participantesEstado VARCHAR(40), " +
		"participantesData VARCHAR(20), " +
		"participantesStatus INT(11))";
		tx.executeSql(sql);
                
                setTimeout(function() {
                        
                        //$('#divSplash').fadeOut('slow',function()
                        //{
                             //alert('Ola')
                        //});
                        
                }, 2000);
                
        }
        
        function handleCreateError(tx, result)
        {
            alert('Erro ao criar a tabela de participantes');
        }
        
    },
    
    
    
            
    //HandleInsert
    this.handleInsert = function(arrDados) {
         
        arrDados.txDb.executeSql("INSERT INTO "+arrDados.tabela+" ("+arrDados.field+") VALUES ("+arrDados.value+")");
      
    },
    
    //HanldeClean
    this.handleClean = function() {
        
        db.transaction(handleCleanSuccess, handleCleanError);
        
        function handleCleanSuccess(tx, result)
        {
            tx.executeSql('DROP TABLE IF EXISTS tb_participantes');
            
             window.location = 'index.html';
        }
        
        function handleCleanError(tx, result)
        {
            alert('Erro ao desativar o Participante!');
        }
        
    }
    
    
    
}


////PLUGIN VALIDACAO
function AntsValidacao(){
    
    this.validaData = function()
    {
        var i=0;
        $('input, textarea').each(function() {
            // code
            
            if($(this).attr('required'))
            {
                
                if($(this).val() === '')
                {
                   i++;
                } 
            }
           
            
        });
        
        
        if(i > 0)return false;
        else return true;
            
        
    };
}


////PLUGIN VALIDA E-MAIL
function AntsValidacaoEmail(){
    
    this.validaEmail = function(email)
    {
        if(email != "")
        {
           var filtro = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
           if(filtro.test(email))
           {
              return true;
           } else {
             
             return false;
           }
        }
    }
     
}


////PLUGIN CARACTERES ESPECIAIS
function AntsValidacaoCaracteresEspeciais() {
    
    this.validarCaracteres = function(str)
    {
        //se não desejar números é só remover da regex abaixo
        var regex = '[\'\"]'//'[^a-zA-Z0-9]+';
        if(str.match(regex)) {
             //encontrou então não passa na validação
             return false;
        }
        else {
             //não encontrou caracteres especiais
             return true;
        }
    }
   
}



///////////Global Methods//////////////
 
function handlerEraseDbTransaction(tx, result)
{
	
	tx.executeSql('DROP TABLE IF EXISTS tb_estudos');
	tx.executeSql('DROP TABLE IF EXISTS tb_estudos_tipo');
	tx.executeSql('DROP TABLE IF EXISTS tb_aulas');
	tx.executeSql('DROP TABLE IF EXISTS tb_usuarios');
	tx.executeSql('DROP TABLE IF EXISTS tb_palestras');
	tx.executeSql('DROP TABLE IF EXISTS tb_mynote');
	tx.executeSql('DROP TABLE IF EXISTS tb_palestras_palestrantes');
	tx.executeSql('DROP TABLE IF EXISTS tb_palestrantes');
	
	
	$.getJSON(ExternalURL+'adm/lib/php/sm_usuarios.php?acao=delete&idUser='+UserId+'&format=json',function(data){
		
		if(data.mensagem == 'fail')
		{
			alert('E#003 - Informe o Desenvolvedor');//Remover os dados do usuario do banco- adm/lib/php/sm_usuarios.php
		}
		else
		{
			window.location = "index.html";
		}
	});
	
	
}



function handleInputValidacao(){
    var validate = new AntsValidacao();
    return validate.validaData();
}