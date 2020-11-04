// import fs from 'fs'
// import path from 'path'
// import moment from 'moment'

// export default new class Logger {
//   preCheck() {
//     const date = moment().format('YYYY-MM-DD')
//     if (!fs.existsSync(path.join(__dirname, `../log/${date}.txt`))) {
//       fs.writeFileSync(`../log/${date}.txt`, `# ${date}`)
//     }
//   }
//   info(message: string) {
//     this.preCheck()
//     fs.writeFileSync(`../log/${date}.txt`, message, {
//       encoding: 'utf-8'
//     })
//   }
// }