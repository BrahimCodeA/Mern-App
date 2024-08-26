import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, getposts, deleteUserPost, deletepostpanier, addToPanier, getPanier, deletepanier } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/getposts', getposts);
router.delete('/deleteuserpost/:postId', verifyToken, deleteUserPost)
router.put('/addtopanier/:postId', verifyToken, addToPanier);
router.get('/panier', verifyToken, getPanier);
router.delete('/deletepostpanier/:postId', verifyToken, deletepostpanier);
router.delete('/deletepanier', verifyToken, deletepanier)


export default router;