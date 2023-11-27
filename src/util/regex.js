const regex = {
  firstName: /^([A-Za-z]{2,29})[\s]{0,}?$/,
  lastName: /^([A-Za-z]{2,29})[\s]?([A-Za-z]{2,29})?[\s]{0,}?$/,
  email: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
  address: /^[-\w ,()]{0,100}$/,
  businessName: /^.{5,100}$/,
  phone: /^\d{10,15}$/,
  zipCode: /^[0-9]{0,5}$/,
  description: /.{10,255}/,
  userName: /[a-z\d-]/,
  password: /^.{8,}$/,
};

export default regex;
