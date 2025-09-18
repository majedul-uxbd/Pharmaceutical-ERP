"use client";
import * as z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
import { authenticate } from "@/app/api/actions";
import { useRouter } from "next/navigation";
import { LoginSchema } from "@/schema/auth.schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Module } from "@/interfaces/module.interface";

interface LoginFormCardProps {
  session: any;
}
export const LoginForm = ({ session }: LoginFormCardProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [module, setModule] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      module_name: "",
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (session) {
      router.push(`/dashboard`);
    }
  }, [session, router]);

  const getModule = async () => {
    const response = await fetch(

      `${process.env.NEXT_PUBLIC_API_URL}/common/get-module`,
      {
        method: 'GET',
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      // setTotalPage(() => pageCount);
      setModule(() => responseData.data as Module[]);
      setIsLoading(false);
    }
    else {
      console.error("fetch req failed: ", response)
    }
  };

  useEffect(() => {
    getModule();
  }, []);

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    // console.log("file: login-form.tsx:39 ~ onSubmit ~ values:", values);
    const formData = new FormData();
    formData.append("module_name", values.module_name);
    formData.append("username", values.username);
    formData.append("password", values.password);

    startTransition(async () => {
      try {
        // setErrorMessage(null);
        const error = await authenticate(undefined, formData);
        if (!error) {
        } else {
          // console.log("file: login-form.tsx:51 ~startTransition ~ error:", error);
          toast.error(error);
        }
      } catch (err) {

      }
    });

  };

  return (
    <>
      {isLoading ? (
        <div className="flex h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="animate-spin" />
            <span className="text-xl">Loading...</span>
          </div>
        </div>

      ) : (
        <div className="mb-10 mt-10">
          <CardWrapper
            headerLabel="Welcome Back"
            backButtonLabel="Don't have an account? Please contact with Admin"
            backButtonHref=""
            showSocial
          >
            {/* Module input field  */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  {/* Dropdown (Select) Field */}
                  <FormField
                    control={form.control}
                    name="module_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Module Name</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a module" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {module.map((mod) => (
                              <SelectItem key={mod.id} value={mod.module_id}>
                                {mod.module_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Username input field  */}
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="username"
                            placeholder="Enter your username"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="******"
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="absolute inset-y-0 right-0 flex items-center px-2 focus:outline-hidden"
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </Form>
          </CardWrapper>
        </div >
      )}
    </>
  );
};
