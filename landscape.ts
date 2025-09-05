import fs from 'fs'

const filePath = './landscape.json'

export default defineEventHandler(async (event) => {
  switch (event.method) {
    case 'GET':
      return fs.readFileSync(filePath)
    case 'POST':
      const body = await readBody(event)
      fs.writeFileSync(filePath, JSON.stringify(body, null, 2))
      break
  }
})
