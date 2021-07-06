const mongoose = require("mongoose"),
  PostMessage = require("../models/posts.js");

exports.getPosts = async (req, res, next) => {
  try {
    const postMessages = await PostMessage.find();

    return res.status(200).json(postMessages);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

exports.getPost = async (req, res, next) => {
  const { id } = req.params;

  try {
    const post = await PostMessage.findById(id);

    return res.status(200).json(post);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

exports.createPost = async (req, res, next) => {
  const post = req.body;

  const newPostMessage = new PostMessage({ ...post, createdBy: req.userId });

  try {
    await newPostMessage.save();

    return res.status(201).json(newPostMessage);
  } catch (error) {
    return res.status(409).json({ message: error.message });
  }
};

exports.updatePost = async (req, res, next) => {
  const { id } = req.params;
  const { title, message, selectedFile, tags } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updatedPost = {
    updatedBy: req.userId,
    title,
    message,
    tags,
    selectedFile,
    _id: id,
  };

  await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

  return res.json(updatedPost);
};

exports.deletePost = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  await PostMessage.findByIdAndRemove(id);

  return res.json({ message: "Post deleted successfully." });
};

exports.likePost = async (req, res, next) => {
  const { id } = req.params;

  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const post = await PostMessage.findById(id);

  const index = post.likes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }
  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  return res.status(200).json(updatedPost);
};
