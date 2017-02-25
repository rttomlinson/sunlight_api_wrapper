/* Sunlight API Wrapper */
"use strict";

const request = require("request");

let wrapper_methods = {};
let options = {};

const baseUrl = "https://congress.api.sunlightfoundation.com/";
let qs = {}; //reference to the object at options property qs (query strings)
options["qs"] = qs; //Add qs to options object




function getRepsByZipcode(zipcode) { //This returns a promise
    qs.zip = zipcode;
    options["uri"] = `${baseUrl}legislators/locate/`;
    options.qs["fields"] = "chamber,aliases,party,bioguide_id,district";
    return new Promise(function (resolve, reject) {
        request.get(options, callbackForSunlight(resolve, reject));
        
    });
}


/* Helper function */
function callbackForSunlight(resolve, reject) {
    return function (error, response, body) {
            if (error) {
                reject(error);
            }
            else if (response.statusCode == 200) {
                resolve(JSON.parse(body));
                
            }
            else {
                reject(`Status code is ${response.statusCode}`);
            }
    };
}


wrapper_methods.getRepsByZipcode = getRepsByZipcode;



module.exports = wrapper_methods;