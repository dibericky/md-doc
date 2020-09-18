'use strict'

const fs = require('fs')
const path = require('path')
const marked  = require('marked')

const fastify = require('fastify')({
  logger: true
})

const filesDocs = getFilesFromDirDocs()

for (const fileDetail of filesDocs) {
    fastify.get(`/${fileDetail.name}`, (request, reply) => {
        request.log.debug({fileName: fileDetail.name}, 'file name')
        reply
        .type('text/html; charset=utf-8')
        .send(mdToHtml(fileDetail.content))
    })
}
// Run the server!
fastify.listen(3000, (err, address) => {
  if (err) throw err
  fastify.log.info(`server listening on ${address}`)
})

function getFilesFromDirDocs () {
    const dirPath = path.join(__dirname, 'docs')
    console.log({dirPath}, 'dirPath')
    let filesNameInDir
    try {
        filesNameInDir = fs.readdirSync(dirPath)
    } catch (err) {
        console.log({dirPath, err}, 'failed to read dir')
        throw err
    }
    const filesNameAndContent = filesNameInDir.map(fileName => {
        const filePath = path.join(dirPath, fileName)
        console.log({filePath})
        let fileContent
        try {
            fileContent = fs.readFileSync(filePath, {encoding: 'utf8'})
        } catch (err) {
            console.log({filePath, err}, 'failed to read file')
            throw err
        }
        return {content: fileContent, name: fileName.replace(/\..*$/g, '')}
    })
    return filesNameAndContent
}

// https://github.com/markedjs/marked
function mdToHtml (mdText) {
    return marked(mdText)
}
