const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucketName = 'artnaon-bucket-991';

const uploadHandler = async (file) => {
    const getOrCreateBucket = async (bucketName) => {
        const bucket = storage.bucket(bucketName);
        try {
            const [metadata] = await bucket.getMetadata();
            console.log(`Bucket ${metadata.name} sudah tersedia!`);
            return bucket;
        } catch (error) {
            const optionsCreateBucket = {
                location: 'ASIA-SOUTHEAST2'
            };
            await storage.createBucket(bucketName, optionsCreateBucket);
            console.log(`${bucketName} bucket created successfully`);
            return bucket;
        }
    };

    const bucket = await getOrCreateBucket(bucketName);
    const customMetadata = {
        contentType: file.hapi.headers['content-type'],
        metadata: {
            type: "header-logo"
        }
    };

    const optionsUploadObject = {
        destination: 'bangkit.png',
        metadata: customMetadata
    };

    try {
        const fileBuffer = file._data;
        const fileUpload = bucket.file('bangkit.png');
        await fileUpload.save(fileBuffer, optionsUploadObject);
        console.log(`${file.hapi.filename} uploaded to ${bucketName} bucket`);
        return `${file.hapi.filename} uploaded to ${bucketName} bucket`;
    } catch (uploadError) {
        console.error(`Gagal mengupload ${file.hapi.filename}:`, uploadError.message);
        throw new Error(`Gagal mengupload ${file.hapi.filename}: ${uploadError.message}`);
    }
};

// Fungsi download single object
const downloadHandler = async (request, h) => {
    const { fileName, destination } = request.payload;
    try {
        const bucket = await getOrCreateBucket(bucketName);
        const optionsDownloadObject = {
            destination: destination,
        };

        await bucket.file(fileName).download(optionsDownloadObject);
        console.log(`${fileName} downloaded to ${destination}`);
        return h.response(`${fileName} downloaded successfully to ${destination}`).code(200);
    } catch (downloadError) {
        console.error(`Gagal mendownload ${fileName}:`, downloadError.message);
        return h.response(`Gagal mendownload ${fileName}: ${downloadError.message}`).code(500);
    }
};

module.exports = { uploadHandler, downloadHandler };
