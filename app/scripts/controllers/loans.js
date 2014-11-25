'use strict';
 
  // Here we attach this controller to our testApp module
var LoanProductCrtl = angular.module('loanProductController',['loanProductService','Constants', 'smart-table']);

LoanProductCrtl.controller('LoanProductsCtrl', function ($scope, $rootScope, $location, $timeout, LoanProductService, REST_URL, APPLICATION) {
      console.log('LoanProductsCtrl : LoanProducts');
      //To load the loadproducts page      
      $scope.isLoading = false;
      $scope.rowCollection = [];
      $scope.displayed=[];

      //Success callback
      var loanProductsSuccess = function(result) {
         $scope.isLoading = false;
         try {
              $scope.rowCollection = result.data;
          } catch (e) {
          }
      }

      //failur callback
      var loanProductsFail = function(result){
          $scope.isLoading = false;
          console.log('Error : Return from loanProducts service.');
      }

      var loadLoanProducts = function getData(tableState) {
        $scope.isLoading = true;

        $timeout(
          function() {
              $scope.rowCollection = [];
              //service to get clients from server              
              LoanProductService.getData(REST_URL.LOANS_PRODUCTS_LIST).then(loanProductsSuccess, loanProductsFail);              
          }, 2000
        );
      };

      loadLoanProducts();
});

LoanProductCrtl.controller('CreateLoanProductsCtrl', function ($scope, $rootScope, $location, $timeout, LoanProductService, REST_URL, APPLICATION, PAGE_URL) {
      console.log('LoanProductsCtrl : CreateLoanProducts');
      //To load the loadproducts page
      $scope.isLoading = false;
      $scope.loanProductDetails = {};
      $rootScope.message="";
      //Success callback
      var loanProductTeplateSuccess = function(result) {
         $scope.isLoading = false;
         try {
              $scope.product = result.data;
              $scope.loanProductDetails.digitsAfterDecimal = '2';
              $scope.loanProductDetails.currencyCode = $scope.product.currencyOptions[0].code;
              $scope.loanProductDetails.repaymentFrequencyType = $scope.product.repaymentFrequencyType.id;
              $scope.loanProductDetails.interestRateFrequencyType = $scope.product.interestRateFrequencyType.id;
              $scope.loanProductDetails.amortizationType = $scope.product.amortizationType.id;
              $scope.loanProductDetails.interestType = $scope.product.interestType.id;
              $scope.loanProductDetails.transactionProcessingStrategyId = $scope.product.transactionProcessingStrategyOptions[0].id;

              $scope.loanProductDetails.includeInBorrowerCycle="true";
              $scope.loanProductDetails.transactionProcessingStrategyId=5;
              $scope.loanProductDetails.interestType = 1;
              $scope.loanProductDetails.interestRateFrequencyType=3;
              //Set as default now
              $scope.loanProductDetails.inMultiplesOf = '0';
              $scope.loanProductDetails.repaymentEvery = "1";
              $scope.loanProductDetails.interestCalculationPeriodType = 1;
              $scope.loanProductDetails.accountingRule = "1";
              $scope.loanProductDetails.isInterestRecalculationEnabled = "false";
              $scope.loanProductDetails.daysInYearType=1; 
              $scope.loanProductDetails.daysInMonthType=1;
              $scope.loanProductDetails.locale="en";
          } catch (e) {
          }
      }

      //failur callback
      var loanProductTemplateFail = function(result){
          $scope.isLoading = false;
          console.log('Error : Return from loanProducts service.');
      }

      var loadLoanProductTemplate = function getData(tableState) {
        $scope.isLoading = true;
        $timeout(
          function() {
              $scope.rowCollection = [];              
              LoanProductService.getData(REST_URL.LOAN_PRODUCTS_TEMPLATE).then(loanProductTeplateSuccess, loanProductTemplateFail);
          }, 500
        );
      };

      loadLoanProductTemplate();
      
      $scope.validateLoanProduct = function(loanProductDetails){
        console.log('LoanProductsCtrl : CreateLoanProducts : authenticateLoanProduct');
            if ($scope.createloanproductform.$valid) {
              $scope.saveLoanProduct(loanProductDetails);
              
            } else {
              $scope.invalidateForm();
            }
        
      };

      //invalidate login form
      $scope.invalidateForm = function(){
       $scope.createloanproductform.invalidate = false;
      };

      $scope.saveLoanProduct = function(loanProductDetails){
        console.log('LoanProductsCtrl : CreateLoanProducts : saveLoanProduct');

        var saveloanProductSuccess = function(result){
          console.log('Success : Return from loanProducts service.');
          $rootScope.type="alert-success";
          $rootScope.message="Loan product saved successfully";
          $location.url(PAGE_URL.LOANPRODUCTS);                  
        }

        var saveloanProductFail = function(result){
          console.log('Error : Return from loanProducts service.');                    
          $scope.type="error";
          $scope.message="Loan product not saved: "+result.data.defaultUserMessage;
          $scope.errors = result.data.errors;
          for(var i=0;i<result.data.errors.length;i++){
            $('#'+$scope.errors[i].parameterName).removeClass('ng-valid').removeClass('ng-valid-required').addClass('ng-invalid').addClass('ng-invalid-required');
          }
        }
        console.log("JSON.toJson(loanProductDetails) > " + angular.toJson(this.loanProductDetails));
        LoanProductService.saveProduct(REST_URL.LOANS_PRODUCTS_LIST, angular.toJson(this.loanProductDetails)).then(saveloanProductSuccess, saveloanProductFail);
      };
});


