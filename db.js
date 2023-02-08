require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB);

const userSchema = new mongoose.Schema({
    rollno:{
        type:Number,
        required:true
    },
    section:{
        type:String,
        required:true
    }
});

const totalSchema = new mongoose.Schema({
    section:{
        type:String,
        required:true
    },
    compilerDesign:Number,
    compilerDesignLab:Number,
    computerNetwork:Number,
    fullStack:Number,
    fullStackLab:Number,
    elective:Number,
    careerSkill:Number,
    careerSkillLab:Number,
    softwareEngLab:Number

})

const attendanceSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },

    compilerDesign:[String],
    compilerDesignLab:[String],
    computerNetwork:[String],
    fullStack:[String],
    fullStackLab:[String],
    elective:[String],
    careerSkill:[String],
    careerSkillLab:[String],
    softwareEngLab:[String]
});

attendanceSchema.virtual('compilerDesignCount').get(function(){
    return this.compilerDesign.length;
});
attendanceSchema.virtual('compilerDesignLabCount').get(function(){
    return this.compilerDesignLab.length;
});
attendanceSchema.virtual('computerNetworkCount').get(function(){
    return this.computerNetwork.length;
});
attendanceSchema.virtual('fullStackCount').get(function(){
    return this.fullStack.length;
});
attendanceSchema.virtual('fullStackLabCount').get(function(){
    return this.fullStackLab.length;
});
attendanceSchema.virtual('electiveCount').get(function(){
    return this.elective.length;
});
attendanceSchema.virtual('careerSkillCount').get(function(){
    return this.careerSkill.length;
});
attendanceSchema.virtual('careerSkillLabCount').get(function(){
    return this.careerSkillLab.length;
});
attendanceSchema.virtual('softwareEngLabCount').get(function(){
    return this.softwareEngLab.length;
});
attendanceSchema.virtual('totalattendance').get(function(){
    return (this.compilerDesign.length+this.compilerDesignLab.length+this.computerNetwork.length+this.fullStack.length+this.fullStackLab.length+this.elective.length+this.careerSkill.length+this.softwareEngLab.length);
});

function delta(c,d) {
  
    const curr = (c/d)*100; // current percentage

    if(curr>=75){
        return Math.floor((4*c - 3*d)/3);
    }else{
        return Math.ceil(-1*(3*d-4*c));
    }

}

const userModel = mongoose.model('User',userSchema);
const attendanceModel = mongoose.model('Attendance',attendanceSchema);
const totalModel = mongoose.model('total',totalSchema);

function createUser({rollno,section},cb) {
    
    userModel.findOne({rollno},function(err,doc){

        if(err) cb("Some error occured");
        else if(doc) cb("rollno already Exists");
        else {

            userModel.create({rollno,section},function(err,newDoc){
                if(err) cb("Error creating new User");
                else {
                    attendanceModel.create({user:newDoc._id},function(err,newAttend){
                        if(err) cb("Error creating new Attendance Model");
                        else cb(1);
                    });
                }
            });
            
        }
    });

}

function login({rollno},cb) {
    userModel.findOne({rollno},function(err,doc){
        if(err) cb("Some error Occured");
        else if(doc) cb(1);
        else cb("User not registered");
    })
}

function getRecord(rollno,cb) {
    
    var data = {};

    userModel.findOne({rollno},function(err,user) {

        if(err || !user){
            data.status = "Some error occured. Try Logging in again. ";
            cb(data);
        }

        else{

            attendanceModel.findOne({user:user._id},function(err,record){

                if(err || !record){
                    data.status = "Some error occured. Try Logging in again.";
                    cb(data);
                }

                else{

                    totalModel.findOne({section:user.section},function(err,total){

                        if(err || !total){
                            data.status = "Some error occured. Try Logging in again.";
                            cb(data);
                        }

                        else{

                            data.status = 1;
                            data.totalAttendance = record.compilerDesign.length+record.compilerDesignLab.length+record.computerNetwork.length+record.fullStack.length+record.fullStackLab.length+record.elective.length+record.careerSkill.length+record.softwareEngLab.length;
;               
                            data.section = user.section;
                            data.attendance = [record.compilerDesignCount,record.compilerDesignLabCount,record.computerNetworkCount,record.fullStackCount,record.fullStackLabCount,record.electiveCount,record.careerSkillCount,record.careerSkillLabCount,record.softwareEngLabCount];
                            data.totAttend = [total.compilerDesign,total.compilerDesignLab,total.computerNetwork,total.fullStack,total.fullStackLab,total.elective,total.careerSkill,total.careerSkillLab,total.softwareEngLab];
                            
                            data.delta = data.attendance.map(function(c,ind){
                                return delta(c,data.totAttend[ind]);
                            });
                            
                            data.access = 0;
                            data.required = 0;

                            data.totalClasses = 0;

                            data.totAttend.forEach(function(c){
                                data.totalClasses = data.totalClasses+c;
                            });

                            data.totalClasses = ((data.totalAttendance/data.totalClasses)*100).toPrecision(2);

                            data.delta.forEach(function(c){

                                if(c>0)data.access = data.access+c;
                                else data.required = data.required + -1*(c);
                            });

                            cb(data);
                        }

                    })

                }

            })

        }
        

    })

}

function submitUser({date,sub,rollno},cb) {

    userModel.findOne({rollno},function(err,user){

        if(err || !user) cb({status:"Some Error occured."});

        else{

            attendanceModel.findOne({user:user._id},function(err,doc){

                if(err || !doc){
                    cb({status:"Some error occured."});
                }

                else{

                    if(doc[sub].includes(date)){
                        cb({status:"Already Marked!"});
                    }else{
                        
                        doc[sub].push(date);
    
                        doc.save().then(function(newDoc){
                            if(newDoc===doc) cb({status:1});
                            else cb({status:"Error"});
                        });
                    }

                }

            });

        }

    });
}

module.exports = {createUser,login,getRecord,submitUser};