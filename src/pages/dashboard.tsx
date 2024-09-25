import Navbar from "@/components/navbar";
import Table from "@/components/ui/table";
import { auth, db } from "@/firebase";
import { DataList } from "@/lib/utils";
import { signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [user, loading] = useAuthState(auth);
  const [users, setUsers] = useState<DataList>([]);
  const [status, setStatus] = useState(null); // State to store user's status
  const [name, setName] = useState(""); // State to store user's status

  const navigate = useNavigate();

  // update userlist
  const updateUsers = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userList: any = [];
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      if (doc.id === user?.uid) {
        setStatus(doc.data().status);
        setName(doc.data().name)
      }
      userList.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    setUsers(userList);
  };

  useEffect(() => {
    updateUsers();
  }, []);

  // check status
  useEffect(() => {
    if (status === false) {
      signOut(auth)
        .then(() => {
          // Sign-out successful
          navigate("/login");
          window.alert("Someone blocked you");
        })
        .catch((error) => {
          console.error("Error during sign out:", error);
        });
      // Redirect if the user's status is inactive
    }
  }, [status, navigate]);

  if (!loading && !user?.email) navigate("/login");

  return (
    <div className="pt-20 w-full overflow-hidden">
      <Navbar username={name} />
      <Table data={users} updateUsers={updateUsers} />
    </div>
  );
};

export default DashboardPage;
