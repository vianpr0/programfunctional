import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});   

// pengaturan penyimpanan yang telah ditentukan. upload kemudian dapat digunakan sebagai middleware di rute untuk menangani unggahan file.
const upload = multer({ storage });            

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// console.log("dir",__dirname);
// console.log(__filename);

const getData = async (req, res) => {
  try {
    const files = await prisma.file.findMany();
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch files' });
  }
};


const uploadFile = async (req, res) => {
  try {
    // Ambil file yang diunggah dari permintaan (request)
    const file = req.file;

    // Tentukan path lengkap dari file yang diunggah
    const filePath = path.join(__dirname, '../uploads', file.filename);

    // Buat hash menggunakan algoritma SHA-256
    const hash = crypto.createHash('sha256');
    // console.log(hash);

    // Baca isi file sebagai buffer
    const fileBuffer = fs.readFileSync(filePath);
    
    // Update hash dengan buffer file
    hash.update(fileBuffer);
    // console.log(fileBuffer);

    // Hitung checksum dalam bentuk string heksadesimal
    const checksum = hash.digest('hex');
    console.log(checksum);

    // Simpan informasi file dan checksum ke database menggunakan Prisma
    const savedFile = await prisma.file.create({
      data: {
        filename: file.filename,
        checksum: checksum,
      },
    });

    // Kirim respons JSON dengan pesan dan checksum
    res.json({ message: 'File uploaded and checksum calculated', checksum });
  } catch (error) {
    // Tangani error dan kirim respons error
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};


const verifyFile = async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        throw new Error('File not provided');
      }
  
      const filePath = path.join(__dirname, '../uploads', file.filename);
  
      const hash = crypto.createHash('sha256');
      const fileBuffer = fs.readFileSync(filePath);
      hash.update(fileBuffer);
  
      const checksum = hash.digest('hex');
  
      // Ambil checksum yang disimpan dari database menggunakan Prisma
      const savedFile = await prisma.file.findFirst({
        where: {
          filename: file.filename,
        },
      });
  
      if (!savedFile) {
        return res.status(404).json({ message: 'File not found in database' });
      }
  
      if (savedFile.checksum === checksum) {
        res.json({ message: 'File is valid', checksum });
      } else {
        res.json({ message: 'File is corrupted or tampered', checksum });
      }
    } catch (error) {
      console.error('Error verifying file:', error.message);
      res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
  };
  
  

export { upload, uploadFile, verifyFile, getData };
