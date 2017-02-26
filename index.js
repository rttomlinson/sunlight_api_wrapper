/* Sunlight API Wrapper */
"use strict";

const request = require("request");

let customRequest = wrapRequestWithPromise(request.get);

class SunlightAPIWrapper {
    constructor() {
        this.baseUrl = "https://congress.api.sunlightfoundation.com/";

    }
    
    getRepsByZipcode(zipcode) { //This returns a promise
        let options = {};
        options.qs = {};
        options.qs["zip"] = zipcode;
        options["uri"] = `${this.baseUrl}legislators/locate/`;
        options.qs["fields"] = "chamber,aliases,party,bioguide_id,district";
        return customRequest(options);
            
    }
    
    getMostRecentVotes(bioguide_id) {
        let options = {};
        options.qs = {};
        options["uri"] = `${this.baseUrl}votes/`;
        options.qs["fields"] = `voter_ids.${bioguide_id},voted_at,bill.bill_id,bill.official_title`; //returns, bioguide_ids vote, vote time, bill id, and bill official title
        options.qs[`voter_ids.${bioguide_id}__exists`] = "true"; //check that this rep voted
        options.qs["order"] = "voted_at__desc"; //order votes chronologically
        options.qs["bill_id__exists"] = "true"; //check that this vote is regarding a bill
        return customRequest(options);
        
    }
}

module.exports = SunlightAPIWrapper;

/*This uses the special callback for request module http calls*/

function wrapRequestWithPromise(fn) {
    return function() {
        let args = [].slice.call(arguments);
        
        return new Promise(function(resolve, reject) {
            fn.apply(
                null,
                args.concat(function (error, response, body){
                    if (error) {
                        reject(error);
                    }
                    else if (response.statusCode == 200) {
                        resolve(JSON.parse(body));
                    }
                    else {
                        reject(`Status code is ${response.statusCode}`);
                    }
                })
            );
        });
    };
}
