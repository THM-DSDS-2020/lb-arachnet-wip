/**
 * The processor is responsible for storing incoming requests and for filtering
 * those requests in order to display them in the vizualizer.
 * 
 * Do not remove any existing code in this class. Only add your own code.
 *
 */

function check_options() {
    var selection = document.getElementById("check");
    if (selection.checked == true){
        console.log("TRUE!!")
    }
}

const Processor = {

    /**
     * Dictionary to store a list of resources ordered by the domain that
     * requested them
     * Key = Domain, Value = list of called Domains from key
     */
    resourcesByDomain: {},


    /**
     * Pass in the web request captured in the capturer. One request at a time.
     * If all works, there should be a console output.
     * @param {WebRequest} req 
     */
    trackRequest(req) {
        // currentDomain domain of current website
        // calledDomain domain called beu currentDomain
        var currentDomain = new URL(req.documentUrl).hostname;
        var calledDomain = new URL(req.url).hostname;
        var isCrossDomain = currentDomain != calledDomain;


        // Determine if the current domain is a CrossDomain or not
        // Checking if it dont includes the subdomain
        if (!currentDomain.includes(calledDomain) && currentDomain.split(".").length > 1)
        {
            isCrossDomain = true
        }else{
            isCrossDomain = false
        }


        //Only handle requests, that are cross domain.
        if (isCrossDomain)
        {
            // Checking if the type of the key in the currentDomain entry in the dictionary equals undefined
            // If ture create empty entry for value
            if (typeof this.resourcesByDomain[currentDomain] === 'undefined')
            {
                this.resourcesByDomain[currentDomain] = {};
            }
            // Checking if the value entry callDomain behind the key currentDomain equals undefined
            // If true create empty entry for value (empty list)
            if (typeof this.resourcesByDomain[currentDomain][calledDomain] === 'undefined')
            {
                this.resourcesByDomain[currentDomain][calledDomain] = {
                    types: []
                };
            }
            // Check if the type from the resource (img, script, etc.) is already in the list
            // If true dont push into list, if not push into list
            if (this.resourcesByDomain[currentDomain][calledDomain].types.indexOf(req.type) === -1)
            {
                this.resourcesByDomain[currentDomain][calledDomain].types.push(req.type);
            }
        }

        //Console log is unused debug output
        // After each request, there is this console output showing the current
        // state of the stored data.
        //console.log('----------------\nresourcesByDomain:\n' + JSON.stringify(this.resourcesByDomain, null, 4));

    },

    /**
     * This creates a listener around the trackRequest method, so it can
     * be called from within a callback.
     * .bind() ceates a new bound function around treckRequest
     * (unsure if this is correct) Listens for incoming requests, calls the bound function and the BF calls trackRequest
     */
    getTrackRequestListener() {
        return this.trackRequest.bind(this);
    },


    /**
     * Call this method either like this: Processor.getCSR('web.de')
     * or like this:                      Processor.getCSR(['web.de', 'gmx.net])
     *
     *
     * Using the spread operator (...) to pass an entire list as arguments to the function
     * getCSR will be called with for all elements (domains) in the domains list
     *
     *
     * This method shall be called from within the vizualizer, whenever the user
     * wants to see the data.
     * @param  {...string} domains
     */
    getCSR(...domains) {
        var results = {};
        for (var i = 0; i < domains.length; i++) {
            if (this.resourcesByDomain[domains[i]]) {
                results[domains[i]] = this.resourcesByDomain[domains[i]];
            }
        }
        return results;
    }


};
