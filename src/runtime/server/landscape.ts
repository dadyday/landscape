import fs from 'fs'

const filePath = './landscape.json'

export default defineEventHandler(async (event) => {
  switch (event.method) {
    case 'GET':
      return fs.readFileSync(filePath)
    case 'POST':
      const body = await readBody(event)
      fs.writeFileSync(filePath, JSON.stringify(body, null, 2), { encoding: 'utf-8', mode: 0o666, flag: 'w'})
      break
  }
})
