# Custom Columns

**Custom columns** is a way to add or remove some columns from a datagrid. It can be very useful to view a property for every records. Every datagrid have this powerful feature.

## How to use it?

To use custom columns, you have to click on the **Add Columns** button.

![Button to open the modal to add columns](./assets/add-columns.png)

Then, a modal will be displayed with an input field. You've just to type the name of the property you want to add.

::: tip
You can use dot notation to access to nested properties. For example, if you want to display the `Name` property of the `Application` property, you have to type `Application.Name`.
:::

![Modal with input to add a custom column](./assets/add-columns-modal.png)

Then, you can validate by clicking on the **Add** button. A new column will be added to the datagrid.

::: warning
If there is no data in the datagrid, the column will be added but not displayed.
:::

If the property exists, it will be added shown. If not, a simple `-` will be displayed.

![Datagrid view with some custom columns](./assets/add-columns-result.png)

::: warning
Currently, you won't be able to sort or filter on custom columns.
:::

## How to remove a column?

To remove a column, you have to click on the **Remove Columns** button.

![Button to open the modal to remove columns](./assets/remove-columns.png)

Then, a modal will be displayed with a list of all the columns. You've just to remove every columns you don't want to see.

![Modal with the custom columns list](./assets/remove-columns-modal.png)
