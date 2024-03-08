"use strict"; 

const body = document.body;
const body2 = document.getElementById('body2'); // Add body2 as a global variable

const bgColorsBody = ["#65ddb7", "#ff96bd", "#9999fb", "#ffe797", "#cffff1", "#cffff1"];
const bgColorsBody2Light = ["#65ddb7", "#ff96bd", "#9999fb", "#ffe797", "#cffff1", "#cffff1"]; // Light theme colors for body2
const bgColorsBody2Dark = ["#43937A", "#AA647E", "#6666A7", "#AA9A64", "#8AAAA0", "#8AAAA0"]; // Dark theme colors for body2

const menu = body.querySelector(".menu");
const menuItems = menu.querySelectorAll(".menu__item");
const menuBorder = menu.querySelector(".menu__border");
let activeItem = menu.querySelector(".active");

function clickItem(item, index) {
    menu.style.removeProperty("--timeOut");
    
    if (activeItem == item) {
        // If the clicked item is already active, return early
        offsetMenuBorder(activeItem, menuBorder);
        return;
    }
    
    if (activeItem) {
        activeItem.classList.remove("active");
    }

    item.classList.add("active");
    body.style.backgroundColor = bgColorsBody[index];
    // Set the background color of body2 based on the selected theme
    if (document.body.classList.contains('dark-theme')) {
        body2.style.backgroundColor = bgColorsBody2Dark[index];
    } else {
        body2.style.backgroundColor = bgColorsBody[index];
    }
    activeItem = item;
    offsetMenuBorder(activeItem, menuBorder);
}



function offsetMenuBorder(element, menuBorder) {
    const offsetActiveItem = element.getBoundingClientRect();
    const left = Math.floor(offsetActiveItem.left - menu.offsetLeft - (menuBorder.offsetWidth - offsetActiveItem.width) / 2) + "px";
    const translateX = `translate3d(-${left}, 0 , 0)`;

    if (activeItem === element && menuBorder.style.transform !== translateX) {
        // If the clicked item is already active and the menu border is not in the correct position, adjust it
        menuBorder.style.transform = translateX;
    }
}


offsetMenuBorder(activeItem, menuBorder);

menuItems.forEach((item, index) => {

    item.addEventListener("click", () => clickItem(item, index));
    
})

window.addEventListener("resize", () => {
    offsetMenuBorder(activeItem, menuBorder);
    menu.style.setProperty("--timeOut", "none");
});

// Prevent resizing
window.onload = function() {
    window.resizeTo(400, 600); // Set your desired width and height
    window.addEventListener('resize', function() {
        window.resizeTo(400, 600); // Reset dimensions on resize attempt
    });
}


//**This section is written only to fix the bug in the start of the program**

// Wait for the DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Apply the initial positioning class after a short delay
    setTimeout(function() {
        const menuBorder = document.querySelector(".menu__border");
        menuBorder.classList.add("initial-positioning");

        // Remove the class after the first click on the menu bar
        const menuItems = document.querySelectorAll(".menu__item");
        menuItems.forEach(function(item) {
            item.addEventListener("click", function() {
                menuBorder.classList.remove("initial-positioning");
            }, { once: true }); // Remove the event listener after it's triggered once
        });
    });
});

function resetMenuBorderToHome() {
    const homeButton = document.querySelector('.menu__item:first-child');
    const offsetHomeButton = homeButton.getBoundingClientRect();
    const left = Math.floor(offsetHomeButton.left - menu.offsetLeft - (menuBorder.offsetWidth - offsetHomeButton.width) / 2) + "px";
    menuBorder.style.transform = `translate3d(${left}, 0 , 0)`;
}

// Call this function whenever the "Home" menu item is clicked
document.querySelector('.menu__item:first-child').addEventListener('click', resetMenuBorderToHome);

// Call this function initially to set the menu border to the "Home" button position
resetMenuBorderToHome();

//**End of the section**


// Add this function to handle the "Exit" button click event
function exitApp() {
    window.close();
}

// Middle section

function showPage(index) {
    const pages = document.querySelectorAll('.page');
    const menuItems = document.querySelectorAll('.menu__item');

    // Hide all pages and remove active class from all menu items
    pages.forEach(page => page.classList.remove('active'));
    menuItems.forEach(item => item.classList.remove('active'));

    // Show the selected page and mark its corresponding menu item as active
    pages[index].classList.add('active');
    menuItems[index].classList.add('active');
}

// Theme changer

// Function to save settings to localStorage
function saveSettings(theme) {
    localStorage.setItem('theme', theme);
    // body2.style.backgroundColor = bgColorsBody2Dark[0];
}

// Function to load settings from localStorage
function loadSettings() {
    return localStorage.getItem('theme');
}

// Function to set the selected option in the theme selection dropdown
function setThemeSelection(theme) {
    var themeDropdown = document.getElementById('theme');
    for (var i = 0; i < themeDropdown.options.length; i++) {
        if (themeDropdown.options[i].value === theme) {
            themeDropdown.selectedIndex = i;
            break;
        }
    }
}

// Function to apply the selected theme
function applyTheme(theme) {
    if (theme === 'light') {
        // Apply light theme
        document.body.classList.remove('dark-theme');
        body2.style.backgroundColor = bgColorsBody2Light[2]; // Change index as needed
    } else if (theme === 'dark') {
        // Apply dark theme
        document.body.classList.add('dark-theme');
        body2.style.backgroundColor = bgColorsBody2Dark[2]; // Change index as needed
    } else {
        // Apply system theme
        var prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.toggle('dark-theme', prefersDarkScheme);
        if (prefersDarkScheme) {
            body2.style.backgroundColor = bgColorsBody2Dark[2]; // Change index as needed
        } else {
            body2.style.backgroundColor = bgColorsBody2Light[2]; // Change index as needed
        }
    }

    // Set the initial background color for page one (body2) after the app restarts
    if (activeItem) {
        const currentIndex = Array.from(menuItems).indexOf(activeItem);
        if (currentIndex !== -1) {
            if (theme === 'light') {
                body2.style.backgroundColor = bgColorsBody2Light[currentIndex]; // Change index as needed
            } else {
                body2.style.backgroundColor = bgColorsBody2Dark[currentIndex]; // Change index as needed
            }
        }
    }
}


