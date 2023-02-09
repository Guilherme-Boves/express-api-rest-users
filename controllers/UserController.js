const User = require("../models/User");
const PasswordToken = require("../models/PasswordToken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secret = "MinhaSenhaSecreta";

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

        if(name == undefined || name == "" || name == ' '){
            res.status(400);
            res.json({err: "Nome inválido"});
            return;
        }

        if(email == undefined || email == "" || email == ' '){
            res.status(400);
            res.json({err: "Email inválido"});
            return;
        }

        if(password == undefined || password == "" || password == " "){
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

    async recoverPassword(req, res){
        var email = req.body.email;

        var result = await PasswordToken.create(email);
        if(result.status){
            //console.log(result.token)
            res.status(200);
            res.send("" + result.token);

            //NodeMailer.send();

        } else {
            res.status(406);
            res.send(result.err)
        }
        
    }

    async changePassword(req, res) {
        var token = req.body.token;
        var password = req.body.password;

        var isTokenValid = await PasswordToken.validate(token);

        if(isTokenValid.status){
            await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token)
            res.status(200);
            res.send("Senha Alterada!");
        } else {
            res.status(406);
            res.send("Token inválido");
        }
    }

    async login(req, res){
        var {email, password} = req.body;

        var user = await User.findByEmail(email);

        if(user != undefined){

            var result = await bcrypt.compare(password, user.password);
            if(result){

                var token = jwt.sign({
                    email: user.email,
                    role: user.role
                }, secret);

                res.status(200)
                res.json({token})
                
            } else {
                res.status(400);
                res.json({err: "E-mail ou senha inválidos!"});
            }

        } else {
            res.status(400);
            res.json({err: "E-mail ou senha inválidos!"});
        }
    }
}

module.exports = new UserController();