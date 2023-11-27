const generateArrayOfYears = (numberOfYears) => {
  var max = new Date().getFullYear();
  var min = max - numberOfYears;
  var years = [];

  for (var i = max; i >= min; i--) {
    years.push(i);
  }
  return years;
}

export default generateArrayOfYears;
