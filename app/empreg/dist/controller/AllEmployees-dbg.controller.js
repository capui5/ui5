sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
    "sap/ui/core/routing/History",
  ],
  function (e, t, a, o) {
    "use strict";
    return e.extend("empreg.controller.AllEmployees", {
      onInit: function () {
        this.oList = this.byId("employeelist");
        this.oDataModel = this.getOwnerComponent().getModel();
        this.getView().setModel(this.oDataModel);
      },
      getRouter: function () {
        return t.getRouterFor(this);
      },
      onNavBack: function () {
        var e, t;
        e = o.getInstance();
        t = e.getPreviousHash();
        if (t !== undefined) {
          window.history.go(-1);
        } else {
          this.getRouter().navTo("View1", {}, true);
        }
      },
      onAdvancedSearch: function (e) {
        var t = e.getParameter("newValue");
        var a = this.getView().byId("employeelist");
        var o = a.getBinding("items");
        if (o) {
          var r = [];
          var i = t.toLowerCase();
          var s = [
            {
              term: ["cap"],
              matches: [
                "cloud",
                "cloud development",
                "cloud application programming",
                "cloud application programming model",
                "capm",
              ],
            },
            { term: ["javascript"], matches: ["react", "node.js"] },
            { term: ["azure"], matches: ["devops", "aws", "azure"] },
            {
              term: ["frontend developer"],
              matches: [
                "html",
                "css",
                "Angular",
                "Fullstack",
                "react.js",
                "vue.js",
                "javascript",
                "wordpress",
                "Fiori",
              ],
            },
            {
              term: ["backend developer"],
              matches: [
                "ABAP",
                "node js",
                "java",
                "Fullstack",
                "python",
                "c",
                "capm",
                "cap",
                "cloud",
                "cloud development",
                "cloud application programming",
                "cloud application programming model",
                "sql",
                "hana database",
                "php",
              ],
            },
            { term: ["data science"], matches: ["Phyton", "Data engineer"] },
            {
              term: ["solution Architect"],
              matches: ["agile", "cloud computing"],
            },
          ];
          s.forEach(function (e) {
            if (e.term.includes(i)) {
              e.matches.forEach(function (e) {
                var t = new sap.ui.model.Filter({
                  path: "skills",
                  operator: sap.ui.model.FilterOperator.Contains,
                  value1: e,
                  caseSensitive: false,
                });
                r.push(t);
              });
            }
          });
          if (r.length === 0) {
            var n = new sap.ui.model.Filter({
              path: "skills",
              operator: sap.ui.model.FilterOperator.Contains,
              value1: t,
              caseSensitive: false,
            });
            r.push(n);
          }
          var l = new sap.ui.model.Filter({
            path: "fname",
            operator: sap.ui.model.FilterOperator.Contains,
            value1: t,
            caseSensitive: false,
          });
          var p = new sap.ui.model.Filter({
            path: "lname",
            operator: sap.ui.model.FilterOperator.Contains,
            value1: t,
            caseSensitive: false,
          });
          var c = new sap.ui.model.Filter({
            path: "desig",
            operator: sap.ui.model.FilterOperator.Contains,
            value1: t,
            caseSensitive: false,
          });
          var u = new sap.ui.model.Filter({
            path: "email",
            operator: sap.ui.model.FilterOperator.Contains,
            value1: t,
            caseSensitive: false,
          });
          var m = new sap.ui.model.Filter({
            path: "country/name",
            operator: sap.ui.model.FilterOperator.Contains,
            value1: t,
            caseSensitive: false,
          });
          r.push(l, p, c, u, m);
          var d = new sap.ui.model.Filter({ filters: r, and: false });
          o.filter(d);
        }
      },
      onaddnewemployee: function () {
        var e = this.getOwnerComponent().getRouter();
        e.navTo("View5");
      },
      onDeleteSpecificRecord: function (e, t) {
        var o = t.ID;
        var r = this;
        $.ajax({
          url: "../../CatalogService/Employees/" + o,
          method: "DELETE",
          success: function () {
            a.success("Employee deleted successfully.", {
              onClose: function () {
                window.location.reload();
              },
            });
            var t = e.getModel("dataModel");
            var r = t.getProperty("/Employees");
            for (var i = 0; i < r.length; i++) {
              if (r[i].ID === o) {
                r.splice(i, 1);
                t.setProperty("/Employees", r);
                e.getModel().refresh(true);
                break;
              }
            }
          },
          error: function () {
            a.error("Error deleting employee.");
          },
        });
      },
      onListItemPress: function (e) {
        console.log("clicked");
        var listItem = e.getSource(); // Get the list item that triggered the event
        
        if (listItem) {
            var bindingContext = listItem.getBindingContext("MainModel");
            if (bindingContext) {
                var employeeId = bindingContext.getProperty("ID");
                var router = sap.ui.core.UIComponent.getRouterFor(this);
                router.navTo("View9", { SEmployeeId: employeeId });
            } else {
                console.error("Binding context is not available.");
            }
        } else {
            console.error("List item is not available.");
        }
    }
    
    
    });
  }
);
