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


    var data = {
        allItems : {
            exp:  [],
            inc: []
        },
        totals : {
            exp: 0,
            inc: 0
        }
        
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
        testing: function(){
            console.log(data);
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
    };
    return{
        getInput: function(){
            return {
                 type: document.querySelector(DOMstrings.inputType).value,   // will be either 'inc' or 'exp'
                 description: document.querySelector(DOMstrings.inputDescription).value,
                 value: document.querySelector(DOMstrings.inputValue).value,

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
        console.log(type);
        console.log(html);
            //Replace Place Holder text with actual data
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', obj.value);


            //Insert HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        
        },

        getDOMstrings: function(){
            return DOMstrings;
        }
            
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
    
    var ctrlAddItem = function(){
        var input, newItem;
        //  1. GET THE FIELD INPUT DATA
        input = UIController.getInput();
        
        //console.log(input);
        //  2. ADD THE ITEM TO THE BUDGET CONTROLLER
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        //  3. ADD THE ITEM TO THE UI
        UICtrl.addListItem(newItem, newItem.type);

        //  4. CALCULATE BUDGET
        //  5. DISPLAY THE BUDGET ON THE UI
    };
    return {
        init: function(){
            console.log('Appl started');
            setUpEventListeners();
        }
    };
})(budgetController, UIController);

controller.init();