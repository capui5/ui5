sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, History, UIComponent, Filter, FilterOperator, MessageBox, Fragment) {
        "use strict";

        return Controller.extend("empreg.controller.View2", {

            onInit: function () {
                this.oTable = this.byId("table0");
                this.oDataModel = this.getOwnerComponent().getModel();
                this.getView().setModel(this.oDataModel);
                // Fetch the data for employees from Netherlands

                this.showEmployeesFromNetherlands();


            },
            showEmployeesFromNetherlands: function () {

                var oFilter = new Filter("country_ID", sap.ui.model.FilterOperator.EQ, "1");



                this.oTable.bindItems({

                    path: "/Employees",

                    filters: [oFilter],

                    template: new sap.m.ColumnListItem({

                        cells: [

                            new sap.m.Text({ text: "{ID}" }),

                            new sap.m.Text({ text: "{fname}" }),

                            new sap.m.Text({ text: "{lname}" }),

                            new sap.m.Text({ text: "{desig}" }),

                            new sap.m.Text({ text: "{email}" }),

                            new sap.m.Text({ text: "{skills}" }),

                            new sap.m.Text({ text: "{country/name}" }),

                            new sap.m.Text({ text: "{State}" }),

                            new sap.m.Text({ text: "{city}" }),

                            new sap.m.Text({ text: "{doj}" }),

                            new sap.m.Text({ text: "{yoe} year" }),

                            new sap.m.Text({ text: "{gender}" }),

                        ],

                    }),

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
            //Country Filter start//

            //Country Filter end//
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
            // //Edit Mode start//
            // onEditMode: function () {
            //     this.byId("editModeButton").setVisible(false);
            //     this.byId("saveButton").setVisible(true);
            //     this.byId("deleteButton").setVisible(true);
            //     // this.rebindTable(this.oEditableTemplate, "Edit");
            // },
            // //Edit Mode End//
            //Delete mode start//
            onDelete: function () {
                var oTable = this.getView().byId("table0");
                var oSelected = oTable.getSelectedItems()[0];

                if (!oSelected) {
                    sap.m.MessageBox.error("Please select an employee to delete.");
                    return;
                }

                var oEmployee = oSelected.getBindingContext().getObject();
                var sEmployeeId = oEmployee.ID;

                var that = this;

                MessageBox.confirm("Are you sure you want to delete " + oEmployee.fname + " " + oEmployee.lname + " record?", {
                    title: "Confirm",
                    onClose: function (oAction) {
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

            onDeleteSpecificRecord: function (oTable, oEmployee) {
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
                        var oModel = oTable.getModel("dataModel");
                        var aData = oModel.getProperty("/Employees");

                        for (var i = 0; i < aData.length; i++) {
                            if (aData[i].ID === sEmployeeId) {
                                aData.splice(i, 1);
                                oModel.setProperty("/Employees", aData);
                                oTable.getModel().refresh(true);

                                break;
                            }
                        }
                    },
                    error: function () {
                        MessageBox.error("Error deleting employee.");
                    }
                });
            },
            //Delete Mode end //
            //Edit Mode start//
            onEdit: function () {
                var oTable = this.byId("table0");
                var oSelected = oTable.getSelectedItems()[0];
                if (!oSelected) {
                    sap.m.MessageBox.error("Please select an employee to Update.");
                    return;
                }
                var oEmployee = oSelected.getBindingContext().getObject();
                var oFragmentController = this;
                if (!this.pDialog) {
                    Fragment.load({
                        id: this.getView().getId(),
                        name: "empreg.view.Edit",
                        controller: this,
                    })
                        .then(function (oDialog) {
                            oFragmentController.pDialog = oDialog;
                            oFragmentController.setEmployeeData(oEmployee);
                            oDialog.open();
                        })
                        .catch(function (error) {
                            MessageBox.error("Error loading fragment: " + error);
                        });
                } else {
                    oFragmentController.setEmployeeData(oEmployee); // Set employee data in the existing fragment
                    this.pDialog.open();
                }
            },
            setEmployeeData: function (oEmployee) {
                var oView = this.getView();
                var oEmployeeIdInput = oView.byId("Id");
                oEmployeeIdInput.setValue(oEmployee.ID);
                oEmployeeIdInput.setEditable(false);
                oView.byId("fname").setValue(oEmployee.fname);
                oView.byId("lname").setValue(oEmployee.lname);
                oView.byId("desig").setValue(oEmployee.desig);
                oView.byId("email").setValue(oEmployee.email);
                oView.byId("skills").setValue(oEmployee.skills);
                var oCountrySelect = oView.byId("country");
                var sSelectedCountryKey = oEmployee.country_ID;
                oCountrySelect.setSelectedKey(sSelectedCountryKey);
                oView.byId("idstate").setValue(oEmployee.State);
                oView.byId("idcity").setValue(oEmployee.city);
                oView.byId("myDatePicker").setValue(oEmployee.doj);
                oView.byId("yoe").setValue(oEmployee.yoe);
                var oGenderRadioGroup = oView.byId("genderRadioGroup");
                var sSelectedGender = oEmployee.gender.toLowerCase();
                if (sSelectedGender === "male") {
                    oGenderRadioGroup.setSelectedIndex(0);
                } else if (sSelectedGender === "female") {
                    oGenderRadioGroup.setSelectedIndex(1);
                }
            },
            onUpdate: function () {
                var that = this;
                var oView = this.getView();
                var sSelectedCountry = oView.byId("country").getSelectedItem().getKey();
                var oCountryMapping = {
                    "Netherlands": 1,
                    "India": 2,
                    "Singapore": 3
                };
                var nCountryValue = oCountryMapping[sSelectedCountry];
                var updatedEmployee = {
                    ID: parseInt(oView.byId("Id").getValue()),
                    fname: oView.byId("fname").getValue(),
                    lname: oView.byId("lname").getValue(),
                    desig: oView.byId("desig").getValue(),
                    email: oView.byId("email").getValue(),
                    skills: oView.byId("skills").getValue(),
                    country_ID: nCountryValue,
                    State: oView.byId("idstate").getValue(),
                    city: oView.byId("idcity").getValue(),
                    doj: oView.byId("myDatePicker").getValue(),
                    yoe: parseInt(oView.byId("yoe").getValue()),
                    gender: oView.byId("genderRadioGroup").getSelectedButton().getText()
                };
                $.ajax({
                    contentType: "application/json",
                    type: "PATCH",
                    url: "../../CatalogService/Employees(" + updatedEmployee.ID + ")",
                    dataType: "json",
                    crossDomain: true,
                    data: JSON.stringify(updatedEmployee),
                    success: function (result) {
                        that.pDialog.close();
                        MessageBox.success("Employee data updated successfully!", {
                            onClose: function () {
                                window.location.reload();
                            }
                        });
                    },
                    error: function (response) {
                        MessageBox.error("Error while updating employee data");
                    }

                });
            },
            onCancel: function (oEvent) {
                this.byId("openDialog").close();
            }
            // },
            //Edit Mode End//
        });
    })









