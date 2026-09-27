const dns = require('node:dns');

// mongodb+srv:// uses DNS SRV lookups. Some networks block or refuse SRV on the
// default resolver — set public DNS before mongoose / the driver loads.
dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // ignore if the runtime disallows changing DNS servers
}
