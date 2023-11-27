//this module contains functions that help you extract items in that have
//been selected into a separate array.

const extractSelectedItems = (itemList, items) => {
  const selected = items.filter((item) => {
    let i = ""
    itemList.forEach(id => {       
      if (item.id === id ) {
        i = item
      }
    })

    if(i !== ""){
      return true
    }
  });

  // console.log("Item List:", itemList);

  return selected;
  // return []
};

export default extractSelectedItems;