LoanProductCrtl.controller('EditLoanProductsCtrl', function ($route, $scope, $rootScope, $location, $timeout, LoanProductService, REST_URL, APPLICATION, PAGE_URL) {
      console.log('LoanProductsCtrl : EditLoanProductsCtrl');
      //To load the loadproducts page
      $scope.isLoading = false;
      $scope.loanProductDetails = {};
      $rootScope.message="";
      //Success callback
      var editLoanProductTeplateSuccess = function(result,loanProductDetails) {
         $scope.isLoading = false;
         try {
              $scope.product = result.data;              
              $scope.loanProductDetails.digitsAfterDecimal = '2';
              $scope.loanProductDetails.currencyCode = $scope.product.currency.code;
              $scope.loanProductDetails.repaymentFrequencyType = $scope.product.repaymentFrequencyType.id;
              $scope.loanProductDetails.interestRateFrequencyType = $scope.product.interestRateFrequencyType.id;
              $scope.loanProductDetails.amortizationType = $scope.product.amortizationType.id;
              $scope.loanProductDetails.interestType = $scope.product.interestType.id;
              $scope.loanProductDetails.transactionProcessingStrategyId = $scope.product.transactionProcessingStrategyOptions[0].id;

              //set the values from the response on the edit page
              $scope.loanProductDetails.name = $scope.product.name;
              $scope.loanProductDetails.shortName = $scope.product.shortName;
              $scope.loanProductDetails.description = $scope.product.description;
              $scope.loanProductDetails.currencyCode = $scope.product.currency.code;
              $scope.loanProductDetails.minPrincipal = $scope.product.minPrincipal;
              $scope.loanProductDetails.principal = $scope.product.principal;
              $scope.loanProductDetails.maxPrincipal = $scope.product.maxPrincipal;
              $scope.loanProductDetails.minNumberOfRepayments = $scope.product.minNumberOfRepayments;
              $scope.loanProductDetails.numberOfRepayments = $scope.product.numberOfRepayments;
              $scope.loanProductDetails.maxNumberOfRepayments = $scope.product.maxNumberOfRepayments;
              $scope.loanProductDetails.minInterestRatePerPeriod = $scope.product.minInterestRatePerPeriod;
              $scope.loanProductDetails.interestRatePerPeriod = $scope.product.interestRatePerPeriod;
              $scope.loanProductDetails.maxInterestRatePerPeriod = $scope.product.maxInterestRatePerPeriod;
              $scope.loanProductDetails.repaymentFrequencyType = $scope.product.repaymentFrequencyType.id;
              $scope.loanProductDetails.amortizationType = $scope.product.amortizationType.id;
              $scope.loanProductDetails.interestRateFrequencyType = $scope.product.interestRateFrequencyType.id;
              $scope.loanProductDetails.transactionProcessingStrategyId = $scope.product.transactionProcessingStrategyId;
              $scope.loanProductDetails.interestType = $scope.product.interestType.id;
              $scope.loanProductDetails.includeInBorrowerCycle = "true";
              console.log('$scope.product.includeInBorrowerCycle'+$scope.product.includeInBorrowerCycle);
              //Set as default now
              $scope.loanProductDetails.inMultiplesOf = '0';
              $scope.loanProductDetails.repaymentEvery = "1";
              $scope.loanProductDetails.interestCalculationPeriodType = 1;
              $scope.loanProductDetails.accountingRule = "1";
              $scope.loanProductDetails.isInterestRecalculationEnabled = "false";
              $scope.loanProductDetails.daysInYearType=1; 
              $scope.loanProductDetails.daysInMonthType=1;
              $scope.loanProductDetails.locale="en";
          } catch (e) {
          }
      }

      //failur callback
      var editLoanProductTemplateFail = function(result){
          $scope.isLoading = false;
          console.log('Error : Return from loanProducts service.');
      }

      var loadEditProductTemplate = function getData() {
        $scope.isLoading = true;
        $timeout(
          function() {
              $scope.rowCollection = []; 
              var $url=REST_URL.LOANS_PRODUCTS_LIST_BY_ID+$route.current.params.id+'?template=true';             
              LoanProductService.getData($url).then(editLoanProductTeplateSuccess, editLoanProductTemplateFail);
          }, 500
        );
      };

     loadEditProductTemplate();
      
     $scope.validateLoanProduct = function(loanProductDetails){
        console.log('LoanProductsCtrl : CreateLoanProducts : authenticateLoanProduct');
            if ($scope.createloanproductform.$valid) {
              $scope.updateLoanProduct(loanProductDetails);
            } else {
              $scope.invalidateForm();
            }
      };

      $scope.invalidateForm = function(){
       $scope.createloanproductform.invalidate = false;
      };

      $scope.updateLoanProduct = function(loanProductDetails){
        console.log('LoanProductsCtrl : updateLoanProduct');

        var updateloanProductSuccess = function(result){
          console.log('Success : Return from loanProducts service.');
          $rootScope.type="alert-success";
          $rootScope.message="Loan product Updated successfully";
          $location.url(PAGE_URL.LOANPRODUCTS);                  
        }

        var updateloanProductFail = function(result){
          console.log('Error : Return from loanProducts service.');                    
          $scope.type="error";
          $scope.message="Loan product not updated: "+result.data.defaultUserMessage;
          $scope.errors = result.data.errors;
          for(var i=0;i<result.data.errors.length;i++){
            $('#'+$scope.errors[i].parameterName).removeClass('ng-valid').removeClass('ng-valid-required').addClass('ng-invalid').addClass('ng-invalid-required');
          }
        }
        var $url=REST_URL.LOANS_PRODUCTS_LIST_BY_ID+$route.current.params.id;
        LoanProductService.updateProduct($url, angular.toJson(this.loanProductDetails)).then(updateloanProductSuccess, updateloanProductFail);
      };
});