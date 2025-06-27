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
import { Link } from "react-router";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { setToken, setUser } from "@/store/slices/authSlice";
import { toast } from "sonner";
import { useLoginMutation } from "@/store/api/auth";
import { errorHandler } from "@/utils/errorHandler";

const LoginFormSchema = z.object({
  email: z.string().email({
    message: "Invalid email, make sure the email is in the correct format",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});

export const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loginUser, { isLoading }] = useLoginMutation();

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginFormSchema),
  });

  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    try {
      const response = await loginUser({
        email: values.email,
        password: values.password,
      }).unwrap();

      dispatch(setUser(response.data.user));
      dispatch(setToken(response.data.token));
    } catch (err: any) {
      errorHandler.logError(err, "Login");
      toast.error(err?.data?.message || "Login failed");
    }
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl text-center font-bold">
        Log in to Listify
      </h1>

      <Form {...form}>
        <form
          className="max-w-sm mx-auto mt-6 sm:mt-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
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
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
      <p className="mt-8 sm:mt-10 text-center text-sm sm:text-base">
        Don't have an account?{" "}
        <Link to={"/auth/register"} className="underline text-theme">
          Sign up for Listify
        </Link>
      </p>
    </div>
  );
};
