sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
  ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,UIComponent) {
        "use strict";
  
        return Controller.extend("empreg.controller.View7", {
            onInit: function () {
                
                var oRouter = this.getRouter();
                oRouter.getRoute("View7").attachMatched(this._onRouteMatched, this);
            },
            getRouter: function () {
                return UIComponent.getRouterFor(this);
            },

            _onRouteMatched : function (oEvent) {
                var oArgs, oView;
                oArgs = oEvent.getParameter("arguments");
                oView = this.getView();
    
                oView.bindElement({
                    path : "/Employees(" + oArgs.employeeID + ")",
                    events : {
                        change: this._onBindingChange.bind(this),
                        dataRequested: function (oEvent) {
                            oView.setBusy(true);
                        },
                        dataReceived: function (oEvent) {
                            oView.setBusy(false);
                        }
                    }
                });
            },
            _onBindingChange : function (oEvent) {
                // No data for the binding
                if (!this.getView().getBindingContext()) {
                    this.getRouter().getTargets().display("notFound");
                }
            }
        });
    });