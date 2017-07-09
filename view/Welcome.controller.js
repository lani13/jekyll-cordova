sap.ui.controller('view.Welcome', {
	onInit : function () {          
        var view = this.getView();      
        var header = view.byId('headerUser');
        var text1 = view.byId('text1');
        var text2 = view.byId('text2');
        var text3 = view.byId('text3');

        sap.ui.getCore().getEventBus().subscribe('ontc.DocBrowser',
                                                 'loggedinChecked',
                                                 function(){
                                                   var userModel = sap.ui.getCore().getModel('user');
                                                   var data = userModel.getData();

                                                   header.setText(data['userData']['username']);
                                                   text1.setText(data['userData']['name']);
                                                   text2.setText(data['userData']['surname']);
                                                   text3.setText(data['userData']['email']);
                                                 }
        );
     
        sap.ui.getCore().getEventBus().subscribe('ontc.DocBrowser',
                                                 'loggedoutChecked',
                                                 function(){
                                                   header.setText('');
                                                   text1.setText('');
                                                   text2.setText('');
                                                   text3.setText('');
                                                 }
        );
	}
});