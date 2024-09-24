import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

const getAuth = async (id: string | undefined) => {
  if(!id) return null;
  try {
    const docRef = doc(db, "users", id); // Assuming each user has an 'id'
    const docSnap = await getDoc(docRef);
    const user = docSnap.data();
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default getAuth;
