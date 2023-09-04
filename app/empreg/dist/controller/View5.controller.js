sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/MessageBox"],function(e,t){"use strict";return e.extend("empreg.controller.View5",{onInit:function(){this.oTable=this.byId("table0")},getRouter:function(){return UIComponent.getRouterFor(this)},onNavBack:function(){var e,t;e=History.getInstance();t=e.getPreviousHash();if(t!==undefined){window.history.go(-1)}else{this.getRouter().navTo("appHome",{},true)}},onCreate:function(){var e=this;var i=this.getView().getModel("dataModel");var a=this.byId("country").getSelectedItem().getKey();var o={Netherlands:1,India:2,Singapore:3};var s=o[a];var n={ID:parseInt(this.byId("Id").getValue()),fname:this.byId("fname").getValue(),lname:this.byId("lname").getValue(),desig:this.byId("desig").getValue(),email:this.byId("email").getValue(),skills:this.byId("skills").getValue(),country_ID:s,State:this.byId("idstate").getValue(),city:this.byId("idcity").getValue(),doj:this.byId("myDatePicker").getValue(),yoe:parseInt(this.byId("yoe").getValue(),32),gender:this.byId("genderRadioGroup").getSelectedButton().getText()};$.ajax({contentType:"application/json",type:"POST",url:"../../CatalogService/Employees",dataType:"json",crossDomain:true,data:JSON.stringify(n),success:function(i){t.success("Employee data saved successfully!");e.clearFormFields()},error:function(e){t.error("Error while saving employee data")}})},clearFormFields:function(){const e=["Id","fname","lname","desig","email","skills","idstate","idcity","myDatePicker","yoe"];const t=this.byId("genderRadioGroup");e.forEach(e=>{const t=this.byId(e);if(t){t.setValue("")}});if(t){t.setSelectedButton(null)}},onCancel:function(){var e=sap.ui.core.UIComponent.getRouterFor(this);e.navTo("View2")}})});