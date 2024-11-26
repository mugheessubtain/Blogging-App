import AuthProtectedRoutes2 from "@/HOC/AuthProRoutes";

export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){
    return(
        <AuthProtectedRoutes2>
            {children}
        </AuthProtectedRoutes2>
    )
}