const usermodel =require("../users/users-model");






function logger(req, res, next) {

  const method = req.method;
  const url = req.originalUrl;
  const timestamp = new Date().toLocaleString();

  console.log(method+"--"+url+"--"+timestamp);
}

async function validateUserId(req, res, next) {
  
  try {
    let existUser = await usermodel.getById(req.params.id);
    if(!existUser){
      res.status(404).json({message : "not found"});
    }else{
      req.user = existUser;
      next();
    }

  } catch (error) {
    res.status(500).json({message:"Hata oluştu"});
  }
  
}

function validateUser(req, res, next) {
  
  const name = req.body.name;
  if(!name){
    res.status(400).json({message:"gerekli name alanı eksik"}); 
  }else{
    req.name=name;
    next();
  }
}

function validatePost(req, res, next) {
  
  const{text}=req.body;
  if(!text){
    res.status(400).json({message:"gerekli name alanı eksik"});
  }else{
    req.text=text;
    next();
  }
}

// bu işlevleri diğer modüllere değdirmeyi unutmayın

module.exports={
  logger,
  validateUserId,
  validatePost,
  validateUser,
}