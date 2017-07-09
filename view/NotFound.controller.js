sap.ui.controller('view.NotFound', {

	onInit : function () {
		this._router = sap.ui.core.UIComponent.getRouterFor(this);
		this._router.getTargets().getTarget('notFound').attachDisplay(this._handleDisplay, this);
	},

	_msg : '<div class="titlesNotFound">Nie znaleziono dokumentu.</div>',

	_handleDisplay : function (oEvent) {
		var sProductId = oEvent.getParameter('data');
		this.getView().byId('msgHtml').setContent(this._msg);
	},

	handleNavBack : function () {
		this._router._myNavBack();
	}
});