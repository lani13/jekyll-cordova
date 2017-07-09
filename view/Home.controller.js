jQuery.sap.require('sap.m.MessageToast');
jQuery.sap.require('util.Util');
jQuery.sap.require('elasticsearch.CategoryAggregations');
jQuery.sap.require('elasticsearch.Search');

sap.ui.controller('view.Home', {

	onInit : function () {
		this._router = sap.ui.core.UIComponent.getRouterFor(this);

        var that = this;
        //util.Util.checkLogin();

        sap.ui.getCore().getEventBus().subscribe('ontc.DocBrowser',
												 'documentsLoaded',
                                                 function(channel, event, data){
                                                   that.setModelDocuments(data);
                                                 }
        );

        sap.ui.getCore().getEventBus().subscribe('ontc.DocBrowser',
												 'loggedChecked',
                                                 function(){
                                                 }
        ); 

        sap.ui.getCore().getEventBus().subscribe('ontc.DocBrowser',
												 'notloggedChecked',
                                                 function(){
                                                   that._router.navTo('init', {}, !sap.ui.Device.system.phone);
                                                 }
        );
	},

	handleSearch : function (oEvent) {
		this._search();
	},

	handleRefresh : function (oEvent) {	
        sap.m.MessageToast.show('Products refreshed');
        this.getView().byId('pullToRefresh').hide();
	},

	_search : function () {
		var oView = this.getView();

		var oCategoryList = oView.byId('categoryList');
		var oSearchField = oView.byId('searchField');

		var bShowSearch = oSearchField.getValue().length !== 0;

		if (bShowSearch) {
			this._changeNoDataTextToIndicateLoading(oCategoryList);
			elasticsearch.Search.search(oSearchField.getValue())
		}

        /*var oBinding = oCategoryList.getBinding('items');
		if (oBinding) {
			if (bShowSearch) {
				var oFilter = new sap.ui.model.Filter('name', sap.ui.model.FilterOperator.Contains, oSearchField.getValue());
				oBinding.filter([oFilter]);
			} else {
				oBinding.filter([]);
			}
		}*/
	},

	_changeNoDataTextToIndicateLoading: function (oList) {
		var sOldNoDataText = oList.getNoDataText();
		oList.setNoDataText('Szukam...');
		oList.attachEventOnce('updateFinished', function() {oList.setNoDataText(sOldNoDataText);});
	},

	handleCategoryListItemPress : function (oEvent) {
		sap.m.MessageToast.show('ItemPress');

		var oBindContext = oEvent.getSource().getBindingContext();
		var oModel = oBindContext.getModel();

		var iCategoryIdx = util.Util.parseIndex(oBindContext.getPath());
		var document = oModel.getData().documents[iCategoryIdx]['_source'];

		this._router.navTo('documentDetails', {slug: document.slug, doc: document}, !sap.ui.Device.system.phone);
	},

	handleCategoryListSelect: function (oEvent) {
        sap.m.MessageToast.show('Select');
        var oItem = oEvent.getParameter('listItem');
		oBindContext = oItem.getBindingContext();
		
		var oModel = oBindContext.getModel();
		var iCategoryIdx = util.Util.parseIndex(oBindContext.getPath());
		var document = oModel.getData().documents[iCategoryIdx]['_source'];
		this._router.navTo('documentDetails', {slug: document.slug}, !sap.ui.Device.system.phone);
    },

	setModelDocuments: function(data){
	  var oModel = new sap.ui.model.json.JSONModel();
      oModel.setData(data);
      this.getView().setModel(oModel);
    },

    logoutButtonPress: function(event){
        var that = this;
        //util.Util.logout();
        that._router.navTo('init', {}, !sap.ui.Device.system.phone);

        sap.ui.getCore().getEventBus().subscribe('ontc.DocBrowser',
												 'loggedoutChecked',
                                    			 function(){
                                            	   that._router.navTo('init', {}, !sap.ui.Device.system.phone);   
            	                      			 }
        );
    }
});