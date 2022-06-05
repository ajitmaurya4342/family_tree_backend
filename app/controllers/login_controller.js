const { response } = require("express");
const CheckValidation = require("@/lib/CheckValidation").checkValidation;
const pagination = require("@/lib/pagination").pagination;
const moment =require("moment");
const { offset } = require("../../config/database");
// const cheerio = require('cherio')
var _ = require('lodash');
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
    let checkUserExist=await global.knexConnection("users")
    .select(global.knexConnection.raw(`users.*,user_relation.parent_id,user_parent.user_level as parent_level, 
    user_wife_details.first_name as w_first_name, user_wife_details.last_name as w_last_name,user_wife_details.picture as w_picture,
    user_husband_details.first_name as h_first_name, user_husband_details.last_name as h_last_name,user_husband_details.picture as h_picture`))
    .leftJoin("user_relation","user_relation.user_id","users.user_id")
    .leftJoin("users as user_parent","user_relation.parent_id","user_parent.user_id")
    .leftJoin("users as user_wife_details","user_wife_details.user_id","users.wife_id")
    .leftJoin("users as user_husband_details","user_husband_details.user_id","users.husband_id").where({"users.heirachy_id":heirachy_id}).orderBy("user_id","DESC")
    if(checkUserExist.length>0){
        let tempUserArray=[...checkUserExist]
        checkUserExist.map(z=>{
         z["relation"]="";
         z["relation_linked"]=true;
         z["full_name"]=`${z.first_name} ${z.last_name}`;
         z["dob"]=z.dob?moment(z.dob).format("DD, MMM YYYY"):"Not Mentioned";
         console.log(z.is_son_of,z.user_id)
         if(z.user_level==1){
           z["relation"]=`Root of Family`
         }else if(z.is_son_of=='Y' ||  z.is_daughter_of=='Y'){
             console.log("checjj")
         let parentDetail=tempUserArray.filter(_z=>{
             return _z.user_id==z.parent_id
         })
         if(parentDetail.length>0){
             let message=z.is_daughter_of=='Y'?`Daughter of Mr.`:`Son of Mr.`
             z["relation"]=`${message}${parentDetail[0].first_name} ${parentDetail[0].last_name} `
          }
        
         }else if(z.gender=='Female'){
            let husbandFind=tempUserArray.filter(_z=>{
                return _z.wife_id==z.user_id
            })
            if(husbandFind.length>0){
                let message=`Wife of Mr.`
                z["relation"]=`${message}${husbandFind[0].first_name} ${husbandFind[0].last_name} `
             }
         }else if(z.gender=='Male'){
            let wifeFind=tempUserArray.filter(_z=>{
                return _z.husband_id==z.user_id
            })
            if(wifeFind.length>0){
                let message=`Husband of Mrs.`
                z["relation"]=`${message}${wifeFind[0].first_name} ${wifeFind[0].last_name} `
             }
         }
         if(!z.relation){
            z.relation="Relation Linked Pending"
            z.relation_linked=false
         }
        })

        return res.send({message:"Login Successfully",status:true,Records:checkUserExist})
    }else{
        return res.send({message:"Invalid Credential User",status:false})
    }
}


