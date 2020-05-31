

// Login user
exports.loginUser= (req,res,next) =>{
    User.find({mobile:req.body.mobile})
    .exec()
    .then(user => {
        if(user.length < 1){
            res.status(401).json({
                message : 'Auth Failed'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
            if(err){
                res.status(401).json({
                    message : 'Auth Failed'
                }); 
            }
            if(result){
                const token = jwt.sign({
                    mobile:user[0].mobile,
                    userId:user[0]._id
                },
                'RADHASWAMI',
                {
                    expiresIn: '1h',

                });

                res.status(200).json({
                    message : 'Auth Successful',
                    token: token
                }); 
            }
            if(err){
                res.status(401).json({
                    message : 'Auth Failed'
                });
            }
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    })
};


// Delete User
exports.userDelete = (req,res,next) =>{
    console.log(req.params)
    User.remove({ _id: req.params.userId})
    .exec()
    .then(result =>{
        res.status(200).json({
            message:'User deleted',
            result : result
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
};

//Get all Users
exports.GetAllUser = (req,res) =>{
    User.find()
    .then(result => {
        res.send(result);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};

//Get Single Users by id
exports.GetUserById = (req,res) =>{
    
    User.findById({ _id: req.params.userId})
    .exec()
    .then(result => {
        res.status(200).json({
            data:result
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};

//Update Single Users by id
exports.UpdateUserById = (req,res) =>{

    bcrypt.hash(req.body.password,10, (err,hash)=>{
        if(err){
           return res.status(500).json({
                error:err
            });
        }else{
            const dataModel = {
                mobile : req.body.mobile,
                password : hash
            }
            User.findByIdAndUpdate(req.params.userId,{$set:dataModel},{new: true} )
            .exec()
            .then(result => {
                res.status(200).json({
                    message:'User Successfully Updated',
                    data:result
                });
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while Updating users."
                });
            });

        }
    })
    // User.findByIdAndUpdate({ _id: req.params.userId, mobile:req.body.mobile, new: true})
    // .exec()
    // .then(result => {
    //     res.status(200).json({
    //         message:'User Successfully Updated',
    //         data:result
    //     });
    // }).catch(err => {
    //     res.status(500).send({
    //         message: err.message || "Some error occurred while Updating users."
    //     });
    // });
};



// Get GetEmployees list
exports.GetMarcoPole = (req,res) => {
    const start = Number(req.params.startR);
    const end = Number(req.params.endR);
    var Output='';
    if(start < 1 && end > 1000000){
        res.send(401).json({message:'Start and end point must be between 1 to 1,000,000'});
    }
    console.log(typeof(start));
    for(let i = start; i <= end; i++){
        if((i%4 == 0) && (i%7==0) ){
            if(i == start){
                Output = 'marcopolo';
            }else{
                Output = Output + ',' + 'marcopolo'
            }
        }else if(i%4 == 0){
            if(i == start){
                Output = 'marco';
            }else{
                Output = Output + ',' + 'marco'
            }
        }else if(i%7 == 0){
            if(i == start){
                Output = 'polo';
            }else{
                Output = Output + ',' + 'polo'
            } 
        }else{
            if(i == start){
                Output = i;
            }else{
                Output = Output + ',' + i
            } 
        }
    }
    res.status(200).json({
        message:'Welcome To Marco Polo Game',
        result:Output
    })
}
