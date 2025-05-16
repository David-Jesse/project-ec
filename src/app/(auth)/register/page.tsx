import RegisterForm from "@/component/registerForm/RegisterForm";

export const metadata = {
    title: "Create an account - Flowmazon",
    description: "Create a new Flowmazon account"
}


export default function RegisterPage() {
    return (
        <div className="mx-auto px-4 py-6 sm:py-10">
            <RegisterForm />
        </div>
    )
}