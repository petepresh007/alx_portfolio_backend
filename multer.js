const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('./middleware/aws');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload')
    },
    filename: (res, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})


const s3_upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, Date.now().toString() + '-' + file.originalname);
        }
    })
});

const upload = multer({ storage: storage });

module.exports = {
    upload,
}