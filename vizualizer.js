/*
 * The Vizualiser displays the Data stored by the Processor
 * Data is extracted from the Dictionary of the Processor
 * The Data is displayed in a alterWindow
 */

// Workaround function to call vizualize from Vizuliser
// Thanks to Kevin W. & Lisa H. for the hint
function open() {
    Vizualizer.vizualize()
}


const Vizualizer = {

    /**
     * Do things here that need to be done when add-on is loaded.
     */
    init() {
        // Toolbar Icon selected from Manifest.json
        // Adding a Listener to listen for click events in the browser
        // Execute vizualize method if Toolbar icon is clicked
        browser.browserAction.onClicked.addListener(open);
    },

    /**
     * Returns the domain name of the website loaded in the active tab
     */
    getCurrentTabDomain() {
        //TODO: Add code here, to return the Domain of the current tab.
        //When the MNI-Wesite is open, it should return 'mni.thm.de'
        //right now for testing it always returns 'web.de'


        // A variable to store the name from the current domain
        // Crap that dont worked
        //var curr_domain = browser.tabs.query({currentWindow:true, active: true});
        //var curr_domain = browser.location.hostname
        //return curr_domain;
        return 'web.de';
    },

    /**
     * This method vizualizes, the current amount of CSRs on the current tab.
     * This method is called when the Toolbar Button gets clicked.
     */
    vizualize() {
        // Console log to check if method vizualize was executed, after button was clicked
        // Get the domain from the current tab and count CSRs
        console.log('Vizualizer button clicked.');
        var currentTabDomain = this.getCurrentTabDomain();
        var csr = Processor.getCSR(currentTabDomain);

        //Creating a String for the message and counting the CSRs
        //Text is a static string to be displayed later in the alertWindow
        var message = 'You are currently on ' + currentTabDomain;
        var text = 'The following resources were called:'

        // Iteration over the csr list to extrect calledDomains
        // Variable x to store the concatenated string of entrys
        var x = '';
        var item;
        for (item in csr[currentTabDomain]){
            x += '\\n' + item

            // Looping over calledDomains to get type of called ressource
            // Source containign list of types
            var source = csr[currentTabDomain][item]
            // Looping over types of resources
            for (var y in source){
                for (var z in source[y]){
                    //y contains indices
                    //Concat strings for better output, with all types of resources
                    x += ' -> ' + source[y][z]
                }
            }
        }
        //Unused debug output
        //console.log(x);
        
        // Concatenating the message
        // Get number of CSRs by counting keys as list
        if (csr[currentTabDomain]) {
            var csrCount = Object.keys(csr[currentTabDomain]).length;
            message += '. Here are ' + csrCount + ' 3rd party domains referenced.' + '\\n' + text + '\\n' + x;
            
        }
        // Creating an alertwindow to display the message and CSR count
        // Executing alertwindow as code
        var alertWindow = 'alert("' + message + '");';
        browser.tabs.executeScript({code : alertWindow});
    }

};

Vizualizer.init();

