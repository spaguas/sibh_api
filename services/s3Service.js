const { S3Client, GetObjectCommand ,ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const moment = require('moment')

const accessKeyId = process.env.MINIO_ACCESS_KEY_ID
const secretAccessKey = process.env.MINIO_SECRET_ACCESS_KEY

const s3 = new S3Client({
    region: 'as-sp-cth-usp', // Região dummy, MinIO ignora
    endpoint: 'http://cth.daee.sp.gov.br:9000',
    credentials:{
        accessKeyId,
        secretAccessKey,
    },
    forcePathStyle: true,
});


const getRadarLastImages = async ({radar_name = 'ponte_nova'}) =>{
    let day = moment().subtract(3, 'hours').format('YYYYMMDD')
    let day_hour = moment().subtract(3, 'hours').format('YYYYMMDDHH')
    
    
    const resp = await s3.send(new ListObjectsV2Command({
        Bucket: 'images',
        StartAfter: `radar/pnova/cappi_24h/${day}/${day_hour}`,
        ContinuationToken: undefined,
        MaxKeys: 1000,
      }));

    const urls = await Promise.all(
        resp.Contents.map(async obj => ({
            lastModified: obj.LastModified,
            key:obj.Key,
            link: await getSignedUrl(s3, new GetObjectCommand({
                Bucket: 'images',
                Key: obj.Key,
              }), { expiresIn: 60 * 20 })
            })
        )
    )
    return urls
}

module.exports = {getRadarLastImages}