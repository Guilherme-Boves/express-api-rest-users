const knex = require("../database/connection");
const bcrypt = require("bcrypt");
const PasswordToken = require("./PasswordToken");

const secret = "MinhaSenhaSecreta";

class User {

    async findAll(){
        try{
            var result = await knex.select(["id", "email", "name", "role"]).table("users");        
            return result;
        }catch(err){
            console.log(err);
            return [];
        }
    }

    async findById(id){
        try{
            var result = await knex.select(["id", "email", "name", "role"]).where({id:id}).table("users");
            if(result.length > 0){
                return result[0];
            } else {
                return undefined
            }
        }catch(err){
            console.log(err);
            return undefined;
        }
    }

    async findByEmail(email){
        try{
            var result = await knex.select(["id", "email", "password", "name", "role"]).where({email:email}).table("users");
            if(result.length > 0){
                return result[0];
            } else {
                return undefined
            }
        }catch(err){
            console.log(err);
            return undefined;
        }
    }

    async new(email, name, password){

        try{
            var hashedPassword = await bcrypt.hash(password, 10);
            await knex.insert({
                email, 
                name, 
                password: hashedPassword, 
                role: 0
            })
            .table("users");

        } catch(err){
            console.log(err)
        }
    }

    async findEmail(email){
        try{
            var result = await knex.select("*").from("users").where({email: email});            
            if(result.length > 0){
                return true;
            } else {
                return false;
            }
        } catch(err){
            console.log(err);
            return false;
        }
    }

    async update(id, email, name, role){

        var user = await this.findById(id);

        if(user != undefined){
            var editUser = {};

            if(email != undefined){
                if(email != user.email){
                    var result = await this.findEmail(email);
                    if(result == false){
                        editUser.email = email;
                    }else {
                        return {
                            status: false, 
                            err: "Email já cadastrado!"
                        }
                    }
                }
            }

            if(name != undefined){
                editUser.name = name;
            }

            if(role != undefined){
                editUser.role = role;
            }

            try {
                await knex.update(editUser).where({id: id}).table("users");
                return {status: true}
            } catch(err){
                return {
                    status: false, 
                    err: err
                }
            }

        } else {
            return {
                status: false, 
                err: "O usuário não existe!"
            }
        }
    }

    async delete(id){
        var user = await this.findById(id);

        if(user != undefined){

            try{
                await knex.delete().where({id: id}).table("users");
                return {status: true}
            } catch(err){
                return {
                    status: false, 
                    err: err
                }
            }

        } else {
            return {
                status: false, 
                err: "O usuário não existe!"
            }
        }
    }

    async changePassword(newPassword, id, token){
        var hashedPassword = await bcrypt.hash(newPassword, 10);
        await knex.update({password: hashedPassword}).where({id: id}).table("users")
        await PasswordToken.setUsed(token);
    }
}

module.exports = new User();