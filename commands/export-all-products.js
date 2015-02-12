var Command = require('ronin').Command;

var vendSdk = require('vend-nodejs-sdk')({});
var utils = require('./../utils/utils.js');
var fileSystem = require('q-io/fs');
//var Promise = require('bluebird');
var moment = require('moment');
//var _ = require('underscore');

var ListProducts = Command.extend({
  desc: 'List All Suppliers',

  options: {
    token: 'string',
    domain: 'string'
  },

  run: function (token, domain) {
    var connectionInfo = utils.loadOauthTokens(token, domain);

    return vendSdk.products.fetchAll(connectionInfo)
      .then(function(response) {
        console.log('listProducts.js - 1st then block');
        return utils.updateOauthTokens(connectionInfo,response);
      })
      .then(function(products) {
        console.log('listProducts.js - 2nd then block');
        //console.log(products);

        console.log('products.length: ', products.length);
        //console.log('products: ', JSON.stringify(products,vendSdk.replacer,2));

        var filename = 'listProducts-' + moment.utc().format('YYYY-MMM-DD-HH:mm:ss') + '.json';
        console.log('saving to ' + filename);
        return fileSystem.write(filename, // save to current working directory
          JSON.stringify(products,vendSdk.replacer,2));
      })
      .catch(function(e) {
        console.error('listProducts.js - An unexpected error occurred: ', e);
      });
  }
});

module.exports = ListProducts;
