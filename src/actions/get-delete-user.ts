import { db } from "@/firebase";
import { deleteDoc, doc } from "firebase/firestore";

export const getDeleteUserById = async (id: string) => {
  try {
    const docRef = doc(db, "users", id);
    await deleteDoc(docRef).then((doc) => {
      return doc;
    });
  } catch (error) {
    console.error("Error deleting document:", error);
  }
};


