let jsonData;

initialize();

function handleClick(){
    Toastify({

        text: "The currency has been swapped!",
        
        duration: 3000,

        position: "middle"
        
        }).showToast();
}

document.getElementById('input-amount').addEventListener('input', function() {
    updateAmount(1);
});

document.getElementById('output-amount').addEventListener('input', function() {
    updateAmount(-1);
});

document.getElementById("input-currency-dropdown").addEventListener('change', function() {
    updateAmount(1);
    var inputImage = document.getElementById("input-token");
    var currency = document.getElementById('input-currency-dropdown').value;
    inputImage.src = `tokens/${currency}.svg`
    
});
document.getElementById("output-currency-dropdown").addEventListener('change', function() {
    updateAmount(-1);
    var outputImage = document.getElementById("output-token");
    var currency = document.getElementById('output-currency-dropdown').value;
    outputImage.src = `tokens/${currency}.svg`
});

function updateAmount(toChange){

    if (jsonData) {
        if (toChange == 1) {
            var inputAmount = document.getElementById('input-amount').value;
            var outputAmount = document.getElementById('output-amount');
            var selectedInputCurrency = document.getElementById('input-currency-dropdown').value;
            var selectedOutputCurrency = document.getElementById('output-currency-dropdown').value;
        }
        else{
            inputAmount = document.getElementById('output-amount').value;
            outputAmount = document.getElementById('input-amount');
            selectedInputCurrency = document.getElementById('output-currency-dropdown').value;
            selectedOutputCurrency = document.getElementById('input-currency-dropdown').value;
        }

        var inputCurrencyObject = handleDuplicate(jsonData.filter(item => item.currency === selectedInputCurrency));
        var outputCurrencyObject = handleDuplicate(jsonData.filter(item => item.currency == selectedOutputCurrency));

        var ratio =  inputCurrencyObject.price / outputCurrencyObject.price;
        var convertedAmount = inputAmount * ratio;

        outputAmount.value = convertedAmount.toFixed(2);

        var inputImage = document.getElementById("input-token");
        var currency = document.getElementById('input-currency-dropdown').value;
        inputImage.src = `tokens/${currency}.svg`
        
        var outputImage = document.getElementById("output-token");
        var currency = document.getElementById('output-currency-dropdown').value;
        outputImage.src = `tokens/${currency}.svg`

    } else {
        alert("Data is still loading. Please wait a moment.");
    }
}

function initialize() {
    fetch('https://interview.switcheo.com/prices.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            jsonData = data;
            const currencies = jsonData.map(item => item.currency);
            const uniqueCurrencies = [...new Set(currencies)];

            const dropdownInput = document.getElementById("input-currency-dropdown");

            const dropdownOutput = document.getElementById("output-currency-dropdown");
 
            uniqueCurrencies.forEach(currency => {
                const optionInput = document.createElement("option");
                const optionOutput = document.createElement("option");
                optionInput.value = currency;
                optionOutput.value = currency;
                optionInput.text = currency;
                optionOutput.text = currency;
                dropdownInput.add(optionInput);
                dropdownOutput.add(optionOutput);
             });


            new SlimSelect({
                select: '#input-currency-dropdown',
            });
            
            new SlimSelect({
                select: '#output-currency-dropdown',
            });

        })
        .catch(error => {
            alert('Error: ' + error.message);
        });
}

function handleDuplicate(jsonObj){
    if(jsonObj.length>0){
        jsonObj.sort((a, b) => new Date(b.date) - new Date(a.date));
        var latestCurrencyObject = jsonObj[0];
        return latestCurrencyObject;
    }
}