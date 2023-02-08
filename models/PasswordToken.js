const knex = require("../database/connection");
const User = require("./User");
const {v4 : uuidv4} = require('uuid');

class PasswordToken{
    async create(email){

        var user = await User.findByEmail(email);

        if(user != undefined){
            try{
                var token = uuidv4();

                await knex.insert({
                    user_id: user.id,
                    used: 0,
                    token: token
                }).table("passwordtokens")
                return {
                    status: true,
                    token: token
                }
            }catch(err){
                return {
                    status: false, 
                    err: err
                }
            }
        } else {
            return {
                status: false, 
                err: "O E-mail não existe!"
            }
        }
    }

    async validate(token){
        try{
            var result = await knex.select().where({token:token}).table("passwordtokens");
            if(result.length > 0){
                var tk = result[0]; // tk = Token

                if(tk.used){
                    return {
                        status: false
                    }
                } else {
                    return {
                        status: true,
                        token: tk
                    }
                }
            } else {
                return false;
            }
        } catch(err){
            return {
                status: false, 
                err: err
            }
        }
    }

    async setUsed(token){
        await knex.update({used: 1}).where({token: token}).table("passwordtokens");
    }
}

module.exports = new PasswordToken;