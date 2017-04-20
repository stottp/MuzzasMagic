// This is a simple *viewmodel* - JavaScript that defines the data and behavior of Muzza's matrix

var min_revenue_tender = 91.25;
var average_electricity_commission = 0.13;
var average_gas_commission = 0.04;
var max_commission_day = 25;
var max_elec_commission_ppu = 0.5;
var max_gas_commission_ppu = 0.1;

// Class to remove form
function ClearFormTest() {
    var self = this;
 
}

function AppViewModel() {

	this.customerName = ko.observable("");
	this.utilityType = ko.observableArray(['Electricity', 'Natural Gas']);
	this.selectedUtility = ko.observable("");
	this.customerAQ = ko.observable("");
	this.customerSupplies = ko.observable();
	this.radioSelectedOptionValue = ko.observable("Electricity");
	
	this.totalCommissionValue = ko.observable("");
	this.amount = ko.observable(50).extend({ addCurrencyFormatted:2 });
	this.siteCommission = ko.observable("");
	this.ppuCommission = ko.observable("");
	
    this.averageConsumption = ko.computed(function() {
		if (this.customerAQ() && this.customerSupplies())
        	return (this.customerAQ() / this.customerSupplies()); 		
    }, this);
	
	//Calculate the Total Commission to receve
    this.totalCalculatedCommission = ko.computed(function() {
		//var utility = this.selectedUtility();
		var utility = this.radioSelectedOptionValue();
		var customerAQ = this.customerAQ();
		var averageAQ = this.averageConsumption();
		var numSupplies = this.customerSupplies();
		if (this.customerAQ() && this.customerSupplies())
			
			// Electricity Tender Commission Structure
			if (utility == "Electricity" && averageAQ <= "70192" && numSupplies === "1") {
				return min_revenue_tender.toFixed(2);	
				
			// Gas Tender Commission Structure
			} else if (utility == "Natural Gas" && averageAQ <= "228125" && numSupplies === "1") {
				return min_revenue_tender.toFixed(2);
			}
			
			// Electricity Site Commission Structure
			else if (utility == "Electricity" && averageAQ <= "70192" && numSupplies > "1") {
				return ((-0.017 * Math.pow(numSupplies, 2))+(31.326 * numSupplies)+(119.912)).toFixed(2);
			}
			
			// Gas Site Commission Structure
			else if (utility == "Natural Gas" && averageAQ <= "228125" && numSupplies > "1") {
				return ((-0.017 * Math.pow(numSupplies, 2))+(31.326 * numSupplies)+(119.912)).toFixed(2);
			}
			
			// 1% Electricity Commission Structure
			else if (utility === "Electricity" && averageAQ > "70192") {
				return ((average_electricity_commission * customerAQ) /100).toFixed(2);
			
				// 1% Gas Commission Structure
			} else if (utility === "Natural Gas" && averageAQ > "228125") {
				return ((average_gas_commission * customerAQ) /100).toFixed(2);
		}
        		
    }, this);
	
	//Return the option of a site commission model if less than max_commission_day
	this.fixCommissionCheck = ko.computed(function() {
		if ((this.totalCalculatedCommission() * 100 / 365 / this.customerSupplies()) <= max_commission_day) {
			return (this.totalCalculatedCommission() * 100 / 365 / this.customerSupplies()).toFixed(2);
		} 
	}, this);
	
	//Return the option of a ppu commission model if less than max_utility_commission
	this.ppuCommissionCheck = ko.computed(function() {
		if (this.radioSelectedOptionValue() === "Electricity") {
			return ((this.totalCalculatedCommission() * 100 / this.customerAQ()) <= max_elec_commission_ppu) ? (this.totalCalculatedCommission() * 100 / this.customerAQ()).toFixed(4) : "";
		return ((total * 100) / aq).toFixed(2);
		} else if (this.radioSelectedOptionValue() === "Natural Gas") {
			return ((this.totalCalculatedCommission() * 100 / this.customerAQ()) <= max_gas_commission_ppu) ? (this.totalCalculatedCommission() * 100 / this.customerAQ()).toFixed(4) : "";
		} else {
			return "";
		}
	}, this);
	

	this.formattedConsumption = ko.pureComputed(function() {
	        	return this.customerAQ().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	    }, this);
		
	
	
	//Add formatted observable to the target observable.
	ko.extenders.addCurrencyFormatted = function(target, decimals) {
	    target.formatted = ko.computed({
	        read: function() {
	            var val = target();
 
	            //Insert 1000 space.
	            var formattedValue = ('R ' + val).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	            return formattedValue;
	        },
	        write: function(newValue) {
	            var current = target();
	            var valueToWrite = formatToNumber(newValue, decimals);
 
	            //only write if it changed
	            if (valueToWrite !== current) {
	                target(valueToWrite);
	            } else {
	                if (newValue !== current) {
	                    target.notifySubscribers(valueToWrite);
	                }
	            }
	        }
	    });
	    return target;
	};
	
		
	//reset and clear the form
    this.clearForm = function() {
		this.customerName(""); 
		this.selectedUtility("");
		this.customerAQ("");
		this.customerSupplies(""); 
      };
}

// Activates knockout.js
ko.applyBindings(new AppViewModel());


//var rangeInput = document.querySelector('input#range-example');

  // grab <p id="output"></p> to display the output
 // var output = document.querySelector('p#output');

  // update the display when the range changes
//  rangeInput.onchange = function() {
//      output.innerHTML = this.value;
//  };