sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("empreg.controller.View1", {
            onInit: function () {

            },
            onToPage2: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("List");
            },
            onToPage3: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("Integrationlist");
            },
            onToPage4: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("Dataanalyticslist");
            },
            onToPage5:function(){
                var oRouter=this.getOwnerComponent().getRouter();
                oRouter.navTo("AllEmployees")}
            })
        });