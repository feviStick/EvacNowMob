const qrcode = require('qrcode-terminal');
const os = require('os');

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const ip = getLocalIp();
const port = 8443;
const url = `http://${ip}:${port}`;

console.log(`\nScan this QR code to view the app on your phone (ensure you are on the same WiFi):\n${url}\n`);
qrcode.generate(url, { small: true });
