import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type AuthFormProps = {
  type: "login" | "signUp";
};
export default function AuthForm({ type }: AuthFormProps) {
  return (
    <form>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" />
      </div>
      <div className=" mb-4 mt-2 space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" />
      </div>

      <Button>{type === "login" ? "Login" : "Sign Up"}</Button>
    </form>
  );
}
