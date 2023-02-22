const express = require('express');
const middleware= require("../middleware/middleware");
const usermodel=require("./users-model");
const postmodel=require("../posts/posts-model");

// `users-model.js` ve `posts-model.js` sayfalarına ihtiyacınız var
// ara yazılım fonksiyonları da gereklidir

const router = express.Router();

router.get('/', (req, res,next) => {
  // TÜM KULLANICILARI İÇEREN DİZİYİ DÖNDÜRÜN
  usermodel.get().then(users=>{
    res.json(users);
  }).catch(error=>{
    next(error);
  });
});

router.get('/:id',middleware.validateUserId, (req, res,next) => {
  // USER NESNESİNİ DÖNDÜRÜN
  // user id yi getirmek için bir ara yazılım gereklidir

  res.json(req.user);
 
});

router.post('/',middleware.validateUser, (req, res,next) => {
  // YENİ OLUŞTURULAN USER NESNESİNİ DÖNDÜRÜN
  // istek gövdesini doğrulamak için ara yazılım gereklidir.
  usermodel.insert({name:req.name}).then(insertedUser=>{
    res.json(insertedUser);
  }).catch(next);
});

router.put('/:id',middleware.validateUserId,middleware.validateUser ,async(req, res,next) => {
  // YENİ GÜNCELLENEN USER NESNESİNİ DÖNDÜRÜN
  // user id yi doğrulayan ara yazılım gereklidir
  // ve istek gövdesini doğrulayan bir ara yazılım gereklidir.
  try {
    await usermodel.update(req.params.id,{name:req.name});
    let updated=await usermodel.getById(req.params.id);
    res.status(201).json(updated);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', middleware.validateUserId,async(req, res,next) => {
  // SON SİLİNEN USER NESNESİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  try {
    await usermodel.remove(req.params.id);
  res.json(req.user);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/posts', middleware.validateUserId,async (req, res) => {
  // USER POSTLARINI İÇEREN BİR DİZİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
try {
  let userposts= await usermodel.getUserPosts(req.params.id);
  res.json(userposts);
} catch (error) {
  next(error);
}
});

router.post('/:id/posts', middleware.validateUserId,middleware.validatePost,async(req, res,next) => {
  // YENİ OLUŞTURULAN KULLANICI NESNESİNİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  // ve istek gövdesini doğrulayan bir ara yazılım gereklidir.
  try {
    let insertedPost=await postmodel.insert({
      user_id:req.params.id,
      text:req.text
    });
    res.json(insertedPost);
  } catch (error) {
    next(error)
    
  }
});

// routerı dışa aktarmayı unutmayın

router.use((err,res,req)=>{
  res.status(err.status || 500).json({
    customMessage : "Bir hata oluştu",
    message : err.message,

  });
});

module.exports=router;