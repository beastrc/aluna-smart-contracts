const keypress = async () => {
  process.stdin.setRawMode(true)
  
  return new Promise(resolve => process.stdin.once('data', data => {
    const byteArray = [...data]
    if (byteArray.length > 0 && byteArray[0] === 3) {
      console.log('^C')
      process.exit(1)
    }
    process.stdin.setRawMode(false)
    resolve()
  }))
}

module.exports = async function pressToContinue() {
  console.log("Checkpoint... Press any key to continue!");
  await keypress();
}