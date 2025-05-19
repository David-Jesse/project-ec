import LoginForm from "@/component/loginForm/LoginForm"

export const metadata = {
    title: "Login - Flowmazon",
    description: "Sign in to your Flowmazon account",
}

const LoginPage = () => {


  return (
    <div className="container mx-auto px-4 py-6 sm:py-10">
        <LoginForm />
    </div>
  )
}

export default LoginPage