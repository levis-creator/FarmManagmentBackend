import express from 'express';
import {
  createCrop,
  getAllCrops,
  getCropById,
  updateCrop,
  deleteCrop,
} from '../controllers/cropController';

const router = express.Router();

router.post('/', createCrop);
router.get('/', getAllCrops);
router.get('/:id', getCropById);
router.put('/:id', updateCrop);
router.delete('/:id', deleteCrop);

export default router;