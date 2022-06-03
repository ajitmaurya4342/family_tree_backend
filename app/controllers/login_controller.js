const { response } = require("express");
const CheckValidation = require("@/lib/CheckValidation").checkValidation;
const pagination = require("@/lib/pagination").pagination;
const moment =require("moment");
const { offset } = require("../../config/database");
// const cheerio = require('cherio')

module.exports.loginUser = async function(req, res, next) {
    const reqbody =req.body;
    const checkFeild=["user_name","password"]
    const heirachy_id= reqbody.heirachy_id || 1;
    const checkValidation=await CheckValidation(checkFeild,reqbody)
    if(!checkValidation.status){
        return res.send(checkValidation)
    }
    const checkUserExist=await global.knexConnection("users").where({"user_is_active":"Y",password:reqbody.password,heirachy_id:heirachy_id}).andWhere(builder=>{
        builder.where("email","=",reqbody.user_name)
        builder.orWhere("phone_number","=",reqbody.user_name)
  
    })
    if(checkUserExist.length>0){
        return res.send({message:"Login Successfully",status:true,Records:checkUserExist})
    }else{
        return res.send({message:"Invalid Credential User",status:false})
    }
}

module.exports.getUserList = async function(req, res, next) {
    const reqbody ={...req.params,...req.body};
    const heirachy_id= reqbody.heirachy_id;
    const checkFeild=["heirachy_id"]
    const checkValidation=await CheckValidation(checkFeild,reqbody)
    if(!checkValidation.status){
        return res.send(checkValidation)
    }
    const checkUserExist=await global.knexConnection("users").where({"user_is_active":"Y",heirachy_id:heirachy_id}).where("user_level",">",0)
    if(checkUserExist.length>0){
        return res.send({message:"Login Successfully",status:true,Records:checkUserExist})
    }else{
        return res.send({message:"Invalid Credential User",status:false})
    }
}


module.exports.addEditUsers = async function(req, res, next) {
    const reqbody ={...req.params,...req.body};
    const heirachy_id= reqbody.heirachy_id;
    const checkFeild=["first_name","last_name","email","phone_number","gender","dob","heirachy_id"]
    const checkValidation=await CheckValidation(checkFeild,reqbody)
 

    if(!checkValidation.status){
        return res.send(checkValidation)
    }

    let checkUserExist=[]

    if(!reqbody.user_id){
         checkUserExist=await global.knexConnection("users").where({"user_is_active":"Y",heirachy_id:heirachy_id}).andWhere(builder=>{
            builder.where("email","=",reqbody.email)
            builder.orWhere("phone_number","=",reqbody.phone_number)
        })
    }
 
    if(checkUserExist.length>0){
        return res.send({message:"User Already Exists",status:false})
    }else{

        let obj= {
            first_name:reqbody.first_name,
            last_name:reqbody.last_name,
            email:reqbody.email,
            phone_number:reqbody.phone_number,
            picture:reqbody.picture,
            gender:reqbody.gender,
            description:reqbody.description,
            extra_keys:reqbody.extra_keys?JSON.stringify(reqbody.extra_keys):null,
            dob:moment(reqbody.dob).format("YYYY-MM-DD"),
            is_married:reqbody.is_married,
            is_admin:"N",
            password:`${reqbody.first_name.substring(0, 3)}${moment(reqbody.dob).format("YYYY")}`,
            heirachy_id:heirachy_id
        }

        let user_id;
        let message;

        if(!reqbody.user_id){
            obj["created_at"]=moment().format("YYYY-MM-DD")  
          let  user_insert= await global.knexConnection("users").insert(obj)
          user_id = user_insert[0]
          message=  "Signup Successfully"
        }else{
            user_id=reqbody.user_id
            obj["updated_at"]=moment().format("YYYY-MM-DD") 
            await global.knexConnection("users").update(obj).where({user_id:reqbody.user_id})
          message=  "Updated Successfully"

        }
        let user_details=await global.knexConnection("users").where({user_id})
        return res.send({message:message,status:true,Records:user_details})
    }
}




