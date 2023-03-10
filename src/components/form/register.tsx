import React from "react";
import FormContainer from "./container";
import Input from "@/components/shared/input";
import Button from "@/components/shared/button";
import { useRouter } from "next/router";
import { trpc } from "@/lib/utils/trpc";
import { useForm, type SubmitHandler } from "react-hook-form";

type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
};

const RegisterForm = () => {
  const router = useRouter();

  const mutation = trpc.auth.register.useMutation({
    onError: (e) => console.log(e.message),
    onSuccess: () => router.push("/login"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  console.log(errors);

  const handleOnSubmit: SubmitHandler<FormValues> = async (data) => {
    await mutation.mutateAsync(data);
  };

  return (
    <FormContainer title="Welcome to Insider!" type="Create an Account">
      <form className="w-full" onSubmit={handleSubmit(handleOnSubmit)}>
        <Input
          {...register("firstName", { required: true })}
          type="text"
          placeholder="FirstName"
        />
        <Input
          {...register("lastName", { required: true })}
          type="text"
          placeholder="LastName"
        />
        <Input
          {...register("email", { required: true })}
          type="email"
          placeholder="Email"
        />
        <Input
          {...register("password", { required: true })}
          type="password"
          placeholder="Password"
        />
        <Input
          {...register("confirmPassword", { required: true })}
          type="password"
          placeholder="Confirm Password"
        />
        <Button type="submit">Submit</Button>
      </form>
    </FormContainer>
  );
};

export default RegisterForm;
