sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/ColumnListItem",
    "sap/m/Input"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("project1.controller.View", {

        onInit: function () {
            this._oTable = this.byId("bookTable"); 
            this._oEditContext = null; // Track edit context
        },

        onCreate: function () {
            this._oEditContext = null; 
            this.getView().byId("OpenDialog").open();
        },

        onClose: function (oEvent) {
            oEvent.getSource().getParent().close();
        },

        onSave: function () {
            var oID = this.getView().byId("inpID").getValue();
            var oTitle = this.getView().byId("inpTitle").getValue();
            var oAuthor = this.getView().byId("inpAuthor").getValue();
            var oPrice = this.getView().byId("inpPrice").getValue();


            if (oTitle === "" || oAuthor === "" || oPrice === "") {
                MessageToast.show("All fields are required.");
                return;
            }

            const oList = this._oTable; //this otable in abive we grt through an booktable id 
            console.log(this._oTable);
            console.log(oList);
            const oBinding = oList.getBinding("items");
            console.log(oBinding);

            if (this._oEditContext) {
                // **Update Existing Entry**
                this._oEditContext.setProperty("ID", oID);
                this._oEditContext.setProperty("title", oTitle);
                this._oEditContext.setProperty("author", oAuthor);
                this._oEditContext.setProperty("price", oPrice);
                MessageToast.show("Book details updated successfully.");
            } else {
                // **Create New Entry**
                //in an oBinding we get the data of table by binding them using an model
                oBinding.create({
                    "ID": oID,
                    "title": oTitle,
                    "author": oAuthor,
                    "price": oPrice
                });
                
                MessageToast.show("New book added successfully.");
            }

            this.getView().byId("OpenDialog").close();
        },

        onEditMode: function () {
            var oTable = this.byId("bookTable");
            var oSelected = oTable.getSelectedItem();

            if (!oSelected) {
                MessageToast.show("Please select a row to edit.");
                return;
            }

            var oContext = oSelected.getBindingContext();
            if (!oContext) {
                MessageToast.show("Error: No binding context found.");
                return;
            }

            var oSelectedData = oContext.getObject();
            this._oEditContext = oContext; // **Store context for editing**

            // Open Dialog and Pre-Fill Fields
            if (!this._oDialog) {
                this._oDialog = this.getView().byId("OpenDialog");
            }

            this.byId("inpID").setValue(oSelectedData.ID);
            this.byId("inpTitle").setValue(oSelectedData.title);
            this.byId("inpAuthor").setValue(oSelectedData.author);
            this.byId("inpPrice").setValue(oSelectedData.price);

            // Change button text
            // var oSaveButton = this.byId("saveButton") || sap.ui.getCore().byId(this.getView().createId("saveButton"));
            // if (oSaveButton) {
            //     oSaveButton.setText("Update");
            // }

            this._oDialog.open();
        },

        onDelete: function () {
            var oTable = this.byId("bookTable");
            var oSelected = oTable.getSelectedItem();

            if (!oSelected) {
                MessageToast.show("Select a row to delete");
                return;
            }

            var oContext = oSelected.getBindingContext(); //get bindingcontext returns an specific model data
            console.log(oContext);
            if (oContext) {
                var oBookID = oContext.getObject().ID;
                oContext.delete("$auto").then(
                    function () {
                        MessageToast.show("Book with ID " + oBookID + " successfully deleted");
                    }.bind(this),
                    function (oError) {
                        MessageToast.show("Error: " + oError.message);
                    }
                );
            }
        },

        onMigrate: function () {
            var oTable = this.byId("bookTable"); // Find the table in the view
            var oSelected = oTable.getSelectedItem(); // Get the selected row
        
            //   Check if an item is selected
            if (!oSelected) {
                MessageToast.show("Please select a record to migrate");
                return; // Stop execution if no selection
            }
        
            var oContext = oSelected.getBindingContext(); // Get binding context
        
            //   Check if binding context exists
            if (!oContext) {
                MessageToast.show("No binding context found!");
                return;
            }
        
            var oData = oContext.getObject();
            console.log(oData) // Get selected row's data
            var that = this;
        
            //   Use Axios to call the migration function in backend
            axios.post("/odata/v4/app/migrateData", { ID: oData.ID })
                .then(function (response) {
                    MessageToast.show(response.data.value); // Show success message
                    console.log("Migration Response:", response.data);
                    that.getView().getModel().refresh(); // Refresh the UI
                })
                .catch(function (error) {
                    MessageToast.show("Error: " + error.message);
                    console.error("Migration Error:", error);
                });
                //navi to enthapage
        }
        
    });

});
