const { findById } = require("../models/User");
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

    async edit(req, res){
        var {id, name, email, role} = req.body;

        var result = await User.update(id, email, name, role);
        if(result != undefined){
            if(result.status){
                res.status(200);
                res.send("Tudo Ok!")
            } else {
                res.status(406);
                res.send(result.err)
            }
        }else {
            es.status(406);
            res.send({err: "Ocorreu um erro no servidor!"})
        }
    }

    async remove(req, res){
        var id = req.params.id;

        var result = await User.delete(id);

        if(result.status){
            res.status(200);
            res.send("Tudo ok");
        }else {
            res.status(406);
            res.send(result.err);
        }
    }

}

module.exports = new UserController();