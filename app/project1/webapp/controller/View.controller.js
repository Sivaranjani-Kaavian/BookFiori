sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/ColumnListItem",
    "sap/m/Input"
], function (Controller, MessageToast, ColumnListItem, Input) {
    "use strict";

    return Controller.extend("project1.controller.View", {

        onInit: function () {
            this._oTable = this.byId("bookTable");
            this._oEditContext = null; // Track edit context
        },

        onCreate: function () {
            this._oEditContext = null; // Reset edit mode
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

            const oList = this._oTable;
            const oBinding = oList.getBinding("items");

            if (this._oEditContext) {
                // **Update Existing Entry**
                this._oEditContext.setProperty("ID", oID);
                this._oEditContext.setProperty("title", oTitle);
                this._oEditContext.setProperty("author", oAuthor);
                this._oEditContext.setProperty("price", oPrice);
                MessageToast.show("Book details updated successfully.");
            } else {
                // **Create New Entry**
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
            var oSaveButton = this.byId("saveButton") || sap.ui.getCore().byId(this.getView().createId("saveButton"));
            if (oSaveButton) {
                oSaveButton.setText("Update");
            }

            this._oDialog.open();
        },

        onDelete: function () {
            var oTable = this.byId("bookTable");
            var oSelected = oTable.getSelectedItem();

            if (!oSelected) {
                MessageToast.show("Select a row to delete");
                return;
            }

            var oContext = oSelected.getBindingContext();
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
        }
    });

});
