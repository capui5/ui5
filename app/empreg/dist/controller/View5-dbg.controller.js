sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox"
],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, MessageBox) {
    "use strict";

    return Controller.extend("empreg.controller.View5", {
      onInit: function () {
        this.oTable = this.byId("table0");
        // var oManifest = this.getOwnerComponent().getManifest();
        //var serviceUrl = oManifest["sap.app"].dataModel.serviceUrl;
      },
      //Nav Back start//
            
		getRouter : function () {
			return UIComponent.getRouterFor(this);
		},

		onNavBack: function () {
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("appHome", {}, true /*no history*/);
			}
		},
        //nav back end//
      //Create start//
      onCreate: function () {
        var that = this;
        var oView = this.getView().getModel("dataModel");
        var sSelectedCountry = this.byId("country").getSelectedItem().getKey();
        var oCountryMapping = {
          "Netherlands": 1,
          "India": 2,
          "Singapore": 3
        };
        var nCountryValue = oCountryMapping[sSelectedCountry];
        var newEmployee = {
          ID: parseInt(this.byId("Id").getValue()),
          fname: this.byId("fname").getValue(),
          lname: this.byId("lname").getValue(),
          desig: this.byId("desig").getValue(),
          email: this.byId("email").getValue(),
          skills: this.byId("skills").getValue(),
          country_ID: nCountryValue,
          State: this.byId("idstate").getValue(),
          city: this.byId("idcity").getValue(),
          doj: this.byId("myDatePicker").getValue(),
          yoe: parseInt(this.byId("yoe").getValue(), 32),
          gender: this.byId("genderRadioGroup").getSelectedButton().getText()
        };

        $.ajax({
          contentType: "application/json",
          type: "POST", url: "../../CatalogService/Employees", dataType: "json", crossDomain: true, data: JSON.stringify(newEmployee), success: function (result) {
            MessageBox.success("Employee data saved successfully!");
            that.clearFormFields();
          }, error: function (response) {
            MessageBox.error("Error while saving employee data");
          }
        });
      },
      clearFormFields: function () {
        const fieldsToClear = [
          "Id", 
          "fname",
          "lname",
          "desig",
          "email",
          "skills",
          "idstate", 
          "idcity",
          "myDatePicker",
          "yoe"
        ];

        const radioGroup = this.byId("genderRadioGroup");

        fieldsToClear.forEach(field => {
          const fieldControl = this.byId(field);
          if (fieldControl) {
            fieldControl.setValue("");
          }
        });

        if (radioGroup) {
          radioGroup.setSelectedButton(null);
        }
      },

      onCancel: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("View2");
      }
    });
  });