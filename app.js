//BUDGET CONTROLLER
var budgetController = (function(){
    var Expense = function(type,id, description, value){
        this.type = type;
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
        
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }
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
                newItem = new Income(type, ID, des, val);
            }
            data.allItems[type].push(newItem);
            //Return new element
            return newItem;
        },

        deleteItem: function(type, id){
            var ids, index;
             ids = data.allItems[type].map(function(current){
                return current.id;
            });
            index = ids.indexOf(id);
            if(index !== -1)
            {
                data.allItems[type].splice(index,1);
            }

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

        calculatePercentages: function(){
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            }); 
        },

        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            }); 
            return allPerc;
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpense: data.totals.exp,
                percent: data.percentage

            };
        },
        testing: function(){
            console.log(data)
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
        expensePercentageContainer: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage'
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
             html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
         }
        else if( type == 'exp'){
            element = DOMstrings.expenseContainer;
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
            //Replace Place Holder text with actual data
        //obj.value = '$' + obj.value;    //Add $ in front of value/cost
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', this.formatNumber(obj.value));
        
            //Insert HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        
        },

        deleteListItem: function(selectorID){
            var el = document.getElementById(selectorID)
            el.parentNode.removeChild(el);
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
             document.querySelector(DOMstrings.budgetContainer).textContent = obj.budget;
             document.querySelector(DOMstrings.incomeContainerValue).textContent = obj.totalIncome;
             document.querySelector(DOMstrings.expenseContainerValue).textContent = obj.totalExpense;
             if(obj.percent > 0) {
                document.querySelector(DOMstrings.expensePercentageContainer).textContent = obj.percent + '%';
             }
             else{
                document.querySelector(DOMstrings.expensePercentageContainer).textContent = '---'
             }
             
        },

        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            var  NodeListForEach = function(list, callback){
                for(var i = 0; i< list.length; i++){
                    callback(list[i], i);
           }
        };

            NodeListForEach(fields, function(current, index){
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            })
        },

        formatNumber: function(num, type){
            var numSplit, int, dec, type;
            /*
            1. + or -
            2. exactlt 2 decimal points
            3. comma separating the thousands
            2310.4567 -> +2,310.46
            2000 -> +2,000.00
            */ 
           num = Math.abs(num);
           num = num.toFixed(2);
           numSplit = num.split('.');
           int = numSplit[0];
           
           if(int.length > 3){
               int = int.substr(0, int.length - 3) + ',' + int.substr(int.length-3, 3); //input 2310 -> 2,310
           }
           dec = numSplit[1];
           return (type === 'exp' ? sign = '-' : sign = '+') + ' ' + int + dec;
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
        document.addEventListener('keydown', function($event){
            if($event.keyCode === 13 || $event.which === 13 ){
                ctrlAddItem();
            }
        });
            document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
    };
    
    var updateBudget = function (){
    // 1. CALCULATE BUDGET
    budgetController.calculateBudget();
    // 2. Return The Budget

    var budget = budgetCtrl.getBudget();
    // 3. DISPLAY THE BUDGET ON THE UI
     UICtrl.displayBudget(budget);
    };

    var updatePercentages = function(){
        // 1. Calculate Percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percetages from the budget controller

        var percentages = budgetCtrl.getPercentages();
        console.log(percentages);
        // 3. Update the UI with the new percentages
        UIController.displayPercentages(percentages);
    };
    var ctrlAddItem = function(){
        var input, newItem;
        //  1. GET THE FIELD INPUT DATA
        input = UIController.getInput();
        if(input.description !== '' &&  input.value !== NaN && input.value > 0){
        //  2. ADD THE ITEM TO THE BUDGET CONTROLLER
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        //  3. ADD THE ITEM TO THE UI
        UICtrl.addListItem(newItem, newItem.type);
        // 4. Clear the fields
        UICtrl.clearFields();

        //5. Calculate and Update Budget
        updateBudget();
        //6. Calculate and update Percentages
        updatePercentages();
        
        }
        
    };

    var ctrlDeleteItem = function($event){
        var itemID, splitID, type, ID;
       itemID =  $event.target.parentNode.parentNode.parentNode.parentNode.id;
       console.log(itemID);
       if (itemID) {
           //inc-1
           splitID = itemID.split('-');
           type = splitID[0];
           ID = parseInt(splitID[1]);
           // 1. Delete the item from data structure
           budgetCtrl.deleteItem(type,ID);
           // 2. Delete item from UI
           UICtrl.deleteListItem(itemID);
           // 3. Update and show the new budget
           updateBudget();
           //4. Calculate and update Percentages
            updatePercentages();
       }
    };
    return {
        init: function(){
            console.log('Application started Successfully');
            UICtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpense: 0,
                percent: -1
            });
            setUpEventListeners();
        }
    };
})(budgetController, UIController);

controller.init();