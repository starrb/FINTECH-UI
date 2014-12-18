'use strict';

// Here we attach this controller to our testApp module
var clientsCtrl = angular.module('clientsController', ['clientsService', 'Constants', 'smart-table']);

clientsCtrl.controller('ClientsCtrl', function($scope, $timeout, ClientsService, CreateClientsService, REST_URL, APPLICATION, Utility, dialogs) {
  console.log('ClientsCtrl : loadClients');
  //To load the clients page

  $scope.isLoading = false;
  $scope.rowCollection = [];
  $scope.displayed = [];

  //Success callback
  var allClientsSuccess = function(result) {
    $scope.isLoading = false;
    try {
      $scope.rowCollection = result.data;
      angular.forEach($scope.rowCollection, function(client) {
        client.image = APPLICATION.NO_IMAGE_THUMB;
        Utility.getImage(APPLICATION.host + REST_URL.CREATE_CLIENT + '/' + client.id + '/images?tenantIdentifier=default&output=inline_octet').then(function(result) {
          client.image = result;
        });
      });
    } catch (e) {
    }
  };

  //failur callback
  var allClientsFail = function() {
    $scope.isLoading = false;
    console.log('Error : Return from allClients service.');
  };

  var loadClients = function getData() {
    $scope.isLoading = true;

    $timeout(function() {
      $scope.rowCollection = [];
      //service to get clients from server
      ClientsService.getData(REST_URL.ALL_CLIENTS).then(allClientsSuccess, allClientsFail);
    }, 2000);
  };

  $scope.closeClient = function(client) {
    var dialog = dialogs.create('/views/Client/grids/closeClientDialog.html', 'ConfirmCloseClientDialog', {client: client}, {size: 'md', keyboard: true, backdrop: true});
    dialog.result.then(function(result) {
      if (result) {
        loadClients();
      }
    });
  };

  $scope.activateClient = function(client) {
    var msg = 'Are You sure want to re-activate client <strong>' + client.name + '</strong>?';
    var dialog = dialogs.create('/views/custom-confirm.html', 'CustomConfirmController', {msg: msg, title: 'Confirm Activate', submitBtn: {value: 'Activate', class: 'btn-success'}}, {size: 'sm', keyboard: true, backdrop: true});
    dialog.result.then(function(result) {
      if (result) {
        $scope.message = '';
        var currentDate = new Date();
        var json = {
          dateFormat: 'dd/MM/yyyy',
          locale: 'en',
          activationDate: currentDate.getDate() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear()
        };
        var url = REST_URL.CREATE_CLIENT + '/' + client.id + '?command=activate';
        CreateClientsService.saveClient(url, json).then(function(result) {
          console.log('Success CreateClientsService command activate', result);
          $scope.type = 'alert-success';
          $scope.message = 'Client has been successfuly activated.';
          loadClients();
        }, function(result) {
          $scope.type = 'error';
          $scope.message = 'Client not activated: ' + result.data.defaultUserMessage;
          $scope.errors = result.data.errors;
        });
      }
    });
  };

  loadClients();
});

clientsCtrl.controller('ConfirmCloseClientDialog', function($scope, $modalInstance, REST_URL, ClientsService, CreateClientsService, data) {
  $scope.client = data.client;
  $scope.info = {};
  var $url = REST_URL.CREATE_CLIENT_TEMPLATE + '?commandParam=close';
  ClientsService.getData($url).then(function(result) {
    if (result.data && result.data.closureReasons) {
      $scope.closureReasons = result.data.closureReasons;
    }
  }, function() {
    console.log('Cant recieve closure reasons data');
  });
  $scope.closeClient = function() {
    $scope.message = '';

    var currentDate = new Date();
    var json = {
      dateFormat: 'dd/MM/yyyy',
      locale: 'en',
      closureDate: currentDate.getDate() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear(),
      closureReasonId: $scope.info.closureReason
    };
    var url = REST_URL.CREATE_CLIENT + '/' + $scope.client.id + '?command=close';
    CreateClientsService.saveClient(url, json).then(function(result) {
      console.log('Success CreateClientsService command close', result);
      $modalInstance.close(true);
    }, function(result) {
      $scope.type = 'error';
      $scope.message = 'Account not removed: ' + result.data.defaultUserMessage;
      $scope.errors = result.data.errors;
    });
  };

  $scope.cancel = function() {
    $modalInstance.close(false);
  };

});


