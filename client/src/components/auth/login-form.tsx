import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
import { LoginUser } from "@shared/schema";

interface LoginFormProps {
  onSubmit: (data: LoginUser) => void;
  isPending: boolean;
}

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

export function LoginForm({ onSubmit, isPending }: LoginFormProps) {
  const [rememberMe, setRememberMe] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      remember: false,
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const loginData: LoginUser = {
      username: values.username,
      password: values.password
    };
    
    onSubmit(loginData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-white/80 text-sm mb-1">Username</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="your username"
                  className="w-full bg-white/20 rounded-lg px-4 py-3 text-white border border-white/10 focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                />
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
              <FormLabel className="block text-white/80 text-sm mb-1">Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/20 rounded-lg px-4 py-3 text-white border border-white/10 focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </FormControl>
              <div className="flex justify-end">
                <a href="#" className="text-sm text-secondary mt-1">Forgot password?</a>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <label className="flex items-center text-white/80 text-sm">
            <Checkbox 
              checked={rememberMe} 
              onCheckedChange={(checked) => setRememberMe(checked as boolean)} 
              className="rounded text-secondary mr-2" 
            />
            Remember me
          </label>
        </div>
        <Button 
          type="submit" 
          className="w-full bg-secondary hover:bg-secondary/90 text-primary font-medium py-3 px-4 rounded-lg transition-all duration-300"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-white/70 text-sm">Or continue with</p>
        <div className="flex justify-center space-x-4 mt-3">
          <Button variant="outline" size="icon" className="bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all border-0">
            <FaGoogle className="text-lg" />
          </Button>
          <Button variant="outline" size="icon" className="bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all border-0">
            <FaFacebookF className="text-lg" />
          </Button>
          <Button variant="outline" size="icon" className="bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all border-0">
            <FaApple className="text-lg" />
          </Button>
        </div>
      </div>
    </Form>
  );
}
