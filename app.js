 const express = require("express"); 
 const app = express(); 
 const bodyParser = require("body-parser");
 const connection = require("./database/database"); //conexão do banco de dados
 const Pergunta = require("./database/Pergunta");
 const Resposta = require("./database/Resposta");

 connection
    .authenticate()
    .then(() => {
      console.log("Conexão com database criada com sucesso");
    })
    .catch((msgErro) =>{
      console.log(msgErro);
    })


 app.set('view engine','ejs'); // utilize o ejs como render html
app.use(express.static('public')); // comando para chamar arquivos estáticos
//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//rotas
 app.get("/",(req,res) => {
   /* res.send("Bem vindo ao meu site!");*/
   
   Pergunta.findAll({ raw: true, order:[
    ['id','DESC']
   ]}).then(perguntas =>{
       
   res.render("index",{
    
    perguntas: perguntas
  })
   }) //SELECT FROM ALL equivalente

   // RENDER: mandando o express renderizar o conteúdo da pasta views (ejs)
 });

  app.get("/perguntar",(req,res) =>{
    res.render("perguntar");    
  });

  app.post("/salvarpergunta",(req,res) => {

    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    Pergunta.create({
      titulo: titulo,
      descricao: descricao

    }).then(() => {
      res.redirect("/");
    })
  });

  app.get("/pergunta/:id",(req,res) => {
    var id = req.params.id;
    Pergunta.findOne({
      where: {id: id}
    }).then(Pergunta =>{
      if( Pergunta != undefined){
        
        res.render("pergunta",{
         pergunta: Pergunta
        });
      }else{

        res.redirect("/");
      }

    })
  });

app.post("/responder", (req,res) => {
  var corpo = req.body.corpo;
  var perguntaId = req.body.pergunta;

  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId
  }).then(() => {
    res.redirect("/pergunta/" + perguntaId);
  });
});


 app.listen(8080,()=>{
    console.log("servidor ta on");
 });