clientsCtrl.controller('LoansCtrl', function($scope, $location, $timeout, ClientsService, REST_URL, APPLICATION, Utility) {
  console.log('LoansCtrl : Loans');
  //To load the loans page

  $scope.isLoading = false;
  $scope.rowCollection = [];
  $scope.displayed = [];

  //Success callback
  var allLoansSuccess = function(result) {
    $scope.isLoading = false;
    try {
      $scope.rowCollection = result.data;
      angular.forEach($scope.rowCollection, function(loan) {
        loan.image = APPLICATION.NO_IMAGE_THUMB;
        Utility.getImage(APPLICATION.host + REST_URL.CREATE_CLIENT + '/' + loan.clientId + '/images?tenantIdentifier=default&output=inline_octet').then(function(result) {
          loan.image = result;
        });
      });
    } catch (e) {
    }
  };
  $scope.editLoan = function(loan) {
    console.log(loan);
    $location.url('/loans/' + loan.clientId + '/form/create/' + loan.loanId);
  };

  //failur callback
  var allLoansFail = function() {
    $scope.isLoading = false;
    console.log('Error : Return from allLoansFail service.');
  };

  var loadLoans = function getData() {
    $scope.isLoading = true;

    $timeout(function() {
      $scope.rowCollection = [];
      //service to get loans from server
      ClientsService.getData(REST_URL.LOANS).then(allLoansSuccess, allLoansFail);
    }, 2000);
  };

  loadLoans();
});


clientsCtrl.controller('LoansPendingApprovalsCtrl', function($scope, $timeout, ClientsService, REST_URL, dialogs) {
  console.log('LoansPendingApprovalsCtrl : LoansPendingApprovals');
  //To load the LoansPendingApprovals page

  $scope.isLoading = false;
  $scope.rowCollection = [];
  $scope.displayed = [];
  //Success callback
  var allLoansPendingApprovalsSuccess = function(result) {
    $scope.isLoading = false;
    try {
      $scope.rowCollection = result.data;
    } catch (e) {
    }
  };

  //failur callback
  var allLoansPendingApprovalsFail = function() {
    $scope.isLoading = false;
    console.log('Error : Return from allLoansPendingApprovalsFail service.');
  };

  var loadLoansPendingApprovals = function getData() {
    $scope.isLoading = true;

    $timeout(function() {
      $scope.rowCollection = [];
      //service to get LoansPendingApprovals from server
      ClientsService.getData(REST_URL.LOANS_PENDING_APPROVALS).then(allLoansPendingApprovalsSuccess, allLoansPendingApprovalsFail);
    }, 2000);
  };

  $scope.openActionDialog = function(loan) {
    var dialog = dialogs.create('/views/Client/grids/loans.dialog.action.html', 'LoansActionDialogCtrl', {loan: loan}, {size: 'md', keyboard: true, backdrop: true});
    dialog.result.then(function(result) {
      if (result) {
        loadLoansPendingApprovals();
      }
    });
  };

  loadLoansPendingApprovals();
});

clientsCtrl.controller('LoansActionDialogCtrl', function($scope, $modalInstance, REST_URL, ClientsService, CreateClientsService, dialogs, data) {
  console.log('LoansActionDialogCtrl', $scope);
  $scope.baseLoan = data.loan;
  $scope.info = {};
  $scope.data = {};
  ClientsService.getData(REST_URL.LOANS_CREATE + '/' + $scope.baseLoan.loanId + '/charges').then(function(result) {
    if (result.data) {
      $scope.data.charges = result.data;
    }
  }, function() {
    console.log('Cant recieve charges data');
  });
  ClientsService.getData(REST_URL.LOANS_CREATE + '/' + $scope.baseLoan.loanId).then(function(result) {
    if (result.data) {
      $scope.loan = result.data;
    }
  }, function() {
    console.log('Cant recieve loan data');
  });

  $scope.cancel = function() {
    $modalInstance.close(false);
  };
  $scope.reject = function() {
    var dialog = dialogs.create('/views/Client/grids/submitLoanActionDialog.html', 'SubmitLoanActionDialogCtrl', {type: 'reject'}, {size: 'md', keyboard: true, backdrop: true});
    dialog.result.then(function(result) {
      if (result) {
        var currentDate = new Date();
        var json = {
          dateFormat: 'dd/MM/yyyy',
          locale: 'en',
          rejectedOnDate: currentDate.getDate() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear(),
          note: result.note
        };
        CreateClientsService.saveClient(REST_URL.LOANS_CREATE + '/' + $scope.baseLoan.loanId + '?command=reject', json).then(function(result) {
          $scope.type = 'alert-success';
          $scope.message = 'Loan rejected successfuly';
          $scope.errors = result.data.errors;
          $modalInstance.close(true);
        }, function(result) {
          $scope.type = 'error';
          $scope.message = 'Loan not rejected: ' + result.data.defaultUserMessage;
          $scope.errors = result.data.errors;
        });
      }
    });
  };
  $scope.approve = function() {
    var dialog = dialogs.create('/views/Client/grids/submitLoanActionDialog.html', 'SubmitLoanActionDialogCtrl', {type: 'approve'}, {size: 'md', keyboard: true, backdrop: true});
    dialog.result.then(function(result) {
      if (result) {
        var currentDate = new Date();
        var json = {
          dateFormat: 'dd/MM/yyyy',
          locale: 'en',
          approvedOnDate: currentDate.getDate() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear(),
          note: result.note
        };
        CreateClientsService.saveClient(REST_URL.LOANS_CREATE + '/' + $scope.baseLoan.loanId + '?command=approve', json).then(function(result) {
          $scope.type = 'alert-success';
          $scope.message = 'Loan approved successfuly';
          $scope.errors = result.data.errors;
          $modalInstance.close(true);
        }, function(result) {
          $scope.type = 'error';
          $scope.message = 'Loan not approved: ' + result.data.defaultUserMessage;
          $scope.errors = result.data.errors;
        });
      }
    });
  };

});

