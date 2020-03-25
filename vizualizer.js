/*
 * The Vizualiser displays the Data stored by the Processor
 * Data is extracted from the Dictionary of the Processor
 * The Data is displayed in a alterWindow
 */



const Vizualizer = {


    /**
     * Do things here that need to be done when add-on is loaded.
     */
    init() {
        // Toolbar Icon selected from Manifest.json
        // Adding a Listener to listen for click events in the browser
        // Execute vizualize method if Toolbar icon is clicked

        // Creating a Listener to listen for the button to be clicked
        // Listener is stored in the variable below
        var vizualizeListener = Vizualizer.getVizualizeListener();
        browser.browserAction.onClicked.addListener(vizualizeListener);
    },

    /**
     * Returns the domain name of the website loaded in the active tab
     */
    getCurrentTabDomain(callback) {
        //TODO: Add code here, to return the Domain of the current tab.
        //When the MNI-Wesite is open, it should return 'mni.thm.de'
        //right now for testing it always returns 'web.de'
        // A variable to store the promise returned from the query method
        // returning the promise
        //let query_promise = browser.tabs.query({currentWindow:true, active:true}).then(tabs => {for (const tab of tabs){
        //    console.log(tab.title);
        //}});
        browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {let tab = tabs[0];
            var url = new URL(tab.url)
            console.log(tab.url);
            callback(url.hostname)
        }, console.error);
        //callback();
        //console.log(callback.url);
        return callback;
    },

    /**
     * This method vizualizes, the current amount of CSRs on the current tab.
     * This method is called when the Toolbar Button gets clicked.
     */
    vizualize() {
        // Console log to check if method vizualize was executed, after button was clicked
        // Get the domain from the current tab and count CSRs
        console.log('Vizualizer button clicked.');
        //var currentTabDomain = this.getCurrentTabDomain();
        this.getCurrentTabDomain(function(currentTabDomain) {
            var csr = Processor.getCSR(currentTabDomain);

            //Creating a String for the message and counting the CSRs
            //Text is a static string to be displayed later in the alertWindowfunction();
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
            });
        },
        
        /**
        * This creates a listener around the vizualize method, so it can
        * be called from within a callback.
        * .bind() ceates a new bound function around vizualize
        * (unsure if this is correct) Listens for incoming requests, calls the bound function and the BF calls vizualize
        */
        getVizualizeListener() {
            return this.vizualize.bind(this);
    },


};

Vizualizer.init();

