import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

export const create = async (req, res, next) => {
    if (!req.body.title || !req.body.description) {
        return next(errorHandler(400, 'Veuiillez remplir tous les champs'));
    }
    if (req.body.title.length > 20) {
        return next(errorHandler(400, 'Le titre doit avoir au maximum 20 caractères'));
    }
    if (!req.body.image) {
        return next(errorHandler(400, "Veuillez ajouter l'image"));
    }
    const existingPost = await Post.findOne({ title: req.body.title });
    if (existingPost) {
        return next(errorHandler(400, 'Ce titre existe déjà veuillez en choisir un autre'));
    } 
    const slug = req.body.title.split(' ').join('-').toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');
    const newPost = new Post ({
        ...req.body,
        slug,
        userId: req.user.id,
    });
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) { 
        next(error)
    }
};

export const getposts = async (req, res, next) => {
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 8;
      const sortDirection = req.query.order === 'asc' ? 1 : -1;
      const posts = await Post.find({
        ...(req.query.userId && { userId: req.query.userId }),
        ...(req.query.category && { category: req.query.category }),
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.postId && { _id: req.query.postId }),
        ...(req.query.searchTerm && {
          $or: [
            { title: { $regex: req.query.searchTerm, $options: 'i' } },
            { content: { $regex: req.query.searchTerm, $options: 'i' } },
          ],
        }),
      })
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit)
        .populate('userId', 'username');
  
      const totalPosts = await Post.countDocuments();
  
      const now = new Date();
  
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
  
      const lastMonthPosts = await Post.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });
  
      res.status(200).json({
        posts,
        totalPosts,
        lastMonthPosts,
      });
    } catch (error) {
      next(error);
    }
  };

  export const deleteUserPost = async (req, res, next) => {
    const userId = req.user.id;
    const postId = req.params.postId;
    if (!userId) {
      return next(errorHandler(404, 'Utilisateur non trouvé'));
    }
    try {
      const post = await Post.findByIdAndDelete(postId);
      if (!post) {
        return next(errorHandler(404, 'Post non trouvé'));
      }
      res.status(200).json({ message: 'Post supprimé avec succès' });
    } catch (error) {
      next(error);
    }
  }

/* Gestion du Panier */ 
export const addToPanier = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post) {
      return next(errorHandler(404, 'Post non trouvé'));
    }
    if (post.userId.toString() === userId.toString()) {
      return next(errorHandler(400, 'Vous ne pouvez pas ajouter votre propre cours à votre panier'));
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { panier: postId } },
      { new: true }
    );

    if (!user) {
      return next(errorHandler(404, 'Utilisateur non trouvé'));
    }

    res.status(200).json({ message: 'Post ajouté avec succès au panier' });
  } catch (error) {
    next(error);
  }
};

  
export const getPanier = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return next(errorHandler(404, 'Utilisateur non trouvé'));
    }

    const user = await User.findById(userId).populate('panier');
    if (!user) {
      return next(errorHandler(404, 'Utilisateur non trouvé'));
    }
    res.status(200).json(user.panier);
  } catch (error) {
    next(error);
  }
}

export const deletepostpanier = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    if (!userId) {
      return next(errorHandler(404, 'Utilisateur non trouvé'));
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { panier: postId } },
      { new: true }
    )
      if (!user) {
        return next(errorHandler(404, 'Utilisateur non trouvé'));
      }
      res.status(200).json({ message: 'Cours supprimé avec succès' });
  } catch (error) {
      next(error);
  }
}  

export const deletepanier = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return next(errorHandler(404, 'Utilisateur non trouvé'));
    }
    const user = await User.findByIdAndUpdate(userId, { panier: [] }, { new: true });
    if (!user) {
      return next(errorHandler(404, 'Utilisateur non trouvé'));
    }
    res.status(200).json({ message: 'Panier vidé avec succès' });
  } catch (error) {
    next(error);
  }
}

  