// Function to get the current theme from localStorage or system preferences
function getCurrentTheme() {
    var savedTheme = loadSettings();
    if (savedTheme) {
        return savedTheme;
    } else {
        var prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDarkScheme ? 'dark' : 'light';
    }
}

// Apply the saved settings when the app loads
window.addEventListener('load', function() {
    var savedTheme = loadSettings();
    if (savedTheme) {
        applyTheme(savedTheme);
        setThemeSelection(savedTheme); // Set the selected option in the dropdown
        // Optionally, navigate to the saved settings tab
        // For example: showPage(2);
    }
});

// Add event listener to the theme selection dropdown
document.getElementById('theme').addEventListener('change', function() {
    var theme = this.value;
    applyTheme(theme);
    // Save the selected theme to localStorage
    saveSettings(theme);
});



// Home page

var dns_servers = {
        'Google': ['8.8.8.8', '8.8.4.4'],
        'Cloudflare': ['1.1.1.1', '1.0.0.1'],
        'Electro': ['78.157.42.100', '78.157.42.101'],
        'Shecan': ['178.22.122.100', '185.51.200.2'],
        'UtraDns1': ['64.6.64.6', '64.6.65.6'],
        'UtraDns2': ['156.154.70.2', '156.154.71.2'],
        'RadarGame': ['10.202.10.10', '10.202.10.11'],
        'NTT': ['129.250.35.250', '129.250.35.251'],
        'Verisign': ['64.6.64.6', '64.6.65.6'],
        'Quad9': ['9.9.9.9', '149.112.112.112'],
        'Open': ['208.67.222.222', '208.67.220.220'],
        'HamrahAval': ['208.67.220.200', '208.67.222.222'],
        'IranCell': ['74.82.42.42', '0.0.0.0'],
        'RighTel': ['91.239.100.100', '89.223.43.71'],
        'AhmadDns v1': ['185.51.200.2', '0.0.0.0'],
        'AhmadDns v2': ['178.22.122.100', '1.1.1.1']
};

// Function to be called when DOM is ready
function initialize() {
    var connectionSelect = document.getElementById("connection");
    var unsetServerBtn = document.getElementById("unsetServerBtn");
    var refreshDnsBtn = document.getElementById("refreshDnsBtn");

    // Event listener for when connection selection changes
    connectionSelect.addEventListener("change", function() {
        var selectedConnection = connectionSelect.value;
        if (selectedConnection === "Wi-Fi" || selectedConnection === "Ethernet") {
            // If Wi-Fi or Ethernet is selected, call the DNS server initialization function
            initializeDNS(selectedConnection);
        }
    });

    // Event listener for when Unset Server button is clicked
    unsetServerBtn.addEventListener("click", function() {
        var selectedConnection = connectionSelect.value;
        unsetDnsServers(selectedConnection);
    });
}

// Call initialize when DOM is ready
document.addEventListener("DOMContentLoaded", initialize);

// Function to initialize DNS servers
function initializeDNS(connectionType) {
    var serverSelect = document.getElementById("server");
    var setServerBtn = document.getElementById("setServerBtn");

    // Event listener for when Set Server button is clicked
    setServerBtn.addEventListener("click", function() {
        var selectedServer = serverSelect.value;
        var dnsServerIPs = dns_servers[selectedServer];
        if (dnsServerIPs) {
            window.api.setDnsServers(dnsServerIPs[0], dnsServerIPs[1], connectionType);
        } else {
            console.error("DNS server IPs not found for", selectedServer);
        }
        const currentDns = window.api.getCurrentDns(connectionType);
        const [firstDns, secondDns] = currentDns.split(" ");
        const modifiedCurrentDns = `${firstDns}  ${'---'}  ${secondDns}`;


        const note = `${"The DNS server has been successfully changed to"} "${selectedServer}"`;
        alert(note);
        
        updateCurrentDns(modifiedCurrentDns);
    });
}

// Function to unset DNS servers
function unsetDnsServers(connection) {
    // Send message to main process to unset DNS servers
    window.api.unsetDnsServers(connection);
    alert('The DNS server has been Unset successfully!')
    const currentDns = window.api.getCurrentDns(connection);

    updateCurrentDns(currentDns);
}

// Add an event listener to the refreshDnsBtn button
document.getElementById("refreshDnsBtn").addEventListener("click", function() {
    // Get the selected connection from the dropdown menu
    const selectedConnection = document.getElementById("connection").value;
    
    // Call the getCurrentDns function from the preload script with the selected connection
    const currentDns = window.api.getCurrentDns(selectedConnection);

    if(currentDns == 'None'){
        updateCurrentDns(currentDns);
    }
    else{
        // Modify the currentDns string to add four spaces between the two DNS numbers
        const [firstDns, secondDns] = currentDns.split(" ");
        const modifiedCurrentDns = `${firstDns}  ${'---'}  ${secondDns}`;
        
        // console.log(modifiedCurrentDns);
        updateCurrentDns(modifiedCurrentDns);
    }
});

// Function to update the currentDnsServer span with the result obtained from getCurrentDns
function updateCurrentDns(currentDns) {
    // Update the currentDnsServer span
    document.getElementById("currentDnsServer").textContent = currentDns;
}
  