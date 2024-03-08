const { execSync } = require('child_process');
const { contextBridge, ipcRenderer } = require('electron');

// Function to set DNS servers
function setDnsServers(preferredDNS, alternateDNS, connection) {
    try {
        // Set preferred and alternate DNS servers on Windows
        execSync(`netsh interface ipv4 set dns name="${connection}" static ${preferredDNS} primary`);
        execSync(`netsh interface ipv4 add dns name="${connection}" address=${alternateDNS} index=2`);
        console.log(`Preferred DNS server set to ${preferredDNS} and alternate DNS server set to ${alternateDNS}`);
    } catch (error) {
        console.error('Error setting DNS servers:', error);
    }
}

// Function to unset DNS servers
function unsetDnsServers(connection) {
    try {
        // Unset DNS servers on Windows
        execSync(`netsh interface ipv4 set dns name="${connection}" dhcp`);
        console.log('DNS servers unset');
    } catch (error) {
        console.error('Error unsetting DNS servers:', error);
    }
}

// Function to get current DNS server for a connection
function getCurrentDns(connection) {
    try {
        // Execute netsh command to show current DNS configuration
        const output = execSync(`netsh interface ipv4 show config name="${connection}"`).toString();

        // Match the DNS servers part
        const regex = /Statically Configured DNS Servers:\s*((?:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\s+(?:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}))/;
        const match = regex.exec(output);
        
        if (match && match[1]) {
            // Replace space between preferred and alternate DNS servers with a tab character
            const dnsServers = match[1].replace(/\s+/, ' ');
            return dnsServers;
        } else {
            return 'None';
        }
    } catch (error) {
        console.error('Error getting current DNS:', error);
    }
}

// Expose the functions to the renderer process
contextBridge.exposeInMainWorld('api', {
    setDnsServers: setDnsServers,
    unsetDnsServers: unsetDnsServers,
    getCurrentDns: getCurrentDns
});
