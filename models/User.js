const knex = require("../database/connection");
const bcrypt = require("bcrypt");

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
}

module.exports = new User();