const {Storage} = require('@google-cloud/storage');

const storage = new Storage();
const bucketName = 'artnaon-bucket'
const fileName = 'bangkit.png'

async function download() {
    const options = {
        destination: './img/bangkit.png'
    }

    await storage.bucket(bucketName).file(fileName).download(options)
    console.log('Objek berhasil diunduh')
}

download().catch(console.error)