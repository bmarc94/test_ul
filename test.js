/*Question 1*/
const users = [{ name: 'Pako', rating: 4.21 }, { name: 'Bill', rating: 3.88 }, { name: 'Josef', rating: 3.88 }, { name: 'Henry', rating: 4.33 }];


/*Sort by an attribute */
console.log('Question 1:\n -Sort by an attribute\n')

function sortByAttribute(arr, attribute) {
    let isDesc = attribute.indexOf('-') === 0;
    attribute = isDesc ? attribute.split('-')[1] : attribute;

    let compareMethod = ((desc) => {
        if (desc) {
            return (a, b) => {
                return a < b
            }

        } else {
            return (a, b) => {
                return a > b
            }
        }
    })(isDesc);


    return arr.sort((a, b) => {
        return compareMethod(a[attribute], b[attribute]);
    })
}
console.log('---ASCENDING SORT BY NAME ---');
console.log(sortByAttribute(users, 'name'));
console.log('---ASCENDING SORT BY RATING ---');
console.log(sortByAttribute(users, 'rating'));
console.log('---DESCEDING SORT BY NAME ---');
console.log(sortByAttribute(users, '-name'));
console.log('---DESCEDING SORT BY RATING ---');
console.log(sortByAttribute(users, '-rating'));

console.log('\n-Sort by an array of attribute\n');

function sortByAttributes(arr, attributesArray) {
    function compareMethod(desc) {
        if (desc) {
            return (a, b) => {
                return a === b ? null : a < b;
            }
        } else {
            return (a, b) => {
                return a === b ? null : a > b;
            }
        }
    }

    let compareMethodForAttributeTemplate = {};

    attributesArray.forEach((attribute, index) => {
        let isDesc = attribute.indexOf('-') === 0;
        attribute = isDesc ? attribute.split('-')[1] : attribute;

        compareMethodForAttributeTemplate[index] = {};
        compareMethodForAttributeTemplate[index].attributeName = attribute;
        compareMethodForAttributeTemplate[index].method = compareMethod(isDesc);
    })

    return arr.sort((a, b) => {
        let attributeIndex = 0;
        let compareResult = null;
        let result = null;

        for (let i = 0, l = attributesArray.length; i < l; i++) {
            let attributeName = compareMethodForAttributeTemplate[i].attributeName;
            let compareMethod = compareMethodForAttributeTemplate[i].method;

            result = compareMethod(a[attributeName], b[attributeName]);

            if (result !== null) {
                break;
            }
        }
        return result;
    })
}

console.log('---DESCEDING SORT BY RATING ASCENDING SORT BY NAME---');
console.log(sortByAttributes(users, ['-rating', 'name']));
console.log('---DESCEDING SORT BY RATING DESCEDING SORT BY NAME---');
console.log(sortByAttributes(users, ['-rating', '-name']));

/*************/
/*Question 2 */
/*************/

const request = ((isNodeServer) => {
    if (isNodeServer) {
        return (options) => {
            return new Promise((resolve, reject) => {
                /*let options = { url: "https://api.github.com" }
                let url = require('url');
                let https = require("https");
                let requestOptions = url.parse(options.url);
                requestOptions.headers = { 'user-agent': 'node.js' };

                https.request(requestOptions, function(response) {
                    let body = '';
                    response.on("data", function(chunk) {
                        body += chunk.toString('utf8');
                    });
                    response.on("end", function() {
                        //revolve(requestOptions);
                        console.log("Body: ", body);
                    });
                });*/

            })
        }
    } else {
        return (options) => {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open(options.method, options.url);
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.response);
                    } else {
                        reject({ status: this.status, statusText: xhr.statusText });
                    }
                }
                xhr.onerror = function() {
                    reject({ status: this.status, statusText: xhr.statusText });
                }
                xhr.send();
            })
        }

    }

})(this.XMLHttpRequest ? false : true)

let gitHubApiWrapper = {
    apiHandler: null,
    getApi: function() {
        return new Promise((resolve, reject) => {
            if (!this.apiHandler) {
                request({ method: "GET", url: "https://api.github.com" })
                    .then((res) => {
                        this.apiHandler = JSON.parse(res);
                        resolve(this.apiHandler);
                    });
            } else {
                resolve(this.apiHandler);
            }
        })
    }
}

function getAvatars(userArray) {
    let promises = [];

    gitHubApiWrapper.getApi().then((api) => {

        userArray.forEach((user) => {
            promises.push(new Promise((resolve, reject) => {
                request({ method: "GET", url: api.user_url.replace('{user}', user) })
                    .then((res) => { resolve(res) });
            }));
        })
        Promise.all(promises).then((res) => {
            console.log('Question 2:\n GitHub Avatar\n');
            res.forEach((r, i) => {
                console.log(userArray[i] + " avatar url: " + JSON.parse(r).avatar_url);
            })
        })
    })

}

getAvatars(["orktes", "nomon", "kosmikko"]);



console.log('Question 3:\n John Lenon !! \n')

/*************/
/*Question 3 */
/*************/

function Person(firstName, lastName) {
    if (arguments.length !== 2) {
        throw "Person must have a first Naame and a last Name, no less no more..."
    }
    this.firstName = firstName;
    this.lastName = lastName;

}

Person.prototype = {
    get name() {
        return this.firstName + " " + this.lastName;
    },

    set name(fullName) {
        let fullNameArray = fullName.split(" ");
        this.firstName = fullNameArray[0];
        this.lastName = fullNameArray[1];
    }
}


const john = new Person("John", "Doe");

console.log(john.name); // should equal "John Doe" 
john.name = "John Lennon";
console.log(john.lastName); // should equal "Lennon" 
console.log(john.firstName); // should equal "John"

/*************/
/*Question 4 */
/*************/

console.log('Question 4:\n How would you implement backend storage for Facebook-messenger-like application (with similar scale), i.e. how would you store chat related data? Main point is to describe the data structures, not hardware/db details. Use pictures if you like. Take approx. 15 minutes to answer this.\n')

console.log(`I would create a relational database with 3 tables.\n
\t A users table with all needed data (name, username, nickname, etc.) and an id as primary key,\n
\t A conversations table with two foreign keys data for users and an id as primary key,\n
\t A messages table with needed datas (message text, timeStamp), an id as primary key and two foreign keys data for author (user) and convesation.\n

`)