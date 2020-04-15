const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User } = require('../models');

const router = express.Router();

/// 프로필 페이지 ///
router.get('/profile', isLoggedIn,  (req, res) => {
    res.render('profile', { title: '내 정보 - NodeBird', user: req.user });
});

/// 프로필 수정페이지 ///
router.get('/modify', isLoggedIn, (req, res) => {
    res.render('modify', {title: '내 정보 - NodeBird', user: req.user })
})

/// 회원가입 페이지 ///
router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', {
        title: '회원가입 - NodeBird',
        user: req.user,
        joinError: req.flash('joinError'),
    });
});

/// 메인 페이지 ///
router.get('/', (req, res, next) => {
  Post.findAll({
    include: [{
      model: User,
      arrtributes: ['id', 'nick', 'updatedAt'],
    }, {
      model: User,
      attributes: ['id', 'nick'],
      as: 'Liker',
    }],
    order: [['createdAt', 'DESC']],
  })
  .then((posts) => {
    console.log(posts);
    res.render('main', {
      title: 'NodeBird',
      twits: posts,
      user: req.user,
      loginError: req.flash('loginError'),
    });
  })
  .catch((error) => {
    console.error(error);
    next(error);
  });
});

module.exports = router;
