const admin = require('firebase-admin');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const serviceAccount = require('../bpjph-wikia-firebase-key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'bpjph-wikia.appspot.com'
});

const bucket = admin.storage().bucket();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const imageUpload = (file, folder = 'uploads') => {
    return new Promise((resolve, reject) => {
        if (!file) {
            return reject('No file uploaded.');
        }

        const fileName = `${folder}/${uuidv4()}${path.extname(file.originalname)}`;
        const fileRef = bucket.file(fileName);

        const stream = fileRef.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });

        stream.on('error', (err) => {
            console.error(err);
            reject('Error uploading file.');
        });

        stream.on('finish', async () => {
            try {
                await fileRef.makePublic();
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileRef.name}`;
                resolve(publicUrl);
            } catch (error) {
                console.error(error);
                reject('Error making file public.');
            }
        });

        stream.end(file.buffer);
    });
};

module.exports = { imageUpload, upload };
