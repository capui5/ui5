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
                oRouter.navTo("View2");
            },
            onToPage3: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("View3");
            },
            onToPage4: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("View4");
            }
        });
    });