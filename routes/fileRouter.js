import express from 'express'
import { getData, upload, uploadFile, verifyFile } from '../controllers/fileController.js'

const router = express.Router();

router.post('/upload', upload.single('file'), uploadFile);
router.get('/file', getData);

router.post('/verify', upload.single('file'), verifyFile);

export default router

