sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
    "use strict";
   
    return Controller.extend("empreg.controller.List", {
        onInit: function () {
            this.oList = this.byId("employeelist");
           this.oDataModel = this.getOwnerComponent().getModel();
            this.getView().setModel(this.oDataModel);

         

        },
        // yourFormatter: function(sInfo) {
        //     return sInfo === "yes" ? "greenInfo" : "redInfo";
        // },
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
                this.getRouter().navTo("View1", {}, true);
            }
        },
        //nav back end//
        //search start//
        onAdvancedSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            var oList = this.getView().byId("employeelist");
            var oBinding = oList.getBinding("items");
            if (oBinding) {
                var aFilters = [];
                var sNormalizedQuery = sQuery.toLowerCase();
                var aSearchData = [
                    { term: ["cap"], matches: ["cloud", "cloud development", "cloud application programming", "cloud application programming model", "capm"] },
                    { term: ["javascript"], matches: ["react","node.js"] },
                    { term: ["azure"], matches: ["devops", "aws","azure"] },
                    { term: ["frontend developer"], matches: ["html","css","Angular","Fullstack","react.js","vue.js","javascript","wordpress","Fiori"] },
                    { term: ["backend developer"], matches: ["ABAP","node js","java","Fullstack","python","c","capm","cap","cloud", "cloud development", "cloud application programming", "cloud application programming model","sql","hana database","php"] },
                    { term: ["data science"], matches: ["Phyton","Data engineer"] },
                    { term: ["solution Architect"], matches: ["agile","cloud computing"] },

                    // Add more terms as needed
                ];
                aSearchData.forEach(function (searchItem) {
                    if (searchItem.term.includes(sNormalizedQuery)) {
                        searchItem.matches.forEach(function (match) {
                            var oFilter = new sap.ui.model.Filter({
                                path: "skills",
                                operator: sap.ui.model.FilterOperator.Contains,
                                value1: match,
                                caseSensitive: false,
                            });
                            aFilters.push(oFilter);
                        });
                    }
                });
                if (aFilters.length === 0) { // Only apply the regular search if no specific term match is found
                    var oRegularFilter = new sap.ui.model.Filter({
                        path: "skills",
                        operator: sap.ui.model.FilterOperator.Contains,
                        value1: sQuery,
                        caseSensitive: false,
                    });
                    aFilters.push(oRegularFilter);
                }
                var oFNameFilter = new sap.ui.model.Filter({
                    path: "fname",
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: sQuery,
                    caseSensitive: false,
                });
                var oLNameFilter = new sap.ui.model.Filter({
                    path: "lname",
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: sQuery,
                    caseSensitive: false,
                });
                var oDesigFilter = new sap.ui.model.Filter({
                    path: "desig",
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: sQuery,
                    caseSensitive: false,
                });
                var oEmailFilter = new sap.ui.model.Filter({
                    path: "email",
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: sQuery,
                    caseSensitive: false,
                });
                var oCountryFilter = new sap.ui.model.Filter({
                    path: "country/name",
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: sQuery,
                    caseSensitive: false,
                });
                aFilters.push(oFNameFilter, oLNameFilter, oDesigFilter, oEmailFilter,oCountryFilter);
                var combinedFilter = new sap.ui.model.Filter({
                    filters: aFilters,
                    and: false // All filters must match for the condition to be met
                });
                oBinding.filter(combinedFilter);
            }
        },
        //search end//
        //Add new employee start//
        onaddnewemployee: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("View5");
        },
        //Add new employee end//
        //Delete start//
        onDeleteSpecificRecord: function (oList, oEmployee) {
            var sEmployeeId = oEmployee.ID;
            var that = this;
            $.ajax({
                url: "../../CatalogService/Employees/" + sEmployeeId,
                method: "DELETE",
                success: function () {
                    MessageBox.success("Employee deleted successfully.", {
                        onClose: function () {
                            window.location.reload();
                        }
                    });
                    // Remove the selected item from the model's data
                    var oModel = oList.getModel("dataModel");
                    var aData = oModel.getProperty("/Employees");

                    for (var i = 0; i < aData.length; i++) {
                        if (aData[i].ID === sEmployeeId) {
                            aData.splice(i, 1);
                            oModel.setProperty("/Employees", aData);
                            oList.getModel().refresh(true);

                            break;
                        }
                    }
                },
                error: function () {
                    MessageBox.error("Error deleting employee.");
                }
            });
        },
        // Delete Mode end //
                //Binding data//
        onListItemPress: function (oEvent) {
            var oItem = oEvent.getParameter("listItem");
            var oCtx = oItem.getBindingContext("MainModel");
            if (oCtx) {
                var sEmployeeId = oCtx.getProperty("ID");
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("View6", {
                    SEmployeeId: sEmployeeId,
                });
            }
            else {
                console.error("Binding context is not available.");
            }
        }
    });
});