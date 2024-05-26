const {Storage} = require('@google-cloud/storage');

const storage = new Storage();
const bucketName = 'bucket-name'
const fileName = 'image.png'

async function download() {
    const options = {
        destination: 'image.png'
    }

    await storage.bucket(bucketName).file(fileName).download(options)
    console.log('Objek berhasil diunduh')
}

download().catch(console.error)