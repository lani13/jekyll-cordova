jQuery.sap.require('sap.m.MessageToast');
jQuery.sap.require('util.Util');

sap.ui.controller('view.DocDetails', {

	onInit : function () {
		this._router = sap.ui.core.UIComponent.getRouterFor(this);
		this._router.getRoute('documentDetails').attachPatternMatched(this._routePatternMatched, this);

        var that = this;
        sap.ui.getCore().getEventBus().subscribe('ontc.DocBrowser',
												 'notloggedChecked',
                                            	 function(){
                                                   router.navTo('init', {}, !sap.ui.Device.system.phone);      
                                                 }
        );

        sap.ui.getCore().getEventBus().subscribe('ontc.DocBrowser',
												 'documentFound',
                                            	 function(channel, event, data){
                                                   that.setModelDocument(data.document);
                                                 }
        );

	},

    _routePatternMatched: function(oEvent) {
		var slug = oEvent.getParameter('arguments').slug;
		elasticsearch.Search.search_by_slug(slug)
	},

	onPressBack : function (oEvent) {
		this.getOwnerComponent().myNavBack();
	},

	setModelDocument: function(document){
	  var oView = this.getView();

	  var scroll = oView.byId('scrollContainer');
      scroll.destroyContent();

      var docExcerpt = new sap.ui.core.HTML('htmlContent')
      docExcerpt.setContent(document['_source']['excerpt'])

      var docPanel = new sap.m.Panel('textPanel', { expandable: true, expanded: true, headerText: document['_source']['title']+' (expand)' })
	  var text = new sap.m.Text('textContent', { text: document['_source']['text'] })
	  docPanel.addContent(text)

      scroll.addContent(docExcerpt);
	  scroll.addContent(docPanel);

	  //var busyIndicator = this.getView().byId('busyIndicator');   
	  //busyIndicator.setVisible(true);
	}    
});