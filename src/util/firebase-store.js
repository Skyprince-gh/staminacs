import { initializeApp } from "firebase/app";
import {
  getFirestore,
  setDoc,
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { firebaseCredentials } from "../keys";
import { getStorage } from "firebase/storage";

// Initialize Firebase
const app = initializeApp(firebaseCredentials);

export const db = getFirestore(app);
export const storage = getStorage(app)

export const getDocumentByID = async (...path) => {
  const docRef = doc(db, ...path);

  const docSnap = await getDoc(docRef);

  return docSnap;
};

export const getAllDocuments = async (...path) => {
  const ref = collection(db, ...path);
  const q = query(ref)
  const snapshot = await getDocs(q)

const dataArr = [];
snapshot.forEach(doc => {
    dataArr.push(doc.data());
});
 return dataArr;
}

export const setDocument = async (data, ...path) => {
  const response = await setDoc(doc(db, ...path), data);

  return response;
};

export const updateDocument = async (data, ...path) => {
  const documentRef = doc(db, ...path);

  await updateDoc(documentRef, data);
};

export const deleteDocument = async (...path) => {
  deleteDoc(doc(db, ...path));
};

export const queryByProperty = async (property, arr, ...path) => {
  const ref = collection(db, ...path);

  const q = query(ref, where(property, "in", arr.slice(0, 9)));

  const querySnapshot = await getDocs(q);
  const bulkData = [];
  querySnapshot.forEach((doc) => {
    bulkData.push(doc.data());
  });

  return bulkData;
};



