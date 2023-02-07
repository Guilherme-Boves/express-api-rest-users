const User = require("../models/User");

class UserController {
    
    async index(req, res){
        var users = await User.findAll();
        res.json(users);
    }

    async findUserById(req, res){
        var id = req.params.id;
        var user = await User.findById(id);

        if(user == undefined){
            res.status(404);
            res.json({err: "Usuário não encontrado!"})
        } else {            
            res.json(user);
        }
    }

    async create(req, res){
        var {name, email, password} = req.body;

        if(name == undefined || name == ""){
            res.status(400);
            res.json({err: "Nome inválido"});
            return;
        }

        if(email == undefined || email == ""){
            res.status(400);
            res.json({err: "Email inválido"});
            return;
        }

        if(password == undefined || password == ""){
            res.status(400);
            res.json({err: "Senha inválida"});
            return;
        }

        var emailExists = await User.findEmail(email);
        if(emailExists){
            res.status(406);
            res.json({err: "E-mail já cadastrado!"});
            return;
        }

        await User.new(email, name, password);
        
        res.status(200);
        res.send("Ok");
    }

    
}

module.exports = new UserController();