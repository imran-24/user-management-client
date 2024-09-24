import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

// import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "password must be at least 8 characters.",
  }),
});

const RegisterPage = () => {
  // const [user] = useAuthState(auth);
  // const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // useEffect(() => {
  //   if (user) navigate("/dashboard");
  // }, [navigate, user]);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(async (userCredential) => {
        // Signed up successfully

        try {
          const docRef = doc(db, "users", userCredential.user.uid!);

          // Set the document with the custom ID (email)
          await setDoc(docRef, {
            name: values.username,
            email: userCredential.user.email,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            status: true,
          }, { merge: true });
          console.log("User signed up");
        } catch (error) {
          console.error("Error setting document:", error);
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error during sign up:", errorCode, errorMessage);
      });
  }

  return (
    <div className="w-full h-full flex items-center">
      <Card className="w-full max-w-md mx-auto p-4">
        <CardContent>
          <div className="space-y-8 w-full max-w-xs mx-auto ">
            <div className="">
              <h2 className="text-4xl font-semibold">Sign up</h2>
              <p className="text-neutral-500 text-sm tracking-wider">
                Create you account
              </p>
            </div>
            <div className="space-y-8 relative">
              <Button
                variant={"secondary"}
                size={"lg"}
                className="w-full h-12 rounded-lg"
              >
                <FcGoogle className="size-6" />
                <span className="ml-3 font-semibold">Sign up with Google</span>
              </Button>
              <div className="relative pb-4">
                <p className="text-gray-400 text-center text-xs bg-white w-fit px-2 absolute bottom-0 left-0 right-0 mx-auto  z-20 ">
                  Or continue with
                </p>
                <div className=" h-[1px] bg-gray-200 w-full  absolute bottom-2 z-10" />
              </div>
            </div>
            <div></div>
            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input label="Enter username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                    Sign Up
                  </Button>
                </form>
              </Form>
              <div className="space-y-8 mt-8 text-sm">
                <p>
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="underline cursor-pointer font-medium"
                  >
                    Login
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

export default RegisterPage;
