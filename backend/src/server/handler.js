const { Storage } = require("@google-cloud/storage");

// Membuat Client
const storage = new Storage();

// Membuat nama bucket
const bucketName = 'artnaon-bucket';

// Fungsi untuk membuat bucket jika tidak ditemukan.
const getOrCreateBucket = async (bucketName) => {
    const bucket = storage.bucket(bucketName);
    try {
        // Mendapatkan informasi bucket jika ada.
        const [metadata] = await bucket.getMetadata();
        console.log(`Bucket ${metadata.name} sudah tersedia!`);
        return bucket;
    } catch (error) {
        const optionsCreateBucket = {
            location: 'ASIA-SOUTHEAST2',
        };
        // Create Bucket
        await storage.createBucket(bucketName, optionsCreateBucket);
        console.log(`${bucketName} bucket created successfully`);
        return bucket;
    }
};

// Fungsi upload single object
const uploadHandler = async (request, h) => {
    const filePath = '../src/earbuds.jpg';
    try {
        const customMetadata = {
            contentType: 'image/jpeg',
            metadata: {
                type: "header-logo",
            },
        };

        const optionsUploadObject = {
            destination: 'dicoding-header-logo.png',
            metadata: customMetadata,
        };

        const bucket = await getOrCreateBucket(bucketName);
        await storage.bucket(bucketName).upload(filePath.path, optionsUploadObject);
        console.log(`${filePath.path} uploaded to ${bucketName} bucket`);
        return h.response(`${filePath.path} uploaded successfully`).code(200);
    } catch (uploadError) {
        console.error(`Gagal mengupload ${filePath.path}:`, uploadError.message);
        return h.response(`Gagal mengupload ${filePath.path}: ${uploadError.message}`).code(500);
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
