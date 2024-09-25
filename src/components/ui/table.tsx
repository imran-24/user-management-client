import { DataList } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Check, Copy, Loader2, Shield, Trash2 } from "lucide-react";
import { Button } from "./button";
import { useState } from "react";
import { Checkbox } from "./checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ShieldBan } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDistanceToNow } from 'date-fns'

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import axios from "axios";
import { getDeleteUserById } from "@/actions/get-delete-user";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

type TableProps = {
  data: DataList;
  updateUsers: () => void;
};

const Table = ({ data, updateUsers }: TableProps) => {
  const [copied, setCopied] = useState("");
  const [user] = useAuthState(auth);
  const [blocking, setBlocking] = useState(false);
  const [unBlocking, setUnblocking] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: [],
    },
  });

  const list = form.watch("items");

  // block account function
  const updateStatus = async (status: string) => {
    try {
      if (status === "block") setBlocking(true);
      else setUnblocking(true);
      for (const user of list) {
        const docRef = doc(db, "users", user); // Assuming each user has an 'id'
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          await updateDoc(docRef, {
            status: status !== "block" ? true : false, // Update status field
          });
          console.log(`User ${docSnap.data().name} updated.`);
        }
      }
      setBlocking(false);
      setUnblocking(false);
      updateUsers();
    } catch (error) {
      setBlocking(false);
      setUnblocking(false);
      console.error("Error updating users:", error);
    }
  };

  const onCopy = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevent the default action (e.g., form submission, page reload)
    e.stopPropagation(); // Stop event propagation
    navigator.clipboard.writeText(id);
    setCopied(id);

    setTimeout(() => {
      setCopied("");
    }, 1000);
  };

  const baseURL = import.meta.env.VITE_REACT_SERVER_URL;

  function logOut() {
    signOut(auth)
      .then(() => {
        // Sign-out successful
        navigate("/login");
        console.log("User signed out");
      })
      .catch((error) => {
        console.error("Error during sign out:", error);
      });
  }


  // account deletion
  const onDelete = async () => {
    if (!user) return;
    setDeleting(true);
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (userConfirmed) {
      for (const id of list) {
        try {
          await axios.delete(`${baseURL}/users/${id}`).then(async () => {
            await getDeleteUserById(id!).then(() => {
              setDeleting(false);
              window.alert("User deleted");
              if(id == user.uid){
                logOut()
              }
              updateUsers();
            });
          });
        } catch (error) {
          console.log(error);
          window.alert("Something went wrong");
          setDeleting(false);
        }
      }
    } else {
      setDeleting(false);
      console.log("User canceled the deletion");
    }
  };

  if (!data.length) {
    return (
      <div className="flex items-center justify-center space-x-3 w-full ">
        <p className="text-sm text-neutral-500">Loading data...</p>
        <Loader2 className="animate-spin h-4" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-end space-x-2 py-4 w-full max-w-5xl mx-auto overflow-x-auto">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => updateStatus("unblock")}
                disabled={list.length <= 0}
                variant={"ghost"}
                size={"icon"}
              >
                {unBlocking ? (
                  <Loader2 className="size-4 text-neutral-500 animate-spin" />
                ) : (
                  <ShieldBan size={20} />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Unblock user</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"ghost"}
                disabled={list.length <= 0}
                size={"icon"}
                onClick={onDelete}
              >
                {deleting ? (
                  <Loader2 className="size-4 text-neutral-500 animate-spin" />
                ) : (
                  <Trash2 size={20} className="text-rose-500" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete user</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button
          size={"sm"}
          onClick={() => updateStatus("block")}
          className="font-semibold py-1 rounded-lg border-2  text-xs  h-fit"
          disabled={list.length <= 0}
          variant={"destructive"}
        >
          {blocking ? "Blocking" : "Block"}
          {blocking ? (
            <Loader2 className="size-4 text-white animate-spin" />
          ) : (
            <Shield className="ml-1" size={16} />
          )}
        </Button>
      </div>

      <Form {...form}>
        <form className="space-y-8 w-full max-w-5xl mx-auto overflow-x-auto ">
          <table className="table-auto border-collapse border w-full border-gray-200 ">
            <thead className="bg-gray-100 text-xs sm:text-sm">
              <tr>
                <th className="px-3 py-2 text-left">
                  <FormField
                    control={form.control}
                    name="items"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.length === data.length}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([
                                    ...data.map((item) => item.id),
                                  ])
                                : field.onChange([]);
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </th>
                <th className="border p-3 text-xs tracking-tighter text-left">
                  Id
                </th>
                <th className="border p-3 text-xs tracking-tighter text-left">
                  Name
                </th>
                <th className="border p-3 text-xs tracking-tighter text-left">
                  Email
                </th>
                <th className="border p-3 text-xs tracking-tighter text-left">
                  Last login time
                </th>
                <th className="border p-3 text-xs tracking-tighter text-left">
                  Registration Time
                </th>
                <th className="border p-3 text-xs tracking-tighter text-left">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-3 py-2 text-xs truncate border-r">
                    <FormField
                      control={form.control}
                      name="items"
                      render={({ field }) => (
                        <FormItem className="">
                          <FormControl>
                            <Checkbox
                              checked={field?.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="px-3 py-2 text-xs truncate">
                    <Button
                      type="button"
                      onClick={(e: React.MouseEvent) => onCopy(e, item.id)}
                      variant={"ghost"}
                      size={"icon"}
                      className="h-8 "
                    >
                      {copied === item.id ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-neutral-500" />
                      )}
                    </Button>
                  </td>
                  <td className="px-3 py-2 text-xs truncate  max-w-40">
                    {item.name}
                  </td>
                  <td className="px-3 py-2 text-xs">{item.email}</td>
                  <td className="px-3 py-2 text-xs">
                  {item.updatedAt ? formatDistanceToNow(item.updatedAt?.toDate()) : "-"}
                  </td>
                  <td className="px-3 py-2 text-xs">
                  {item.createdAt ? formatDistanceToNow(item.createdAt?.toDate()) : "-"}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {item.status ? (
                      <Badge variant={"outline"}>
                        <p>Active</p>
                      </Badge>
                    ) : (
                      <Badge variant={"destructive"}>
                        <p>Blocked</p>
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>
      </Form>
    </>
  );
};

export default Table;
