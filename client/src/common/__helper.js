/**
* Method for validating password 
* @param { password }
* @returns { boolean }
* 
*/

var moment = require('moment')
const verifyCorrectPassword = (password) => {
    if (typeof password === 'string') {
        //Contains atleast digit 
        let regxD = /([0-9])+/g;
        let regxW = /([a-z])+/g;
        let regxWC = /([A-Z])+/g;
        let specialChar = '~!@#$%^&*()_+'.split('')
        let isSpecial = false
        let cond1 = !password.match(regxD)
        let cond2 = !password.match(regxW)
        let cond3 = !password.match(regxWC)
        specialChar.map(car => {

            if (password.includes(car)) {
                isSpecial = true
            }
        })
        if (password.length < 6 || !isSpecial || cond1 || cond2 || cond3) {

            return false
        } else {

            return true
        }
    } else {
        throw new Error('Type error ')
    }
}

const _getFilteredCustomerListByDate = (modifedate, list, eDateToCompare) => {
    if (list != undefined && list != '') {
        var filtered;
        if (eDateToCompare == '') {
            filtered = list.filter(data => modifedate <= moment(data.creationDate * 1000).format('YYYY-MM-DD HH:mm'));
        } else {
            filtered = list.filter(data => {
                
            
                if (new Date(modifedate).toDateString() === new Date(eDateToCompare).toDateString()) {
                    return new Date(modifedate).toDateString() ===  new Date(data.creationDate * 1000).toDateString()


                }
                return (moment(new Date(data.creationDate * 1000)).format('YYYY-MM-DD') <= moment(new Date(eDateToCompare)).format('YYYY-MM-DD ')) && (moment(new Date(modifedate)).format('YYYY-MM-DD') <= moment(new Date(data.creationDate * 1000)).format('YYYY-MM-DD'))

            });

        }
        return filtered;

    }
    else
        return []
}

const _getSortedByKey = (name, dataList) => {
    var queryStr = '', propName = "";
    switch (name) {
        case "Amount":
            return dataList.sort(numberCompare, name)
        case "CloseDate":
            return dataList.sort(dateCompare, name)
        case "Stage":
            return dataList.sort(stringCompare, name)

        default:
            return ""
    }

    function stringCompare(a, b) {
        var genreA = '';
        var genreB = '';
        if (a[name] !== undefined && typeof a[name] === 'string') {
            genreA = a[name] === null ? '' : a[name].toLowerCase();
            genreB = b[name] === null ? '' : b[name].toLowerCase();
        } else if (a[name] === null) {
            genreA = '';
            genreB = '';
        } else if (Array.isArray(a[name])) {
            genreA = a[name].length > 0 && a[name][0][propName] !== undefined && a[name][0][propName] !== null ? a[name][0][propName].toLowerCase() : '';
            genreB = b[name].length > 0 && b[name][0][propName] !== undefined && b[name][0][propName] !== null ? b[name][0][propName].toLowerCase() : '';
        } else if (a[name] === undefined || a[name] === null) {
            genreA = '';
            genreB = '';

        } else {
            genreA = a[name][propName] !== undefined || a[name][propName] !== null ? a[name][propName].toLowerCase() : '';
            genreB = b[name][propName] !== undefined || b[name][propName] !== null ? b[name][propName].toLowerCase() : '';

        }

        if (genreA === genreB) {
            if (count === 0) {
                count = 1
                return 1;
            } else {
                count = 0;
                return -1;
            }

        }
        if (genreA > genreB) {
            return 1;
        } else if (genreA < genreB) {
            return -1;
        }
        return 0;
    }
    function dateCompare(a, b) {
        var dateA = new Date(a[name])
        var dateB = new Date(b[name])
        return dateB - dateA
    }
    function numberCompare(a, b) {
        return a[name] - b[name];
    }
}


export { verifyCorrectPassword, _getFilteredCustomerListByDate }