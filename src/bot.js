import botBuilder from 'claudia-bot-builder';
import botReply from './bot/reply';

/*
  Token:
  EAAZAKw299QncBAPjrp1T1AT0A5h6HZAVcfx794J85tNYYKnbp4DPOtD15c5oxVmUZBNZCHesF3ojvViXyKa4fjMb6M23lZCWajLEPSNYNa0XVlIwbm4vvKe9pHlICz1Cfb1vTbRXeAL3NPTbGKGVbY9zR2ELHbLZBUlscvamZBqlgZDZD
  App secret: ce7a646fa10260bbd79628b9e582ba49

  For lambda create => MUST UPDATE verify_URL & verify_token
*/

const api = botBuilder((message) => {
  console.log('RECEIVE MESSAGE =', JSON.stringify(message));
  return botReply(message);
});

module.exports = api;
