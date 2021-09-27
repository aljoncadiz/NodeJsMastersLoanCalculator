#!/usr/bin/env node
const argv = require('yargs/yargs')(process.argv.slice(2))
    .usage('Usage: node $0 --bankName=[bank] --loanAmount=[num] --loanTerm=[num]')
    .options(
        {
         'bankName': {
            alias: 'bankName',
            demandOption: true,
            describe: 'name of bank ie: bpi, metrobank, bdo',
            type: 'string'
         },
         'loanAmount': {
            alias: 'loanAmount',
            demandOption: true,
            describe: 'loan amount: value must be greater than 0',
            type: 'number'
         },         
         'loanTerm': {
            alias: 'loanTerm',
            demandOption: true,
            describe: 'loan term: value must be greater than 0',
            type: 'number'
         }   
        }
    )
    .argv;


class Bank {
    constructor(loanAmount) {
        this.loanAmount = loanAmount;
    }

    getMonthlyInstallment(loanTerm) {
        const rate = this.interestRate / 100;
        const grossInterestRate = (this.loanAmount * rate) * loanTerm;
        const totalLoanAmount = this.loanAmount + grossInterestRate;
        console.log('\n\nInstallment: ', totalLoanAmount / loanTerm);
        console.log('\n\n');
    }
}

class Metrobank extends Bank {
    constructor(loanAmount) {
        super(loanAmount)
        this.interestRate = 1.5;
    }
}

class BPI extends Bank {
    constructor(loanAmount) {
        super(loanAmount)
        this.interestRate = 1.2;
    }
}

class BDO extends Bank {
    constructor(loanAmount) {
        super(loanAmount)
        this.interestRate = 1.7;
    }
}

class LoanCalculator {
    constructor(bankName, loanAmount, loanTerm) {
        if(isNaN(loanAmount) || isNaN(loanTerm)) {
            throw Error('loanAmount and loanTerm value must be a number');
        }
        if(loanAmount <= 0) {
            throw Error('loanAmount value must be greater than 0');
        }
        if(loanTerm < 1) {
            throw Error('loanTerm value must be greater or equal to 1');
        }

        this.bankName = bankName;
        this.loanAmount = loanAmount;
        this.loanTerm = loanTerm;
    }

    getMonthlyInstallment() {
        let bank = null;
        switch(this.bankName.toLowerCase()) {
            case 'metrobank': bank = new Metrobank(this.loanAmount); break;
            case 'bpi': bank = new BPI(this.loanAmount); break;
            case 'bdo': bank = new BDO(this.loanAmount); break;
            default: throw Error('Bank unknown. please select between: Metrobank, BDO, BPI'); break;
        }
        bank.getMonthlyInstallment(this.loanTerm);
    }
}

const calculator = new LoanCalculator(argv.bankName, argv.loanAmount, argv.loanTerm);


console.log("\n\nBank Name:   ", calculator.bankName.toUpperCase());
console.log("Loan Amount: ", calculator.loanAmount);
console.log("Loan Term:   ", calculator.loanTerm);


calculator.getMonthlyInstallment();

