import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { useRegisterMutation } from "@/store/api/auth";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { setToken, setUser } from "@/store/slices/authSlice";
import { toast } from "sonner";
import { errorHandler } from "@/utils/errorHandler";

const RegisterFormSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Invalid email, make sure the email is in the correct format",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});

export const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(RegisterFormSchema),
  });

  async function onSubmit(values: z.infer<typeof RegisterFormSchema>) {
    try {
      const response = await registerUser({
        email: values.email,
        password: values.password,
        name: values.name,
        playlists: [],
      }).unwrap();

      dispatch(setUser(response.data.user));
      dispatch(setToken(response.data.token));
      navigate("/");
    } catch (err: any) {
      errorHandler.logError(err, "Registration");
      toast.error(err?.data?.message || "Registration failed");
    }
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl text-center font-bold">
        Sign up to start listing
      </h1>

      <Form {...form}>
        <form
          className="max-w-sm mx-auto mt-6 sm:mt-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mb-4 sm:mb-5">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-4 sm:mb-5">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@domain.com" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Create new password (min. 8 characters)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant={"theme"}
            size={"lg"}
            shape={"rounded"}
            className="w-full mt-6 sm:mt-8"
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </form>
      </Form>
      <p className="mt-8 sm:mt-10 text-center text-sm sm:text-base">
        Already have an account?{" "}
        <Link to={"/auth/login"} className="underline text-theme">
          Log in here.
        </Link>
      </p>
    </div>
  );
};
