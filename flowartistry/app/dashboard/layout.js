import NavBar from "../components/navbar";


export default function DashboardLayout({
    children, 
  }) {
    return (
      <section className='bg-hero min-h-screen'>
        <NavBar/>
        {children}
      </section>
    )
  }