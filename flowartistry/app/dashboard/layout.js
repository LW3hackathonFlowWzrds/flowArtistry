import NavBar from "../components/navbar";


export default function DashboardLayout({
    children, 
  }) {
    return (
      <section class='bg-hero min-h-screen'>
        <NavBar/>
        {children}
      </section>
    )
  }