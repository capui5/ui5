sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter"
],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, Filter) {
      "use strict";

      return Controller.extend("empreg.controller.View6", {
          onInit: function () {
              this.oList= this.byId("table0");
              this.oDataModel = this.getOwnerComponent().getModel();

              this.getView().setModel(this.oDataModel);



              // Fetch the data for employees from India

             
          },
          
      });

  });