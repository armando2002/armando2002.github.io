// Pricecharting URL
const VGPC_SEARCH_URL = 'https://www.pricecharting.com/api/products?';
var vgpcapikey = config.VGPC_API_KEY;
// YouTube URL
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
var youtubeapikey = config.API_KEY;

// call VGPC for prices
function getApiData(searchTerm, callback) {
    const settings= {
        url: VGPC_SEARCH_URL,
        data: {
            q: `${searchTerm}`,
            t: vgpcapikey
        },
        dataType: 'json',
        type: 'GET',
        success: callback
    };

        $.ajax(settings);
    }

// call YouTube for thumbnail image from 1st video result
// currenty not working or used
function getThumbnail(searchTerm, callback) {
	const settings = {
		url: YOUTUBE_SEARCH_URL,
		data: {
			q: `${searchTerm}`,
			part: 'snippet',
			key: youtubeapikey
		},
		dataType: 'json',
		type: 'GET',
		success: callback
	};

	$.ajax(settings);
}

// function to deal with RFC3896 (force URL encoding of /[!'()*])
function rfc3986EncodeURIComponent (str) {  
    return encodeURIComponent(str).replace(/[!'()*]/g, escape);  
}

// create a div element containing the game information
function renderResults(result) {
    // variable for parsed price
    const price = parseFloat(result['loose-price'] / 100).toFixed(2);
    const dollarPrice = `Loose price: $${price}`;
    // URL encodings for shop links
    // create URL encoded variables
    var fixedName = rfc3986EncodeURIComponent(result['product-name']);
    var fixedConsole = rfc3986EncodeURIComponent(result[`console-name`]);
    // prep results HTML
    const results = `<div class="results">
        <h2> ${result['product-name']} </h2>
        <img class="thumbnail" src="coin.png">
        <!-- later on, update the image using the YouTube thumbnail -->
        <h3 class="system"> System: ${result['console-name']} </h3>
        <p class="price"> ${dollarPrice} </p>
        <h4>Shop Now:</h4>
        <button class="btn btn-block" aria-label="Shop on Amazon" onclick="window.open('https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=`+fixedName+`%20`+fixedConsole+`')"><i class="fab fa-amazon fa-2x"></i></button>
        <button class="btn btn-block" aria-label="Shop on eBay" onclick="window.open('https://www.ebay.com/sch/i.html?_nkw=`+fixedName+`%20`+fixedConsole+`&ssPageName=GSTL')"><i class="fab fa-ebay fa-2x"></i></button>        
    </div>`;
    return results;
    }

// function to add each HTML Div to page using .html
function displayResults(data) {
    const results = data.products.map((item, index) => renderResults(item));
    // count total results and add to page
    const totalResults = Object.keys(results).length;
    const totalResultsHTML = `<h4> Total Results: ${totalResults} </h4>`;
    // if results are 0, warn user, else push total and results
    if(totalResults==0) {
        alert("No results, try again!");
    }
    else{
    // remove hidden attribute for aria-live    
    // push results and total
    $('.js-results').prop('hidden', false).html(totalResultsHTML);
    $('.js-main').prop('hidden', false).html(results);
    }
}

function watchSubmit() {
    $('.js-search-form').submit(event => {
        event.preventDefault();
        // clear out existing total results and results if a search was already done and rehide for aria-live
        $('.js-results').prop('hidden', false).html("");
        $('.js-main').prop('hidden', false).html("");
		// find the value of the entry in the input box with class .js-query
		const queryTarget = $(event.currentTarget).find('.js-query');
		// add query variable = text entry
		const query = queryTarget.val();
		// clear out the input
		queryTarget.val("");
		// call the API using the query variable as arg1 and the displayGitHubSearchData function as a callback using the results
        getApiData(query, displayResults);

    });
}

$(watchSubmit);