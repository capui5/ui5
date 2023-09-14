sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/library',
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/core/routing/History"

], function (Controller, mobileLibrary, MessageBox, Fragment,History) {
    "use strict";
    var URLHelper = mobileLibrary.URLHelper;


    return Controller.extend("empreg.controller.View6", {

        onInit: function () {
            this.oList = this.byId("employeelist");
            this.oDataModel = this.getOwnerComponent().getModel();
            this.getView().setModel(this.oDataModel);
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("View6").attachPatternMatched(this._onRouteMatched, this);


        },
        onback: function(){
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("AllEmployees");
        },
        onNavBack: function () {

            var oHistory, sPreviousHash;
            oHistory = History.getInstance();
            sPreviousHash = oHistory.getPreviousHash();
            if (sPreviousHash !== undefined) {
              window.history.go(-1);
            } else {
              this.getRouter().navTo("List", {}, true /*no history*/);
            }
    
          },

        _onRouteMatched: function (oEvent) {
            var oParameters = oEvent.getParameters();
            var sEmployeeId = oParameters.arguments.SEmployeeId;
            var oView = this.getView();
            oView.bindElement({
                path: "/Employees/" + sEmployeeId,
                model: "MainModel"
                
            });
        },
        //Email handler start//
        handleEmailPress: function (evt) {
            var recipientEmail = "recipient@example.com";
            var subject = "Info Request";
            var body = "Hello, I would like to request some information.";

            var mailtoLink = "mailto:" + recipientEmail + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
            window.location.href = mailtoLink;
        },
        //Email handler end //   
        //Delete Start//
        onDelete: function () {
            var oView = this.getView();
            var oEmployeePanel = oView.byId("employeePanel");
            var oList = oView.byId("employeelist");

            if (oEmployeePanel) {
                var oBindingContext = oEmployeePanel.getBindingContext("MainModel");
                sap.m.MessageBox.confirm("Are you sure you want to delete this employee?", {
                    title: "Confirm Deletion",
                    onClose: function (oAction) {
                        if (oAction === sap.m.MessageBox.Action.OK) {
                            oBindingContext.delete("$direct").then(function () {
                                sap.m.MessageBox.success("Employee deleted successfully.", {
                                    onClose: function () {
                                        // Navigate back to the previous page
                                        window.location.href = "/empreg/webapp/index.html#/Employee-List";
                                        //window.history.back();

                                        // Reload the page after a slight delay
                                        setTimeout(function () {
                                            window.location.reload();
                                        }, 10); // Adjust the delay as needed
                                    }
                                });

                            }).catch(function (error) {
                                sap.m.MessageBox.error("Error deleting employee.");
                            });
                        }
                    }
                });
            }
        },
        // //Delete End//
        formatPhoto: function (employeeId) {
            if (employeeId) {
                // Assuming images are stored in the 'webapp/images/' directory
                var imagePath = jQuery.sap.getModulePath("empreg", "/images/") + employeeId + ".jpg";
                return imagePath;
            } else {
                // Return a placeholder image URL if no employee ID available
                return jQuery.sap.getModulePath("empreg", "/images/default_image.jpg");
            }
        },

        onEdit: function () {
            
            var oView = this.getView();
            if (!this.byId("editDialog")) {
                Fragment.load({
                    id: oView.getId(),
                    name: "empreg.view.Edit",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    var oModel = oView.getModel("MainModel");
                    var sEmployeePath = "/Employees";
                    var oBindingContext = oModel.createBindingContext(sEmployeePath);
                    var oDialogContent = oDialog.getContent();
                    var oEditForm = oDialogContent[0];
                    oEditForm.setBindingContext(oBindingContext);
                    oDialog.open();
                });
            } else {
                this.byId("editDialog").open();
            }
        },

        setEmployeeData: function (oEmployee) {
            var oView = this.getView();

            // Set values for  fields based on oEmployee properties
            oView.byId("Id").setValue(oEmployee.ID).setEditable(false);
            oView.byId("fname").setValue(oEmployee.fname);
            oView.byId("lname").setValue(oEmployee.lname);
            oView.byId("desig").setValue(oEmployee.desig);
            oView.byId("email").setValue(oEmployee.email);
            oView.byId("skills").setValue(oEmployee.skills);
            oView.byId("country").setSelectedKey(oEmployee.country_ID);
            oView.byId("idstate").setValue(oEmployee.State);
            oView.byId("idcity").setValue(oEmployee.city);
            oView.byId("myDatePicker").setValue(oEmployee.doj);
            oView.byId("yoe").setValue(oEmployee.yoe);
            oView.byId("reportingPerson").setValue(oEmployee.reportingPerson);
            oView.byId("Phno").setValue(oEmployee.Phno)

            // Set gender based on oEmployee.gender
            var oGenderRadioGroup = oView.byId("genderRadioGroup");
            var sSelectedGender = oEmployee.gender.toLowerCase();
            if (sSelectedGender === "male") {
                oGenderRadioGroup.setSelectedIndex(0);
            } else if (sSelectedGender === "female") {
                oGenderRadioGroup.setSelectedIndex(1);
            }
            // Set the "leave" field and convert it to a string
            var oLeaveSelect = oView.byId("leave");
            oLeaveSelect.setSelectedKey(oEmployee.leave);
        },


        onUpdate: function () {
            const oView = this.getView();
            const sSelectedCountry = oView.byId("country").getSelectedItem().getKey();
            const oCountryMapping = {
                "Netherlands": 1,
                "India": 2,
                "Singapore": 3
            };
            const nCountryValue = oCountryMapping[sSelectedCountry];
            const leave = oView.byId("leave").getSelectedKey() === "true";

            // Parse the ID and validate it
            const sEmployeeId = oView.byId("Id").getValue();
            if (!/^\d+$/.test(sEmployeeId)) {
                this.showErrorMessage("Invalid Employee ID. Please enter a valid number.");
                return;
            }

            // Format the date in YYYY-MM-DD format
            const sDoj = formatDate(oView.byId("myDatePicker").getDateValue());

            // Parse the Years of Experience as an integer
            const nYoe = parseInt(oView.byId("yoe").getValue());

            const updatedEmployee = {
                ID: parseInt(sEmployeeId),
                fname: oView.byId("fname").getValue(),
                lname: oView.byId("lname").getValue(),
                desig: oView.byId("desig").getValue(),
                email: oView.byId("email").getValue(),
                skills: oView.byId("skills").getValue(),
                country_ID: nCountryValue,
                State: oView.byId("idstate").getValue(),
                city: oView.byId("idcity").getValue(),
                doj: sDoj,
                yoe: nYoe,
                reportingPerson: oView.byId("reportingPerson").getValue(),
                gender: oView.byId("genderRadioGroup").getSelectedButton().getText(),
                leave: leave,
            };

            fetch(`./CatalogService/Employees(${updatedEmployee.ID})`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEmployee),
            })
                .then(response => {
                    if (response.ok) {
                        this.showSuccessMessage("Employee data updated successfully!");
                        window.location.reload();
                    } else {
                        throw new Error('Error updating employee data');
                    }
                })
                .catch(error => {
                    this.showErrorMessage(error.message);
                });

            // Helper function to format date as YYYY-MM-DD
            function formatDate(date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }
        },

        showSuccessMessage: function (message) {
            const oView = this.getView();
            const dialog = new sap.m.Dialog({
                title: "Success",
                type: "Message",
                state: "Success",
                content: new sap.m.Text({
                    text: message,
                }),
                beginButton: new sap.m.Button({
                    text: "OK",
                    press: function () {
                        dialog.close();
                    },
                }),
                afterClose: function () {
                    dialog.destroy();
                },
            });

            dialog.open();
        },

        showErrorMessage: function (message) {
            const oView = this.getView();
            const dialog = new sap.m.Dialog({
                title: "Error",
                type: "Message",
                state: "Error",
                content: new sap.m.Text({
                    text: message,
                }),
                beginButton: new sap.m.Button({
                    text: "OK",
                    press: function () {
                        dialog.close();
                    },
                }),
                afterClose: function () {
                    dialog.destroy();
                },
            });

            dialog.open();
        },



        onCancel: function (oEvent) {
            this.byId("openDialog").close();
        },

    });
});