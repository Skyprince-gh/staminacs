## Objectives.

---

1. **_Create a feature for exporting Stamina Objects dynamically_**
   - <strike> Make options list and a relational column which will be text field. This list will relate each field in the stamina item to a column in the spreadsheet</strike>
   - Create a config object and functions to interpretate the related data.
  
   - <strike>Read XLSX docs on npm on how to put the data in column by column and create a generator function to do that.</strike>

   - Add a feature prompt that will ask wheather you want a **_.csv_** export or a **_.xlsx_** export.

   - Add another feature that will simply do a default export of all the  items in a standard spreadsheet if you do not input add any items in the object.

   - Add a prompt feature to check wheather specific and essential field have been placed in there.
2. **_Create a function that checks the validity of clover files before performing any operations on them._**

## Bugs and fixes

---

1. Create an updating indexes feature that starts anytime you start the app.
2. It simply goes through all the items in the store and updates them in their index file. Making sure the indexes are up to date and then store them in
   the session file.

3. Update the fetching of indexes feature and see to it that everything is working smoothly with search.
4. When the fetch is empty make sure nothing gets dispatched to stop the update bugs from working.

Discussion Topics.

1. Modifier groups. What to do with them. Are they linked to the items sheet using formulas?
   What happens when a modifier group is used in clover how is it represented on the sheet and how
   can we use them in stamina.

2. Tax Rates same as the modifier groups how do we link them.
