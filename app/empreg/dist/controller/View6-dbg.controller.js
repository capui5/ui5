sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/routing/History",
  "sap/ui/core/UIComponent",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageBox",
  "sap/m/StandardListItem",
  'sap/m/MessageToast'
], function (Controller, History, UIComponent, Filter, FilterOperator, MessageBox, StandardListItem,MessageToast) {
    "use strict";

    return Controller.extend("empreg.controller.View6", {

        onInit: function () {
            this.oList = this.byId("list");
            this.oDataModel = this.getOwnerComponent().getModel();
            this.getView().setModel(this.oDataModel);
            this.showEmployeesFromNetherlands();
            var oRouter = this.getOwnerComponent().getRouter();
        },

        showEmployeesFromNetherlands: function () {
            var oFilter = new Filter("country_ID", FilterOperator.EQ, "1");

            this.oList.bindItems({
                path: "/Employees",
                filters: [oFilter],
                template: new StandardListItem({
                    title: "{fname} {lname}",
                    description: "{desig}",
                    icon: "sap-icon://employee",
                    iconDensityAware: false,
                    iconInset: false,
                    press: this.onListItemPressed.bind(this)
                })
            });
        },
        onListItemPressed: function (oEvent) {
            var oItem, oCtx;
			oItem = oEvent.getSource();
			oCtx = oItem.getBindingContext();
			this.getRouter().navTo("View7",{
				employeeId : oCtx.getProperty("ID")
			});
        }, 

        //Nav Back start//
        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        onNavBack: function () {
            var oHistory, sPreviousHash;

            oHistory = History.getInstance();
            sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getRouter().navTo("View1", {}, true /*no history*/);
            }
        },
        //nav back end//
        onaddnewemployee: function () {
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("View5");
      },
      //Search Filter//
      onFilter: function (oEvent) {
          // build filter array
          var aFilter = [];
          var sQuery = oEvent.getParameter("query");
          if (sQuery) {
              aFilter.push(new Filter("ID", FilterOperator.EQ, parseInt(sQuery)));
          }
          // filter binding
          var oList = this.byId("table0");
          var oBinding = oList.getBinding("items");
          oBinding.filter(aFilter);
      },
      //Search Filer end//
      //Edit Mode start//
      onEditMode: function () {
          this.byId("editModeButton").setVisible(false);
          this.byId("saveButton").setVisible(true);
          this.byId("deleteButton").setVisible(true);
          // this.rebindTable(this.oEditableTemplate, "Edit");
      },
   
      onDelete: function() {
          var oTable = this.getView().byId("table0");
          var oSelected = oTable.getSelectedItems()[0];
      
          if (!oSelected) {
              sap.m.MessageBox.error("Please select an employee to delete.");
              return;
          }
      
          var oEmployee = oSelected.getBindingContext().getObject();
          var sEmployeeId = oEmployee.ID;
      
          var that = this;
      
          MessageBox.confirm("Are you sure you want to delete this Employee record?", {
              title: "Confirm",
              onClose: function(oAction) {
                  if (oAction === sap.m.MessageBox.Action.OK) {
                      that.onDeleteSpecificRecord(oTable, oEmployee);
                  }
              },
              actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
              emphasizedAction: sap.m.MessageBox.Action.CANCEL,
              initialFocus: null,
              textDirection: sap.ui.core.TextDirection.Inherit
          });
      },
      
      onDeleteSpecificRecord: function(oTable, oEmployee) {
          var sEmployeeId = oEmployee.ID;
          var that = this; 
      
          $.ajax({
              url: "../../CatalogService/Employees/" + sEmployeeId,
              method: "DELETE",
              success: function() {
                  // Remove the selected item from the model's data
                  var oModel = oTable.getModel("dataModel");
                  var aData = oModel.getProperty("/Employees");
      
                  for (var i = 0; i < aData.length; i++) { // Fix the loop initialization
                      if (aData[i].ID === sEmployeeId) {
                          aData.splice(i, 1);
                          oModel.setProperty("/Employees", aData);
                       // Exit the loop once the item is found and removed
                      }
                      MessageBox.success("Employee deleted successfully.");
                  }
              },
              error: function() {
                  MessageBox.error("Error deleting employee.");
              }
          });
      },            
      //Delete Mode end //
  });
})