jQuery.sap.declare('util.Util');
jQuery.sap.require('openui5.module.SheetAsModel');

util.Util = {

  parseIndex: function (sPath) {
    return sPath.match(/\d+/)[0];
  },

  updateModel: function(oView) {
    /*var oModel = new sap.ui.model.json.JSONModel();
    oModel.setData(data);
    oView.setModel(oModel);
    sap.ui.getCore().byId('Shell').setBusy(false);*/
    sap.ui.getCore().getEventBus().publish('ontc.DocBrowser', 'modelRefreshed', {});     
  },

  checkLogin: function(){   
        $.ajax({
           type: 'get',
           url: 'http://ac001.nachmurze.pl/token/check_logged_in',
           async: true
        }).done(function(response){
                   if(response['logged'] == 'yes'){
                     sap.ui.getCore().getEventBus().publish('ontc.DocBrowser', 'loggedChecked', {});
                   }
                   if(response['logged'] == 'no'){
                     sap.ui.getCore().getEventBus().publish('ontc.DocBrowser', 'notloggedChecked', {});
                   }
        }).fail(function() {   
                   sap.m.MessageToast.show('Login error');
        });
    },

    logout: function(){
        $.ajax({
           type: 'get',
           url: 'http://ac001.nachmurze.pl/users/sign_out',
           async: true
        }).done(function(){       
                   var userModel = sap.ui.getCore().getModel('user');
                   var data = userModel.getData();
                   data['userData'] = {};
                   userModel.setData(data);
                   sap.ui.getCore().setModel(userModel, 'user');
                   sap.ui.getCore().getEventBus().publish('ontc.DocBrowser', 'loggedoutChecked', {});
        }).fail(function() {
                   sap.m.MessageToast.show('Logout error');
        });
    },

    login: function(login,pass){
        $.ajax({
           type: 'post',
           url: 'http://ac001.nachmurze.pl/users/sign_in',
           dataType: 'json',
           async: true,
           data: {'user[login]':login, 'user[password]':pass, 'remember_me':0}
        }).done(function(response){
                   var userModel = sap.ui.getCore().getModel('user');
                   var data = userModel.getData();
                   data['userData'] = response;
                   userModel.setData(data);
                   sap.ui.getCore().setModel(userModel, 'user');
                   sap.ui.getCore().getEventBus().publish('ontc.DocBrowser', 'loggedinChecked', {});
        }).fail(function(response) { 
                   sap.m.MessageToast.show('Błędne dane logowania');
        });
    }
};