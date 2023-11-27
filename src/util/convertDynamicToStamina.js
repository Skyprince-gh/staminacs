import FormDataObject from "./Data-Objects/formDataObject";
import { RETURN_PROPERTY_NAMES_FROM_STRING as returnPropNames } from "./returnPropertyNamesFromString";

//This function is responsible for reading the organized file data from dynamic files and then converting them to stamina
// item objects which can be read and processed in the app.
export const Convert_Dynamic_Files_To_Stamina = (
  sheet_Object, //takes the sheet object which is the organized xlsx data.
  dynamic_Configuration, // takes the dynamic configuration for the data recieved
  properties //takes the properties array which contains all the properties that can be configured on the dynamic menu.
) => {
  let set = new Set(); //set object which is local to the function. Stores all the item objeccs after they have been created
  properties.forEach((property) => {
    const hasProperty = dynamic_Configuration.hasOwnProperty(property); //check if the current property is in the config object.

    //if one of the stamina item properties is contained in the dynamic configuration?
    if (hasProperty) {
      const configProp = dynamic_Configuration[property]; //get the object value associated with that property.

      sheet_Object.forEach((sheet, index) => {
        //iterate through the sheet object
        //if the value you are looking for. e.g A sheet matches a value in a dynamic config object
        if (
          sheet.name === configProp.name &&
          property.trim().toLowerCase() === "name" // if said valie is a "Name" property.
        ) {
          //get all the data in that sheet object with that name. i.e all the data in that column if it was an xlsx file.
          const values = sheet.data[configProp.value];

          //iterate through the values you got and create stamina item objects using their names
          values.forEach((val) => {
            const item = new FormDataObject();
            item.name = val;
            set.add(item); // add the new item you created to the set.
          });
        }
        //if the sheet name matches a different property configuration
        if (sheet.name === configProp.name) {
          const values = sheet.data[configProp.value]; //get all the values associated with that column in the sheet.
          let arr = [...set]; //spread the set into an array to make it easier to access by index

          //iterate through the values
          values.forEach((val, index) => {
            const propName = returnPropNames(property); // convert the stamina property name to one that matches the stamina item object property name
            const item = arr[index]; //retrieve item objects by index
            console.log("item index:", arr[index]);
            item[propName] = val; //assign the value by the property name relation in the stamina item object
            arr[index] = item; // reassign the item into the array by index.
          });

          set = new Set(arr); // after iteration pass the entire array into a set.
        }
      });
    }
  });

  return [...set]; //return an array value containing the form Objects.
};

export default Convert_Dynamic_Files_To_Stamina;


//Note that in the future data may need to be validated before it passes out of this function.
//All code concerning data validation needs to be written here.