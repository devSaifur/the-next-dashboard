const AuthLayout = ({ children }: React.ComponentProps<'main'>) => {
  return (
    <main className="flex min-h-screen items-center justify-center text-black">
      {children}
    </main>
  )
}

export default AuthLayout
