"use strict";

const Sunlight = require("./index.js");
let sunlight  = new Sunlight();



/* ------------------------------------- Get Reps by Zipcode ------------------------------- */


let repsByZip = sunlight.getRepsByZipcode(75074); //method falls return promises

repsByZip.then(function onFulfill(data) { //expect data to be a JS object
    console.log(data);
    let prettyData = {
        "senate" : [],
        "house" : []
    };
    data.results.forEach(function (element, index, arr) {
        let cleanedData = cleanRepData(element);
        if (element.chamber == "senate") {
            prettyData.senate.push(cleanedData);
        } else {
            prettyData.house.push(cleanedData);
        }
    });
    console.log(prettyData);
}).catch(function onError(error) {
    console.log(error);
});



/* ------------- repVote calls ----------------------------------*/


let repsVotes = sunlight.getMostRecentVotes("J000174");

repsVotes.then(function onFulfill(data) {
    console.log(cleanVoteData(data));

}).catch(function onError(error) {
    console.log(error);
});





/* ----------------------- DATA INFO ------------------------------ */


/*Pretty data for reps by zipcode should follow the schema of:
{
    "house" : [
        {
            "fullName" : [string],
            "party" : [string],
            "bioguideId : [string],
            "district" : [number]
        },...
    ],
    "senate" : [
        {
            "fullName" : [string],
            "party" : [string],
            "bioguideId : [string],
        }
    
    
    
    ]
}
*/
function cleanRepData(rep) {
    let cleanData = {};
    cleanData.fullName = rep.aliases[0];
    cleanData.party = rep.party;
    cleanData.bioguideId = rep.bioguide_id;
    if (rep.chamber == "house") {
        cleanData.district = rep.district;
    }
    return cleanData;
}


/*---------------------------------Voting Records ------------------------------*/

/* -------------------------------Raw Data -----------------------------*/
/*
{
    "results" : [
        {
            "bill": {
                "bill_id" : [string],
                "official_title" : [string]
            },
            "voted_at" : [string],
            "voter_ids" : {
                "[bioguide_id]" : [string]
            }
        },...
        
    
    
    
    ],
    "count" : [number],
    "page" : [Object]
}


*/






/*
Pretty data for voting records

[
    {
        "bill_id" : [string],
        "bill_title" : [string],
        "recorded-vote": [string]
    },...



]


*/
function cleanVoteData(data) {
    let cleanedData = [];
    data.results.forEach(function (element, index, arr) {
        let holderObj = {};
        holderObj["bill_id"] = element.bill.bill_id;//billid from element
        holderObj["bill_title"] = element.bill.official_title;
        holderObj["recorded-vote"] = element.voter_ids[Object.getOwnPropertyNames(element.voter_ids)[0]];
        cleanedData.push(holderObj);
    });
    return cleanedData;
}


