import os from 'os'

const server = {
    type: os.type(),
    architecture: os.arch(),
    uptime: os.uptime()
  }
  
console.log(server);
console.log(os.freemem())
/* os.type() 
os.platform() 
os.arch() 
os.release()
os.uptime()
os.loadavg()
os.totalmem() 
os.freemem()
os.cpus() 
os.networkInterfaces()
os.EOL 
os.homedir() 
os.tmpdir() 
os.endianness()
os.hostname() 
os.networkInterfaces() 
os.userInfo()  */