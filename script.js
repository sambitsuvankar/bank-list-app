'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Sambit suvankar',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',  // This is in standard time format of london.
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-12-28T17:01:17.194Z',
    '2020-12-30T23:36:17.929Z',
    '2021-01-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Mahesh padhy',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const account3 = {
    owner : 'Rajat kumar sahoo',
    movements : [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate : 0.7,
    pin : 3333,
    movementsDates: [
        '2019-11-18T21:31:17.178Z',  // This is in standard time format of london.
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2020-12-28T17:01:17.194Z',
        '2020-12-30T23:36:17.929Z',
        '2021-01-01T10:51:36.790Z',
      ],
      currency: 'EUR',
      locale: 'pt-PT', // de-DE
};

const account4 = {
    owner : 'Rohan sahoo',
    movements : [430, 1000, 700, 50, 90],
    interestRate : 1,
    pin : 4444,
    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
      ],
      currency: 'USD',
      locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogIn = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUserName = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUserName = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//Functions
/////////////////////////////////////////////////
//  Time Functions
const formatMovementDate = function(date){

        const calcDaysPassed = (date1,date2) => Math.round( Math.abs((date2 - date1)) / (1000 * 60 * 60 * 24) );

        const daysPassed = calcDaysPassed(new Date(), date);
        console.log(daysPassed)
        if(daysPassed === 0) return 'Today';
        if(daysPassed === 1) return 'Yesterday';
        if(daysPassed  <= 7) return `${daysPassed} days ago`;
        // else{
        //     const dates = `${date.getDate()}`.padStart(2, 0); // 1st parameter = required length
        //     const month = `${date.getMonth() + 1}`.padStart(2,0); // 2nd parameter = starts with
        //     const year = date.getFullYear();
        //     return `${dates}/${month}/${year}` 
        // }
        const local = navigator.language;  // To know the local language of browser
        return new Intl.DateTimeFormat(local).format(date)
               
}
//////////////////////////////////////////////////////
// Formatted currency function________________
const formattedCurrency = function(value, locale, currency){
    const formattedMov = new Intl.NumberFormat(locale,{
        style : 'currency',
        currency : `${currency}`
    }).format(value);
    return formattedMov;
}

//////////////////////////////////////////////////////
// Display movements
const displayMovements = function (acc , sort = false){
    containerMovements.innerHTML = "";
    // .textContent = 0;

    const movs = sort ? acc.movements.slice().sort((a, b) => a- b) : acc.movements //Here we have created a copy of the movement array by using slice() method ,Because the sort() will mutate the original array which we dont want to happen. We could have used the spread(...) operator here to make a copy of movement array but as we are in a middle of chaining method we have to use the slice() method to create a copy. 

    movs.forEach( function (mov, i){
         
        const type = mov > 0 ? 'deposit' : 'withdrawal'

        const date = new Date(acc.movementsDates[i])
        const displayDate = formatMovementDate(date)

        const formatMov = formattedCurrency(mov, acc.locale, acc.currency);

        // const formattedMov = new Intl.NumberFormat(acc.locale,{
        //     style : 'currency',
        //     currency : `${acc.currency}`          //(for the reusable purpose we made a separate function)
        // }).format(mov)

        // const date = `${displayDate.getDate()}`.padStart(2, 0); // 1st parameter = required length
        // const month = `${displayDate.getMonth() + 1}`.padStart(2,0); // 2nd parameter = starts with
        // const year = displayDate.getFullYear();
        // const movDates = `${date}/${month}/${year}` 

        // const daysPassed = (date1,date2) => Math.abs((date2 - date1)) / (1000 * 60 * 60 * 24);

        const html = `<div class="movements__row">
                            <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
                            <div class="movements__date">${displayDate}</div>
                            <div class="movements__value">${formatMov}</div>
                        </div>`;
        
        containerMovements.insertAdjacentHTML('afterbegin',html)  // 1st parameter = position ,2nd parameter =content.
    })
}

// console.log(containerMovements.innerHTML)

/////////////////////////////////////////
// Make User names
const creatUserName = function(acc){ // This function takes 'accounts' Array as a parameter
    acc.forEach(function(acc){  // For each element of accounts array 
        acc.userName = acc.owner.toLowerCase().split(' ').map(function(name){  
            return name[0]
         }).join('') //We created a new property called "userName" in each element of 'accounts' Array. 
    });
}
// const user = 'Rajat Kumar Sahoo'  // rks
creatUserName(accounts)
console.log(accounts)


//////////////////////////////////////////////
// Print balance function

const calcDisplayBalance = function(acc){
    acc.balance = acc.movements.reduce(function(accu, mov){
        return accu + mov;
    },0)

    const formattedBal = formattedCurrency(acc.balance, acc.locale, acc.currency)

    labelBalance.textContent = `${formattedBal}`
    // labelBalance.textContent = `${acc.balance.toFixed(2)}€`  // Here we used toFixed(2) method to make the decimal value upto 2 digit.
}
;
//////////////////////////////////////
// Calculate Display Summary
const calcDisplaySummary = function (acc){  //Here we passed the entire Object as this function's parameter.
    const deposits = acc.movements.filter(mov => mov > 0)
                              .reduce((accu, mov) => accu + mov ,0);

                              const formattedDep = formattedCurrency(deposits, acc.locale, acc.currency)

    labelSumIn.textContent = `${formattedDep}`

    const withdraw = acc.movements.filter(mov => mov < 0)
                              .reduce((acc,mov) => acc + mov ,0);

                              const formattedWith = formattedCurrency(withdraw, acc.locale, acc.currency)

    labelSumOut.textContent = `${formattedWith}`

    const interest = acc.movements.filter(mov => mov > 0)
                              .map(deposit => deposit * acc.interestRate / 100)  //To calculate the interest rate dynamically
                              .filter((int, i, arr)=> {
                                //   console.log(arr)
                                  return int >= 1;
                              })
                              .reduce((acc, int) => acc + int ,0)

                              const formattedInt = formattedCurrency(interest, acc.locale, acc.currency)

    labelSumInterest.textContent = `${formattedInt}`
}

//////////////////////////////////////////////////
// Function for update the UI where we call all the above functions that we have created
const updateUI = function(currentAccount){
     // Display movements
     displayMovements(currentAccount);

     // Display Balance
     calcDisplayBalance(currentAccount);

     // Display Summary
     calcDisplaySummary(currentAccount);
}

////////////////////////////////////////////////////////////////////////////
// Log out Timer function
const startLogOutTimer = function(){
    // Set time to 5 minutes
    let time = 300;
    const tick = () => {
        const min = String(Math.trunc(time / 60)).padStart(2, 0)
        const sec = String(time % 60).padStart(2, 0);
        // In each call print the remaining time to UI
        labelTimer.textContent = `${min}:${sec}`;

       
        // When 0 seconds, Stop timer and logOut user.
        if(time === 0){
            clearInterval(interval)
            containerApp.style.opacity = 0;
            labelWelcome.textContent = `Log in to get started`;
        }
        // Decrease 1 sec in every function call
        time--;
    }
    tick()
  
    // Call the timer every second
    const interval = setInterval(tick, 1000);
    return interval;     // Here we returned the value of setInterval function so that we can use the value to the global variable 'timer' so that we can reuse the value to reset the timer.

};


/////////////////////////////////////////////////////////////////////////////
// Events Handler
let currentAccount;
let timer;

// FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount)
// containerApp.style.opacity = 100;
// EXPERIMENTING INTERNALIZATION API

///////////////////////////////////////////////////////////////////////////////////////
btnLogIn.addEventListener('click', function(e){
    // prevent form from submitting
    e.preventDefault()
    console.log("Log in")

    currentAccount = accounts.find(acc => acc.userName === inputLoginUserName.value)
    console.log(currentAccount);

    if(currentAccount?.pin === Number(inputLoginPin.value)){  //Here we used the optional chaining (.?) to check wheather the 'currentAccount' variable holds any value or not. 
        console.log("Verified")
        // Display UI and message
        labelWelcome.textContent = `Welcome Back, ${currentAccount.owner.split(' ')[0]}`;
        containerApp.style.opacity = 100;

        // Create Current Date and Time // Day/ month / Year (manually)

        /*const now = new Date();
        const date = `${now.getDate()}`.padStart(2, 0); // 1st parameter = required length
        const month = `${now.getMonth() + 1}`.padStart(2,0); // 2nd parameter = starts with
        const year = now.getFullYear();
        const hour = `${now.getHours()}`.padStart(2,0);
        const min  = `${now.getMinutes()}`.padStart(2,0);
        labelDate.textContent = `${date}/${month}/${year}, ${hour}:${min}` */

        // Create Current Date and Time // Day/ month / Year (through internationalization)

        const now = new Date();
        const option = {
            hour : 'numeric',
            minute : 'numeric',
            day : 'numeric',
            month : 'long',  // numeric = number ; long = name of the month; 2-digit = 01 /02
            year : 'numeric',
            weekday : 'long'
        }
        labelDate.textContent = new Intl.DateTimeFormat(`${currentAccount.locale}`, option).format(now)  // internationalization.
        // const local = navigator.language;  // To know the local language of browser
        // console.log(local)

        // Clear Input field
        inputLoginUserName.value = inputLoginPin.value = '';
        inputLoginPin.blur();

        //TIMER
        if(timer) clearInterval(timer); 
        timer = startLogOutTimer()

        // startLogOutTimer()
       updateUI(currentAccount);
    }
})

//////////////////////////
// Transfer Money function
btnTransfer.addEventListener('click', function(e){
    e.preventDefault();

    const amount = Number(inputTransferAmount.value);
    const recieverAcc = accounts.find(acc => acc.userName === inputTransferTo.value);

    //clear the input fields after the click event
    inputTransferTo.value = inputTransferAmount.value = ''

    if(amount > 0 && recieverAcc && currentAccount.balance >= amount && recieverAcc?.userName !== currentAccount.userName) {
        // Doing the transfer
        currentAccount.movements.push(-amount);
        recieverAcc.movements.push(amount)

        // Add Transfer dates
        currentAccount.movementsDates.push(new Date().toISOString());
        recieverAcc.movementsDates.push(new Date().toISOString())
        
        // Updating the UI by calling the updateUI() function
        updateUI(currentAccount)

        // reset TIMER
        clearInterval(timer); 
        timer = startLogOutTimer()
    }

})
////////////////////////////////////////////////
// Request Loan amount
// Our bank has a rule that it only grants loan if the person has atleast one deposit with 10% of the request loan amount.

btnLoan.addEventListener('click', function(e){
    e.preventDefault();

    const amount = Math.floor(Number(inputLoanAmount.value)) 
    const eligible = currentAccount.movements.some(acc => acc > amount * 0.1); // Applied 'some()' Method.
    if (amount > 0 && eligible){
        console.log("Loan granted")

      setTimeout (function () {  //Add movements
        currentAccount.movements.push(amount);

        // Add transfer Dates
        currentAccount.movementsDates.push(new Date().toISOString());

        //Update the UI
        updateUI(currentAccount)}, 2500)

        // reset TIMER
        clearInterval(timer); 
        timer = startLogOutTimer()
    }
    inputLoanAmount.value =''
})


////////////////////////////////////////////////////
// Close Account
btnClose.addEventListener('click', function(e){
    e.preventDefault()

    

    if(inputCloseUserName.value === currentAccount.userName && Number(inputClosePin.value) === currentAccount.pin){

        const index = accounts.findIndex( acc =>  // Here we have used the "findIndex()" method 
            acc.userName === currentAccount.userName    // This will return the index of the element which will satisfy the condition.
        )
        console.log(index)

        // Delete Account
        accounts.splice(index , 1)
        // Hide UI
        containerApp.style.opacity = 0;
    }
    
    inputCloseUserName.value = inputClosePin.value = ''; // To clear the input field after click enter.
})
/////////////////////////////////////////////////
// Sorting function
let sorted = false;
btnSort.addEventListener('click', function(e){
    e.preventDefault();

    displayMovements(currentAccount, !sorted)
    sorted = !sorted;  // Every times the button get clicked the value of the sorted variable will change alternatively.
});


/////////////////////////////////////////////////////////////////////////


// Example use case of 'remainder()' operator
labelBalance.addEventListener('click', function(){
    [...document.querySelectorAll('.movements__row')].forEach(function(row, i){
        // if( i % 2 === 0 ) row.style.backgroundColor = 'orange'; 
        if( i % 3 === 0 ) row.style.backgroundColor = 'tomato' ;
       })
    console.log('clicked')
})

//////////////////////////////////////////////////////////////////////////////////

// examples of Date creation
console.log(new Date(account1.movementsDates[0]))