module.exports.addEditUsers = async function(req, res, next) {
    const reqbody ={...req.params,...req.body};
    const heirachy_id= reqbody.heirachy_id;
    const checkFeild=["first_name","last_name","email","phone_number","gender","dob","heirachy_id","is_married"]
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
            picture:reqbody.picture || null,
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

const deattachRelation =async function(user_id) {
  let remove_from_parent_table=await global.knexConnection("user_relation").del().where({user_id})
  let remove_link_from3=await global.knexConnection("users").update({user_level:null}).where({user_id:user_id})
  let remove_link_from1=await global.knexConnection("users").update({husband_id:null,user_level:null}).where({husband_id:user_id})
  let remove_link_from2=await global.knexConnection("users").update({wife_id:null,user_level:null}).where({wife_id:user_id})

}

module.exports.linkRelation=async function(req, res, next) {
    const reqbody ={...req.params,...req.body};
    const heirachy_id= reqbody.heirachy_id;
    if(!reqbody.user_id){
     return res.send({status:false,message:"User ID Needed"})
    } 
    const getUserDetail=await global.knexConnection("users").where({user_id:reqbody.user_id})
    if(getUserDetail.length==0){
     return res.send({status:false,message:"User Not Found"})
    }
    const checkFeild=["user_id","heirachy_id"]

    if(getUserDetail[0].gender=="Male"){
        checkFeild.push("is_son_of")
    }

    console.log(checkFeild)
    
    if(getUserDetail[0].gender=="Female"){
        checkFeild.push("is_daughter_of")
    }
    const checkValidation=await CheckValidation(checkFeild,reqbody)
    
    if(!checkValidation.status){
        return res.send(checkValidation)
    }
    let is_insert_in_relation=false

    //For Male Validation
    const checkValidatin=[]
    if(getUserDetail[0].gender=="Male"){
     if(reqbody.is_son_of=='Y'){
        is_insert_in_relation=true
        checkValidatin.push("parent_id") //Only Father Id
      }else {
        checkValidatin.push("wife_id")  //Wife should be only daughter of
      }

    }
       
    if(getUserDetail[0].gender=="Female"){
        if(reqbody.is_daughter_of=='Y'){
            is_insert_in_relation=true
           checkValidatin.push("parent_id") //Only Father Id
         }else{
           checkValidatin.push("husband_id")  //Husbdand should be son of
         }
     }

    const checkValidationNew=await CheckValidation(checkValidatin,reqbody)
    
    if(!checkValidationNew.status){
        return res.send(checkValidationNew)
    }

    if(is_insert_in_relation){
        let parentLevel=await global.knexConnection("users").where({user_id:reqbody.parent_id})
        if(parentLevel.length==0){
          return res.send({status:false,message:"No Parent Found"})
        }
        let obj={
            user_id:reqbody.user_id,
            parent_id:reqbody.parent_id,
            created_at:moment().format("YYYY-MM-DD")
        }
        await deattachRelation(reqbody.user_id)

        await  global.knexConnection("user_relation").insert(obj);
        await  global.knexConnection("users").update({user_level:parentLevel[0].user_level+1}).where({"user_id":reqbody.user_id});
    }else{
        if(reqbody.wife_id){
         let wifeExist=await global.knexConnection("users").where({user_id:reqbody.wife_id})
        if(wifeExist.length==0){
          return res.send({status:false,message:"No User Found for Selected User. Please contact to admin"})
        } 
        if(wifeExist[0].husband_id  && reqbody.user_id!=wifeExist[0].husband_id){
            return res.send({status:false,message:"You cannot select this wife.Please contact to Admin"})
        }
        await deattachRelation(reqbody.user_id)

        await  global.knexConnection("users").update({husband_id:reqbody.user_id}).where({"user_id":reqbody.wife_id});
        
        }else{
            let husbandExist=await global.knexConnection("users").where({user_id:reqbody.husband_id})
            if(husbandExist.length==0){
              return res.send({status:false,message:"No User Found for Selected User.Please contact to Admin"})
            } 
            if(husbandExist[0].wife_id && reqbody.user_id!=husbandExist[0].wife_id){
                return res.send({status:false,message:"You cannot select this husband.Please contact to Admin"})
            }
            await deattachRelation(reqbody.user_id)

            await  global.knexConnection("users").update({wife_id:reqbody.user_id}).where({"user_id":reqbody.husband_id});

        }
    }
    return res.send({status:true,message:"Relation Linked Successfully"});

}

module.exports.deattachRelation=async function(req, res, next) {
    const reqbody ={...req.params,...req.body};
    const heirachy_id= reqbody.heirachy_id;
    const checkFeild=["user_id","heirachy_id"]
    const checkValidation=await CheckValidation(checkFeild,reqbody)
    if(!checkValidation.status){
        return res.send(checkValidation)
    }
    await deattachRelation(reqbody.user_id);
    return res.send({status:true, message:"Dettached Successfully"})
}


module.exports.getHeirachyFamily=async function(req, res, next) {
    const reqbody ={...req.params,...req.body};
    const heirachy_id= reqbody.heirachy_id;
    const checkFeild=["heirachy_id"]
    const checkValidation=await CheckValidation(checkFeild,reqbody)
    if(!checkValidation.status){
        return res.send(checkValidation)
    }
    let users=await global.knexConnection("users")
    .select(global.knexConnection.raw(`users.*,user_relation.parent_id,user_parent.user_level as parent_level, 
    user_wife_details.first_name as w_first_name, user_wife_details.last_name as w_last_name,user_wife_details.picture as w_picture,
    user_husband_details.first_name as h_first_name, user_husband_details.last_name as h_last_name,user_husband_details.picture as h_picture`))
    .leftJoin("user_relation","user_relation.user_id","users.user_id")
    .leftJoin("users as user_parent","user_relation.parent_id","user_parent.user_id")
    .leftJoin("users as user_wife_details","user_wife_details.user_id","users.wife_id")
    .leftJoin("users as user_husband_details","user_husband_details.user_id","users.husband_id").orderBy("users.user_level")

    const Only_USER_WITH_LEVEL=users.filter(z=>{
        return (z.user_level && z.parent_level) || z.user_level==1;
    })
    
    let heirachy_tree=[]
   
    Only_USER_WITH_LEVEL.map(z=>{
       let secondPerson={
            name: `Mrs. ${z.last_name}`,
          };
        if(z.w_last_name){
            secondPerson={
                name: `${z.w_first_name} ${z.w_last_name}`,
              };
              if(z.w_picture){
                secondPerson["image"]=z.w_picture
              }
        }else if(z.h_last_name){
            secondPerson={
                name: `${z.h_first_name} ${z.h_last_name}`,
            };
            if(z.h_picture){
                secondPerson["image"]=z.h_picture
              }
        }
     
        let obj={
            user_id:z.user_id,
            parent_id:z.parent_id,
            firstPerson: {
                  name: `${z.first_name}${z.last_name}`,
                 
             },
              secondPerson: secondPerson
       
        }

        if(z.is_married=='N'){
          delete obj["secondPerson"]
        }
        if(z.picture){
            obj.firstPerson["image"]=z.picture
        }
        heirachy_tree.push(obj)
    })



    const hierarchy = (data) => {
        const tree = [];
        const childOf = {};
        data.forEach((item) => {
            const { user_id ,parent_id} = item;
            childOf[user_id] = childOf[user_id] || [];
            item.children = childOf[user_id];
           

            parent_id ? (childOf[parent_id] = childOf[parent_id] || []).push(item) : tree.push(item);
        });
        return tree;
    };
    
    // print
    let FInalHeirachy=hierarchy(heirachy_tree, { idKey: 'user_id', parentKey: 'parent_id' });

    return res.send({status:true, message:"Heirachhy Successfully",Only_USER_WITH_LEVEL,Records:FInalHeirachy})
}



