import express from 'express';
import { 
  createCrop,
  getAllCrops,
  getCropById,
  updateCrop,
  deleteCrop,
  getAllCropsWithoutPagination
} from '../controllers/cropController';

const router = express.Router();

router.post('/', createCrop);
router.get('/', getAllCrops);
router.get('/all', getAllCropsWithoutPagination);
router.get('/:id', getCropById);
router.put('/:id', updateCrop);
router.delete('/:id', deleteCrop);

export default router;