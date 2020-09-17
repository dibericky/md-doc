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
    const filesNameInDir = fs.readdirSync(dirPath)
    const filesNameAndContent = filesNameInDir.map(fileName => {
        const filePath = path.join(dirPath, fileName)
        console.log({filePath})
        const fileContent = fs.readFileSync(filePath, {encoding: 'utf8'})
        return {content: fileContent, name: fileName.replace(/\..*$/g, '')}
    })
    return filesNameAndContent
}

// https://github.com/markedjs/marked
function mdToHtml (mdText) {
    return marked(mdText)
}
