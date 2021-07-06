const express = require("express"),
  PostsController = require("../controllers/posts");

const router = express.Router();

router.get('/', PostsController.getPosts);
router.post('/', PostsController.createPost);
router.patch('/:id', PostsController.updatePost);
router.delete('/:id', PostsController.deletePost);
router.patch('/:id/likePost', PostsController.likePost);

module.exports = router;
