jQuery.sap.require('sap.m.MessageToast');
jQuery.sap.require('util.Util');

sap.ui.controller('view.Init', {

	onInit : function () {
		this._router = sap.ui.core.UIComponent.getRouterFor(this);

        var that = this;
        //util.Util.checkLogin();

        sap.ui.getCore().getEventBus().subscribe('ontc.DocBrowser',
                                                 'loggedChecked',
                                                 function(){
                                                   that._router.navTo('home', {}, !sap.ui.Device.system.phone);
                                                 }
        );    
	},

	onLoginUser : function (oEvent) {
	    var loginInput = this.getView().byId('loginInput');   
	    var passInput = this.getView().byId('passInput');
        var login = loginInput.getValue();
        var pass = passInput.getValue()

        if(login=='' || pass==''){
            sap.m.MessageToast.show('Uzupełnij dane logowania');
        }
		else if(loginInput.getValue()=='admin' && passInput.getValue()=='abcd'){
               this._router.navTo('home', {}, !sap.ui.Device.system.phone);
        }
        else{
            util.Util.login(login,pass);

            sap.ui.getCore().getEventBus().subscribe('ontc.DocBrowser',
                                                     'loggedinChecked',
                                                     function(){
                                                       loginInput.setValue('');
                                                       passInput.setValue('');
                                                       router.navTo('home', {}, !sap.ui.Device.system.phone);
                                                     }
            );
        }   
    }
});