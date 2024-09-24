import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "@/firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "password must be at least 8 characters.",
  }),
});

const LoginPage = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const updateUser = async (id: string) => {
    // reference of the document
    const docRef = doc(collection(db, "users"), id);
    // collections within the documents
    const docSnap = await getDoc(docRef);

    // if there exists collections in the documents
    if (docSnap.exists()) {
      if (!docSnap.data().status) {
        return signOut(auth)
          .then(() => {
            // Sign-out successful
            window.alert("Someone blocked your account");
            navigate("/login");
            console.log("User signed out");
          })
          .catch((error) => {
            console.error("Error during sign out:", error);
          });
      }
      await updateDoc(docRef, {
        updatedAt: serverTimestamp(),
      });
      navigate("/dashboard");
    }
  };

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.email || !values.password) {
      return;
    }
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        // Signed in successfully
        const user = userCredential.user;
        updateUser(user.uid!);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        window.alert(errorMessage);
        console.error("Error during sign in:", errorCode, errorMessage);
      });
  }

  if (user) navigate("/dashboard");

  return (
    <div className="w-full h-full flex items-center">
      <Card className="w-full max-w-md mx-auto p-4">
        <CardContent>
          <div className="space-y-8 ">
            <div className="">
              <h2 className="text-4xl font-semibold">Login</h2>
              <p className="text-neutral-500 text-sm ">Welcome back</p>
            </div>
            <div className="space-y-8 relative">
              <Button
                variant={"secondary"}
                size={"lg"}
                className="w-full h-12 rounded-lg"
              >
                <FcGoogle className="size-6" />
                <span className="ml-3 font-semibold">Sign in with Google</span>
              </Button>
              <div className="relative pb-4">
                <p className="text-gray-400 text-center text-xs bg-white w-fit px-2 absolute bottom-0 left-0 right-0 mx-auto  z-20 ">
                  Or continue with
                </p>
                <div className=" h-[1px] bg-gray-200 w-full  absolute bottom-2 z-10" />
              </div>
            </div>
            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input label="Enter email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input label="Enter password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    size={"lg"}
                    className="w-full h-12 rounded-lg"
                  >
                    Login
                  </Button>
                </form>
              </Form>
              <div className="space-y-8 mt-8 text-sm">
                <p>
                  Don't have an account?{" "}
                  <a
                    href="/register"
                    className="underline cursor-pointer font-medium"
                  >
                    Sing up
                  </a>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