clientsCtrl.controller('SubmitLoanActionDialogCtrl', function($scope, $modalInstance, data) {
  $scope.type = data.type;
  if ($scope.type === 'approve') {
    $scope.title = 'Approve Loan';
    $scope.messageLabel = 'Note';
  } else {
    $scope.title = 'RejectLoan';
    $scope.messageLabel = 'Reason';
  }

  $scope.ok = function() {
    $modalInstance.close({note: $scope.note});
  };
  $scope.cancel = function() {
    $modalInstance.close(false);
  };
});


clientsCtrl.controller('LoansAwaitingDisbursementCtrl', function($scope, $timeout, ClientsService, REST_URL) {
  console.log('LoansAwaitingDisbursementCtrl : LoansAwaitingDisbursement');
  //To load the LoansAwaitingDisbursement page

  $scope.isLoading = false;
  $scope.rowCollection = [];
  $scope.displayed = [];
  //Success callback
  var allLoansAwaitingDisbursementSuccess = function(result) {
    $scope.isLoading = false;
    try {
      $scope.rowCollection = result.data;
    } catch (e) {
    }
  };

  //failur callback
  var allLoansAwaitingDisbursemensFail = function() {
    $scope.isLoading = false;
    console.log('Error : Return from allLoansAwaitingDisbursemensFail service.');
  };

  var loadLoansPendingApprovals = function getData() {
    $scope.isLoading = true;

    $timeout(
      function() {
        $scope.rowCollection = [];
        //service to get allLoansAwaitingDisbursemensFail from server
        ClientsService.getData(REST_URL.LOANS_AWAITING_DISBURSEMENT).then(allLoansAwaitingDisbursementSuccess, allLoansAwaitingDisbursemensFail);
      }, 2000
      );
  };

  loadLoansPendingApprovals();
});

clientsCtrl.controller('LoansRejectedCtrl', function($scope, $timeout, ClientsService, REST_URL) {
  console.log('LoansRejectedCtrl : LoansRejected');
  //To load the LoansRejected page

  $scope.isLoading = false;
  $scope.rowCollection = [];
  $scope.displayed = [];
  //Success callback
  var allLoansRejectedSuccess = function(result) {
    $scope.isLoading = false;
    try {
      $scope.rowCollection = result.data;
    } catch (e) {
    }
  };

  //failur callback
  var allLoansRejectedFail = function() {
    $scope.isLoading = false;
    console.log('Error : Return from LoansRejected service.');
  };

  var loadLoansRejected = function getData() {
    $scope.isLoading = true;

    $timeout(
      function() {
        $scope.rowCollection = [];
        //service to get allLoansAwaitingDisbursemensFail from server
        ClientsService.getData(REST_URL.LOANS_REJECTED).then(allLoansRejectedSuccess, allLoansRejectedFail);
      }, 2000
      );
  };

  loadLoansRejected();
});

clientsCtrl.controller('LoansWrittenOffCtrl', function($scope, $timeout, ClientsService, REST_URL) {
  console.log('LoansWrittenOffCtrl : LoansWrittenOff');
  //To load the LoansWrittenOff page

  $scope.isLoading = false;
  $scope.rowCollection = [];
  $scope.displayed = [];
  //Success callback
  var allLoansWrittenOffSuccess = function(result) {
    $scope.isLoading = false;
    try {
      $scope.rowCollection = result.data;
    } catch (e) {
    }
  };

  //failur callback
  var allLoansWrittenOffFail = function() {
    $scope.isLoading = false;
    console.log('Error : Return from LoansWrittenOff service.');
  };

  var loadLoansWrittenOff = function getData() {
    $scope.isLoading = true;

    $timeout(function() {
      $scope.rowCollection = [];
      //service to get LoansWritten from server
      ClientsService.getData(REST_URL.LOANS_WRITTEN_OFF).then(allLoansWrittenOffSuccess, allLoansWrittenOffFail);
    }, 2000);
  };

  loadLoansWrittenOff();
});