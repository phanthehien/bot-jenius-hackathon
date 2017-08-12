import api from '../service/apiClient';
import { fbTemplate } from 'claudia-bot-builder';
const ACTION_SEND = 'send';
const ACTION_INFO = 'info';

const CONTEXT_SENDING = 'TRANSFER_MONEY';
const CONTEXT_SENDING = 'TRANSFER_MONEY_SELECT_USER';
const CONTEXT_SENDING_YES = 'YES';
const CONTEXT_SENDING_NO = 'NO';

class TransferService {
  _getCurrentBalance(user) {
    const { profile: { firstName } } = user;

    const account = user.accounts.find(a => a.type === 'PRIMARY_ACCOUNT');
    return Promise.resolve(`Hi ${firstName}, your Active Balance is ${account.balance} ${account.currency} 👍`);
  }

  _extractAccount(sentence) {
    let number = null;
    const numbers = sentence.match(/\d+/);
    if (numbers && numbers.length > 0) {
      number = numbers[0];
    }

    return number;
  }

  _extractNumber(sentence, accounts) {
    const allAcounts = (accounts instanceof Array)? accounts : [accounts];

    let changedSentence = sentence;
    for(const account of allAcounts) {
      changedSentence = changedSentence.replace(account, '');
    }

    let number = null;
    const numbers = changedSentence.match(/\d+/);
    if (numbers && numbers.length > 0) {
      number = numbers[0];
    }

    return Number(number);
  }

  _sendMoney(command) {
    const { user, sentence, session } = command;
    const { profile: { firstName } } = user;

    const toIndex = sentence.lastIndexOf('to');
    let toAccount = null;
    let amount = null;
    if (toIndex > 0) {
      const accountPart = sentence.substring(toIndex);
      toAccount = this._extractAccount(accountPart);
      amount = this._extractNumber(sentence, toAccount);
    }

    if (amount && toAccount) {
      const fromAccount = '90010011012';
      const message = `Hi ${firstName}, you want to transfer ${amount} to account ${toAccount}, is that correct?`;
      session.context = CONTEXT_SENDING;
      session.context_data = {
        amount,
        toAccount,
        fromAccount
      };
      return new fbTemplate.button(message)
        .addButton('Yes', CONTEXT_SENDING_YES)
        .addButton('No', CONTEXT_SENDING_NO)
        .get()

    } else {
      return Promise.resolve(`Hi ${firstName}, seem you want to transfer money, but can you add more detail like [send to {account} {amount} idr by current account]? :)`);
    }
  }

  runReplyCommand(message, session) {
    session.context = null;
    if (message === CONTEXT_SENDING_YES.toLowerCase()) {
      const { amount, toAccount, fromAccount } = session.context_data;
      const command = {
        noun: ''
      };

      return api
        .transferAmount(fromAccount, toAccount, amount)
        .then(data => `Transferred money to account ${toAccount} already. good luck with it!`)
        .catch(data => `Seem account ${toAccount} doesn't exists. Please help checking it again.`);
    }
    return Promise.resolve('You choose cancel transfer money.')
  }

  runCommand(command) {
    const { action } = command;

    switch(action) {
      case ACTION_SEND:
        return this._sendMoney(command);
        break;
    }
  }
}

export default TransferService;