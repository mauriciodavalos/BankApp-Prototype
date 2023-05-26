'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP //

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type 
      movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov, i, arr) => {
      return mov > 0;
    })
    .reduce((acc, mov, i, arr) => {
      return acc + mov;
    }, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter((mov) => {
      return mov < 0;
    })
    .reduce((acc, mov) => {
      return acc + mov;
    });
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter((mov, i, arr) => {
      return mov > 0;
    })
    .map((deposit) => {
      return (deposit * acc.interestRate) / 100;
    })
    .filter((int) => {
      return int >= 1;
    })
    .reduce((acc, int) => {
      return acc + int;
    });

  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

//GENERATE USERNAME
const userNameGenerator = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map((str) => {
        return str[0];
      })
      .join('');
  });
};

userNameGenerator(accounts);

//UPDATE UI FUNCTION
const updateUI = function (acc) {
  //Display Movements
  displayMovements(acc.movements);

  //Display Balance
  calcDisplayBalance(acc);

  //Display Summary
  calcDisplaySummary(acc);
};

//EVENT ACCOUNT LOGIN
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  //Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and Message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //CLEAR INPUT FIELDS
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //UPDATE UI
    updateUI(currentAccount);
  }
});

//EVENT MONEY TRANSFER HANDLER
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //UPDATE UI
    updateUI(currentAccount);
  }
});

//EVENT REQUEST A LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    //Add the movement
    currentAccount.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  } else {
    alert('LOAN IS NOT VALID');
  }
  inputLoanAmount.value = '';
});

//EVENT CLOSE & DELETE ACCOUNT HANDLER
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.pin === Number(inputClosePin.value) &&
    currentAccount.userName === inputCloseUsername.value
  ) {
    const index = accounts.findIndex(
      (acc) => acc.userName === currentAccount.userName
    );

    //DELETE ACCOUNT
    accounts.splice(index, 1);

    //HIDE UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

//EVENT SORT MOVEMENTS
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURESs

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const indexxx = movements.findIndex((mov) => {
  return mov === -400;
});
// console.log('iii', indexxx);

/////////////////////////////////////////////////

// Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

function checkDog(dataJulia, dataKates) {
  const dataKatesCorrected = dataKates.slice(1, 4);

  const completeData = dataJulia.concat(dataKatesCorrected);

  completeData.forEach(function (age, number) {
    if (age >= 3) {
      console.log(`Dog number ${number} is an adult, it is ${age} years old `);
    } else {
      console.log(`Dog number ${number} is a puppy, it is ${age} years old `);
    }
  });
}

// checkDog([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// console.log('------');
// checkDog([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

const eurToUsd = 1.1;

const movementsUSD = movements.map((mov, index) => {
  return mov * eurToUsd;
});

// console.log(movementsUSD);

const calcAverageHumanAge = function (data) {
  const dogHumanAges = data
    .map((dogAge) => {
      return dogAge <= 2 ? dogAge * 2 : dogAge * 4 + 16;
    })
    .filter((dogAge) => {
      return dogAge >= 18;
    });
  const averageDogHumanAges =
    dogHumanAges.reduce((acc, cur, i, arr) => {
      return acc + cur;
    }, 0) / dogHumanAges.length;

  // console.log(dogHumanAges);
  // console.log(averageDogHumanAges);
};

const averageDogHumanAges = function (data) {
  let arrLength = [];
  const dogAvgHumanAges =
    data
      .map((dogAge) => {
        return dogAge <= 2 ? dogAge * 2 : dogAge * 4 + 16;
      })
      .filter((dogAge) => {
        return dogAge >= 18;
      })
      .reduce((acc, cur, i, arr) => {
        arrLength = arr.length;
        return acc + cur;
      }, 0) / arrLength;

  console.log(dogAvgHumanAges);
};

// averageDogHumanAges([5, 2, 4, 1, 15, 8, 3]);
// averageDogHumanAges([16, 6, 10, 5, 6, 1, 4]);

const fistWithdrawal = movements.find((mov, i, arr) => {
  // console.log(`${mov} & ${i}`);
  return mov > 0;
});

const account = accounts.find((acc) => acc.owner == 'Jessica Davis');
// console.log(account);

for (const accountFor of accounts) {
  if (accountFor.owner === 'Jessica Davis') {
    // console.log(accountFor);
  }
}
