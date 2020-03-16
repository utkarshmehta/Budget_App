//BUDGET CONTROLLER
var budgetController = (function(){
    var Expense = function(type,id, description, value){
        this.type = type;
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Income = function(type, id, description, value){
        this.type = type;
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(current){
            sum += current.value;
        });
        data.totals[type] = sum;

    };


    var data = {
        allItems : {
            exp:  [],
            inc: []
        },
        totals : {
            exp: 0,
            inc: 0
        },
        budget:0,
        percentage: -1,
        
    };
    return {
        addItem: function(type, des, val){
            var newItem, ID;
            //Create new ID
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else{
                ID = 0;
            }
            
            //Create new item based on 'inc' or 'exp' type
            if(type === 'exp'){
                newItem = new Expense(type, ID, des, val);
            }
            else if(type === 'inc') {
                newItem = new Income(type,ID, des, val);
            }
            data.allItems[type].push(newItem);
            //Return new element
            return newItem;
        },
        calculateBudget: function(){
            //Calculate Total income and expense
            calculateTotal('exp');
            calculateTotal('inc');
            //Calculate Budget(Income- Expesnse)
            data.budget = data.totals.inc - data.totals.exp;
            // Calculate the percent of income that we spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else{
                data.percentage = -1;
            }
        },

        budgetCalculator: function(value){
            var amount = 0;
            amount = value;
            return amount;
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpense: data.totals.exp,
                percent: data.percentage

            }
        }

    }

})();



//UI CONTROLLER
var UIController = (function(){
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer:'.income__list',
        expenseContainer:'.expenses__list',
        budgetContainer: '.budget__value',
        incomeContainerValue: '.budget__income--value',
        expenseContainerValue: '.budget__expenses--value',
        expensePercentageContainer: '.budget__expenses--percentage'
    };
    return{
        getInput: function(){
            return {
                 type: document.querySelector(DOMstrings.inputType).value,   // will be either 'inc' or 'exp'
                 description: document.querySelector(DOMstrings.inputDescription).value,
                 value: parseFloat(document.querySelector(DOMstrings.inputValue).value),

            };
        },
        addListItem:function(obj, type){
        var html, newHtml;
            //Create HTML strings with place holder text
        if(type == 'inc'){ 
             element = DOMstrings.incomeContainer;
             html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
         }
        else if( type == 'exp'){
            element = DOMstrings.expenseContainer;
            html = '<div class="item clearfix" id="expense-%d%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
            //Replace Place Holder text with actual data
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', obj.value);
        
            //Insert HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        
        },

        clearFields: function(){
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function(current,index, array){
                current.value = "";
            });
            fieldsArray[0].focus();
        },

        displayBudget: function(obj){
            console.log(obj)
             document.querySelector(DOMstrings.budgetContainer).textContent = obj.budget;
             document.querySelector(DOMstrings.incomeContainerValue).textContent = obj.totalIncome;
             document.querySelector(DOMstrings.expenseContainerValue).textContent = obj.totalExpense;
             document.querySelector(DOMstrings.expensePercentageContainer).textContent = obj.percent;
        },

        getDOMstrings: function(){
            return DOMstrings;
        },
    };

})();

//GLOBAL CONTROLLER
var controller = (function(budgetCtrl, UICtrl){
    var setUpEventListeners = function(){
        var DOM = UIController.getDOMstrings();
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function($event){
            if($event.keyCode === 13 )
            ctrlAddItem();
        });
    };
    
    var updateBudget = function (){
    // 1. CALCULATE BUDGET
    budgetController.calculateBudget();
    // 2. Return The Budget

    var budget = budgetCtrl.getBudget();
    // 3. DISPLAY THE BUDGET ON THE UI
     UICtrl.displayBudget(budget);
    };

    var ctrlAddItem = function(){
        var input, newItem;
        //  1. GET THE FIELD INPUT DATA
        input = UIController.getInput();
        if(input.description !== '' &&  input.value !== NaN && input.value > 0){
                    //console.log(input);
        //  2. ADD THE ITEM TO THE BUDGET CONTROLLER
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        //  3. ADD THE ITEM TO THE UI
        UICtrl.addListItem(newItem, newItem.type);
        // 4. Clear the fields
        UICtrl.clearFields();

        //5. Calculate and Update Budget
        updateBudget();
        
        }
        
    };
    return {
        init: function(){
            console.log('Application started');
            setUpEventListeners();
        }
    };
})(budgetController, UIController);

controller.init();