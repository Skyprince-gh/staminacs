const organizer = (dataArr) => {
  const object = {};
  dataArr[0].forEach((column,index) => {
    const arr = [];
    dataArr.forEach((row, idx) => {
      if(idx !== 0){
        arr.push(row[index] || "");
      }
    })

    object[column] = arr;
  })

  return object;
};

export default organizer;
