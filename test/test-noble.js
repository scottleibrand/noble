var events = require('events');
var should = require('should');
var sinon = require('sinon');

var Noble = require('../lib/noble');

describe('Noble', function() {
  it('reports unknown-peripheral connect errors with numeric HCI status', function() {
    var noble = new Noble(new events.EventEmitter());
    var warning = null;
    var error = new Error('Command Disallowed (0xc)');
    error.hciStatus = 12;
    error.hciStatusHex = '0x0c';
    error.hciDeviceId = 0;
    noble.logAdapterFlagsForConnectFailure = sinon.spy();
    noble.on('warning', function(message) {
      warning = message;
    });

    noble.onConnect('mock-peripheral', error);

    warning.should.equal(
      'unknown peripheral mock-peripheral connected! ' +
      'error=Command Disallowed (0xc) hciStatus=0x0c'
    );
    noble.logAdapterFlagsForConnectFailure.calledOnce.should.equal(true);
    noble.logAdapterFlagsForConnectFailure.calledWithExactly(error).should.equal(true);
  });

  it('does not capture adapter flags for a successful unknown-peripheral callback', function() {
    var noble = new Noble(new events.EventEmitter());
    var warning = null;
    noble.logAdapterFlagsForConnectFailure = sinon.spy();
    noble.on('warning', function(message) {
      warning = message;
    });

    noble.onConnect('mock-peripheral', null);

    warning.should.equal(
      'unknown peripheral mock-peripheral connected! error=none hciStatus=unknown'
    );
    noble.logAdapterFlagsForConnectFailure.called.should.equal(false);
  });
});
