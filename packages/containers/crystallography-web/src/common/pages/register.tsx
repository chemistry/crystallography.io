import * as React from "react";
import { useForm } from "react-hook-form";

export const RegisterPage = () => {
  const { register, handleSubmit } = useForm();
  // tslint:disable-next-line
  const onSubmit = (data: any) => {
  };
  return (
      <>
        <h1>Register</h1>
        <hr/>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ padding: "20px" }}>
            <div >Name:
              <input type="text"  name="name" ref={register} />
            </div>
            <div >Email:
              <input type="text"  name="email" ref={register} />
            </div>
            <div>Pwd:
              <input type="text" name="password" ref={register}  />
            </div>
            <div>
              <input type="submit" name="Submit" />
            </div>
          </div>
        </form>
      </>
  );
};
